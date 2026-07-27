import type { Metadata, Viewport } from "next";
import "./globals.css";
import { BRAND, PRODUCT, TAGLINE } from "@/lib/brand";
import { SITE_URL } from "@/lib/site";
import { THEME_INIT_SCRIPT, ThemeProvider } from "@/components/theme/theme-provider";

const DESCRIPTION =
  "The Autonomous eGov OS for 115M Filipinos. Utusan mo lang — SSS, PhilHealth, Pag-IBIG at PSA in one agent, with a locally encrypted vault and an Anti-Fixer Receipt for every transaction.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${PRODUCT} — ${TAGLINE}`,
    template: `%s — ${PRODUCT}`,
  },
  description: DESCRIPTION,
  applicationName: PRODUCT,
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/logos/egov-favicon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/logos/egov-favicon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/logos/egov-favicon-512.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/logos/egov-favicon.ico",
    apple: { url: "/logos/egov-favicon-180.png", sizes: "180x180" },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    siteName: PRODUCT,
    locale: "en_PH",
    url: SITE_URL,
    title: `${PRODUCT} — ${TAGLINE}`,
    description: DESCRIPTION,
    images: [{ url: "/logos/egov-superagent-lockup-light.png", alt: PRODUCT }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${PRODUCT} — ${TAGLINE}`,
    description: DESCRIPTION,
    images: ["/logos/egov-superagent-lockup-light.png"],
  },
};

export const viewport: Viewport = {
  // Browser chrome follows the active theme; light is the default surface.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FEFEFF" },
    { media: "(prefers-color-scheme: dark)", color: BRAND.bg },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Applies the stored theme before first paint — no flash of light for
            a returning dark-mode visitor. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
