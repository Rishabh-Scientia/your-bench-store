"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthContext";
import { User, Mail, Package, Truck, LogOut, ArrowRight, ShieldCheck, Loader2 } from "lucide-react";

export default function CustomerProfilePage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/profile");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="py-24 flex items-center justify-center gap-2 text-sm text-muted">
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
        <span>Loading your profile...</span>
      </div>
    );
  }

  const fullName =
    user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    "Valued Reader";

  return (
    <div className="py-12 sm:py-16">
      <div className="container mx-auto max-w-[800px] px-4 sm:px-6">
        <div className="rounded-2xl bg-white p-6 sm:p-8 hairline-border shadow-subtle space-y-8">
          {/* Header Profile Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 hairline-b">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-soft text-primary font-bold text-xl hairline-border">
                {fullName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="font-serif text-2xl font-bold text-text">
                  {fullName}
                </h1>
                <p className="text-xs sm:text-sm text-muted">{user.email}</p>
                <div className="mt-1 inline-flex items-center gap-1.5 text-[11px] font-semibold text-primary">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified YourBench Customer</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={signOut}
              className="inline-flex items-center gap-1.5 rounded-xl bg-surface hairline-border px-4 py-2 text-xs font-semibold text-muted hover:text-red-600 hover:bg-red-50 transition-colors self-start sm:self-auto"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>

          {/* Quick Action Navigation Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/orders"
              className="group rounded-xl bg-surface p-5 hairline-border transition-all hover:bg-white hover:shadow-card flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-primary hairline-border">
                  <Package className="w-5 h-5 stroke-[1.8]" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm text-text group-hover:text-primary transition-colors">
                    My Orders
                  </h3>
                  <p className="text-xs text-muted">
                    View order history &amp; reprints
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
            </Link>

            <Link
              href="/track"
              className="group rounded-xl bg-surface p-5 hairline-border transition-all hover:bg-white hover:shadow-card flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-primary hairline-border">
                  <Truck className="w-5 h-5 stroke-[1.8]" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm text-text group-hover:text-primary transition-colors">
                    Track Speed Post
                  </h3>
                  <p className="text-xs text-muted">
                    Real-time India Post tracking
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
            </Link>
          </div>

          {/* Account Details Box */}
          <div className="rounded-xl bg-surface p-5 hairline-border space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text">
              Account Credentials
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-muted block">Registered Email</span>
                <span className="font-semibold text-text">{user.email}</span>
              </div>
              <div>
                <span className="text-muted block">Member Since</span>
                <span className="font-semibold text-text">
                  {new Date(user.created_at).toLocaleDateString("en-IN", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
