import type { Metadata } from "next";
import { FlightsScreen } from "@/components/flights/FlightsScreen";

export const metadata: Metadata = {
  title: "Flights",
  description:
    "Search sample fares and raise the bundled eTravel declaration in one step. Demonstration data — no airline is connected.",
  alternates: { canonical: "/app/flights" },
};

export default function FlightsPage() {
  return <FlightsScreen />;
}
