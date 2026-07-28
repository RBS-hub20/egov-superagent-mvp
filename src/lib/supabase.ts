"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase client, or null when the project is not configured.
 *
 * Both variables have to be present for the real auth path to run; otherwise
 * the app uses the local mock flow so the product is still demonstrable.
 */
let cached: SupabaseClient | null | undefined;

export function supabase(): SupabaseClient | null {
  if (cached !== undefined) return cached;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  cached = url && key ? createClient(url, key) : null;
  return cached;
}

export function isSupabaseConfigured(): boolean {
  return supabase() !== null;
}
