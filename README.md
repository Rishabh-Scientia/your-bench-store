# YourBench Store 📚

A modern, minimalist print-on-order online bookstore crafted for **YourBench**. Every book is freshly printed on order and shipped directly across India via **India Post Speed Post**.

---

## ⚡ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Custom Design System
- **Database & Storage:** Supabase (PostgreSQL, Storage)
- **UI & Motion:** Lucide Icons, Framer Motion, Sonner
- **Logistics:** India Post Speed Post PAN-India delivery
- **Deployment:** Vercel

---

## 🎨 Design System

- **Background:** `#FFFFFF` (Pure White)
- **Surface:** `#F7FAF8` (Subtle Warm Tint)
- **Border:** `#E5EBE7` (Hairline Borders)
- **Primary Green:** `#0A8F18` (From YourBench Master Brand Logo)
- **Typography:** Inter for clean UI, Fraunces / Serif for book titles & headings

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Rishabh-Scientia/your-bench-store.git
cd your-bench-store
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the storefront.

---

## ☁️ Deploying on Vercel

1. Push your repository to GitHub.
2. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your `your-bench-store` repository.
4. In the **Environment Variables** section, add your production keys:
   - `NEXT_PUBLIC_SUPABASE_URL` (or `supabase_Project_url`)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (or `supabase_Publishable_Key`)
   - `NEXT_PUBLIC_SITE_URL` (your production URL)
   - `SUPABASE_SERVICE_ROLE_KEY` *(Optional / Server-only)*
   - `RAZORPAY_KEY_ID` *(Optional for live payments)*
   - `RAZORPAY_KEY_SECRET` *(Optional for live payments)*
   - `RESEND_API_KEY` *(Optional for transactional dispatch emails)*
5. Click **Deploy**.

---

## 📦 Features

- **Storefront:** Dynamic book catalog, category filters, and responsive search.
- **Speed Post Tracking:** Real-time lookup with India Post consignment tracking IDs.
- **Admin Console (`/admin`):**
  - Live book catalog management.
  - Speed Post tracking ID assignment and order status updates.
  - Printable A5 shipping labels / packing slips.
  - Dynamic store settings (shipping rates, thresholds, dispatch contacts).
- **Compliance & Transparency:** Full Shipping, Refund/Cancellation, Terms, and Privacy policies.

---

© 2026 YourBench Store. A YourBench company.
