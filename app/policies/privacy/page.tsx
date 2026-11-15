import React from "react";
import type { Metadata } from "next";
import { getStoreSettings } from "@/lib/data/settings";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "YourBench Store privacy policy regarding customer data and payments.",
};

export default async function PrivacyPolicyPage() {
  const settings = await getStoreSettings();

  return (
    <div className="py-12 sm:py-16">
      <div className="container mx-auto max-w-[800px] px-4 sm:px-6">
        <h1 className="font-serif text-3xl font-bold text-text mb-2">
          Privacy Policy
        </h1>
        <p className="text-xs text-muted mb-8">Last updated: November 2026</p>

        <div className="space-y-6 text-sm text-muted leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-semibold text-text font-serif">1. Information We Collect</h2>
            <p>
              We collect your name, shipping address, 10-digit mobile number, and email address strictly to produce your print order and book Speed Post postage through India Post.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-text font-serif">2. Payment Security</h2>
            <p>
              All financial transactions are handled directly through Razorpay under PCI-DSS compliance. YourBench never stores or accesses your credit card, debit card, or UPI credentials.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-text font-serif">3. Information Sharing</h2>
            <p>
              We only share necessary delivery information (recipient name, address, and mobile number) with India Post to fulfill shipment delivery. We never sell, rent, or trade your personal data.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-text font-serif">4. Contacting Us</h2>
            <p>
              For any questions regarding your data, contact our Data Privacy Officer at{" "}
              <a
                href={`mailto:${settings.contact_email}`}
                className="font-semibold text-primary hover:underline"
              >
                {settings.contact_email}
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
