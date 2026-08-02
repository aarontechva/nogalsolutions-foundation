import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
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
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  ArrowRight,
  Download,
  Mail,
  Bot,
  ShieldCheck,
  UserCheck,
  Package,
  CalendarClock,
  CheckCircle2,
  Database,
  Siren,
  Zap,
} from "lucide-react";

export const Route = createFileRoute("/ai-email-enquiry-triage")({
  head: () => ({
    meta: [
      { title: "AI Email Enquiry Triage: Live Systems | NogalSolutions" },
      {
        name: "description",
        content:
          "An AI system that reads every incoming customer email, checks live inventory and appointment data, answers the safe questions itself, and hands everything else to a human with the context already written.",
      },
      {
        property: "og:title",
        content: "AI Email Enquiry Triage: Live Systems | NogalSolutions",
      },
      {
        property: "og:description",
        content:
          "Every enquiry read, categorised, and grounded in real business data in seconds. Safe answers sent automatically, everything else escalated with a summary and a recommended next step.",
      },
    ],
  }),
  component: EmailEnquiryTriage,
});

function EmailEnquiryTriage() {
  return (
    <div id="top" className="relative min-h-screen text-foreground">
      <SiteBackground />
      <Navbar />
      <TriageHero />
      <HowAMessageIsHandled />
      <GroundedInRealData />
      <MessyReality />
      <SafetyByDesign />
      <WorkflowAnatomy />
      <TechStack />
      <TriageClosingCTA />
      <Footer />
    </div>
  );
}

/* ─────────────────────────── HERO ─────────────────────────── */

const heroStats = [
  { v: "5 - 12 sec", l: "from email received to triaged" },
  { v: "6", l: "enquiry types classified" },
  { v: "2", l: "narrow autonomy lanes" },
  { v: "0", l: "enquiries silently dropped" },
];

const flowStages = [
  { icon: Mail, title: "Email Arrives", caption: "Straight into the support inbox" },
  { icon: Database, title: "Pull Live Data", caption: "Current stock and open slots" },
  { icon: Bot, title: "AI Triage", caption: "Category, urgency, and a real answer" },
  { icon: ShieldCheck, title: "Safety Gate", caption: "Decides what AI may send" },
  { icon: UserCheck, title: "Human Handoff", caption: "With the context already written" },
];

