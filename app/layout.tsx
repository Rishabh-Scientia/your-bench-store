import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/components/cart/CartContext";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "YourBench Store — Print-on-Order Hard Copy Books",
    template: "%s | YourBench Store",
  },
  description:
    "Curated physical books printed fresh on order and delivered across India via India Post Speed Post. Thoughtful reading for creators, builders, and thinkers.",
  keywords: [
    "YourBench",
    "online bookstore",
    "print on order",
    "India Post Speed Post",
    "hard copy books",
    "engineering books",
  ],
  authors: [{ name: "YourBench" }],
  icons: {
    icon: "/logos/logo-icon.png",
    apple: "/logos/logo-icon.png",
  },
  openGraph: {
    title: "YourBench Store — Print-on-Order Hard Copy Books",
    description:
      "Physical books printed fresh on order and shipped across India via India Post Speed Post.",
    url: "https://yourbench.in",
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
      </head>
      <body className="font-sans min-h-screen flex flex-col bg-background text-text">
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
      </body>
    </html>
  );
}
