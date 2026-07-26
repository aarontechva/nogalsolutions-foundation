import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { IntakeForm } from "@/components/site/IntakeForm";
import { Section } from "@/components/site/Section";
import { Container } from "@/components/site/Container";
import { SiteBackground } from "@/components/site/SiteBackground";
import {
  ArrowRight,
  Workflow,
  Plug,
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
  Download,
  Wifi,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NogalSolutions: Automate. Integrate. Scale." },
      {
        name: "description",
        content:
          "AI-powered automation & systems integration studio. Eliminate repetitive work, connect software, and scale operations.",
      },
      { property: "og:title", content: "NogalSolutions: Automate. Integrate. Scale." },
      {
        property: "og:description",
        content: "AI-powered automation & systems integration for growing businesses.",
      },
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
      <ProofOfWork />
      <About />
      <CTA />
      <IntakeForm />
      <Footer />
    </div>
  );
}

/* ─────────────────────────── HERO ─────────────────────────── */

function Hero() {
  return (
    <section className="relative overflow-hidden pt-36 pb-24 lg:pt-44 lg:pb-32">
      {/* Subtle grid — focused at the top, fades quickly */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--foreground) 1px, transparent 1px), linear-gradient(to bottom, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(ellipse at 50% 0%, black 20%, transparent 65%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 0%, black 20%, transparent 65%)",
        }}
      />

      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          {/* Left */}
          <div className="max-w-2xl">
            <h1 className="text-balance text-5xl font-semibold leading-[1.02] tracking-tight md:text-6xl lg:text-7xl">
              Stop wasting hours on{" "}
              <span className="text-gradient-crimson">repetitive business operations.</span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              I design and engineer the automated systems, integrations, and AI workflows that
              growing businesses rely on to scale operations without scaling headcount.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="#intake"
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
                      {/* Hardcoded white, not theme tokens — sits on the portrait photo itself,
                          which keeps its own dark/crimson backdrop regardless of site theme. */}
                      <p className="text-sm font-semibold text-white">Aaron Nogal</p>
                      <p className="text-xs text-white/70">
                        AI-Powered Automation Specialist and Solutions Architect
                      </p>
                    </div>
                  </div>
                </div>
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

