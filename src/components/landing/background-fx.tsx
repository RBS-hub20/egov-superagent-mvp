/**
 * Ambient backdrop: a barely-there dot grid plus three slow brand-coloured
 * orbs. Purely decorative and non-interactive, so it stays out of the
 * accessibility tree and never intercepts pointer events.
 */
export function BackgroundFx() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 lp-dots" />

      <div
        className="lp-orb-a absolute -left-24 top-[8%] h-[380px] w-[380px] rounded-full opacity-[0.28] blur-[80px] dark:opacity-40"
        style={{ background: "radial-gradient(circle, #0F46F3 0%, transparent 70%)" }}
      />
      <div
        className="lp-orb-b absolute -right-16 top-[26%] h-[320px] w-[320px] rounded-full opacity-[0.18] blur-[80px] dark:opacity-25"
        style={{ background: "radial-gradient(circle, #FFC700 0%, transparent 70%)" }}
      />
      <div
        className="lp-orb-c absolute bottom-[12%] left-[38%] h-[280px] w-[280px] rounded-full opacity-[0.12] blur-[80px] dark:opacity-20"
        style={{ background: "radial-gradient(circle, #E7000B 0%, transparent 70%)" }}
      />
    </div>
  );
}
