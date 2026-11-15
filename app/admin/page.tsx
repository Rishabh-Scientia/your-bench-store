"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  BookOpen,
  DollarSign,
  Printer,
  Truck,
  Plus,
  ArrowRight,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { formatINR } from "@/lib/utils";
import { createClient } from "@/lib/supabase/browser";
import { Book, Order } from "@/types";
import { SAMPLE_BOOKS } from "@/lib/data/sampleBooks";

export default function AdminDashboardPage() {
  const [books, setBooks] = useState<Book[]>(SAMPLE_BOOKS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const supabase = createClient();

        // 1. Fetch books
        const { data: booksData } = await supabase
          .from("books")
          .select("*")
          .order("created_at", { ascending: false });

        if (booksData && booksData.length > 0) {
          setBooks(booksData as Book[]);
        }

        // 2. Fetch orders
        const { data: ordersData } = await supabase
          .from("orders")
          .select("*, items:order_items(*)")
          .order("created_at", { ascending: false });

        if (ordersData) {
          setOrders(ordersData as Order[]);
        }
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  // Compute live metrics
  const totalOrders = orders.length;
  const booksInCatalog = books.length;
  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
  const awaitingPrinting = orders.filter(
    (o) => o.status === "printing" || o.status === "paid"
  ).length;

  const stats = [
    {
      label: "Total Orders",
      value: String(totalOrders),
      subtext: "All time recorded orders",
      icon: ShoppingCart,
      color: "text-blue-600 bg-blue-50 border-blue-100",
    },
    {
      label: "Books in Catalog",
      value: String(booksInCatalog),
      subtext: "Published & ready to print",
      icon: BookOpen,
      color: "text-primary bg-primary-soft border-primary/20",
    },
    {
      label: "Total Revenue",
      value: formatINR(totalRevenue),
      subtext: "Net paid orders",
      icon: DollarSign,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
    {
      label: "Awaiting Printing",
      value: String(awaitingPrinting),
      subtext: "Queued for print bench",
      icon: Printer,
      color: "text-amber-600 bg-amber-50 border-amber-100",
    },
  ];

  const pendingOrders = orders.filter(
    (o) => o.status === "printing" || o.status === "paid"
  );

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text">
            Dashboard Overview
          </h1>
          <p className="mt-1 text-sm text-muted">
            Live overview of YourBench Store print operations, orders, and Speed Post fulfillment.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/books/new"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-subtle hover:bg-primary-hover transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Book</span>
          </Link>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 rounded-xl bg-white hairline-border px-4 py-2.5 text-xs sm:text-sm font-medium text-text hover:bg-surface transition-colors"
          >
            <ShoppingCart className="w-4 h-4 text-muted" />
            <span>Manage Orders</span>
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-2xl bg-white p-5 hairline-border shadow-subtle"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-muted uppercase tracking-wider">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-2xl sm:text-3xl font-bold text-text">
                    {loading ? "..." : stat.value}
                  </p>
                  <p className="mt-1 text-[11px] text-muted">{stat.subtext}</p>
                </div>
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl border ${stat.color}`}
                >
                  <Icon className="w-5 h-5 stroke-[2]" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Section: Awaiting Printing & Quick Setup */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Awaiting Printing Queue */}
        <div className="lg:col-span-2 rounded-2xl bg-white p-6 hairline-border shadow-subtle">
          <div className="flex items-center justify-between pb-4 hairline-b">
            <div>
              <h2 className="font-serif text-lg font-bold text-text">
                Awaiting Printing (Queue)
              </h2>
              <p className="text-xs text-muted">
                Orders verified and ready to be printed on order.
              </p>
            </div>
            <span className="rounded-full bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 text-xs font-semibold">
              {pendingOrders.length} Pending
            </span>
          </div>

          {pendingOrders.length === 0 ? (
            <div className="py-12 text-center">
              <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-surface text-muted mb-3">
                <Printer className="h-6 w-6 stroke-[1.5]" />
              </div>
              <p className="font-serif font-semibold text-text">All caught up!</p>
              <p className="mt-1 text-xs text-muted max-w-sm mx-auto">
                There are no orders waiting in the printing queue. New customer orders will show here with one-click Speed Post label generation.
              </p>
            </div>
          ) : (
            <div className="mt-4 divide-y divide-border">
              {pendingOrders.map((order) => (
                <div key={order.id} className="py-3 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-sm text-text">{order.id}</span>
                    <p className="text-xs text-muted">
                      {order.customer_name} · {order.shipping_address?.city}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-xs text-text">
                      {formatINR(order.total_amount)}
                    </span>
                    <Link
                      href="/admin/orders"
                      className="rounded-lg bg-surface px-3 py-1 text-xs font-semibold text-text hover:bg-primary hover:text-white transition-colors"
                    >
                      Print Slip
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dispatch & Speed Post Integration Guide */}
        <div className="rounded-2xl bg-white p-6 hairline-border shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider mb-2">
              <Truck className="w-4 h-4" />
              <span>Speed Post Dispatch</span>
            </div>
            <h3 className="font-serif font-bold text-base text-text">
              Fulfillment Workflow
            </h3>
            <div className="mt-4 space-y-3 text-xs text-muted">
              <div className="flex items-start gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary font-bold text-[10px]">
                  1
                </span>
                <p>
                  <strong className="text-text">Customer Orders:</strong> Hard copy printed on order within 2 business days.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary font-bold text-[10px]">
                  2
                </span>
                <p>
                  <strong className="text-text">Print &amp; Pack:</strong> Bound with soft-touch matte lamination and packaged in moisture-proof mailers.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary font-bold text-[10px]">
                  3
                </span>
                <p>
                  <strong className="text-text">Speed Post Booking:</strong> Hand over to India Post, enter the Tracking ID in Orders, and the customer automatically receives dispatch updates.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 hairline-t">
            <Link
              href="/admin/settings"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
            >
              <span>Manage Shipping Fee &amp; Thresholds</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Catalog Quick Preview */}
      <div className="rounded-2xl bg-white p-6 hairline-border shadow-subtle">
        <div className="flex items-center justify-between pb-4 hairline-b">
          <div>
            <h2 className="font-serif text-lg font-bold text-text">
              Active Book Catalog
            </h2>
            <p className="text-xs text-muted">
              Books currently live on the storefront.
            </p>
          </div>
          <Link
            href="/admin/books"
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            <span>View All ({books.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="mt-4 divide-y divide-border">
          {books.map((book) => (
            <div
              key={book.id}
              className="py-3.5 flex items-center justify-between gap-4 first:pt-0 last:pb-0"
            >
              <div className="flex items-center gap-3">
                <div className="h-12 w-9 rounded bg-surface overflow-hidden shrink-0 hairline-border relative">
                  <img
                    src={book.cover_url}
                    alt={book.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-semibold text-text line-clamp-1">
                    {book.title}
                  </h4>
                  <p className="text-xs text-muted">{book.author} · {book.category}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <span className="font-bold text-text">{formatINR(book.price)}</span>
                <span
                  className={`rounded-full px-2 py-0.5 font-semibold ${
                    book.published
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-gray-100 text-gray-600 border border-gray-200"
                  }`}
                >
                  {book.published ? "Published" : "Draft"}
                </span>
                <Link
                  href={`/books/${encodeURIComponent(book.slug)}`}
                  target="_blank"
                  className="text-muted hover:text-primary p-1"
                  title="View on store"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
