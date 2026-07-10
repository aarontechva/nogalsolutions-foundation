# Workflow 2 Implementation Notes
NogalSolutions Spec v2.5 §4.1a — generated 2026-07-04

## What was built

**1. SQL migration file** (review before applying)
`supabase/migrations/20260704000002_workflow2_qualification_triggers.sql`

Two trigger functions + two triggers. Apply via Supabase SQL editor after
node-by-node review per §10.2. Do NOT use apply_migration or any auto-run path.

**2. n8n workflow** (draft, not activated)
Name: `NogalSolutions-BW2 Qualification Engine`
n8n ID: `xQRC2D94sGlNhsSz`
20 nodes. Covers §4.1a Phases 1–3. Phase 4 branching is handled by the DB
trigger on `qualification_results`, not n8n-internal.

---

## Webhook URLs

**URL Workflow 2 listens on (Trigger 1 in migration calls this):**
```
POST https://n8n-j7un.srv1769180.hstgr.cloud/webhook/qualification-engine
```

**Stub URLs called by Trigger 2 (`notify_n8n_qual_branch`) — 404 until Workflows 3/4 are built:**

| Destination | URL |
|---|---|
| Workflow 3 (qualified=true) | `https://n8n-j7un.srv1769180.hstgr.cloud/webhook/qualified-handoff` |
| Workflow 4 (qualified=false) | `https://n8n-j7un.srv1769180.hstgr.cloud/webhook/not-qualified-decline` |

The TOCTOU concurrent-duplicate path inside the n8n workflow also calls the
Workflow 4 stub directly (bypassing Phase 3) since the duplicate is treated
as an effective non-qualified lead per §4.1a.

---

## Spec conflicts — require resolution before activation

### Rule 6 — Timeline disqualifier value

**Spec §4.1a says:** match literal enum value `no urgency`

**Actual form sends:** `someday`
(IntakeForm.tsx TIMELINE_OPTIONS: `{ value: "someday", label: "Someday / Exploring" }`)

**Form comment says explicitly:** "The downstream qualifier can filter on
the value string 'someday'"

**What was implemented:** `timeline !== 'someday'` (actual form value)

**Action required:** The spec §4.1a text (`no urgency`) is a copy of §4.1's
human-readable label, not the machine value. If the correct disqualifier is
`someday` (what the form sends), the spec text should be corrected. If the
correct disqualifier is `no urgency` (what the spec says), the form
`TIMELINE_OPTIONS` value needs to change and this workflow node needs updating.

This is a spec text vs. live form disagreement. Per CLAUDE.md, it's flagged
here rather than silently resolved. Aaron to confirm which is authoritative.

---

## Assumptions made

**Payload field names** — confirmed from live test submission (id:
`a823c5b7-fbc1-4ba3-8024-b3d23c9bdf5f`) and IntakeForm.tsx source:

| Spec §4.2 field | Payload key | Disqualifying value |
|---|---|---|
| Problem in operations | `problem_in_operations` | — |
| Budget range | `budget_range` | `"exploring"` |
| Goals & desired outcomes | `goals_and_outcomes` | — |
| Timeline | `timeline` | `"someday"` (see conflict above) |
| Tech stack | `tech_stack` | `""` or `"skip"` |
| Consent checkbox | `consent` | `false` |

Timeline enum values in the form: `asap`, `1-3-months`, `3-6-months`,
`6-12-months`, `someday`

Budget range enum values in the form: `under-2500`, `2500-7500`,
`7500-20000`, `20000-plus`, `exploring`

**Company lookup** — uses case-insensitive ILIKE match (`?name=ilike.{name}&limit=1`).
`companies.name` has no UNIQUE constraint (§3.2.1), so this is a best-effort
match. If two companies with the same name (different casing) exist, the first
result is used. This edge case is not addressed in the spec.

**Phone field** — IntakeForm.tsx does not collect phone. Prospect INSERT omits
it. `prospects.phone` is nullable (§3.2.2). No action needed.

**Webhook path** — `qualification-engine` follows the Workflow 1 naming
convention (`intake-submission-ack`). Change before applying the migration if
a different path is preferred.

---

## Before activating: VPS setup required for Rule 2

The `disposable-email-domains` npm package must be installed on the VPS before
Workflow 2 is activated. Until this is done, Rule 2 runs the regex check only
— the disposable-domain check is silently skipped (degrades permissively, not
by failing the rule).

```bash
# On the VPS, in the n8n installation directory:
npm install disposable-email-domains
```

Add to the VPS `.env`:
```
NODE_FUNCTION_ALLOW_EXTERNAL=disposable-email-domains
```

Restart n8n after making this change.

---

## Before activating: set QUALIFICATION_THRESHOLD env var

The workflow reads `$env.QUALIFICATION_THRESHOLD` (falls back to 6 if missing).
Add to VPS `.env`:
```
QUALIFICATION_THRESHOLD=6
```

---

## Before activating: configure error workflow for Slack alerts

The n8n workflow's `errorWorkflow` setting is currently empty. Per §4.1a,
Phase 1–3 node failures must route to a Slack alert to Aaron.

After creating a Slack-alert error workflow on n8n, set it in BW2's
Settings panel (Settings → Error Workflow). The Slack webhook URL
(`SLACK_WEBHOOK_URL`) is already in the VPS `.env` per §11.

---

## §3.4a privilege check — run after applying migration

This migration creates functions and triggers only — no GRANT statements.
After applying, run:

```sql
SELECT table_name, grantee, privilege_type
FROM information_schema.role_table_grants
WHERE grantee IN ('anon','authenticated')
  AND table_schema = 'public'
ORDER BY table_name, privilege_type;
```

Expected result: only `anon → INSERT on intake_submissions`. If anything else
appears, investigate per §3.4a before proceeding.

---

## Review checklist (§10.2 — Aaron's responsibility)

- [ ] Read migration SQL in Supabase SQL editor; verify both trigger function bodies
- [ ] Apply migration via Supabase SQL editor (not auto-run)
- [ ] Run §3.4a privilege check after applying
- [ ] Open BW2 workflow in n8n editor; review all 20 nodes
- [ ] Verify `QUALIFICATION_THRESHOLD=6` is in VPS `.env`
- [ ] Install `disposable-email-domains` on VPS; set `NODE_FUNCTION_ALLOW_EXTERNAL`; restart n8n
- [ ] Create n8n Slack-alert error workflow; wire into BW2 Settings → Error Workflow
- [ ] Dry-run BW2 with a real test submission before activating
- [ ] Activate n8n workflow (`xQRC2D94sGlNhsSz`)
- [ ] Confirm DB trigger fires and BW2 runs on next intake submission
- [ ] Confirm qualification_results row created; confirm notify_n8n_qual_branch fires
- [ ] When Workflows 3/4 are built: update stub URLs in `notify_n8n_qual_branch()` function body
