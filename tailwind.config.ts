import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Landing palette. Light is the default surface; `dark:` variants carry
        // the night theme. Kept separate from `egov` so the console's fixed
        // dark chrome can never be dragged into a theme switch.
        lp: {
          primary: "#0F46F3",
          glow: "#3B82F6",
          ink: "#0A1931",
          body: "#475569",
          line: "#E2E8F0",
          yellow: "#FFC700",
          red: "#E7000B",
          "dark-bg": "#050A1E",
          "dark-bg-2": "#0F1C3F",
          "dark-card": "#101A33",
          "dark-line": "#1E2B4D",
          "dark-text": "#F8FAFC",
          "dark-muted": "#94A3B8",
        },
        // Console (/app) chrome — fixed dark, never themed.
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
