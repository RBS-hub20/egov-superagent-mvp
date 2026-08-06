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
            File mo eTravel ko, lipad ako bukas 3pm.
          </p>
          <p className="w-fit max-w-[92%] rounded-2xl rounded-tl-sm border border-white/10 bg-white/[0.06] px-4 py-2.5 text-[14px] leading-relaxed text-[#E4EBF7]">
            Nakuha ko na ang detalye. Ipapasok ko sa filing queue at ipapadala ko ang reference mo
            paglabas ng resulta.
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
              Lahat ng government services.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-pretty text-[18px] leading-relaxed text-[#A8B8D4]">
            From eTravel to PSA to SSS — isang chat lang. Taglish? Okay. Kami na ang bahala sa
            forms, filing, tracking, at official receipts.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <GoldButton href="/">
              Launch SuperAgent
              <ArrowRight className="h-4 w-4" />
            </GoldButton>
            <GhostButton href="#how">Paano gumagana?</GhostButton>
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
    body: "Bawat ahensya, sariling portal at sariling account. eGovPH, My.SSS, PhilHealth, Pag-IBIG, PSA, eTravel — magkakahiwalay lahat, at ikaw ang nag-uugnay sa kanila.",
  },
  {
    icon: ClipboardList,
    title: "Pila at fixer.",
    body: "Maghapong pila, o magbayad sa taong walang resibo. Walang tracking, walang katibayan, at walang mahahabol kapag hindi natuloy ang transaksyon.",
  },
  {
    icon: Signal,
    title: "Mahina ang signal.",
    body: "Sa probinsya, sa barko, at sa ibang bansa, hindi laging kayang mag-load ng portal. Ang serbisyong hindi maabot ay hindi serbisyo.",
  },
];

