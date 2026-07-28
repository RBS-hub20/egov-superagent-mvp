import { NextResponse } from "next/server";
import { ADMIN_COOKIE, adminPassword, sessionToken, tokensMatch } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let password = "";
  try {
    const body = (await req.json()) as { password?: string };
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    password = "";
  }

  if (!tokensMatch(password, adminPassword())) {
    // Deliberately vague, and slow enough to make guessing tedious.
    await new Promise((resolve) => setTimeout(resolve, 600));
    return NextResponse.json({ ok: false, error: "Mali ang password." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, await sessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return res;
}
