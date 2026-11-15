"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X, ArrowRight } from "lucide-react";
import { useCart } from "@/components/cart/CartContext";

export function Navbar() {
  const pathname = usePathname();
  const { itemCount, isLoaded } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Hide public navbar on admin pages AFTER all hooks have executed
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const navLinks = [
    { label: "Books", href: "/books" },
    { label: "About", href: "/about" },
    { label: "Track Order", href: "/track" },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full bg-white transition-shadow duration-200 ${
          scrolled ? "shadow-subtle" : ""
        } hairline-b`}
      >
        <div className="container mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 sm:px-6">
          {/* Brand Logo — Original clean full logo from assets */}
          <Link
            href="/"
            className="flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg py-1"
          >
            <Image
              src="/logos/logo-full.png"
              alt="YourBench Store"
              width={160}
              height={44}
              priority
              className="h-9 w-auto object-contain transition-opacity group-hover:opacity-90"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1.5 py-1 ${
                    isActive ? "text-primary font-semibold" : "text-muted"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right side: Cart + Mobile Toggle */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/cart"
              aria-label="Shopping Cart"
              className="relative flex items-center justify-center p-2 rounded-xl text-text hover:text-primary hover:bg-surface transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
              {isLoaded && itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-bold text-white shadow-sm">
                  {itemCount}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="md:hidden flex items-center justify-center p-2 rounded-xl text-text hover:bg-surface transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-in Drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-white p-6 shadow-xl flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-6 hairline-b">
                <Image
                  src="/logos/logo-full.png"
                  alt="YourBench Store"
                  width={140}
                  height={40}
                  className="h-8 w-auto object-contain"
                />
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-muted hover:text-text hover:bg-surface"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-col gap-2 py-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center justify-between py-3 px-3 rounded-lg text-base font-medium transition-colors ${
                      pathname === link.href
                        ? "bg-primary-soft text-primary font-semibold"
                        : "text-text hover:bg-surface"
                    }`}
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="w-4 h-4 text-muted" />
                  </Link>
                ))}
              </div>
            </div>
            <div className="pt-6 hairline-t">
              <Link
                href="/cart"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-hover transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>View Cart ({itemCount})</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
