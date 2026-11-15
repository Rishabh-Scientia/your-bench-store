"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/components/cart/CartContext";
import { formatINR } from "@/lib/utils";
import { ShoppingBag, CreditCard, ShieldCheck, Truck, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/browser";

export default function CheckoutPage() {
  const { items, subtotal } = useCart();
  const [shippingRate, setShippingRate] = useState<number>(49);
  const [freeThreshold, setFreeThreshold] = useState<number>(599);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("settings")
          .select("shipping_fee, free_shipping_threshold")
          .eq("id", "store_settings")
          .single();

        if (data) {
          if (data.shipping_fee !== undefined && data.shipping_fee !== null) {
            setShippingRate(Number(data.shipping_fee));
          }
          if (data.free_shipping_threshold !== undefined && data.free_shipping_threshold !== null) {
            setFreeThreshold(Number(data.free_shipping_threshold));
          }
        }
      } catch (e) {
        console.error("Checkout settings fetch error:", e);
      }
    }
    loadSettings();
  }, []);

  const shippingFee = subtotal >= freeThreshold ? 0 : shippingRate;
  const total = subtotal + shippingFee;

  if (items.length === 0) {
    return (
      <div className="py-20 text-center">
        <div className="container mx-auto max-w-[1200px] px-4 sm:px-6">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-surface text-muted mb-4">
            <ShoppingBag className="h-8 w-8 stroke-[1.5]" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-text">Your cart is empty</h1>
          <p className="mt-2 text-sm text-muted">Please add books to your cart before checking out.</p>
          <Link
            href="/books"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-hover transition-colors"
          >
            Browse Books
          </Link>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[0-9]{10}$/.test(formData.phone)) {
      toast.error("Please enter a valid 10-digit Indian mobile number");
      return;
    }
    if (!/^[0-9]{6}$/.test(formData.pincode)) {
      toast.error("Please enter a valid 6-digit Indian PIN code");
      return;
    }
    toast.info("Payment Gateway in Test / Coming Soon mode. Configure RAZORPAY_KEY_ID in .env to enable live payments.");
  };

  return (
    <div className="py-8 sm:py-12">
      <div className="container mx-auto max-w-[1200px] px-4 sm:px-6">
        <Link
          href="/cart"
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Cart</span>
        </Link>

        <h1 className="font-serif text-3xl font-bold text-text mb-8">Checkout &amp; Shipping</h1>

        <form onSubmit={handlePay}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Shipping Form */}
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-xl bg-white p-6 hairline-border space-y-4">
                <h2 className="font-serif text-lg font-semibold text-text">
                  Delivery Address (India Post Speed Post)
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. Rahul Sharma"
                      className="w-full rounded-xl bg-surface hairline-border py-2.5 px-4 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1.5">
                      Mobile Number (10 digits) *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      pattern="[0-9]{10}"
                      placeholder="9876543210"
                      className="w-full rounded-xl bg-surface hairline-border py-2.5 px-4 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="you@example.com"
                    className="w-full rounded-xl bg-surface hairline-border py-2.5 px-4 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <p className="mt-1 text-[11px] text-muted">
                    Order confirmation &amp; India Post tracking link will be sent here.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-1.5">
                    Address Line 1 (Flat, House no., Building) *
                  </label>
                  <input
                    type="text"
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleInputChange}
                    required
                    placeholder="Flat 402, Green Heights"
                    className="w-full rounded-xl bg-surface hairline-border py-2.5 px-4 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-1.5">
                    Address Line 2 (Street, Area, Landmark)
                  </label>
                  <input
                    type="text"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleInputChange}
                    placeholder="Near Central Park, MG Road"
                    className="w-full rounded-xl bg-surface hairline-border py-2.5 px-4 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text mb-1.5">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. Pune"
                      className="w-full rounded-xl bg-surface hairline-border py-2.5 px-4 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1.5">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      placeholder="Maharashtra"
                      className="w-full rounded-xl bg-surface hairline-border py-2.5 px-4 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1.5">
                      PIN Code (6 digits) *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      required
                      pattern="[0-9]{6}"
                      placeholder="411001"
                      className="w-full rounded-xl bg-surface hairline-border py-2.5 px-4 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Section */}
              <div className="rounded-xl bg-white p-6 hairline-border space-y-4">
                <h2 className="font-serif text-lg font-semibold text-text">
                  Payment Method
                </h2>

                <div className="rounded-xl bg-primary-soft p-5 hairline-border border-primary/20">
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-primary hairline-border">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-text">
                        Razorpay Secure Checkout
                      </h3>
                      <p className="mt-0.5 text-xs text-muted leading-relaxed">
                        Supports UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, and Net Banking.
                      </p>
                      <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-primary font-medium">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Payment Gateway: Coming Soon / Test Mode</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-subtle hover:bg-primary-hover active:scale-[0.99] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  Pay {formatINR(total)} &amp; Confirm Print Order
                </button>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="rounded-xl bg-surface p-6 hairline-border h-fit sticky top-24">
              <h2 className="font-serif text-lg font-bold text-text mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.book.id} className="flex justify-between text-sm">
                    <span className="text-muted line-clamp-1">
                      {item.book.title} × {item.quantity}
                    </span>
                    <span className="font-medium text-text shrink-0 ml-2">
                      {formatINR(item.book.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-sm hairline-t pt-3">
                <div className="flex justify-between">
                  <span className="text-muted">Subtotal</span>
                  <span className="text-text">{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Speed Post Shipping</span>
                  <span className="text-text">
                    {shippingFee === 0 ? "FREE" : formatINR(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between hairline-t pt-2 text-base">
                  <span className="font-semibold text-text">Total</span>
                  <span className="font-bold text-text">{formatINR(total)}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 hairline-t space-y-2 text-xs text-muted">
                <div className="flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-primary" />
                  <span>Ships within 2 business days</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                  <span>Pan-India Speed Post Tracking</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
