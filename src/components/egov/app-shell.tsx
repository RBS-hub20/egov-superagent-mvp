"use client";

import { Suspense, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu } from "lucide-react";
import { ChatPanel } from "./chat-panel";
import { ConnectIdModal } from "./connect-id-modal";
import { BrandLockup } from "@/components/brand/brand-lockup";
import { InsightRail } from "./insight-rail";
import { LogsModal } from "./logs-modal";
import { Sidebar } from "./sidebar";

export function AppShell() {
  // Bumping the key remounts the chat — that is what "new conversation" means.
  const [conversationKey, setConversationKey] = useState(0);
  const [navOpen, setNavOpen] = useState(false);
  const [railOpen, setRailOpen] = useState(false);
  const [connectOpen, setConnectOpen] = useState(false);
  const [logsOpen, setLogsOpen] = useState(false);

  function openConnect() {
    setNavOpen(false);
    setRailOpen(false);
    setConnectOpen(true);
  }

  function openLogs() {
    setNavOpen(false);
    setRailOpen(false);
    setLogsOpen(true);
  }

  function newConversation() {
    setConversationKey((k) => k + 1);
    setNavOpen(false);
  }

  return (
    <div className="lp-canvas flex h-[100dvh] flex-col overflow-hidden">
      {/* Mobile top bar — the desktop layout puts the logo in the sidebar. */}
      <header className="eg-surface flex items-center gap-3 border-b border-lp-line px-4 py-2.5 dark:border-lp-dark-line lg:hidden">
        <button
          type="button"
          onClick={() => setNavOpen(true)}
          aria-label="Open menu"
          className="rounded-lg border border-lp-line p-1.5 text-lp-body transition hover:bg-slate-100 hover:text-lp-ink dark:border-lp-dark-line dark:text-lp-dark-muted dark:hover:bg-white/[0.06] dark:hover:text-lp-dark-text"
        >
          <Menu className="h-4 w-4" />
        </button>
        <BrandLockup size={26} priority />
      </header>

      <div className="flex min-h-0 flex-1">
        <motion.aside
          initial={{ x: -24, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="hidden w-[280px] shrink-0 border-r border-lp-line dark:border-lp-dark-line lg:block"
        >
          <Sidebar
            onNewConversation={newConversation}
            onOpenMemory={() => setRailOpen(true)}
            onOpenVault={() => setRailOpen(true)}
            onOpenLogs={openLogs}
            onConnectId={openConnect}
          />
        </motion.aside>

        <main className="eg-ambient min-w-0 flex-1">
          <Suspense fallback={null}>
            <ChatPanel
              key={conversationKey}
              onOpenRail={() => setRailOpen(true)}
              onConnectId={openConnect}
            />
          </Suspense>
        </main>

        <motion.aside
          initial={{ x: 24, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="hidden w-[320px] shrink-0 border-l border-lp-line dark:border-lp-dark-line xl:block"
        >
          <InsightRail onConnectId={openConnect} />
        </motion.aside>
      </div>

      {/* Navigation drawer (below lg) */}
      <AnimatePresence>
        {navOpen ? (
          <motion.div
            key="nav"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-lp-ink/30 backdrop-blur-sm dark:bg-black/60"
              onClick={() => setNavOpen(false)}
              aria-hidden
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="absolute inset-y-0 left-0 w-[280px] border-r border-lp-line shadow-2xl dark:border-lp-dark-line"
            >
              <Sidebar
                onNewConversation={newConversation}
                onOpenMemory={() => {
                  setNavOpen(false);
                  setRailOpen(true);
                }}
                onOpenVault={() => {
                  setNavOpen(false);
                  setRailOpen(true);
                }}
                onOpenLogs={openLogs}
                onConnectId={openConnect}
                onClose={() => setNavOpen(false)}
              />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Vault + receipt: a right drawer on tablets, a bottom sheet on phones. */}
      <AnimatePresence>
        {railOpen ? (
          <motion.div
            key="rail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 xl:hidden"
          >
            <div
              className="absolute inset-0 bg-lp-ink/30 backdrop-blur-sm dark:bg-black/60"
              onClick={() => setRailOpen(false)}
              aria-hidden
            />

            {/* Phone: bottom sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 34 }}
              className="absolute inset-x-0 bottom-0 h-[86dvh] overflow-hidden rounded-t-3xl border-t border-lp-line shadow-2xl dark:border-lp-dark-line sm:hidden"
            >
              <InsightRail onClose={() => setRailOpen(false)} onConnectId={openConnect} variant="sheet" />
            </motion.div>

            {/* Tablet: side drawer */}
            <motion.div
              initial={{ x: 340 }}
              animate={{ x: 0 }}
              exit={{ x: 340 }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="absolute inset-y-0 right-0 hidden w-[min(340px,88vw)] border-l border-lp-line shadow-2xl dark:border-lp-dark-line sm:block"
            >
              <InsightRail onClose={() => setRailOpen(false)} onConnectId={openConnect} />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <ConnectIdModal open={connectOpen} onClose={() => setConnectOpen(false)} />
      <LogsModal open={logsOpen} onClose={() => setLogsOpen(false)} />
    </div>
  );
}
