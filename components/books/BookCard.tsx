"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Book } from "@/types";
import { formatINR } from "@/lib/utils";
import { Printer, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart/CartContext";

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  const { addItem } = useCart();
  const bookUrl = `/books/${encodeURIComponent(book.slug || book.id)}`;

  return (
    <div className="group relative flex flex-col rounded-xl bg-white hairline-border p-3 sm:p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover">
      {/* 2:3 Cover Aspect Ratio Image Container */}
      <Link
        href={bookUrl}
        className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <Image
          src={book.cover_url}
          alt={book.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />

        {/* Small Green "Print on order" Badge */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1 rounded-full bg-white/95 px-2 py-0.5 text-[11px] font-semibold text-primary shadow-subtle backdrop-blur-sm">
          <Printer className="w-3 h-3 text-primary stroke-[2.2]" />
          <span>Print on order</span>
        </div>
      </Link>

      {/* Book Details */}
      <div className="mt-3.5 flex flex-1 flex-col justify-between">
        <div>
          <span className="text-[11px] font-medium tracking-wide uppercase text-muted">
            {book.category}
          </span>
          <Link
            href={bookUrl}
            className="mt-1 block focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded"
          >
            <h3 className="font-serif text-base font-semibold leading-snug text-text transition-colors group-hover:text-primary line-clamp-2">
              {book.title}
            </h3>
          </Link>
          <p className="mt-1 text-xs text-muted line-clamp-1">{book.author}</p>
        </div>

        {/* Price & Add to Cart Action */}
        <div className="mt-4 pt-3 hairline-t flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-text">
              {formatINR(book.price)}
            </span>
            {book.mrp && book.mrp > book.price && (
              <span className="text-xs text-muted line-through">
                {formatINR(book.mrp)}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              addItem(book, 1);
            }}
            aria-label={`Add ${book.title} to cart`}
            className="flex items-center gap-1.5 rounded-lg bg-surface hover:bg-primary hover:text-white px-2.5 py-1.5 text-xs font-medium text-text transition-all duration-150 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookCard;
