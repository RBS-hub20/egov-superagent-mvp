"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FileImage, FileText, Loader2, Lock, Plus, ShieldCheck, Trash2 } from "lucide-react";
import {
  addDocument,
  listDocuments,
  openDocument,
  removeDocument,
  seedDocuments,
  vaultStatus,
  type VaultBackend,
  type VaultDoc,
} from "@/lib/vault";
import { SEED_VAULT_DOCS, fileSize } from "@/lib/data";

function DocIcon({ type }: { type: string }) {
  const Icon = type.startsWith("image/") ? FileImage : FileText;
  return <Icon className="h-4 w-4 text-lp-body/55 dark:text-lp-dark-muted/70" />;
}

export function VaultPreview() {
  const [docs, setDocs] = useState<VaultDoc[]>([]);
  const [backend, setBackend] = useState<VaultBackend | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const refresh = useCallback(async () => {
    setDocs(await listDocuments());
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        await seedDocuments(SEED_VAULT_DOCS);
        const status = await vaultStatus();
        if (!alive) return;
        setBackend(status.backend);
        await refresh();
      } catch {
        if (alive) setError("Vault unavailable in this browser");
      }
    })();
    return () => {
      alive = false;
    };
  }, [refresh]);

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    setError(null);
    try {
      for (const file of Array.from(files)) await addDocument(file);
      await refresh();
    } catch {
      setError("Could not encrypt that file — try another one.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handleOpen(doc: VaultDoc) {
    const blob = await openDocument(doc.id);
    if (!blob) return;
    // Decrypt in memory, hand the browser a short-lived object URL.
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = doc.name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  }

  async function handleRemove(id: string) {
    await removeDocument(id);
    await refresh();
  }

  return (
    <section className="eg-panel rounded-2xl p-4">
      <header className="flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-[13px] font-bold text-lp-ink dark:text-lp-dark-text">
          <Lock className="h-3.5 w-3.5 text-lp-yellow" />
          Vault
          <span className="text-[11px] font-normal text-lp-body/60 dark:text-lp-dark-muted/70">
            (Encrypted Locally)
          </span>
        </h2>
        <span className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 ring-1 ring-inset ring-emerald-500/25 dark:text-emerald-400">
          <ShieldCheck className="h-3 w-3" />
          AES-GCM
        </span>
      </header>

      <ul className="mt-3 space-y-1.5">
        <AnimatePresence initial={false}>
          {docs.map((doc) => (
            <motion.li
              key={doc.id}
              layout
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              className="group flex items-center gap-2.5 rounded-xl border border-lp-line bg-white px-2.5 py-2 transition hover:-translate-y-0.5 hover:border-lp-primary/35 hover:shadow-[0_10px_24px_-16px_rgba(10,25,49,0.45)] dark:border-lp-dark-line dark:bg-white/[0.03] dark:hover:bg-white/[0.06]"
            >
              <DocIcon type={doc.type} />
              <button
                type="button"
                onClick={() => handleOpen(doc)}
                className="min-w-0 flex-1 text-left focus-visible:outline-none"
                title={`Decrypt and download ${doc.name}`}
              >
                <p className="truncate text-[12.5px] font-semibold text-lp-ink dark:text-lp-dark-text">
                  {doc.name}
                </p>
                <p className="text-[10.5px] text-lp-body/60 dark:text-lp-dark-muted/70">
                  {fileSize(doc.size)} • encrypted
                </p>
              </button>
              <Lock className="h-3.5 w-3.5 shrink-0 text-lp-yellow group-hover:hidden" />
              <button
                type="button"
                onClick={() => handleRemove(doc.id)}
                aria-label={`Remove ${doc.name}`}
                className="hidden shrink-0 rounded p-0.5 text-lp-body/50 transition hover:text-lp-red group-hover:block dark:text-lp-dark-muted/70"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-lp-line py-2.5 text-[12.5px] font-semibold text-lp-body transition hover:border-lp-primary/60 hover:bg-lp-primary/[0.05] hover:text-lp-primary disabled:opacity-60 dark:border-lp-dark-line dark:text-lp-dark-muted dark:hover:text-lp-dark-text"
      >
        {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
        {busy ? "Encrypting…" : "Add Doc"}
      </button>

      <p className="mt-2.5 text-[10.5px] leading-snug text-lp-body/55 dark:text-lp-dark-muted/60">
        {error ??
          (backend === "localstorage"
            ? "IndexedDB blocked — falling back to localStorage on this device."
            : "Keys stay in this browser. Walang kopya sa server.")}
      </p>
    </section>
  );
}
