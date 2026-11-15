"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/components/cart/CartContext";
import { formatINR } from "@/lib/utils";
import { createClient } from "@/lib/supabase/browser";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal, itemCount, isLoaded } = useCart();
  const [shippingRate, setShippingRate] = useState<number>(49);
  const [freeThreshold, setFreeThreshold] = useState<number>(599);

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
        console.error("Cart settings fetch error:", e);
      }
    }
    loadSettings();
  }, []);

  if (!isLoaded) {
    return (
      <div className="py-20 text-center">
        <div className="container mx-auto max-w-[1200px] px-4">
          <p className="text-sm text-muted">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-20 text-center">
        <div className="container mx-auto max-w-[1200px] px-4 sm:px-6">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-surface text-muted mb-4">
            <ShoppingBag className="h-8 w-8 stroke-[1.5]" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text">Your cart is empty</h1>
          <p className="mt-2 text-sm text-muted max-w-sm mx-auto">
            Explore our curated catalog of print-on-order editions and add titles to your bench.
          </p>
          <Link
            href="/books"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-subtle hover:bg-primary-hover transition-colors"
          >
            <span>Browse Books</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const shippingFee = subtotal >= freeThreshold ? 0 : shippingRate;
  const total = subtotal + shippingFee;

  return (
    <div className="py-8 sm:py-12">
      <div className="container mx-auto max-w-[1200px] px-4 sm:px-6">
        <Link
          href="/books"
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continue Shopping</span>
        </Link>

        <h1 className="font-serif text-3xl font-bold text-text mb-8">
          Shopping Cart ({itemCount} {itemCount === 1 ? "book" : "books"})
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.book.id}
                className="flex gap-4 rounded-xl bg-white p-4 hairline-border shadow-subtle"
              >
                <div className="relative h-28 w-20 shrink-0 rounded-lg overflow-hidden bg-surface hairline-border">
                  <Image
                    src={item.book.cover_url}
                    alt={item.book.title}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <h3 className="font-serif font-semibold text-text line-clamp-1">
                      {item.book.title}
                    </h3>
                    <p className="text-xs text-muted mt-0.5">{item.book.author}</p>
                    <span className="inline-block mt-1 text-[11px] font-medium text-primary bg-primary-soft px-2 py-0.5 rounded">
                      Printed on order
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.book.id, item.quantity - 1)}
                        aria-label="Decrease quantity"
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface text-text hover:bg-primary-soft transition-colors active:scale-95"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.book.id, item.quantity + 1)}
                        aria-label="Increase quantity"
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface text-text hover:bg-primary-soft transition-colors active:scale-95"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-bold text-text">
                        {formatINR(item.book.price * item.quantity)}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeItem(item.book.id)}
                        aria-label="Remove item"
                        className="p-1.5 text-muted hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Sidebar */}
          <div className="rounded-xl bg-surface p-6 hairline-border h-fit sticky top-24">
            <h2 className="font-serif text-lg font-bold text-text mb-4">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Subtotal</span>
                <span className="font-medium text-text">{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Shipping (Speed Post)</span>
                <span className="font-medium text-text">
                  {shippingFee === 0 ? (
                    <span className="text-primary font-semibold">FREE</span>
                  ) : (
                    formatINR(shippingFee)
                  )}
                </span>
              </div>
              {subtotal < freeThreshold && (
                <p className="text-[11px] text-muted">
                  Add {formatINR(freeThreshold - subtotal)} more for free delivery.
                </p>
              )}
              <div className="hairline-t pt-3 flex justify-between">
                <span className="font-semibold text-text">Total</span>
                <span className="text-lg font-bold text-text">{formatINR(total)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-subtle hover:bg-primary-hover active:scale-[0.99] transition-all"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <p className="mt-3 text-center text-[11px] text-muted">
              Printed on order · India Post Speed Post Delivery
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
