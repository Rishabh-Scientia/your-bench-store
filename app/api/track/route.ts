import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { orderId, phone } = await req.json();

    if (!orderId || !phone) {
      return NextResponse.json(
        { success: false, error: "Order ID and phone number are required" },
        { status: 400 }
      );
    }

    const cleanOrderId = String(orderId).trim();
    const cleanPhone = String(phone).replace(/\D/g, "").slice(-10);

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
        { success: false, error: "Database service unavailable" },
        { status: 500 }
      );
    }

    // Query orders matching ID and customer phone
    const { data: order, error } = await supabase
      .from("orders")
      .select("id, status, customer_name, total_amount, tracking_number, created_at, items:order_items(*)")
      .ilike("id", cleanOrderId)
      .ilike("customer_phone", `%${cleanPhone}`)
      .maybeSingle();

    if (error || !order) {
      return NextResponse.json({
        success: false,
        found: false,
        message: "No order found matching this Order ID and phone number.",
      });
    }

    return NextResponse.json({
      success: true,
      found: true,
      order,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
