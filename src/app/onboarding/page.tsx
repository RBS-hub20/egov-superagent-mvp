import { Suspense } from "react";
import type { Metadata } from "next";
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";

export const metadata: Metadata = {
  title: "Get started",
  description:
    "Three things to know before you hand SuperAgent an errand: how to ask, how your ID stays yours, and why no fixer is ever needed.",
  // A first-run gate has nothing useful to rank; keep it out of the index.
  robots: { index: false, follow: true },
};

export default function OnboardingPage() {
  return (
    <Suspense fallback={null}>
      <OnboardingFlow />
    </Suspense>
  );
}
