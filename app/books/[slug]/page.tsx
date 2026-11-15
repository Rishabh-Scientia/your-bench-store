import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBookBySlug } from "@/lib/data/books";
import { ArrowLeft, Printer, Truck, ExternalLink } from "lucide-react";
import { formatINR } from "@/lib/utils";
import { AddToCartButton } from "@/components/books/AddToCartButton";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const book = await getBookBySlug(params.slug);
  if (!book) return { title: "Book Not Found — YourBench Store" };

  return {
    title: `${book.title} — YourBench Store`,
    description: (book.description || "").slice(0, 160),
    openGraph: {
      title: `${book.title} by ${book.author} — YourBench Store`,
      description: (book.description || "").slice(0, 160),
      images: [{ url: book.cover_url, width: 800, height: 1200, alt: book.title }],
    },
  };
}

export default async function BookDetailPage({ params }: Props) {
  const book = await getBookBySlug(params.slug);
  if (!book) notFound();

  return (
    <div className="py-8 sm:py-12">
      <div className="container mx-auto max-w-[1200px] px-4 sm:px-6">
        <Link
          href="/books"
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Books</span>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Book Cover (2:3 Aspect Ratio) */}
          <div className="relative aspect-[2/3] w-full max-w-md mx-auto md:mx-0 rounded-xl overflow-hidden bg-surface hairline-border shadow-card">
            <Image
              src={book.cover_url}
              alt={book.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          {/* Book Details */}
          <div className="flex flex-col gap-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                {book.category}
              </span>
              <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-text leading-tight">
                {book.title}
              </h1>
              <p className="mt-2 text-base text-muted">by {book.author}</p>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-text">
                {formatINR(book.price)}
              </span>
              {book.mrp && book.mrp > book.price && (
                <>
                  <span className="text-lg text-muted line-through">
                    {formatINR(book.mrp)}
                  </span>
                  <span className="rounded-full bg-primary-soft px-2.5 py-0.5 text-xs font-semibold text-primary">
                    {Math.round(((book.mrp - book.price) / book.mrp) * 100)}% off
                  </span>
                </>
              )}
            </div>

            {/* Shipping & Speed Post Badges */}
            <div className="flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-1.5 rounded-lg bg-primary-soft px-3 py-2 text-xs font-medium text-primary">
                <Printer className="w-3.5 h-3.5" />
                <span>Printed on order, ships in {book.ships_in_days || 2} days</span>
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-lg bg-surface hairline-border px-3 py-2 text-xs font-medium text-muted">
                <Truck className="w-3.5 h-3.5 text-primary" />
                <span>India Post Speed Post</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-sm font-semibold text-text mb-2">About this book</h2>
              <p className="text-sm text-muted leading-relaxed">{book.description}</p>
            </div>

            {/* Technical Specifications */}
            <div className="rounded-xl bg-surface p-4 hairline-border">
              <div className="grid grid-cols-2 gap-3 text-sm">
                {book.pages && (
                  <div>
                    <span className="text-muted">Pages:</span>{" "}
                    <span className="font-medium text-text">{book.pages}</span>
                  </div>
                )}
                <div>
                  <span className="text-muted">Language:</span>{" "}
                  <span className="font-medium text-text">{book.language}</span>
                </div>
                {book.isbn && (
                  <div>
                    <span className="text-muted">ISBN:</span>{" "}
                    <span className="font-medium text-text">{book.isbn}</span>
                  </div>
                )}
                {book.weight_grams && (
                  <div>
                    <span className="text-muted">Weight:</span>{" "}
                    <span className="font-medium text-text">{book.weight_grams}g</span>
                  </div>
                )}
              </div>
            </div>

            {/* Add to Cart CTA */}
            <div>
              <AddToCartButton book={book} />
            </div>

            {/* Kindle Link */}
            {book.kindle_url && (
              <a
                href={book.kindle_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-primary transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Also available as Kindle edition</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
