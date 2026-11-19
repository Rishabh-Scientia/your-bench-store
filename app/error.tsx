"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { BookOpen, RefreshCw, Home } from "lucide-react";

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[YourBench Error Boundary]:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-surface hairline-border text-primary shadow-subtle">
          <BookOpen className="h-8 w-8 stroke-[1.8]" />
        </div>

        <div className="space-y-2">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text">
            Something went wrong
          </h1>
          <p className="text-sm text-muted">
            We encountered an unexpected issue while loading this page. Please try refreshing or return to the bookstore.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-subtle hover:bg-primary-hover transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-surface hairline-border px-6 py-3 text-sm font-semibold text-text hover:bg-white hover:text-primary transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
