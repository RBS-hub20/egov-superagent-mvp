import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Check,
  Clock,
  Database,
  FileCheck2,
  Globe2,
  KeyRound,
  Lock,
  MessageSquare,
  Plane,
  Radio,
  ShieldCheck,
  Signal,
  Smartphone,
  Truck,
  Users,
  X,
  Zap,
} from "lucide-react";
import { AppIcon } from "@/components/brand/app-icon";
import { Card, Eyebrow, Lede, Pill, Slide, Stat, StepNumber, Title } from "./ui";
import { LICENSEE } from "@/lib/brand";
import { AGENCIES } from "@/lib/data";

/** The rail on the right and the keyboard navigation both read this. */
export const SLIDES = [
  { id: "cover", label: "Cover" },
  { id: "problem", label: "Problem" },
  { id: "solution", label: "Solution" },
  { id: "sms", label: "SMS offline" },
  { id: "agencies", label: "Agencies" },
  { id: "how", label: "How it works" },
  { id: "shipped", label: "Shipped" },
  { id: "why", label: "Why we win" },
  { id: "market", label: "Market" },
  { id: "traction", label: "Traction" },
  { id: "gtm", label: "Go to market" },
  { id: "ask", label: "Team & ask" },
] as const;

/* --------------------------------------------------------------- 1 ------- */

function Cover() {
  return (
    <Slide id="cover" className="items-center text-center">
      <div className="flex flex-col items-center">
        <span className="relative">
          <span
            className="pointer-events-none absolute -inset-10 rounded-full blur-3xl"
            style={{ background: "radial-gradient(circle, rgba(15,70,243,0.45), transparent 70%)" }}
            aria-hidden
          />
          <AppIcon size={96} priority className="relative" />
        </span>

        <h1
          className="mt-9 text-balance font-bold leading-[1.02] tracking-tighter text-white"
          style={{ fontSize: "clamp(40px, 7vw, 84px)" }}
        >
          One Chat. <span className="text-[#FFC300]">All Government.</span>
        </h1>

        <p className="mt-6 max-w-2xl text-pretty text-[19px] leading-relaxed text-[#9DB0CE]">
          eGov SuperAgent is the AI concierge for Philippine e-government — for{" "}
          <span className="font-semibold text-white">115M Filipinos</span> at home and{" "}
          <span className="font-semibold text-white">10M OFWs</span> abroad.{" "}
          <span className="font-semibold text-white">Utusan mo lang.</span>
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-[#0F46F3] px-7 py-3.5 text-[15px] font-semibold text-white shadow-[0_0_28px_-6px_rgba(15,70,243,0.9)] transition hover:scale-[1.02] hover:bg-[#0D3DD6]"
          >
            Launch App
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/app"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-7 py-3.5 text-[15px] font-semibold text-white transition hover:border-[#FFC300]/50 hover:text-[#FFC300]"
          >
            View Live
          </Link>
        </div>

        <p className="mt-10 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#5C7099]">
          Built by {LICENSEE.name}
        </p>
      </div>
    </Slide>
  );
}

/* --------------------------------------------------------------- 2 ------- */

const PROBLEMS = [
  { title: "eGovPH", body: "Down or hanging when you need it. Nobody to ask, nobody accountable." },
  { title: "My.SSS", body: "OTP never arrives, session expires, back to the login screen." },
  { title: "PSA", body: "Four hours of pila for one birth certificate — a whole day's wage gone." },
  { title: "eTravel", body: "Confusing form, filled at the airport, wrong entry means a missed flight." },
  { title: "Fixer", body: "₱500–₱1,000 to skip the line. No receipt, no recourse, sometimes no filing." },
];

function Problem() {
  return (
    <Slide id="problem">
      <Eyebrow>The problem</Eyebrow>
      <Title>
        7 Apps. 7 Pila. <span className="text-[#FFC300]">7 Passwords.</span>
      </Title>
      <Lede>
        Every agency shipped its own portal and stopped there. What a citizen actually needs — one
        errand, done, with proof — nobody owns.
      </Lede>

      <div className="mt-10 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {PROBLEMS.map((p) => (
          <Card key={p.title} tone={p.title === "Fixer" ? "danger" : "default"}>
            <div className="flex items-center gap-2">
              {p.title === "Fixer" ? (
                <AlertTriangle className="h-4 w-4 text-rose-400" />
              ) : (
                <X className="h-4 w-4 text-[#5C7099]" />
              )}
              <p className="text-[15px] font-bold text-white">{p.title}</p>
            </div>
            <p className="mt-2 text-[13.5px] leading-relaxed text-[#9DB0CE]">{p.body}</p>
          </Card>
        ))}

        <Card tone="gold" className="flex flex-col justify-center">
          <div className="flex items-baseline gap-2">
            <p className="text-[34px] font-bold leading-none tracking-tighter text-[#FFC300]">60%</p>
            <p className="text-[13px] font-semibold text-white">have no eGovPH account</p>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <p className="text-[34px] font-bold leading-none tracking-tighter text-[#FFC300]">40%</p>
            <p className="text-[13px] font-semibold text-white">
              are in the probinsya on weak data
            </p>
          </div>
        </Card>
      </div>
    </Slide>
  );
}

