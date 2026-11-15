import React from "react";
import Link from "next/link";
import { ArrowRight, Truck, Printer, ShieldCheck, Sparkles, BookOpen } from "lucide-react";
import { BookCard } from "@/components/books/BookCard";
import { getPublishedBooks } from "@/lib/data/books";
import { getStoreSettings } from "@/lib/data/settings";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [books, settings] = await Promise.all([
    getPublishedBooks(),
    getStoreSettings(),
  ]);

  const featuredBooks = books.slice(0, 4);

  return (
    <div className="flex flex-col">
      {/* Dynamic Announcement Banner */}
      {settings.announcement_enabled && settings.announcement_banner && (
        <div className="bg-surface hairline-b py-2 text-center text-xs text-muted">
          <div className="container mx-auto max-w-[1200px] px-4 flex items-center justify-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
            <span>{settings.announcement_banner}</span>
          </div>
        </div>
      )}

      {/* Hero Section — Minimalist Typography & CTAs */}
      <section className="relative overflow-hidden py-16 sm:py-24 lg:py-28">
        <div className="container mx-auto max-w-[1200px] px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3.5 py-1 text-xs font-semibold text-primary mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Printed on Demand &amp; Shipped via India Post Speed Post</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-text leading-[1.15]">
              Curated Books, Crafted for Thinkers &amp; Builders.
            </h1>

            <p className="mt-5 text-base sm:text-lg text-muted leading-relaxed max-w-2xl mx-auto">
              Hard copies printed on order and delivered to your doorstep across India via India Post Speed Post. Zero warehouse aging, pristine archival print quality.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/books"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-subtle hover:bg-primary-hover active:scale-[0.99] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <span>Browse Books</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/track"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-surface hairline-border px-6 py-3.5 text-sm font-medium text-text hover:bg-white hover:text-primary transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <Truck className="w-4 h-4 text-primary" />
                <span>Track an Order</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Pillars */}
      <section className="hairline-t hairline-b bg-surface py-8">
        <div className="container mx-auto max-w-[1200px] px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white hairline-border text-primary">
                <Printer className="w-5 h-5 stroke-[1.8]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-text">Printed on Order</h3>
                <p className="mt-0.5 text-xs text-muted leading-relaxed">
                  Every book is individually typeset and bound fresh upon purchase.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white hairline-border text-primary">
                <Truck className="w-5 h-5 stroke-[1.8]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-text">Speed Post Delivery</h3>
                <p className="mt-0.5 text-xs text-muted leading-relaxed">
                  Pan-India tracking and reliable delivery through India Post Speed Post.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white hairline-border text-primary">
                <ShieldCheck className="w-5 h-5 stroke-[1.8]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-text">Archival Quality</h3>
                <p className="mt-0.5 text-xs text-muted leading-relaxed">
                  Acid-free paper, crisp typography, and durable soft-touch matte binding.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto max-w-[1200px] px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Featured Catalog</span>
              </div>
              <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-text">
                Handpicked Editions
              </h2>
            </div>
            <Link
              href="/books"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-hover group"
            >
              <span>Explore all titles</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {featuredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      </section>

      {/* Short About YourBench Band */}
      <section className="hairline-t bg-surface py-16 sm:py-20">
        <div className="container mx-auto max-w-[1200px] px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              About YourBench Store
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-text">
              Books that deserve a spot on your bench.
            </h2>
            <p className="text-sm sm:text-base text-muted leading-relaxed">
              At YourBench, we believe that the best work happens when you take time away from screens and immerse yourself in carefully composed thinking. We produce hard-copy editions on demand, eliminating industrial book waste while ensuring that each copy arrives in mint, freshly bound condition at any pin code in India.
            </p>
            <div className="pt-4">
              <Link
                href="/about"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
              >
                <span>Read our publishing philosophy</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
