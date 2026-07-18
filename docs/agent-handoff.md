
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
- **"Validates 0 errors" is never sufficient grounds to call an n8n workflow review-ready.** `n8n_validate_workflow` checks graph/connections/expression syntax only. Before a handoff claims a workflow is ready for Aaron's review, the Verified section must explicitly state that two further checks were done: (1) every node that writes to Supabase had its payload column list checked against the live table via information_schema (not the Spec's schema doc, not memory); (2) every node that calls an LLM had its prompt text and schemas checked verbatim against the canonical Prompt Library section it implements. A handoff that omits either check must say so as an open risk, not imply readiness. (Dragon-Dance 029, `docs/progress.md` — Workflow 7 shipped "0 errors" with DB writes that would 400 on first execution and fully improvised B1–B7 prompt content.)
- **A Risks/Blockers section that says "no new risks" must still explicitly re-list every inherited open risk it isn't acting on, or state how it was closed.** "None new" silently reads as "none open" to a future agent, and an inherited risk that just stops being mentioned looks resolved even when it isn't. Every `progress.md` Risks section and every `current-state.md` Blockers rewrite must carry forward each still-open inherited risk by name. (Hindsight 051, `docs/progress.md` — BW3's `$env.SLACK_WEBHOOK_URL` alert was flagged unconfirmed in Baton-Pass 020/023, then silently dropped from every later Risks/Blockers section with no resolution ever recorded.)
- **`current-state.md`'s `Current Phase`/`In Progress`/`Next`/`Blockers`/`Last Verified Against` sections are one atomic update, not five independent ones.** An edit that rewrites `Current Phase` without also rewriting `Next`/`Blockers`/`Last Verified Against` in the same edit is incomplete, not partial-credit — those two sections read as the authoritative summary to a fresh agent, so letting them go stale while `Current Phase` keeps getting refreshed reproduces exactly the drift Hindsight 018 already fixed once, just on the neighboring sections. (Hindsight 069, `docs/progress.md` — `Next`/`Blockers`/`Last Verified Against` were frozen at the Hindsight 026/Baton-Pass 024 era for ~2 days and 40+ entries, still describing Workflow 7 as pending review, while `Current Phase` had been kept current through Baton-Pass 062.)
