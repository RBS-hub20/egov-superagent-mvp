"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AppIcon } from "@/components/brand/app-icon";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { IdCard, PanelRight, Sparkles, User as UserIcon } from "lucide-react";
import { Composer } from "./composer";
import { ProactiveBanner } from "./proactive-banner";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { PhilHealthCard, PSATrackerCard, SSSContributionsCard } from "@/components/generative-ui";
import { ETravelModal, type ETravelPrefill } from "@/components/cards/etravel-modal";
import { ETravelOrderCard } from "@/components/cards/etravel-order-card";
import { respond, type CardKind } from "@/lib/agent";
import {
  listMyOrders,
  markAnnounced,
  subscribeOrders,
  unannounced,
  verifyPath,
  type ETravelOrder,
} from "@/lib/etravel-orders";
import { AGENCIES, peso, phDate, sss } from "@/lib/data";
import { LICENSEE } from "@/lib/brand";
import { initialsOf, useUser } from "@/lib/user";

interface Message {
  id: string;
  role: "agent" | "user";
  text: string;
  card: CardKind;
  suggestions?: string[];
  /** Present on the turn that filed a declaration, so the card can track it. */
  order?: { initial: ETravelOrder; accessKey: string };
}

const WELCOME: Message = {
  id: "welcome",
  role: "agent",
  text: "Kumusta boss! I am SuperAgent. Utusan mo ako — check SSS, PhilHealth, request PSA, o gumawa ng eTravel para sa lipad mo.",
  card: null,
  suggestions: [
    "Check my SSS contributions",
    "Flying to Singapore tomorrow at 3pm on PR510, create eTravel",
    "Request PSA birth certificate",
  ],
};

let counter = 0;
const nextId = () => `m${++counter}-${Date.now().toString(36)}`;

function AgentAvatar() {
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-lp-line bg-white dark:border-lp-dark-line dark:bg-white/[0.06]">
      <AppIcon size={18} />
    </span>
  );
}

function CardFor({ kind, order }: { kind: CardKind; order?: Message["order"] }) {
  if (kind === "sss") return <SSSContributionsCard />;
  if (kind === "philhealth") return <PhilHealthCard />;
  if (kind === "psa") return <PSATrackerCard />;
  if (kind === "etravel" && order)
    return <ETravelOrderCard initial={order.initial} accessKey={order.accessKey} />;
  return null;
}

function Working({ agencies }: { agencies: string[] }) {
  const label = agencies.length ? `Kinakausap ko ang ${agencies.join(", ")}…` : "Iniisip ko pa…";
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex items-center gap-3"
    >
      <AgentAvatar />
      <div className="flex items-center gap-2.5 rounded-2xl rounded-tl-sm border border-lp-line border-l-2 border-l-lp-primary bg-white px-3.5 py-2.5 dark:border-lp-dark-line dark:border-l-lp-primary dark:bg-lp-dark-card">
        <span className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-lp-primary"
              animate={{ opacity: [0.25, 1, 0.25] }}
              transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.16 }}
            />
          ))}
        </span>
        <span className="text-[12.5px] text-lp-body dark:text-lp-dark-muted">{label}</span>
      </div>
    </motion.div>
  );
}

