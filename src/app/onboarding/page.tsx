import { redirect } from "next/navigation";

// The three-slide intro moved to / when sign-up was added; keep old links alive.
export default function OnboardingRedirect() {
  redirect("/");
}
