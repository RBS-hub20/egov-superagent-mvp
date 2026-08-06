import {
  ArrowRight,
  BadgeCheck,
  Check,
  ClipboardList,
  FileText,
  Fingerprint,
  Globe2,
  Landmark,
  Lock,
  Minus,
  MessageSquare,
  Plane,
  QrCode,
  ScrollText,
  Signal,
  Smartphone,
  Sparkles,
  UserCheck,
  Wallet,
  X,
} from "lucide-react";
import { AppIcon } from "@/components/brand/app-icon";
import {
  Badge,
  Card,
  CardBody,
  CardTitle,
  Eyebrow,
  GhostButton,
  GoldButton,
  Lede,
  Section,
  SectionTitle,
} from "./ui";
import { LICENSEE } from "@/lib/brand";

/* ------------------------------------------------------------ 1. hero ---- */

/** The product, drawn rather than described: a request and what comes back. */
function HeroPreview() {
  return (
    <div className="relative">
      <div
        className="pointer-events-none absolute -inset-8 rounded-[40px] blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 30% 20%, rgba(15,70,243,0.35), transparent 65%), radial-gradient(circle at 80% 90%, rgba(255,195,0,0.16), transparent 60%)",
        }}
        aria-hidden
      />

      <div className="relative rounded-2xl border border-white/[0.09] bg-[#0C2044]/80 p-5 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.9)] backdrop-blur-sm">
        <div className="flex items-center gap-2.5 border-b border-white/[0.07] pb-4">
          <AppIcon size={26} />
          <p className="text-[13.5px] font-semibold text-white">SuperAgent</p>
          <span className="ml-auto inline-flex items-center gap-1.5 text-[11px] text-[#8AA0C4]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden />
            Online
          </span>
        </div>

        <div className="space-y-3 py-5">
          <p className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-sm bg-[#0F46F3] px-4 py-2.5 text-[14px] text-white">
            File my eTravel — I fly tomorrow at 3pm.
          </p>
          <p className="w-fit max-w-[92%] rounded-2xl rounded-tl-sm border border-white/10 bg-white/[0.06] px-4 py-2.5 text-[14px] leading-relaxed text-[#E4EBF7]">
            Got the details. I&apos;ve placed it in the filing queue and will send your reference as
            soon as it comes back.
          </p>
        </div>

        {/* The receipt is the point of the product, so it is the visual anchor. */}
        <div className="rounded-xl border border-[#FFC300]/25 bg-[#FFC300]/[0.06] p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[#FFC300]">
              Reference issued
            </p>
            <Badge tone="live">
              <BadgeCheck className="h-3 w-3" />
              Verified
            </Badge>
          </div>
          <p className="mt-2.5 font-mono text-[19px] font-bold tracking-tight text-white">
            EGOV-2026-4821
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-[11.5px] text-[#A8B8D4]">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.06] px-2.5 py-1">
              <QrCode className="h-3 w-3" />
              QR
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.06] px-2.5 py-1">
              <FileText className="h-3 w-3" />
              PDF
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.06] px-2.5 py-1 font-mono">
              /verify
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <Section className="flex min-h-[calc(100dvh-4rem)] items-center py-16 sm:py-20">
      <div className="grid w-full items-center gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.04] px-3.5 py-1.5 text-[12.5px] text-[#A8B8D4]">
            <Sparkles className="h-3.5 w-3.5 shrink-0 text-[#FFC300]" />
            <span>
              Built by {LICENSEE.short}
              <span className="mx-2 text-white/20" aria-hidden>
                •
              </span>
              <span className="whitespace-nowrap">Live at www.egovsuperagent.online</span>
            </span>
          </div>

          <h1
            className="mt-7 text-balance font-bold tracking-tight text-white"
            style={{ fontSize: "clamp(36px, 4.8vw, 58px)", lineHeight: 1.06 }}
          >
            One chat.{" "}
            <span className="bg-gradient-to-r from-[#FFC300] to-[#FFDF7A] bg-clip-text text-transparent">
              Every government service.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-pretty text-[18px] leading-relaxed text-[#A8B8D4]">
            From eTravel to PSA to SSS — one conversation. No queues. No fixers. Official receipts,
            tracked and verifiable. Built for 115 million Filipinos at home and 10 million overseas.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <GoldButton href="/">
              Launch SuperAgent
              <ArrowRight className="h-4 w-4" />
            </GoldButton>
            <GhostButton href="#how">See how it works</GhostButton>
          </div>

          <ul className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
            {["Government services", "Official receipts", "Public verification page"].map((item) => (
              <li key={item} className="inline-flex items-center gap-2 text-[13.5px] text-[#A8B8D4]">
                <Check className="h-4 w-4 shrink-0 text-emerald-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <HeroPreview />
      </div>
    </Section>
  );
}

/* --------------------------------------------------------- 2. problem ---- */

const PROBLEMS = [
  {
    icon: Fingerprint,
    title: "7 apps. 7 passwords.",
    body: "Every agency ships its own portal and its own account. eGovPH, My.SSS, PhilHealth, Pag-IBIG, PSA, eTravel — all separate, and the citizen is the one holding them together.",
  },
  {
    icon: ClipboardList,
    title: "Queues and fixers.",
    body: "A full day in line, or a payment to someone who issues no receipt. No tracking, no proof, and nothing to point to when a transaction quietly fails.",
  },
  {
    icon: Signal,
    title: "Weak signal? We include everyone.",
    body: "In the provinces, at sea, and abroad, a heavy portal often will not load at all. A service that cannot be reached is not a service.",
  },
];

export function Problem() {
  return (
    <Section bleed>
      <Eyebrow>The problem</Eyebrow>
      <SectionTitle>Government services shouldn&apos;t be hard.</SectionTitle>
      <Lede>
        Each agency has solved its own system. What is still unsolved is the citizen&apos;s
        experience end to end — from the first request to the proof that it was done.
      </Lede>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {PROBLEMS.map((p) => (
          <Card key={p.title}>
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06] text-[#FFC300]">
              <p.icon className="h-5 w-5" />
            </span>
            <div className="mt-5">
              <CardTitle>{p.title}</CardTitle>
              <CardBody>{p.body}</CardBody>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}

/* -------------------------------------------------------- 3. solution ---- */

export function Solution() {
  return (
    <Section>
      <Eyebrow>The solution</Eyebrow>
      <SectionTitle>Just tell us. We handle the rest.</SectionTitle>
      <Lede>
        Say what you need in your own words. We take care of the form, the queue, and the proof that
        it was completed.
      </Lede>

      <ol className="mt-12 grid gap-5 lg:grid-cols-3">
        <li>
          <Card className="h-full">
            <p className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-[#FFC300]">
              Step 01
            </p>
            <CardTitle>
              <span className="mt-3 block">Chat naturally.</span>
            </CardTitle>
            <CardBody>
              Plain language, no forms to decode. English or Filipino — both are understood.
            </CardBody>
            <div className="mt-4 space-y-2">
              {[
                "Pay my SSS contribution.",
                "File my eTravel declaration.",
                "Get my PSA birth certificate.",
              ].map((q) => (
                <p
                  key={q}
                  className="rounded-xl border border-white/[0.07] bg-white/[0.04] px-3.5 py-2 text-[13.5px] text-[#E4EBF7]"
                >
                  {q}
                </p>
              ))}
            </div>
          </Card>
        </li>

        <li>
          <Card className="h-full">
            <p className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-[#FFC300]">
              Step 02
            </p>
            <CardTitle>
              <span className="mt-3 block">Secure coordination.</span>
            </CardTitle>
            <CardBody>
              SuperAgent organises what the agency asks for, and a verified operator completes the
              request through the agency&apos;s official workflow. Every step is recorded.
            </CardBody>
            <ul className="mt-4 space-y-2">
              {[
                { icon: ScrollText, label: "Audit trail" },
                { icon: ClipboardList, label: "Task tracking" },
                { icon: UserCheck, label: "Operator verification" },
              ].map((f) => (
                <li key={f.label} className="flex items-center gap-2.5 text-[13.5px] text-[#A8B8D4]">
                  <f.icon className="h-4 w-4 shrink-0 text-[#7EA6FF]" />
                  {f.label}
                </li>
              ))}
            </ul>
          </Card>
        </li>

        <li>
          <Card className="h-full" accent>
            <p className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-[#FFC300]">
              Step 03
            </p>
            <CardTitle>
              <span className="mt-3 block">Receive your proof.</span>
            </CardTitle>
            <CardBody>
              You get the official reference the agency issued, together with the documents that
              belong to it.
            </CardBody>
            <ul className="mt-4 space-y-2">
              {[
                { icon: BadgeCheck, label: "Official reference number" },
                { icon: QrCode, label: "QR code" },
                { icon: FileText, label: "PDF copy" },
                { icon: Globe2, label: "Verification link" },
              ].map((f) => (
                <li key={f.label} className="flex items-center gap-2.5 text-[13.5px] text-[#E4EBF7]">
                  <f.icon className="h-4 w-4 shrink-0 text-[#FFC300]" />
                  {f.label}
                </li>
              ))}
            </ul>
            <p className="mt-5 rounded-lg bg-[#0A1931]/40 px-3 py-2 font-mono text-[12px] text-[#A8B8D4]">
              egovsuperagent.online/verify/<span className="text-[#FFC300]">&lt;reference&gt;</span>
            </p>
          </Card>
        </li>
      </ol>
    </Section>
  );
}

/* ------------------------------------------------------------- 4. sms ---- */

function SmsPhone() {
  return (
    <div className="relative mx-auto w-full max-w-[290px]">
      <div
        className="pointer-events-none absolute -inset-8 rounded-[48px] blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(255,195,0,0.22), transparent 70%)" }}
        aria-hidden
      />
      <div className="relative rounded-[36px] border-[6px] border-[#1B2B4D] bg-[#060F24] p-4 shadow-2xl">
        <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-white/15" aria-hidden />

        <div className="flex items-center justify-between border-b border-white/[0.07] pb-3">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#A8B8D4]">
            <Signal className="h-3 w-3 text-[#FFC300]" />
            No internet
          </span>
          <span className="font-mono text-[11px] text-[#5C7099]">SMS</span>
        </div>

        <div className="space-y-3 py-4">
          <div className="ml-auto w-[80%] rounded-2xl rounded-br-sm bg-[#0F46F3] px-3.5 py-2.5">
            <p className="font-mono text-[12px] text-white">EGOV SSS BALANCE</p>
          </div>
          <div className="w-[92%] rounded-2xl rounded-tl-sm border border-white/10 bg-white/[0.06] px-3.5 py-2.5">
            <p className="text-[12.5px] leading-relaxed text-[#E4EBF7]">
              Here is a summary of your SSS contributions and the next due date. Reply for details
              or to continue with the next step.
            </p>
          </div>
        </div>

        <p className="border-t border-white/[0.07] pt-3 text-center text-[10.5px] uppercase tracking-[0.14em] text-[#5C7099]">
          No app • No data plan
        </p>
      </div>
    </div>
  );
}

export function SmsAccess() {
  return (
    <Section bleed>
      <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div>
          <Eyebrow>Accessibility</Eyebrow>
          <SectionTitle>Works even without internet. Just TXT.</SectionTitle>
          <Lede>
            Not everyone has mobile data or a recent phone. The same service is reachable by plain
            text message, so nobody is left out.
          </Lede>

          <div className="mt-8 inline-flex flex-wrap items-center gap-3 rounded-2xl border border-white/[0.1] bg-white/[0.04] px-5 py-4">
            <Smartphone className="h-5 w-5 shrink-0 text-[#FFC300]" />
            <p className="font-mono text-[15px] font-semibold text-white">
              TXT EGOV <span className="text-[#8AA0C4]">to</span> 0917-XXX-XXXX
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {["SSS balance", "PSA tracking", "eTravel status"].map((q) => (
              <p
                key={q}
                className="rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3 text-[13.5px] font-medium text-[#E4EBF7]"
              >
                {q}
              </p>
            ))}
          </div>

          <div className="mt-8">
            <p className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-[#5C7099]">
              Built for
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["Seniors", "Provinces", "Seafarers", "OFWs", "Keypad phones"].map((a) => (
                <Badge key={a}>{a}</Badge>
              ))}
            </div>
            <p className="mt-4 text-[13.5px] text-[#A8B8D4]">No app needed.</p>
          </div>
        </div>

        <SmsPhone />
      </div>
    </Section>
  );
}

/* -------------------------------------------------------- 5. agencies ---- */

const SERVICES = [
  { icon: Wallet, name: "SSS", detail: "Contributions and member records", live: false },
  { icon: BadgeCheck, name: "PhilHealth", detail: "Membership and dependents", live: false },
  { icon: Landmark, name: "Pag-IBIG", detail: "Savings and housing", live: false },
  { icon: FileText, name: "PSA", detail: "Birth, marriage and CENOMAR documents", live: false },
  { icon: Plane, name: "Immigration — eTravel", detail: "Travel declaration filing", live: true },
  { icon: Globe2, name: "DFA — Passport", detail: "Passport appointments", live: false },
];

export function Agencies() {
  return (
    <Section id="agencies">
      <Eyebrow>Government services</Eyebrow>
      <SectionTitle>Six services, one place.</SectionTitle>
      <Lede>
        eTravel is the first service that runs complete, from chat to official reference. The rest
        are in guided preview while each workflow is finished.
      </Lede>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((s) => (
          <Card key={s.name} accent={s.live}>
            <div className="flex items-start justify-between gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06] text-[#7EA6FF]">
                <s.icon className="h-5 w-5" />
              </span>
              <Badge tone={s.live ? "live" : "neutral"}>{s.live ? "Live" : "Preview"}</Badge>
            </div>
            <div className="mt-5">
              <CardTitle>{s.name}</CardTitle>
              <CardBody>{s.detail}</CardBody>
            </div>
          </Card>
        ))}
      </div>

      {/* Said plainly, because the badge above must not be read as more than it is. */}
      <p className="mt-8 max-w-3xl text-[13px] leading-relaxed text-[#7E93B8]">
        eGov SuperAgent is an independent service and is not affiliated with, endorsed by, or
        officially integrated with any Philippine government agency. Requests are completed through
        each agency&apos;s own public portal by a verified operator.
      </p>
    </Section>
  );
}

/* ------------------------------------------------------------ 6. how ----- */

const PIPELINE = [
  { icon: MessageSquare, title: "Citizen request", body: "By chat or SMS, in plain language." },
  { icon: Lock, title: "Secure vault", body: "Documents are encrypted on your device first." },
  { icon: ClipboardList, title: "Queue", body: "The request is queued under its own reference." },
  { icon: UserCheck, title: "Verified operator", body: "A named person takes it on, on the record." },
  { icon: Landmark, title: "Agency portal", body: "Completed on the agency's own official website." },
  { icon: BadgeCheck, title: "Reference", body: "The agency's official number is recorded." },
  { icon: QrCode, title: "QR and PDF", body: "The issued documents are attached to the record." },
  { icon: Globe2, title: "Verification", body: "The record's status is public at /verify." },
];

const SECURITY = [
  {
    icon: Lock,
    label: "AES-GCM encryption",
    body: "Documents in the vault are encrypted on your own device.",
  },
  {
    icon: Globe2,
    label: "Signed links",
    body: "Files are served through expiring links, never a public URL.",
  },
  {
    icon: ScrollText,
    label: "Audit logs",
    body: "Every step is recorded: who acted, where, and when.",
  },
  {
    icon: Fingerprint,
    label: "Privacy-first",
    body: "We ask only for what the specific form actually requires.",
  },
];

export function HowItWorks() {
  return (
    <Section id="how" bleed>
      <Eyebrow>How it works</Eyebrow>
      <SectionTitle>From a chat to a verifiable record.</SectionTitle>
      <Lede>
        The path is deliberate and every step is logged. There is no automated access to any
        government system — a verified operator completes the request on the official portal.
      </Lede>

      <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PIPELINE.map((step, i) => (
          <li key={step.title}>
            <Card className="h-full p-5">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[12px] text-[#5C7099]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <step.icon className="h-4 w-4 text-[#7EA6FF]" />
              </div>
              <p className="mt-3.5 text-[15px] font-semibold text-white">{step.title}</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-[#A8B8D4]">{step.body}</p>
            </Card>
          </li>
        ))}
      </ol>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SECURITY.map((s) => (
          <div key={s.label} className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
            <p className="flex items-center gap-2 text-[13.5px] font-semibold text-white">
              <s.icon className="h-4 w-4 shrink-0 text-emerald-400" />
              {s.label}
            </p>
            <p className="mt-2 text-[12.5px] leading-relaxed text-[#8AA0C4]">{s.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ----------------------------------------------------- 7. why / table ---- */

type Mark = "yes" | "no" | "partial";

const ROWS: { feature: string; portal: [Mark, string]; fixer: [Mark, string]; ours: [Mark, string] }[] =
  [
    {
      feature: "Ease of use",
      portal: ["partial", "Forms and separate accounts"],
      fixer: ["yes", "Easy, but entirely personal"],
      ours: ["yes", "One conversation"],
    },
    {
      feature: "Tracking",
      portal: ["partial", "Differs by agency"],
      fixer: ["no", "No visibility"],
      ours: ["yes", "Live status at every step"],
    },
    {
      feature: "Official receipt",
      portal: ["yes", "If you finish the process"],
      fixer: ["no", "Usually none"],
      ours: ["yes", "Reference and documents"],
    },
    {
      feature: "Verification",
      portal: ["partial", "Inside the portal only"],
      fixer: ["no", "Nothing to check against"],
      ours: ["yes", "Public verification page"],
    },
    {
      feature: "Support",
      portal: ["partial", "Limited office hours"],
      fixer: ["partial", "Depends on the person"],
      ours: ["yes", "Continuous chat"],
    },
    {
      feature: "Transparency",
      portal: ["partial", "No consolidated record"],
      fixer: ["no", "No audit trail"],
      ours: ["yes", "Every step recorded"],
    },
  ];

function MarkIcon({ mark }: { mark: Mark }) {
  if (mark === "yes") return <Check className="h-4 w-4 shrink-0 text-emerald-400" />;
  if (mark === "no") return <X className="h-4 w-4 shrink-0 text-rose-400" />;
  return <Minus className="h-4 w-4 shrink-0 text-[#5C7099]" />;
}

export function Comparison() {
  return (
    <Section>
      <Eyebrow>Why eGov SuperAgent</Eyebrow>
      <SectionTitle>A clear difference.</SectionTitle>

      <div className="mt-12 overflow-x-auto rounded-2xl border border-white/[0.08] eg-scroll">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead>
            <tr className="border-b border-white/[0.08] bg-white/[0.02]">
              <th className="px-5 py-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#5C7099]">
                Feature
              </th>
              <th className="px-5 py-4 text-[13.5px] font-semibold text-[#A8B8D4]">
                Government website
              </th>
              <th className="px-5 py-4 text-[13.5px] font-semibold text-[#A8B8D4]">
                Community fixers
              </th>
              <th className="border-l border-[#FFC300]/20 bg-[#FFC300]/[0.05] px-5 py-4 text-[13.5px] font-semibold text-[#FFC300]">
                eGov SuperAgent
              </th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.feature} className="border-b border-white/[0.05] last:border-b-0">
                <th scope="row" className="px-5 py-4 text-[14px] font-semibold text-white">
                  {row.feature}
                </th>
                {([row.portal, row.fixer] as [Mark, string][]).map(([mark, text], i) => (
                  <td key={i} className="px-5 py-4">
                    <span className="flex items-start gap-2 text-[13.5px] leading-snug text-[#A8B8D4]">
                      <MarkIcon mark={mark} />
                      {text}
                    </span>
                  </td>
                ))}
                <td className="border-l border-[#FFC300]/20 bg-[#FFC300]/[0.04] px-5 py-4">
                  <span className="flex items-start gap-2 text-[13.5px] font-medium leading-snug text-[#E4EBF7]">
                    <MarkIcon mark={row.ours[0]} />
                    {row.ours[1]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}

/* --------------------------------------------------------- 8. status ----- */

const STATUS = [
  { title: "Production ready", body: "Deployed, with the full product flow open to visitors." },
  { title: "Live website", body: "The service is reachable at www.egovsuperagent.online." },
  { title: "Modern SA identity", body: "A new app icon and consistent branding across every screen." },
  { title: "Interactive intro", body: "A short guided explanation before entering the console." },
  {
    title: "End-to-end workflow",
    body: "eTravel can be followed from chat through to verification.",
  },
];

export function Status() {
  return (
    <Section bleed>
      <Eyebrow>Product status</Eyebrow>
      <SectionTitle>Live today.</SectionTitle>
      <Lede>The product exists and can be used now, not from a waitlist.</Lede>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {STATUS.map((s) => (
          <Card key={s.title}>
            <span className="inline-flex items-center gap-2 text-[13px] font-semibold text-emerald-300">
              <Check className="h-4 w-4" />
              Live
            </span>
            <div className="mt-4">
              <CardTitle>{s.title}</CardTitle>
              <CardBody>{s.body}</CardBody>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}

/* --------------------------------------------------------- 9. vision ----- */

export function Vision() {
  return (
    <Section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(700px 400px at 50% 0%, rgba(255,195,0,0.10), transparent 65%), radial-gradient(600px 400px at 20% 100%, rgba(15,70,243,0.20), transparent 65%)",
        }}
        aria-hidden
      />
      <div className="relative flex flex-col items-center text-center">
        <AppIcon size={64} />
        <h2
          className="mt-8 max-w-4xl text-balance font-bold tracking-tight text-white"
          style={{ fontSize: "clamp(34px, 5vw, 60px)", lineHeight: 1.06 }}
        >
          Become the{" "}
          <span className="bg-gradient-to-r from-[#FFC300] to-[#FFDF7A] bg-clip-text text-transparent">
            GCash of government services.
          </span>
        </h2>
        <p className="mt-6 max-w-2xl text-pretty text-[18px] leading-relaxed text-[#A8B8D4]">
          One chat. Every government service. Designed to simplify digital government access for
          Filipinos at home and abroad.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <GoldButton href="/">
            Launch SuperAgent
            <ArrowRight className="h-4 w-4" />
          </GoldButton>
          <GhostButton href="/app">Add to home screen</GhostButton>
        </div>
        <p className="mt-4 text-[12.5px] text-[#5C7099]">
          Open it in your browser, tap Share, then choose Add to Home Screen.
        </p>
      </div>
    </Section>
  );
}

/* ----------------------------------------------------------- footer ----- */

export function PitchFooter() {
  return (
    <footer className="border-t border-white/[0.08] px-5 py-14 sm:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <AppIcon size={28} />
              <span className="text-[15px] font-semibold tracking-tight text-white">
                eGov <span className="text-[#7EA6FF]">SuperAgent</span>
              </span>
            </div>
            <p className="mt-4 text-[13.5px] leading-relaxed text-[#8AA0C4]">
              Built by {LICENSEE.name}{" "}
              {/* Kept together so the year never wraps onto a line of its own. */}
              <span className="whitespace-nowrap">© 2026</span>
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-7 gap-y-3 text-[13.5px]">
            <a href="#legal" className="text-[#A8B8D4] transition-colors hover:text-white">
              Terms
            </a>
            <a href="#legal" className="text-[#A8B8D4] transition-colors hover:text-white">
              Privacy
            </a>
            <a href="#legal" className="text-[#A8B8D4] transition-colors hover:text-white">
              Verification
            </a>
          </nav>
        </div>

        <div id="legal" className="mt-10 scroll-mt-20 border-t border-white/[0.06] pt-6">
          <p className="max-w-4xl text-[12.5px] leading-relaxed text-[#7E93B8]">
            eGov SuperAgent is an independent service operated by {LICENSEE.name}. It is not
            affiliated with, endorsed by, or officially integrated with any Philippine government
            agency. Requests are completed on each agency&apos;s own public portal by a verified
            operator, and a request is only complete once the reference issued by that agency is
            recorded against it. Every request has a public verification page at
            egovsuperagent.online/verify/&lt;reference&gt;, which shows that record&apos;s current
            status. Documents you upload are encrypted on your device; official fees are paid to the
            agency in full.
          </p>
          <p className="mt-5 text-[12.5px] text-[#5C7099]">All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
