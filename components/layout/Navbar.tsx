"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ShoppingBag,
  Menu,
  X,
  ArrowRight,
  Package,
  User as UserIcon,
  ChevronDown,
  LogOut,
  Truck,
} from "lucide-react";
import { useCart } from "@/components/cart/CartContext";
import { useAuth } from "@/components/auth/AuthContext";

export function Navbar() {
  const pathname = usePathname();
  const { itemCount, isLoaded } = useCart();
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  }, [pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Hide public navbar on admin pages AFTER all hooks have executed
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  // Public links - "Your Orders" is intentionally ONLY shown when logged in or inside profile dropdown!
  const navLinks = [
    { label: "Books", href: "/books" },
    { label: "Track Order", href: "/track" },
    { label: "About", href: "/about" },
  ];

  const displayName =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Account";
  const userInitials = displayName.charAt(0).toUpperCase();

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full bg-white transition-shadow duration-200 ${
          scrolled ? "shadow-subtle" : ""
        } hairline-b`}
      >
        <div className="container mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 sm:px-6">
          {/* Brand Logo */}
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

          {/* Right side: User Profile / Sign In + Cart + Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* User Profile Section in Top Right Corner */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  onMouseEnter={() => setProfileDropdownOpen(true)}
                  aria-label="User account menu"
                  className="inline-flex items-center gap-2 rounded-xl bg-surface hairline-border py-1.5 px-3 text-xs font-semibold text-text hover:bg-white hover:text-primary transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white text-[10px] font-bold">
                    {userInitials}
                  </div>
                  <span className="hidden sm:inline max-w-[110px] truncate">
                    {displayName}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-muted" />
                </button>

                {/* Profile Hover / Click Dropdown Menu */}
                {profileDropdownOpen && (
                  <div
                    onMouseLeave={() => setProfileDropdownOpen(false)}
                    className="absolute right-0 mt-2 w-56 rounded-2xl bg-white p-2 shadow-xl hairline-border z-50 animate-in fade-in"
                  >
                    <div className="px-3 py-2.5 hairline-b">
                      <p className="text-xs font-bold text-text truncate">
                        {displayName}
                      </p>
                      <p className="text-[11px] text-muted truncate">
                        {user.email}
                      </p>
                    </div>

                    <div className="py-1 space-y-0.5">
                      <Link
                        href="/profile"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-text hover:bg-surface hover:text-primary transition-colors"
                      >
                        <UserIcon className="w-4 h-4 text-primary" />
                        <span>My Profile</span>
                      </Link>

                      <Link
                        href="/orders"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-text hover:bg-surface hover:text-primary transition-colors"
                      >
                        <Package className="w-4 h-4 text-primary" />
                        <span>My Orders</span>
                      </Link>

                      <Link
                        href="/track"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-text hover:bg-surface hover:text-primary transition-colors"
                      >
                        <Truck className="w-4 h-4 text-primary" />
                        <span>Track Speed Post</span>
                      </Link>
                    </div>

                    <div className="pt-1 hairline-t">
                      <button
                        type="button"
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          signOut();
                        }}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-muted hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 rounded-xl bg-surface hairline-border px-3.5 py-1.5 text-xs font-semibold text-text hover:text-primary hover:bg-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <UserIcon className="w-3.5 h-3.5 text-muted" />
                <span>Sign In</span>
              </Link>
            )}

            {/* Shopping Bag / Cart */}
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

            {/* Mobile Menu Toggle Button */}
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

              {/* User banner in mobile drawer */}
              <div className="py-4 hairline-b">
                {user ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-text truncate">
                        {displayName}
                      </p>
                      <p className="text-xs text-muted truncate">{user.email}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        signOut();
                      }}
                      className="text-xs font-semibold text-red-600 hover:underline"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-surface hairline-border py-2.5 text-xs font-semibold text-text hover:bg-white"
                  >
                    <UserIcon className="w-4 h-4 text-primary" />
                    <span>Sign In to Account</span>
                  </Link>
                )}
              </div>

              <div className="flex flex-col gap-2 py-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-medium transition-colors ${
                      pathname === link.href
                        ? "bg-primary-soft text-primary font-semibold"
                        : "text-text hover:bg-surface"
                    }`}
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="w-4 h-4 text-muted" />
                  </Link>
                ))}

                {user && (
                  <>
                    <Link
                      href="/orders"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-medium transition-colors ${
                        pathname === "/orders"
                          ? "bg-primary-soft text-primary font-semibold"
                          : "text-text hover:bg-surface"
                      }`}
                    >
                      <span>My Orders</span>
                      <Package className="w-4 h-4 text-primary" />
                    </Link>

                    <Link
                      href="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-medium transition-colors ${
                        pathname === "/profile"
                          ? "bg-primary-soft text-primary font-semibold"
                          : "text-text hover:bg-surface"
                      }`}
                    >
                      <span>My Profile</span>
                      <UserIcon className="w-4 h-4 text-primary" />
                    </Link>
                  </>
                )}
              </div>
            </div>

            <div className="pt-4 hairline-t">
              <Link
                href="/cart"
                onClick={() => setMobileMenuOpen(false)}
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
