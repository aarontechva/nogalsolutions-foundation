import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "#challenges", label: "Challenges" },
  { href: "#solutions", label: "Solutions" },
  { href: "#process", label: "Process" },
  { href: "#stack", label: "Stack" },
  { href: "#about", label: "About" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={cn("fixed inset-x-0 top-0 z-50 transition-all duration-300", scrolled ? "py-3" : "py-5")}>
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-10">
        <div className={cn(
          "flex items-center justify-between rounded-2xl px-5 py-3 transition-all duration-300",
          scrolled ? "glass-panel shadow-card" : "bg-transparent",
        )}>
          <a href="#top" className="flex items-center gap-2.5 text-foreground">
            <span className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-primary to-primary/60 text-sm font-bold text-primary-foreground shadow-glow">N</span>
            <span className="text-base font-semibold tracking-tight">NogalSolutions</span>
          </a>
          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((n) => (
              <a key={n.href} href={n.href} className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                {n.label}
              </a>
            ))}
          </nav>
          <a href="#cta" className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-elegant transition-all hover:bg-primary/90 hover:shadow-glow">
            Start a Project
            <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </header>
  );
}