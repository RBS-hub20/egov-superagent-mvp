"use client";

import { addDocument, listDocuments, openDocument, removeDocument } from "./vault";

/**
 * The traveller's passport number, kept in the encrypted vault rather than in
 * localStorage.
 *
 * It is the one field the eTravel form needs that nothing else in the app
 * knows, and re-typing it before every flight is exactly the friction this
 * product exists to remove — but it is also a national identity number, so it
 * goes through the same AES-GCM path as an ID scan and never sits in plain
 * storage. Saving it is opt-in; the form works without it.
 */
const DOC_NAME = "Passport_No.txt";

async function findDoc(): Promise<string | null> {
  const docs = await listDocuments();
  return docs.find((d) => d.name === DOC_NAME && !d.seeded)?.id ?? null;
}

export async function readPassportNumber(): Promise<string | null> {
  try {
    const id = await findDoc();
    if (!id) return null;
    const blob = await openDocument(id);
    if (!blob) return null;
    const text = (await blob.text()).trim();
    return text || null;
  } catch {
    return null;
  }
}

export async function savePassportNumber(value: string): Promise<void> {
  const trimmed = value.trim();
  if (!trimmed) return;
  try {
    const existing = await findDoc();
    if (existing) await removeDocument(existing);
    await addDocument(new File([trimmed], DOC_NAME, { type: "text/plain" }));
  } catch {
    // Vault unavailable — the declaration still carries the number the
    // traveller typed; only the convenience of remembering it is lost.
  }
}
