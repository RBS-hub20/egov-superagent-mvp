import type { Metadata } from "next";
import { PitchDeck } from "@/components/pitch/pitch-deck";

export const metadata: Metadata = {
  title: "Pitch — One Chat. All Government.",
  description:
    "eGov SuperAgent: the AI concierge for Philippine e-government. Problem, solution, SMS offline mode, the live Immigration pipeline, market and the ask.",
  alternates: { canonical: "/pitch" },
  // Public by link, out of search. The deck carries pricing, projections and an
  // ask — things to hand to someone deliberately, not to rank for.
  robots: { index: false, follow: false },
};

/**
 * The pitch deck. Public, no auth, no gate — anyone with the link can read it.
 */
export default function PitchPage() {
  return <PitchDeck />;
}
