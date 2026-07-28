"use client";

import { useSyncExternalStore } from "react";

/**
 * Who the console is acting for.
 *
 * There is no account system, so identity lives in this browser only: nothing
 * is claimed about a visitor until they say so. A fresh visitor is a guest —
 * that is what makes the app safe to demo in front of someone else.
 *
 * Backed by a module-level store rather than a provider so `useUser()` can be
 * called anywhere and every caller re-renders on change (including across
 * tabs, via the `storage` event).
 */
const STORAGE_KEY = "egov-user";

export interface EgovUser {
  name: string;
  /** Short line under the name — verification state in words. */
  status: string;
  verified: boolean;
  location: string;
  /** Set once an ID has been added to the vault. */
  philSysMasked?: string;
  employer?: string;
}

export const GUEST_USER: EgovUser = {
  name: "Guest User",
  status: "Connect PhilSys ID",
  verified: false,
  location: "Philippines",
};

/** Snapshots must be referentially stable between reads. */
let snapshot: EgovUser = GUEST_USER;
let hydrated = false;
const listeners = new Set<() => void>();

function parse(raw: string | null): EgovUser {
  if (!raw) return GUEST_USER;
  try {
    const value = JSON.parse(raw) as Partial<EgovUser>;
    if (!value || typeof value.name !== "string" || !value.name.trim()) return GUEST_USER;
    return {
      name: value.name.trim(),
      status: value.status?.trim() || "Verified PhilSys holder",
      verified: value.verified !== false,
      location: value.location?.trim() || "Philippines",
      philSysMasked: value.philSysMasked,
      employer: value.employer,
    };
  } catch {
    return GUEST_USER;
  }
}

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): EgovUser {
  if (!hydrated) {
    // First read on the client — pull the stored profile in.
    hydrated = true;
    try {
      snapshot = parse(localStorage.getItem(STORAGE_KEY));
    } catch {
      snapshot = GUEST_USER;
    }
  }
  return snapshot;
}

/** The server always renders the guest state, so hydration matches a fresh visitor. */
function getServerSnapshot(): EgovUser {
  return GUEST_USER;
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key !== STORAGE_KEY) return;
    snapshot = parse(event.newValue);
    emit();
  });
}

export function useUser(): EgovUser {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Save a connected identity. Partial updates merge onto the current profile. */
export function setUser(patch: Partial<EgovUser> & { name: string }): EgovUser {
  const next: EgovUser = {
    ...getSnapshot(),
    ...patch,
    name: patch.name.trim(),
    verified: patch.verified ?? true,
    status: patch.status ?? "Verified PhilSys holder",
  };
  snapshot = next;
  hydrated = true;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage blocked — the profile still applies for this session.
  }
  emit();
  return next;
}

export function clearUser(): void {
  snapshot = GUEST_USER;
  hydrated = true;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to clean up.
  }
  emit();
}

/** Up to two initials; guests get none (the UI shows an icon instead). */
export function initialsOf(user: EgovUser): string {
  if (!user.verified) return "";
  return user.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/** "Renmar Sombilon" -> "Renmar S." for audit lines. */
export function shortNameOf(user: EgovUser): string {
  if (!user.verified) return "you";
  const parts = user.name.split(/\s+/).filter(Boolean);
  if (parts.length < 2) return parts[0] ?? user.name;
  return `${parts[0]} ${parts[parts.length - 1][0].toUpperCase()}.`;
}

/**
 * Whose name goes on an agency record.
 *
 * The fixtures in /mocks belong to a sample citizen. Rather than print that
 * person's name at a stranger's demo, an unconnected visitor sees the record
 * labelled for what it is.
 */
export function recordHolder(user: EgovUser): string {
  return user.verified ? user.name : "Demo record";
}
