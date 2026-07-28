import { OwnerConsole } from "@/components/admin/console";

// Reached only through middleware, which verifies the admin cookie first.
export const dynamic = "force-dynamic";

export default function AdminPage() {
  return <OwnerConsole />;
}
