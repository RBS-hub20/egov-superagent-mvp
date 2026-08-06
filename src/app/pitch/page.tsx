import type { Metadata } from "next";
import { PitchHeader } from "@/components/pitch/header";
import {
  Agencies,
  Comparison,
  Hero,
  HowItWorks,
  PitchFooter,
  Problem,
  SmsAccess,
  Solution,
  Status,
  Vision,
} from "@/components/pitch/sections";

export const metadata: Metadata = {
  title: "One chat. Lahat ng government services.",
  description:
    "eGov SuperAgent is an AI concierge for Philippine government services. From eTravel to PSA to SSS — isang chat lang, with official references, receipts and a public verification page.",
  alternates: { canonical: "/pitch" },
  openGraph: {
    title: "eGov SuperAgent — One chat. Lahat ng government services.",
    description:
      "From eTravel to PSA to SSS — isang chat lang. Taglish? Okay. Official references, receipts, and a verification page for every request.",
    url: "/pitch",
  },
};

/**
 * The public product page.
 *
 * Everything on it is written for citizens, OFWs and partners: what the service
 * does, how a request is handled, and what proof comes back. It deliberately
 * carries no commercial or operational internals.
 *
 * Only the header is a client component; every section below is static, so the
 * page ships almost no JavaScript.
 */
export default function PitchPage() {
  return (
    <div className="min-h-[100dvh] bg-[#0A1931] text-white antialiased">
      <PitchHeader />
      <main>
        <Hero />
        <Problem />
        <Solution />
        <SmsAccess />
        <Agencies />
        <HowItWorks />
        <Comparison />
        <Status />
        <Vision />
      </main>
      <PitchFooter />
    </div>
  );
}
