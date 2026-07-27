import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // eGov SuperAgent brand kit — Philippine flag palette on a deep navy
        // canvas. Mirrors BRAND in src/lib/brand.ts.
        egov: {
          bg: "#050A18",
          surface: "#0A1024",
          navy: "#0A2156",
          action: "#1E90FF",
          yellow: "#FCD116",
          red: "#CE1126",
          green: "#20C997",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
