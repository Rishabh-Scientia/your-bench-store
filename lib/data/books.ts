import { createClient } from "@supabase/supabase-js";
import { SAMPLE_BOOKS } from "./sampleBooks";
import { Book } from "@/types";

export async function getPublishedBooks(): Promise<Book[]> {
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
        .from("books")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (data && data.length > 0) {
        return data as Book[];
      }
    }
  } catch (e) {
    console.error("Failed to query published books from Supabase:", e);
  }

  return SAMPLE_BOOKS;
}

export async function getBookBySlug(rawSlug: string): Promise<Book | null> {
  const books = await getPublishedBooks();
  const decoded = decodeURIComponent(rawSlug).toLowerCase().trim();

  const found = books.find((b) => {
    const bSlug = (b.slug || "").toLowerCase().trim();
    const bTitle = (b.title || "").toLowerCase().trim();
    return (
      bSlug === decoded ||
      encodeURIComponent(b.slug).toLowerCase() === rawSlug.toLowerCase() ||
      b.id === rawSlug ||
      bTitle === decoded
    );
  });

  return found || null;
}
