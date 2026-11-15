"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  ShoppingCart,
  Copy,
  Printer,
  Truck,
  Eye,
  Loader2,
  PackageX,
} from "lucide-react";
import { formatINR } from "@/lib/utils";
import { Order, OrderStatus } from "@/types";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/browser";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<string>("All");
  const [search, setSearch] = useState<string>("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingInput, setTrackingInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch real orders from Supabase
  useEffect(() => {
    async function loadOrders() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("orders")
          .select("*, items:order_items(*)")
          .order("created_at", { ascending: false });

        if (data && !error) {
          setOrders(data as Order[]);
        }
      } catch (e) {
        console.error("Failed to load orders:", e);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  const filters = ["All", "paid", "printing", "shipped", "delivered", "cancelled"];

  const filteredOrders = orders.filter((order) => {
    const matchesFilter =
      filter === "All" || order.status.toLowerCase() === filter.toLowerCase();
    const matchesSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      order.customer_phone.includes(search);
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "paid":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "printing":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "shipped":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-300";
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const supabase = createClient();
      await supabase.from("orders").update({ status: newStatus }).eq("id", orderId);
    } catch (e) {
      console.error("Error updating order status:", e);
    }

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    if (selectedOrder?.id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    toast.success(`Order status updated to "${newStatus}"`);
  };

  const handleSaveTracking = async (orderId: string) => {
    if (!trackingInput.trim()) {
      toast.error("Please enter a valid Speed Post tracking number");
      return;
    }

    const tracking = trackingInput.trim();

    try {
      const supabase = createClient();
      await supabase
        .from("orders")
        .update({ tracking_number: tracking, status: "shipped" })
        .eq("id", orderId);
    } catch (e) {
      console.error("Error saving tracking number:", e);
    }

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, tracking_number: tracking, status: "shipped" }
          : o
      )
    );
    if (selectedOrder?.id === orderId) {
      setSelectedOrder((prev) =>
        prev
          ? { ...prev, tracking_number: tracking, status: "shipped" }
          : null
      );
    }
    toast.success(`Tracking number ${tracking} saved and marked as Shipped!`);
    setTrackingInput("");
  };

  const handleCopyAddress = (order: Order) => {
    const addr = order.shipping_address;
    const text = `${addr.fullName}
${addr.phone}
${addr.addressLine1}${addr.addressLine2 ? "\n" + addr.addressLine2 : ""}
${addr.city}, ${addr.state} - ${addr.pincode}
India`;
    navigator.clipboard.writeText(text);
    toast.success("Shipping address copied to clipboard!");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-text">
            Orders &amp; Speed Post Fulfillment
          </h1>
          <p className="text-xs sm:text-sm text-muted">
            Manage print queue, assign India Post Speed Post tracking numbers, and view packing slips.
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl hairline-border shadow-subtle">
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-colors ${
                filter === f
                  ? "bg-primary text-white"
                  : "bg-surface hairline-border text-muted hover:text-text"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order ID, customer, phone..."
            className="w-full rounded-xl bg-surface hairline-border py-2 pl-9 pr-4 text-xs sm:text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl bg-white hairline-border shadow-subtle overflow-hidden">
        {loading ? (
          <div className="py-16 flex items-center justify-center gap-2 text-sm text-muted">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <span>Loading orders from database...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-surface hairline-b text-muted uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Order ID &amp; Date</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Speed Post Tracking</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center">
                      <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-surface text-muted mb-3">
                        <PackageX className="h-6 w-6 stroke-[1.5]" />
                      </div>
                      <p className="font-serif font-semibold text-text">No orders found</p>
                      <p className="mt-1 text-xs text-muted max-w-sm mx-auto">
                        There are currently no customer orders. When someone places an order on the store, it will immediately appear here.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-surface/50 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-text">{order.id}</span>
                        <p className="text-[11px] text-muted">
                          {new Date(order.created_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-text">
                          {order.customer_name}
                        </div>
                        <div className="text-xs text-muted">
                          {order.customer_phone}
                        </div>
                        <div className="text-[11px] text-muted">
                          {order.shipping_address?.city},{" "}
                          {order.shipping_address?.state}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-text">
                          {formatINR(order.total_amount)}
                        </span>
                        <p className="text-[10px] text-muted">
                          {order.items?.length || 1} book(s)
                        </p>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold border ${getStatusBadge(
                            order.status
                          )}`}
                        >
                          {order.status.toUpperCase()}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        {order.tracking_number ? (
                          <span className="font-mono text-xs font-semibold text-primary">
                            {order.tracking_number}
                          </span>
                        ) : (
                          <span className="text-xs text-muted italic">
                            Awaiting dispatch
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedOrder(order);
                            setTrackingInput(order.tracking_number || "");
                          }}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-surface px-3 py-1.5 text-xs font-semibold text-text hover:bg-primary hover:text-white transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View / Manage</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-2xl shadow-xl hairline-border p-6 max-h-[90vh] overflow-y-auto space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 hairline-b">
              <div>
                <span className="text-xs font-bold text-primary uppercase">
                  Order Details
                </span>
                <h3 className="font-serif text-xl font-bold text-text">
                  {selectedOrder.id}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="rounded-lg p-2 text-muted hover:text-text hover:bg-surface"
              >
                ✕
              </button>
            </div>

            {/* Status & India Post Dispatch Section */}
            <div className="rounded-xl bg-surface p-4 hairline-border space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text mb-1">
                    Order Status
                  </label>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) =>
                      handleStatusChange(
                        selectedOrder.id,
                        e.target.value as OrderStatus
                      )
                    }
                    className="rounded-lg bg-white hairline-border px-3 py-1.5 text-xs font-semibold text-text focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="paid">Paid</option>
                    <option value="printing">Printing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="flex-1 max-w-xs">
                  <label className="block text-xs font-bold uppercase tracking-wider text-text mb-1">
                    Speed Post Tracking ID
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={trackingInput}
                      onChange={(e) => setTrackingInput(e.target.value)}
                      placeholder="e.g. ED123456789IN"
                      className="w-full rounded-lg bg-white hairline-border py-1.5 px-3 text-xs font-mono text-text focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveTracking(selectedOrder.id)}
                      className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover transition-colors whitespace-nowrap"
                    >
                      Save &amp; Ship
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer & Address Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl bg-white p-4 hairline-border space-y-1 text-xs">
                <span className="font-bold text-muted uppercase text-[10px]">
                  Customer Contact
                </span>
                <p className="font-semibold text-sm text-text">
                  {selectedOrder.customer_name}
                </p>
                <p className="text-muted">{selectedOrder.customer_phone}</p>
                <p className="text-muted">{selectedOrder.customer_email}</p>
              </div>

              <div className="rounded-xl bg-white p-4 hairline-border space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-muted uppercase text-[10px]">
                    Shipping Address (Speed Post)
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyAddress(selectedOrder)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy Address</span>
                  </button>
                </div>
                <p className="text-muted leading-relaxed">
                  {selectedOrder.shipping_address?.addressLine1}
                  {selectedOrder.shipping_address?.addressLine2 && (
                    <>, {selectedOrder.shipping_address.addressLine2}</>
                  )}
                  <br />
                  {selectedOrder.shipping_address?.city},{" "}
                  {selectedOrder.shipping_address?.state} -{" "}
                  <strong>{selectedOrder.shipping_address?.pincode}</strong>
                </p>
              </div>
            </div>

            {/* Items Ordered */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-text">
                Ordered Hard Copies (Print Snapshot)
              </span>
              <div className="divide-y divide-border hairline-border rounded-xl bg-white overflow-hidden">
                {selectedOrder.items && selectedOrder.items.length > 0 ? (
                  selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="p-3.5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-9 rounded bg-surface overflow-hidden hairline-border relative">
                          <img
                            src={item.cover_url}
                            alt={item.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-serif font-semibold text-xs sm:text-sm text-text">
                            {item.title}
                          </h4>
                          <p className="text-xs text-muted">by {item.author}</p>
                        </div>
                      </div>
                      <div className="text-right text-xs">
                        <span className="font-bold text-text">
                          {formatINR(item.price)} × {item.quantity}
                        </span>
                        <p className="font-bold text-primary">
                          {formatINR(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-xs text-muted">No items recorded for this order.</div>
                )}
              </div>
            </div>

            {/* Pricing Total */}
            <div className="pt-2 hairline-t flex justify-between text-xs sm:text-sm font-semibold">
              <span className="text-muted">Total Paid via Razorpay:</span>
              <span className="text-base font-bold text-text">
                {formatINR(selectedOrder.total_amount)}
              </span>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 hairline-t flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 rounded-xl bg-surface hairline-border px-4 py-2.5 text-xs font-semibold text-text hover:bg-white transition-colors"
              >
                <Printer className="w-3.5 h-3.5 text-primary" />
                <span>Print A5 Packing Slip</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-white hover:bg-primary-hover transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
