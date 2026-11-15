"use client";

import React from "react";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart/CartContext";
import { Book } from "@/types";

export function AddToCartButton({ book }: { book: Book }) {
  const { addItem } = useCart();

  return (
    <button
      type="button"
      onClick={() => addItem(book, 1)}
      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-subtle hover:bg-primary-hover active:scale-[0.99] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      <ShoppingBag className="w-4 h-4" />
      <span>Add to Cart</span>
    </button>
  );
}

export default AddToCartButton;