/* --------------------------------------------------------------- 3 ------- */

function Solution() {
  return (
    <Slide id="solution">
      <Eyebrow>The solution</Eyebrow>
      <Title>
        A legit na fixer — <span className="text-[#FFC300]">with a resibo.</span>
      </Title>
      <Lede>
        Same convenience people already pay a fixer for. Official channels only, official fee only,
        and a receipt with a reference anyone can check.
      </Lede>

      <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center">
        <Card className="space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#5C7099]">
            Sabihin mo lang — Taglish ok
          </p>
          {[
            "Bayaran mo SSS ko",
            "File mo eTravel ko, lipad ako bukas PR510 3pm",
            "Kuha ka PSA birth certificate ko",
          ].map((line) => (
            <p
              key={line}
              className="rounded-2xl rounded-br-sm bg-[#0F46F3] px-4 py-2.5 text-[14.5px] font-medium text-white"
            >
              {line}
            </p>
          ))}
          <p className="rounded-2xl rounded-tl-sm border border-white/10 bg-white/[0.05] px-4 py-2.5 text-[14.5px] text-[#E8EEF9]">
            Sige boss, ako na. Ipapasok ko na sa queue.
          </p>
        </Card>

        <ol className="space-y-3">
          {[
            {
              n: 1,
              title: "AI takes the order",
              body: "Taglish in, structured filing out — dates, flight, agency, fee.",
            },
            {
              n: 2,
              title: "A VA files it on the real gov site",
              body: "A person completes it on the agency's own portal. No scraping, no pretending.",
            },
            {
              n: 3,
              title: "Official QR or OR comes back",
              body: "Plus an EGOV-XXXX anti-fixer receipt and a /verify page for the record.",
            },
          ].map((s) => (
            <li key={s.n}>
              <Card className="flex gap-4">
                <StepNumber n={s.n} tone="gold" />
                <div>
                  <p className="text-[15px] font-bold text-white">{s.title}</p>
                  <p className="mt-1 text-[13.5px] leading-relaxed text-[#9DB0CE]">{s.body}</p>
                </div>
              </Card>
            </li>
          ))}
        </ol>
      </div>
    </Slide>
  );
}

/* --------------------------------------------------------------- 4 ------- */

