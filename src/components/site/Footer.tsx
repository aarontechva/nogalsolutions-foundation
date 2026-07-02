import { Button } from "@/components/ui/button";

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
              AI-powered systems engineering studio helping businesses automate operations, integrate software, and build scalable workflows.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-10 text-sm md:grid-cols-3">
            <div>
              <p className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">Explore</p>
              <ul className="space-y-2">
                <li><a href="#solutions" className="text-foreground/80 hover:text-primary">Solutions</a></li>
                <li><a href="#process" className="text-foreground/80 hover:text-primary">Process</a></li>
                <li><a href="#proof" className="text-foreground/80 hover:text-primary">Proof of Work</a></li>
              </ul>
            </div>
            <div>
              <p className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">Company</p>
              <ul className="space-y-2">
                <li><a href="#stack" className="text-foreground/80 hover:text-primary">Technology</a></li>
                <li><a href="#about" className="text-foreground/80 hover:text-primary">About</a></li>
                <li><a href="#intake" className="text-foreground/80 hover:text-primary">Contact</a></li>
              </ul>
            </div>
            <div>
              <p className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">Get in touch</p>
              <div className="flex flex-col gap-3">
                <a href="#intake" className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-3 py-2 text-primary-foreground hover:bg-primary/90">
                  Start a Project →
                </a>
                <div className="flex flex-wrap gap-3">
                  <Button asChild variant="secondary" size="default">
                    <a href="https://www.linkedin.com/in/aaron-nogal" target="_blank" rel="noreferrer">LinkedIn</a>
                  </Button>
                  <Button asChild variant="secondary" size="default">
                    <a href="https://www.upwork.com/freelancers/~015a9f13d7c1fce814?mp_source=share" target="_blank" rel="noreferrer">Upwork</a>
                  </Button>
                </div>
              </div>
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