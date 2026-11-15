import { createClient } from "@supabase/supabase-js";
import { StoreSettings } from "@/types";
import fs from "fs";
import path from "path";

export const DEFAULT_SETTINGS: StoreSettings = {
  shipping_fee: 49,
  free_shipping_threshold: 599,
  contact_email: "yoursbench@gmail.com",
  contact_phone: "+91 9389603320",
  announcement_banner:
    "Pan-India Speed Post Delivery by India Post. Each copy printed fresh on order.",
  announcement_enabled: true,
};

function readLocalSettings(): StoreSettings | null {
  try {
    const filePath = path.join(process.cwd(), "data", "store_settings.json");
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      const parsed = JSON.parse(content);
      return {
        shipping_fee: Number(parsed.shipping_fee ?? DEFAULT_SETTINGS.shipping_fee),
        free_shipping_threshold: Number(parsed.free_shipping_threshold ?? DEFAULT_SETTINGS.free_shipping_threshold),
        contact_email: parsed.contact_email || DEFAULT_SETTINGS.contact_email,
        contact_phone: parsed.contact_phone || DEFAULT_SETTINGS.contact_phone,
        announcement_banner: parsed.announcement_banner || DEFAULT_SETTINGS.announcement_banner,
        announcement_enabled: parsed.announcement_enabled ?? DEFAULT_SETTINGS.announcement_enabled,
      };
    }
  } catch (e) {
    // Silent fallback
  }
  return null;
}

export async function getStoreSettings(): Promise<StoreSettings> {
  const local = readLocalSettings();
  let current: StoreSettings = local || { ...DEFAULT_SETTINGS };

  try {
    const url =
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.supabase_Project_url ||
      "";
    const key =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.supabase_Publishable_Key ||
      "";

    if (url && key) {
      const supabase = createClient(url, key);
      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .eq("id", "store_settings")
        .single();

      if (data && !error) {
        current = {
          shipping_fee:
            data.shipping_fee !== null && data.shipping_fee !== undefined
              ? Number(data.shipping_fee)
              : current.shipping_fee,
          free_shipping_threshold:
            data.free_shipping_threshold !== null &&
            data.free_shipping_threshold !== undefined
              ? Number(data.free_shipping_threshold)
              : current.free_shipping_threshold,
          contact_email: data.contact_email || current.contact_email,
          contact_phone: data.contact_phone || current.contact_phone,
          announcement_banner:
            data.announcement_banner || current.announcement_banner,
          announcement_enabled: data.announcement_enabled ?? current.announcement_enabled,
        };
      }
    }
  } catch (e) {
    // If Supabase fetch fails (e.g. offline, sandbox, RLS), return local/defaults
  }

  return current;
}
