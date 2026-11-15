"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Package,
  Truck,
  Clock,
  ShieldCheck,
  Search,
  ExternalLink,
  ShoppingBag,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  User,
} from "lucide-react";
import { formatINR } from "@/lib/utils";
import { Order, OrderStatus } from "@/types";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/AuthContext";

export default function YourOrdersPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Enforce customer login: if not logged in, redirect to /login
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/orders&message=Please sign in to view your orders.");
    }
  }, [user, authLoading, router]);

  // Load customer orders from Supabase using user email / stored orders
  useEffect(() => {
    async function fetchCustomerOrders() {
      if (!user) return;

      try {
        const savedPhone = localStorage.getItem("yb_customer_phone") || "";
        const savedOrderIdsRaw = localStorage.getItem("yb_customer_orders");
        const savedOrderIds = savedOrderIdsRaw ? JSON.parse(savedOrderIdsRaw) : [];

        const res = await fetch("/api/customer/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.email,
            phone: savedPhone,
            orderIds: savedOrderIds,
          }),
        });

        const data = await res.json();
        if (data.success && data.orders) {
          setOrders(data.orders);
        }
      } catch (err) {
        console.error("Failed to load customer orders:", err);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchCustomerOrders();
    }
  }, [user]);

  const getStatusInfo = (status: OrderStatus) => {
    switch (status) {
      case "paid":
        return {
          label: "Order Paid & Queued",
          badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
          desc: "Payment verified. Ready for typesetting and printing on order.",
        };
      case "printing":
        return {
          label: "Printing on Order",
          badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
          desc: "Your edition is being typeset, printed, and soft-touch laminated.",
        };
      case "shipped":
        return {
          label: "Dispatched via Speed Post",
          badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
          desc: "Dispatched through India Post Speed Post. Live tracking active.",
        };
      case "delivered":
        return {
          label: "Delivered",
          badgeClass: "bg-green-100 text-green-800 border-green-300",
          desc: "Delivered directly to your bench.",
        };
      case "cancelled":
        return {
          label: "Cancelled & Refunded",
          badgeClass: "bg-red-50 text-red-700 border-red-200",
          desc: "Order has been cancelled and refunded.",
        };
      default:
        return {
          label: "Processing",
          badgeClass: "bg-gray-100 text-gray-700 border-gray-200",
          desc: "Processing order.",
        };
    }
  };

  if (authLoading || (!user && loading)) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3 text-muted">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <p className="text-sm">Verifying your account session...</p>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12">
      <div className="container mx-auto max-w-[1200px] px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 hairline-b">
          <div>
            <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider mb-1">
              <Package className="w-4 h-4" />
              <span>Customer Account</span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-text">
              My Orders
            </h1>
            <p className="mt-1 text-sm text-muted">
              Signed in as <strong className="text-text">{user?.email}</strong>. Track Speed Post consignments and past hard-copy purchases.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/profile"
              className="inline-flex items-center gap-1.5 rounded-xl bg-surface hairline-border px-3.5 py-2 text-xs font-semibold text-text hover:bg-white hover:text-primary transition-colors"
            >
              <User className="w-3.5 h-3.5 text-primary" />
              <span>My Profile</span>
            </Link>

            <Link
              href="/books"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary hover:underline"
            >
              <span>Explore Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Orders Listing */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-muted">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <p className="text-sm">Fetching your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center rounded-2xl bg-white hairline-border shadow-subtle my-8">
            <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-full bg-surface text-muted mb-4">
              <ShoppingBag className="h-7 w-7 stroke-[1.5]" />
            </div>
            <h2 className="font-serif text-xl font-bold text-text">
              No orders found for this account
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-muted max-w-md mx-auto">
              You haven&apos;t placed any hard-copy book orders yet with {user?.email}. Browse our catalog to place your first order!
            </p>
            <div className="mt-6">
              <Link
                href="/books"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-subtle hover:bg-primary-hover transition-colors"
              >
                <span>Browse Curated Books</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6 my-8">
            {orders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              const orderDate = new Date(order.created_at).toLocaleDateString(
                "en-IN",
                {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }
              );

              // Direct link to /track with prefilled orderId and phone
              const trackUrl = `/track?orderId=${encodeURIComponent(
                order.id
              )}&phone=${encodeURIComponent(order.customer_phone)}`;

              return (
                <div
                  key={order.id}
                  className="rounded-2xl bg-white hairline-border shadow-subtle overflow-hidden transition-all hover:shadow-card"
                >
                  {/* Card Header (Amazon style bar) */}
                  <div className="bg-surface px-5 py-3.5 hairline-b flex flex-wrap items-center justify-between gap-4 text-xs">
                    <div className="flex flex-wrap items-center gap-6 sm:gap-10">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-muted tracking-wider block">
                          Order Placed
                        </span>
                        <span className="font-semibold text-text">{orderDate}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-muted tracking-wider block">
                          Total Amount
                        </span>
                        <span className="font-bold text-text">
                          {formatINR(order.total_amount)}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-muted tracking-wider block">
                          Ship To
                        </span>
                        <span className="font-medium text-text">
                          {order.customer_name} (
                          {order.shipping_address?.city || "India"})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-muted tracking-wider block">
                          Order ID
                        </span>
                        <span className="font-mono font-bold text-text">
                          {order.id}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 sm:p-6 space-y-6">
                    {/* Status Badge & Speed Post Alert */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 hairline-b">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`rounded-full px-3 py-0.5 text-xs font-semibold border ${statusInfo.badgeClass}`}
                          >
                            {statusInfo.label}
                          </span>
                        </div>
                        <p className="text-xs text-muted">{statusInfo.desc}</p>
                      </div>

                      {order.tracking_number ? (
                        <div className="flex items-center gap-2 bg-primary-soft text-primary px-3 py-1.5 rounded-xl text-xs font-semibold">
                          <Truck className="w-4 h-4" />
                          <span>Speed Post: {order.tracking_number}</span>
                          <a
                            href="https://www.indiapost.gov.in/_layouts/15/dpt.cpt.tracking/trackconsignment.aspx"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-1 text-primary hover:underline inline-flex items-center gap-0.5"
                          >
                            <span>Track on India Post</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-xs text-muted">
                          <Clock className="w-3.5 h-3.5 text-primary" />
                          <span>Dispatches within 2 business days</span>
                        </div>
                      )}
                    </div>

                    {/* Ordered Items List */}
                    <div className="space-y-4">
                      {order.items && order.items.length > 0 ? (
                        order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                          >
                            <div className="flex items-start gap-4">
                              <div className="relative h-20 w-14 shrink-0 rounded-lg overflow-hidden bg-surface hairline-border">
                                {item.cover_url ? (
                                  <img
                                    src={item.cover_url}
                                    alt={item.title}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="h-full w-full flex items-center justify-center text-muted">
                                    <Package className="w-5 h-5" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <h3 className="font-serif text-sm sm:text-base font-bold text-text">
                                  {item.title}
                                </h3>
                                <p className="text-xs text-muted">
                                  by {item.author || "YourBench Author"}
                                </p>
                                <p className="mt-1 text-xs font-semibold text-text">
                                  Qty: {item.quantity} · {formatINR(item.price)}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 self-end sm:self-auto">
                              <Link
                                href={trackUrl}
                                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-hover transition-colors shadow-subtle"
                              >
                                <Truck className="w-3.5 h-3.5" />
                                <span>Track Speed Post</span>
                              </Link>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-serif text-sm font-semibold text-text">
                              Hard-copy Books Order ({formatINR(order.total_amount)})
                            </h3>
                            <p className="text-xs text-muted">
                              Pan-India Speed Post Delivery
                            </p>
                          </div>
                          <Link
                            href={trackUrl}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-hover transition-colors shadow-subtle"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            <span>Track Speed Post</span>
                          </Link>
                        </div>
                      )}
                    </div>

                    {/* Delivery Address Details */}
                    <div className="pt-3 hairline-t text-xs text-muted flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <p>
                        <strong>Delivery Address:</strong>{" "}
                        {order.shipping_address?.addressLine1}
                        {order.shipping_address?.addressLine2
                          ? `, ${order.shipping_address.addressLine2}`
                          : ""}
                        , {order.shipping_address?.city},{" "}
                        {order.shipping_address?.state} -{" "}
                        <strong>{order.shipping_address?.pincode}</strong>
                      </p>
                      <span className="text-[11px] text-muted">
                        Payment: Razorpay Verified
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
