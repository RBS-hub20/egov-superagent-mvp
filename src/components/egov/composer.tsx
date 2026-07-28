"use client";

import { useState, type FormEvent, type KeyboardEvent } from "react";
import { ArrowUp, Mic, Paperclip } from "lucide-react";

const PLACEHOLDER = "Utusan mo ako... 'check my sss contributions' (Taglish ok)";

export function Composer({
  onSend,
  disabled,
}: {
  onSend: (text: string) => void;
  disabled?: boolean;
}) {
  const [value, setValue] = useState("");

  function submit(e?: FormEvent) {
    e?.preventDefault();
    const text = value.trim();
    if (!text || disabled) return;
    onSend(text);
    setValue("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    // Enter sends, Shift+Enter breaks the line — chat convention.
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  return (
    <form onSubmit={submit} className="px-4 pb-4 pt-2 sm:px-6 sm:pb-6">
      <div className="flex items-end gap-2 rounded-3xl border border-lp-line bg-white px-3 py-2 shadow-[0_8px_30px_-16px_rgba(10,25,49,0.35)] transition focus-within:border-lp-primary/50 focus-within:shadow-[0_0_0_3px_rgba(15,70,243,0.12)] dark:border-lp-dark-line dark:bg-lp-dark-card dark:shadow-none">
        <button
          type="button"
          aria-label="Attach a document to the vault"
          className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full text-lp-body/45 transition hover:bg-slate-100 hover:text-lp-body dark:text-lp-dark-muted/60 dark:hover:bg-white/[0.06] dark:hover:text-lp-dark-text sm:flex"
        >
          <Paperclip className="h-4 w-4" />
        </button>

        <textarea
          rows={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={PLACEHOLDER}
          aria-label="Message SuperAgent"
          className="max-h-40 min-h-[36px] flex-1 resize-none bg-transparent py-2 text-[14.5px] leading-relaxed text-lp-ink placeholder:text-lp-body/45 focus:outline-none eg-scroll dark:text-lp-dark-text dark:placeholder:text-lp-dark-muted/60"
        />

        <button
          type="button"
          aria-label="Voice input"
          className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full text-lp-body/45 transition hover:bg-slate-100 hover:text-lp-body dark:text-lp-dark-muted/60 dark:hover:bg-white/[0.06] dark:hover:text-lp-dark-text sm:flex"
        >
          <Mic className="h-4 w-4" />
        </button>

        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className="flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-lp-primary px-4 text-[13px] font-semibold text-white shadow-[0_0_18px_-6px_rgba(15,70,243,0.7)] transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none dark:disabled:bg-white/10 dark:disabled:text-white/35"
        >
          Send
          <ArrowUp className="h-3.5 w-3.5" />
        </button>
      </div>
      <p className="mt-2 px-1 text-[10.5px] text-lp-body/55 dark:text-lp-dark-muted/60">
        MVP build — SSS, PhilHealth, Pag-IBIG, PSA, eTravel at DFA, at mock data ang lahat ng sagot.
      </p>
    </form>
  );
}
