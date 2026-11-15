import React from "react";
import type { Metadata } from "next";
import { getStoreSettings } from "@/lib/data/settings";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy — YourBench Store",
  description: "Learn about YourBench Store print-on-order and India Post Speed Post delivery terms.",
};

export default async function ShippingPolicyPage() {
  const settings = await getStoreSettings();

  return (
    <div className="py-12 sm:py-16">
      <div className="container mx-auto max-w-[800px] px-4 sm:px-6">
        <h1 className="font-serif text-3xl font-bold text-text mb-2">
          Shipping &amp; Delivery Policy
        </h1>
        <p className="text-xs text-muted mb-8">Last updated: November 2026</p>

        <div className="space-y-6 text-sm text-muted leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-semibold text-text font-serif">1. Print-on-Order Fulfillment</h2>
            <p>
              YourBench operates on a print-on-demand model. Every book ordered is printed fresh, bound with archival soft-touch lamination, and quality checked. This process takes <strong>2 to 3 business days</strong> from the receipt of confirmed payment.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-text font-serif">2. Shipping Carrier: India Post Speed Post</h2>
            <p>
              All shipments are dispatched strictly through <strong>India Post Speed Post</strong>. We chose India Post for its unmatched reach across every pincode in India, secure transit, and official tracking transparency.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-text font-serif">3. Delivery Timelines</h2>
            <p>
              Standard transit via Speed Post takes between <strong>3 to 5 business days</strong> after dispatch for most major cities, and up to <strong>5 to 7 business days</strong> for northeastern regions, island territories, and rural pincodes.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-text font-serif">4. Shipping Charges</h2>
            <p>
              We charge a flat subsidized shipping fee of <strong>₹{settings.shipping_fee} per order</strong>. Orders totaling <strong>₹{settings.free_shipping_threshold} or more</strong> qualify for 100% Free Shipping.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-text font-serif">5. Tracking Your Parcel</h2>
            <p>
              Once your book is handed over to India Post, an automated dispatch notice with your 13-character Speed Post Tracking Number (e.g., <code>ED123456789IN</code>) will be sent via SMS and email. You can track your parcel on our <a href="/track" className="text-primary hover:underline">Track Order</a> page or directly on the India Post official portal.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
