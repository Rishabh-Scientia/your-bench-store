"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/auth/AuthContext";
import { useCart } from "@/components/cart/CartContext";
import { Lock, Mail, User, Eye, EyeOff, ArrowLeft, ShieldAlert, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

function CustomerLoginForm() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signIn, signUp } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectPath = searchParams.get("redirect") || "/orders";
  const message = searchParams.get("message");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (mode === "signup") {
      if (!fullName.trim()) {
        setError("Please enter your full name");
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        setLoading(false);
        return;
      }

      const res = await signUp(email.trim(), password, fullName.trim());
      if (!res.success) {
        setError(res.error || "Failed to create account");
        setLoading(false);
        return;
      }

      toast.success("Account created successfully! Welcome to YourBench Store.");
      router.push(redirectPath);
      router.refresh();
    } else {
      const res = await signIn(email.trim(), password);
      if (!res.success) {
        setError(res.error || "Invalid email or password");
        setLoading(false);
        return;
      }

      toast.success("Signed in successfully. Welcome back!");
      router.push(redirectPath);
      router.refresh();
    }
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
              height={44}
              priority
              className="mx-auto h-9 w-auto object-contain"
            />
          </Link>
          <h1 className="font-serif text-2xl font-bold text-text">
            {mode === "signin" ? "Welcome Back" : "Create Customer Account"}
          </h1>
          <p className="mt-1 text-xs text-muted">
            {mode === "signin"
              ? "Sign in to manage your orders, delivery addresses, and fast checkout."
              : "Register to track your Speed Post print orders and manage your bench library."}
          </p>
        </div>

        {/* Informational Message Banner if passed */}
        {message && (
          <div className="mb-5 flex items-start gap-2.5 rounded-xl bg-primary-soft border border-primary/20 p-3 text-xs text-primary">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
            <p className="font-medium">{message}</p>
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div className="mb-5 flex items-start gap-2.5 rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-700">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
            <p>{error}</p>
          </div>
        )}

        {/* Mode Switcher Tabs */}
        <div className="flex rounded-xl bg-surface p-1 hairline-border mb-6">
          <button
            type="button"
            onClick={() => {
              setMode("signin");
              setError("");
            }}
            className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
              mode === "signin"
                ? "bg-white text-text shadow-sm"
                : "text-muted hover:text-text"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setError("");
            }}
            className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
              mode === "signup"
                ? "bg-white text-text shadow-sm"
                : "text-muted hover:text-text"
            }`}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="e.g. Rahul Sharma"
                  className="w-full rounded-xl bg-surface hairline-border py-2.5 pl-10 pr-4 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text mb-1.5">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full rounded-xl bg-surface hairline-border py-2.5 pl-10 pr-4 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text mb-1.5">
              Password *
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
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-subtle hover:bg-primary-hover disabled:opacity-50 transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : mode === "signin" ? (
              <span>Sign In</span>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 hairline-t text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue browsing books</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CustomerLoginPage() {
  return (
    <div className="py-12 sm:py-16 min-h-[75vh] flex items-center justify-center px-4">
      <Suspense fallback={<div className="text-sm text-muted">Loading Login...</div>}>
        <CustomerLoginForm />
      </Suspense>
    </div>
  );
}
