import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.supabase_Project_url ||
    "";
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.supabase_Publishable_Key ||
    "";

  return createBrowserClient(url, key);
}
