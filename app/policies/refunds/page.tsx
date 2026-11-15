import React from "react";
import type { Metadata } from "next";
import { getStoreSettings } from "@/lib/data/settings";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy",
  description: "Learn about refund and cancellation policies at YourBench Store.",
};

export default async function RefundPolicyPage() {
  const settings = await getStoreSettings();

  return (
    <div className="py-12 sm:py-16">
      <div className="container mx-auto max-w-[800px] px-4 sm:px-6">
        <h1 className="font-serif text-3xl font-bold text-text mb-2">
          Refund &amp; Cancellation Policy
        </h1>
        <p className="text-xs text-muted mb-8">Last updated: November 2026</p>

        <div className="space-y-6 text-sm text-muted leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-semibold text-text font-serif">1. Order Cancellations</h2>
            <p>
              Because each book is manufactured on order specifically for you, orders can only be cancelled within <strong>2 hours of order placement</strong>, before typesetting and digital printing plates are prepped. To cancel, please email{" "}
              <a
                href={`mailto:${settings.contact_email}`}
                className="font-semibold text-primary hover:underline"
              >
                {settings.contact_email}
              </a>{" "}
              with your Order ID.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-text font-serif">2. Defective, Misprinted or Damaged Copies</h2>
            <p>
              If your book arrives with physical damage from transit or a misprinted/missing page defect, we will immediately send you a <strong>fresh replacement copy free of charge</strong>, or issue a full refund.
            </p>
            <p>
              Please notify us within <strong>48 hours of delivery</strong> by emailing photos of the defect and packaging to{" "}
              <a
                href={`mailto:${settings.contact_email}`}
                className="font-semibold text-primary hover:underline"
              >
                {settings.contact_email}
              </a>
              .
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-text font-serif">3. Non-Returnable Scope</h2>
            <p>
              We cannot accept returns or offer refunds for change-of-mind once printing is completed and the parcel has been registered with India Post.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-text font-serif">4. Refund Processing</h2>
            <p>
              Approved refunds are credited back to the original source account via Razorpay within <strong>5 to 7 business days</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
