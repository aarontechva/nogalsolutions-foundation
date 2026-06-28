export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto w-full max-w-7xl px-6 py-14 lg:px-10">
        <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-primary to-primary/60 text-sm font-bold text-primary-foreground">N</span>
              <span className="text-base font-semibold tracking-tight">NogalSolutions</span>
            </div>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              AI-powered automation & systems integration studio. Built for businesses that are ready to scale.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-10 text-sm md:grid-cols-3">
            <div>
              <p className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">Explore</p>
              <ul className="space-y-2">
                <li><a href="#challenges" className="text-foreground/80 hover:text-primary">Challenges</a></li>
                <li><a href="#solutions" className="text-foreground/80 hover:text-primary">Solutions</a></li>
                <li><a href="#process" className="text-foreground/80 hover:text-primary">Process</a></li>
              </ul>
            </div>
            <div>
              <p className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">Company</p>
              <ul className="space-y-2">
                <li><a href="#about" className="text-foreground/80 hover:text-primary">About</a></li>
                <li><a href="#cta" className="text-foreground/80 hover:text-primary">Contact</a></li>
              </ul>
            </div>
            <div>
              <p className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">Get in touch</p>
              <a href="#cta" className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-primary-foreground hover:bg-primary/90">
                Book a call →
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} NogalSolutions. All rights reserved.</p>
          <p>Engineered by Aaron Nogal.</p>
        </div>
      </div>
    </footer>
  );
}