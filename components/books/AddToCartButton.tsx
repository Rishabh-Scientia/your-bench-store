"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { ShoppingBag, Zap } from "lucide-react";
import { useCart } from "@/components/cart/CartContext";
import { useAuth } from "@/components/auth/AuthContext";
import { Book } from "@/types";
import { toast } from "sonner";

export function AddToCartButton({ book }: { book: Book }) {
  const router = useRouter();
  const pathname = usePathname();
  const { addItem } = useCart();
  const { user } = useAuth();

  const handleAddToCart = () => {
    if (!user) {
      toast.info("Please sign in to add books to your cart");
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    addItem(book, 1);
  };

  const handleOrderNow = () => {
    if (!user) {
      toast.info("Please sign in to proceed with your order");
      router.push(`/login?redirect=/checkout`);
      return;
    }

    addItem(book, 1);
    router.push("/checkout");
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
      {/* Primary: Order Now (Instant Checkout) */}
      <button
        type="button"
        onClick={handleOrderNow}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-subtle hover:bg-primary-hover active:scale-[0.99] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <Zap className="w-4 h-4 fill-white" />
        <span>Order Now</span>
      </button>

      {/* Secondary: Add to Cart */}
      <button
        type="button"
        onClick={handleAddToCart}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-surface hairline-border px-7 py-3.5 text-sm font-semibold text-text hover:bg-white hover:text-primary active:scale-[0.99] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <ShoppingBag className="w-4 h-4" />
        <span>Add to Cart</span>
      </button>
    </div>
  );
}

export default AddToCartButton;
