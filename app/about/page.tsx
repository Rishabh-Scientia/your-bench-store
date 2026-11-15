import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Printer, Truck, Leaf, ShieldCheck, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About YourBench Store",
  description: "Learn about YourBench Store — curated print-on-order books shipped across India via India Post Speed Post.",
};

export default function AboutPage() {
  return (
    <div className="py-12 sm:py-16">
      <div className="container mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="flex justify-center mb-6">
            <Image
              src="/logos/logo-full.png"
              alt="YourBench Store"
              width={200}
              height={60}
              className="h-12 w-auto object-contain"
            />
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-text">
            About YourBench Store
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted leading-relaxed">
            We believe that the best ideas deserve physical permanence. YourBench Store is a curated bookshop where every hard-copy book is printed fresh on order—zero warehouse aging, zero wasteful overproduction, and direct delivery to your bench anywhere in India.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">
          <div className="rounded-xl bg-surface p-6 hairline-border">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-primary hairline-border mb-4">
              <Printer className="w-5 h-5 stroke-[1.8]" />
            </div>
            <h3 className="font-serif font-semibold text-lg text-text">Print on Order</h3>
            <p className="mt-1 text-sm text-muted leading-relaxed">
              Instead of mass printing thousands of copies that gather dust in dark warehouses, each book is freshly typeset, bound, and inspected only after you place your order.
            </p>
          </div>

          <div className="rounded-xl bg-surface p-6 hairline-border">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-primary hairline-border mb-4">
              <Truck className="w-5 h-5 stroke-[1.8]" />
            </div>
            <h3 className="font-serif font-semibold text-lg text-text">Speed Post Delivery</h3>
            <p className="mt-1 text-sm text-muted leading-relaxed">
              We partner with India Post Speed Post to reach every postal pin code in India—from major metros to the most remote towns, backed by reliable tracking numbers.
            </p>
          </div>

          <div className="rounded-xl bg-surface p-6 hairline-border">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-primary hairline-border mb-4">
              <Leaf className="w-5 h-5 stroke-[1.8]" />
            </div>
            <h3 className="font-serif font-semibold text-lg text-text">Sustainable &amp; Thoughtful</h3>
            <p className="mt-1 text-sm text-muted leading-relaxed">
              Zero pulped unsold books, zero dead inventory, and thoughtful packaging designed to protect your book while keeping waste to a bare minimum.
            </p>
          </div>

          <div className="rounded-xl bg-surface p-6 hairline-border">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-primary hairline-border mb-4">
              <ShieldCheck className="w-5 h-5 stroke-[1.8]" />
            </div>
            <h3 className="font-serif font-semibold text-lg text-text">Archival Craftsmanship</h3>
            <p className="mt-1 text-sm text-muted leading-relaxed">
              Printed on acid-free 80 GSM natural shade paper with durable soft-touch matte lamination covers engineered to lay flat and age gracefully.
            </p>
          </div>
        </div>

        <div className="text-center pt-8 hairline-t max-w-xl mx-auto">
          <p className="text-sm text-muted">
            YourBench Store is a proud division of YourBench.
          </p>
          <div className="mt-4">
            <Link
              href="/books"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-hover"
            >
              <span>Explore our curated titles</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
