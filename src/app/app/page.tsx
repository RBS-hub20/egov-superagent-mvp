import type { Metadata } from "next";
import { AppShell } from "@/components/egov/app-shell";
import { OnboardingGate } from "@/components/onboarding/onboarding-gate";

export const metadata: Metadata = {
  title: "SuperAgent Console",
  description:
    "Chat with SuperAgent to check SSS contributions, PhilHealth membership and PSA requests — with a locally encrypted vault and an Anti-Fixer Receipt.",
  alternates: { canonical: "/app" },
};

export default function SuperAgentAppPage() {
  return (
    <OnboardingGate>
      <AppShell />
    </OnboardingGate>
  );
}
