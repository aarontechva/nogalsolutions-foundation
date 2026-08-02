import { useEffect, useState } from "react";
import { Moon, Sun, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/theme";

const nav = [
  { href: "/#challenges", label: "Challenges" },
  { href: "/#solutions", label: "Solutions" },
  { href: "/#process", label: "Process" },
  { href: "/#why", label: "My Edge" },
  { href: "/#stack", label: "Technology" },
  { href: "/#live-systems", label: "Live Systems" },
  { href: "/#about", label: "About" },
  { href: "/#intake", label: "Contact" },
];

/**
 * Full-width bar rather than a floating pill: it spans the viewport and is
 * separated by a real border, with its contents aligned to the same max-w-7xl
 * measure the page Container uses, so the logo sits directly above the page's
 * left margin instead of inset from it.
 *
 * Three-zone grid (auto / 1fr / auto) so the link row is centred against the
 * bar itself and stays centred regardless of how wide the logo or the actions
 * get. Balancing by eye with flex + justify-between drifts the moment either
 * side changes.
 *
 * Breakpoint note, and this fixes a real bug: the links used to appear from `md`
 * (768px), but measured at 820px the bar wanted 922px of content inside 755px of
 * space and overflowed by 167px. The row is now gated at 1100px, chosen by
 * measurement rather than by reaching for the nearest named breakpoint: at 1024
 * the eight links measure 609px inside a 609px track, so they fit with literally
 * zero slack, and at 1280 they measure 677px inside 850px. 1100px is where real
 * breathing room starts. Everything below it gets the disclosure menu, which also
 * closes the separate gap that phones had no navigation at all.
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Escape closes the menu; without it the only way out on a phone is a link.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b backdrop-blur-xl transition-colors duration-300",
        scrolled || menuOpen
          ? "border-border/70 bg-background/95 shadow-card"
          : "border-border/40 bg-background/90",
      )}
    >
      <div
        className={cn(
          // Two tracks below the gate, three above it. A `display:none` nav drops out
          // of the grid entirely, so a fixed three-track definition silently hands
          // the actions zone the 1fr column and stretches it across the bar. It
          // still looks right because of justify-end, which is exactly why it is
          // worth being explicit rather than leaving it to chance.
          "mx-auto grid w-full max-w-7xl grid-cols-[auto_1fr] items-center gap-4 px-6 transition-[height] duration-300 min-[1100px]:grid-cols-[auto_1fr_auto] lg:px-10",
          scrolled ? "h-16" : "h-[72px]",
        )}
      >
        <a href="/#top" className="flex shrink-0 items-center gap-2.5">
          <span className="text-shine-crimson text-base font-semibold tracking-tight whitespace-nowrap">
            NogalSolutions
          </span>
        </a>

        {/* Centre zone. Type and padding run one step tighter until xl so the row
            keeps real slack just above the 1100px gate, then relax on wider screens. */}
        <nav className="hidden items-center justify-center gap-0.5 min-[1100px]:flex">
          {nav.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="rounded-lg px-2.5 py-2 text-[0.8125rem] whitespace-nowrap text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground xl:px-3 xl:text-sm 2xl:px-3.5"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center justify-end gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            className="grid size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>

          <a
            href="/#intake"
            className="hidden items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium whitespace-nowrap text-primary-foreground shadow-elegant transition-all hover:bg-primary/90 hover:shadow-glow sm:inline-flex"
          >
            Start a Project
            <span aria-hidden>→</span>
          </a>

          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="grid size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground min-[1100px]:hidden"
          >
            {menuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {/* Disclosure panel for everything below the 1100px gate. Two columns from sm
          up so eight links do not become an eight-row scroll on a small screen. */}
      {menuOpen && (
        <div className="border-t border-border/60 bg-background/95 min-[1100px]:hidden">
          <nav className="mx-auto grid max-w-7xl grid-cols-2 gap-1 px-6 py-4 sm:grid-cols-3 lg:px-10">
            {nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {n.label}
              </a>
            ))}
            <a
              href="/#intake"
              onClick={() => setMenuOpen(false)}
              className="col-span-2 mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-elegant transition-all hover:bg-primary/90 sm:col-span-3 sm:hidden"
            >
              Start a Project
              <span aria-hidden>→</span>
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
