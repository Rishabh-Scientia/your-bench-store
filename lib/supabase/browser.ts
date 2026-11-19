import { createBrowserClient } from "@supabase/ssr";

let _client: ReturnType<typeof createBrowserClient> | null = null;

const DEFAULT_SUPABASE_URL = "https://jtfkednjyhkyiqeuvbpm.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY =
  "sb_publishable_WTZ5QlGjQJb0ntmp9yWSDQ_LnNnoijA";

export function createClient() {
  if (_client) return _client;

  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.supabase_Project_url ||
    DEFAULT_SUPABASE_URL;

  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.supabase_Publishable_Key ||
    DEFAULT_SUPABASE_ANON_KEY;

  try {
    _client = createBrowserClient(url, key);
    return _client;
  } catch (err) {
    console.error("[YourBench] Supabase client init error:", err);
    // Create with known defaults
    _client = createBrowserClient(DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_ANON_KEY);
    return _client;
  }
}
