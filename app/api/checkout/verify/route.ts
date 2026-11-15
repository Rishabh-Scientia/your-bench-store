import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      customer,
      address,
      items,
      subtotal,
      shippingFee,
      totalAmount,
      userId,
    } = await req.json();

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keySecret) {
      return NextResponse.json(
        { success: false, error: "Razorpay secret key not configured" },
        { status: 500 }
      );
    }

    // 1. Verify Razorpay Payment Signature
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.error("Signature mismatch:", { expectedSignature, razorpay_signature });
      return NextResponse.json(
        { success: false, error: "Payment verification failed: invalid signature" },
        { status: 400 }
      );
    }

    // 2. Generate YourBench Order ID (e.g. YB-20261115-4821)
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, "");
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const ybOrderId = `YB-${dateStr}-${randomSuffix}`;

    // 3. Connect to Supabase
    let supabase;
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      supabase = createAdminClient();
    } else {
      const url =
        process.env.NEXT_PUBLIC_SUPABASE_URL ||
        process.env.supabase_Project_url ||
        "";
      const key =
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
        process.env.supabase_Publishable_Key ||
        "";
      if (url && key) {
        supabase = createClient(url, key);
      }
    }

    if (!supabase) {
      return NextResponse.json(
        { success: false, error: "Database client unavailable" },
        { status: 500 }
      );
    }

    // 4. Insert into public.orders table
    const orderPayload: any = {
      id: ybOrderId,
      customer_name: customer.fullName,
      customer_phone: customer.phone,
      customer_email: customer.email,
      shipping_address: address,
      status: "paid",
      subtotal: Number(subtotal),
      shipping_fee: Number(shippingFee),
      total_amount: Number(totalAmount),
      razorpay_order_id,
      razorpay_payment_id,
      tracking_number: null,
      notes: "Printed on order. Hand over to India Post Speed Post.",
    };

    if (userId) {
      orderPayload.user_id = userId;
    }

    let { error: orderError } = await supabase
      .from("orders")
      .insert(orderPayload);

    // If insertion failed because user_id column doesn't exist yet, retry without user_id
    if (orderError && orderPayload.user_id) {
      console.warn("Retrying order insert without user_id:", orderError.message);
      delete orderPayload.user_id;
      const retryResult = await supabase.from("orders").insert(orderPayload);
      orderError = retryResult.error;
    }

    if (orderError) {
      console.error("Failed to insert order into Supabase:", orderError);
      return NextResponse.json(
        {
          success: false,
          error: `Payment received but order record creation failed: ${orderError.message}`,
          paymentId: razorpay_payment_id,
        },
        { status: 500 }
      );
    }

    // 5. Insert order items
    if (items && Array.isArray(items) && items.length > 0) {
      const itemsPayload = items.map((it: any) => ({
        order_id: ybOrderId,
        book_id: it.bookId || null,
        title: it.title,
        author: it.author || "YourBench Author",
        cover_url: it.coverUrl || "",
        price: Number(it.price),
        quantity: Number(it.quantity || 1),
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(itemsPayload);

      if (itemsError) {
        console.error("Failed to insert order items:", itemsError);
      }
    }

    return NextResponse.json({
      success: true,
      orderId: ybOrderId,
      paymentId: razorpay_payment_id,
    });
  } catch (err: any) {
    console.error("Verification error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
