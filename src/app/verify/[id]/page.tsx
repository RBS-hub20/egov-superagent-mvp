import type { Metadata } from "next";
import { VerifyRecord } from "@/components/verify/verify-record";

export const metadata: Metadata = {
  title: "Record check",
  description:
    "Check an eGov SuperAgent reference — eTravel declarations (ETR-PH-…) and Anti-Fixer Receipts (EGOV-…).",
  // Every record is device-local, so there is nothing here for a crawler.
  robots: { index: false, follow: false },
};

export default function VerifyPage({ params }: { params: { id: string } }) {
  return <VerifyRecord id={params.id} />;
}
