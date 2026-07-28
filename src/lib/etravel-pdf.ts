"use client";

import jsPDF from "jspdf";
import { LICENSEE } from "./brand";
import { formatTravelDate, type ETravelDraft, type ETravelSubmission } from "./etravel";

const NAVY: [number, number, number] = [10, 25, 49];
const BLUE: [number, number, number] = [15, 70, 243];
const MUTED: [number, number, number] = [100, 116, 139];

/**
 * Builds the declaration PDF in memory and returns a blob URL.
 *
 * The QR is printed as its payload string rather than a scannable square —
 * jsPDF has no QR encoder and the stack is deliberately small. The on-screen
 * card carries the real scannable code.
 */
export function buildETravelPdfUrl(draft: ETravelDraft, result: ETravelSubmission): string {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const width = doc.internal.pageSize.getWidth();

  doc.setFillColor(...NAVY);
  doc.rect(0, 0, width, 92, "F");
  doc.setFillColor(...BLUE);
  doc.rect(0, 92, width, 3, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  doc.text("eTravel QR Declaration", 40, 42);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(200, 214, 240);
  doc.text("eGov SuperAgent — departure record", 40, 60);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text(result.reference, width - 40, 42, { align: "right" });

  let y = 140;
  const rows: [string, string][] = [
    ["Traveler", `${draft.travelerName} • ${draft.nationality}`],
    ["Direction", draft.direction],
    ["Route", draft.route],
    ["Flight", draft.flight ?? "Not specified"],
    ["Departure port", draft.port],
    ["Travel date", formatTravelDate(draft.departureISO)],
    ["Return date", draft.returnISO ? formatTravelDate(draft.returnISO) : "One way"],
    ["Status", "Registered"],
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
  doc.text("Present this code at the eTravel counter", 56, y + 36);
  doc.setFont("courier", "normal");
  doc.setFontSize(10);
  doc.text(result.qrPayload, 56, y + 58, { maxWidth: width - 112 });

  const height = doc.internal.pageSize.getHeight();
  doc.setDrawColor(226, 232, 240);
  doc.line(40, height - 62, width - 40, height - 62);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text(
    `Built by ${LICENSEE.name} — demo record generated on this device, not filed with any agency.`,
    40,
    height - 44,
    { maxWidth: width - 80 }
  );

  return URL.createObjectURL(doc.output("blob"));
}