function PhoneMockup() {
  return (
    <div className="relative mx-auto w-full max-w-[300px]">
      <div
        className="pointer-events-none absolute -inset-8 rounded-[48px] blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(255,195,0,0.28), transparent 70%)" }}
        aria-hidden
      />
      <div className="relative rounded-[38px] border-[6px] border-[#1B2B4D] bg-[#050D1F] p-4 shadow-2xl">
        <div className="mx-auto mb-4 h-1.5 w-16 rounded-full bg-white/15" aria-hidden />

        <div className="flex items-center justify-between border-b border-white/[0.07] pb-3">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#9DB0CE]">
            <Signal className="h-3 w-3 text-rose-400" />
            No data
          </span>
          <span className="text-[11px] font-mono text-[#5C7099]">0917•••</span>
        </div>

        <div className="space-y-3 py-4">
          <div className="ml-auto w-[85%] rounded-2xl rounded-br-sm bg-[#0F46F3] px-3.5 py-2.5">
            <p className="font-mono text-[12px] leading-snug text-white">
              EGOV SSS BALANCE 123456789012
            </p>
          </div>
          <div className="w-[92%] rounded-2xl rounded-tl-sm border border-white/10 bg-white/[0.06] px-3.5 py-2.5">
            <p className="text-[12.5px] leading-relaxed text-[#E8EEF9]">
              SSS mo: <span className="font-bold text-white">₱23,500</span> total contributions. Due
              ₱1,715 sa Aug 30.
              <br />
              Reply <span className="font-bold text-[#FFC300]">BAYARAN 500</span> para bayaran ko.
            </p>
          </div>
          <div className="ml-auto w-[45%] rounded-2xl rounded-br-sm bg-[#0F46F3] px-3.5 py-2.5">
            <p className="font-mono text-[12px] text-white">BAYARAN 500</p>
          </div>
        </div>

        <p className="border-t border-white/[0.07] pt-3 text-center text-[10.5px] uppercase tracking-[0.14em] text-[#5C7099]">
          Walang app • Walang data
        </p>
      </div>
    </div>
  );
}

function SmsMode() {
  return (
    <Slide id="sms" className="bg-[#0B1A38]">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <Pill tone="gold">Secret weapon</Pill>
            <Pill tone="danger">Competitors can&apos;t</Pill>
          </div>

          <Title className="mt-5">
            Walang net sa probinsya?{" "}
            <span className="text-[#FFC300]">TXT lang — payts pa rin.</span>
          </Title>

          <Lede>
            Every rival is an app, and an app needs data. SMS does not. The same agent answers over
            a ₱1 text on a ₱600 phone with no internet at all.
          </Lede>

          <div className="mt-8 grid gap-3.5 sm:grid-cols-3">
            <Card tone="gold">
              <Stat value="46M" label="Filipinos on weak or no data — 40% of the country" tone="gold" />
            </Card>
            <Card className="flex flex-col justify-center gap-2">
              <Smartphone className="h-4.5 w-4.5 text-[#7EA6FF]" />
              <p className="text-[13.5px] leading-relaxed text-[#9DB0CE]">
                Works on any handset. No install, no account, no OTP loop.
              </p>
            </Card>
            <Card className="flex flex-col justify-center gap-2">
              <Zap className="h-4.5 w-4.5 text-[#FFC300]" />
              <p className="text-[13.5px] leading-relaxed text-[#9DB0CE]">
                Same queue, same operator, same EGOV receipt as the app.
              </p>
            </Card>
          </div>

          <p className="mt-7 inline-flex items-center gap-2 rounded-xl border border-[#FFC300]/30 bg-[#FFC300]/[0.07] px-4 py-3 text-[13.5px] text-[#FFE9A6]">
            <MessageSquare className="h-4 w-4 shrink-0 text-[#FFC300]" />
            The market nobody else can serve is the market that needs this most.
          </p>
        </div>

        <PhoneMockup />
      </div>
    </Slide>
  );
}

/* --------------------------------------------------------------- 5 ------- */

