import { redirect } from "next/navigation";

// The three-slide intro lives at /intro; keep old links alive.
export default function OnboardingRedirect() {
  redirect("/intro");
}
