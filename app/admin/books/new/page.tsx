"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Upload, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/browser";

export default function NewBookPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    author: "",
    description: "",
    price: "",
    mrp: "",
    category: "Technology & Code",
    cover_url: "",
    pages: "",
    language: "English",
    isbn: "",
    kindle_url: "",
    weight_grams: "450",
    ships_in_days: "2",
    published: true,
    featured: false,
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const generatedSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev.slug === "" || prev.slug === generatedSlug.slice(0, -1) ? generatedSlug : prev.slug,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();
      const payload = {
        title: formData.title,
        slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, "-"),
        author: formData.author,
        description: formData.description,
        price: parseFloat(formData.price),
        mrp: formData.mrp ? parseFloat(formData.mrp) : null,
        category: formData.category,
        cover_url: formData.cover_url || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
        pages: formData.pages ? parseInt(formData.pages) : null,
        language: formData.language,
        isbn: formData.isbn || null,
        kindle_url: formData.kindle_url || null,
        weight_grams: formData.weight_grams ? parseInt(formData.weight_grams) : 450,
        ships_in_days: parseInt(formData.ships_in_days) || 2,
        published: formData.published,
        featured: formData.featured,
      };

      const { error } = await supabase.from("books").insert([payload]);

      if (error) {
        toast.error(`Database error: ${error.message}`);
        setLoading(false);
        return;
      }

      toast.success("Book successfully added to catalog!");
      router.push("/admin/books");
      router.refresh();
    } catch (err) {
      toast.error("An error occurred while saving the book.");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/books"
          className="p-2 rounded-xl bg-white hairline-border text-muted hover:text-text hover:bg-surface transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-serif text-2xl font-bold text-text">Add New Book</h1>
          <p className="text-xs text-muted">
            Configure new print-on-order book metadata, paper specs, and pricing.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Book Information */}
        <div className="rounded-2xl bg-white p-6 hairline-border shadow-subtle space-y-4">
          <h2 className="font-serif text-base font-bold text-text">General Information</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text mb-1.5">
                Book Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={handleTitleChange}
                required
                placeholder="e.g. Designing Data-Intensive Applications"
                className="w-full rounded-xl bg-surface hairline-border py-2.5 px-4 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text mb-1.5">
                URL Slug *
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                required
                placeholder="e.g. designing-data-intensive-applications"
                className="w-full rounded-xl bg-surface hairline-border py-2.5 px-4 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text mb-1.5">
                Author(s) *
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                required
                placeholder="e.g. Martin Kleppmann"
                className="w-full rounded-xl bg-surface hairline-border py-2.5 px-4 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text mb-1.5">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full rounded-xl bg-surface hairline-border py-2.5 px-4 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="Technology & Code">Technology &amp; Code</option>
                <option value="Philosophy & Ideas">Philosophy &amp; Ideas</option>
                <option value="Business & Economics">Business &amp; Economics</option>
                <option value="Design & Architecture">Design &amp; Architecture</option>
                <option value="Non-Fiction">Non-Fiction</option>
                <option value="Fiction">Fiction</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text mb-1.5">
              Description *
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              placeholder="Summary, table of contents overview, print craftsmanship notes..."
              className="w-full rounded-xl bg-surface hairline-border p-4 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Pricing & Manufacturing Specs */}
        <div className="rounded-2xl bg-white p-6 hairline-border shadow-subtle space-y-4">
          <h2 className="font-serif text-base font-bold text-text">Pricing &amp; Print Specifications</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text mb-1.5">
                Selling Price (₹) *
              </label>
              <input
                type="number"
                step="1"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                placeholder="799"
                className="w-full rounded-xl bg-surface hairline-border py-2.5 px-4 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text mb-1.5">
                MRP (₹ Strikethrough)
              </label>
              <input
                type="number"
                step="1"
                value={formData.mrp}
                onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                placeholder="999"
                className="w-full rounded-xl bg-surface hairline-border py-2.5 px-4 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text mb-1.5">
                Page Count
              </label>
              <input
                type="number"
                value={formData.pages}
                onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
                placeholder="320"
                className="w-full rounded-xl bg-surface hairline-border py-2.5 px-4 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text mb-1.5">
                ISBN
              </label>
              <input
                type="text"
                value={formData.isbn}
                onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                placeholder="978-93-91234-01-2"
                className="w-full rounded-xl bg-surface hairline-border py-2.5 px-4 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text mb-1.5">
                Weight (Grams)
              </label>
              <input
                type="number"
                value={formData.weight_grams}
                onChange={(e) => setFormData({ ...formData, weight_grams: e.target.value })}
                placeholder="450"
                className="w-full rounded-xl bg-surface hairline-border py-2.5 px-4 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text mb-1.5">
                Ships in (Days) *
              </label>
              <input
                type="number"
                value={formData.ships_in_days}
                onChange={(e) => setFormData({ ...formData, ships_in_days: e.target.value })}
                required
                placeholder="2"
                className="w-full rounded-xl bg-surface hairline-border py-2.5 px-4 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text mb-1.5">
              Cover Image URL *
            </label>
            <input
              type="url"
              value={formData.cover_url}
              onChange={(e) => setFormData({ ...formData, cover_url: e.target.value })}
              placeholder="https://images.unsplash.com/... or Supabase storage public URL"
              className="w-full rounded-xl bg-surface hairline-border py-2.5 px-4 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="mt-1 text-[11px] text-muted">
              You can paste an image URL or upload directly to the &quot;book-covers&quot; Supabase Storage bucket.
            </p>
          </div>
        </div>

        {/* Visibility Toggles */}
        <div className="rounded-2xl bg-white p-6 hairline-border shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="published"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="h-4 w-4 rounded text-primary focus:ring-primary"
            />
            <label htmlFor="published" className="text-sm font-medium text-text cursor-pointer">
              Publish immediately on storefront
            </label>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="h-4 w-4 rounded text-primary focus:ring-primary"
            />
            <label htmlFor="featured" className="text-sm font-medium text-text cursor-pointer">
              Show in Featured section on Home page
            </label>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end gap-3">
          <Link
            href="/admin/books"
            className="rounded-xl px-5 py-3 text-sm font-medium text-muted hover:text-text hover:bg-white transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-subtle hover:bg-primary-hover disabled:opacity-50 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? "Saving Book..." : "Save & Publish Book"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
