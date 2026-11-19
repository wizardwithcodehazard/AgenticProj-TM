import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        revolut: {
          dark: "#0b0e14",
          card: "#121824",
          border: "#1f293d",
          accent: "#2563eb",
          accentHover: "#1d4ed8",
          silver: "#94a3b8",
          gold: "#f59e0b",
          platinum: "#a855f7",
          green: "#10b981",
        }
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      }
    },
  },
  plugins: [],
};
export default config;
