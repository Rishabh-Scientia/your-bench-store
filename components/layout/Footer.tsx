"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Truck, ShieldCheck, Clock } from "lucide-react";

export function Footer() {
  const pathname = usePathname();

  // Hide public footer on admin pages
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="mt-auto bg-surface hairline-t">
      <div className="container mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4 lg:gap-12">
          {/* Brand — Original full logo from assets */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="inline-block">
              <Image
                src="/logos/logo-full.png"
                alt="YourBench Store"
                width={180}
                height={55}
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-muted leading-relaxed">
              Curated hard-copy books, printed fresh on order and shipped directly
              to your bench across India.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary bg-primary-soft px-2.5 py-1 rounded-full">
                <Truck className="w-3.5 h-3.5" /> India Post Speed Post
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text">
              Store
            </h3>
            <ul className="space-y-2 text-sm text-muted">
              <li>
                <Link href="/books" className="hover:text-primary transition-colors">
                  All Books
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-primary transition-colors">
                  Track Speed Post
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  About YourBench
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  Help &amp; Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Policies */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text">
              Policies
            </h3>
            <ul className="space-y-2 text-sm text-muted">
              <li>
                <Link href="/policies/shipping" className="hover:text-primary transition-colors">
                  Shipping &amp; Delivery
                </Link>
              </li>
              <li>
                <Link href="/policies/refunds" className="hover:text-primary transition-colors">
                  Refund &amp; Cancellation
                </Link>
              </li>
              <li>
                <Link href="/policies/privacy" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/terms" className="hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Support */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text">
              Speed Post Dispatch
            </h3>
            <p className="text-sm text-muted leading-relaxed">
              Every book is printed fresh upon order confirmation. Packaged securely
              in moisture-proof wraps and dispatched within 2–3 business days.
            </p>
            <div className="pt-2 text-xs text-muted space-y-1">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span>Pan-India Speed Post: 3–5 days</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                <span>Official India Post Tracking ID</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 hairline-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
          <p>© {new Date().getFullYear()} YourBench Store. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span className="font-medium text-text">A YourBench company</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
