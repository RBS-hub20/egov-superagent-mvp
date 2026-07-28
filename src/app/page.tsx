import type { Metadata } from "next";
import { IntroScreen } from "@/components/intro/intro-screen";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function IntroPage() {
  return <IntroScreen />;
}
