/**
 * Owner console access.
 *
 * The password check runs on the server and the resulting cookie is httpOnly,
 * so the console cannot be unlocked by editing localStorage or reading the
 * client bundle. The cookie carries a hash of the password rather than a bare
 * flag, so it cannot be forged without knowing the password itself.
 *
 * This is gate-level protection for an internal tool, not an identity system:
 * everyone with the password is the same "user". Set ADMIN_PASSWORD in the
 * deployment — the fallback below is a development default and is public in
 * this repository.
 */
export const ADMIN_COOKIE = "egov_admin";
const TOKEN_SALT = "egov-superagent-owner-console-v1";

export function adminPassword(): string {
  return process.env.ADMIN_PASSWORD || "AXLA2026!";
}

/** Edge- and node-safe SHA-256, via Web Crypto. */
export async function sessionToken(password = adminPassword()): Promise<string> {
  const bytes = new TextEncoder().encode(`${password}:${TOKEN_SALT}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Constant-time-ish comparison so a wrong cookie leaks no length information. */
export function tokensMatch(a: string | undefined, b: string): boolean {
  if (!a || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function isValidAdminCookie(value: string | undefined): Promise<boolean> {
  return tokensMatch(value, await sessionToken());
}
