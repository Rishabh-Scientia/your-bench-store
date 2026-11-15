import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
      },
      screens: {
        "2xl": "1200px",
      },
    },
    extend: {
      colors: {
        background: "var(--background)",
        surface: "var(--surface)",
        border: "var(--border)",
        text: "var(--text)",
        muted: "var(--muted)",
        primary: {
          DEFAULT: "var(--primary)",
          hover: "var(--primary-hover)",
          soft: "var(--primary-soft)",
          foreground: "#FFFFFF",
        },
        status: {
          paid: "#0A8F18",
          printing: "#D97706",
          shipped: "#2563EB",
          delivered: "#059669",
          cancelled: "#DC2626",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-heading)", "Georgia", "serif"],
      },
      borderRadius: {
        DEFAULT: "0.75rem",
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        subtle: "0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)",
        card: "0 2px 8px -2px rgba(15, 26, 20, 0.06), 0 1px 4px -1px rgba(15, 26, 20, 0.04)",
        "card-hover": "0 10px 24px -4px rgba(15, 26, 20, 0.08), 0 4px 12px -2px rgba(15, 26, 20, 0.04)",
      },
      borderWidth: {
        hairline: "1px",
      },
    },
  },
  plugins: [],
};

export default config;
