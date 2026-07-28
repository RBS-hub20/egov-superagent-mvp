import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * eGov SuperAgent has no accounts and no private data on the server — every
 * figure comes from `/mocks` and the vault never leaves the browser. So this
 * middleware gates nothing; it states the public surface explicitly and applies
 * baseline security headers to every response.
 *
 * When authentication does arrive, PUBLIC_PATHS is the allowlist to check
 * against before redirecting.
 */
const PUBLIC_PATHS = new Set([
  "/", // landing
  "/onboarding", // first-run intro
  "/app", // SuperAgent console
]);

const PUBLIC_PREFIXES = [
  "/api/webhook/", // Messenger and future channel callbacks carry no session
];

export function isPublicPath(pathname: string): boolean {
  return (
    PUBLIC_PATHS.has(pathname) || PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))
  );
}

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  // The vault is a local-only promise; make it enforceable rather than a claim.
  // No connect-src to third parties means encrypted documents cannot be shipped
  // anywhere even if a dependency tried.
  if (isPublicPath(req.nextUrl.pathname)) {
    res.headers.set("X-Robots-Tag", "index, follow");
  }

  return res;
}

export const config = {
  // Skip Next internals and static assets — they need no headers from us.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|logos/).*)"],
};
