/**
 * Typed access to the MVP fixtures.
 *
 * Every number on screen comes from `/mocks/*.json` — there is no live SSS /
 * PhilHealth / PSA integration in this build, and nothing here talks to a real
 * agency endpoint.
 */
import sssJson from "@mocks/sss.json";
import philHealthJson from "@mocks/philhealth.json";
import psaJson from "@mocks/psa.json";

export type ContributionStatus = "Paid" | "Posted" | "Pending" | "Late";

export interface SssContribution {
  period: string;
  employer: string;
  amount: number;
  status: string;
  postedAt: string;
  orNumber: string;
}

export interface SssRecord {
  agency: string;
  member: {
    name: string;
    sssNumber: string;
    membershipType: string;
    employer: string;
    monthlyContribution: number;
    employerShare: number;
    employeeShare: number;
    status: string;
    lastPosted: string;
  };
  contributions: SssContribution[];
  totals: {
    postedMonths: number;
    postedAmount: number;
    creditedYearsOfService: number;
    totalCreditedContributions: number;
  };
  nextDue: { period: string; dueDate: string; amount: number; channel: string };
  benefitsEligibility: { benefit: string; eligible: boolean; note: string }[];
}

export interface PhilHealthRecord {
  agency: string;
  member: {
    name: string;
    philHealthId: string;
    category: string;
    employer: string;
    status: string;
    effectiveDate: string;
    validUntil: string;
    monthlyPremium: number;
    premiumRate: string;
  };
  dependents: { name: string; relationship: string; birthDate: string; status: string }[];
  contributions: { period: string; employer: string; amount: number; status: string }[];
  benefits: { name: string; detail: string; available: boolean }[];
  provider: { name: string; konsultaProvider: string; lastAvailment: string };
}

export type PsaStepStatus = "done" | "current" | "pending";

export interface PsaRecord {
  agency: string;
  request: {
    trackingNumber: string;
    document: string;
    ownerName: string;
    copies: number;
    purpose: string;
    requestedAt: string;
    etaDays: number;
    etaDate: string;
    fee: number;
    paymentStatus: string;
    referenceCode: string;
  };
  steps: { key: string; label: string; detail: string; status: PsaStepStatus; at: string | null }[];
  pickup: {
    branch: string;
    address: string;
    hours: string;
    landmark: string;
    coordinates: { lat: number; lng: number };
    queueEstimate: string;
  };
  qr: { payload: string; note: string };
}

export const sss = sssJson as SssRecord;
export const philHealth = philHealthJson as PhilHealthRecord;
export const psa = psaJson as PsaRecord;

export interface Agency {
  id: "sss" | "philhealth" | "pagibig" | "psa";
  name: string;
  full: string;
  connected: boolean;
  detail: string;
}

export const AGENCIES: Agency[] = [
  { id: "sss", name: "SSS", full: "Social Security System", connected: true, detail: "Contributions, loans, PRN" },
  { id: "philhealth", name: "PhilHealth", full: "Philippine Health Insurance Corp.", connected: true, detail: "Membership, dependents, Konsulta" },
  { id: "pagibig", name: "Pag-IBIG", full: "Home Development Mutual Fund", connected: true, detail: "MP2 savings, housing loan" },
  { id: "psa", name: "PSA", full: "Philippine Statistics Authority", connected: true, detail: "Birth, marriage, CENOMAR" },
];

export interface MemoryFact {
  label: string;
  value: string;
  detail: string;
}

/**
 * Facts the agent has learned and reuses without asking again.
 *
 * Built from the connected profile, so a visitor who has not connected an ID
 * sees an empty graph instead of somebody else's life.
 */
export function memoryFactsFor(user: {
  name: string;
  verified: boolean;
  location: string;
  philSysMasked?: string;
  employer?: string;
}): MemoryFact[] {
  if (!user.verified) return [];
  return [
    {
      label: "PhilSys ID",
      value: user.philSysMasked ?? "Not yet linked",
      detail: user.philSysMasked ? "Read from the ID in your vault" : "Add an ID to the vault to link it",
    },
    {
      label: "Employed at",
      value: user.employer ?? sss.member.employer,
      detail: "Employer files your contributions monthly",
    },
    {
      label: "SSS contribution",
      value: `${peso(sss.member.monthlyContribution)}/mo`,
      detail: "Auto-checked every payday",
    },
    {
      label: "Home branch",
      value: psa.pickup.branch,
      detail: `Nearest releasing counter • ${user.location}`,
    },
  ];
}

/** The Anti-Fixer Receipt tracked in the right rail. */
export const RECEIPT = {
  trackingNumber: psa.request.trackingNumber,
  agency: "SSS",
  service: "Contribution verification + PSA birth certificate",
  requestedLabel: "Just now",
  etaLabel: `${psa.request.etaDays} days`,
  etaDate: psa.request.etaDate,
  progress: 60,
  stage: "Verifying",
  officialFee: 365,
  paidTo: "PSA (GCash reference PSA-SECPA-8891)",
  auditTrail: [
    // {name} is filled in at render time from the connected profile.
    { at: "09:12", event: "Request filed by SuperAgent on behalf of {name}" },
    { at: "09:13", event: "Official fee P365 paid — no service charge, no fixer" },
    { at: "14:40", event: "PSA Civil Registry began record verification" },
  ],
} as const;

/** Seed documents shown in the vault before the user adds their own. */
export const SEED_VAULT_DOCS = [
  { name: "SSS_ID.pdf", type: "application/pdf", size: 412_000 },
  { name: "PhilHealth_ID.png", type: "image/png", size: 286_500 },
  { name: "Valid_ID.jpg", type: "image/jpeg", size: 1_240_000 },
] as const;

/** Peso formatting used everywhere in the UI (P1,350 — never $). */
export function peso(amount: number, opts?: { decimals?: boolean }): string {
  return `P${amount.toLocaleString("en-PH", {
    minimumFractionDigits: opts?.decimals ? 2 : 0,
    maximumFractionDigits: opts?.decimals ? 2 : 0,
  })}`;
}

/** Short Manila-time date label, e.g. "30 Jul 2026". */
export function phDate(value: string | Date): string {
  const d = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("en-PH", {
    timeZone: "Asia/Manila",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}

export function fileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
