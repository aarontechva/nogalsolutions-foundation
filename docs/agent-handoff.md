
# Agent Handoff

Purpose: this is the live operating document for round-robin work in this repo.

## Core Dependencies

This repo uses:
- `current-state`
- `next-task`
- `progress`
- this handoff doc

The exact paths should be tracked in `baton-pass.config.json`.

## Resume Order

1. Read the latest user request.
2. Read `current-state`.
3. Read `next-task`.
4. Read the latest `progress` entries.
5. Check `git status` and recent commits.
6. Open the files named in `next-task`.
7. Only then begin work.

## Source Of Truth

Resolve conflicts in this order:
1. current user request
2. current code
3. git history and working tree
4. `current-state`
5. `next-task`
6. `progress`
7. older planning docs

## Handoff Rule

Every meaningful `baton-pass` should:
- leave one clear next task
- record honest verification
- note current risks
- commit or document why not before transferring

Include a `dragon-dance` entry only if a real workflow lesson appeared during the session.
Do not add one by reflex.

## Repo-Specific Rules

Add your project-specific rules below:

- Every `current-state.md` edit must rewrite the top summary block (`Current Phase`/`In Progress`/`Next`/`Blockers`/`Last Verified Against`) to match the latest `Complete` entry — don't just append to `Complete` and leave the top stale. (Hindsight 018, `docs/progress.md`)
- Every `progress.md` entry uses the next unused sequential number, even when documenting content that logically happened earlier than the latest entry — say so in the entry body instead of reusing or reordering a number. (Hindsight 018, `docs/progress.md`)
- When Aaron accepts a new canonical Spec version, update every source-of-truth filename reference in the same repository change — not only the "Current locked version" summary. (Hindsight 026, `docs/progress.md`)
- Every n8n workflow built for this project must include sticky notes grouping its nodes into logical phases, each with a short plain-language description of what that phase does — written for a business owner or general reader, not a technical audience (no node names, no jargon like "IF node" or "validate schema"). Add these as part of the build itself, not as an afterthought requested later. Example/precedent: Workflow 6 (`U9PMTkuLSpiBziI4`), 6 phase notes added, see `docs/progress.md` for the exact wording used. Established 2026-07-14; on the same day Aaron asked for it to be retrofitted onto all pre-existing workflows too (BW1–5, sub-workflow, infra) — see the color-coding rule below for the retrofit's color scheme.
- **Sticky note color scheme (semantic, by phase category — not per-workflow-numbered)**, confirmed against actual n8n rendering (the `color` field on `n8n-nodes-base.stickyNote` accepts a plain hex string directly, e.g. `"color": "#9E6161"` — not just the 7 numbered presets). Apply the category that matches what the phase *does*, regardless of which workflow it's in:
  - Trigger / Intake (webhook, schedule, DB trigger receiving the initial signal) → `#8A8A85` (muted grey)
  - Data Fetch / Gather Context (reading Supabase/HubSpot data needed before the main work) → `#61829E` (muted blue)
  - Core Processing (the main transformation — AI call, business rule evaluation, the "smart" work) → `#82619E` (muted purple)
  - Error / Failure / Alert (retry logic, hard-fail, Slack alerts) → `#9E6161` (muted dusty red — Aaron's own confirmed pick, mirrors "error text is red")
  - Save / Success / Completion (writing final results, happy-path completion) → `#619E74` (muted green)
  - External Sync / Push (HubSpot writes, CRM sync, success notifications) → `#9E8261` (muted amber)
  All six are deliberately muted/desaturated, not bright — Aaron explicitly asked for "pale minimalist," not strong/saturated colors.
