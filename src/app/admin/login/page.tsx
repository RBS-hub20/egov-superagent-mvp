import { Suspense } from "react";
import type { Metadata } from "next";
import { AdminLogin } from "@/components/admin/login-form";

export const metadata: Metadata = {
  title: "Owner Console — sign in",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <AdminLogin />
    </Suspense>
  );
}
