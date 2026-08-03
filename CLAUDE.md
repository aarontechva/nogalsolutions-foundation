# NogalSolutions — Project Context

**Read this file first, every session.** Then read the spec for whichever project you are working in (§A or §B below), plus `docs/current-state.md` and `docs/next-task.md`, before doing any implementation work.

## This repository holds two projects

They share an n8n instance, a Slack workspace, a git repository, and this file. They do not share data, risk profile, or governance. Knowing which one you are in is the first thing to establish, because the applicable spec, gates, and versioning rules differ.

| | **A. Consultant Engagement Pipeline (CEP)** | **B. Showcase Systems** |
|---|---|---|
| What it is | Aaron's live business operations, intake through kickoff | Portfolio demos built to show prospective clients |
| Spec | `docs/spec.md` (mirror of a docx, see §A) | `docs/showcase-spec.md` (markdown is canonical) |
| Data | Real prospects, real money, `nogalsolutions-prod` | Fictional businesses, synthetic data, a separate Supabase project |
| Workflows | 23, prefixed `NogalSolutions-BW*` and friends | 3, prefixed `NogalSolutions-Util*` |
| Hard gate sits on | Building and writing (version bump before implementation) | **Publishing** (see `docs/showcase-spec.md` §8) |

If a task does not obviously belong to one, ask rather than assuming. A change made under the wrong project's rules is the failure mode this split exists to prevent.

## Project status lives in `docs/current-state.md`, not here

**This file does not track build status.** That previously caused a real bug: a section here once asserted "Workflow 2 not yet implemented" long after Workflows 2, 3, 4, and the R2 backup workflow were built, tested, and activated, because prose status in a rarely-edited file does not update itself.

- Before starting any task, read `docs/current-state.md` and `docs/next-task.md` for what is actually built and what is next.
- **Those files are only trustworthy if written from direct verification**: live n8n state via the `n8n-mcp` connection, live Supabase state via the Supabase MCP connection. Not from memory, not from this file, not from a prior session's summary taken at face value.
- If `docs/current-state.md` looks stale, empty, or contradicts what you find when verifying directly, trust direct verification over any written document, including this one, and flag the discrepancy to Aaron rather than silently proceeding on either version.
- When you update `docs/current-state.md`, verify live state first. A status file populated from assumption is worse than an empty one: it looks authoritative without being true.

**Known recurring failure, watch for it.** `docs/current-state.md` has gone stale nine times. Two distinct mechanisms: a session ending before a terminal move could run (powered-off machine, usage-limit cutoff), and a terminal move running but skipping this one file while correctly updating the others. If you are running `save-state` or `baton-pass`, updating `docs/current-state.md` is part of the move, not an optional extra.

## Before doing any implementation work

Do not trust a written status claim (in this file, in either spec, in `docs/current-state.md`, in a task prompt, or from prior conversation) about what is "already built" or "already verified" without checking the live system.

- Check Supabase directly (tables, RLS policies, extensions, triggers, row counts) rather than assuming a documented schema is applied.
- Check n8n directly (`n8n_list_workflows` or equivalent) rather than assuming a documented workflow exists.
- If live state and documented state disagree, report the disagreement clearly and stop. Do not silently build on an unverified assumption, and do not silently "fix" the mismatch by guessing which side is right.

## Standing guardrails (evergreen, keep these regardless of what is current)

