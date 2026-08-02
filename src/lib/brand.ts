/**
 * eGov SuperAgent brand tokens.
 *
 * The Tailwind theme carries the same values as `egov-*` colour utilities; this
 * module exists for the places that need raw hex (canvas/SVG fills, the jsPDF
 * generator, inline gradients).
 */
export const BRAND = {
  navy: "#0A2156",
  action: "#1E90FF",
  yellow: "#FCD116",
  red: "#CE1126",
  bg: "#050A18",
  surface: "#0A1024",
  green: "#20C997",
} as const;

/**
 * One mark, one file. The navy "SA" tile at `/icon.png` is the whole identity —
 * corners cut to transparency so it needs no light and dark variant — and the
 * product name is live text next to it (`<BrandLockup>`), never baked artwork.
 * `/logos/` holds only the derived favicon sizes and the original kit exports.
 */
export const ICON = "/icon.png";

/** Social card, generated from the same tile. */
export const OG_IMAGE = "/og.png";

/** Operator of this build — shown in the app chrome and metadata. */
export const LICENSEE = {
  /** Full legal name: metadata and the console sidebar. */
  name: "AXLA SOFTWARE DEVELOPMENT SERVICES",
  /** Short form for tight UI: footer column, receipt line. */
  short: "AXLA",
} as const;

export const TAGLINE = "Super Agent. All Services.";
export const PRODUCT = "eGov SuperAgent";
