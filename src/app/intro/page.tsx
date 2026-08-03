import type { Metadata } from "next";
import { IntroScreen } from "@/components/intro/intro-screen";

export const metadata: Metadata = {
  title: "Get started",
  alternates: { canonical: "/intro" },
  // A funnel step between the landing and sign-up; the landing is the page
  // that should rank.
  robots: { index: false, follow: true },
};

export default function IntroPage() {
  return <IntroScreen />;
}
