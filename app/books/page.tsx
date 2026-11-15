import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { Search } from "lucide-react";
import { getPublishedBooks } from "@/lib/data/books";
import BookCard from "@/components/books/BookCard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "All Books — YourBench Store",
  description: "Browse our curated catalog of print-on-order hard copy books shipped via India Post Speed Post.",
};

export default async function BooksPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const books = await getPublishedBooks();
  const categories = Array.from(
    new Set(books.map((b) => b.category).filter(Boolean))
  );

  const activeCategory = searchParams?.category || "";

  const filtered = activeCategory
    ? books.filter((b) => b.category === activeCategory)
    : books;

  return (
    <main className="min-h-screen py-10">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-text mb-2">
          All Books
        </h1>
        <p className="text-muted text-sm mb-8">
          Browse our curated collection of print-on-order titles. Every edition is freshly printed and dispatched via India Post Speed Post.
        </p>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Link
            href="/books"
            className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-colors ${
              !activeCategory
                ? "bg-primary text-white"
                : "bg-surface hairline-border text-muted hover:text-text hover:bg-white"
            }`}
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/books?category=${encodeURIComponent(cat)}`}
              className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-colors ${
                activeCategory === cat
                  ? "bg-primary text-white"
                  : "bg-surface hairline-border text-muted hover:text-text hover:bg-white"
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-lg font-serif text-muted">No books found in this category.</p>
            <Link
              href="/books"
              className="mt-4 inline-block text-sm font-semibold text-primary hover:underline"
            >
              View all books
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
