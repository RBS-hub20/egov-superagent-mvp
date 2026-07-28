"use client";

/**
 * First-run state.
 *
 * A visitor who has never seen the console gets the three-slide intro once;
 * after that /app opens directly. Stored in this browser only, like everything
 * else here.
 */
export const ONBOARDING_KEY = "egov-onboarded";

export function isOnboarded(): boolean {
  try {
    return localStorage.getItem(ONBOARDING_KEY) === "true";
  } catch {
    // Storage blocked — don't trap the visitor in an intro they can't dismiss.
    return true;
  }
}

export function completeOnboarding(): void {
  try {
    localStorage.setItem(ONBOARDING_KEY, "true");
  } catch {
    // Nothing to persist; the redirect below still works for this session.
  }
}

export function resetOnboarding(): void {
  try {
    localStorage.removeItem(ONBOARDING_KEY);
  } catch {
    // Nothing stored.
  }
}