function Agencies() {
  return (
    <Slide id="agencies">
      <Eyebrow>Coverage</Eyebrow>
      <Title>6 agencies, one conversation.</Title>
      <Lede>
        The console already talks to all six. Immigration is the one wired end to end — a real
        filing queue, worked by a real operator.
      </Lede>

      <div className="mt-10 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {AGENCIES.map((agency) => {
          const isImmigration = agency.id === "immigration";
          return (
            <Card key={agency.id} tone={isImmigration ? "gold" : "default"}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[16px] font-bold text-white">{agency.name}</p>
                  <p className="mt-1 text-[12.5px] leading-snug text-[#9DB0CE]">{agency.full}</p>
                </div>
                <span
                  className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                    isImmigration ? "bg-[#FFC300]" : "bg-emerald-400"
                  }`}
                  aria-hidden
                />
              </div>
              <p className="mt-4 text-[12px] leading-snug text-[#7E93B8]">{agency.detail}</p>
              <div className="mt-3">
                {isImmigration ? (
                  <Pill tone="gold">eTravel — free</Pill>
                ) : (
                  <Pill tone="good">Connected</Pill>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </Slide>
  );
}

/* --------------------------------------------------------------- 6 ------- */

const HOW_STEPS = [
  {
    n: 1,
    icon: MessageSquare,
    title: "Chat in Taglish",
    body: "“Lipad ako bukas PR510 3pm” parses into a destination, a flight and a Manila-time departure.",
  },
  {
    n: 2,
    icon: Database,
    title: "PENDING in Supabase",
    body: "The order becomes a row with its own reference, EGOV-2026-XXXX, and status PENDING.",
  },
  {
    n: 3,
    icon: Radio,
    title: "Operator queue, live",
    body: "/admin subscribes to the change feed and the declaration appears the moment it is filed.",
  },
  {
    n: 4,
    icon: FileCheck2,
    title: "FILED + /verify",
    body: "The VA files on etravel.gov.ph, records the official reference, and every screen flips.",
  },
];

const SECURITY = [
  { icon: Lock, text: "RLS on, zero policies — the browser cannot reach the table at all" },
  { icon: KeyRound, text: "Service role stays server-side; reads are redacted by audience" },
  { icon: ShieldCheck, text: "Agency QR and PDF in a private bucket, handed out as signed URLs" },
  { icon: Lock, text: "Passport and IDs in an AES-GCM vault, encrypted on the device" },
];

function HowItWorks() {
  return (
    <Slide id="how">
      <Eyebrow>How it works</Eyebrow>
      <Title>
        AI takes the order. <span className="text-[#FFC300]">A human files it.</span>
      </Title>
      <Lede>
        No agency exposes an API for this, so nothing here pretends to have one. The AI removes the
        typing and the waiting; a person does the filing and signs their name to it.
      </Lede>

      <div className="mt-10 grid gap-3.5 lg:grid-cols-4">
        {HOW_STEPS.map((s) => (
          <Card key={s.n} className="relative">
            <div className="flex items-center gap-3">
              <StepNumber n={s.n} />
              <s.icon className="h-4 w-4 text-[#7EA6FF]" />
            </div>
            <p className="mt-3.5 text-[15px] font-bold text-white">{s.title}</p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-[#9DB0CE]">{s.body}</p>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {SECURITY.map((s) => (
          <p
            key={s.text}
            className="flex items-start gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.02] px-3.5 py-3 text-[12.5px] leading-snug text-[#9DB0CE]"
          >
            <s.icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
            {s.text}
          </p>
        ))}
      </div>
    </Slide>
  );
}

/* --------------------------------------------------------------- 7 ------- */

const SHIPPED = [
  {
    title: "etravel_orders schema",
    body: "Table, status flow, change feed and private bucket — verified against Postgres 16.",
  },
  {
    title: "Taglish auto-fill in /app",
    body: "“lipad ako bukas PR510 3pm” fills the form, at +08:00 whatever timezone the phone is in.",
  },
  {
    title: "Realtime operator queue",
    body: "/admin subscribes to the feed; new declarations arrive without a refresh.",
  },
  {
    title: "Attestation in the log",
    body: "“Operator attests filed on etravel.gov.ph at HH:MM” — who, where, when.",
  },
  {
    title: "/verify flips live",
    body: "The traveller's page moves to FILED with the official reference, no reload.",
  },
];

function Shipped() {
  return (
    <Slide id="shipped">
      <div className="flex flex-wrap items-center gap-2.5">
        <Pill tone="good">
          <Check className="h-3 w-3" />
          Shipped
        </Pill>
        <span className="font-mono text-[12px] text-[#5C7099]">commit bcccf17 · main</span>
      </div>

      <Title className="mt-5">The Immigration pipeline is real, not a mockup.</Title>
      <Lede>
        One declaration moves PENDING → FILING → FILED through a database, an operator and a public
        record — the hard part of this product, already standing.
      </Lede>

      <div className="mt-10 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {SHIPPED.map((s) => (
          <Card key={s.title} tone="good">
            <div className="flex items-start gap-2.5">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
              <div>
                <p className="text-[14.5px] font-bold text-white">{s.title}</p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-[#9DB0CE]">{s.body}</p>
              </div>
            </div>
          </Card>
        ))}

        <Card className="flex flex-col justify-center">
          <p className="text-[13px] leading-relaxed text-[#9DB0CE]">
            Connect a Supabase project and the same code runs as a shared queue. Until then it runs
            device-locally and{" "}
            <span className="font-semibold text-white">every screen says so</span> — an order that
            is not pending with anybody never claims to be.
          </p>
        </Card>
      </div>
    </Slide>
  );
}

/* --------------------------------------------------------------- 8 ------- */

const COMPARISON = [
  { who: "eGovPH", gap: "Heavy, often down, nobody to ask when it fails", tone: "bad" as const },
  { who: "Fixer sa FB", gap: "₱500–₱1,000, no receipt, sometimes never filed", tone: "bad" as const },
  { who: "PSAHelpline", gap: "One agency only, no status once you have paid", tone: "bad" as const },
  { who: "My.SSS", gap: "You still do the filing, and the OTP still fails", tone: "bad" as const },
];

const OURS = [
  "24/7 chat with a real VA behind it",
  "Taglish — sabihin mo lang kung paano mo sinasabi",
  "Anti-Fixer Receipt: EGOV-XXXX + /verify",
  "Official agency QR or OR attached",
  "SMS mode where there is no data",
  "Service fee ₱100 — official fee stays official",
];

function WhyWeWin() {
  return (
    <Slide id="why">
      <Eyebrow>Why we win</Eyebrow>
      <Title>Everyone else solves a form. We finish the errand.</Title>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          {COMPARISON.map((c) => (
            <Card key={c.who} tone="danger" className="flex items-start gap-3 py-4">
              <X className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
              <div>
                <p className="text-[14.5px] font-bold text-white">{c.who}</p>
                <p className="mt-1 text-[13px] leading-snug text-[#9DB0CE]">{c.gap}</p>
              </div>
            </Card>
          ))}
        </div>

        <Card tone="gold" className="flex flex-col justify-center p-6">
          <div className="flex items-center gap-2.5">
            <AppIcon size={30} />
            <p className="text-[18px] font-bold text-white">eGov SuperAgent</p>
          </div>
          <ul className="mt-5 space-y-2.5">
            {OURS.map((line) => (
              <li key={line} className="flex items-start gap-2.5 text-[14px] leading-snug text-[#E8EEF9]">
                <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#FFC300]" />
                {line}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </Slide>
  );
}

/* --------------------------------------------------------------- 9 ------- */

const PRICING = [
  { service: "eTravel", fee: "FREE", note: "Lead magnet — every OFW needs one before every flight" },
  { service: "PSA certificate", fee: "₱365", note: "₱65 margin, delivered to the door" },
  { service: "SSS · PhilHealth · Pag-IBIG", fee: "₱1,715 + ₱100", note: "Official fee untouched, ₱100 service" },
  { service: "DFA passport", fee: "₱1,200", note: "Appointment secured, documents checked" },
];

function Market() {
  return (
    <Slide id="market">
      <Eyebrow>Market</Eyebrow>
      <Title>
        115M Filipinos + 10M OFWs = <span className="text-[#FFC300]">₱2.3B TAM</span>
      </Title>

      <div className="mt-9 grid gap-3.5 sm:grid-cols-3">
        <Card>
          <Stat value="125M" label="TAM — everyone who deals with a Philippine agency" />
        </Card>
        <Card>
          <Stat value="40M" label="SAM — smartphone or SMS reachable, transacting yearly" />
        </Card>
        <Card tone="gold">
          <Stat value="1M" label="SOM — target users in year one" tone="gold" />
        </Card>
      </div>

      <div className="mt-6 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        {PRICING.map((p) => (
          <Card key={p.service}>
            <p className="text-[12.5px] font-semibold text-[#9DB0CE]">{p.service}</p>
            <p
              className={`mt-2 text-[26px] font-bold tracking-tight ${
                p.fee === "FREE" ? "text-[#FFC300]" : "text-white"
              }`}
            >
              {p.fee}
            </p>
            <p className="mt-2 text-[12px] leading-snug text-[#7E93B8]">{p.note}</p>
          </Card>
        ))}
      </div>

      <Card tone="gold" className="mt-6 flex flex-wrap items-center justify-between gap-4 py-5">
        <p className="text-[15px] font-semibold text-white">
          100,000 users a month at an average ₱165 net
        </p>
        <p className="text-[30px] font-bold tracking-tighter text-[#FFC300]">₱16.5M MRR</p>
      </Card>
    </Slide>
  );
}

/* -------------------------------------------------------------- 10 ------- */

const TRACTION = [
  { label: "Production", value: "8435e00 · main", icon: Check },
  { label: "Vercel build", value: "Ready · 42s", icon: Zap },
  { label: "Domain", value: "www.egovsuperagent.online", icon: Globe2 },
  { label: "Intro", value: "3 slides, dots + skip", icon: Check },
  { label: "Immigration", value: "Real pipeline merged", icon: Plane },
  { label: "Brand", value: "SA icon, favicon, 1200×630 OG", icon: Check },
];

function Traction() {
  return (
    <Slide id="traction">
      <div className="flex flex-wrap items-center gap-2.5">
        <Pill tone="good">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Live in production
        </Pill>
      </div>

      <Title className="mt-5">Not a deck with a waitlist. A URL you can open now.</Title>
      <Lede>
        Landing, intro, console, owner console and the verify page are all deployed and reachable —
        this pitch deck is served by the same build.
      </Lede>

      <div className="mt-10 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {TRACTION.map((t) => (
          <Card key={t.label}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#5C7099]">
              {t.label}
            </p>
            <p className="mt-2 inline-flex items-center gap-2 font-mono text-[14.5px] font-semibold text-white">
              <t.icon className="h-4 w-4 shrink-0 text-emerald-400" />
              {t.value}
            </p>
          </Card>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {["/", "/intro", "/app", "/admin", "/verify/EGOV-…"].map((route) => (
          <span
            key={route}
            className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-[12.5px] text-[#9DB0CE]"
          >
            {route}
          </span>
        ))}
      </div>
    </Slide>
  );
}

/* -------------------------------------------------------------- 11 ------- */

const PHASES = [
  {
    n: 1,
    icon: Plane,
    title: "OFW first",
    body: "Facebook groups and Seaman TikTok. Free eTravel filing as the hook — target 10,000 leads.",
    pill: "Free eTravel",
  },
  {
    n: 2,
    icon: Truck,
    title: "Nanay and rider",
    body: "PSA certificates delivered by J&T. Chat lang — no portal, no pila, no appointment.",
    pill: "PSA delivery",
  },
  {
    n: 3,
    icon: Users,
    title: "HR in bulk",
    body: "One company, 100 employees, one EGOV reference per batch and one invoice.",
    pill: "B2B",
  },
];

function GoToMarket() {
  return (
    <Slide id="gtm">
      <Eyebrow>Go to market</Eyebrow>
      <Title>OFW first — they pay, they refer, they fly every year.</Title>

      <div className="mt-10 grid gap-3.5 lg:grid-cols-3">
        {PHASES.map((p) => (
          <Card key={p.n} className="flex flex-col">
            <div className="flex items-center gap-3">
              <StepNumber n={p.n} tone="gold" />
              <p.icon className="h-4 w-4 text-[#7EA6FF]" />
            </div>
            <p className="mt-4 text-[17px] font-bold text-white">{p.title}</p>
            <p className="mt-2 flex-1 text-[13.5px] leading-relaxed text-[#9DB0CE]">{p.body}</p>
            <div className="mt-4">
              <Pill tone="gold">{p.pill}</Pill>
            </div>
          </Card>
        ))}
      </div>

      <Card tone="gold" className="mt-6 flex flex-wrap items-center gap-4 py-5">
        <Signal className="h-5 w-5 shrink-0 text-[#FFC300]" />
        <p className="flex-1 text-[14.5px] leading-relaxed text-[#E8EEF9]">
          <span className="font-bold text-white">Carrier partnership:</span> Smart and Globe
          shortcode <span className="font-mono font-bold text-[#FFC300]">TXT 2600</span> — the
          distribution channel that reaches the 46M nobody else can.
        </p>
      </Card>
    </Slide>
  );
}

/* -------------------------------------------------------------- 12 ------- */

const ASK = [
  { icon: Database, text: "Supabase project + env keys — turns the queue from device-local to shared" },
  { icon: KeyRound, text: "ADMIN_PASSWORD set in the deployment" },
  { icon: Users, text: "2 VA operators to work the queue" },
];

function TeamAndAsk() {
  return (
    <Slide id="ask">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <Eyebrow>Team</Eyebrow>
          <Title>
            Built by <span className="text-[#FFC300]">AXLA</span>.
          </Title>
          <Lede>
            {LICENSEE.name} — Renmar Sombilon. Shipped on Next.js 14, Supabase and Vercel by a team
            that writes the code and files the paperwork.
          </Lede>

          <div className="mt-6 flex flex-wrap gap-2">
            {["Next.js 14", "TypeScript", "Supabase", "Vercel", "Tailwind"].map((t) => (
              <span
                key={t}
                className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[12.5px] font-medium text-[#9DB0CE]"
              >
                {t}
              </span>
            ))}
          </div>

          <p className="mt-8 flex items-start gap-2.5 border-l-2 border-[#FFC300] pl-4 text-[16px] leading-relaxed text-white">
            <span>
              The vision: become the <span className="font-bold text-[#FFC300]">GCash of
              government services</span> — one chat, all government.
            </span>
          </p>
        </div>

        <div>
          <Eyebrow>The ask</Eyebrow>
          <div className="mt-5 space-y-3">
            {ASK.map((a) => (
              <Card key={a.text} className="flex items-start gap-3 py-4">
                <a.icon className="mt-0.5 h-4 w-4 shrink-0 text-[#FFC300]" />
                <p className="text-[14px] leading-relaxed text-[#E8EEF9]">{a.text}</p>
              </Card>
            ))}
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#0F46F3] px-6 py-3.5 text-[15px] font-semibold text-white shadow-[0_0_28px_-6px_rgba(15,70,243,0.9)] transition hover:scale-[1.02] hover:bg-[#0D3DD6]"
            >
              Launch SuperAgent
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="mailto:faderepublicbarbershop2026@gmail.com?subject=eGov%20SuperAgent"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-[#FFC300]/40 bg-[#FFC300]/[0.08] px-6 py-3.5 text-[15px] font-semibold text-[#FFC300] transition hover:bg-[#FFC300]/15"
            >
              Contact
            </a>
          </div>

          <p className="mt-6 flex items-start gap-2 text-[11.5px] leading-relaxed text-[#5C7099]">
            <Clock className="mt-0.5 h-3 w-3 shrink-0" />
            Demonstration build. Agency data outside the eTravel pipeline is mock, and nothing here
            is affiliated with any Philippine government agency.
          </p>
        </div>
      </div>
    </Slide>
  );
}

export const SLIDE_COMPONENTS = [
  Cover,
  Problem,
  Solution,
  SmsMode,
  Agencies,
  HowItWorks,
  Shipped,
  WhyWeWin,
  Market,
  Traction,
  GoToMarket,
  TeamAndAsk,
];
