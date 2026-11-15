"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import {
  LayoutDashboard,
  BookOpen,
  ShoppingCart,
  Settings,
  LogOut,
  ExternalLink,
  Plus,
} from "lucide-react";
import { toast } from "sonner";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Books Catalog", href: "/admin/books", icon: BookOpen },
  { label: "Orders & Shipping", href: "/admin/orders", icon: ShoppingCart },
  { label: "Store Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      // Clear demo cookie
      document.cookie = "yb_admin_demo=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      const supabase = createClient();
      await supabase.auth.signOut();
      toast.success("Signed out successfully");
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      toast.error("Error signing out");
    }
  };

  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col bg-white hairline-border border-t-0 border-b-0 border-l-0 min-h-screen">
      {/* Brand & Admin Badge */}
      <div className="p-5 hairline-b">
        <Link href="/" target="_blank" className="inline-block group">
          <Image
            src="/logos/logo-full.png"
            alt="YourBench Store"
            width={150}
            height={44}
            className="h-8 w-auto object-contain"
          />
        </Link>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary-soft px-2 py-0.5 rounded">
            Admin Console
          </span>
          <Link
            href="/"
            target="_blank"
            className="text-[11px] text-muted hover:text-primary flex items-center gap-1 transition-colors"
          >
            <span>View Store</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary-soft text-primary font-semibold"
                  : "text-muted hover:text-text hover:bg-surface"
              }`}
            >
              <Icon className="w-4 h-4 stroke-[1.8]" />
              <span>{item.label}</span>
            </Link>
          );
        })}

        <div className="pt-4">
          <Link
            href="/admin/books/new"
            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2.5 text-xs font-semibold text-white shadow-subtle hover:bg-primary-hover transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Book</span>
          </Link>
        </div>
      </nav>

      {/* Sign Out */}
      <div className="p-3 hairline-t">
        <button
          type="button"
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted hover:text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
