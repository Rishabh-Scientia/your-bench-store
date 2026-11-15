"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/CartContext";
import { formatINR } from "@/lib/utils";
import {
  ShoppingBag,
  CreditCard,
  ShieldCheck,
  Truck,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/browser";

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if ((window as any).Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [shippingRate, setShippingRate] = useState<number>(49);
  const [freeThreshold, setFreeThreshold] = useState<number>(599);
  const [paying, setPaying] = useState<boolean>(false);

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
          if (
            data.free_shipping_threshold !== undefined &&
            data.free_shipping_threshold !== null
          ) {
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
          <h1 className="font-serif text-2xl font-bold text-text">
            Your cart is empty
          </h1>
          <p className="mt-2 text-sm text-muted">
            Please add books to your cart before checking out.
          </p>
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

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^[0-9]{10}$/.test(formData.phone.trim())) {
      toast.error("Please enter a valid 10-digit Indian mobile number");
      return;
    }
    if (!/^[0-9]{6}$/.test(formData.pincode.trim())) {
      toast.error("Please enter a valid 6-digit Indian PIN code");
      return;
    }

    setPaying(true);

    try {
      // 1. Ensure Razorpay Checkout script is loaded
      const scriptReady = await loadRazorpayScript();
      if (!scriptReady) {
        toast.error("Failed to load Razorpay SDK. Please check your internet connection.");
        setPaying(false);
        return;
      }

      // 2. Call server to create a Razorpay Order
      const res = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          currency: "INR",
          notes: {
            customer_name: formData.fullName,
            customer_email: formData.email,
            customer_phone: formData.phone,
          },
        }),
      });

      const orderData = await res.json();

      if (!orderData.success) {
        toast.error(orderData.error || "Failed to initiate payment");
        setPaying(false);
        return;
      }

      // 3. Open Razorpay Checkout Modal
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "YourBench Store",
        description: "Hard-copy books (Speed Post Delivery)",
        image: "/logos/logo-icon.png",
        order_id: orderData.orderId,
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#0A8F18",
        },
        handler: async function (response: any) {
          try {
            toast.loading("Verifying payment with YourBench...");

            const verifyRes = await fetch("/api/checkout/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                customer: {
                  fullName: formData.fullName,
                  email: formData.email,
                  phone: formData.phone,
                },
                address: {
                  fullName: formData.fullName,
                  phone: formData.phone,
                  addressLine1: formData.addressLine1,
                  addressLine2: formData.addressLine2,
                  city: formData.city,
                  state: formData.state,
                  pincode: formData.pincode,
                },
                items: items.map((it) => ({
                  bookId: it.book.id,
                  title: it.book.title,
                  author: it.book.author,
                  coverUrl: it.book.cover_url,
                  price: it.book.price,
                  quantity: it.quantity,
                })),
                subtotal,
                shippingFee,
                totalAmount: total,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              clearCart();

              try {
                // Save order details to local device storage for instant "Your Orders" access
                const existing = JSON.parse(
                  localStorage.getItem("yb_customer_orders") || "[]"
                );
                if (!existing.includes(verifyData.orderId)) {
                  existing.unshift(verifyData.orderId);
                  localStorage.setItem("yb_customer_orders", JSON.stringify(existing));
                }
                localStorage.setItem("yb_customer_phone", formData.phone.trim());
                localStorage.setItem("yb_customer_email", formData.email.trim());
              } catch (e) {
                // LocalStorage fail-safe
              }

              toast.dismiss();
              toast.success("Payment verified! Order placed successfully.");
              router.push(`/orders`);
            } else {
              toast.dismiss();
              toast.error(
                `Payment verification issue: ${verifyData.error || "Please contact support"}`
              );
            }
          } catch (err: any) {
            toast.dismiss();
            toast.error("Network error during payment verification. Please check /track.");
          } finally {
            setPaying(false);
          }
        },
        modal: {
          ondismiss: function () {
            setPaying(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (resp: any) {
        toast.error(resp.error?.description || "Payment failed. Please try again.");
        setPaying(false);
      });
      rzp.open();
    } catch (err: any) {
      toast.error(err.message || "Failed to open payment gateway");
      setPaying(false);
    }
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

        <h1 className="font-serif text-3xl font-bold text-text mb-8">
          Checkout &amp; Shipping
        </h1>

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
                      placeholder="9389603320"
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
                    placeholder="rahul@example.com"
                    className="w-full rounded-xl bg-surface hairline-border py-2.5 px-4 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <p className="mt-1 text-xs text-muted">
                    We will send the Speed Post tracking ID and order updates to this email.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-1.5">
                    Address Line 1 (House/Flat No., Building Name) *
                  </label>
                  <input
                    type="text"
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. Flat 302, Green Valley Apartments"
                    className="w-full rounded-xl bg-surface hairline-border py-2.5 px-4 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-1.5">
                    Address Line 2 (Street, Landmark, Area)
                  </label>
                  <input
                    type="text"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleInputChange}
                    placeholder="e.g. Near City Center Mall, MG Road"
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
                      placeholder="e.g. Maharashtra"
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

              {/* Payment Gateway Info */}
              <div className="rounded-xl bg-white p-6 hairline-border space-y-4">
                <h2 className="font-serif text-lg font-semibold text-text">
                  Payment Method
                </h2>

                <div className="rounded-xl bg-surface p-4 hairline-border">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-primary hairline-border">
                      <CreditCard className="w-5 h-5 stroke-[1.8]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-text">
                        Razorpay Secure Checkout
                      </h3>
                      <p className="mt-0.5 text-xs text-muted leading-relaxed">
                        Instant payment via UPI (Google Pay, PhonePe, Paytm, BHIM), Credit/Debit Cards, and Net Banking.
                      </p>
                      <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-primary font-medium">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>256-bit Encrypted · PCI-DSS Compliant</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={paying}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-subtle hover:bg-primary-hover active:scale-[0.99] disabled:opacity-50 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {paying ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Opening Secure Checkout...</span>
                    </>
                  ) : (
                    <span>Pay {formatINR(total)} &amp; Confirm Print Order</span>
                  )}
                </button>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="rounded-xl bg-surface p-6 hairline-border h-fit sticky top-24">
              <h2 className="font-serif text-lg font-bold text-text mb-4">
                Order Summary
              </h2>

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
                  <span>Ships within 2–3 business days</span>
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
