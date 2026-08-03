import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Section } from "@/components/site/Section";
import { Container } from "@/components/site/Container";
import { SiteBackground } from "@/components/site/SiteBackground";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  Waypoints,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  CheckCircle2,
  Phone,
  Layers,
  Rocket,
} from "lucide-react";

export const Route = createFileRoute("/consultant-engagement-pipeline")({
  head: () => ({
    meta: [
      { title: "Consultant Engagement Pipeline: Live Systems | NogalSolutions" },
      {
        name: "description",
        content:
          "The 23-workflow automation system running NogalSolutions' own consulting practice end-to-end, from intake to a client-ready deliverable, live and proven in production.",
      },
      {
        property: "og:title",
        content: "Consultant Engagement Pipeline: Live Systems | NogalSolutions",
      },
      {
        property: "og:description",
        content:
          "See how NogalSolutions automated its own consulting operations: 23 workflows, two human review gates, and all 7 client deliverables generated in under 10 minutes.",
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
      <PaymentOnboardingKickoff />
      <OperationsProof />
      <TechStackSection />
      <ClosingCTA />
      <Footer />
    </div>
  );
}

/* ─────────────────────────── HERO ─────────────────────────── */

const heroStats = [
  { v: "23", l: "automated workflows" },
  { v: "< 10 min", l: "to generate all 7 deliverables" },
  { v: "3 - 5 days", l: "of manual work eliminated" },
  { v: "2", l: "human review gates, by design" },
];

const pipelineStages = [
  { icon: FileText, title: "Intake", caption: "Form submitted, no account needed" },
  { icon: CheckCircle2, title: "Qualify", caption: "Auto-scored, zero human triage" },
  { icon: Phone, title: "Discovery Call", caption: "The one deliberately human step" },
  { icon: Layers, title: "Build", caption: "All 7 deliverables generated & gated" },
  { icon: Rocket, title: "Close & Onboard", caption: "Deposit verified, kickoff drafted" },
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

        {/* Two columns from lg up: pitch on the left, a compact visual pipeline
            timeline on the right — fills the space beside the H1 without piling
            more paragraphs next to it. The actual "how it works" deep dive lives
            in the tabs section right below this hero. Below lg they stack. */}
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
          <div>
            <h1 className="text-balance text-5xl font-semibold leading-[1.02] tracking-tight md:text-6xl lg:text-7xl">
              The <span className="text-gradient-crimson">Consultant Engagement Pipeline.</span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              The system I built to run my own consulting practice, going from a stranger filling
              out a form to a client-ready deliverable landing in their inbox, with almost nothing
              touched by hand in between.
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
                  <div className="whitespace-nowrap text-xl font-semibold tracking-tight md:text-2xl">
                    {s.v}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground md:text-sm">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card/60 p-8 shadow-card backdrop-blur-sm md:p-10">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 75% 65% at 85% 0%, oklch(0.45 0.18 18 / 0.14), transparent 65%)",
              }}
            />
            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                The Pipeline
              </p>
              <ol className="mt-6">
                {pipelineStages.map((stage, i) => (
                  <li key={stage.title} className="relative flex gap-4 pb-7 last:pb-0">
                    {i < pipelineStages.length - 1 && (
                      <span
                        aria-hidden
                        className="absolute left-5 top-10 h-[calc(100%-2rem)] w-px -translate-x-1/2 bg-border/70"
                      />
                    )}
                    <div className="relative z-10 grid size-10 shrink-0 place-items-center rounded-full border border-primary/30 bg-primary/10 text-primary">
                      <stage.icon className="size-4" />
                    </div>
                    <div className="pt-1.5">
                      <p className="text-sm font-semibold tracking-tight">{stage.title}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                        {stage.caption}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
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
      <div className="mb-8 flex justify-center">
        <ProcessMapDialog />
      </div>
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
          <p className="mt-2 text-[11px] text-muted-foreground">
            {index + 1} / {total}
          </p>
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
    caption:
      "Two minutes, no account needed, just tell me about the business and the problem worth solving.",
  },
  {
    src: "/case-study/client-journey/1-auto-ack-email.png",
    title: "Instant confirmation email",
    caption: "No “someone will reach out within 48 hours.” The acknowledgment lands immediately.",
  },
  {
    src: "/case-study/client-journey/2-booking-email-sent-qualified.png",
    title: "Qualified → booking email sent",
    caption:
      "The system scores the request and sends a booking link automatically, with no human triage needed.",
  },
  {
    src: "/case-study/client-journey/2.1-respectful-decline-unqualified.png",
    title: "Not a fit → respectful decline",
    caption:
      "The alternate branch when a request isn't qualified yet, but still a clean, human-toned response, not silence.",
  },
  {
    src: "/case-study/client-journey/3-calendar-booking-with-calendly.png",
    title: "Discovery call gets booked",
    caption: "A real conversation, the one deliberately human step in the whole process.",
  },
  {
    src: "/case-study/client-journey/4-finalized-proposal-handoff-email-with-attached-file.png",
    title: "Final proposal delivered",
    caption:
      "One polished, branded package lands in their inbox, not a folder of disconnected files.",
  },
];

function ClientJourney() {
  return <Carousel slides={clientJourneySlides} />;
}

const behindOperationsSlides: CarouselSlide[] = [
  {
    src: "/case-study/behind-operations/NogalSolutions-BW1-Auto-Ack-Email-New-Intake-Submission.png",
    title: "BW1: Auto-Ack Email",
    caption: "Sends the instant confirmation email the moment a form is submitted.",
  },
  {
    src: "/case-study/behind-operations/NogalSolutions-BW2-Qualification-Engine.png",
    title: "BW2: Qualification Engine",
    caption: "Scores the request and automatically branches qualified vs. not.",
  },
  {
    src: "/case-study/behind-operations/NogalSolutions-BW3-Qualified-Handoff.png",
    title: "BW3: Qualified Handoff",
    caption:
      "Creates the CRM contact, company, and deal; sends the booking email; kicks off the recording-folder setup.",
  },
  {
    src: "/case-study/behind-operations/NogalSolutions-BW4-Not-Qualified-Decline.png",
    title: "BW4: Not-Qualified Decline",
    caption:
      "Sends a respectful decline for requests that don't qualify, so no dead leads are left untouched.",
  },
  {
    src: "/case-study/behind-operations/NogalSolutions-BW5-Recording-Watcher-Transcription.png",
    title: "BW5: Recording Watcher & Transcription",
    caption: "Detects the uploaded discovery-call recording and transcribes it automatically.",
  },
  {
    src: "/case-study/behind-operations/NogalSolutions-BW6-Post-Call-Analysis-Prompt-A.png",
    title: "BW6: Post-Call Analysis",
    caption:
      "Drafts a structured analysis from the transcript, then holds it for a human review gate before anything moves forward.",
  },
  {
    src: "/case-study/behind-operations/NogalSolutions-BW7-Sequenced-Generation-Prompts-B1-B7-Modular.png",
    title: "BW7: Sequenced Generation",
    caption:
      "Once the analysis is approved, sequences the generation of all 7 client deliverables.",
  },
  {
    src: "/case-study/behind-operations/NogalSolutions-BW7-Sub-workflow-Generate-One-Deliverable.png",
    title: "BW7 Sub-workflow: Generate One Deliverable",
    caption:
      "The reusable generator BW7 calls once per deliverable, so 7 runs happen per engagement.",
  },
  {
    src: "/case-study/behind-operations/NogalSolutions-BW8-Revision-Wrapper.png",
    title: "BW8: Revision Wrapper",
    caption: "Handles requested edits without restarting the whole pipeline.",
  },
  {
    src: "/case-study/behind-operations/NogalSolutions-BW9-Auto-Present-on-Approval.png",
    title: "BW9: Auto-Present on Approval",
    caption:
      "Renders the approved deliverables into one branded package the moment everything's signed off.",
  },
  {
    src: "/case-study/behind-operations/NogalSolutions-BW10-Send-and-Close.png",
    title: "BW10: Send & Close",
    caption: "Emails the client and updates the CRM deal stage automatically.",
  },
  {
    src: "/case-study/behind-operations/NogalSolutions-Shared-Provision-Discovery-Recording-Dropzone.png",
    title: "Shared: Provision Discovery Recording Dropzone",
    caption:
      "Creates the exact upload folder for the discovery-call recording, with no human-typed paths and no mismatched IDs.",
  },
  {
    src: "/case-study/behind-operations/NogalSolutions-Shared-Advance-Deal-Stage.png",
    title: "Shared: Advance Deal Stage",
    caption: "Keeps the CRM's deal stage in sync with real pipeline progress at every checkpoint.",
  },
  {
    src: "/case-study/behind-operations/NogalSolutions-Shared-Render-Deliverables-PDF.png",
    title: "Shared: Render Deliverables PDF",
    caption: "The shared renderer both Auto-Present and revisions call to produce the branded PDF.",
  },
  {
    src: "/case-study/behind-operations/NogalSolutions-Sub-Workflow-Resolve-Prospect-with-Update-Status.png",
    title: "Shared: Resolve Prospect + Update Status",
    caption:
      "A shared lookup used across the pipeline to resolve a prospect's record and current status.",
  },
  {
    src: "/case-study/behind-operations/NogalSolutions-Infra-Daily-Supabase-Backup-to-R2.png",
    title: "Infra: Daily Supabase Backup",
    caption:
      "Backs up the database daily to offsite storage, on its own schedule, independent of any client engagement.",
  },
  {
    src: "/case-study/behind-operations/NogalSolutions-Infra-Backup-Retention-Purge-R2.png",
    title: "Infra: Backup Retention Purge",
    caption: "Cleans up old backups on a retention schedule so storage doesn't grow unbounded.",
  },
  {
    src: "/case-study/behind-operations/NogalSolutions-Keep-Alive-Supabase-Ping.png",
    title: "Infra: Keep-Alive Ping",
    caption: "A small scheduled ping that keeps the database connection warm.",
  },
  {
    src: "/case-study/CRM-Deals.png",
    title: "HubSpot: Deals Pipeline",
    caption:
      "The board view of every engagement's pipeline stage, synced automatically by the workflows above.",
  },
  {
    src: "/case-study/CRM-Contacts.png",
    title: "HubSpot: Contacts",
    caption:
      "Every prospect gets a Contact record automatically, with no manual data entry from the intake form.",
  },
  {
    src: "/case-study/CRM-Client-Requirements.png",
    title: "HubSpot: Client Requirements",
    caption:
      "The AI-generated post-call analysis, saved as its own record and linked to the Contact for Gate #1 review.",
  },
  {
    src: "/case-study/CRM-Deliverables.png",
    title: "HubSpot: Deliverables",
    caption:
      "All 7 generated documents, saved as individual records and linked back to the Contact.",
  },
  {
    src: "/case-study/Supabase-DB-Schema.png",
    title: "Supabase: Database Schema",
    caption:
      "The relational schema underneath the whole pipeline: prospects, sessions, analyses, and deliverables, all foreign-keyed together.",
  },
  {
    src: "/case-study/Slack-Pipeline-Activity.png",
    title: "Slack: Pipeline Activity",
    caption: "A live feed of every successful step across the pipeline, posted in real time.",
  },
  {
    src: "/case-study/Slack-Error-Alert.png",
    title: "Slack: Error Alert",
    caption:
      "When something fails, the exact failure and next step get posted here immediately, instead of being silently swallowed.",
  },
];

const techStack = [
  {
    name: "n8n",
    role: "Orchestration",
    detail:
      "Self-hosted on a private VPS. Every stage runs as its own workflow, with its own execution log and alerting.",
  },
  {
    name: "Supabase",
    role: "Data and files",
    detail:
      "Postgres for prospects, deliverables, and versioned revisions, plus Storage for call recordings and rendered PDFs.",
  },
  {
    name: "HubSpot CRM",
    role: "Client record and review gates",
    detail:
      "Holds the Contact, Deal, and custom deliverable records. Both human review gates are real Tasks here, not a bespoke UI.",
  },
  {
    name: "OpenRouter",
    role: "Model gateway",
    detail:
      "One integration point in front of every model, so a model can be swapped without touching the build.",
  },
  {
    name: "Claude",
    role: "Analysis and generation",
    detail:
      "Reads the discovery transcript and drafts all seven client deliverables, each into a strict output schema.",
  },
  {
    name: "Whisper",
    role: "Call transcription",
    detail:
      "Turns the raw discovery recording into the transcript everything downstream reasons over.",
  },
  {
    name: "Resend",
    role: "Client email",
    detail:
      "Sends every client-facing message: the acknowledgement, the booking link, the proposal, and the onboarding kit.",
  },
  {
    name: "Slack",
    role: "Operator visibility",
    detail:
      "Pipeline activity and failure alerts both land here, so the whole system can be monitored from one channel.",
  },
  {
    name: "Gotenberg",
    role: "PDF rendering",
    detail:
      "A self-hosted converter that turns the branded HTML proposal into the combined PDF the client receives.",
  },
  {
    name: "Cloudflare Pages",
    role: "Site and intake",
    detail: "Hosts this site and the intake form that starts the whole pipeline.",
  },
  {
    name: "Codex",
    role: "Build assistance",
    detail:
      "Used alongside Claude to build and review the system itself. Not part of the runtime, unlike everything above it.",
  },
];


/* ───────────────── FULL PROCESS MAP (FLOWCHART) ───────────────── */

function FlowArrow({ height = 24 }: { height?: number }) {
  return (
    <svg
      width="16"
      height={height}
      viewBox={`0 0 16 ${height}`}
      className="mx-auto block text-border"
      aria-hidden
    >
      <line
        x1="8"
        y1="0"
        x2="8"
        y2={height}
        stroke="currentColor"
        strokeWidth="1.5"
        markerEnd="url(#pm-arrow)"
      />
    </svg>
  );
}

function FlowNode({
  title,
  desc,
  tag,
  variant = "auto",
  human = false,
}: {
  title: string;
  desc: string;
  tag?: string;
  variant?: "auto" | "human" | "exit" | "alt";
  human?: boolean;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-md rounded-xl border p-4",
        variant === "auto" && "border-border/70 bg-card/60",
        variant === "human" && "border-primary/35 bg-primary/[0.08]",
        variant === "exit" && "border-dashed border-border/60 bg-transparent",
        variant === "alt" && "border-dashed border-border/70 bg-card/40",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p
          className={cn(
            "text-sm font-semibold",
            variant === "exit" && "font-medium text-muted-foreground",
          )}
        >
          {title}
        </p>
        {human && (
          <span className="shrink-0 rounded-md border border-primary/35 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary">
            Human
          </span>
        )}
      </div>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{desc}</p>
      {tag && <p className="mt-1 font-mono text-[10px] text-muted-foreground/60">{tag}</p>}
    </div>
  );
}

function ProcessMapFlowchart() {
  return (
    <div className="mx-auto max-w-2xl">
      <svg width="0" height="0" className="absolute" aria-hidden>
        <defs>
          <marker
            id="pm-arrow"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path
              d="M2 1L8 5L2 9"
              fill="none"
              stroke="currentColor"
              className="text-border"
              strokeWidth="1.5"
            />
          </marker>
        </defs>
      </svg>

      <div className="mb-8 grid grid-cols-2 gap-1 overflow-hidden rounded-xl border border-border/60 sm:grid-cols-4">
        {[
          { v: "23", l: "automated workflows" },
          { v: "<10 min", l: "to draft all 7 deliverables" },
          { v: "5", l: "human decision points" },
          { v: "2", l: "formal HubSpot review gates" },
        ].map((s) => (
          <div key={s.l} className="bg-card/60 p-3 text-center">
            <div className="text-base font-semibold tabular-nums">{s.v}</div>
            <div className="mt-0.5 text-[10px] leading-tight text-muted-foreground">{s.l}</div>
          </div>
        ))}
      </div>

      <div className="mb-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-b border-border/60 pb-6 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm border border-primary/40 bg-primary/[0.1]" />
          human decides
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rotate-45 rounded-[2px] border border-[oklch(0.45_0.14_198_/_0.55)] bg-[oklch(0.45_0.14_198_/_0.16)]" />
          branch point
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm border border-border/70 bg-card" />
          automated step
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm border border-dashed border-border/70" />
          branch exit or end
        </span>
      </div>

      <div className="flex flex-col items-center">
        <FlowNode
          title="Website intake form"
          desc="A stranger finds the site and submits a short form. Public, no account needed."
        />
        <FlowArrow />
        <p className="mb-3 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
          Phase 1, intake and qualification
        </p>
        <FlowNode
          title="Auto-ack email"
          desc="An instant confirmation lands immediately, not a promise that someone will reach out in 48 hours."
          tag="BW1, Auto-Ack Email"
        />
        <FlowArrow />
        <FlowNode
          title="Qualification engine"
          desc="Scores the request against 7 fixed rules. No human triage on the first pass."
          tag="BW2, Qualification Engine"
        />
        <svg
          width="16"
          height="18"
          viewBox="0 0 16 18"
          className="mx-auto block text-border"
          aria-hidden
        >
          <line x1="8" y1="0" x2="8" y2="18" stroke="currentColor" strokeWidth="1.5" />
        </svg>

        <svg width="260" height="86" viewBox="0 0 260 86" role="img" className="mx-auto block">
          <title>Qualified?</title>
          <polygon
            points="130,4 220,43 130,82 40,43"
            fill="oklch(0.45 0.14 198 / 0.16)"
            stroke="oklch(0.45 0.14 198 / 0.55)"
            strokeWidth="1"
          />
          <text
            x="130"
            y="43"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="13"
            fontWeight="600"
            fill="oklch(0.78 0.09 198)"
          >
            Qualified?
          </text>
          <line
            x1="40"
            y1="43"
            x2="4"
            y2="66"
            className="text-border"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <line
            x1="220"
            y1="43"
            x2="256"
            y2="66"
            className="text-border"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>

        <div className="grid w-full max-w-md grid-cols-2 gap-4 sm:max-w-lg">
          <div>
            <p className="mb-1.5 text-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
              No
            </p>
            <FlowNode
              variant="exit"
              title="Not-qualified decline"
              desc="A respectful decline email, not silence."
              tag="BW4, end of pipeline"
            />
          </div>
          <div>
            <p className="mb-1.5 text-center text-[10px] font-bold uppercase tracking-wider text-[oklch(0.78_0.09_198)]">
              Yes
            </p>
            <FlowNode
              title="Qualified handoff"
              desc="Creates the HubSpot Contact, Company, and Deal, sends the booking email, and provisions the recording dropzone. If sourced inbound, also drafts a pre-call brief to Slack."
              tag="BW3, Qualified Handoff"
            />
          </div>
        </div>

        <svg
          width="100%"
          style={{ maxWidth: 400 }}
          viewBox="0 0 400 34"
          className="block text-border"
        >
          <path
            d="M300 0 L300 15 L200 15 L200 34"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            markerEnd="url(#pm-arrow)"
          />
        </svg>
        <p className="mb-4 text-center text-xs text-muted-foreground/80">
          Prospect is now ready for discovery. Also joined here by:
        </p>

        <FlowNode
          variant="alt"
          title="Outbound bootstrap"
          desc="A separate entry, bypassing all of phase 1 above. Aaron sources the prospect directly (referral, cold outreach) and submits his own private form. Qualification is skipped entirely, since he already decided to pursue them. Reaches this exact same point: identity created, dropzone provisioned."
          tag="Outbound Discovery Bootstrap"
        />
        <FlowArrow />

        <p className="mb-3 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
          Phase 2, discovery
        </p>
        <FlowNode
          human
          variant="human"
          title="Discovery call"
          desc="The one deliberately human step in the entire pipeline. A real conversation, recorded."
        />
        <FlowArrow />
        <FlowNode
          title="Recording and transcription"
          desc="Detects the uploaded recording and transcribes it automatically (Whisper)."
          tag="BW5, Recording Watcher / Transcription"
        />
        <FlowArrow />

        <p className="mb-3 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
          Phase 3, gate #1, analysis
        </p>
        <FlowNode
          title="Post-call analysis"
          desc="Drafts a structured analysis from the transcript and holds it for review."
          tag="BW6, Post-Call Analysis, Prompt A"
        />
        <FlowArrow />
        <FlowNode
          human
          variant="human"
          title="Gate #1 review"
          desc="Aaron reviews the AI's analysis in HubSpot and approves it before anything generates."
        />
        <FlowArrow />

        <p className="mb-3 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
          Phase 4, gate #2, generation
        </p>
        <FlowNode
          title="Sequenced generation"
          desc="Drafts all 7 client deliverables in sequence: architecture, spec, roadmap, SOP, proposal, pricing, and terms."
          tag="BW7, Sequenced Generation, Prompts B1 to B7"
        />
        <FlowArrow />
        <FlowNode
          human
          variant="human"
          title="Gate #2 review"
          desc="Aaron reviews each of the 7 deliverables. Approves, edits, or requests a revision."
        />
        <p className="mt-2 text-center text-[11px] text-muted-foreground/70">
          revision requested regenerates just that section, then back to this review (BW8)
        </p>
        <FlowArrow />

        <p className="mb-3 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
          Phase 5, present and send
        </p>
        <FlowNode
          title="Auto-present on approval"
          desc="The instant all 7 are approved, renders one combined branded PDF, whether it's the first pass or any later re-presentation."
          tag="BW9, Auto-Present on Approval"
        />
        <FlowArrow />
        <FlowNode
          title="Send and close"
          desc="Emails the client the PDF and advances the Deal to sent, then negotiating."
          tag="BW10, Send & Close"
        />
        <FlowArrow />

        <p className="mb-3 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
          Phase 6, deposit and close
        </p>
        <FlowNode
          title="Notify expected deposit"
          desc="Once the Deal enters awaiting deposit, computes 50% of the total and Slacks Aaron the exact figure to request."
        />
        <FlowArrow />
        <FlowNode
          human
          variant="human"
          title="Record deposit payment"
          desc="Aaron requests the deposit himself (any payment rail), then enters the amount received and confirms it in HubSpot."
        />
        <svg
          width="16"
          height="18"
          viewBox="0 0 16 18"
          className="mx-auto block text-border"
          aria-hidden
        >
          <line x1="8" y1="0" x2="8" y2="18" stroke="currentColor" strokeWidth="1.5" />
        </svg>

        <svg width="280" height="86" viewBox="0 0 280 86" role="img" className="mx-auto block">
          <title>Deposit matches?</title>
          <polygon
            points="140,4 230,43 140,82 50,43"
            fill="oklch(0.45 0.14 198 / 0.16)"
            stroke="oklch(0.45 0.14 198 / 0.55)"
            strokeWidth="1"
          />
          <text
            x="140"
            y="43"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="13"
            fontWeight="600"
            fill="oklch(0.78 0.09 198)"
          >
            Deposit matches?
          </text>
          <line
            x1="50"
            y1="43"
            x2="4"
            y2="66"
            className="text-border"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <line
            x1="230"
            y1="43"
            x2="276"
            y2="66"
            className="text-border"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>

        <div className="grid w-full max-w-md grid-cols-2 gap-4 sm:max-w-lg">
          <div>
            <p className="mb-1.5 text-center text-[10px] font-bold uppercase tracking-wider text-[oklch(0.78_0.09_198)]">
              Yes
            </p>
            <FlowNode
              title="Closed-won, onboarding kit"
              desc="Advances the Deal to closed-won and emails the welcome message, signed contract, and payment receipt."
            />
          </div>
          <div>
            <p className="mb-1.5 text-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
              No
            </p>
            <FlowNode
              variant="exit"
              title="Review task and Slack alert"
              desc="Creates a HubSpot Task on the Contact instead of guessing."
            />
            <p className="mt-1.5 text-center text-[10.5px] text-muted-foreground/70">
              back to Record Deposit Payment once corrected
            </p>
          </div>
        </div>

        <svg
          width="100%"
          style={{ maxWidth: 400 }}
          viewBox="0 0 400 34"
          className="block text-border"
        >
          <path
            d="M100 0 L100 15 L200 15 L200 34"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            markerEnd="url(#pm-arrow)"
          />
        </svg>
        <p className="mb-4 text-center text-xs text-muted-foreground/80">
          Matched deposit continues.
        </p>

        <p className="mb-3 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
          Phase 7, kickoff
        </p>
        <FlowNode
          title="Kickoff prep"
          desc="Drafts a kickoff-call agenda from the 7 approved deliverables and posts it to Slack for Aaron to personalize."
        />
        <FlowArrow />
        <FlowNode
          human
          variant="human"
          title="Kickoff call"
          desc="The engagement's real first working session, a genuine conversation, not automated."
        />
        <FlowArrow />
        <FlowNode variant="exit" title="Engagement live" desc="" />
      </div>

      <div className="mx-auto mt-12 max-w-md border-t border-border/60 pt-6">
        <h5 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Reused throughout, not drawn as separate steps
        </h5>
        <ul className="mt-3 list-disc space-y-1.5 pl-4 text-xs leading-relaxed text-muted-foreground">
          <li>Resolve Prospect + Update Status, a shared lookup called across most stages</li>
          <li>
            Advance Deal Stage, keeps the HubSpot Deal's pipeline stage in sync at every checkpoint
          </li>
          <li>
            Render Deliverables PDF, the shared renderer behind first presentation and
            re-presentation
          </li>
          <li>
            Provision Discovery Recording Dropzone, creates the exact upload folder, no human-typed
            paths
          </li>
        </ul>
        <p className="mt-3 text-[11px] text-muted-foreground/70">
          3 infrastructure workflows run independently of any engagement: a daily Supabase backup, a
          backup-retention purge, and a keep-alive ping.
        </p>
      </div>
    </div>
  );
}

function BehindTheOperations() {
  return (
    <div className="mx-auto max-w-4xl">
      <Carousel slides={behindOperationsSlides} />
    </div>
  );
}

/* ──────────────── PAYMENT & ONBOARDING/KICKOFF SYSTEM ──────────────── */

const paymentOnboardingSlides: CarouselSlide[] = [
  {
    src: "/case-study/slack-request-deposit-message.png",
    title: "Deposit requested",
    caption:
      "The system computes 50% of the Deal total and Slacks me the exact figure to request from the client.",
  },
  {
    src: "/case-study/received-onboarding-email.png",
    title: "Onboarding kit delivered",
    caption:
      "Once the deposit's confirmed, the client automatically gets their signed contract and payment receipt.",
  },
  {
    src: "/case-study/behind-operations/hubspot-deal-closed-won.png",
    title: "Deal closes for real",
    caption: "The CRM Deal genuinely advances to closed-won, not a manual drag-and-drop.",
  },
  {
    src: "/case-study/behind-operations/kickoff-agenda-slack-post.png",
    title: "Kickoff agenda drafted",
    caption: "An AI-drafted agenda lands in Slack, built from the seven approved deliverables.",
  },
  {
    src: "/case-study/behind-operations/NogalSolutions-Notify-Expected-Deposit.png",
    title: "Notify Expected Deposit",
    caption:
      "Computes and Slacks the 50% deposit figure the moment a Deal moves to awaiting deposit.",
  },
  {
    src: "/case-study/behind-operations/NogalSolutions-Record-Deposit-Payment.png",
    title: "Record Deposit Payment",
    caption:
      "Matches the received amount against what's expected, and a mismatch routes to manual review instead of a guess.",
  },
  {
    src: "/case-study/behind-operations/NogalSolutions-Send-Onboarding-Kit.png",
    title: "Send Onboarding Kit",
    caption: "Emails the welcome message, signed contract, and receipt as direct attachments.",
  },
  {
    src: "/case-study/behind-operations/NogalSolutions-Kickoff-Prep.png",
    title: "Kickoff Prep",
    caption: "Drafts the kickoff-call agenda from the seven approved deliverables.",
  },
];

function PaymentOnboardingKickoff() {
  return (
    <Section
      id="payment-onboarding-kickoff"
      title={
        <>
          Payment, Onboarding, & <span className="text-gradient-crimson">Kickoff System.</span>
        </>
      }
      subtitle="Once a client agrees, the system requests and verifies the deposit, delivers the signed contract and receipt, and drafts the kickoff-call agenda, automatically."
      align="center"
    >
      <Carousel slides={paymentOnboardingSlides} />
    </Section>
  );
}

function ProcessMapDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="group inline-flex items-center gap-2 rounded-xl border border-border/70 bg-card/60 px-5 py-3 text-sm font-medium transition-colors hover:border-primary/40 hover:bg-card"
        >
          <Waypoints className="size-4 text-primary" />
          View the full process map
          <ArrowRight className="size-3.5 opacity-60 transition-transform group-hover:translate-x-0.5" />
        </button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[85vh] w-[95vw] max-w-3xl flex-col gap-0 p-0 sm:rounded-2xl">
        <DialogHeader className="shrink-0 border-b border-border/60 px-6 py-5 text-center sm:text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Full process map
          </p>
          <DialogTitle className="mt-1 text-xl tracking-tight md:text-2xl">
            Every stage, every branch, every human decision point
          </DialogTitle>
          <DialogDescription className="mx-auto max-w-md">
            From a stranger filling out a form to a closed, onboarded client, drawn as an actual
            flowchart, not a slideshow.
          </DialogDescription>
        </DialogHeader>
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-8">
          <ProcessMapFlowchart />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function OperationsProof() {
  return (
    <section className="relative py-20 lg:py-28">
      <Container>
        <div className="mx-auto max-w-4xl">
          <div className="mt-10 rounded-xl border border-border/60 bg-card/40 p-6">
            <h4 className="text-base font-semibold tracking-tight">Why this many workflows?</h4>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Each stage runs as its own dedicated workflow on purpose, since small,
              single-responsibility pieces are easier to build, test, and review individually. Every
              workflow here went through a manual, node-by-node review before going live, and carries
              its own execution log and Slack alerting, so a failure anywhere is caught and traceable
              immediately instead of buried inside one giant, unreadable pipeline.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              That's a deliberate tradeoff for reliability and safe iteration while proving the system
              out, not the smallest possible footprint. For a leaner deployment, several of these could
              reasonably be consolidated: folding the shared sub-workflows into their callers, or
              combining the infrastructure jobs into one scheduled workflow. That's an option on the
              table for your build, not a constraint of the approach.
            </p>
          </div>

          <p className="mt-8 rounded-xl border border-primary/20 bg-primary/[0.05] p-4 text-sm leading-relaxed text-muted-foreground">
            <strong className="text-foreground">Verification, not vibes:</strong> every one of these
            workflows was proven against a real, live execution, not just a passing validation check,
            before I called it done.
          </p>
        </div>
      </Container>
    </section>
  );
}

/* ─────────────────────────── TECH STACK ─────────────────────────── */

function TechStackSection() {
  return (
    <Section
      id="stack"
      title={
        <>
          Built on <span className="text-gradient-crimson">boring, replaceable parts.</span>
        </>
      }
      subtitle="Nothing here is exotic. Each piece does one job and can be swapped for whatever a business already runs, which is the point: the architecture should outlive any single vendor in it."
      align="center"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {techStack.map((t) => (
          <div
            key={t.name}
            className="flex flex-col rounded-2xl border border-border/70 bg-card/60 p-6 transition-colors hover:border-primary/35"
          >
            <div className="text-[10px] font-medium tracking-wider text-primary uppercase">
              {t.role}
            </div>
            <h3 className="mt-2 text-base font-semibold tracking-tight">{t.name}</h3>
            <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{t.detail}</p>
          </div>
        ))}
      </div>
    </Section>
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
            background:
              "linear-gradient(135deg, #0B0608 0%, #2A0710 45%, #45101C 65%, #2A0710 85%, #0B0608 100%)",
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
              WebkitMaskImage:
                "radial-gradient(ellipse 80% 70% at 30% 40%, black 30%, transparent 85%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 55% 60% at 22% 32%, oklch(0.45 0.16 18 / 0.45), transparent 65%)",
            }}
          />
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
              Want a system like this built for your business?
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/85 md:text-xl">
              This isn't a mockup. It's the same engineering discipline I'll bring to your
              operations: architected, built, and proven before it ever touches a real client.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="/#intake"
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
