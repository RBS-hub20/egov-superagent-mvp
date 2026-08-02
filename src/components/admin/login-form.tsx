"use client";

import { useState, type FormEvent } from "react";
import { AppIcon } from "@/components/brand/app-icon";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, Lock } from "lucide-react";
import { LICENSEE } from "@/lib/brand";

function safeNext(raw: string | null): string {
  if (!raw || !raw.startsWith("/admin") || raw.startsWith("//")) return "/admin";
  return raw;
}

export function AdminLogin() {
  const router = useRouter();
  const next = safeNext(useSearchParams()?.get("next") ?? null);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(body?.error ?? "Hindi ma-verify. Subukan ulit.");
        setBusy(false);
        return;
      }
      router.replace(next);
      router.refresh();
    } catch {
      setError("Walang koneksyon. Subukan ulit.");
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-[#0A0A0B] px-5">
      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm rounded-2xl border border-white/[0.08] bg-[#111113] p-7 shadow-2xl shadow-black/50"
      >
        <AppIcon size={34} priority />
        <h1 className="mt-5 text-[20px] font-bold tracking-tight text-white">Owner Console</h1>
        <p className="mt-1.5 text-[13px] text-zinc-500">
          Password only — walang signup. Built by {LICENSEE.short}.
        </p>

        <label className="mt-6 block">
          <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
            Password
          </span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            autoComplete="current-password"
            className="mt-1.5 w-full rounded-xl border border-white/[0.09] bg-[#0A0A0B] px-3.5 py-2.5 text-[15px] text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-[#0F46F3]/60 focus:ring-2 focus:ring-[#0F46F3]/20"
          />
        </label>

        {error ? (
          <p className="mt-3 text-[12.5px] font-medium text-rose-400" role="alert">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={busy || !password}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#0F46F3] py-3 text-[14px] font-semibold text-white transition hover:bg-[#0D3DD6] disabled:cursor-not-allowed disabled:opacity-55"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
          {busy ? "Checking…" : "Unlock console"}
        </button>
      </motion.form>
    </div>
  );
}