- **`anon` role on `public.intake_submissions` should hold exactly `INSERT`, nothing else.** This required two historical fixes: a missing base `GRANT INSERT` (an RLS policy alone is not sufficient, a base grant is a separate required layer in Postgres), and an unrelated over-grant of `TRUNCATE`/`REFERENCES`/`TRIGGER` to `anon`/`authenticated` across nearly every table in `public`. Both were revoked.
- **If `TRUNCATE`, `REFERENCES`, or `TRIGGER` ever reappear on `anon` or `authenticated` for any table, stop and investigate the cause before re-revoking.** `pg_default_acl` was confirmed empty for these roles on `public`, so nothing should be silently re-granting them. A reappearance means something new happened (a table drop and recreate, a migration with a broad `GRANT ALL`), not a recurrence of the same untouched bug.
- **Verification pattern for confirming a workflow actually works end to end** (not just "it exists" or "it is active"): trace the real chain, meaning trigger event, then database row, then n8n execution log, then downstream delivery (email, CRM, and so on), then confirmed receipt at the final destination, independently, never inferred from an earlier step succeeding.
- **Validation is not verification.** `n8n_validate_workflow` returning 0 errors is a precondition for testing, never a substitute for it. It cannot see database schemas, live credentials, or runtime node-type availability.
- **No em dashes in systems design and implementation content** (specs, n8n sticky notes and node descriptions, code comments, technical write-ups, website copy describing how the system works). Use a comma, a colon, parentheses, or a separate sentence. Applies going forward; existing content is not retroactively rewritten for this alone.
- **No n8n workflow activation without Aaron's node-by-node review.** Applies to both projects (CEP Spec §10.2 Option A; `docs/showcase-spec.md` §9).

## Production database writes: hard gate, no exceptions

This Supabase MCP connection is scoped to `nogalsolutions-prod` directly (not a branch), with write access enabled (`--features=database,docs`, no `--read-only`). `execute_sql` and `apply_migration` are live production actions the moment they are called. There is no branch or staging layer between you and the real database.

Before calling `apply_migration` (schema or DDL changes) or `execute_sql` where the query is anything other than a `SELECT` (any `INSERT`, `UPDATE`, `DELETE`, `GRANT`, `REVOKE`, `CREATE`, `ALTER`, `DROP`, or similar):

1. **Stop. Do not call the tool yet.**
2. Present the exact SQL you intend to run, verbatim, to Aaron.
3. State plainly what it will change and why (which tables, rows, or grants are affected, and what happens if it is wrong).
4. Wait for explicit go-ahead in the conversation. Not an inferred "this seems fine," not proceeding because the task implies it is needed. An explicit yes, every time.
5. Only then call the tool.

This applies **every time**, not just the first time in a session. A prior approval for one migration does not authorize the next.

Read-only queries (`SELECT`, `list_tables`, schema inspection, log retrieval) do not require this gate. Verify freely, that is the whole point of having direct Supabase access.

