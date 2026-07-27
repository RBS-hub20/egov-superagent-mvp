/**
 * Canonical public origin.
 *
 * Production serves egovsuperagent.online; Vercel preview deployments set
 * NEXT_PUBLIC_SITE_URL so canonical links, OG images and the sitemap point at
 * the deployment actually being viewed instead of the live domain.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://egovsuperagent.online"
).replace(/\/$/, "");
