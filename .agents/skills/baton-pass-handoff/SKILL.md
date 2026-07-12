---
name: baton-pass-handoff
description: Use when starting or resuming a Codex session (verify current-state.md/next-task.md against live repo state), pausing work without transferring ownership (save state), or handing off to another agent due to low tokens or session end (baton pass). Trigger words: save state, handoff, hand off, baton pass, resume, pick up where left off, pause work, foresight, check current state.
---

# Baton Pass Handoff (Codex equivalent of Claude Code's baton-pass slash commands)

This project uses the baton-pass convention for handoff between Claude
Code CLI and Codex. Codex has no native slash-command equivalent for
Claude's `/foresight`, `/save-state`, `/baton-pass` — this skill performs
the same moves, invoked by task match or by name (`$baton-pass-handoff`).

Read `baton-pass.config.json` first for exact file paths before any move.

## Foresight — verify alignment before touching anything
Use when starting a session, resuming, or receiving a handoff.
1. Check: current goal (docs/next-task.md Turn State + task description),
   `git status`, `git log --oneline -5`, docs/current-state.md,
   docs/next-task.md, latest entry in docs/progress.md.
2. Decide: aligned (state so, continue) or misaligned (correct
   docs/current-state.md and docs/next-task.md first — using direct
   verification via n8n-mcp/Supabase MCP, not assumption — then continue).
3. Do not turn this into a full repo audit — check only what's needed to
   act safely.

## Save-state — pause without transferring ownership
Use before a break, not before switching agents.
1. Append to docs/progress.md: current task, stopped at, files touched,
   next immediate action, blocker/risk if any. Delta only — don't restate
   project history.
2. Update docs/next-task.md Turn State block: State: paused, Last Move:
   save-state, Last Agent: codex, Next Agent: codex, Updated At: today.
3. Mirror the same into baton-pass.state.json.

## Baton-pass — transfer ownership (e.g. low tokens, switching to Claude)
1. Commit staged work first. If you can't, say so explicitly in the baton
   — never hand off a dirty tree silently.
2. Append to docs/progress.md: goal, done (this session), files touched,
   verified (exact vocabulary only: `passed` / `passed outside sandbox` /
   `not run — [reason]` / `expected to pass, unverified` — never round up),
   next immediate action, risks, next agent.
3. Update docs/next-task.md Turn State: State: handed-off, Last Move:
   baton-pass, Last Agent: codex, Next Agent: claude (or as specified),
   Updated At: today. Mirror into baton-pass.state.json.

Never restate full project history in any of these moves — write only
the delta needed for the next agent (or your future self) to resume
safely.