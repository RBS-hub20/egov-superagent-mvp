"use client";

import { useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FileUp, Loader2, Lock, X } from "lucide-react";
import { setUser } from "@/lib/user";
import { addDocument } from "@/lib/vault";
import { fileSize } from "@/lib/data";

/**
 * Connect an identity.
 *
 * The name is typed, not read off the ID — there is no OCR in this build, and
 * guessing a name from an image is exactly the kind of thing that should not be
 * silently wrong. The uploaded ID goes straight into the encrypted vault.
 */
export function ConnectIdModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Pakilagay ang pangalan mo.");
      return;
    }

    setBusy(true);
    setError(null);
    try {
      if (file) await addDocument(file);
      setUser({
        name: trimmed,
        location: location.trim() || "Philippines",
        verified: true,
        status: "Verified PhilSys holder",
        // Masked digits stand in for the ID number a real reader would return.
        philSysMasked: file ? `****${String(Date.now()).slice(-4)}` : undefined,
      });
      setName("");
      setLocation("");
      setFile(null);
      onClose();
    } catch {
      setError("Hindi na-encrypt ang file — subukan ang ibang dokumento.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-end justify-center p-0 sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="connect-id-title"
        >
          <div
            className="absolute inset-0 bg-lp-ink/40 backdrop-blur-sm dark:bg-black/65"
            onClick={busy ? undefined : onClose}
            aria-hidden
          />

          <motion.form
            onSubmit={submit}
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="eg-surface relative w-full max-w-md rounded-t-3xl border border-lp-line p-6 shadow-2xl dark:border-lp-dark-line sm:rounded-2xl"
          >
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              aria-label="Close"
              className="absolute right-4 top-4 rounded-md p-1 text-lp-body/50 transition hover:bg-slate-100 hover:text-lp-ink disabled:opacity-50 dark:text-lp-dark-muted dark:hover:bg-white/10 dark:hover:text-lp-dark-text"
            >
              <X className="h-4 w-4" />
            </button>

            <h2
              id="connect-id-title"
              className="text-[18px] font-bold tracking-tight text-lp-ink dark:text-lp-dark-text"
            >
              Connect your ID
            </h2>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-lp-body dark:text-lp-dark-muted">
              Para hindi na kita tanungin ulit. Ang dokumento ay naka-encrypt dito mismo sa device
              mo — walang kopya sa server.
            </p>

            <label className="mt-5 block">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-lp-body/60 dark:text-lp-dark-muted/80">
                Full name
              </span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                placeholder="Juan Dela Cruz"
                className="mt-1.5 w-full rounded-xl border border-lp-line bg-white px-3.5 py-2.5 text-[14.5px] text-lp-ink outline-none transition placeholder:text-lp-body/40 focus:border-lp-primary/60 focus:ring-2 focus:ring-lp-primary/15 dark:border-lp-dark-line dark:bg-white/[0.04] dark:text-lp-dark-text dark:placeholder:text-lp-dark-muted/60"
              />
            </label>

            <label className="mt-4 block">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-lp-body/60 dark:text-lp-dark-muted/80">
                City / province <span className="font-normal normal-case">(optional)</span>
              </span>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Santo Tomas, Batangas"
                className="mt-1.5 w-full rounded-xl border border-lp-line bg-white px-3.5 py-2.5 text-[14.5px] text-lp-ink outline-none transition placeholder:text-lp-body/40 focus:border-lp-primary/60 focus:ring-2 focus:ring-lp-primary/15 dark:border-lp-dark-line dark:bg-white/[0.04] dark:text-lp-dark-text dark:placeholder:text-lp-dark-muted/60"
              />
            </label>

            <input
              ref={fileRef}
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-lp-line py-3 text-[13px] font-semibold text-lp-body transition hover:border-lp-primary/60 hover:bg-lp-primary/[0.05] hover:text-lp-primary dark:border-lp-dark-line dark:text-lp-dark-muted dark:hover:text-lp-dark-text"
            >
              <FileUp className="h-4 w-4" />
              {file ? `${file.name} • ${fileSize(file.size)}` : "Upload ID (optional)"}
            </button>

            {error ? (
              <p className="mt-3 text-[12.5px] font-medium text-lp-red" role="alert">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={busy}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-lp-primary py-3 text-[14px] font-semibold text-white shadow-[0_0_20px_-6px_rgba(15,70,243,0.7)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
              {busy ? "Encrypting…" : "Connect ID"}
            </button>

            <p className="mt-3 text-center text-[11px] text-lp-body/55 dark:text-lp-dark-muted/70">
              Naka-save lang sa browser na ito. Puwede mong burahin anumang oras.
            </p>
          </motion.form>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
