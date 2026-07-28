"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { PanelRight, Sparkles } from "lucide-react";
import { Composer } from "./composer";
import { ProactiveBanner } from "./proactive-banner";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { PhilHealthCard, PSATrackerCard, SSSContributionsCard } from "@/components/generative-ui";
import { respond, type CardKind } from "@/lib/agent";
import { USER, peso, phDate, sss } from "@/lib/data";

interface Message {
  id: string;
  role: "agent" | "user";
  text: string;
  card: CardKind;
  suggestions?: string[];
}

const WELCOME: Message = {
  id: "welcome",
  role: "agent",
  text: "Kumusta boss! I am SuperAgent. Utusan mo ako — check SSS, PhilHealth, o request PSA.",
  card: null,
  suggestions: ["Check my SSS contributions", "Show my PhilHealth", "Request PSA birth certificate"],
};

let counter = 0;
const nextId = () => `m${++counter}-${Date.now().toString(36)}`;

function AgentAvatar() {
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-lp-line bg-white dark:border-lp-dark-line dark:bg-white/[0.06]">
      <Image src="/logo-icon.png" alt="" width={64} height={39} className="h-4 w-auto" />
    </span>
  );
}

function CardFor({ kind }: { kind: CardKind }) {
  if (kind === "sss") return <SSSContributionsCard />;
  if (kind === "philhealth") return <PhilHealthCard />;
  if (kind === "psa") return <PSATrackerCard />;
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

export function ChatPanel({ onOpenRail }: { onOpenRail: () => void }) {
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [working, setWorking] = useState<string[] | null>(null);
  const [bannerVisible, setBannerVisible] = useState(true);
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

  const send = useCallback((text: string) => {
    const turn = respond(text);
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
            text: turn.reply,
            card: turn.card,
            suggestions: turn.suggestions,
          },
        ]);
      },
      turn.card ? 900 : 600
    );
    timers.current.push(t);
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
            <span className="truncate">4 agencies connected — acting for {USER.name}</span>
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
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
                  <div className="inline-block rounded-2xl rounded-tl-sm border border-lp-line border-l-2 border-l-lp-primary bg-white px-4 py-3 text-[14.5px] leading-relaxed text-lp-ink shadow-[0_1px_2px_rgba(10,25,49,0.04)] dark:border-lp-dark-line dark:border-l-lp-primary dark:bg-lp-dark-card dark:text-lp-dark-text">
                    {m.text}
                  </div>
                  {m.card ? <CardFor kind={m.card} /> : null}
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
                  {USER.initials}
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
    </div>
  );
}
