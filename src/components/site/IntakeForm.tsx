import { supabase } from "@/lib/supabase";
import { useState, useId } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Section } from "./Section";

// ─── EMAIL VALIDATION ─────────────────────────────────────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ─── FIELD 4: INDUSTRY — JUDGMENT CALL ───────────────────────────────────────
// Chose dropdown with "Other" over free text.
// Rationale: Industry is a bounded categorical signal that feeds the downstream
// keyword classifier (Spec §4.1 Rule 4) alongside Problem in Operations. Structured
// options normalize the data for that classifier without losing flexibility —
// "Other" + a conditional free-text reveal handles edge cases. Free text here would
// introduce noise without benefit since field 5 (Problem in Operations) carries
// the primary keyword signal anyway.
const INDUSTRY_OPTIONS = [
  "SaaS / Technology",
  "E-Commerce / Retail",
  "Real Estate",
  "Healthcare",
  "Financial Services",
  "Marketing / Advertising",
  "Professional Services",
  "Logistics / Supply Chain",
  "Hospitality / Food & Beverage",
  "Other",
] as const;

// ─── FIELD 7: TIMELINE OPTIONS ────────────────────────────────────────────────
// Spec §4.1 Rule 6 disqualifies "someday" specifically, so "Someday / Exploring"
// is included as an exact-matchable option. The downstream qualifier can filter on
// the value string "someday". Additional granularity added for leads that are ready
// sooner, giving the classifier enough resolution to tier urgency.
const TIMELINE_OPTIONS = [
  { value: "asap", label: "ASAP (within 2 weeks)" },
  { value: "1-3-months", label: "1–3 months" },
  { value: "3-6-months", label: "3–6 months" },
  { value: "6-12-months", label: "6–12 months" },
  { value: "someday", label: "Someday / Exploring" },
] as const;

// ─── FIELD 8: BUDGET OPTIONS ──────────────────────────────────────────────────
// Brackets inferred from NogalSolutions' target market (SMBs and growing businesses).
// Spec §4.1 Rule 5 disqualifies "exploring" specifically, so "Exploring / No budget
// set yet" is an exact-matchable option via value string "exploring". Brackets start
// at $2,500 to reflect minimum viable project scope for custom automation work.
const BUDGET_OPTIONS = [
  { value: "under-2500", label: "Under $2,500" },
  { value: "2500-7500", label: "$2,500–$7,500" },
  { value: "7500-20000", label: "$7,500–$20,000" },
  { value: "20000-plus", label: "$20,000+" },
  { value: "exploring", label: "Exploring / No budget set yet" },
] as const;

// ─── FORM STATE ───────────────────────────────────────────────────────────────

type Fields = {
  name: string;
  email: string;
  company: string;
  industry: string;
  // Populated only when industry === "Other"
  industryOther: string;
  problemInOperations: string;
  // FIELD 6: TECH STACK — JUDGMENT CALL
  // Chose free text over multi-select tags.
  // Rationale: Tech stacks are highly variable in this market. A curated tag list
  // would miss most real-world combinations. Free text (comma-separated) lets
  // prospects describe their actual environment in context — "HubSpot, Stripe,
  // custom React app, Google Sheets" — and the downstream classifier can parse it
  // alongside Problem in Operations. Multi-select would constrain data at the
  // cost of accuracy.
  techStack: string;
  timeline: string;
  budgetRange: string;
  goalsAndOutcomes: string;
  consent: boolean;
};

const INITIAL_FIELDS: Fields = {
  name: "",
  email: "",
  company: "",
  industry: "",
  industryOther: "",
  problemInOperations: "",
  techStack: "",
  timeline: "",
  budgetRange: "",
  goalsAndOutcomes: "",
  consent: false,
};

// ─── VALIDATION ───────────────────────────────────────────────────────────────

type FieldErrors = Partial<Record<keyof Fields, string>>;

function validate(fields: Fields, touched: Set<string>): FieldErrors {
  const e: FieldErrors = {};

  if (touched.has("name") && !fields.name.trim())
    e.name = "Name is required.";

  if (touched.has("email")) {
    if (!fields.email.trim()) e.email = "Email is required.";
    else if (!EMAIL_RE.test(fields.email)) e.email = "Enter a valid email address.";
  }

  if (touched.has("company") && !fields.company.trim())
    e.company = "Company is required.";

  if (touched.has("industry") && !fields.industry)
    e.industry = "Please select an industry.";

  if (touched.has("industryOther") && fields.industry === "Other" && !fields.industryOther.trim())
    e.industryOther = "Please specify your industry.";

  if (touched.has("problemInOperations") && !fields.problemInOperations.trim())
    e.problemInOperations = "Please describe the problem in your operations.";

  if (touched.has("techStack") && !fields.techStack.trim())
    e.techStack = "Tech stack is required.";

  if (touched.has("timeline") && !fields.timeline)
    e.timeline = "Please select a timeline.";

  if (touched.has("budgetRange") && !fields.budgetRange)
    e.budgetRange = "Please select a budget range.";

  if (touched.has("goalsAndOutcomes") && !fields.goalsAndOutcomes.trim())
    e.goalsAndOutcomes = "Please describe your goals and desired outcomes.";

  return e;
}

