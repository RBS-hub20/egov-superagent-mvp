"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ConsoleLogo } from "@/components/egov/console-logo";
import { isOnboarded } from "@/lib/onboarding";

/**
 * Sends a first-time visitor through the intro before the console opens.
 *
 * The flag lives in localStorage, so the check can only happen on the client.
 * Until it resolves we render a branded splash rather than the console — a
 * flash of the full three-column app followed by a redirect looks broken.
 *
 * The current path and query ride along as `next`, so a deep link like
 * /app?q=check my sss contributions still lands correctly after the intro.
 */
export function OnboardingGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (isOnboarded()) {
      setReady(true);
      return;
    }
    const next = `${window.location.pathname}${window.location.search}`;
    router.replace(`/onboarding?next=${encodeURIComponent(next)}`);
  }, [router]);

  if (!ready) {
    return (
      <div className="lp-canvas flex h-[100dvh] items-center justify-center">
        <span className="animate-pulse">
          <ConsoleLogo width={160} />
        </span>
      </div>
    );
  }

  return <>{children}</>;
}
