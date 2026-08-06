import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE, isValidAdminCookie } from "@/lib/admin-auth";

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
  "/", // marketing landing
  "/intro", // three-slide intro
  "/pitch", // pitch deck — public by link, never gated
  "/product", // legacy path, redirects to /
  "/onboarding", // legacy path, redirects to /intro
  "/app", // SuperAgent console
  "/app/signup",
  "/app/login",
]);

const PUBLIC_PREFIXES = [
  "/verify/", // shareable record check
  "/api/webhook/", // Messenger and future channel callbacks carry no session
];

export function isPublicPath(pathname: string): boolean {
  return (
    PUBLIC_PATHS.has(pathname) || PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))
  );
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // The owner console is the one gated surface. The cookie is httpOnly and
  // carries a hash of the password, so it cannot be forged client-side.
  const isAdminArea =
    (pathname === "/admin" || pathname.startsWith("/admin/")) && pathname !== "/admin/login";
  if (isAdminArea) {
    const ok = await isValidAdminCookie(req.cookies.get(ADMIN_COOKIE)?.value);
    if (!ok) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.search = pathname === "/admin" ? "" : `?next=${encodeURIComponent(pathname)}`;
      const redirect = NextResponse.redirect(url);
      redirect.cookies.delete(ADMIN_COOKIE);
      return redirect;
    }
  }

  const res = NextResponse.next();

  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  // The vault is a local-only promise; make it enforceable rather than a claim.
  // No connect-src to third parties means encrypted documents cannot be shipped
  // anywhere even if a dependency tried.
  // Public and indexable are not the same thing: the pitch deck is open to
  // anyone with the link, but it carries pricing and an ask, so it stays out of
  // search. Drop it from NO_INDEX to have it rank.
  const NO_INDEX = pathname.startsWith("/admin") || pathname === "/pitch";
  if (NO_INDEX) {
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
  } else if (isPublicPath(pathname)) {
    res.headers.set("X-Robots-Tag", "index, follow");
  }

  return res;
}

export const config = {
  // Skip Next internals and static assets — they need no headers from us.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|logos/).*)"],
};
