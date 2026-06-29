import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Section } from "@/components/site/Section";
import { Container } from "@/components/site/Container";
import {
  ArrowRight,
  Workflow,
  Plug,
  TrendingUp,
  Bot,
  BarChart3,
  Layers,
  Database,
  Sparkles,
  Cloud,
  Cpu,
  Boxes,
  GitBranch,
  LineChart,
  Zap,
  Search,
  PenTool,
  Hammer,
  Activity,
  Compass,
  Target,
  ShieldCheck,
  Scaling,
  Handshake,
  Infinity as InfinityIcon,
  Clock,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NogalSolutions — Automate. Integrate. Scale." },
      { name: "description", content: "AI-powered automation & systems integration studio. Eliminate repetitive work, connect software, and scale operations." },
      { property: "og:title", content: "NogalSolutions — Automate. Integrate. Scale." },
      { property: "og:description", content: "AI-powered automation & systems integration for growing businesses." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div id="top" className="relative min-h-screen text-foreground">
      <SiteBackground />
      <Navbar />
      <Hero />
      <Challenges />
      <Solutions />
      <Process />
      <WhyChoose />
      <TechStack />
      <About />
      <ProofOfWork />
      <CTA />
      <Footer />
    </div>
  );
}

/* ───────────────────── SITE BACKGROUND ─────────────────────
 * Premium, minimal ambient backdrop inspired by Apple keynote
 * wallpapers: deep charcoal base, soft crimson radial glows,
 * vignette for focus, and faint grain to prevent banding.
 */
function SiteBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Base */}
      <div className="absolute inset-0 bg-[#050505]" />
      {/* Crimson ambient glows — large, soft, off-center */}
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
      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 110% 85% at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)",
        }}
      />
      {/* Grain */}
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

/* ─────────────────────────── HERO ─────────────────────────── */

function Hero() {
  return (
    <section className="relative overflow-hidden pt-36 pb-24 lg:pt-44 lg:pb-32">
      {/* Subtle grid — focused at the top, fades quickly */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-[0.035]" style={{
        backgroundImage: "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
        backgroundSize: "72px 72px",
        maskImage: "radial-gradient(ellipse at 50% 0%, black 20%, transparent 65%)",
        WebkitMaskImage: "radial-gradient(ellipse at 50% 0%, black 20%, transparent 65%)",
      }} />

      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          {/* Left */}
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-medium text-primary">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-primary" />
              </span>
              AI-Powered Automation & Systems Integration
            </div>

            <h1 className="text-balance text-5xl font-semibold leading-[1.02] tracking-tight md:text-6xl lg:text-7xl">
              Stop wasting hours on{" "}
              <span className="text-gradient-crimson">repetitive business operations.</span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              I design and engineer the automated systems, integrations, and AI workflows that growing businesses rely on to scale operations without scaling headcount.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="#cta"
                className="group inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-base font-medium text-primary-foreground shadow-elegant transition-all hover:translate-y-[-1px] hover:bg-primary/90 hover:shadow-glow"
              >
                Start a Project
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href="#process"
                className="group inline-flex items-center gap-2 rounded-xl border border-border/80 bg-secondary/40 px-6 py-3.5 text-base font-medium text-foreground transition-colors hover:bg-secondary"
              >
                See How It Works
                <ArrowRight className="size-4 opacity-60 transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>

            <div className="mt-14 grid grid-cols-3 gap-6 border-t border-border/60 pt-8">
              {[
                { v: "10×", l: "faster operations" },
                { v: "100%", l: "custom-built systems" },
                { v: "24/7", l: "automated workflows" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="text-2xl font-semibold tracking-tight md:text-3xl">{s.v}</div>
                  <div className="mt-1 text-xs text-muted-foreground md:text-sm">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — portrait */}
          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-border/80 shadow-elegant">
              <div
                aria-hidden
                className="absolute inset-0 z-10"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.45 0.18 18 / 0.35) 0%, transparent 45%, oklch(0 0 0 / 0.4) 100%)",
                }}
              />
              <img
                src="/aaron.jpg"
                alt="Aaron Nogal, Founder of NogalSolutions"
                width={1024}
                height={1280}
                className="absolute inset-0 size-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 z-20 p-6 md:p-8">
                <div className="glass-panel rounded-2xl p-5">
                  <div className="flex items-center gap-3">
                    <div className="grid size-10 place-items-center rounded-xl bg-primary/20 text-primary">
                      <Sparkles className="size-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Aaron Nogal</p>
                      <p className="text-xs text-muted-foreground">Founder & Systems Engineer</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <div className="absolute -left-6 top-10 hidden rounded-2xl border border-border/80 bg-card/90 p-3 shadow-card backdrop-blur md:flex">
              <div className="flex items-center gap-2 px-2 text-xs">
                <Zap className="size-4 text-primary" /> Workflows live in 4 weeks
              </div>
            </div>
            <div className="absolute -right-4 bottom-24 hidden rounded-2xl border border-border/80 bg-card/90 p-3 shadow-card backdrop-blur md:flex">
              <div className="flex items-center gap-2 px-2 text-xs">
                <Activity className="size-4 text-primary" /> Always-on monitoring
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ───────────────────── FEATURE CARD ───────────────────── */

