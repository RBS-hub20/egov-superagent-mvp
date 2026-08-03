import { redirect } from "next/navigation";

// The marketing page became / when the intro moved to /intro; keep the old
// link — it is in earlier builds of the intro screen — pointing somewhere real.
export default function ProductRedirect() {
  redirect("/");
}
