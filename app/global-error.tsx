"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import "./globals.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[YourBench Root Error]:", error);
  }, [error]);

  return (
    <html lang="en">
      <head>
        <title>YourBench Store — Print-on-Order Hard Copy Books</title>
        <meta
          name="description"
          content="Curated physical books printed fresh on order and delivered across India via India Post Speed Post."
        />
      </head>
      <body className="font-sans min-h-screen flex items-center justify-center bg-background text-text px-4 py-16">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="space-y-2">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-text">
              YourBench Store
            </h1>
            <p className="text-sm text-muted">
              We encountered a temporary error loading this edition. Please refresh to continue.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => reset()}
              className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-subtle hover:bg-primary-hover transition-colors"
            >
              Refresh Page
            </button>
            <a
              href="/"
              className="inline-flex items-center justify-center rounded-xl bg-surface hairline-border px-6 py-3 text-sm font-semibold text-text hover:bg-white transition-colors"
            >
              Store Homepage
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