interface FeatureCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
  index?: number;
}

function FeatureCard({ icon: Icon, title, body }: FeatureCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/80 bg-card p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-elegant">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(400px circle at var(--x, 50%) var(--y, 0%), oklch(0.45 0.18 18 / 0.12), transparent 60%)",
        }}
      />
      <div className="relative">
        <div className="mb-5 inline-grid size-12 place-items-center rounded-xl border border-primary/20 bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
          <Icon className="size-5" />
        </div>
        <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">{body}</p>
      </div>
      <div
        aria-hidden
        className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
    </div>
  );
}

/* ───────────────────── CHALLENGES ───────────────────── */

function Challenges() {
  const items = [
    {
      icon: Workflow,
      title: "Too much manual work?",
      body: "Your team spends hours every week on copy-paste tasks, follow-ups, and admin that should run on their own. That's revenue trapped inside repetition.",
    },
    {
      icon: Plug,
      title: "Disconnected business systems?",
      body: "Your CRM, billing, calendar, and ops tools don't talk to each other. Data lives in silos and your team becomes the integration layer.",
    },
    {
      icon: TrendingUp,
      title: "Operations can't keep up?",
      body: "Growth exposes the cracks. Processes that worked at 10 clients break at 100. Scaling shouldn't mean hiring more people to fix the same problems.",
    },
  ];
  return (
    <Section
      id="challenges"
      eyebrow="Business Challenges"
      title={<>The hidden tax on <span className="text-gradient-crimson">every growing business.</span></>}
      subtitle="Growing businesses shouldn't be slowed down by repetitive work, disconnected software, or operations that can't keep pace."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {items.map((i) => <FeatureCard key={i.title} {...i} />)}
      </div>
    </Section>
  );
}

/* ───────────────────── SOLUTIONS ───────────────────── */

function Solutions() {
  const items = [
    { icon: Workflow, title: "Automation", body: "Reclaim hours every week by replacing repetitive operational work with reliable, always-on systems." },
    { icon: Plug, title: "Systems Integration", body: "Connect CRMs, billing, support, and operations so data moves automatically — without your team as the middleware." },
    { icon: Bot, title: "AI Systems", body: "Deploy intelligent agents that qualify, respond, summarize, and run inside the business around the clock." },
    { icon: BarChart3, title: "Business Intelligence", body: "Turn operational data into decisions your team can act on the moment they need it." },
    { icon: LineChart, title: "Dashboards", body: "A single source of truth for pipeline, performance, and bottlenecks — visible at a glance." },
    { icon: GitBranch, title: "Workflow Optimization", body: "Map, refine, and rebuild the processes quietly draining margin so the business runs cleaner at scale." },
  ];
  return (
    <Section
      id="solutions"
      eyebrow="Solution Framework"
      title={<>Systems designed around <span className="text-gradient-crimson">business outcomes.</span></>}
      subtitle="I don't sell technology. I deliver measurable improvements to how your business runs."
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((i) => <FeatureCard key={i.title} {...i} />)}
      </div>
    </Section>
  );
}

