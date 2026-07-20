/* Premium, minimal ambient backdrop inspired by Apple keynote wallpapers:
 * deep charcoal base, soft crimson radial glows, vignette for focus, and
 * faint grain to prevent banding. Shared across every page for a consistent look. */
export function SiteBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background">
      {/* Light mode: soft, mostly-white backdrop with faint crimson glows */}
      <div className="absolute inset-0 dark:hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 75% 55% at 82% 6%, oklch(0.85 0.06 18 / 0.5), transparent 62%)," +
              "radial-gradient(ellipse 60% 50% at 12% 38%, oklch(0.9 0.04 18 / 0.35), transparent 68%)," +
              "radial-gradient(ellipse 90% 55% at 50% 108%, oklch(0.88 0.05 18 / 0.4), transparent 62%)",
          }}
        />
      </div>
      {/* Dark mode: deep charcoal base with crimson ambient glows + vignette */}
      <div className="absolute inset-0 hidden dark:block">
        <div className="absolute inset-0 bg-[#050505]" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 75% 55% at 82% 6%, oklch(0.32 0.12 18 / 0.55), transparent 62%)," +
              "radial-gradient(ellipse 60% 50% at 12% 38%, oklch(0.22 0.09 18 / 0.38), transparent 68%)," +
              "radial-gradient(ellipse 90% 55% at 50% 108%, oklch(0.26 0.11 18 / 0.42), transparent 62%)," +
              "radial-gradient(ellipse 55% 40% at 78% 72%, oklch(0.20 0.08 18 / 0.30), transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 110% 85% at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)",
          }}
        />
      </div>
      {/* Grain — subtle on both themes via blend mode */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.6 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
        }}
      />
    </div>
  );
}
