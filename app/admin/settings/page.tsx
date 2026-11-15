"use client";

import React, { useState, useEffect } from "react";
import { Settings, Save, Truck, Mail, Megaphone, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const [shippingFee, setShippingFee] = useState<number>(49);
  const [freeThreshold, setFreeThreshold] = useState<number>(599);
  const [contactEmail, setContactEmail] = useState<string>("yoursbench@gmail.com");
  const [contactPhone, setContactPhone] = useState<string>("+91 9389603320");
  const [bannerText, setBannerText] = useState<string>(
    "Pan-India Speed Post Delivery by India Post. Each copy printed fresh on order."
  );
  const [bannerEnabled, setBannerEnabled] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(true);

  // Load existing settings on mount from server API
  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const data = await res.json();
          if (data.settings) {
            if (data.settings.shipping_fee !== undefined)
              setShippingFee(Number(data.settings.shipping_fee));
            if (data.settings.free_shipping_threshold !== undefined)
              setFreeThreshold(Number(data.settings.free_shipping_threshold));
            if (data.settings.contact_email)
              setContactEmail(data.settings.contact_email);
            if (data.settings.contact_phone)
              setContactPhone(data.settings.contact_phone);
            if (data.settings.announcement_banner)
              setBannerText(data.settings.announcement_banner);
            if (data.settings.announcement_enabled !== undefined)
              setBannerEnabled(Boolean(data.settings.announcement_enabled));
          }
        }
      } catch (e) {
        console.error("Failed to load settings:", e);
      } finally {
        setFetching(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      shipping_fee: shippingFee,
      free_shipping_threshold: freeThreshold,
      contact_email: contactEmail,
      contact_phone: contactPhone,
      announcement_banner: bannerText,
      announcement_enabled: bannerEnabled,
    };

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Store settings saved successfully and live across the store!");
        if (data.warning) {
          console.warn(data.warning);
        }
      } else {
        toast.error(`Error saving settings: ${data.error || "Unknown error"}`);
      }
    } catch (err: any) {
      toast.error("Failed to save settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="py-12 flex items-center justify-center gap-2 text-sm text-muted">
        <Loader2 className="w-4 h-4 animate-spin text-primary" />
        <span>Loading store settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-serif text-2xl font-bold text-text">Store Settings</h1>
        <p className="text-xs sm:text-sm text-muted">
          Configure Speed Post shipping charges, contact info, and top banner announcements.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Shipping & Thresholds */}
        <div className="rounded-2xl bg-white p-6 hairline-border shadow-subtle space-y-4">
          <div className="flex items-center gap-2 text-primary">
            <Truck className="w-4 h-4" />
            <h2 className="font-serif text-base font-bold text-text">
              Shipping &amp; India Post Speed Post
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text mb-1.5">
                Standard Shipping Charge (₹)
              </label>
              <input
                type="number"
                value={shippingFee}
                onChange={(e) => setShippingFee(Number(e.target.value))}
                required
                className="w-full rounded-xl bg-surface hairline-border py-2.5 px-4 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="mt-1 text-[11px] text-muted">
                Flat shipping rate applied per order.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text mb-1.5">
                Free Shipping Threshold (₹)
              </label>
              <input
                type="number"
                value={freeThreshold}
                onChange={(e) => setFreeThreshold(Number(e.target.value))}
                required
                className="w-full rounded-xl bg-surface hairline-border py-2.5 px-4 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="mt-1 text-[11px] text-muted">
                Orders equal or exceeding this qualify for free shipping.
              </p>
            </div>
          </div>
        </div>

        {/* Customer Support Contacts */}
        <div className="rounded-2xl bg-white p-6 hairline-border shadow-subtle space-y-4">
          <div className="flex items-center gap-2 text-primary">
            <Mail className="w-4 h-4" />
            <h2 className="font-serif text-base font-bold text-text">
              Support &amp; Dispatch Desk Contacts
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text mb-1.5">
                Customer Support Email
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                required
                className="w-full rounded-xl bg-surface hairline-border py-2.5 px-4 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text mb-1.5">
                Customer Support Phone
              </label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                required
                className="w-full rounded-xl bg-surface hairline-border py-2.5 px-4 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Announcement Banner */}
        <div className="rounded-2xl bg-white p-6 hairline-border shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary">
              <Megaphone className="w-4 h-4" />
              <h2 className="font-serif text-base font-bold text-text">
                Storefront Announcement Banner
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="bannerEnabled"
                checked={bannerEnabled}
                onChange={(e) => setBannerEnabled(e.target.checked)}
                className="h-4 w-4 rounded text-primary focus:ring-primary"
              />
              <label htmlFor="bannerEnabled" className="text-xs font-medium text-text cursor-pointer">
                Banner Active
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text mb-1.5">
              Banner Text
            </label>
            <input
              type="text"
              value={bannerText}
              onChange={(e) => setBannerText(e.target.value)}
              className="w-full rounded-xl bg-surface hairline-border py-2.5 px-4 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Save CTA */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-subtle hover:bg-primary-hover disabled:opacity-50 transition-colors"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{loading ? "Saving Settings..." : "Save Store Settings"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