function TriageHero() {
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

        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
          <div>
            <h1 className="text-balance text-5xl font-semibold leading-[1.02] tracking-tight md:text-6xl lg:text-7xl">
              AI <span className="text-gradient-crimson">Email Enquiry Triage.</span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              Every customer email read, understood, and checked against the business's real
              inventory and calendar within seconds. The safe questions get answered on their own.
              Everything else reaches a person with the summary and the recommended next step
              already written.
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
                  "radial-gradient(ellipse 70% 60% at 20% 0%, oklch(0.45 0.18 18 / 0.14), transparent 68%)",
              }}
            />
            <div className="relative">
              <div className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
                The path every message takes
              </div>
              <ol className="mt-7 space-y-6">
                {flowStages.map((stage, i) => (
                  <li key={stage.title} className="flex items-start gap-4">
                    <div className="relative flex flex-col items-center">
                      <div className="grid size-10 shrink-0 place-items-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
                        <stage.icon className="size-4" />
                      </div>
                      {i < flowStages.length - 1 && (
                        <div className="mt-1 h-6 w-px bg-gradient-to-b from-primary/40 to-transparent" />
                      )}
                    </div>
                    <div className="pt-1.5">
                      <div className="text-sm font-semibold tracking-tight">{stage.title}</div>
                      <div className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                        {stage.caption}
                      </div>
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

/* ──────────────────── WALKTHROUGH DIALOG ──────────────────── */

/**
 * Each bento box opens a scrollable walkthrough of one real run through the
 * system. Steps render text-only until a screenshot exists, so the page is
 * fully working before any image lands: set `image` on a step to switch it on.
 * Images live in /public/case-study/email-enquiry-triage/ (kebab-case, no
 * spaces, matching the naming that fixed the earlier Cloudflare 404s).
 */
interface WalkthroughStep {
  title: string;
  caption: string;
  image?: string;
  alt?: string;
}

interface Walkthrough {
  eyebrow: string;
  title: string;
  description: string;
  steps: WalkthroughStep[];
}

function WalkthroughDialog({
  walkthrough,
  children,
}: {
  walkthrough: Walkthrough;
  children: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex max-h-[85vh] w-[95vw] max-w-3xl flex-col gap-0 p-0 sm:rounded-2xl">
        <DialogHeader className="shrink-0 border-b border-border/60 px-6 py-5 text-left sm:text-left">
          <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
            {walkthrough.eyebrow}
          </p>
          <DialogTitle className="mt-1 text-xl tracking-tight md:text-2xl">
            {walkthrough.title}
          </DialogTitle>
          <DialogDescription className="max-w-xl">{walkthrough.description}</DialogDescription>
        </DialogHeader>
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-8">
          <ol className="space-y-9">
            {walkthrough.steps.map((step, i) => (
              <li key={step.title}>
                <div className="flex items-baseline gap-3">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full border border-primary/30 bg-primary/10 text-[11px] font-semibold text-primary">
                    {i + 1}
                  </span>
                  <h4 className="text-sm font-semibold tracking-tight">{step.title}</h4>
                </div>
                <p className="mt-2 pl-9 text-sm leading-relaxed text-muted-foreground">
                  {step.caption}
                </p>
                {step.image && (
                  <div className="mt-4 ml-9 overflow-hidden rounded-xl border border-border/70 bg-secondary/20">
                    {/* Not lazy-loaded on purpose: Radix only mounts dialog
                        content on open, so there is no page-load cost here, and
                        the lazy intersection observer does not fire reliably
                        inside a freshly mounted portal, which leaves the
                        screenshots blank until the user scrolls. */}
                    <img
                      src={encodeURI(step.image)}
                      alt={step.alt ?? step.title}
                      className="w-full object-contain"
                    />
                  </div>
                )}
              </li>
            ))}
          </ol>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ──────────────────── HOW A MESSAGE IS HANDLED ──────────────────── */

const lanes = [
  {
    icon: Package,
    tone: "auto",
    label: "Answered automatically",
    title: "Parts pricing and stock",
    body: "The customer asks whether a part is available and what it costs. The system looks it up in the live inventory, and if there is a concrete answer, it replies with the real price and the real stock level. It states availability. It never confirms a sale.",
    walkthrough: {
      eyebrow: "Answered automatically",
      title: "A parts enquiry, start to finish",
      description:
        "A real run through the system. The customer asks about a filter and gets a genuine price and stock level back, without anyone checking a spreadsheet.",
      steps: [
        {
          title: "The customer asks",
          caption:
            "A general enquiry, no part number, no product name. Just someone wanting to know if the thing they need is in stock before making the drive.",
          image: "/case-study/email-enquiry-triage/parts-01-email-enquiry.png",
          alt: "Customer email asking whether a replacement air filter is in stock and what it costs",
        },
        {
          title: "It reads the live stock list and finds the item",
          caption:
            "The current inventory is pulled fresh at the moment the email arrives, and the vague request resolves to a real row: 16x25x1 Pleated Air Filter, $24.99, 42 in stock at Warehouse A, Shelf 3.",
          image: "/case-study/email-enquiry-triage/parts-01-inventory-sheets.png",
          alt: "The synthetic HVAC inventory sheet showing the air filter row with price, stock level, and location",
        },
        {
          title: "The reply carries the real numbers, and a limit",
          caption:
            "The customer gets the actual price, stock count, and location within seconds. The reply also states plainly that no sale or reservation has been processed, so nothing is implied that the system has no authority to promise.",
          image: "/case-study/email-enquiry-triage/parts-01-ai-auto-reply.png",
          alt: "The automatic reply quoting the real price, stock level, and location, and stating no sale has been processed",
        },
        {
          title: "The team is told, not asked",
          caption:
            "A note lands in the support channel marked information only. Nobody has to action it, but the answer that went out is on the record.",
          image: "/case-study/email-enquiry-triage/parts-01-slack-fyi-customer-ticket.png",
          alt: "Slack notification stating an autonomous informational reply was sent, FYI only, no action needed",
        },
      ],
    },
  },
  {
    icon: CalendarClock,
    tone: "auto",
    label: "Answered automatically",
    title: "Appointment availability",
    body: "The customer asks what times are open. The system reads the current calendar and replies with the genuinely open slots, matched to any preference they mentioned. It shows availability, and it says plainly that the slot is not booked until a person confirms it.",
    walkthrough: {
      eyebrow: "Answered automatically",
      title: "A scheduling enquiry, start to finish",
      description:
        "Showing availability is safe to automate. Booking the slot is not. This run demonstrates exactly where that line sits.",
      steps: [
        {
          title: "The customer asks",
          caption:
            "No specific date, just a rough window and a preference. The kind of message that normally means someone has to go and open the calendar.",
          image: "/case-study/email-enquiry-triage/box-02-availability-enquiry.png",
          alt: "Customer email asking about openings for a routine maintenance visit next week, preferring mornings",
        },
        {
          title: "It reads the current calendar",
          caption:
            "Open and booked slots are pulled at the moment the email arrives, so nothing offered back has already been taken by someone else.",
          image: "/case-study/email-enquiry-triage/box-02-appointment-slots-sheets.png",
          alt: "The appointment slots sheet showing each date and time slot marked Open or Booked",
        },
        {
          title: "The reply names real times, and acknowledges the preference",
          caption:
            "Genuinely open slots are quoted directly from the calendar, with the customer's stated preference for mornings addressed explicitly. It then states plainly that nothing is booked until they confirm, so availability is never mistaken for a reservation.",
          image: "/case-study/email-enquiry-triage/box-02-ai-date-recommendation-reply.png",
          alt: "The automatic reply listing real open slots, noting morning availability, and stating the slots are not yet booked",
        },
        {
          title: "The team is told, not asked",
          caption:
            "Same pattern as any other automatic answer. The support channel gets a record of what went out, flagged as needing no action.",
          image: "/case-study/email-enquiry-triage/box-02-slack-fyi-customer-ticket.png",
          alt: "Slack notification stating an autonomous scheduling reply was sent, FYI only, no action needed",
        },
      ],
    },
  },
  {
    icon: UserCheck,
    tone: "human",
    label: "Routed to a human",
    title: "Everything that needs judgment",
    body: "Quotes, diagnostics, anything touching the equipment itself, and anything where the data does not hold a clear answer. The person receives the enquiry already categorised, already summarised, with a recommended angle for the reply.",
    walkthrough: {
      eyebrow: "Routed to a human",
      title: "What a handoff actually looks like",
      description:
        "The system does not answer this one, and it should not. What it does instead is make the human's next five minutes considerably shorter.",
      steps: [
        {
          title: "The customer asks for a quote",
          caption:
            "A genuine, well-formed enquiry. Nothing is wrong with it. It simply cannot be answered from a lookup table.",
          image: "/case-study/email-enquiry-triage/box-03-email-enquiry.png",
          alt: "Customer email asking for a rough quote on a mini-split system for a garage conversion",
        },
        {
          title: "The system declines to answer it",
          caption:
            "Real installation pricing depends on site conditions, access, and sizing. No lookup holds that answer, so no automatic reply is attempted at all. This is a deliberate limit, not a failure to understand the question.",
        },
        {
          title: "The handoff arrives already thought through",
          caption:
            "The enquiry reaches a person categorised as a quote request, marked low urgency, summarised in one line, and carrying a recommended angle: explain that a site visit is needed for an accurate quote, and offer a free consultation. They start from a position rather than a blank page.",
          image: "/case-study/email-enquiry-triage/box-03-slack-suggested-angle.png",
          alt: "Slack support ticket showing category, urgency, a one-line summary, and a suggested response angle",
        },
      ],
    },
  },
];

function HowAMessageIsHandled() {
  return (
    <Section
      id="how-it-works"
      title={
        <>
          It answers what is safe. <span className="text-gradient-crimson">A person does the rest.</span>
        </>
      }
      subtitle="Autonomy here is deliberately narrow. The system only replies on its own when the answer is a verifiable fact it just looked up, never when the answer requires a judgment call."
      align="center"
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {lanes.map((lane) => (
          <WalkthroughDialog key={lane.title} walkthrough={lane.walkthrough}>
            <button
              type="button"
              className={cn(
                "group relative flex flex-col overflow-hidden rounded-2xl border bg-card/60 p-7 text-left transition-all duration-300 hover:-translate-y-0.5",
                lane.tone === "auto"
                  ? "border-primary/25 hover:border-primary/45"
                  : "border-border/70 hover:border-border",
              )}
            >
              <div
                className={cn(
                  "grid size-11 place-items-center rounded-xl border",
                  lane.tone === "auto"
                    ? "border-primary/30 bg-primary/10 text-primary"
                    : "border-border/70 bg-secondary/30 text-muted-foreground",
                )}
              >
                <lane.icon className="size-5" />
              </div>
              <div
                className={cn(
                  "mt-5 text-[10px] font-medium tracking-wider uppercase",
                  lane.tone === "auto" ? "text-primary" : "text-muted-foreground",
                )}
              >
                {lane.label}
              </div>
              <h3 className="mt-2 text-lg font-semibold tracking-tight">{lane.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{lane.body}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                See it run
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </button>
          </WalkthroughDialog>
        ))}
      </div>
    </Section>
  );
}

/* ──────────────────── GROUNDED IN REAL DATA ──────────────────── */

const capacitorWalkthrough: Walkthrough = {
  eyebrow: "A real enquiry it handled",
  title: "A vague description, matched to a real part",
  description:
    "The hardest kind of message to automate: non-native phrasing, no part number, and a guess at what might be wrong. Here is what the system did with it.",
  steps: [
    {
      title: "The customer describes the problem, not the part",
      caption:
        'No SKU, no product name, and a guess at the cause: "maybe need new capacitor part". Two separate asks are buried in one sentence, the price and an appointment.',
      image: "/case-study/email-enquiry-triage/redundant-email-enquiry.png",
      alt: "Customer email in non-native English describing an AC not cooling and guessing a capacitor is needed",
    },
    {
      title: "The guess resolves to a real catalogue item",
      caption:
        "The live inventory is checked and the vague description lands on an exact row: Universal Capacitor 35/5 MFD, $32.75. The stock column reads 0. That detail is the whole point of looking it up.",
      image: "/case-study/email-enquiry-triage/parts-01-inventory-sheets.png",
      alt: "The inventory sheet showing the Universal Capacitor 35/5 MFD priced at 32.75 with a stock quantity of zero",
    },
    {
      title: "It reports the shortage instead of just the price",
      caption:
        "The handoff tells the technician the part is $32.75 and out of stock, and recommends offering a visit to diagnose the unit and discuss alternatives. A shallow lookup would have quoted the price and let someone discover the shortage later.",
      image: "/case-study/email-enquiry-triage/redundant-email-ai-response-slack.png",
      alt: "Slack support ticket reporting the capacitor is out of stock and suggesting a technician visit with alternatives",
    },
  ],
};

function GroundedInRealData() {
  return (
    <Section
      id="grounded"
      title={
        <>
          It reads the enquiry, then{" "}
          <span className="text-gradient-crimson">checks the actual records.</span>
        </>
      }
      subtitle="A generic AI assistant guesses from the wording alone. This one pulls the business's current inventory and calendar into the decision before it says anything, so what it reports is what is genuinely true right now."
    >
      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <WalkthroughDialog walkthrough={capacitorWalkthrough}>
          <button
            type="button"
            className="group rounded-2xl border border-border/70 bg-card/60 p-8 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 md:p-10"
          >
          <div className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
            A real enquiry it handled
          </div>
          <blockquote className="mt-5 border-l-2 border-primary/40 pl-5 text-base leading-relaxed text-muted-foreground italic">
            "good day, my ac unit is not cold enough since two day, maybe need new capacitor part,
            how much this cost and also if have time this week for check, thank you very much"
          </blockquote>

          <div className="mt-8 space-y-4 border-t border-border/60 pt-7">
            <ResultRow label="Category" value="Parts enquiry" />
            <ResultRow label="Urgency" value="Medium" />
            <ResultRow
              label="Found in inventory"
              value="Universal Capacitor 35/5 MFD, $32.75, currently out of stock"
              highlight
            />
            <ResultRow label="Needs a technician" value="Yes, routed to a person" />
          </div>

          <p className="mt-7 text-sm leading-relaxed text-muted-foreground">
            Note what it did not do. It matched a vaguely described part to the exact item, then
            reported that the part is <span className="text-foreground">out of stock</span> rather
            than stopping at the price. A shallow lookup would have quoted $32.75 and left someone
            to discover the shortage later. It also recognised that a cooling fault needs a real
            technician, so it handed the whole thing to a person instead of replying on its own.
          </p>
            <span className="mt-7 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
              See it run
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </button>
        </WalkthroughDialog>

        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-border/70 bg-card/60 p-7">
            <div className="grid size-11 place-items-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
              <Database className="size-5" />
            </div>
            <h3 className="mt-5 text-lg font-semibold tracking-tight">Reads the live source</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Inventory and appointment availability are pulled fresh on every single enquiry, so
              nothing is answered from a stale copy or from the model's imagination.
            </p>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card/60 p-7">
            <div className="grid size-11 place-items-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
              <Zap className="size-5" />
            </div>
            <h3 className="mt-5 text-lg font-semibold tracking-tight">
              Reports the fact, not a suggestion
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              When a lookup finds a real answer, the handoff states it outright, for example "Aug 4
              has two open slots: 9-11am and 1-3pm". It does not tell the person to go and check.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}

function ResultRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
      <span className="text-xs tracking-wide text-muted-foreground uppercase">{label}</span>
      <span
        className={cn(
          "text-sm font-medium",
          highlight ? "text-primary" : "text-foreground",
        )}
      >
        {value}
      </span>
    </div>
  );
}

/* ──────────────────── MESSY REALITY ──────────────────── */

/**
 * Six real test emails sent back to back. Every one of them produced the
 * corresponding message in the screenshot below, in this order, inside an
 * eleven minute window.
 */
const messyCases = [
  { subject: "ac help pls", input: "Three asks in one run-on message, with typos" },
  { subject: "question", input: "Too vague to act on, almost no detail given" },
  { subject: "URGENT!!! PLEASE READ ASAP", input: "Shouting, but harmless underneath" },
  { subject: "pricing", input: "Four words, no context" },
  { subject: "Re: Re: Fwd: Service visit", input: "Real request buried under a quoted chain" },
  { subject: "need help please", input: "Non-native phrasing, part described by guesswork" },
];

const messyProofImage = "/case-study/email-enquiry-triage/slack-timeline-message.png";
const messyProofReady = true;

function MessyReality() {
  return (
    <Section
      id="messy-reality"
      title={
        <>
          Tested against how people{" "}
          <span className="text-gradient-crimson">actually write.</span>
        </>
      }
      subtitle="Customers do not send tidy, well-structured tickets. They ramble, they shout, they forget the details, and they reply from a phone at the bottom of a thread. Every case below was a real message put through the live system."
      align="center"
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {messyCases.map((c) => (
          <div
            key={c.subject}
            className="rounded-xl border border-border/70 bg-card/60 px-4 py-3.5"
          >
            <div className="flex items-center gap-2">
              <Mail className="size-3.5 shrink-0 text-muted-foreground" />
              <span className="truncate font-mono text-xs text-foreground">{c.subject}</span>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{c.input}</p>
          </div>
        ))}
      </div>

      {messyProofReady ? (
        <figure className="mt-10">
          <div className="overflow-hidden rounded-2xl border border-border/70 bg-secondary/20">
            <img
              src={encodeURI(messyProofImage)}
              alt="The support channel showing six consecutive tickets generated from the six test emails, each with its own category and urgency"
              className="w-full object-contain"
            />
          </div>
          <figcaption className="mt-4 flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>
              All six, back to back in the support channel, inside an eleven minute window. Note the
              third one: the subject line is shouting, and the system still filed it as low urgency
              because the message underneath says it is not an emergency.
            </span>
          </figcaption>
        </figure>
      ) : (
        <p className="mt-10 flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
          <span>
            All six were handled back to back inside an eleven minute window. The third is the
            telling one: the subject line is shouting, and the system still filed it as low urgency
            because the message underneath says it is not an emergency.
          </span>
        </p>
      )}
    </Section>
  );
}

/* ──────────────────── SAFETY BY DESIGN ──────────────────── */

const safetyPoints = [
  {
    icon: ShieldCheck,
    title: "A complaint passes four checks before AI may answer it",
    body: "It has to be low urgency, need no technician, match a known routine topic in the knowledge base by genuine similarity search, and come from someone with no complaint already on record. Fail any one of the four and a person takes it, with a holding note going to the customer immediately so nobody sits in silence.",
  },
  {
    icon: Siren,
    title: "Nothing is ever sent half-formed",
    body: "Every AI response is validated before it can leave. If the model returns something malformed, the system retries once, and if it still fails, no email is sent at all and a person is alerted instead. A broken message never reaches a customer.",
  },
  {
    icon: UserCheck,
    title: "An acknowledgement is not a resolution",
    body: "When the AI can only acknowledge something rather than settle it, a billing charge it cannot verify for example, it says so honestly and flags the enquiry for real follow-up instead of quietly marking it as handled.",
  },
  {
    icon: Bot,
    title: "It never invents a fact",
    body: "The AI is only allowed to state what the customer wrote or what a lookup actually returned. It cannot promise a refund, a discount, a booking, or a date. Those remain human decisions by design.",
  },
];

function SafetyByDesign() {
  return (
    <Section
      id="safety"
      title={
        <>
          Built for a business where{" "}
          <span className="text-gradient-crimson">a wrong answer costs money.</span>
        </>
      }
      subtitle="The hard part of automating customer email is not writing replies. It is being disciplined about the ones that must not be automated."
    >
      <div className="grid gap-6 md:grid-cols-2">
        {safetyPoints.map((p) => (
          <div key={p.title} className="rounded-2xl border border-border/70 bg-card/60 p-7 md:p-8">
            <div className="grid size-11 place-items-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
              <p.icon className="size-5" />
            </div>
            <h3 className="mt-5 text-lg font-semibold tracking-tight">{p.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-border/60 bg-secondary/20 p-7 md:p-8">
        <p className="text-sm leading-relaxed text-muted-foreground">
          <span className="font-medium text-foreground">About this demonstration.</span> This system
          runs live on real infrastructure, real inbound email, real AI, a real database, and real
          outbound delivery, but the business it serves is a fictional HVAC company and the
          inventory, calendar, and knowledge base are synthetic. It was built as a working
          demonstration of the architecture, not as a live customer service desk, so no real
          customer data is involved anywhere in it.
        </p>
      </div>
    </Section>
  );
}

/* ──────────────────── WORKFLOW ANATOMY ──────────────────── */

const WF_BASE = "/case-study/email-enquiry-triage/";
const WF_SUFFIX = "NogalSolutions-Util-Informed-AI-Email-Enquiry-Triage-Workflow.png";

interface WorkflowPhase {
  label: string;
  title: string;
  body: string;
  image: string;
  alt: string;
}

const fullCanvas: WorkflowPhase = {
  label: "",
  title: "The complete workflow",
  body: "Every phase and both autonomy forks, as built.",
  image: WF_BASE + WF_SUFFIX,
  alt: "The complete n8n workflow canvas showing all phases and both autonomy forks colour grouped",
};

const workflowPhases: WorkflowPhase[] = [
  {
    label: "Phase 1",
    title: "Intake",
    alt: "The intake section of the workflow canvas",
    body: "The email hits the inbox and a webhook fires carrying only metadata, so the full body is fetched back from the mail API before anything else happens. Anything that is not a genuine received email is ignored on the spot.",
    image: WF_BASE + "phase-1.png",
  },
  {
    label: "Phase 2",
    alt: "The AI triage section of the workflow canvas",
    title: "AI triage, two interchangeable engines",
    body: "One config switch decides which engine a client runs: straight text triage, or the informed version that fetches live inventory and calendar data first and hands it to the model as context. Both produce the identical output shape and both pass through the same validation node.",
    image: WF_BASE + "phase-2.png",
  },
  {
    label: "Phase 3",
    alt: "The route-to-a-human section of the workflow canvas",
    title: "Route to a human",
    body: "A valid triage becomes a support ticket for a person to act on. Anything that fails, whether a fetch problem or a malformed AI response, raises a separate alert instead. Nothing is ever dropped in silence.",
    image: WF_BASE + "phase-3.png",
  },
  {
    label: "Fork A",
    alt: "The complaint-handling fork of the workflow canvas",
    title: "Complaint handling, the strict path",
    body: "Four conditions must all hold before AI may answer a complaint. Fail any one and a fixed holding email goes out immediately while a human is alerted with the specific reason. Every outcome is written to a complaint log, which is also what powers the repeat-customer check.",
    image: WF_BASE + "complaint.png",
  },
  {
    label: "Fork B",
    alt: "The parts and scheduling fork of the workflow canvas",
    title: "Parts and scheduling, the narrow path",
    body: "A simpler gate: no technician needed, and the pre-fetched data actually holds a concrete answer. Fail either and it falls back to a normal human ticket. When it passes, the reply states the fact and nothing more, never a booking or a sale.",
    image: WF_BASE + "parts-scheduling.png",
  },
];

/**
 * The phases open as a slideshow rather than five separate dialogs: they are one
 * continuous walk through a single canvas, so being able to step Phase 1 → 2 → 3
 * without closing and reopening is the whole point. Any card can start it, and
 * arrow keys move through it.
 */
function PhaseSlideshow({
  phases,
  openAt,
  onClose,
}: {
  phases: WorkflowPhase[];
  openAt: number | null;
  onClose: () => void;
}) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (openAt !== null) setI(openAt);
  }, [openAt]);

  const go = useCallback(
    (delta: number) => setI((prev) => (prev + delta + phases.length) % phases.length),
    [phases.length],
  );

  useEffect(() => {
    if (openAt === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openAt, go]);

  const phase = phases[i];

  return (
    <Dialog open={openAt !== null} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="flex max-h-[92vh] w-[96vw] max-w-6xl flex-col gap-0 p-0 sm:rounded-2xl">
        <DialogHeader className="shrink-0 border-b border-border/60 px-6 py-5 text-left sm:text-left">
          <div className="flex items-center gap-3">
            <span className="rounded-md border border-primary/40 bg-primary/10 px-2 py-1 font-mono text-[11px] text-primary">
              {phase.label}
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              {i + 1} / {phases.length}
            </span>
          </div>
          <DialogTitle className="mt-2 text-lg tracking-tight md:text-xl">{phase.title}</DialogTitle>
          <DialogDescription className="max-w-3xl">{phase.body}</DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-auto bg-secondary/20 p-4">
          <img
            src={encodeURI(phase.image)}
            alt={phase.alt}
            className="w-full min-w-[720px] max-w-none object-contain"
          />
        </div>

        <div className="flex shrink-0 items-center justify-between gap-4 border-t border-border/60 px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={() => go(-1)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-card/60 px-3 py-2 text-xs font-medium transition-colors hover:border-primary/40 hover:text-foreground"
          >
            <ChevronLeft className="size-4" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          {/* Dots double as direct jumps, so a five-step walk never needs four clicks */}
          <div className="flex items-center gap-2">
            {phases.map((pph, idx) => (
              <button
                key={pph.title}
                type="button"
                onClick={() => setI(idx)}
                aria-label={`Go to ${pph.label}: ${pph.title}`}
                aria-current={idx === i}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  idx === i ? "w-6 bg-primary" : "w-1.5 bg-border hover:bg-muted-foreground",
                )}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => go(1)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-card/60 px-3 py-2 text-xs font-medium transition-colors hover:border-primary/40 hover:text-foreground"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="size-4" />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function WorkflowAnatomy() {
  const [slide, setSlide] = useState<number | null>(null);

  return (
    <Section
      id="anatomy"
      title={
        <>
          What it looks like <span className="text-gradient-crimson">underneath.</span>
        </>
      }
      subtitle="Not a diagram drawn for a slide deck. This is the actual build, colour-grouped by phase, with the reasoning written directly onto the canvas so the next person to open it understands why each branch exists."
    >
      {/* The whole canvas stays on display — it is the proof, and shrinking it into
          a trigger would waste it. The per-phase closeups are the ones that need a
          bigger surface, so those live in the slideshow. */}
      <figure className="overflow-hidden rounded-2xl border border-border/70 bg-secondary/20">
        <div className="overflow-auto">
          <img
            src={encodeURI(fullCanvas.image)}
            alt={fullCanvas.alt}
            className="w-full min-w-[900px] max-w-none object-contain"
          />
        </div>
        <figcaption className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 px-5 py-3.5">
          <span className="text-xs text-muted-foreground">
            The complete workflow, every phase and both autonomy forks. Scroll inside to explore it.
          </span>
          <button
            type="button"
            onClick={() => setSlide(0)}
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-primary"
          >
            <Maximize2 className="size-3.5" />
            Walk through it phase by phase
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </figcaption>
      </figure>

      <PhaseSlideshow phases={workflowPhases} openAt={slide} onClose={() => setSlide(null)} />
    </Section>
  );
}

/* ──────────────────── TECH STACK ──────────────────── */

const stack = [
  {
    name: "n8n",
    role: "Orchestration",
    detail: "Self-hosted on a private VPS, so the workflow and its data stay on infrastructure I control.",
  },
  {
    name: "Resend",
    role: "Email in and out",
    detail: "Receives the inbound enquiry by webhook and delivers every reply the system sends.",
  },
  {
    name: "OpenRouter",
    role: "Model gateway",
    detail: "One integration point in front of the language models, so a model can be swapped without touching the build.",
  },
  {
    name: "DeepSeek V4 Flash",
    role: "Classification and drafting",
    detail: "Handles the triage decision and drafts the customer-facing replies, always into a strict output schema.",
  },
  {
    name: "OpenAI Embeddings",
    role: "Meaning search",
    detail: "Turns each enquiry into a vector so a complaint can be matched to a known topic by meaning, not keywords.",
  },
  {
    name: "Supabase",
    role: "Knowledge base and log",
    detail: "Postgres with vector search holding the FAQ knowledge base, plus the complaint log behind the repeat-customer check.",
  },
  {
    name: "Google Sheets",
    role: "Business data",
    detail: "Stands in for the inventory and booking systems a real business would already have, read live on every enquiry.",
  },
  {
    name: "Slack",
    role: "Human handoff",
    detail: "Where tickets, escalations, and failure alerts land for a person to pick up.",
  },
];

function TechStack() {
  return (
    <Section
      id="stack"
      title={
        <>
          Built on <span className="text-gradient-crimson">boring, replaceable parts.</span>
        </>
      }
      subtitle="Nothing here is exotic. Each piece does one job and can be swapped for whatever a business already runs, which is the point: the architecture should outlive any single vendor in it."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stack.map((s) => (
          <div
            key={s.name}
            className="flex flex-col rounded-2xl border border-border/70 bg-card/60 p-6 transition-colors hover:border-primary/35"
          >
            <div className="text-[10px] font-medium tracking-wider text-primary uppercase">
              {s.role}
            </div>
            <h3 className="mt-2 text-base font-semibold tracking-tight">{s.name}</h3>
            <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{s.detail}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ───────────────────────────── CTA ───────────────────────────── */

function TriageClosingCTA() {
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
              How much of your inbox is answering the same questions?
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/85 md:text-xl">
              If your team spends its day checking stock, quoting availability, and re-typing the
              same acknowledgements, that work can be handed off safely without taking your people
              out of the decisions that matter.
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
