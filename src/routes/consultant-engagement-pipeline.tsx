import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Section } from "@/components/site/Section";
import { Container } from "@/components/site/Container";
import { SiteBackground } from "@/components/site/SiteBackground";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/consultant-engagement-pipeline")({
  head: () => ({
    meta: [
      { title: "Consultant Engagement Pipeline — Live Systems | NogalSolutions" },
      {
        name: "description",
        content:
          "The 18-workflow automation system running NogalSolutions' own consulting practice end-to-end — from intake to a client-ready deliverable, live and proven in production.",
      },
      { property: "og:title", content: "Consultant Engagement Pipeline — Live Systems | NogalSolutions" },
      {
        property: "og:description",
        content:
          "See how NogalSolutions automated its own consulting operations: 18 workflows, two human review gates, and all 7 client deliverables generated in under 10 minutes.",
      },
    ],
  }),
  component: ConsultantEngagementPipeline,
});

function ConsultantEngagementPipeline() {
  return (
    <div id="top" className="relative min-h-screen text-foreground">
      <SiteBackground />
      <Navbar />
      <CaseStudyHero />
      <HowItWorks />
      <ClosingCTA />
      <Footer />
    </div>
  );
}

/* ─────────────────────────── HERO ─────────────────────────── */

const heroStats = [
  { v: "18", l: "automated workflows" },
  { v: "< 10 min", l: "to generate all 7 deliverables" },
  { v: "3–5 days", l: "of manual work eliminated" },
  { v: "2", l: "human review gates, by design" },
];