/* ───────────────────── PROCESS ───────────────────── */

function Process() {
  const steps = [
    { n: "01", icon: Search, title: "Discover", body: "I map your operations, surface bottlenecks, and identify where engineering creates real ROI." },
    { n: "02", icon: PenTool, title: "Design", body: "I architect scalable workflows tailored to how your business actually runs today and tomorrow." },
    { n: "03", icon: Hammer, title: "Build", body: "I develop the automations, integrations, AI systems, and dashboards — production-grade from day one." },
    { n: "04", icon: Activity, title: "Optimize", body: "I monitor, refine, and continuously improve so your systems get sharper the longer they run." },
  ];
  return (
    <Section
      id="process"
      eyebrow="My Process"
      title={<>A disciplined path from <span className="text-gradient-crimson">chaos to clarity.</span></>}
      subtitle="Every engagement follows the same engineering discipline — structured, repeatable, and built for lasting results."
    >
      <div className="group/timeline relative">
        {/* Connecting path — sits behind cards, subtle crimson gradient + soft glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-0 right-0 top-12 z-0 hidden h-[2px] md:block"
          style={{
            background:
              "linear-gradient(to right, transparent 0%, oklch(0.45 0.16 18 / 0.55) 18%, oklch(0.55 0.18 18 / 0.7) 50%, oklch(0.45 0.16 18 / 0.55) 82%, transparent 100%)",
            boxShadow:
              "0 0 12px oklch(0.55 0.18 18 / 0.35), 0 0 24px oklch(0.45 0.16 18 / 0.18)",
          }}
        />
        <div className="relative z-10 grid gap-8 md:grid-cols-4 md:gap-6">
          {steps.map((s, i) => (
            <div key={s.n} className="group/step relative">
              {/* Hover-illuminated segments (incoming + outgoing) */}
              {i > 0 && (
                <div
                  aria-hidden
                  className="pointer-events-none absolute right-1/2 top-12 hidden h-[2px] w-1/2 opacity-0 transition-opacity duration-300 ease-out group-hover/step:opacity-100 md:block"
                  style={{
                    background:
                      "linear-gradient(to right, transparent, oklch(0.62 0.20 18 / 0.95))",
                    boxShadow: "0 0 16px oklch(0.62 0.20 18 / 0.6)",
                  }}
                />
              )}
              {i < steps.length - 1 && (
                <div
                  aria-hidden
                  className="pointer-events-none absolute left-1/2 top-12 hidden h-[2px] w-1/2 opacity-0 transition-opacity duration-300 ease-out group-hover/step:opacity-100 md:block"
                  style={{
                    background:
                      "linear-gradient(to right, oklch(0.62 0.20 18 / 0.95), transparent)",
                    boxShadow: "0 0 16px oklch(0.62 0.20 18 / 0.6)",
                  }}
                />
              )}
              <div className="relative z-10 mb-6 inline-grid size-24 place-items-center rounded-2xl border border-border/80 bg-card shadow-card">
                <div
                  aria-hidden
                  className="absolute inset-0 rounded-2xl opacity-20"
                  style={{ background: "var(--gradient-crimson)" }}
                />
                <s.icon className="relative size-7 text-primary" />
                <span
                  className="absolute -right-2 -top-2 grid size-7 place-items-center rounded-full text-[10px] font-bold text-primary-foreground shadow-glow ring-1 ring-white/15"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.62 0.22 18) 0%, oklch(0.48 0.20 18) 100%)",
                  }}
                >
                  {s.n}
                </span>
              </div>
              <h3 className="text-xl font-semibold tracking-tight">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ───────────────────── TECH STACK ───────────────────── */