export function ChatPanel({
  onOpenRail,
  onConnectId,
  etravelSignal = 0,
}: {
  onOpenRail: () => void;
  onConnectId: () => void;
  /** Bumped by the sidebar's Immigration tile to open the filing form. */
  etravelSignal?: number;
}) {
  const user = useUser();
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [working, setWorking] = useState<string[] | null>(null);
  const [bannerVisible, setBannerVisible] = useState(true);
  const [etravelOpen, setETravelOpen] = useState(false);
  const [prefill, setPrefill] = useState<ETravelPrefill>({});
  const scrollRef = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const searchParams = useSearchParams();
  const seededQuery = useRef(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, working]);

  // Clear pending reply timers if the conversation unmounts mid-flight.
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const openETravel = useCallback(
    (next: ETravelPrefill) => {
      setPrefill({ travelerName: user.verified ? user.name : "", ...next });
      setETravelOpen(true);
    },
    [user.name, user.verified]
  );

  const send = useCallback(
    (text: string) => {
      const turn = respond(text, { name: user.name, verified: user.verified });
      setMessages((prev) => [...prev, { id: nextId(), role: "user", text, card: null }]);
      setWorking(turn.working);

      const t = setTimeout(
        () => {
          setWorking(null);
          setMessages((prev) => [
            ...prev,
            {
              id: nextId(),
              role: "agent",
              // The eTravel turn ends in a form, so nothing is rendered with it.
              text: turn.etravel
                ? "Nakuha ko na ang trip details mo — buksan mo lang ang form para sa kulang, tapos ipapasok ko na sa filing queue."
                : turn.reply,
              card: turn.etravel ? null : turn.card,
              suggestions: turn.etravel ? undefined : turn.suggestions,
            },
          ]);
          if (turn.etravel) {
            openETravel({
              destination: turn.etravel.destination,
              flight: turn.etravel.flight,
              departureISO: turn.etravel.departureDate
                ? turn.etravel.departureDate.toISOString()
                : null,
            });
          }
        },
        turn.card ? 900 : 600
      );
      timers.current.push(t);
    },
    [user.name, user.verified, openETravel]
  );

  function onOrderCreated(order: ETravelOrder, accessKey: string) {
    setMessages((prev) => [
      ...prev,
      {
        id: nextId(),
        role: "agent",
        text: `Nasa queue na boss — ang eTravel mo ay ${order.ref}, pending filing by our VA. Ako na ang bahala; makikita mo dito kapag na-file na ito sa etravel.gov.ph.`,
        card: "etravel",
        order: { initial: order, accessKey },
        suggestions: ["Track my PSA request", "Check my SSS contributions"],
      },
    ]);
  }

  // The sidebar's Immigration tile opens the same form.
  useEffect(() => {
    if (etravelSignal > 0) openETravel({});
  }, [etravelSignal, openETravel]);

  // When an operator files a declaration in the owner console, tell the
  // traveller here — driven by the same change feed the card listens to.
  useEffect(() => {
    async function announce() {
      const orders = await listMyOrders();
      const fresh = unannounced(orders);
      if (fresh.length === 0) return;
      setMessages((prev) => [
        ...prev,
        ...fresh.map((order) => ({
          id: nextId(),
          role: "agent" as const,
          text: `Boss, na-file na ang eTravel mo${order.flight_no ? ` para sa ${order.flight_no}` : ""} — official reference ${order.official_ref}. Nasa ${verifyPath(order)} ang kopya. Ito ay naitala ng ${LICENSEE.short} operator na na-file na sa etravel.gov.ph.`,
          card: null,
          suggestions: ["Track my PSA request", "Check my SSS contributions"],
        })),
      ]);
      markAnnounced(fresh.map((o) => o.ref));
    }
    void announce();
    return subscribeOrders(() => void announce());
  }, []);

  // A service tile on the landing page can deep-link a first utos: /app?q=…
  useEffect(() => {
    const q = searchParams?.get("q");
    if (!q || seededQuery.current) return;
    seededQuery.current = true;
    send(q);
  }, [searchParams, send]);

  function confirmPayment() {
    setBannerVisible(false);
    setMessages((prev) => [
      ...prev,
      { id: nextId(), role: "user", text: "Yes, bayaran mo na.", card: null },
    ]);
    setWorking(["SSS"]);
    const t = setTimeout(() => {
      setWorking(null);
      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          role: "agent",
          text: `Sige boss — naka-schedule na ang ${peso(sss.nextDue.amount)} para sa ${sss.nextDue.period}, babayaran ${phDate(
            sss.nextDue.dueDate
          )} via ${sss.nextDue.channel}. Nasa Anti-Fixer Receipt ang PRN at resibo pagkatapos — official fee lang, walang dagdag.`,
          card: "sss",
          suggestions: ["Show the receipt", "Check my PhilHealth", "Track my PSA request"],
        },
      ]);
    }, 900);
    timers.current.push(t);
  }

  function deferPayment() {
    setBannerVisible(false);
    setMessages((prev) => [
      ...prev,
      {
        id: nextId(),
        role: "agent",
        text: `Sige, i-remind na lang kita bukas ng umaga. Ang deadline ay ${phDate(sss.nextDue.dueDate)} — huwag mong hayaang mag-penalty.`,
        card: null,
        suggestions: ["Bayaran na lang natin", "Check my SSS contributions"],
      },
    ]);
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex items-center justify-between gap-3 border-b border-lp-line px-4 py-3 dark:border-lp-dark-line sm:px-6">
        <div className="min-w-0">
          <h1 className="truncate text-[14px] font-bold text-lp-ink dark:text-lp-dark-text">
            SuperAgent
          </h1>
          <p className="mt-0.5 inline-flex items-center gap-1.5 rounded-full border border-lp-line bg-white/70 px-2.5 py-0.5 text-[11px] text-lp-body dark:border-lp-dark-line dark:bg-white/[0.04] dark:text-lp-dark-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 eg-pulse" aria-hidden />
            <span className="truncate">
              {AGENCIES.length} agencies connected —{" "}
              {user.verified ? `acting for ${user.name}` : "Guest mode — connect ID"}
            </span>
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {!user.verified ? (
            <button
              type="button"
              onClick={onConnectId}
              className="hidden items-center gap-1.5 rounded-lg bg-lp-primary px-3 py-1.5 text-[12px] font-semibold text-white transition hover:scale-[1.02] sm:inline-flex"
            >
              <IdCard className="h-3.5 w-3.5" />
              Connect ID
            </button>
          ) : null}
          <ThemeToggle />
          <button
            type="button"
            onClick={onOpenRail}
            // The label is hidden on phones, so the button needs its own name.
            aria-label="Open vault and receipt"
            className="inline-flex items-center gap-1.5 rounded-lg border border-lp-line px-2.5 py-1.5 text-[12px] font-medium text-lp-body transition hover:border-lp-primary/40 hover:text-lp-ink dark:border-lp-dark-line dark:text-lp-dark-muted dark:hover:text-lp-dark-text xl:hidden"
          >
            <PanelRight className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Vault &amp; receipt</span>
          </button>
        </div>
      </header>

      <ProactiveBanner visible={bannerVisible} onConfirm={confirmPayment} onDefer={deferPayment} />

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-5 eg-scroll sm:px-6">
        <div className="mx-auto flex max-w-3xl flex-col gap-5">
          {messages.map((m) =>
            m.role === "agent" ? (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="flex gap-3"
              >
                <AgentAvatar />
                <div className="min-w-0 flex-1 space-y-3">
                  {/* Blue left border marks the agent's own voice; anything on a
                      white document card below is an agency record. */}
                  {m.text ? (
                    <div className="inline-block rounded-2xl rounded-tl-sm border border-lp-line border-l-2 border-l-lp-primary bg-white px-4 py-3 text-[14.5px] leading-relaxed text-lp-ink shadow-[0_1px_2px_rgba(10,25,49,0.04)] dark:border-lp-dark-line dark:border-l-lp-primary dark:bg-lp-dark-card dark:text-lp-dark-text">
                      {m.text}
                    </div>
                  ) : null}
                  {m.card ? <CardFor kind={m.card} order={m.order} /> : null}
                  {m.suggestions?.length ? (
                    <div className="flex flex-wrap gap-2 pt-0.5">
                      {m.suggestions.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => send(s)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-lp-line bg-white px-3 py-1.5 text-[12px] font-medium text-lp-body transition hover:border-lp-primary/50 hover:bg-lp-primary/[0.06] hover:text-lp-primary dark:border-lp-dark-line dark:bg-white/[0.04] dark:text-lp-dark-muted dark:hover:bg-lp-primary/15 dark:hover:text-lp-dark-text"
                        >
                          <Sparkles className="h-3 w-3 text-lp-primary" />
                          {s}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32 }}
                className="flex justify-end gap-3"
              >
                <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-lp-primary px-4 py-2.5 text-[14.5px] leading-relaxed text-white shadow-[0_10px_30px_-14px_rgba(15,70,243,0.8)]">
                  {m.text}
                </div>
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-lp-primary/10 text-[11px] font-bold text-lp-primary ring-1 ring-inset ring-lp-primary/20">
                  {user.verified ? initialsOf(user) : <UserIcon className="h-4 w-4" />}
                </span>
              </motion.div>
            )
          )}

          <AnimatePresence>{working ? <Working agencies={working} /> : null}</AnimatePresence>
        </div>
      </div>

      <div className="mx-auto w-full max-w-3xl">
        <Composer onSend={send} disabled={working !== null} />
      </div>

      <ETravelModal
        open={etravelOpen}
        prefill={prefill}
        onClose={() => setETravelOpen(false)}
        onCreated={onOrderCreated}
      />
    </div>
  );
}