**Scope note.** This gate covers `nogalsolutions-prod`. The separate Supabase project used for showcase demo data (Aaron's own account, credential `Supabase Mock-HVAC`) holds only synthetic data and is not covered.

## HubSpot configuration changes: hard gate, no exceptions

Any tool call that creates, modifies, or deletes a custom object definition, a custom property, a pipeline or stage definition, an association, or a workflow/automation inside HubSpot is a live production change the moment it is called. HubSpot has no branch or draft state for this the way n8n workflows can be built inactive and reviewed node by node first.

Before calling any such tool:

1. **Stop. Do not call the tool yet.**
2. Present the exact change you intend to make, verbatim: object or property name, type, and any options.
3. State plainly what it will affect and why (which existing workflows or Gate #1/#2 field mappings depend on this exact name matching, and what breaks if it is wrong).
4. Wait for explicit go-ahead in the conversation. An explicit yes, every time.
5. Only then call the tool.

This applies **every time**. A prior approval for one property does not authorize the next.

Read-only operations (listing existing properties or objects, fetching records, searching) do not require this gate.

This gate covers structural and config changes to HubSpot itself, its schema in effect. It does **not** re-gate the routine Contact, Deal, and custom-object *record* writes that n8n workflows already make as part of their normal reviewed behavior (CEP Spec §8.1). Those went through workflow-activation review already. The line is: schema-level changes made directly by an AI session with live MCP access need per-call sign-off; record writes made by an already-reviewed, already-active workflow at runtime do not.

---

# A. Consultant Engagement Pipeline (CEP)

AI-augmented consulting ops pipeline. Frontend on Cloudflare Pages, backend on Supabase, automation on self-hosted n8n (Hostinger VPS), email via Resend. Nothing gets built that is not in the Spec first.

## A.1 Source of truth

- **The canonical documents are `NogalSolutions_Spec_V2_19.docx` and `NogalSolutions_Roadmap_V2_4.docx`**, maintained and version-locked outside this repo (Aaron reviews and accepts changes directly in Word, tracked changes on).
- `docs/spec.md` and `docs/roadmap.md` are **generated mirrors**, kept here only so text-reading tools can see them. They are not independently authoritative.
- **Do not hand-edit `docs/spec.md` or `docs/roadmap.md`.** If something looks wrong, outdated, or contradicts the live system, say so explicitly and stop. Do not silently patch the mirror. Real spec changes happen in the docx, reviewed by Aaron, then re-exported.
- If the mirrors go stale relative to the current docx, that is a bug to flag, not something to guess past.
- **This applies to version references anywhere in this repo, including in this file.** A filename or version number that has not been updated since the referenced thing changed is a bug. If you notice one, flag it and fix it. (This exact bug was found again on 2026-08-03: this file had named `V2_15` as canonical since the v2.16 bump.)

## A.2 Versioning discipline

Any deviation from `docs/spec.md` (schema, workflow behavior, architecture decisions) requires a version bump on the Spec **before** implementation, not after. If a task seems to require deviating, flag it and stop rather than implementing and noting it afterward.

## A.3 Current locked version

**Spec v2.19 / Roadmap v2.4**, Spec last bumped 2026-07-25. **Verify this against `docs/spec.md`'s own header before trusting it.**

Sections present, and what each governs:

| Section | Covers | Binding warning |
|---|---|---|
| §3.4a | Privilege Verification Checklist | |
| §4.1a | Workflow 2 architecture | **Any returning submission always fails Rule 3 by definition. Safe only while `QUALIFICATION_THRESHOLD` stays at 6, not 7.** |
| §7a | Workflows 3 and 4 shared sub-workflow architecture | Workflow 4 resolves a HubSpot **Contact only, no Deal** |
| §7b | Workflows 5 to 8 architecture; Workflow 5's Database Webhook trigger and `transcription_status = 'failed'`; Workflow 7's delete-and-restart idempotency; Workflow 8's multi-select scope; Gate #1/#2 field mappings; pre-send correction versioning (Option B) | §7b.1's OpenAI/Whisper choice is **superseded by §7c** |
| §7c | AI provider migration to OpenRouter. `OPENROUTER_API_KEY` replaces `ANTHROPIC_API_KEY`/`OPENAI_API_KEY`; new `TRANSCRIPTION_MODEL` | Supersedes §7b.1 and the Prompt Library's implied direct-Anthropic assumption |
| §7d | Presentation and Send Flow: shared PDF renderer, Workflow 9 (auto-present on Gate #2 approval), Workflow 10 (send and close). Brings §7's workflow count to 10 | v2.12 corrected Decision 3 to add the Deal-stage write (`dealstage = contractsent`). Deal won/lost stays Aaron's manual call |
| §7e | Deal-Stage Progression: three writes via the shared "Advance Deal Stage" sub-workflow (WF5 to "discovery completed", WF6's Gate #1 Task to "analysis pending", WF7's Gate #2 Task to "deliverables pending") | Label-match pattern, **not hardcoded stage IDs** |
| §7f | Discovery Recording Dropzone: creates `discovery-recordings/{prospect_id}/` via the Storage API | Use `prospects.id`, **never** `intake_submissions.id`. Confusing them caused two real WF5 failures |
| §7g | Outbound Discovery Bootstrap: a second entry route for directly sourced prospects. Adds the `intake_source` enum and `intake_submissions.source` column | Deterministic identity creation, **no AI Agent** |
| §7h | Inbound Discovery Prep: a Workflow 3 branch running the Job Post Analyzer pattern against qualified leads, posting to `#discovery-prep` | Fires only once a prospect is **qualified**, not on raw intake |
| §7i | Deposit-Gated Closed-Won and Onboarding Kickoff. `awaiting deposit` stage; Workflow 9 syncs Deal `amount` with a manual-override lock; human-confirmed deposit via two HubSpot Deal properties | v2.18 **dropped automatic payment-processor detection** (Stripe and Wise both unavailable for Philippines-based accounts). No payment API call exists in this design. Chargeback watching is Aaron's manual responsibility |
| §7j | Kickoff Prep: drafts a kickoff-call agenda off Send Onboarding Kit's success path, posts to `#pipeline-activity` | Review-only. No AI-run or client-facing send |

**Before touching any of these, read the relevant section first:** `QUALIFICATION_THRESHOLD` (§4.1a), Workflow 4's HubSpot behavior (§7a), Workflow 5 or 6 to 8 (§7c before §7b), the shared renderer or Workflows 9 to 10 (§7d), the Deal-stage-advance branches on 5/6/7 (§7e), Workflow 3 or the dropzone (§7f), Outbound Discovery Bootstrap (§7g), Workflow 3's discovery-prep branch or Job Post Analyzer (§7h), the deposit and closed-won automation (§7i), Kickoff Prep or Send Onboarding Kit chaining (§7j).

The `ALTER TYPE transcription_status ADD VALUE 'failed'` migration required by §7b.1 was applied 2026-07-13.

## A.4 Prompt Library

**Prompt Library v1** (`docs/prompt-library.md`, canonical `NogalSolutions_Prompt_Library_V1.docx` maintained outside the repo like the Spec) is accepted and canonical as of 2026-07-12. It owns the system-prompt text and JSON schemas for Prompt A and B1 to B7. Spec §6 delegates this deliberately, because prompt wording iterates independently of the Spec's version number. Workflows 6, 7, and 8 are built against it, never improvised.

---

# B. Showcase Systems

Standalone n8n workflows built to demonstrate capability to prospective clients, plus the public website pages that present them. Fictional businesses, synthetic data, no real customers.

## B.1 Source of truth

**`docs/showcase-spec.md` is canonical.** Markdown-native, versioned through git, no docx original. Edit it directly; that is the intended workflow, unlike the CEP mirrors.

## B.2 Current locked version

**Showcase Spec v1.0**, 2026-08-03. **DRAFT, awaiting Aaron's acceptance.**

## B.3 The things most likely to bite you

Read `docs/showcase-spec.md` in full before building. These four are the ones that have already cost real time:

- **§3.1 Genuine tool-calling does not work on this n8n instance.** Every route has been tried and failed: `googleSheetsTool` (GitHub #20752, closed "not planned"), `toolHttpRequest` (`supplyData`/`execute` error, survived a 2.26.7 to 2.32.7 upgrade), `toolCode` (same family), `httpRequestTool` (reintroduces #20752). Use context injection: pre-fetch with plain `httpRequest`, render into the prompt, use an LLM Chain. A system built this way is **not agentic** and must not be described as such.
- **§3.3 No dead-end config nodes.** A node with no outgoing `main` connection, referenced only via `$('NodeName')`, is not guaranteed to execute. Force ordering with a Merge node.
- **§4.2 Every AI-generated customer-facing send needs a validity gate**, not just `onError`. Adding `onError` alone converts "hard crash, nothing sent" into "blank email sent to a real customer."
- **§8 Publication is the hard gate.** Building is light; publishing is irreversible. Privacy review of every image (read them, do not trust a recorded count), solid bars not blur, every published number traceable, explicit fictional-business framing, and Aaron's explicit go-ahead before any commit or push of website changes.
