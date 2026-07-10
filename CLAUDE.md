# NogalSolutions — Project Context

**Read this file first, every session. Then read `docs/spec.md` and `docs/roadmap.md` in full before doing any implementation work.**

## What this project is

AI-augmented consulting ops pipeline. Frontend on Cloudflare Pages, backend on Supabase, automation on self-hosted n8n (Hostinger VPS), email via Resend. Full architecture, schema, and workflow design lives in `docs/spec.md` — nothing gets built that isn't in that document first.

## Source of truth — read this carefully

- **The canonical documents are `NogalSolutions_Spec_V2_4.docx` and `NogalSolutions_Roadmap_V2_4.docx`**, maintained and version-locked outside this repo (Aaron reviews and accepts changes to them directly in Word, tracked-changes on).
- `docs/spec.md` and `docs/roadmap.md` in this repo are **generated mirrors** of those docx files, kept here only so Claude Code CLI (and anything else that reads plain text) can actually see them. They are not independently authoritative.
- **Do not hand-edit `docs/spec.md` or `docs/roadmap.md`.** If something in them looks wrong, outdated, or contradicts what you find in the live system, say so explicitly and stop — don't silently patch the mirror. Any real spec change happens in the docx, reviewed by Aaron, then re-exported to these mirrors.
- If `docs/spec.md` and `docs/roadmap.md` ever go stale relative to the current docx version, that's a bug to flag, not something to guess past.

## Before doing any implementation work

This repo has previously had its actual state misreported relative to what was believed to be true (a status note claimed infrastructure was "complete and verified" when the repo had no migration files, no n8n workflow exports, and no spec docs present at all). Some of that gap turned out to be explainable — infra built live in Supabase/n8n rather than committed as files — but it was not verified before being treated as fact.

**Because of that: don't trust a written status claim (in this file, in the spec, in a task prompt, or from prior conversation) about what's "already built" or "already verified" without checking the live system.** Concretely, before starting any task that depends on existing infrastructure:

- Check Supabase directly (tables, RLS policies, extensions, triggers, row counts) rather than assuming the schema in `docs/spec.md` §3.2 is already applied.
- Check n8n directly (`List Workflows` or equivalent) rather than assuming a workflow described in `docs/spec.md` §7 already exists.
- If live state and documented state disagree, report the disagreement clearly and stop — don't silently build on top of an unverified assumption, and don't silently "fix" the mismatch by guessing which one is right.

## Versioning discipline

Per the Spec's own rule: any deviation from what's documented in `docs/spec.md` (schema, workflow behavior, architecture decisions) requires a version bump on the Spec *before* implementation, not after. If a task seems to require deviating from the spec, flag it and stop rather than implementing the deviation and noting it afterward.

## Verified state (evidence-based, updated 2026-07-04 — not a status claim, an audit result)

- **Workflow 1 (Auto-Ack email): confirmed working end-to-end.** Live intake form submission → row landed in `intake_submissions` → `notify_n8n_intake_submission` trigger fired → n8n execution log shows success → Resend shows `Delivered` → email physically received. All four checkpoints verified independently on 2026-07-04.
- **`anon` role on `public.intake_submissions`: exactly `INSERT`, confirmed clean.** This required two fixes that weren't in the original schema: (1) `GRANT INSERT` was missing entirely — the RLS policy existed but a base grant is a separate, required layer in Postgres, so every real form submission was silently rejected before this fix; (2) `anon` (and `authenticated`) also held unintended `TRUNCATE`, `REFERENCES`, `TRIGGER` on nearly every table in `public` — a historical over-grant, not something either audit prompt caused. Both revoked and reverified 2026-07-04.
- **If you ever see `TRUNCATE`, `REFERENCES`, or `TRIGGER` granted to `anon` or `authenticated` on any table again — stop and investigate the cause before just re-revoking.** `pg_default_acl` was checked and confirmed empty for `anon`/`authenticated` on `public` as of this date, meaning there's no standing rule that should be re-granting these. A reappearance means something new happened (e.g., a table drop/recreate, a migration script with a broad `GRANT ALL`), not a recurrence of the same untouched bug.
- **Workflow 2 (Qualification Engine): not yet implemented.** Spec §4.1a is fully specified and was blocked only on Workflow 1's trigger existing for real — that condition is now met.

## Current locked version

Spec v2.8 / Roadmap v2.4, locked 2026-07-08. Most recent changes: **Workflow 4's HubSpot behavior resolved in §7a** (Contact-only upsert, no Deal — settles a real disagreement between §1.3 and §7's row 4 that §7a had previously sided with silently, without flagging it); **Rule 3 cap warning added to §4.1a** (any returning submission — nurture lead or past client — always fails Rule 3 by definition; safe only while `QUALIFICATION_THRESHOLD` stays at 6, not 7). Also present: **§3.4a** (Privilege Verification Checklist), **§4.1a** (Workflow 2 architecture), **§7a** (Workflows 3 & 4 shared sub-workflow architecture). If you're building Workflow 4, read §7a's Workflow 4 section first — it now specifies the Contact-only HubSpot push. If you're touching `QUALIFICATION_THRESHOLD`, read the Rule 3 callout in §4.1a first.
