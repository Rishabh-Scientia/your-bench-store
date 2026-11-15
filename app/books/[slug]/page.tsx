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

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.yourbench.store";
  const canonicalUrl = `${siteUrl}/books/${encodeURIComponent(book.slug)}`;

  return {
    title: `${book.title} by ${book.author} — YourBench Store`,
    description: (book.description || "").slice(0, 160),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${book.title} by ${book.author} — YourBench Store`,
      description: (book.description || "").slice(0, 160),
      url: canonicalUrl,
      type: "book",
      images: [
        {
          url: book.cover_url,
          width: 800,
          height: 1200,
          alt: book.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${book.title} by ${book.author} — YourBench Store`,
      description: (book.description || "").slice(0, 160),
      images: [book.cover_url],
    },
  };
}

export default async function BookDetailPage({ params }: Props) {
  const book = await getBookBySlug(params.slug);
  if (!book) notFound();

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.yourbench.store";
  const bookUrl = `${siteUrl}/books/${encodeURIComponent(book.slug)}`;

  const bookSchema = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: book.title,
    author: {
      "@type": "Person",
      name: book.author,
    },
    image: book.cover_url,
    description: book.description,
    isbn: book.isbn || undefined,
    inLanguage: book.language,
    numberOfPages: book.pages,
    offers: {
      "@type": "Offer",
      price: book.price,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      url: bookUrl,
      seller: {
        "@type": "Organization",
        name: "YourBench Store",
      },
    },
  };

  return (
    <div className="py-8 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bookSchema) }}
      />
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
                <span className="text-lg text-muted line-through">
                  {formatINR(book.mrp)}
                </span>
              )}
              {book.mrp && book.mrp > book.price && (
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-primary">
                  Save {formatINR(book.mrp - book.price)}
                </span>
              )}
            </div>

            {/* Specifications Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-xl bg-surface p-4 hairline-border">
              <div>
                <span className="text-[11px] font-semibold text-muted uppercase tracking-wider">
                  Pages
                </span>
                <p className="mt-0.5 text-sm font-medium text-text">
                  {book.pages || "N/A"}
                </p>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-muted uppercase tracking-wider">
                  Language
                </span>
                <p className="mt-0.5 text-sm font-medium text-text">
                  {book.language || "English"}
                </p>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-muted uppercase tracking-wider">
                  Format
                </span>
                <p className="mt-0.5 text-sm font-medium text-text">Hard Copy</p>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-muted uppercase tracking-wider">
                  Weight
                </span>
                <p className="mt-0.5 text-sm font-medium text-text">
                  {book.weight_grams ? `${book.weight_grams}g` : "250g"}
                </p>
              </div>
            </div>

            {/* Print on Order & Shipping Notice */}
            <div className="rounded-xl bg-surface p-4 hairline-border space-y-2">
              <div className="flex items-start gap-2.5">
                <Printer className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-muted leading-relaxed">
                  <strong className="text-text">Printed on order:</strong> Freshly printed, typeset, and bound on acid-free paper.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <Truck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-muted leading-relaxed">
                  <strong className="text-text">Ships in {book.ships_in_days || 3} days:</strong> Dispatched across India via India Post Speed Post with live tracking.
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-text mb-2">
                About this edition
              </h2>
              <p className="text-sm text-muted leading-relaxed whitespace-pre-line">
                {book.description}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <AddToCartButton book={book} />

              {book.kindle_url && (
                <a
                  href={book.kindle_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-surface hairline-border px-6 py-3.5 text-sm font-semibold text-text hover:bg-white transition-colors"
                >
                  <span>Kindle Edition</span>
                  <ExternalLink className="w-3.5 h-3.5 text-muted" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
