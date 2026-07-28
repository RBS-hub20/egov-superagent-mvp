import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Owner Console",
  robots: { index: false, follow: false },
};

/**
 * The console is always dark, whatever the public theme is set to — it is an
 * operator tool, not part of the themed product surface.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-[100dvh] bg-[#0A0A0B]">{children}</div>;
}
