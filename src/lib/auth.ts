"use client";

import { setUser } from "./user";
import { isSupabaseConfigured, supabase } from "./supabase";

/**
 * Sign-up / sign-in.
 *
 * Two paths, chosen by whether Supabase is configured:
 *
 *  - **Configured** — a real one-time code is sent by Supabase and verified by
 *    Supabase. No code is ever accepted locally.
 *  - **Not configured (this build)** — a local mock flow accepts 123456 so the
 *    product can be demonstrated end to end. It creates a profile in this
 *    browser and nothing else; there is no account anywhere.
 *
 * The Supabase branch has not been exercised — there is no project attached to
 * this repository yet — so treat it as wiring, not as tested behaviour.
 */
export const MOCK_OTP = "123456";

export type Channel = "email" | "phone";

export interface OtpRequest {
  channel: Channel;
  /** Email address, or a mobile number in +63 form. */
  value: string;
}

export interface AuthResult {
  ok: boolean;
  error?: string;
  /** True when the mock path handled it, so the UI can say so plainly. */
  mock?: boolean;
}

/** "09171234567" and "9171234567" both become "+639171234567". */
export function normalisePhone(input: string): string {
  const digits = input.replace(/[^\d+]/g, "");
  if (digits.startsWith("+63")) return digits;
  if (digits.startsWith("63")) return `+${digits}`;
  if (digits.startsWith("0")) return `+63${digits.slice(1)}`;
  if (digits.length === 10) return `+63${digits}`;
  return digits;
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

export function isValidPhone(value: string): boolean {
  return /^\+63\d{10}$/.test(normalisePhone(value));
}

export async function requestOtp({ channel, value }: OtpRequest): Promise<AuthResult> {
  const client = supabase();
  if (client) {
    const { error } =
      channel === "email"
        ? await client.auth.signInWithOtp({ email: value.trim() })
        : await client.auth.signInWithOtp({ phone: normalisePhone(value) });
    return error ? { ok: false, error: error.message } : { ok: true };
  }

  // Mock path: nothing is sent anywhere.
  await new Promise((r) => setTimeout(r, 600));
  return { ok: true, mock: true };
}

export async function verifyOtp(
  { channel, value }: OtpRequest,
  code: string,
  profile: { name: string }
): Promise<AuthResult> {
  const client = supabase();

  if (client) {
    const { data, error } = await client.auth.verifyOtp(
      channel === "email"
        ? { email: value.trim(), token: code, type: "email" }
        : { phone: normalisePhone(value), token: code, type: "sms" }
    );
    if (error) return { ok: false, error: error.message };
    const name = profile.name.trim() || data.user?.user_metadata?.name || "Verified user";
    // Keep the local profile in step so the console reads one source.
    setUser({
      name,
      verified: true,
      status: "Verified member",
      location: "Philippines",
    });
    return { ok: true };
  }

  await new Promise((r) => setTimeout(r, 700));
  if (code.trim() !== MOCK_OTP) {
    return { ok: false, error: "Mali ang code. Sa demo, 123456 ang code.", mock: true };
  }
  const name = profile.name.trim();
  if (!name) return { ok: false, error: "Pakilagay ang pangalan mo.", mock: true };

  setUser({
    name,
    verified: true,
    status: "Verified member",
    location: "Philippines",
  });
  return { ok: true, mock: true };
}

export { isSupabaseConfigured };