export function Problem() {
  return (
    <Section bleed>
      <Eyebrow>The problem</Eyebrow>
      <SectionTitle>Hindi na dapat mahirap.</SectionTitle>
      <Lede>
        Ang bawat ahensya ay may sariling sistema. Ang hindi pa naaayos ay ang buong karanasan ng
        mamamayan mula simula hanggang sa katibayan.
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
      <SectionTitle>Utusan mo lang. Kami na ang bahala.</SectionTitle>
      <Lede>
        Sabihin mo ang kailangan mo sa sarili mong salita. Kami ang bahala sa form, sa pila, at sa
        katibayan na natapos ito.
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
            <CardBody>English, Filipino, o Taglish — pareho lang ang maiintindihan.</CardBody>
            <div className="mt-4 space-y-2">
              {["Bayaran SSS ko.", "File eTravel ko.", "Kunin PSA birth certificate."].map((q) => (
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
              <span className="mt-3 block">Coordinated at tracked.</span>
            </CardTitle>
            <CardBody>
              Inaayos ng SuperAgent ang hinihingi mong impormasyon, at isang beripikadong operator
              ang nagsasagawa nito sa opisyal na portal ng ahensya. Nakatala ang bawat hakbang.
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
              <span className="mt-3 block">May katibayan ka.</span>
            </CardTitle>
            <CardBody>
              Pagkatapos, matatanggap mo ang opisyal na reference at ang mga dokumentong kasama nito.
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
              Narito ang buod ng iyong SSS contributions at ang susunod na due date. Mag-reply para
              sa detalye o sa susunod na hakbang.
            </p>
          </div>
        </div>

        <p className="border-t border-white/[0.07] pt-3 text-center text-[10.5px] uppercase tracking-[0.14em] text-[#5C7099]">
          Walang app • Walang data
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
          <SectionTitle>Kahit walang internet. TXT lang.</SectionTitle>
          <Lede>
            Hindi lahat ay may data o bagong telepono. Ang parehong serbisyo ay maaabot sa simpleng
            text message, kaya walang naiiwan.
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
              Ginawa para sa
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["Senior citizens", "Probinsya", "OFWs", "Seafarers", "Keypad phones"].map((a) => (
                <Badge key={a}>{a}</Badge>
              ))}
            </div>
          </div>
        </div>

        <SmsPhone />
      </div>
    </Section>
  );
}

/* -------------------------------------------------------- 5. agencies ---- */

const SERVICES = [
  { icon: Wallet, name: "SSS", detail: "Contributions at member records", live: false },
  { icon: BadgeCheck, name: "PhilHealth", detail: "Membership at dependents", live: false },
  { icon: Landmark, name: "Pag-IBIG", detail: "Savings at housing", live: false },
  { icon: FileText, name: "PSA", detail: "Birth, marriage, at CENOMAR", live: false },
  { icon: Plane, name: "Immigration — eTravel", detail: "Travel declaration filing", live: true },
  { icon: Globe2, name: "DFA — Passport", detail: "Passport appointments", live: false },
];

export function Agencies() {
  return (
    <Section id="agencies">
      <Eyebrow>Government services</Eyebrow>
      <SectionTitle>Anim na serbisyo, isang lugar.</SectionTitle>
      <Lede>
        Ang eTravel ang unang serbisyong buo mula chat hanggang sa opisyal na reference. Ang iba ay
        nasa guided preview habang tinatapos ang bawat proseso.
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
  { icon: MessageSquare, title: "Citizen request", body: "Chat o SMS, sa sariling salita." },
  { icon: Lock, title: "Secure vault", body: "Naka-encrypt sa device mo bago pa umalis." },
  { icon: ClipboardList, title: "Queue", body: "Nakapila ang request na may sariling reference." },
  { icon: UserCheck, title: "Verified operator", body: "Tao ang nagsasagawa, may pangalang nakatala." },
  { icon: Landmark, title: "Agency portal", body: "Isinasagawa sa opisyal na website ng ahensya." },
  { icon: BadgeCheck, title: "Reference", body: "Ibinabalik ang opisyal na numero ng ahensya." },
  { icon: QrCode, title: "QR at PDF", body: "Nakakabit sa record ang mga dokumento." },
  { icon: Globe2, title: "Verification", body: "Nakikita sa /verify ang katayuan nito." },
];

const SECURITY = [
  { icon: Lock, label: "AES-GCM encryption", body: "Ang mga dokumento sa vault ay naka-encrypt sa iyong device." },
  { icon: Globe2, label: "Signed links", body: "Ang mga file ay ibinibigay sa may-taning na link, hindi pampublikong URL." },
  { icon: ScrollText, label: "Audit logs", body: "May tala ang bawat hakbang: sino, saan, at kailan." },
  { icon: Fingerprint, label: "Privacy-first", body: "Ang hinihinging impormasyon ay yaong kailangan lamang ng form." },
];

export function HowItWorks() {
  return (
    <Section id="how" bleed>
      <Eyebrow>How it works</Eyebrow>
      <SectionTitle>Mula sa chat hanggang sa katibayan.</SectionTitle>
      <Lede>
        Malinaw ang daloy at nakatala ang bawat hakbang. Walang awtomatikong pag-access sa anumang
        sistema ng gobyerno — tao ang nagsasagawa sa opisyal na portal.
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
          <div
            key={s.label}
            className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4"
          >
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
      portal: ["partial", "Forms at hiwalay na account"],
      fixer: ["yes", "Madali, pero personal"],
      ours: ["yes", "Isang chat, Taglish"],
    },
    {
      feature: "Tracking",
      portal: ["partial", "Iba-iba kada ahensya"],
      fixer: ["no", "Walang katiyakan"],
      ours: ["yes", "Live status kada hakbang"],
    },
    {
      feature: "Official receipt",
      portal: ["yes", "Kung matatapos mo"],
      fixer: ["no", "Karaniwang wala"],
      ours: ["yes", "Reference at dokumento"],
    },
    {
      feature: "Verification",
      portal: ["partial", "Nasa portal lamang"],
      fixer: ["no", "Walang mapagtatanungan"],
      ours: ["yes", "Pampublikong verify page"],
    },
    {
      feature: "Support",
      portal: ["partial", "Limitado ang oras"],
      fixer: ["partial", "Depende sa tao"],
      ours: ["yes", "Tuloy-tuloy na chat"],
    },
    {
      feature: "Transparency",
      portal: ["partial", "Walang malinaw na tala"],
      fixer: ["no", "Walang audit trail"],
      ours: ["yes", "Nakatala ang bawat hakbang"],
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
      <SectionTitle>Malinaw ang pinagkaiba.</SectionTitle>

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
                <th
                  scope="row"
                  className="px-5 py-4 text-[14px] font-semibold text-white"
                >
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
  { title: "Production ready", body: "Naka-deploy at bukas ang buong daloy ng produkto." },
  { title: "Live website", body: "Naa-access ang serbisyo sa www.egovsuperagent.online." },
  { title: "Modern SA identity", body: "Bagong app icon at pare-parehong branding sa lahat ng screen." },
  { title: "Interactive intro", body: "Maikling paliwanag bago pumasok sa konsola." },
  { title: "End-to-end workflow demo", body: "Masusubukan ang eTravel mula chat hanggang verification." },
];

export function Status() {
  return (
    <Section bleed>
      <Eyebrow>Product status</Eyebrow>
      <SectionTitle>Live today.</SectionTitle>
      <Lede>Narito na ang produkto. Masusubukan mo ito ngayon, hindi sa waitlist.</Lede>

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
          One chat, all government services. Designed to simplify digital government access for
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
          Buksan sa iyong browser, pindutin ang Share, at piliin ang Add to Home Screen.
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
              Built by {LICENSEE.name} — Renmar Sombilon.
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
            status. Documents you upload are encrypted on your device; official fees are paid to
            the agency in full.
          </p>
          <p className="mt-5 text-[12.5px] text-[#5C7099]">
            © 2026 {LICENSEE.short}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
