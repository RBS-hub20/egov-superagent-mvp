"use client";

import jsPDF from "jspdf";
import { LICENSEE } from "./brand";
import { formatTravelDate } from "./etravel";
import { statusLabel, type ETravelOrder } from "./etravel-orders";

const NAVY: [number, number, number] = [10, 25, 49];
const BLUE: [number, number, number] = [15, 70, 243];
const MUTED: [number, number, number] = [100, 116, 139];

/**
 * Builds the declaration summary in memory and returns a blob URL.
 *
 * This is the traveller's copy of what was submitted to the queue — a document
 * to hand an operator or keep on a phone, not an agency record. Once a filing
 * is done the agency's own PDF is attached to the order and takes over; the
 * footer here says which one this is so the two never get confused.
 *
 * The verify link is printed as text rather than a scannable square: jsPDF has
 * no QR encoder and the stack is deliberately small. The on-screen card carries
 * the real code.
 */
export function buildETravelPdfUrl(order: ETravelOrder, verifyUrl: string): string {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const width = doc.internal.pageSize.getWidth();

  doc.setFillColor(...NAVY);
  doc.rect(0, 0, width, 92, "F");
  doc.setFillColor(...BLUE);
  doc.rect(0, 92, width, 3, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  doc.text("eTravel Declaration Summary", 40, 42);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(200, 214, 240);
  doc.text("eGov SuperAgent — departure record", 40, 60);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text(order.ref, width - 40, 42, { align: "right" });

  let y = 140;
  const rows: [string, string][] = [
    ["Traveler", order.traveler_name],
    ["Passport", order.passport_no ?? "Not provided"],
    ["Flight", order.flight_no ?? "Not specified"],
    ["Destination", order.destination],
    ["Departure port", order.departure_airport],
    ["Travel date", formatTravelDate(order.departure_date)],
    ["Status", statusLabel(order.status)],
    ["Official reference", order.official_ref ?? "Not filed yet"],
  ];
  rows.forEach(([label, value]) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...MUTED);
    doc.text(label.toUpperCase(), 40, y);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...NAVY);
    doc.text(value, 200, y, { maxWidth: width - 240 });
    y += 24;
  });

  doc.setDrawColor(...BLUE);
  doc.setLineWidth(1.2);
  doc.roundedRect(40, y + 10, width - 80, 76, 8, 8, "S");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...NAVY);
  doc.text("Check the live status of this declaration", 56, y + 36);
  doc.setFont("courier", "normal");
  doc.setFontSize(9);
  doc.text(verifyUrl, 56, y + 58, { maxWidth: width - 112 });

  const height = doc.internal.pageSize.getHeight();
  doc.setDrawColor(226, 232, 240);
  doc.line(40, height - 62, width - 40, height - 62);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text(
    order.status === "FILED"
      ? `Built by ${LICENSEE.name}. Filed on etravel.gov.ph by an operator under ${order.official_ref}; this sheet is the traveller's summary, not the agency's own document.`
      : `Built by ${LICENSEE.name}. This declaration is queued for filing and has not been submitted to any agency yet.`,
    40,
    height - 44,
    { maxWidth: width - 80 }
  );

  return URL.createObjectURL(doc.output("blob"));
}