function CaseStudyHero() {
  return (
    <section className="relative overflow-hidden pt-36 pb-20 lg:pt-44 lg:pb-24">
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
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="size-3.5" /> Back to NogalSolutions
        </Link>

        <div className="max-w-3xl">
          <h1 className="text-balance text-5xl font-semibold leading-[1.02] tracking-tight md:text-6xl lg:text-7xl">
            The <span className="text-gradient-crimson">Consultant Engagement Pipeline.</span>
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            The system I built to run my own consulting practice — from a stranger filling out a form to a client-ready deliverable landing in their inbox, with almost nothing touched by hand in between.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="/#intake"
              className="group inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-base font-medium text-primary-foreground shadow-elegant transition-all hover:translate-y-[-1px] hover:bg-primary/90 hover:shadow-glow"
            >
              Start a Project
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>

          <div className="mt-14 grid grid-cols-2 gap-6 border-t border-border/60 pt-8 sm:grid-cols-4">
            {heroStats.map((s) => (
              <div key={s.l}>
                <div className="text-2xl font-semibold tracking-tight md:text-3xl">{s.v}</div>
                <div className="mt-1 text-xs text-muted-foreground md:text-sm">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ───────────────────── HOW IT WORKS (TABS) ───────────────────── */

function HowItWorks() {
  return (
    <Section
      id="how-it-works"
      title={
        <>
          Two sides of <span className="text-gradient-crimson">the same system.</span>
        </>
      }
      subtitle="One simple experience for the client. A fully engineered pipeline underneath it."
      align="center"
    >
      <Tabs defaultValue="client" className="w-full">
        <div className="flex justify-center">
          <TabsList className="flex h-auto w-fit flex-wrap justify-center gap-1 rounded-xl border border-border/80 bg-card/60 p-1.5">
            <TabsTrigger value="client" className="rounded-lg px-5 py-2.5 text-sm font-medium">
              What the Client Sees
            </TabsTrigger>
            <TabsTrigger value="behind" className="rounded-lg px-5 py-2.5 text-sm font-medium">
              What's Happening Behind the Operations
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="client" className="mt-14 focus-visible:outline-none">
          <ClientJourney />
        </TabsContent>
        <TabsContent value="behind" className="mt-14 focus-visible:outline-none">
          <BehindTheOperations />
        </TabsContent>
      </Tabs>
    </Section>
  );
}

interface CarouselSlide {
  src: string;
  title: string;
  caption: string;
}

function Carousel({ slides }: { slides: CarouselSlide[] }) {
  const [index, setIndex] = useState(0);
  const total = slides.length;
  const current = slides[index];

  const goPrev = () => setIndex((i) => (i - 1 + total) % total);
  const goNext = () => setIndex((i) => (i + 1) % total);

  return (
    <div
      className="mx-auto max-w-4xl outline-none"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") goPrev();
        if (e.key === "ArrowRight") goNext();
      }}
    >
      <div className="flex h-[300px] items-center justify-center overflow-hidden rounded-2xl border border-border/70 bg-secondary/20 sm:h-[400px] lg:h-[480px]">
        <img
          key={current.src}
          src={encodeURI(current.src)}
          alt={current.title}
          loading="lazy"
          className="h-full w-full object-contain p-3"
        />
      </div>

      <div className="mt-5 flex items-center justify-center gap-4 sm:gap-6">
        <button
          type="button"
          onClick={goPrev}
          aria-label="Previous slide"
          className="grid size-10 shrink-0 place-items-center rounded-full border border-border/80 bg-card text-foreground transition-colors hover:border-primary/50 hover:text-primary"
        >
          <ChevronLeft className="size-4" />
        </button>

        <div className="max-w-md text-center">
          <p className="text-sm font-semibold tracking-tight">{current.title}</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{current.caption}</p>
          <p className="mt-2 text-[11px] text-muted-foreground">{index + 1} / {total}</p>
        </div>

        <button
          type="button"
          onClick={goNext}
          aria-label="Next slide"
          className="grid size-10 shrink-0 place-items-center rounded-full border border-border/80 bg-card text-foreground transition-colors hover:border-primary/50 hover:text-primary"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      <div className="mt-5 flex flex-wrap justify-center gap-1.5">
        {slides.map((s, i) => (
          <button
            key={s.src}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}: ${s.title}`}
            className={cn(
              "h-1.5 rounded-full transition-all",
              i === index ? "w-5 bg-primary" : "w-1.5 bg-border hover:bg-primary/40",
            )}
          />
        ))}
      </div>
    </div>
  );
}

const clientJourneySlides: CarouselSlide[] = [
  {
    src: "/case-study/client-journey/intake-form-submission.png",
    title: "Submit a short intake form",
    caption: "Two minutes, no account needed — tell me about the business and the problem worth solving.",
  },
  {
    src: "/case-study/client-journey/1-auto-ack-email.png",
    title: "Instant confirmation email",
    caption: "No “someone will reach out within 48 hours.” The acknowledgment lands immediately.",
  },
  {
    src: "/case-study/client-journey/2-booking-email-sent-qualified.png",
    title: "Qualified → booking email sent",
    caption: "The system scores the request and sends a booking link automatically — no human triage needed.",
  },
  {
    src: "/case-study/client-journey/2.1-respectful-decline-unqualified.png",
    title: "Not a fit → respectful decline",
    caption: "The alternate branch when a request isn't qualified yet — still a clean, human-toned response, not silence.",
  },
  {
    src: "/case-study/client-journey/3-calendar-booking-with-calendly.png",
    title: "Discovery call gets booked",
    caption: "A real conversation — the one deliberately human step in the whole process.",
  },
  {
    src: "/case-study/client-journey/4-finalized-proposal-handoff-email-with-attached-file.png",
    title: "Final proposal delivered",
    caption: "One polished, branded package lands in their inbox — not a folder of disconnected files.",
  },
];

function ClientJourney() {
  return <Carousel slides={clientJourneySlides} />;
}

const behindOperationsSlides: CarouselSlide[] = [
  {
    src: "/case-study/behind-operations/NogalSolutions-BW1 Auto-Ack Email — New Intake Submission.png",
    title: "BW1 — Auto-Ack Email",
    caption: "Sends the instant confirmation email the moment a form is submitted.",
  },
  {
    src: "/case-study/behind-operations/NogalSolutions-BW2 Qualification Engine.png",
    title: "BW2 — Qualification Engine",
    caption: "Scores the request and branches qualified vs. not — automatically.",
  },
  {
    src: "/case-study/behind-operations/NogalSolutions-BW3 Qualified Handoff.png",
    title: "BW3 — Qualified Handoff",
    caption: "Creates the CRM contact, company, and deal; sends the booking email; kicks off the recording-folder setup.",
  },
  {
    src: "/case-study/behind-operations/NogalSolutions-BW4 Not-Qualified Decline.png",
    title: "BW4 — Not-Qualified Decline",
    caption: "Sends a respectful decline for requests that don't qualify — no dead leads left untouched.",
  },
  {
    src: "/case-study/behind-operations/NogalSolutions-BW5 Recording Watcher_Transcription.png",
    title: "BW5 — Recording Watcher & Transcription",
    caption: "Detects the uploaded discovery-call recording and transcribes it automatically.",
  },
  {
    src: "/case-study/behind-operations/NogalSolutions-BW6 Post-Call Analysis_Prompt A.png",
    title: "BW6 — Post-Call Analysis",
    caption: "Drafts a structured analysis from the transcript — held for a human review gate before anything moves forward.",
  },
  {
    src: "/case-study/behind-operations/NogalSolutions-BW7 Sequenced Generation_Prompts B1–B7 (Modular).png",
    title: "BW7 — Sequenced Generation",
    caption: "Once the analysis is approved, sequences the generation of all 7 client deliverables.",
  },
  {
    src: "/case-study/behind-operations/NogalSolutions-BW7 Sub-workflow — Generate One Deliverable.png",
    title: "BW7 Sub-workflow — Generate One Deliverable",
    caption: "The reusable generator BW7 calls once per deliverable — 7 runs per engagement.",
  },
  {
    src: "/case-study/behind-operations/NogalSolutions-BW8 Revision Wrapper.png",
    title: "BW8 — Revision Wrapper",
    caption: "Handles requested edits without restarting the whole pipeline.",
  },
  {
    src: "/case-study/behind-operations/NogalSolutions-BW9 Auto-Present on Approval.png",
    title: "BW9 — Auto-Present on Approval",
    caption: "Renders the approved deliverables into one branded package the moment everything's signed off.",
  },
  {
    src: "/case-study/behind-operations/NogalSolutions-BW10 Send & Close.png",
    title: "BW10 — Send & Close",
    caption: "Emails the client and updates the CRM deal stage automatically.",
  },
  {
    src: "/case-study/behind-operations/NogalSolutions Shared — Provision Discovery Recording Dropzone.png",
    title: "Shared — Provision Discovery Recording Dropzone",
    caption: "Creates the exact upload folder for the discovery-call recording — no human-typed paths, no mismatched IDs.",
  },
  {
    src: "/case-study/behind-operations/NogalSolutions Shared — Advance Deal Stage.png",
    title: "Shared — Advance Deal Stage",
    caption: "Keeps the CRM's deal stage in sync with real pipeline progress at every checkpoint.",
  },
  {
    src: "/case-study/behind-operations/NogalSolutions Shared — Render Deliverables PDF.png",
    title: "Shared — Render Deliverables PDF",
    caption: "The shared renderer both Auto-Present and revisions call to produce the branded PDF.",
  },
  {
    src: "/case-study/behind-operations/NogalSolutions Sub-Workflow_Resolve Prospect with Update Status.png",
    title: "Shared — Resolve Prospect + Update Status",
    caption: "A shared lookup used across the pipeline to resolve a prospect's record and current status.",
  },
  {
    src: "/case-study/behind-operations/NogalSolutions-Infra Daily Supabase Backup to R2.png",
    title: "Infra — Daily Supabase Backup",
    caption: "Backs up the database daily to offsite storage, on its own schedule, independent of any client engagement.",
  },
  {
    src: "/case-study/behind-operations/NogalSolutions-Infra Backup Retention Purge (R2).png",
    title: "Infra — Backup Retention Purge",
    caption: "Cleans up old backups on a retention schedule so storage doesn't grow unbounded.",
  },
  {
    src: "/case-study/behind-operations/NogalSolutions Keep-Alive — Supabase Ping.png",
    title: "Infra — Keep-Alive Ping",
    caption: "A small scheduled ping that keeps the database connection warm.",
  },
  {
    src: "/case-study/CRM-Deals.png",
    title: "HubSpot — Deals Pipeline",
    caption: "The board view of every engagement's pipeline stage, synced automatically by the workflows above.",
  },
  {
    src: "/case-study/CRM-Contacts.png",
    title: "HubSpot — Contacts",
    caption: "Every prospect gets a Contact record automatically — no manual data entry from the intake form.",
  },
  {
    src: "/case-study/CRM-Client Requirements.png",
    title: "HubSpot — Client Requirements",
    caption: "The AI-generated post-call analysis, saved as its own record and linked to the Contact for Gate #1 review.",
  },
  {
    src: "/case-study/CRM-Deliverables.png",
    title: "HubSpot — Deliverables",
    caption: "All 7 generated documents, saved as individual records and linked back to the Contact.",
  },
  {
    src: "/case-study/Supabase-DB-Schema.png",
    title: "Supabase — Database Schema",
    caption: "The relational schema underneath the whole pipeline — prospects, sessions, analyses, and deliverables, all foreign-keyed together.",
  },
  {
    src: "/case-study/Slack-Pipeline-Activity.png",
    title: "Slack — Pipeline Activity",
    caption: "A live feed of every successful step across the pipeline, posted in real time.",
  },
  {
    src: "/case-study/Slack-Error-Alert.png",
    title: "Slack — Error Alert",
    caption: "When something fails, the exact failure and next step get posted here immediately — not silently swallowed.",
  },
];

const techStack = ["n8n", "Supabase (Postgres + Storage)", "HubSpot CRM", "Claude via OpenRouter", "Whisper transcription", "Resend", "Slack", "Cloudflare Pages"];

function BehindTheOperations() {
  return (
    <div className="mx-auto max-w-4xl">
      <Carousel slides={behindOperationsSlides} />

      <div className="mt-10 rounded-xl border border-border/60 bg-card/40 p-6">
        <h4 className="text-base font-semibold tracking-tight">Why this many workflows?</h4>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Each stage runs as its own dedicated workflow on purpose — small, single-responsibility pieces are easier to build, test, and review individually. Every workflow here went through a manual, node-by-node review before going live, and carries its own execution log and Slack alerting, so a failure anywhere is caught and traceable immediately — not buried inside one giant, unreadable pipeline.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          That's a deliberate tradeoff for reliability and safe iteration while proving the system out — not the smallest possible footprint. For a leaner deployment, several of these could reasonably be consolidated: folding the shared sub-workflows into their callers, or combining the infrastructure jobs into one scheduled workflow. That's an option on the table for your build, not a constraint of the approach.
        </p>
      </div>

      <div className="mt-6 rounded-xl border border-border/60 bg-card/40 p-6">
        <h4 className="text-base font-semibold tracking-tight">Why does the CRM look incomplete?</h4>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Fields like phone number, lead status, last contacted, lead type, priority, and the dollar amount on each Deal sit empty in these screenshots — that's real, not a rendering glitch. The pipeline only writes the fields it actually has data for: what the intake form captures and what the AI-generated analysis produces. Enrichment data like these doesn't have a source wired up yet, so it's filled in by hand when it matters.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Automating that — deal-value estimation, lead scoring, contact enrichment — is a real, scoped future improvement, not something this build overlooked. For now, it's a deliberate manual step, same as the discovery call itself.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {techStack.map((t) => (
          <span key={t} className="rounded-md border border-border/60 bg-secondary/40 px-2.5 py-1 text-xs text-foreground/80">
            {t}
          </span>
        ))}
      </div>

      <p className="mt-8 rounded-xl border border-primary/20 bg-primary/[0.05] p-4 text-sm leading-relaxed text-muted-foreground">
        <strong className="text-foreground">Verification, not vibes:</strong> every one of these workflows was proven against a real, live execution — not just a passing validation check — before I called it done.
      </p>
    </div>
  );
}

/* ───────────────────────────── CTA ───────────────────────────── */

function ClosingCTA() {
  return (
    <section className="relative py-24 lg:py-32">
      <Container>
        <div
          className="relative overflow-hidden rounded-3xl border border-primary/20 p-10 shadow-elegant md:p-16 lg:p-20"
          style={{
            background: "linear-gradient(135deg, #0B0608 0%, #2A0710 45%, #45101C 65%, #2A0710 85%, #0B0608 100%)",
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
              backgroundSize: "44px 44px",
              maskImage: "radial-gradient(ellipse 80% 70% at 30% 40%, black 30%, transparent 85%)",
              WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 30% 40%, black 30%, transparent 85%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background: "radial-gradient(ellipse 55% 60% at 22% 32%, oklch(0.45 0.16 18 / 0.45), transparent 65%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background: "radial-gradient(ellipse 100% 90% at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)",
            }}
          />
          <div className="relative max-w-3xl">
            <h2 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-primary-foreground md:text-6xl">
              Want a system like this built for your business?
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/85 md:text-xl">
              This isn't a mockup. It's the same engineering discipline I'll bring to your operations — architected, built, and proven before it ever touches a real client.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="/#intake"
                className="group inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-base font-medium text-black shadow-card transition-all hover:translate-y-[-1px] hover:bg-white/90"
              >
                Start a Project
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
