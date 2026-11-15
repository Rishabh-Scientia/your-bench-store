import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions of purchasing from YourBench Store.",
};

export default function TermsPage() {
  return (
    <div className="py-12 sm:py-16">
      <div className="container mx-auto max-w-[800px] px-4 sm:px-6">
        <h1 className="font-serif text-3xl font-bold text-text mb-2">
          Terms of Service
        </h1>
        <p className="text-xs text-muted mb-8">Last updated: November 2026</p>

        <div className="space-y-6 text-sm text-muted leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-semibold text-text font-serif">1. Acceptance of Terms</h2>
            <p>
              By accessing and placing an order on YourBench Store (a service of YourBench), you agree to be bound by these Terms of Service and all related policies.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-text font-serif">2. Custom On-Demand Manufacturing</h2>
            <p>
              All titles purchased through this platform are manufactured custom to each order. Slight variations in paper shade, trim margins, or binding hue are natural marks of craft on-demand publishing.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-text font-serif">3. Pricing &amp; Taxes</h2>
            <p>
              All prices displayed on the store are in Indian National Rupees (INR) and are inclusive of all applicable goods and services taxes. Shipping charges are calculated transparently at checkout.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-text font-serif">4. Governing Law &amp; Jurisdiction</h2>
            <p>
              These terms shall be governed by and construed in accordance with the laws of India. Any disputes arising hereunder shall be subject to the exclusive jurisdiction of the competent courts in India.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
