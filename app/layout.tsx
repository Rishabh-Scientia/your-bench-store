import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/components/cart/CartContext";
import { AuthProvider } from "@/components/auth/AuthContext";
import { Toaster } from "sonner";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.yourbench.store";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "YourBench Store — Print-on-Order Hard Copy Books",
    template: "%s | YourBench Store",
  },
  description:
    "Curated physical books printed fresh on order and delivered across India via India Post Speed Post. Quality binding, soft-touch matte finish, zero warehouse pulping.",
  keywords: [
    "YourBench Store",
    "YourBench",
    "online bookstore India",
    "print on order books",
    "buy books online",
    "India Post Speed Post",
    "hard copy books",
    "AI books India",
    "technology books",
  ],
  authors: [{ name: "YourBench" }],
  creator: "YourBench",
  publisher: "YourBench Store",
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: "/logos/logo-icon.png",
    shortcut: "/logos/logo-icon.png",
    apple: "/logos/logo-icon.png",
  },
  openGraph: {
    title: "YourBench Store — Print-on-Order Hard Copy Books",
    description:
      "Physical books printed fresh on order and shipped across India via India Post Speed Post.",
    url: siteUrl,
    siteName: "YourBench Store",
    images: [
      {
        url: "/logos/logo-primary.png",
        width: 1100,
        height: 861,
        alt: "YourBench Store",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "YourBench Store — Print-on-Order Hard Copy Books",
    description:
      "Curated physical books printed fresh on order and delivered across India via India Post Speed Post.",
    images: ["/logos/logo-primary.png"],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BookStore",
  name: "YourBench Store",
  url: siteUrl,
  logo: `${siteUrl}/logos/logo-primary.png`,
  description:
    "Curated hard-copy books printed fresh on order and shipped directly across India via India Post Speed Post.",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91-9389603320",
    contactType: "customer service",
    email: "yoursbench@gmail.com",
    areaServed: "IN",
  },
  sameAs: ["https://www.yourbench.store"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans min-h-screen flex flex-col bg-background text-text">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <Toaster
              position="top-right"
              richColors
              toastOptions={{
                style: {
                  borderRadius: "0.75rem",
                },
              }}
            />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