function TechStack() {
  const groups = [
    { icon: Workflow, name: "Workflow Automation", tools: ["n8n", "Zapier", "Make", "Webhooks"] },
    { icon: Layers, name: "CRM Ecosystems", tools: ["GoHighLevel", "HubSpot", "Custom CRM"] },
    { icon: Bot, name: "AI Platforms", tools: ["OpenAI", "Claude", "AI Agents", "RAG", "MCP"] },
    { icon: Plug, name: "Backend Integrations", tools: ["REST APIs", "GraphQL", "OAuth", "HTTP"] },
    { icon: Database, name: "Data Engineering", tools: ["SQL", "PostgreSQL", "Supabase", "Google Sheets"] },
    { icon: Cloud, name: "Cloud Infrastructure", tools: ["Docker", "Linux", "Hostinger VPS", "DigitalOcean"] },
    { icon: Cpu, name: "Frontend Applications", tools: ["React", "Next.js", "TypeScript", "Tailwind CSS"] },
    { icon: BarChart3, name: "Business Intelligence", tools: ["Dashboards", "Analytics", "Reporting"] },
    { icon: Boxes, name: "System Architecture", tools: ["Solution Architecture", "Workflow Design", "Process Mapping", "Integration Architecture"] },
  ];
  return (
    <Section
      id="stack"
      eyebrow="Technology Stack"
      title={<>The implementation layer, <span className="text-gradient-crimson">not the product.</span></>}
      subtitle="Technology is the supporting evidence — chosen and combined to fit the business, never the other way around."
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((g) => (
          <div key={g.name} className="group rounded-2xl border border-border/80 bg-card/60 p-6 transition-all hover:border-primary/40 hover:bg-card">
            <div className="flex items-center gap-3">
              <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <g.icon className="size-5" />
              </div>
              <p className="text-sm font-semibold tracking-tight">{g.name}</p>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {g.tools.map((t) => (
                <span key={t} className="rounded-md border border-border/60 bg-secondary/40 px-2.5 py-1 text-xs text-foreground/80">{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ───────────────────── ABOUT ───────────────────── */

function About() {
  return (
    <Section id="about" className="border-y border-border/60 bg-secondary/20">
      <div className="grid items-center gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-3xl border border-border/80 shadow-elegant">
            <img src="/aaron.jpg" alt="Aaron Nogal" loading="lazy" width={1024} height={1280} className="size-full object-cover object-[center_25%]" />
            <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 50%, oklch(0 0 0 / 0.6) 100%)" }} />
          </div>
        </div>
        <div className="lg:col-span-7">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium tracking-wider text-primary uppercase">
            <span className="size-1.5 rounded-full bg-primary" /> About
          </div>
          <h2 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight md:text-5xl">
            An engineer who thinks in <span className="text-gradient-crimson">business systems.</span>
          </h2>
          <div className="mt-7 space-y-5 text-lg leading-relaxed text-muted-foreground">
            <p>
              I'm Aaron Nogal — a systems engineer focused on architecture-first automation, integrations, and AI systems that hold up in production.
            </p>
            <p>
              Every project is measured by one standard: did it create a measurable, lasting business outcome?
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { v: "Architecture-first" },
              { v: "Production-grade" },
              { v: "Outcome-driven" },
            ].map((p) => (
              <div key={p.v} className="rounded-xl border border-primary/20 bg-primary/[0.06] px-4 py-3 text-center">
                <p className="text-sm font-semibold tracking-tight text-foreground">{p.v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ───────────────────── WHY CHOOSE ───────────────────── */

function WhyChoose() {
  const items = [
    { icon: Compass, title: "Architecture-First", body: "Every solution begins with understanding how your business operates before selecting any technology." },
    { icon: Target, title: "Business Outcomes", body: "Every project is measured by operational improvements, not by the number of automations delivered." },
    { icon: ShieldCheck, title: "Production-Grade Systems", body: "I build reliable systems designed for real businesses — not prototypes that fall over under load." },
    { icon: Scaling, title: "Scalable Foundations", body: "Workflows are built to keep supporting growth as the business expands, without constant rework." },
    { icon: Handshake, title: "Transparent Collaboration", body: "You'll work directly with the engineer designing and building your systems — no account layers." },
    { icon: InfinityIcon, title: "Long-Term Thinking", body: "Systems are designed to remain maintainable, not to create technical debt you inherit later." },
  ];
  return (
    <Section
      id="why"
      eyebrow="Why NogalSolutions"
      title={<>Why businesses choose <span className="text-gradient-crimson">NogalSolutions.</span></>}
      subtitle="Technology is easy to buy. Engineering systems that actually improve a business is much harder."
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((i) => <FeatureCard key={i.title} {...i} />)}
      </div>
    </Section>
  );
}

/* ───────────────────── PROOF OF WORK ───────────────────── */

function ProofOfWork() {
  const items = [
    { title: "AI-Assisted Pre-Sales Operations", body: "Lead qualification, enrichment, and intelligent routing — engineered end-to-end." },
    { title: "AI-Assisted Post-Sales Operations", body: "Onboarding, follow-up, and retention workflows that run reliably in the background." },
    { title: "Business Operations Dashboard", body: "A unified view of pipeline, performance, and operational health — built on live data." },
  ];
  return (
    <Section
      id="proof"
      eyebrow="Proof of Work"
      title={<>Real systems. <span className="text-gradient-crimson">Real outcomes.</span></>}
      subtitle="A closer look at production systems engineered for live business operations."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {items.map((p) => (
          <div key={p.title} className="group relative overflow-hidden rounded-2xl border border-border/80 bg-card p-7 shadow-card">
            <div aria-hidden className="pointer-events-none absolute inset-0 opacity-60" style={{
              background: "radial-gradient(ellipse 80% 60% at 50% 0%, oklch(0.30 0.12 18 / 0.18), transparent 70%)",
            }} />
            <div className="relative">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-primary">
                <Clock className="size-3" /> Launching Soon
              </div>
              <h3 className="text-lg font-semibold tracking-tight">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              <div className="mt-6 h-32 rounded-xl border border-dashed border-border/60 bg-secondary/30" />
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ───────────────────── CTA ───────────────────── */

function CTA() {
  return (
    <section id="cta" className="relative py-24 lg:py-32">
      <Container>
        <div
          className="relative overflow-hidden rounded-3xl border border-primary/20 p-10 shadow-elegant md:p-16 lg:p-20"
          style={{
            background:
              "linear-gradient(135deg, #0B0608 0%, #2A0710 45%, #45101C 65%, #2A0710 85%, #0B0608 100%)",
          }}
        >
          {/* Grid */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
              backgroundSize: "44px 44px",
              maskImage:
                "radial-gradient(ellipse 80% 70% at 30% 40%, black 30%, transparent 85%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 80% 70% at 30% 40%, black 30%, transparent 85%)",
            }}
          />
          {/* Soft radial highlight behind heading */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 55% 60% at 22% 32%, oklch(0.45 0.16 18 / 0.45), transparent 65%)",
            }}
          />
          {/* Vignette */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 100% 90% at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)",
            }}
          />
          <div className="relative max-w-3xl">
            <h2 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-primary-foreground md:text-6xl">
              Ready to build systems that scale with your business?
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/85 md:text-xl">
              Tell me where your operations break down. I'll design and build the automations, integrations, and AI systems that fix it — for good.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="#"
                className="group inline-flex items-center gap-2 rounded-xl bg-background px-6 py-3.5 text-base font-medium text-foreground shadow-card transition-all hover:translate-y-[-1px]"
              >
                Start a Project
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href="#"
                className="group inline-flex items-center gap-2 rounded-xl border border-primary-foreground/30 bg-primary-foreground/10 px-6 py-3.5 text-base font-medium text-primary-foreground transition-colors hover:bg-primary-foreground/20"
              >
                Book Discovery Call
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
