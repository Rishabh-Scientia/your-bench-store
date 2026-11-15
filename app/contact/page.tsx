import React from "react";
import { Mail, Phone, MapPin, Clock, Truck } from "lucide-react";
import type { Metadata } from "next";
import { getStoreSettings } from "@/lib/data/settings";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact Us — YourBench Store",
  description: "Get in touch with the YourBench Store support team and dispatch desk.",
};

export default async function ContactPage() {
  const settings = await getStoreSettings();

  return (
    <div className="py-12 sm:py-16">
      <div className="container mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-text">
            Customer Support &amp; Dispatch Desk
          </h1>
          <p className="mt-3 text-sm sm:text-base text-muted">
            Have a question about a title, bulk academic/company order, or an existing Speed Post shipment? We are ready to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {/* Email Support */}
          <div className="rounded-xl bg-surface p-6 hairline-border">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-primary hairline-border mb-4">
              <Mail className="w-5 h-5 stroke-[1.8]" />
            </div>
            <h3 className="font-serif font-semibold text-text">Email Support</h3>
            <p className="mt-1 text-xs text-muted">Direct replies within 4 business hours.</p>
            <a
              href={`mailto:${settings.contact_email}`}
              className="mt-3 inline-block text-sm font-semibold text-primary hover:underline"
            >
              {settings.contact_email}
            </a>
          </div>

          {/* Phone Support */}
          <div className="rounded-xl bg-surface p-6 hairline-border">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-primary hairline-border mb-4">
              <Phone className="w-5 h-5 stroke-[1.8]" />
            </div>
            <h3 className="font-serif font-semibold text-text">Phone Support</h3>
            <p className="mt-1 text-xs text-muted">Mon–Sat, 9:30 AM to 6:30 PM IST.</p>
            <a
              href={`tel:${settings.contact_phone.replace(/\s+/g, "")}`}
              className="mt-3 inline-block text-sm font-semibold text-primary hover:underline"
            >
              {settings.contact_phone}
            </a>
          </div>

          {/* Postal Dispatch Desk */}
          <div className="rounded-xl bg-surface p-6 hairline-border">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-primary hairline-border mb-4">
              <Truck className="w-5 h-5 stroke-[1.8]" />
            </div>
            <h3 className="font-serif font-semibold text-text">Postal Dispatch Desk</h3>
            <p className="mt-1 text-xs text-muted">All print operations &amp; Speed Post</p>
            <p className="mt-3 text-sm text-text font-medium">
              YourBench, India
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