// Deliberately not FeatureCard. Problems read better as an editorial list than as
// bordered boxes, and it keeps this section visually distinct from My Edge / Proof of
// Work, which do use the card grid.
function Challenges() {
  const items = [
    {
      title: "Too much manual work?",
      body: "Your team spends hours every week on copy-paste tasks, follow-ups, and admin that should run on their own. That's revenue trapped inside repetition.",
    },
    {
      title: "Disconnected business systems?",
      body: "Your CRM, billing, calendar, and ops tools don't talk to each other. Data lives in silos and your team becomes the integration layer.",
    },
    {
      title: "Operations can't keep up?",
      body: "Growth exposes the cracks. Processes that worked at 10 clients break at 100. Scaling shouldn't mean hiring more people to fix the same problems.",
    },
  ];
  const { ref, inView } = useInView<HTMLUListElement>();

  return (
    <Section
      id="challenges"
      className="overflow-x-clip"
      title={
        <>
          The hidden tax on <span className="text-gradient-crimson">every growing business.</span>
        </>
      }
      subtitle="Growing businesses shouldn't be slowed down by repetitive work, disconnected software, or operations that can't keep pace."
    >
      <ul ref={ref} className="border-t border-border/60">
        {items.map((item, i) => (
          <li
            key={item.title}
            className={cn(
              "reveal group grid items-baseline gap-x-8 gap-y-3 border-b border-border/60 py-9 transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] md:grid-cols-[4.5rem_minmax(0,0.85fr)_minmax(0,1.15fr)] md:py-11 motion-reduce:transition-none",
              inView ? "translate-x-0" : "-translate-x-12",
            )}
            style={{ transitionDelay: inView ? `${i * 120}ms` : "0ms" }}
          >
            <span className="font-mono text-3xl leading-none font-semibold text-muted-foreground/30 transition-colors duration-300 group-hover:text-primary md:text-4xl">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="text-2xl font-semibold tracking-tight text-balance md:text-[1.75rem]">
              {item.title}
            </h3>
            <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
              {item.body}
            </p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

/* ───────────────────── SOLUTIONS ───────────────────── */

// The six solutions grouped under the practice's own three pillars, one screen per
// pillar. Copy here is deliberately tighter than the card version it replaced: a
// phone screen reads like an app, not a brochure.
const solutionScreens = [
  {
    index: "01",
    pillar: "Automate",
    headline: "Hours back, every week.",
    items: [
      {
        icon: Workflow,
        title: "Automation",
        body: "Repetitive work replaced by always-on systems.",
      },
      {
        icon: GitBranch,
        title: "Workflow Optimization",
        body: "Processes rebuilt so margin stops leaking.",
      },
    ],
  },
  {
    index: "02",
    pillar: "Integrate",
    headline: "Everything talks to everything.",
    items: [
      {
        icon: Plug,
        title: "Systems Integration",
        body: "Your tools connected so data moves itself.",
      },
      { icon: Bot, title: "AI Systems", body: "Agents that qualify and respond around the clock." },
    ],
  },
  {
    index: "03",
    pillar: "Scale",
    headline: "Clarity as you grow.",
    items: [
      {
        icon: BarChart3,
        title: "Business Intelligence",
        body: "Data turned into decisions you can act on.",
      },
      {
        icon: LineChart,
        title: "Dashboards",
        body: "One source of truth for pipeline and performance.",
      },
    ],
  },
];

/* Every dimension inside the mockup is derived from --pw (the phone's width), so a
   single clamp() on the wrapper scales the frame, the Dynamic Island, and all type
   together. Proportions follow the iPhone 17 Pro Max: 440x956pt screen. */
function PhoneStatusBar() {
  return (
    <div
      className="relative z-10 flex items-center justify-between text-white"
      style={{
        paddingLeft: "calc(var(--pw) * 0.085)",
        paddingRight: "calc(var(--pw) * 0.085)",
        paddingTop: "calc(var(--pw) * 0.052)",
      }}
    >
      <span
        className="font-semibold tracking-tight"
        style={{ fontSize: "calc(var(--pw) * 0.049)" }}
      >
        9:41
      </span>
      <div className="flex items-center" style={{ gap: "calc(var(--pw) * 0.019)" }}>
        <div
          className="flex items-end"
          style={{ gap: "calc(var(--pw) * 0.006)", height: "calc(var(--pw) * 0.034)" }}
        >
          {[0.45, 0.65, 0.85, 1].map((h) => (
            <span
              key={h}
              className="rounded-[1px] bg-white"
              style={{ width: "calc(var(--pw) * 0.009)", height: `${h * 100}%` }}
            />
          ))}
        </div>
        <Wifi
          style={{ width: "calc(var(--pw) * 0.047)", height: "calc(var(--pw) * 0.047)" }}
          strokeWidth={2.75}
        />
        <div
          className="relative rounded-[2px] border border-white/70"
          style={{
            width: "calc(var(--pw) * 0.070)",
            height: "calc(var(--pw) * 0.036)",
            padding: "calc(var(--pw) * 0.005)",
          }}
        >
          <div className="h-full rounded-[1px] bg-white" style={{ width: "72%" }} />
        </div>
      </div>
    </div>
  );
}

// --pw (the phone's width, which every interior dimension derives from) is set per
// breakpoint via className rather than inline, so it can grow on the roomier
// breakpoints now that only one device is ever on screen.
function SolutionPhone({
  screens,
  inView,
  className,
}: {
  screens: typeof solutionScreens;
  inView: boolean;
  className?: string;
}) {
  const [active, setActive] = useState(0);

  // Auto-advance only starts once the reveal has actually fired — no point cycling a
  // phone that's still off-screen at translate-x-24. Runs continuously afterward with
  // no pause condition: an earlier version paused on hover, but scrolling moves page
  // content under a stationary cursor without the mouse itself moving, which fires real
  // mouseenter/mouseleave events — so the cycle only ever seemed to run while the
  // cursor happened to be off the phone, i.e. effectively only right after a click.
  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => {
      setActive((i) => (i + 1) % screens.length);
    }, 8000);
    return () => clearInterval(id);
  }, [inView, screens.length]);

  return (
    // The scroll reveal (opacity + rise) and the hover pop (lift + scale) live on two
    // separate nested elements. Driving both from one element means one transform
    // overwrites the other — an earlier single-element version silently lost its tilt
    // that way. Nesting composes them instead.
    <div
      className={cn(
        "reveal group relative shrink-0 transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:z-10 motion-reduce:transition-none",
        inView ? "translate-x-0" : "translate-x-24",
        className,
      )}
      style={{ width: "var(--pw)" }}
    >
      <div className="relative transition-transform duration-300 ease-out will-change-transform group-hover:-translate-y-3 group-hover:scale-[1.05] motion-reduce:transform-none">
        {/* Crimson bloom that fades in behind the device on hover */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-8 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100 motion-reduce:transition-none"
          style={{
            background: "radial-gradient(closest-side, oklch(0.45 0.18 18 / 0.36), transparent)",
          }}
        />

        {/* Side buttons: action + volume on the left, power on the right */}
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 right-0">
          {[
            { top: "17%", height: "3.4%", side: "left" },
            { top: "25%", height: "6.6%", side: "left" },
            { top: "34%", height: "6.6%", side: "left" },
            { top: "26%", height: "9.5%", side: "right" },
          ].map((b) => (
            <span
              key={`${b.side}-${b.top}`}
              className="absolute rounded-full"
              style={{
                top: b.top,
                height: b.height,
                width: "calc(var(--pw) * 0.011)",
                [b.side]: "calc(var(--pw) * -0.006)",
                background: "linear-gradient(180deg, #6b6259 0%, #3a352f 50%, #6b6259 100%)",
              }}
            />
          ))}
        </div>

        {/* Titanium band */}
        <div
          className="relative"
          style={{
            padding: "calc(var(--pw) * 0.0115)",
            borderRadius: "calc(var(--pw) * 0.152)",
            background:
              "linear-gradient(145deg, #9d958b 0%, #4a443d 22%, #7d766c 48%, #35302b 72%, #8e867c 100%)",
            boxShadow: "0 26px 50px -20px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)",
          }}
        >
          {/* Black bezel */}
          <div
            className="relative bg-black"
            style={{ padding: "calc(var(--pw) * 0.019)", borderRadius: "calc(var(--pw) * 0.141)" }}
          >
            {/* Screen */}
            <div
              className="relative overflow-hidden"
              style={{ aspectRatio: "440 / 956", borderRadius: "calc(var(--pw) * 0.122)" }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(120% 55% at 50% 0%, #3a0f1b 0%, #17090e 42%, #0b0508 100%)",
                }}
              />

              {/* Dynamic Island */}
              <div
                aria-hidden
                className="absolute left-1/2 z-20 -translate-x-1/2 rounded-full bg-black"
                style={{
                  top: "calc(var(--pw) * 0.032)",
                  width: "calc(var(--pw) * 0.30)",
                  height: "calc(var(--pw) * 0.088)",
                }}
              >
                <span
                  className="absolute rounded-full bg-[#1b1b1f]"
                  style={{
                    right: "calc(var(--pw) * 0.022)",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "calc(var(--pw) * 0.032)",
                    height: "calc(var(--pw) * 0.032)",
                  }}
                />
              </div>

              <PhoneStatusBar />

              {/* App content: brand row + story-style progress segments are static
                  chrome; only the panel beneath them swipes between screens. */}
              <div
                className="relative z-10 flex h-full flex-col"
                style={{
                  paddingTop: "calc(var(--pw) * 0.075)",
                  gap: "calc(var(--pw) * 0.038)",
                }}
              >
                <div
                  className="flex items-center justify-between"
                  style={{
                    paddingLeft: "calc(var(--pw) * 0.065)",
                    paddingRight: "calc(var(--pw) * 0.065)",
                  }}
                >
                  <span
                    className="font-semibold tracking-tight text-white"
                    style={{ fontSize: "calc(var(--pw) * 0.047)" }}
                  >
                    Nogal<span className="text-[#e0566d]">Solutions</span>
                  </span>
                  <span
                    className="font-mono text-white/35"
                    style={{ fontSize: "calc(var(--pw) * 0.040)" }}
                  >
                    {screens[active].index}
                  </span>
                </div>

                <div
                  className="flex"
                  style={{
                    paddingLeft: "calc(var(--pw) * 0.065)",
                    paddingRight: "calc(var(--pw) * 0.065)",
                    gap: "calc(var(--pw) * 0.018)",
                  }}
                >
                  {screens.map((s, i) => (
                    <div
                      key={s.pillar}
                      className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/20"
                    >
                      {i < active && <div className="h-full w-full rounded-full bg-white" />}
                      {i === active && (
                        <div
                          key={active}
                          className="segment-fill h-full w-full origin-left rounded-full bg-white [animation:segment-fill_8s_linear_forwards] group-hover:[animation-play-state:paused]"
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="relative flex-1 overflow-hidden">
                  {screens.map((s, i) => (
                    <div
                      key={s.pillar}
                      aria-hidden={i !== active}
                      className="absolute inset-0 flex flex-col transition-transform duration-[650ms] ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none"
                      style={{
                        transform: `translateX(${(i - active) * 100}%)`,
                        paddingLeft: "calc(var(--pw) * 0.065)",
                        paddingRight: "calc(var(--pw) * 0.065)",
                        paddingTop: "calc(var(--pw) * 0.048)",
                        gap: "calc(var(--pw) * 0.042)",
                      }}
                    >
                      <div>
                        <p
                          className="font-semibold uppercase text-[#e0566d]"
                          style={{ fontSize: "calc(var(--pw) * 0.039)", letterSpacing: "0.18em" }}
                        >
                          {s.pillar}
                        </p>
                        <h3
                          className="mt-[0.35em] font-semibold leading-[1.15] tracking-tight text-white"
                          style={{ fontSize: "calc(var(--pw) * 0.086)" }}
                        >
                          {s.headline}
                        </h3>
                      </div>

                      <div className="flex flex-col" style={{ gap: "calc(var(--pw) * 0.034)" }}>
                        {s.items.map(({ icon: Icon, title, body }) => (
                          <div
                            key={title}
                            className="border border-white/10 bg-white/[0.055]"
                            style={{
                              borderRadius: "calc(var(--pw) * 0.055)",
                              padding: "calc(var(--pw) * 0.048)",
                            }}
                          >
                            <div
                              className="grid place-items-center rounded-[calc(var(--pw)*0.032)] border border-[#e0566d]/25 bg-[#e0566d]/15 text-[#f08398]"
                              style={{
                                width: "calc(var(--pw) * 0.112)",
                                height: "calc(var(--pw) * 0.112)",
                              }}
                            >
                              <Icon
                                style={{
                                  width: "calc(var(--pw) * 0.056)",
                                  height: "calc(var(--pw) * 0.056)",
                                }}
                              />
                            </div>
                            <p
                              className="mt-[0.6em] font-semibold tracking-tight text-white"
                              style={{ fontSize: "calc(var(--pw) * 0.058)" }}
                            >
                              {title}
                            </p>
                            <p
                              className="mt-[0.45em] leading-[1.45] text-white/55"
                              style={{ fontSize: "calc(var(--pw) * 0.048)" }}
                            >
                              {body}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tab bar (decorative app chrome) */}
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-around border-t border-white/10"
                style={{
                  paddingTop: "calc(var(--pw) * 0.036)",
                  paddingBottom: "calc(var(--pw) * 0.062)",
                  background: "linear-gradient(180deg, rgba(10,5,8,0) 0%, rgba(10,5,8,0.92) 42%)",
                }}
              >
                {[Compass, Layers, Activity, Sparkles].map((Icon, i) => (
                  <Icon
                    key={i}
                    className={i === 0 ? "text-[#e0566d]" : "text-white/25"}
                    style={{ width: "calc(var(--pw) * 0.056)", height: "calc(var(--pw) * 0.056)" }}
                  />
                ))}
              </div>

              {/* Home indicator */}
              <div
                aria-hidden
                className="absolute left-1/2 z-20 -translate-x-1/2 rounded-full bg-white/85"
                style={{
                  bottom: "calc(var(--pw) * 0.028)",
                  width: "calc(var(--pw) * 0.32)",
                  height: "calc(var(--pw) * 0.012)",
                }}
              />

              {/* Screen glare */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 z-30"
                style={{
                  background:
                    "linear-gradient(118deg, rgba(255,255,255,0.11) 0%, rgba(255,255,255,0.03) 26%, transparent 46%)",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Fires once when the section scrolls into view. Falls back to "visible" wherever
// IntersectionObserver isn't available, and a <noscript> rule in Solutions covers the
// no-JS case, so the copy can never end up permanently stuck at opacity 0.
function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    let delivered = false;
    const io = new IntersectionObserver(
      (entries) => {
        delivered = true;
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);

    // Fail open. A working observer always delivers an initial entry straight away
    // (intersecting or not), so this only trips where callbacks never arrive at all —
    // e.g. a paused/non-compositing page — rather than pre-empting the real animation.
    const bail = setTimeout(() => {
      if (!delivered) setInView(true);
    }, 1500);

    return () => {
      clearTimeout(bail);
      io.disconnect();
    };
  }, []);

  return { ref, inView };
}

function Solutions() {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    // overflow-x-clip contains the slide-in travel without creating a scroll container.
    <section id="solutions" className="relative overflow-x-clip py-24 lg:py-32">
      <noscript>
        <style>{`.reveal{transform:none!important}`}</style>
      </noscript>
      <Container>
        <div
          ref={ref}
          // Full-width row, header flush left (unchanged — matches Challenges/Process).
          // justify-start (the default) rather than justify-between: the phone now sits
          // a deliberate gap-driven distance from the header instead of pinned to the
          // Container's far edge, which read as too much empty space in between.
          className="flex flex-col items-stretch gap-16 lg:flex-row lg:items-center lg:gap-28 xl:gap-36 2xl:gap-44"
        >
          {/* Header sits beside the device from lg up, above it below that. max-w keeps
              it from stretching to fill the row now that a single phone claims less
              width than the old three-up layout did. */}
          <div
            className={cn(
              // max-w-xl (not the site's usual max-w-3xl) since this still has to leave
              // room for the phone beside it — but text sizing now matches every other
              // section title exactly (text-4xl md:text-5xl lg:text-6xl), rather than the
              // one-step-smaller scale this used before, which read small next to the
              // wide open gap between it and the phone.
              "reveal max-w-xl transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
              inView ? "translate-x-0" : "-translate-x-16",
            )}
          >
            <h2 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
              Systems designed around{" "}
              <span className="text-gradient-crimson">business outcomes.</span>
            </h2>

            <p className="mt-6 text-lg leading-relaxed text-muted-foreground md:text-xl">
              I don't sell technology. I deliver measurable improvements to how your business runs.
            </p>

            {/* The devices carry the visual; this carries the same six solutions at a size
                people can actually read, and mirrors the 01/02/03 on the screens. */}
            <ul className="mt-10 border-t border-border/60">
              {solutionScreens.map((s) => (
                <li key={s.pillar} className="flex gap-4 border-b border-border/60 py-5">
                  <span className="mt-1 font-mono text-sm text-primary">{s.index}</span>
                  <div className="min-w-0">
                    <p className="text-base font-semibold tracking-tight">{s.pillar}</p>
                    <p className="mt-1 text-base text-muted-foreground">
                      {s.items.map((i) => i.title).join(" · ")}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* One device now, cycling through the three screens on its own — sized up
              from the three-phone layout since it no longer has to share the row. A
              wrapping div here (rather than passing className straight through) caused
              a same-size flex child to render 96px off from its parent's box — dropped
              rather than chased further, since it served no purpose with only one phone. */}
          <SolutionPhone
            screens={solutionScreens}
            inView={inView}
            className="self-center [--pw:300px] md:[--pw:320px] lg:[--pw:260px] lg:self-auto xl:[--pw:288px] 2xl:[--pw:312px]"
          />
        </div>
      </Container>
    </section>
  );
}

/* ───────────────────── PROCESS ───────────────────── */

function Process() {
  const steps = [
    {
      n: "01",
      icon: Search,
      title: "Discover",
      body: "I map your operations, surface bottlenecks, and identify where engineering creates real ROI.",
    },
    {
      n: "02",
      icon: PenTool,
      title: "Design",
      body: "I architect scalable workflows tailored to how your business actually runs today and tomorrow.",
    },
    {
      n: "03",
      icon: Hammer,
      title: "Build",
      body: "I develop the automations, integrations, AI systems, and dashboards, production-grade from day one.",
    },
    {
      n: "04",
      icon: Activity,
      title: "Optimize",
      body: "I monitor, refine, and continuously improve so your systems get sharper the longer they run.",
    },
  ];
  return (
    <Section
      id="process"
      title={
        <>
          A disciplined path from <span className="text-gradient-crimson">chaos to clarity.</span>
        </>
      }
      subtitle="Every engagement follows the same engineering discipline: structured, repeatable, and built for lasting results."
    >
      <div className="group/timeline relative">
        {/* Connecting path — sits behind cards, subtle crimson gradient + soft glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-12 right-0 left-0 z-0 hidden h-[2px] md:block"
          style={{
            background:
              "linear-gradient(to right, transparent 0%, oklch(0.45 0.16 18 / 0.55) 18%, oklch(0.55 0.18 18 / 0.7) 50%, oklch(0.45 0.16 18 / 0.55) 82%, transparent 100%)",
            boxShadow: "0 0 12px oklch(0.55 0.18 18 / 0.35), 0 0 24px oklch(0.45 0.16 18 / 0.18)",
          }}
        />
        <div className="relative z-10 grid gap-8 md:grid-cols-4 md:gap-6">
          {steps.map((s, i) => (
            <div key={s.n} className="group/step relative">
              {/* Hover-illuminated segments (incoming + outgoing) */}
              {i > 0 && (
                <div
                  aria-hidden
                  className="pointer-events-none absolute top-12 right-1/2 hidden h-[2px] w-1/2 opacity-0 transition-opacity duration-300 ease-out group-hover/step:opacity-100 md:block"
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
                  className="pointer-events-none absolute top-12 left-1/2 hidden h-[2px] w-1/2 opacity-0 transition-opacity duration-300 ease-out group-hover/step:opacity-100 md:block"
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
                  className="absolute -top-2 -right-2 grid size-7 place-items-center rounded-full text-[10px] font-bold text-primary-foreground shadow-glow ring-1 ring-white/15"
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
    { icon: Plug, name: "Backend Integrations", tools: ["REST APIs", "OAuth", "HTTP"] },
    {
      icon: Database,
      name: "Data Structures",
      tools: ["SQL", "PostgreSQL", "Supabase", "Google Workspace"],
    },
    { icon: Cloud, name: "Cloud Infrastructure", tools: ["Docker", "Linux", "Hostinger VPS"] },
    {
      icon: Cpu,
      name: "Frontend Applications",
      tools: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    },
    {
      icon: BarChart3,
      name: "Business Intelligence",
      tools: ["Dashboards", "Analytics", "Reporting"],
    },
    {
      icon: Boxes,
      name: "System Architecture",
      tools: [
        "Solution Architecture",
        "Workflow Design",
        "Process Mapping",
        "Integration Architecture",
      ],
    },
  ];

  const technologies = groups.flatMap((group) =>
    group.tools.map((name) => ({ name, icon: group.icon })),
  );

  const renderTechnologyCards = () =>
    technologies.map((technology) => {
      const Icon = technology.icon;

      return (
        <div
          key={technology.name}
          role="listitem"
          className="group flex h-16 shrink-0 items-center gap-3 rounded-xl border border-border/80 bg-card/70 px-5 shadow-card backdrop-blur-sm transition-colors hover:border-primary/50 hover:bg-card"
        >
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            <Icon className="size-4" aria-hidden />
          </span>
          <span className="whitespace-nowrap text-sm font-semibold tracking-tight text-foreground/90">
            {technology.name}
          </span>
        </div>
      );
    });

  return (
    <section
      id="stack"
      className="relative overflow-hidden border-y border-border/60 py-24 lg:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 55% 70% at 50% 55%, oklch(0.45 0.18 18 / 0.12), transparent 70%)",
        }}
      />

      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight md:text-5xl lg:text-6xl">
            The implementation layer,{" "}
            <span className="text-gradient-crimson">not the product.</span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground md:text-xl">
            Technology is the supporting evidence, and each tool is chosen and combined to fit the
            business, never the other way around.
          </p>
        </div>
      </Container>

      <div
        className="technology-marquee mt-14"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        }}
        aria-label="Tools and technologies"
      >
        <div className="technology-marquee-track">
          <div role="list" className="flex shrink-0 gap-4 pr-4">
            {renderTechnologyCards()}
          </div>
          <div aria-hidden className="technology-marquee-copy flex shrink-0 gap-4 pr-4">
            {renderTechnologyCards()}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────── ABOUT ───────────────────── */

function About() {
  return (
    <Section id="about" className="border-y border-border/60 bg-secondary/20">
      <div className="grid items-center gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-3xl border border-border/80 shadow-elegant">
            <img
              src="/nogalsolutions-blackcharcoal-profile-image.png"
              alt="Aaron Nogal"
              loading="lazy"
              width={1024}
              height={1280}
              className="size-full object-cover object-[center_30%]"
            />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background: "linear-gradient(180deg, transparent 50%, oklch(0 0 0 / 0.6) 100%)",
              }}
            />
          </div>
        </div>
        <div className="lg:col-span-7">
          <h2 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight md:text-5xl">
            An engineer who thinks in{" "}
            <span className="text-gradient-crimson">business systems.</span>
          </h2>
          <div className="mt-7 space-y-5 text-lg leading-relaxed text-muted-foreground">
            <p>
              I'm Aaron Nogal, an AI Automation Specialist focused on architecture-first approach,
              integrations, and AI systems that hold up in production.
            </p>
            <p>
              Every project is measured by one standard: Did it create a measurable, lasting
              business outcome?
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ───────────────────── WHY CHOOSE ───────────────────── */

// One principle gets a large "signature statement" panel; the other five are a compact
// rule-separated list beside it. Deliberately not the FeatureCard grid: six equal boxes
// buried the strongest claim (Architecture-First) at the same weight as the rest.
function WhyChoose() {
  const lead = {
    icon: Compass,
    title: "Architecture-First",
    body: "Every solution begins with understanding how your business operates before selecting any technology.",
  };
  const rest = [
    {
      icon: Target,
      title: "Business Outcomes",
      body: "Every project is measured by operational improvements, not by the number of automations delivered.",
    },
    {
      icon: ShieldCheck,
      title: "Production-Grade Systems",
      body: "I build reliable systems designed for real businesses, not prototypes that fall over under load.",
    },
    {
      icon: Scaling,
      title: "Scalable Foundations",
      body: "Workflows are built to keep supporting growth as the business expands, without constant rework.",
    },
    {
      icon: Handshake,
      title: "Transparent Collaboration",
      body: "You'll work directly with the engineer designing and building your systems, with no account layers.",
    },
    {
      icon: InfinityIcon,
      title: "Long-Term Thinking",
      body: "Systems are designed to remain maintainable, not to create technical debt you inherit later.",
    },
  ];
  const { ref, inView } = useInView<HTMLDivElement>();
  const LeadIcon = lead.icon;

  return (
    <Section
      id="why"
      className="overflow-x-clip"
      title={
        <>
          <span className="block">The framework behind</span>
          <span className="mt-3 block">
            <span className="text-gradient-crimson">high-performing operations.</span>
          </span>
        </>
      }
      subtitle="Technology is easy to buy. Engineering systems that actually improve a business is much harder."
    >
      <div ref={ref} className="grid gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
        <div
          className={cn(
            "reveal relative overflow-hidden rounded-3xl border border-primary/20 p-8 shadow-elegant transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none md:p-12",
            inView ? "translate-x-0" : "-translate-x-12",
          )}
          style={{
            background:
              "linear-gradient(155deg, #0B0608 0%, #22070F 45%, #3A0D18 75%, #0B0608 100%)",
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
              backgroundSize: "44px 44px",
              maskImage: "radial-gradient(ellipse 75% 65% at 30% 30%, black 25%, transparent 80%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 75% 65% at 30% 30%, black 25%, transparent 80%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 55% at 25% 20%, oklch(0.45 0.18 18 / 0.4), transparent 70%)",
            }}
          />
          <div className="relative">
            <div className="grid size-14 place-items-center rounded-2xl border border-primary/30 bg-primary/15 text-primary">
              <LeadIcon className="size-6" />
            </div>
            <p className="mt-9 text-balance text-2xl leading-snug font-semibold tracking-tight text-white md:text-[1.75rem]">
              {lead.body}
            </p>
            <p className="mt-7 text-xs font-semibold tracking-[0.2em] text-primary uppercase">
              {lead.title}
            </p>
          </div>
        </div>

        <ul
          className={cn(
            "reveal border-t border-border/60 transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
            inView ? "translate-x-0" : "translate-x-12",
          )}
          style={{ transitionDelay: inView ? "120ms" : "0ms" }}
        >
          {rest.map(({ icon: Icon, title, body }) => (
            <li key={title} className="group flex gap-4 border-b border-border/60 py-6">
              <div className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-xl border border-border/70 text-muted-foreground transition-colors duration-300 group-hover:border-primary/40 group-hover:text-primary">
                <Icon className="size-4" />
              </div>
              <div className="min-w-0">
                <p className="text-base font-semibold tracking-tight">{title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

/* ───────────────────── PROOF OF WORK ───────────────────── */

// Deliberately not three equal cards: the live pipeline is the only one with anything
// real to show, so it gets a large panel with actual stats. The two unbuilt items are
// demoted to a compact stub list instead of matching it box-for-box with an empty
// dashed placeholder standing in for content that doesn't exist yet.
function ProofOfWork() {
  const soon = [
    {
      title: "Finance & Invoice Processing",
      body: "Automated invoicing, payment tracking, and reconciliation, billing that runs itself instead of chasing spreadsheets.",
    },
    {
      title: "Custom Automation for Your Business",
      body: "A tailored system built around your specific operations, for whatever doesn't fit a template yet.",
    },
  ];
  const stats = [
    { v: "18", l: "automated workflows" },
    { v: "< 10 min", l: "to generate all 7 deliverables" },
    { v: "3–5 days", l: "of manual work eliminated" },
    { v: "2", l: "human review gates" },
  ];
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <Section
      id="live-systems"
      className="overflow-x-clip"
      title={
        <>
          Real systems. <span className="text-gradient-crimson">Real outcomes.</span>
        </>
      }
      subtitle="A closer look at production systems engineered for live business operations."
    >
      <div
        ref={ref}
        className={cn(
          "reveal grid gap-6 transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none lg:grid-cols-[1.6fr_1fr]",
          inView ? "translate-y-0" : "translate-y-12",
        )}
      >
        {/* Live case study — the actual system running my own consulting practice */}
        <Link
          to="/consultant-engagement-pipeline"
          className="group relative flex flex-col overflow-hidden rounded-3xl border border-primary/30 bg-card p-8 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-elegant md:p-10"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage:
                "linear-gradient(to right, var(--foreground) 1px, transparent 1px), linear-gradient(to bottom, var(--foreground) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
              maskImage: "radial-gradient(ellipse 70% 70% at 20% 20%, black 20%, transparent 75%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 70% 70% at 20% 20%, black 20%, transparent 75%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 60% at 15% 0%, oklch(0.45 0.18 18 / 0.16), transparent 65%)",
            }}
          />
          <div className="relative flex flex-1 flex-col">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[10px] font-medium tracking-wider text-primary uppercase">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-primary" />
              </span>
              Live System
            </div>
            <h3 className="mt-5 text-2xl font-semibold tracking-tight md:text-3xl">
              Consultant Engagement Pipeline
            </h3>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
              The system that runs my own consulting practice, end to end, going from the first form
              submission to a client-ready deliverable in their inbox. Built, live, and proven on
              real engagements.
            </p>

            <div className="mt-9 grid grid-cols-2 gap-6 border-t border-border/60 pt-7 sm:grid-cols-4">
              {stats.map((s) => (
                <div key={s.l}>
                  <div className="text-xl font-semibold tracking-tight md:text-2xl">{s.v}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{s.l}</div>
                </div>
              ))}
            </div>

            <div className="mt-auto flex items-center gap-1.5 pt-8 text-sm font-medium text-primary">
              See how it works
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>
        </Link>

        {/* Not built yet — small stubs, not full cards competing with the real thing */}
        <div className="flex flex-col gap-4">
          {soon.map((p) => (
            <div key={p.title} className="rounded-2xl border border-border/60 bg-card/50 p-6">
              <div className="inline-flex items-center gap-1.5 text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
                <Clock className="size-3" /> Launching Soon
              </div>
              <h4 className="mt-2.5 text-base font-semibold tracking-tight">{p.title}</h4>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
            </div>
          ))}
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
              maskImage: "radial-gradient(ellipse 80% 70% at 30% 40%, black 30%, transparent 85%)",
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
              I'll design and build the automations, integrations, and AI systems that fix it, for
              good.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              {/* Fixed white pill, not theme tokens — this panel's background is a hardcoded
                  dark gradient in both light and dark mode, so bg-background/text-foreground
                  would invert to a near-invisible dark-on-dark button in dark mode. */}
              <a
                href="#intake"
                className="group inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-base font-medium text-black shadow-card transition-all hover:translate-y-[-1px] hover:bg-white/90"
              >
                Start a Project
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href="/resources/aaron-nogal-ai-automation-specialist-resume.pdf"
                download="Aaron-Nogal-AI-Automation-Specialist-Resume.pdf"
                className="group inline-flex items-center gap-2 rounded-xl border border-white/35 bg-white/10 px-6 py-3.5 text-base font-medium text-white shadow-card backdrop-blur-sm transition-all hover:translate-y-[-1px] hover:border-white/60 hover:bg-white/20"
              >
                Download My Resume
                <Download className="size-4 transition-transform group-hover:translate-y-0.5" />
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