function allRequiredFilled(fields: Fields): boolean {
  return (
    !!fields.name.trim() &&
    !!fields.email.trim() &&
    EMAIL_RE.test(fields.email) &&
    !!fields.company.trim() &&
    !!fields.industry &&
    (fields.industry !== "Other" || !!fields.industryOther.trim()) &&
    !!fields.problemInOperations.trim() &&
    !!fields.techStack.trim() &&
    !!fields.timeline &&
    !!fields.budgetRange &&
    !!fields.goalsAndOutcomes.trim()
  );
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export function IntakeForm() {
  const [fields, setFields] = useState<Fields>(INITIAL_FIELDS);
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const id = useId();

  const touch = (field: string) =>
    setTouched((prev) => new Set(prev).add(field));

  const set = (field: keyof Fields, value: string | boolean) =>
    setFields((prev) => ({ ...prev, [field]: value }));

  const errors = validate(fields, touched);

  // Spec: submit disabled when email format invalid OR consent not checked.
  // Other required-field emptiness is surfaced on submit attempt, not here.
  const canSubmit = EMAIL_RE.test(fields.email) && fields.consent;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Touch all required fields to surface any remaining errors
    const allFields = new Set([
      "name", "email", "company", "industry",
      ...(fields.industry === "Other" ? ["industryOther"] : []),
      "problemInOperations", "techStack", "timeline", "budgetRange", "goalsAndOutcomes",
    ]);
    setTouched(allFields);

    if (!allRequiredFilled(fields)) return;

    // Payload structured for eventual Supabase insertion.
    // Snake_case keys match PostgreSQL column naming conventions.
    // "industry" resolves the "Other" branch to the free-text value.
    const payload = {
      name: fields.name.trim(),
      email: fields.email.trim().toLowerCase(),
      company: fields.company.trim(),
      industry: fields.industry === "Other" ? fields.industryOther.trim() : fields.industry,
      problem_in_operations: fields.problemInOperations.trim(),
      tech_stack: fields.techStack.trim(),
      timeline: fields.timeline,
      budget_range: fields.budgetRange,
      goals_and_outcomes: fields.goalsAndOutcomes.trim(),
      consent: fields.consent,
      submitted_at: new Date().toISOString(),
    };
    const { error } = await supabase.from("intake_submissions").insert({
      payload,
      submitted_at: payload.submitted_at,
    });

    if (error) {
      console.error("[IntakeForm] Submission failed:", error);
      // TODO: surface a user-facing error state — not in scope for this pass,
      // flagging so it doesn't get forgotten before this goes to real users.
      return;
    }
    setSubmitted(true);
  }

  // ── SUCCESS STATE ────────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <Section
        id="intake"
        eyebrow="Start a Project"
        title={<>Your message is <span className="text-gradient-crimson">on its way.</span></>}
        subtitle="I review every submission personally and respond within 1 business day."
        align="center"
      >
        <div className="mx-auto flex max-w-md flex-col items-center gap-5 rounded-2xl border border-border/80 bg-card p-10 text-center shadow-card">
          <div className="grid size-16 place-items-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
            <CheckCircle2 className="size-8" />
          </div>
          <div>
            <p className="text-lg font-semibold tracking-tight">Submission received</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Aaron will review your intake and follow up within 1 business day. Check your inbox at{" "}
              <span className="text-foreground">{fields.email}</span>.
            </p>
          </div>
          <button
            onClick={() => {
              setFields(INITIAL_FIELDS);
              setTouched(new Set());
              setSubmitted(false);
            }}
            className="text-sm text-primary underline-offset-4 hover:underline"
          >
            Submit another response
          </button>
        </div>
      </Section>
    );
  }

  // ── FORM ─────────────────────────────────────────────────────────────────────
  return (
    <Section
      id="intake"
      eyebrow="Start a Project"
      title={
        <>
          Tell me where your{" "}
          <span className="text-gradient-crimson">operations break down.</span>
        </>
      }
      subtitle="Share your situation below. I review every submission personally and respond within 1 business day."
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className="rounded-2xl border border-border/80 bg-card p-7 shadow-card md:p-10">
          <div className="grid gap-6">

            {/* ── ROW 1: Name + Email ────────────────────────────────────── */}
            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Name" htmlFor={`${id}-name`} error={errors.name} required>
                <Input
                  id={`${id}-name`}
                  type="text"
                  placeholder="Jane Smith"
                  value={fields.name}
                  onChange={(e) => set("name", e.target.value)}
                  onBlur={() => touch("name")}
                  className={cn("h-11", errors.name && "border-destructive focus-visible:ring-destructive")}
                />
              </Field>

              <Field label="Email" htmlFor={`${id}-email`} error={errors.email} required>
                <Input
                  id={`${id}-email`}
                  type="email"
                  placeholder="jane@company.com"
                  value={fields.email}
                  onChange={(e) => set("email", e.target.value)}
                  onBlur={() => touch("email")}
                  className={cn("h-11", errors.email && "border-destructive focus-visible:ring-destructive")}
                />
              </Field>
            </div>

            {/* ── ROW 2: Company + Industry ──────────────────────────────── */}
            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Company" htmlFor={`${id}-company`} error={errors.company} required>
                <Input
                  id={`${id}-company`}
                  type="text"
                  placeholder="Acme Inc."
                  value={fields.company}
                  onChange={(e) => set("company", e.target.value)}
                  onBlur={() => touch("company")}
                  className={cn("h-11", errors.company && "border-destructive focus-visible:ring-destructive")}
                />
              </Field>

              <Field label="Industry" htmlFor={`${id}-industry`} error={errors.industry} required>
                <Select
                  value={fields.industry}
                  onValueChange={(v) => {
                    set("industry", v);
                    touch("industry");
                    // Clear the "Other" text when switching away from it
                    if (v !== "Other") set("industryOther", "");
                  }}
                >
                  <SelectTrigger
                    id={`${id}-industry`}
                    className={cn("h-11", errors.industry && "border-destructive focus:ring-destructive")}
                    onBlur={() => touch("industry")}
                  >
                    <SelectValue placeholder="Select an industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRY_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            {/* ── Industry "Other" reveal ────────────────────────────────── */}
            {fields.industry === "Other" && (
              <Field
                label="Please specify your industry"
                htmlFor={`${id}-industry-other`}
                error={errors.industryOther}
                required
              >
                <Input
                  id={`${id}-industry-other`}
                  type="text"
                  placeholder="e.g. Non-profit, Government, Education…"
                  value={fields.industryOther}
                  onChange={(e) => set("industryOther", e.target.value)}
                  onBlur={() => touch("industryOther")}
                  className={cn("h-11", errors.industryOther && "border-destructive focus-visible:ring-destructive")}
                />
              </Field>
            )}

            {/* ── FIELD 5: Problem in operations ────────────────────────── */}
            <Field
              label="Problem in operations"
              htmlFor={`${id}-problem`}
              error={errors.problemInOperations}
              required
              hint="Describe the specific bottlenecks, manual work, or breakdowns affecting your business today."
            >
              <Textarea
                id={`${id}-problem`}
                placeholder="e.g. Our sales team manually copies leads from our web form into HubSpot and sends follow-up emails by hand — it takes 2 hours a day and leads fall through the cracks over weekends."
                value={fields.problemInOperations}
                onChange={(e) => set("problemInOperations", e.target.value)}
                onBlur={() => touch("problemInOperations")}
                className={cn(
                  "min-h-[140px] resize-y",
                  errors.problemInOperations && "border-destructive focus-visible:ring-destructive",
                )}
              />
            </Field>

            {/* ── ROW 4: Tech stack + Timeline ──────────────────────────── */}
            <div className="grid gap-6 sm:grid-cols-2">
              <Field
                label="Tech stack"
                htmlFor={`${id}-tech`}
                error={errors.techStack}
                required
                hint="Tools, platforms, and software your business currently uses."
              >
                <Input
                  id={`${id}-tech`}
                  type="text"
                  placeholder="e.g. HubSpot, Stripe, Google Sheets, Slack, custom React app"
                  value={fields.techStack}
                  onChange={(e) => set("techStack", e.target.value)}
                  onBlur={() => touch("techStack")}
                  className={cn("h-11", errors.techStack && "border-destructive focus-visible:ring-destructive")}
                />
              </Field>

              <Field label="Timeline" htmlFor={`${id}-timeline`} error={errors.timeline} required>
                <Select
                  value={fields.timeline}
                  onValueChange={(v) => {
                    set("timeline", v);
                    touch("timeline");
                  }}
                >
                  <SelectTrigger
                    id={`${id}-timeline`}
                    className={cn("h-11", errors.timeline && "border-destructive focus:ring-destructive")}
                    onBlur={() => touch("timeline")}
                  >
                    <SelectValue placeholder="When do you need this?" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIMELINE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            {/* ── FIELD 8: Budget range ─────────────────────────────────── */}
            <Field label="Budget range" htmlFor={`${id}-budget`} error={errors.budgetRange} required>
              <Select
                value={fields.budgetRange}
                onValueChange={(v) => {
                  set("budgetRange", v);
                  touch("budgetRange");
                }}
              >
                <SelectTrigger
                  id={`${id}-budget`}
                  className={cn("h-11", errors.budgetRange && "border-destructive focus:ring-destructive")}
                  onBlur={() => touch("budgetRange")}
                >
                  <SelectValue placeholder="What budget are you working with?" />
                </SelectTrigger>
                <SelectContent>
                  {BUDGET_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            {/* ── FIELD 9: Goals & desired outcomes ─────────────────────── */}
            <Field
              label="Goals & desired outcomes"
              htmlFor={`${id}-goals`}
              error={errors.goalsAndOutcomes}
              required
              hint="What does success look like 90 days after we deliver this system?"
            >
              <Textarea
                id={`${id}-goals`}
                placeholder="e.g. New leads auto-enrolled in a follow-up sequence the moment they submit. Sales team only touches qualified leads. Zero manual data entry between our form and HubSpot."
                value={fields.goalsAndOutcomes}
                onChange={(e) => set("goalsAndOutcomes", e.target.value)}
                onBlur={() => touch("goalsAndOutcomes")}
                className={cn(
                  "min-h-[120px] resize-y",
                  errors.goalsAndOutcomes && "border-destructive focus-visible:ring-destructive",
                )}
              />
            </Field>

            {/* ── FIELD 10: Consent ─────────────────────────────────────── */}
            {/* JUDGMENT CALL — Consent label text:
                Spec requires "two-party recording disclosure for discovery calls."
                The phrasing below covers the core disclosure obligations for US
                two-party consent states (CA, IL, etc.): notice of recording and
                acknowledgment. Review with legal counsel before production — this
                is not legal advice and the exact wording may need to vary by
                jurisdiction. */}
            <div className="rounded-xl border border-border/60 bg-secondary/20 p-5">
              <div className="flex items-start gap-3">
                <Checkbox
                  id={`${id}-consent`}
                  checked={fields.consent}
                  onCheckedChange={(v) => set("consent", Boolean(v))}
                  className="mt-0.5 shrink-0"
                />
                <Label
                  htmlFor={`${id}-consent`}
                  className="cursor-pointer text-sm leading-relaxed text-muted-foreground"
                >
                  I consent to being contacted by NogalSolutions regarding my submission.
                  I understand that discovery calls may be recorded for quality and
                  documentation purposes, and I acknowledge this recording notice as
                  required under applicable two-party consent laws.
                </Label>
              </div>
            </div>

            {/* ── SUBMIT ────────────────────────────────────────────────── */}
            <div className="flex flex-col items-end gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted-foreground">
                All fields are required.{" "}
                {!fields.consent && (
                  <span className="text-primary">Check the consent box to enable submit.</span>
                )}
              </p>
              <button
                type="submit"
                disabled={!canSubmit}
                className={cn(
                  "group inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-base font-medium text-primary-foreground shadow-elegant transition-all",
                  canSubmit
                    ? "hover:translate-y-[-1px] hover:bg-primary/90 hover:shadow-glow"
                    : "cursor-not-allowed opacity-40",
                )}
              >
                Submit
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>

          </div>
        </div>
      </form>
    </Section>
  );
}

// ─── FIELD WRAPPER ────────────────────────────────────────────────────────────

function Field({
  label,
  htmlFor,
  error,
  hint,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
        {required && (
          <span className="ml-1 text-primary" aria-hidden="true">
            *
          </span>
        )}
      </Label>
      {/* JUDGMENT CALL — hint prop: not in spec, added for UX clarity on fields
          where the expected input format is non-obvious (problem description,
          tech stack). Renders below the label and above the input. Remove if
          the design review deems it visually cluttered. */}
      {hint && <p className="text-xs leading-relaxed text-muted-foreground">{hint}</p>}
      {children}
      {error && (
        <p className="text-xs font-medium text-destructive">{error}</p>
      )}
    </div>
  );
}
