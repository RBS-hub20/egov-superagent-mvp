"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AppIcon } from "@/components/brand/app-icon";
import { isOnboarded } from "@/lib/onboarding";

/**
 * Sends a first-time visitor through the intro before the console opens.
 *
 * The flag lives in localStorage, so the check can only happen on the client.
 * Until it resolves we render a branded splash rather than the console — a
 * flash of the full three-column app followed by a redirect looks broken.
 *
 * The intro lives at / and sends people on to sign-up, so there is no `next`
 * to carry: a first-time visitor is choosing an account, not resuming a task.
 */
export function OnboardingGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (isOnboarded()) {
      setReady(true);
      return;
    }
    router.replace("/");
  }, [router]);

  if (!ready) {
    return (
      <div className="lp-canvas flex h-[100dvh] items-center justify-center">
        <span className="animate-pulse">
          <AppIcon size={64} priority />
        </span>
      </div>
    );
  }

  return <>{children}</>;
}
