import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { phone, email, orderIds } = await req.json();

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

    let query = supabase
      .from("orders")
      .select("*, items:order_items(*)")
      .order("created_at", { ascending: false });

    const cleanPhone = phone ? String(phone).replace(/\D/g, "").slice(-10) : "";
    const cleanEmail = email ? String(email).trim().toLowerCase() : "";

    // Build filter based on provided parameters
    if (cleanPhone && cleanEmail) {
      query = query.or(
        `customer_phone.ilike.%${cleanPhone}%,customer_email.ilike.${cleanEmail}`
      );
    } else if (cleanPhone) {
      query = query.ilike("customer_phone", `%${cleanPhone}`);
    } else if (cleanEmail) {
      query = query.ilike("customer_email", cleanEmail);
    } else if (orderIds && Array.isArray(orderIds) && orderIds.length > 0) {
      query = query.in("id", orderIds);
    } else {
      return NextResponse.json({
        success: true,
        orders: [],
      });
    }

    const { data: orders, error } = await query;

    if (error) {
      console.error("Error fetching customer orders:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      orders: orders || [],
    });
  } catch (err: any) {
    console.error("Customer orders API error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to load orders" },
      { status: 500 }
    );
  }
}
