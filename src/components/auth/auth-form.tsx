"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2, Mail, Phone, ShieldCheck } from "lucide-react";
import {
  MOCK_OTP,
  isSupabaseConfigured,
  isValidEmail,
  isValidPhone,
  normalisePhone,
  requestOtp,
  verifyOtp,
  type Channel,
} from "@/lib/auth";
import { LICENSEE } from "@/lib/brand";
import { completeOnboarding } from "@/lib/onboarding";

type Step = "details" | "code";

export function AuthForm({ mode }: { mode: "signup" | "login" }) {
  const router = useRouter();
  const isSignup = mode === "signup";
  const live = isSupabaseConfigured();

  const [channel, setChannel] = useState<Channel>("phone");
  const [value, setValue] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<Step>("details");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const valueValid = channel === "email" ? isValidEmail(value) : isValidPhone(value);

  async function sendCode(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!valueValid) {
      setError(
        channel === "email" ? "Pakicheck ang email address." : "Pakicheck ang mobile number."
      );
      return;
    }
    if (isSignup && !name.trim()) {
      setError("Pakilagay ang pangalan mo.");
      return;
    }
    setBusy(true);
    const res = await requestOtp({ channel, value });
    setBusy(false);
    if (!res.ok) {
      setError(res.error ?? "Hindi naipadala ang code.");
      return;
    }
    setStep("code");
  }

  async function submitCode(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const res = await verifyOtp({ channel, value }, code, {
      name: name.trim() || (channel === "email" ? value.split("@")[0] : "Verified member"),
    });
    setBusy(false);
    if (!res.ok) {
      setError(res.error ?? "Hindi na-verify ang code.");
      return;
    }
    // Someone who has signed in has no need for the intro again.
    completeOnboarding();
    router.replace("/app");
    router.refresh();
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-white">
      <header className="flex items-center justify-between px-5 pt-6 sm:px-6">
        <Link href="/" aria-label="eGov SuperAgent home">
          <Image src="/logo.png" alt="eGov SuperAgent" width={520} height={257} className="h-9 w-auto" />
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13.5px] font-semibold text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-sm"
        >
          <h1 className="text-[28px] font-bold leading-tight tracking-tight text-[#0A1931]">
            {isSignup ? "Sign up free" : "Welcome back"}
          </h1>
          <p className="mt-2 text-[15px] leading-relaxed text-[#475569]">
            {step === "details"
              ? isSignup
                ? "Isang minuto lang. Gamitin ang mobile number o email mo."
                : "Ilagay ang number o email na ginamit mo."
              : `Ipinadala namin ang 6-digit code sa ${
                  channel === "email" ? value : normalisePhone(value)
                }.`}
          </p>

          {step === "details" ? (
            <form onSubmit={sendCode} className="mt-7">
              <div className="flex rounded-xl bg-slate-100 p-1">
                {(["phone", "email"] as Channel[]).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setChannel(c);
                      setValue("");
                      setError(null);
                    }}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-[13.5px] font-semibold capitalize transition ${
                      channel === c ? "bg-white text-[#0A1931] shadow-sm" : "text-slate-500"
                    }`}
                  >
                    {c === "phone" ? <Phone className="h-3.5 w-3.5" /> : <Mail className="h-3.5 w-3.5" />}
                    {c}
                  </button>
                ))}
              </div>

              {isSignup ? (
                <label className="mt-4 block">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Full name
                  </span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Juan Dela Cruz"
                    autoComplete="name"
                    className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] px-3.5 py-3 text-[15px] text-[#0A1931] outline-none transition placeholder:text-slate-400 focus:border-[#0F46F3] focus:ring-2 focus:ring-[#0F46F3]/15"
                  />
                </label>
              ) : null}

              <label className="mt-4 block">
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  {channel === "email" ? "Email address" : "Mobile number"}
                </span>
                <input
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  inputMode={channel === "email" ? "email" : "tel"}
                  autoComplete={channel === "email" ? "email" : "tel"}
                  placeholder={channel === "email" ? "juan@email.com" : "0917 123 4567"}
                  className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] px-3.5 py-3 text-[15px] text-[#0A1931] outline-none transition placeholder:text-slate-400 focus:border-[#0F46F3] focus:ring-2 focus:ring-[#0F46F3]/15"
                />
              </label>

              {error ? (
                <p className="mt-3 text-[13px] font-medium text-[#E7000B]" role="alert">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={busy}
                className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#0F46F3] text-[16px] font-semibold text-white transition hover:bg-[#0D3DD6] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {busy ? "Sending code…" : "Send code"}
                {!busy ? <ArrowRight className="h-4 w-4" /> : null}
              </button>
            </form>
          ) : (
            <form onSubmit={submitCode} className="mt-7">
              <label className="block">
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  6-digit code
                </span>
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  autoFocus
                  placeholder="123456"
                  className="mt-1.5 w-full rounded-xl border border-[#E2E8F0] px-3.5 py-3 text-center font-mono text-[24px] tracking-[0.3em] text-[#0A1931] outline-none transition placeholder:text-slate-300 focus:border-[#0F46F3] focus:ring-2 focus:ring-[#0F46F3]/15"
                />
              </label>

              {!live ? (
                <p className="mt-3 rounded-xl bg-amber-50 p-3 text-[12.5px] leading-relaxed text-amber-800 ring-1 ring-inset ring-amber-200">
                  Demo mode — no SMS or email was sent. Use <strong>{MOCK_OTP}</strong>. Connect
                  Supabase to send real codes.
                </p>
              ) : null}

              {error ? (
                <p className="mt-3 text-[13px] font-medium text-[#E7000B]" role="alert">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={busy || code.length < 6}
                className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#0F46F3] text-[16px] font-semibold text-white transition hover:bg-[#0D3DD6] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                {busy ? "Verifying…" : isSignup ? "Create my account" : "Log in"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep("details");
                  setCode("");
                  setError(null);
                }}
                className="mt-3 w-full text-center text-[13.5px] font-semibold text-slate-500 transition hover:text-slate-900"
              >
                Use a different {channel === "email" ? "email" : "number"}
              </button>
            </form>
          )}

          <p className="mt-8 text-center text-[14px] text-[#475569]">
            {isSignup ? "Already a Member?" : "Wala pang account?"}{" "}
            <Link
              href={isSignup ? "/app/login" : "/app/signup"}
              className="font-semibold text-[#0F46F3] hover:underline"
            >
              {isSignup ? "Login here." : "Sign up free."}
            </Link>
          </p>

          <p className="mt-6 text-center text-[10.5px] uppercase tracking-[0.14em] text-slate-400">
            Built by {LICENSEE.short}
          </p>
        </motion.div>
      </main>
    </div>
  );
}
