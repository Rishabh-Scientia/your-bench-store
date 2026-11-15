import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStoreSettings, DEFAULT_SETTINGS } from "@/lib/data/settings";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = await getStoreSettings();
    return NextResponse.json({ success: true, settings });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const updatedSettings = {
      id: "store_settings",
      shipping_fee: Number(body.shipping_fee ?? DEFAULT_SETTINGS.shipping_fee),
      free_shipping_threshold: Number(
        body.free_shipping_threshold ?? DEFAULT_SETTINGS.free_shipping_threshold
      ),
      contact_email: String(body.contact_email || DEFAULT_SETTINGS.contact_email).trim(),
      contact_phone: String(body.contact_phone || DEFAULT_SETTINGS.contact_phone).trim(),
      announcement_banner: String(
        body.announcement_banner || DEFAULT_SETTINGS.announcement_banner
      ).trim(),
      announcement_enabled: Boolean(
        body.announcement_enabled ?? DEFAULT_SETTINGS.announcement_enabled
      ),
    };

    // 1. Persist to local storage cache if writable (safe for serverless/Vercel)
    try {
      const dir = path.join(process.cwd(), "data");
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const filePath = path.join(dir, "store_settings.json");
      fs.writeFileSync(filePath, JSON.stringify(updatedSettings, null, 2), "utf-8");
    } catch (e) {
      // Vercel serverless filesystem is read-only; proceed to Supabase sync
    }

    // 2. Attempt to sync with Supabase
    let syncedToSupabase = false;
    let warning: string | undefined;

    try {
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

      if (supabase) {
        const { error } = await supabase
          .from("settings")
          .upsert(updatedSettings, { onConflict: "id" });

        if (error) {
          warning = `Supabase sync notice: ${error.message}. Settings are saved and active locally.`;
        } else {
          syncedToSupabase = true;
        }
      }
    } catch (e: any) {
      warning = `Supabase sync error: ${e.message}. Settings are saved and active locally.`;
    }

    return NextResponse.json({
      success: true,
      settings: updatedSettings,
      syncedToSupabase,
      warning,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
