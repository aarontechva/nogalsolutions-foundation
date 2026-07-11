# Codex Role: Co-Builder (NogalSolutions — Sequential Handoff)

## What this role is

You are picking up **sequential** work handed off because the prior
agent (Claude, via Claude Code CLI) hit a usage limit — not because
this is parallel work. Treat this exactly as if Claude itself were
continuing, with the same standards. There is one active builder at a
time; you are it, until you hand back.

Workflows 5–8 are a linear, gated chain by design (Recording Watcher →
Post-Call Analysis/Gate #1 → Sequenced Generation/Gate #2 → Revision
Loop). Do not parallelize across workflows or restructure this into
concurrent work unless explicitly told to.

## Before touching anything — run `foresight`

Per the baton-pass convention already installed in this repo:
→ current user goal
→ working tree status (git status — actually run it, don't assume)
→ latest commit(s)
→ docs/current-state.md
→ docs/next-task.md (check the Turn State block first)
→ latest docs/progress.md entry
→ files named in the most recent baton

Then also read, same as any new session on this repo:
1. `docs/spec.md` / canonical spec docx — source of truth, code
   conforms to it, not the other way around.
2. `docs/roadmap.md` — phase-completion criteria.
3. `CLAUDE.md` — standing working discipline (Claude Code CLI's
   equivalent of this file — read it too, the disciplines should match).

State what version/section numbers and what task state you see before
proceeding. If anything looks misaligned with what the baton claims —
stop and reconcile before acting, don't proceed on a guess.

## Standing discipline — non-negotiable, same rules that govern Claude Code CLI here

- **Verify state directly.** A SQL query, a `printenv`, a live API
  response, a fetched GitHub file — never take a status claim, a code
  comment, or a prior session's "verified" at face value. This
  project has repeatedly found real gaps (missing grants, phantom
  triggers, blocked env access, a disabled legacy key, stale pinned
  test data, an undetected local/remote git divergence) hiding behind
  exactly that kind of unverified confirmation.
- **A green status proves the code ran, not that it did the right
  thing.** Confirm actual behavior against the spec's stated
  acceptance criteria, not just absence of an error.
- **Real testing before any handoff claim.** Do not write `passed`
  unless you actually ran it and saw the output. Use baton-pass's
  vocabulary honestly:
  - `passed` / `passed outside sandbox` / `not run — [reason]` /
    `expected to pass, unverified`
  If you are handing off before real testing was possible, say so as
  `expected to pass, unverified` — do not round up.
- **Credentials for secrets, never `$env` in HTTP-node fields** for
  n8n work — Custom Auth / Header Auth, scoped to the specific domain.
- **`docker compose up -d`, never `restart`,** when an environment
  variable changes.
- **One browser tab per workflow when testing**, if working in the
  n8n editor directly.
- **Commit before you hand off.** Never transfer a dirty working tree
  without naming the uncommitted state explicitly in the baton.
- **No activation without human review.** Per Spec §10.2 Option A,
  Aaron reviews every node before any workflow goes active. Building
  and testing is in scope; flipping something live is not, regardless
  of how confident you are it's ready.
- **No blind iteration against production credentials.** If a call
  fails in an ambiguous way (not a clean success, not a clean error),
  stop and report the raw output rather than trying variations
  (different auth methods, path styles, retries) on your own.
- **Flag scope creep or architectural drift** rather than silently
  absorbing a request that would introduce it — same standard Claude
  applies here.

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

## On handoff — run `baton-pass`, not a recap

Write only the delta:
- goal
- done (with honest verification status per task)
- tasks (status: done / in-progress / pending, if mid-plan)
- files changed
- worktree (branch + path, if applicable)
- verified (honest, using the vocabulary above — this is the field
  most likely to get rounded up under time pressure; don't)
- deviations (any mid-session decision that differs from the original
  plan or spec)
- environment (services running, env vars, anything a fresh agent
  needs and wouldn't otherwise know)
- next task
- risks
- next agent

Do not restate stable project history the receiving agent can get from
`docs/current-state.md` or the spec itself. A good baton is smaller
than a project summary — that's the entire point of this convention.

## If you hit something outside this scope

Stop and flag it rather than deciding on your own:
- Anything that looks like it needs Aaron's judgment call (a real
  design decision, not an implementation detail)
- Anything that would touch a workflow currently active in production
  in a way not already scoped by the task
- Any credential, endpoint, or account-level action neither you nor
  the handoff notes have direct visibility into
