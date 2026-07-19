# NogalSolutions — Project Context

**Read this file first, every session. Then read `docs/spec.md` and `docs/roadmap.md` in full before doing any implementation work.**

## What this project is

AI-augmented consulting ops pipeline. Frontend on Cloudflare Pages, backend on Supabase, automation on self-hosted n8n (Hostinger VPS), email via Resend. Full architecture, schema, and workflow design lives in `docs/spec.md` — nothing gets built that isn't in that document first.

## Source of truth — read this carefully

- **The canonical documents are `NogalSolutions_Spec_V2_10.docx` and `NogalSolutions_Roadmap_V2_4.docx`**, maintained and version-locked outside this repo (Aaron reviews and accepts changes to them directly in Word, tracked-changes on).
- `docs/spec.md` and `docs/roadmap.md` in this repo are **generated mirrors** of those docx files, kept here only so Claude Code CLI (and anything else that reads plain text) can actually see them. They are not independently authoritative.
- **Do not hand-edit `docs/spec.md` or `docs/roadmap.md`.** If something in them looks wrong, outdated, or contradicts what you find in the live system, say so explicitly and stop — don't silently patch the mirror. Any real spec change happens in the docx, reviewed by Aaron, then re-exported to these mirrors.
- If `docs/spec.md` and `docs/roadmap.md` ever go stale relative to the current docx version, that's a bug to flag, not something to guess past.
- **This applies to version references anywhere in this repo, including in this file.** A filename or version number that hasn't been updated since the referenced thing changed is the same category of bug as a stale status claim below — if you notice one, flag it and fix it, don't assume it's still accurate because it's written down.

## Project status lives in `docs/current-state.md`, not here

**This file does not track current build status.** That previously caused a real bug: this section once asserted "Workflow 2 not yet implemented" long after Workflows 2, 3, 4, and the R2 backup workflow were built, tested, and activated — because prose status in a rarely-edited file doesn't update itself, and nobody remembered to.

Instead:

- Before starting any task, read `docs/current-state.md` and `docs/next-task.md` (baton-pass convention) for what's actually built and what's next.
- **Those files are only trustworthy if they were written from direct verification** — live n8n state via the `n8n-mcp` connection, live Supabase state via the Supabase MCP connection — not from memory, not from this file, not from a prior session's summary taken at face value.
- If `docs/current-state.md` looks stale, empty, or contradicts what you find when verifying directly, trust direct verification over any written document — including this one — and flag the discrepancy to Aaron rather than silently proceeding on either version.
- When you do update `docs/current-state.md` (via `/save-state` or otherwise), verify live state first. A status file populated from assumption is worse than an empty one — it looks authoritative without being true.

## Before doing any implementation work

Don't trust a written status claim (in this file, in the spec, in `docs/current-state.md`, in a task prompt, or from prior conversation) about what's "already built" or "already verified" without checking the live system. Concretely, before starting any task that depends on existing infrastructure:

- Check Supabase directly (tables, RLS policies, extensions, triggers, row counts) rather than assuming the schema in `docs/spec.md` §3.2 is already applied.
- Check n8n directly (`List Workflows` or equivalent) rather than assuming a workflow described in `docs/spec.md` §7 already exists.
- If live state and documented state disagree, report the disagreement clearly and stop — don't silently build on top of an unverified assumption, and don't silently "fix" the mismatch by guessing which one is right.

## Versioning discipline

Per the Spec's own rule: any deviation from what's documented in `docs/spec.md` (schema, workflow behavior, architecture decisions) requires a version bump on the Spec *before* implementation, not after. If a task seems to require deviating from the spec, flag it and stop rather than implementing the deviation and noting it afterward.

## Standing guardrails (evergreen — not time-bound status, keep these regardless of what's current)

