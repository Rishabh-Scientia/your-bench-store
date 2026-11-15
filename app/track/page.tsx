"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Truck,
  Clock,
  ShieldCheck,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { formatINR } from "@/lib/utils";

function TrackContent() {
  const searchParams = useSearchParams();
  const initialOrderId = searchParams.get("orderId") || "";
  const initialPhone = searchParams.get("phone") || "";

  const [orderId, setOrderId] = useState(initialOrderId);
  const [phone, setPhone] = useState(initialPhone);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);

  // Automatically execute tracking if orderId and phone are present in URL or stored locally
  useEffect(() => {
    const savedPhone =
      typeof window !== "undefined"
        ? localStorage.getItem("yb_customer_phone") || ""
        : "";
    const effectivePhone = initialPhone || savedPhone;

    if (initialOrderId) {
      setOrderId(initialOrderId);
      if (effectivePhone) {
        setPhone(effectivePhone);
        fetchTrackData(initialOrderId, effectivePhone);
      }
    } else if (savedPhone && !phone) {
      setPhone(savedPhone);
    }
  }, [initialOrderId, initialPhone]);

  const fetchTrackData = async (oid: string, ph: string) => {
    if (!oid.trim() || !ph.trim()) return;

    setLoading(true);
    setNotFound(false);
    setResult(null);

    try {
      const res = await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: oid.trim(), phone: ph.trim() }),
      });

      const data = await res.json();
      if (data.found && data.order) {
        setResult(data.order);
      } else {
        setNotFound(true);
      }
    } catch (err) {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetchTrackData(orderId, phone);
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return {
          label: "Order Paid & Queued",
          className: "bg-emerald-50 text-emerald-700 border-emerald-200",
          desc: "Payment verified. Your hard copy is queued for high-resolution printing.",
        };
      case "printing":
        return {
          label: "Printing in Progress",
          className: "bg-amber-50 text-amber-700 border-amber-200",
          desc: "Your edition is currently being typeset, printed, and soft-touch laminated.",
        };
      case "shipped":
        return {
          label: "Dispatched via Speed Post",
          className: "bg-blue-50 text-blue-700 border-blue-200",
          desc: "Handed over to India Post Speed Post. Tracking ID is active.",
        };
      case "delivered":
        return {
          label: "Delivered",
          className: "bg-green-100 text-green-800 border-green-300",
          desc: "Successfully delivered to your bench.",
        };
      case "cancelled":
        return {
          label: "Cancelled",
          className: "bg-red-50 text-red-700 border-red-200",
          desc: "This order was cancelled and refunded.",
        };
      default:
        return {
          label: "Processing",
          className: "bg-gray-100 text-gray-700 border-gray-200",
          desc: "Order is being processed.",
        };
    }
  };

  return (
    <div className="max-w-xl mx-auto text-center">
      <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-xl bg-primary-soft text-primary mb-4">
        <Truck className="h-6 w-6 stroke-[1.8]" />
      </div>

      <h1 className="font-serif text-3xl font-bold text-text">
        Track Speed Post Order
      </h1>
      <p className="mt-2 text-sm text-muted">
        Enter your YourBench Order ID and 10-digit mobile number to check the printing and India Post Speed Post tracking status.
      </p>

      <form onSubmit={handleTrack} className="mt-8 space-y-4 text-left">
        <div>
          <label htmlFor="orderId" className="block text-sm font-medium text-text mb-1.5">
            Order ID *
          </label>
          <input
            id="orderId"
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="e.g. YB-20261115-XXXX"
            required
            className="w-full rounded-xl bg-surface hairline-border py-2.5 px-4 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-text mb-1.5">
            Mobile Number (10 digits) *
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="9389603320"
            required
            pattern="[0-9]{10}"
            className="w-full rounded-xl bg-surface hairline-border py-2.5 px-4 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-50 transition-colors shadow-subtle"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
          <span>{loading ? "Searching..." : "Track Speed Post Status"}</span>
        </button>
      </form>

      {/* Not Found State */}
      {notFound && (
        <div className="mt-8 rounded-xl bg-red-50 border border-red-200 p-6 text-left animate-in fade-in">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-serif font-bold text-sm text-red-900">
                No matching order found
              </h4>
              <p className="mt-1 text-xs text-red-700 leading-relaxed">
                We could not locate an order matching Order ID &quot;{orderId}&quot; and phone &quot;{phone}&quot;. Please verify the details from your order confirmation or reach our dispatch desk below.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Real Order Found State */}
      {result && (
        <div className="mt-8 rounded-xl bg-white p-6 hairline-border shadow-subtle text-left space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between pb-3 hairline-b">
            <div>
              <span className="text-xs font-semibold text-muted uppercase">Order ID</span>
              <p className="font-serif font-bold text-text text-lg">{result.id}</p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold border ${
                getStatusBadge(result.status).className
              }`}
            >
              {getStatusBadge(result.status).label}
            </span>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-text">Fulfillment Status</p>
                <p className="text-xs text-muted">
                  {getStatusBadge(result.status).desc}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div className="w-full">
                <p className="font-medium text-text">India Post Speed Post Tracking</p>
                {result.tracking_number ? (
                  <div className="mt-1 flex items-center justify-between bg-surface p-2.5 rounded-lg hairline-border">
                    <span className="font-mono text-sm font-bold text-primary">
                      {result.tracking_number}
                    </span>
                    <a
                      href="https://www.indiapost.gov.in/_layouts/15/dpt.cpt.tracking/trackconsignment.aspx"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                    >
                      <span>Track on India Post</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ) : (
                  <p className="text-xs text-muted">
                    Tracking number will be assigned as soon as the print edition is handed over to India Post.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Items in this order */}
          {result.items && result.items.length > 0 && (
            <div className="pt-3 hairline-t">
              <p className="text-xs font-bold uppercase tracking-wider text-muted mb-2">
                Items in Order
              </p>
              <div className="space-y-2">
                {result.items.map((it: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <span className="font-medium text-text">{it.title} × {it.quantity}</span>
                    <span className="font-semibold text-muted">{formatINR(it.price * it.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-8 pt-6 hairline-t text-xs text-muted">
        <p>
          Need immediate help with your order? Reach our dispatch desk at{" "}
          <a href="mailto:yoursbench@gmail.com" className="font-semibold text-primary hover:underline">
            yoursbench@gmail.com
          </a>{" "}
          or call{" "}
          <a href="tel:+919389603320" className="font-semibold text-primary hover:underline">
            +91 9389603320
          </a>
        </p>
      </div>
    </div>
  );
}

export default function TrackPage() {
  return (
    <div className="py-12 sm:py-16">
      <div className="container mx-auto max-w-[1200px] px-4 sm:px-6">
        <Suspense fallback={<div className="text-center text-sm text-muted">Loading tracking...</div>}>
          <TrackContent />
        </Suspense>
      </div>
    </div>
  );
}
