"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import { Lock, Mail, Eye, EyeOff, ArrowLeft, ShieldAlert, Sparkles } from "lucide-react";
import { toast } from "sonner";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/admin";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      toast.success("Welcome back! Signed in successfully.");
      router.push(redirectPath);
      router.refresh();
    } catch (err) {
      setError("An unexpected error occurred. Please check your credentials.");
      setLoading(false);
    }
  };

  const handleDemoAccess = () => {
    document.cookie = "yb_admin_demo=true; path=/; max-age=86400; SameSite=Lax";
    toast.success("Demo admin session active. Welcome to YourBench Store Admin!");
    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl bg-white p-8 shadow-card hairline-border">
        {/* Brand Logo */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-block mb-3">
            <Image
              src="/logos/logo-full.png"
              alt="YourBench Store"
              width={160}
              height={48}
              priority
              className="mx-auto h-10 w-auto object-contain"
            />
          </Link>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-0.5 text-xs font-semibold text-primary mb-2">
            <span>Admin Console</span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-text">Welcome Back</h1>
          <p className="mt-1 text-xs text-muted">
            Sign in with your authorized admin account to manage orders, books, and dispatch.
          </p>
        </div>

        {error && (
          <div className="mb-5 flex items-start gap-2.5 rounded-xl bg-red-50 border border-red-200 p-3.5 text-xs text-red-700">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
            <div>
              <p className="font-semibold">Authentication Failed</p>
              <p className="mt-0.5">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@yourbench.com"
                className="w-full rounded-xl bg-surface hairline-border py-2.5 pl-10 pr-4 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full rounded-xl bg-surface hairline-border py-2.5 pl-10 pr-10 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-text"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-subtle hover:bg-primary-hover disabled:opacity-50 transition-colors"
          >
            {loading ? "Signing in..." : "Sign In to Admin Console"}
          </button>
        </form>

        {/* Demo / Quick Test Button */}
        <div className="mt-4 pt-4 hairline-t">
          <button
            type="button"
            onClick={handleDemoAccess}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-surface hairline-border px-4 py-2.5 text-xs font-semibold text-text hover:bg-primary-soft hover:text-primary transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Instant Demo Preview (Explore Admin Console)</span>
          </button>
        </div>

        <div className="mt-6 pt-5 hairline-t text-center text-xs text-muted space-y-2">
          <p>
            Create an admin account in your{" "}
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-medium hover:underline"
            >
              Supabase Auth Dashboard
            </a>{" "}
            and add the email to the <code className="bg-surface px-1.5 py-0.5 rounded text-[11px]">admins</code> table.
          </p>
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Storefront</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="text-sm text-muted">Loading Admin Console...</div>}>
      <LoginForm />
    </Suspense>
  );
}