- **`anon` role on `public.intake_submissions` should hold exactly `INSERT`, nothing else.** This required two fixes historically: a missing base `GRANT INSERT` (an RLS policy alone isn't sufficient — a base grant is a separate required layer in Postgres), and an unrelated over-grant of `TRUNCATE`/`REFERENCES`/`TRIGGER` to `anon`/`authenticated` across nearly every table in `public`. Both were revoked.
- **If `TRUNCATE`, `REFERENCES`, or `TRIGGER` ever reappear on `anon` or `authenticated` for any table, stop and investigate the cause before just re-revoking.** `pg_default_acl` was confirmed empty for these roles on `public`, meaning nothing should be silently re-granting these. A reappearance means something new happened (table drop/recreate, a migration with a broad `GRANT ALL`) — not a recurrence of the same untouched bug.
- **Verification pattern to follow when confirming a workflow actually works end-to-end** (not just "it exists" or "it's active"): trace the real chain — trigger event → database row → n8n execution log → downstream delivery (email/CRM/etc.) → confirm receipt at the final destination, independently, not inferred from an earlier step succeeding.

## Production database writes — hard gate, no exceptions

This Supabase MCP connection is scoped to `nogalsolutions-prod` directly
(not a branch), with write access enabled (`--features=database,docs`,
no `--read-only`). That means `execute_sql` and `apply_migration` are
live production actions the moment they're called — there is no
branch or staging layer between you and the real database.

Before calling `apply_migration` (schema/DDL changes) or `execute_sql`
where the query is anything other than a `SELECT` (any `INSERT`,
`UPDATE`, `DELETE`, `GRANT`, `REVOKE`, `CREATE`, `ALTER`, `DROP`, or
similar):

1. **Stop. Do not call the tool yet.**
2. Present the exact SQL you intend to run, verbatim, to Aaron.
3. State plainly what it will change and why (which tables/rows/grants
   are affected, and what happens if it's wrong).
4. Wait for explicit go-ahead in the conversation — not an inferred
   "this seems fine," not proceeding because the task implies it's
   needed. An explicit yes, every time.
5. Only then call the tool.

This applies **every time**, not just the first time in a session. A
prior approval for one migration does not authorize the next one. This
is the same gate shape as "no n8n workflow activation without Aaron's
node-by-node review" (Spec §10.2 Option A) — just applied one layer
earlier, at the database, since there is no activation step to gate
here the way there is for workflows.

Read-only queries (`SELECT`, `list_tables`, schema inspection, log
retrieval) do not require this gate — verify freely, that's the whole
point of having direct Supabase access at all.

## HubSpot configuration changes — hard gate, no exceptions

Once a HubSpot MCP connection exists, any tool call that creates,
modifies, or deletes a custom object definition, a custom property, a
pipeline/stage definition, an association, or a workflow/automation
inside HubSpot is a live production change the moment it's called —
HubSpot has no branch or draft state for this the way n8n workflows can
be built inactive and reviewed node-by-node first.

Before calling any such tool (creating a custom object type,
adding/editing a property, defining a pipeline stage, creating a
HubSpot workflow/automation, or similar):

1. **Stop. Do not call the tool yet.**
2. Present the exact change you intend to make, verbatim — object or
   property name, type, and any options — to Aaron.
3. State plainly what it will affect and why (which existing workflows
   or Gate #1/#2 field mappings depend on this exact name matching, and
   what breaks if it's wrong).
4. Wait for explicit go-ahead in the conversation — not an inferred
   "this seems fine," not proceeding because the task implies it's
   needed. An explicit yes, every time.
5. Only then call the tool.

This applies **every time**, not just the first time in a session. A
prior approval for one property does not authorize the next one. Same
gate shape as the Supabase production-write gate above and "no n8n
workflow activation without Aaron's node-by-node review" (Spec §10.2
Option A) — applied at the third system in the stack with no staging
layer of its own.

Read-only operations (listing existing properties/objects, fetching
records, searching) do not require this gate — verify freely.

This gate covers structural/config changes to HubSpot itself — its
schema, in effect. It does **not** re-gate the routine Contact / Deal /
custom-object *record* writes n8n workflows already make as part of
their normal, reviewed behavior (Spec §8.1) — those went through
workflow-activation review already (§10.2) and don't need per-record
approval on top of it. The line is: schema-level changes made directly
by an AI session with live MCP access need per-call sign-off; record
writes made by an already-reviewed, already-active workflow at runtime
do not.

## Current locked version

Spec v2.13 / Roadmap v2.4, Spec last bumped 2026-07-19. Present in the spec: **§3.4a** (Privilege Verification Checklist), **§4.1a** (Workflow 2 architecture, including the Rule 3 cap warning — any returning submission always fails Rule 3 by definition; safe only while `QUALIFICATION_THRESHOLD` stays at 6, not 7), **§7a** (Workflows 3 & 4 shared sub-workflow architecture, including Workflow 4's Contact-only HubSpot resolution — no Deal), **§7b** (Workflows 5–8 architecture decisions: Workflow 5's Database Webhook trigger + `transcription_status = 'failed'` handling, Workflow 7's delete-and-restart idempotency, Workflow 8's HubSpot multi-select scope selection, and the Gate #1/#2 HubSpot field mappings — including the resolved pre-send correction versioning rule, Option B), **§7c** (AI Provider Migration — OpenRouter: Workflow 5's transcription moved to Whisper Large V3 via OpenRouter, Workflows 6–8's Claude calls moved to Anthropic-via-OpenRouter, `OPENROUTER_API_KEY` replaces `ANTHROPIC_API_KEY`/`OPENAI_API_KEY`, new `TRANSCRIPTION_MODEL` env var — accepted 2026-07-13; Workflows 5–8 are now built, tested, and active — see `docs/current-state.md` for verified build status, this file doesn't track that), **§7d** (Presentation & Send Flow — Architecture Decision Record: a shared branded PDF-rendering sub-workflow reused by two new workflows; Workflow 9 auto-renders and stores a combined PDF the instant all 7 deliverables are Gate #2-approved, covering both first presentation and every post-revision re-presentation with no separate manual trigger; Workflow 10 fires on a new `Ready to Send` property on Client Requirements, emails that same PDF, and advances the associated Deal to the sent stage (`dealstage = contractsent`) — bumps §7's workflow count to 10; accepted 2026-07-16, and the shared renderer plus Workflows 9–10 are now built, tested, and active — see `docs/current-state.md` for verified build status, this file doesn't track that). **v2.12 (2026-07-19) corrected §7d Decision 3**: a live-system audit (Hindsight 101, `docs/progress.md`) found that Workflow 10 had shipped and processed one real completed engagement without ever writing to the HubSpot Deal, despite "closes the deal" being claimed here and in §1.2's capability table since v2.11 — Decision 3 itself never specified that write. v2.12 added the actual Deal-stage write (`dealstage = contractsent`, not `closedwon`/`closedlost` — deal-won/lost stays Aaron's manual call) and corrected both descriptions to match; the Workflow 10 node change is now built, tested, and confirmed live (execution 414's real HubSpot response showed `dealstage: contractsent`) — see `docs/current-state.md`. **§7e added (v2.13, 2026-07-19): Deal-Stage Progression Automation.** Aaron noticed, while reviewing v2.12's fix, that the Deal never advanced through any intermediate pipeline stage either — it jumped straight from "qualified" (booking) to "sent" (send), skipping stages the portal's board already defines. §7e specifies three more Deal-stage writes (Workflow 5 succeeding → "discovery completed"; Workflow 6's Gate #1 Task → "analysis pending"; Workflow 7's Gate #2 Task → "deliverables pending"), via a new shared "Advance Deal Stage" sub-workflow (label-match pattern, not hardcoded stage IDs — reusing Workflow 3's own existing convention) — **not yet built as of this bump**; requires Aaron to first rename the live HubSpot stage currently labeled "discovery scheduled" to "discovery completed" (§7e's Required verification (3)). If you're touching `QUALIFICATION_THRESHOLD`, read the Rule 3 callout in §4.1a first. If you're touching Workflow 4's HubSpot behavior, read §7a first. If you're building or rebuilding Workflow 5 or Workflows 6–8, read §7c first — it supersedes §7b.1's OpenAI/Whisper choice and the Prompt Library's implied direct-Anthropic-API assumption. If you're touching the shared renderer, Workflow 9, or Workflow 10, read §7d first. If you're building the shared "Advance Deal Stage" sub-workflow or touching Workflows 5, 6, or 7 for the Deal-stage-progression follow-up, read §7e first. The `ALTER TYPE transcription_status ADD VALUE 'failed'` migration §7b.1 requires has been applied (2026-07-13). **Verify this version number against `docs/spec.md`'s own header before trusting it** — same discipline as everything else in this file.

A companion **Prompt Library v1** (`docs/prompt-library.md`, canonical `NogalSolutions_Prompt_Library_V1.docx` maintained outside the repo like the Spec) is now accepted and canonical as of 2026-07-12. It owns the actual system-prompt text and JSON schemas for Prompt A and B1–B7 (Spec §6 delegates this on purpose — prompt wording iterates independently of the Spec's version number). Workflows 6, 7, and 8 must be built against it, not improvised.
