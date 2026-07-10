# n8n Workflow Exports

Point-in-time JSON exports of the NogalSolutions n8n workflows, kept here so they're recoverable if the VPS is ever lost — not just living inside n8n's own database.

## Files

| File | Workflow | n8n ID |
|---|---|---|
| `nogalsolutions-bw1-auto-ack-email.json` | Workflow 1 — Auto-Ack Email | `CwH1P7jBx9rcFFlG` |
| `nogalsolutions-bw2-qualification-engine.json` | Workflow 2 — Qualification Engine | `xQRC2D94sGlNhsSz` |
| `nogalsolutions-sub-workflow-resolve-prospect-update-status.json` | Shared sub-workflow (called by BW3/BW4) | `UTrJJvfGmAyvTYrL` |
| `nogalsolutions-bw3-qualified-handoff.json` | Workflow 3 — Qualified Handoff | `37nvQYSYJ465uZTS` |
| `nogalsolutions-bw4-not-qualified-decline.json` | Workflow 4 — Not-Qualified Decline | `nSIfJuLYKnralK46` |
| `nogalsolutions-infra-daily-supabase-backup-to-r2.json` | Daily Supabase → R2 backup (infra, not one of the numbered §7 workflows) | `7BK88P7WjHY8fdA5` |
| `nogalsolutions-keep-alive-supabase-ping.json` | Keep-Alive — Supabase Ping (Phase 1) | `6eSkKcomTnrzmY97` |

## What this is — and isn't

- **Point-in-time, not live-synced.** Each file reflects the workflow's state at the moment it was exported. If a workflow is edited in n8n afterward, the file here goes stale until this export is re-run.
- **Not automatic yet.** This was a one-time export. A recurring export (matching the Roadmap's Phase 6 weekly cadence) is a separate, future task.
- **No credential values.** Every node that needs a credential references it by n8n's internal credential `id`/`name` (e.g. `"httpCustomAuth": {"id": "EWkrK7GWLBdKg04s", "name": "Supabase Service Role (Custom Auth)"}`). The actual secret values live only in n8n's own credential store and are never included in these files. Restoring a workflow from one of these exports into a fresh n8n instance means re-creating the referenced credentials there and re-pointing each node.
- **Excluded on purpose.** Three other workflows exist in this n8n instance (`NogalSolutions- AI Job Scraper + ATS-Resume Optimizer`, `Sales Order Filter for Central Regions`, `AI Receptionist`) but aren't NogalSolutions infrastructure — the first is a separate active project, the other two are archived and unrelated. None are exported here.

## How to refresh

Re-run the same export process: for each workflow above, pull its full JSON definition from n8n (nodes, connections, settings) via the n8n API/MCP tooling, and overwrite the corresponding file in this folder.
