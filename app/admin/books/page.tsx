"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, BookOpen, ExternalLink, Trash2, Search, Loader2 } from "lucide-react";
import { SAMPLE_BOOKS } from "@/lib/data/sampleBooks";
import { formatINR } from "@/lib/utils";
import { Book } from "@/types";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/browser";

export default function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>(SAMPLE_BOOKS);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch live books from Supabase
  useEffect(() => {
    async function loadBooks() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("books")
          .select("*")
          .order("created_at", { ascending: false });

        if (data && data.length > 0) {
          setBooks(data);
        }
      } catch (e) {
        console.error("Failed to fetch books:", e);
      } finally {
        setLoading(false);
      }
    }
    loadBooks();
  }, []);

  const filteredBooks = books.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase()) ||
      b.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        const supabase = createClient();
        await supabase.from("books").delete().eq("id", id);
      } catch (e) {
        console.error("Supabase delete failed:", e);
      }
      setBooks((prev) => prev.filter((b) => b.id !== id));
      toast.success(`"${title}" deleted from catalog`);
    }
  };

  const handleTogglePublished = async (id: string) => {
    const current = books.find((b) => b.id === id);
    if (!current) return;
    const nextState = !current.published;

    try {
      const supabase = createClient();
      await supabase.from("books").update({ published: nextState }).eq("id", id);
    } catch (e) {
      console.error("Supabase update failed:", e);
    }

    setBooks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, published: nextState } : b))
    );
    toast.success(`Book marked as ${nextState ? "Published" : "Draft"}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-text">Books Catalog</h1>
          <p className="text-xs sm:text-sm text-muted">
            Manage titles, print specifications, pricing, and availability.
          </p>
        </div>

        <Link
          href="/admin/books/new"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-subtle hover:bg-primary-hover transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Book</span>
        </Link>
      </div>

      {/* Search & Counter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl hairline-border shadow-subtle">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, author, category..."
            className="w-full rounded-xl bg-surface hairline-border py-2 pl-9 pr-4 text-xs sm:text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <p className="text-xs text-muted">
          Showing <strong>{filteredBooks.length}</strong> of {books.length} books
        </p>
      </div>

      {/* Books Table */}
      <div className="rounded-2xl bg-white hairline-border shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-surface hairline-b text-muted uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Book</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price / MRP</th>
                <th className="py-3 px-4">Pages &amp; Weight</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredBooks.map((book) => (
                <tr key={book.id} className="hover:bg-surface/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="h-14 w-10 shrink-0 rounded bg-surface hairline-border overflow-hidden relative">
                        <img
                          src={book.cover_url}
                          alt={book.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-serif font-semibold text-text line-clamp-1 max-w-[200px] sm:max-w-[260px]">
                          {book.title}
                        </h3>
                        <p className="text-xs text-muted">{book.author}</p>
                        <p className="text-[10px] text-muted">ISBN: {book.isbn || "N/A"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-muted">
                    <span className="rounded bg-surface px-2 py-1 text-xs">
                      {book.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-text">{formatINR(book.price)}</div>
                    {book.mrp && book.mrp > book.price && (
                      <div className="text-xs text-muted line-through">
                        {formatINR(book.mrp)}
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-muted text-xs">
                    <div>{book.pages ? `${book.pages} pages` : "Pages N/A"}</div>
                    <div>{book.weight_grams ? `${book.weight_grams}g` : "Weight N/A"}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      type="button"
                      onClick={() => handleTogglePublished(book.id)}
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold border transition-colors ${
                        book.published
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                          : "bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200"
                      }`}
                    >
                      {book.published ? "Published" : "Draft"}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/books/${encodeURIComponent(book.slug || book.id)}`}
                        target="_blank"
                        className="p-1.5 rounded-lg text-muted hover:text-primary hover:bg-surface"
                        title="View on store"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(book.id, book.title)}
                        className="p-1.5 rounded-lg text-muted hover:text-red-600 hover:bg-red-50"
                        title="Delete book"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
