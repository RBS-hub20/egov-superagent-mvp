import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Sign up free",
  alternates: { canonical: "/app/signup" },
};

export default function SignupPage() {
  return <AuthForm mode="signup" />;
}
