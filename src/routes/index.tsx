import { createFileRoute } from "@tanstack/react-router";
import founderImg from "@/assets/aaron.jpg.asset.json";
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
    <div id="top" className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Hero />
      <Challenges />
      <Solutions />
      <Process />
      <TechStack />
      <About />
      <CTA />
      <Footer />
    </div>
  );
}

/* ─────────────────────────── HERO ─────────────────────────── */

function Hero() {
  return (
    <section className="relative overflow-hidden pt-36 pb-24 lg:pt-44 lg:pb-32">
      {/* Background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: "var(--gradient-hero)" }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-[0.04]" style={{
        backgroundImage: "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
        backgroundSize: "60px 60px",
        maskImage: "radial-gradient(ellipse at 50% 0%, black 30%, transparent 70%)",
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
              Automate repetitive work. Connect your business systems. Scale your operations with intelligent workflows built around your business.
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
                src={founderImg.url}
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
      subtitle="Growing businesses shouldn't be slowed down by repetitive work, disconnected software, or inefficient operations."
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
    { icon: Workflow, title: "Automation", body: "Eliminate hours of repetitive work. Free your team to focus on revenue, clients, and growth — not admin." },
    { icon: Plug, title: "Integrations", body: "Connect your CRM, billing, support, and operations into one system that moves data automatically." },
    { icon: Bot, title: "AI Systems", body: "Deploy AI agents that qualify leads, answer questions, summarize calls, and run inside your business 24/7." },
    { icon: BarChart3, title: "Business Intelligence", body: "Turn operational data into decisions. Real metrics, real-time, surfaced where your team already works." },
    { icon: LineChart, title: "Dashboards", body: "Single source of truth for your operations. Pipeline, performance, and bottlenecks visible at a glance." },
    { icon: GitBranch, title: "Workflow Optimization", body: "Map, refine, and rebuild the processes that quietly cost you money. Less friction, more output." },
  ];
  return (
    <Section
      id="solutions"
      eyebrow="Solution Framework"
      title={<>Systems designed around <span className="text-gradient-crimson">business outcomes.</span></>}
      subtitle="We don't sell technology. We deliver measurable improvements to how your business runs."
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
    { n: "01", icon: Search, title: "Discover", body: "We map your operations, surface bottlenecks, and identify where automation creates real ROI." },
    { n: "02", icon: PenTool, title: "Design", body: "We architect scalable workflows tailored to how your business actually runs today and tomorrow." },
    { n: "03", icon: Hammer, title: "Build", body: "We develop automations, integrations, AI agents, and dashboards — production-grade from day one." },
    { n: "04", icon: Activity, title: "Optimize", body: "We monitor, refine, and continuously improve so your systems get smarter the longer they run." },
  ];
  return (
    <Section
      id="process"
      eyebrow="Our Process"
      title={<>A disciplined path from <span className="text-gradient-crimson">chaos to clarity.</span></>}
      subtitle="Every engagement follows the same proven framework — built for speed, transparency, and lasting results."
    >
      <div className="relative">
        <div aria-hidden className="absolute left-0 right-0 top-12 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block" />
        <div className="grid gap-8 md:grid-cols-4 md:gap-6">
          {steps.map((s) => (
            <div key={s.n} className="relative">
              <div className="relative z-10 mb-6 inline-grid size-24 place-items-center rounded-2xl border border-border/80 bg-card shadow-card">
                <div
                  aria-hidden
                  className="absolute inset-0 rounded-2xl opacity-20"
                  style={{ background: "var(--gradient-crimson)" }}
                />
                <s.icon className="relative size-7 text-primary" />
                <span className="absolute -right-2 -top-2 grid size-7 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-glow">
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
  const items = [
    { icon: Workflow, name: "n8n", body: "Open-source automation engine for complex multi-step workflows." },
    { icon: Layers, name: "GoHighLevel", body: "All-in-one CRM, marketing, and pipeline automation platform." },
    { icon: Zap, name: "Zapier", body: "Rapid integration for thousands of apps in production-grade flows." },
    { icon: Plug, name: "REST APIs", body: "Custom connections between any modern software — no limits." },
    { icon: Bot, name: "AI Agents", body: "Autonomous assistants that handle tasks, conversations, and decisions." },
    { icon: Database, name: "SQL", body: "Reliable, performant data foundations behind every system we ship." },
    { icon: Boxes, name: "Databases", body: "Postgres, Supabase, and managed stores designed to scale with you." },
    { icon: Layers, name: "CRMs", body: "HubSpot, Salesforce, GHL — extended and integrated to fit your workflow." },
    { icon: Cloud, name: "Cloud", body: "Modern cloud infrastructure: secure, observable, deployed in days." },
    { icon: Sparkles, name: "OpenAI", body: "GPT-class intelligence embedded directly into your operations." },
    { icon: Cpu, name: "Claude", body: "Long-context reasoning for documents, research, and complex automations." },
    { icon: BarChart3, name: "Analytics", body: "Metabase, Looker, and custom dashboards for real operational visibility." },
  ];
  return (
    <Section
      id="stack"
      eyebrow="Technology Stack"
      title={<>Best-in-class tools, <span className="text-gradient-crimson">orchestrated for you.</span></>}
      subtitle="Technology is never the product. These are the instruments we use to build systems that deliver business outcomes."
    >
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {items.map((t) => (
          <div key={t.name} className="group flex items-start gap-4 rounded-xl border border-border/80 bg-card/60 p-5 transition-all hover:border-primary/40 hover:bg-card">
            <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <t.icon className="size-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">{t.name}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{t.body}</p>
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
            <img src={founderImg} alt="Aaron Nogal" loading="lazy" width={1024} height={1280} className="size-full object-cover" />
            <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 50%, oklch(0 0 0 / 0.6) 100%)" }} />
          </div>
        </div>
        <div className="lg:col-span-7">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium tracking-wider text-primary uppercase">
            <span className="size-1.5 rounded-full bg-primary" /> About
          </div>
          <h2 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight md:text-5xl">
            Built by an engineer who understands <span className="text-gradient-crimson">business systems.</span>
          </h2>
          <div className="mt-7 space-y-5 text-lg leading-relaxed text-muted-foreground">
            <p>
              Aaron Nogal specializes in automation architecture, systems integration, AI-powered workflows, and operational optimization.
            </p>
            <p>
              The focus is helping businesses scale — not selling technology. Every project is judged by one standard: does it create measurable, lasting business outcomes?
            </p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3">
            {[
              { k: "Systems Engineering", v: "Architecture-first" },
              { k: "Automation", v: "Production-grade" },
              { k: "AI Integration", v: "Outcome-driven" },
            ].map((p) => (
              <div key={p.k} className="rounded-xl border border-border/80 bg-card p-4">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{p.k}</p>
                <p className="mt-1 text-sm font-semibold">{p.v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ───────────────────── CTA ───────────────────── */

function CTA() {
  return (
    <section id="cta" className="relative py-24 lg:py-32">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border border-primary/30 p-10 shadow-elegant md:p-16 lg:p-20"
          style={{ background: "var(--gradient-crimson)" }}
        >
          <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.08]" style={{
            backgroundImage: "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }} />
          <div aria-hidden className="pointer-events-none absolute -right-40 -top-40 size-[500px] rounded-full bg-white/10 blur-3xl" />
          <div className="relative max-w-3xl">
            <h2 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-primary-foreground md:text-6xl">
              Ready to build systems that scale with your business?
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/85 md:text-xl">
              Tell us where your operations break down. We'll design and build the automations, integrations, and AI systems that fix it — for good.
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
