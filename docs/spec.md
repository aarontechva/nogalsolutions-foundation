**NORTH STAR CANONICAL REFERENCE**

**NogalSolutions System Specification**

*AI-augmented consulting operations — the contract every builder builds against.*

<table>
<colgroup>
<col style="width: 33%" />
<col style="width: 66%" />
</colgroup>
<tbody>
<tr>
<td><strong>Document Type</strong></td>
<td>System Specification (canonical reference)</td>
</tr>
<tr>
<td><strong>Built By</strong></td>
<td>Aaron Nogal</td>
</tr>
<tr>
<td><strong>Platform</strong></td>
<td>Cloudflare Pages (frontend) + Supabase + n8n on Hostinger VPS + HubSpot (review surface)</td>
</tr>
<tr>
<td><strong>Status</strong></td>
<td>v2.18 — Locked. Deviations require version bump.</td>
</tr>
<tr>
<td><strong>Version</strong></td>
<td><p>2.10 — §7c added: AI provider migration to OpenRouter (Architecture Decision Record). Workflow 5's transcription moves from direct OpenAI Whisper-1 to Whisper Large V3 via OpenRouter (4x cheaper, same underlying model); Workflows 6–8's Claude calls move from direct Anthropic API to Anthropic-via-OpenRouter. §11: ANTHROPIC_API_KEY and OPENAI_API_KEY retired, replaced by OPENROUTER_API_KEY; ANTHROPIC_MODEL retained (now an OpenRouter-qualified slug); TRANSCRIPTION_MODEL added.</p>
<p>2.11 — §7d added: Workflows 9 &amp; 10, Presentation &amp; Send Flow (Architecture Decision Record). A shared renderer (pdfkit/pdf-lib in a Code node) combines sections[] for all 7 types into one branded PDF, stored in a new Supabase bucket (generated-documents). Workflow 9 auto-renders it the moment all 7 deliverables are Gate #2-approved (no separate manual trigger — Aaron’s approval is already the gate; the same mechanism covers re-presentation after a Workflow 8 revision too). Workflow 10 fires on a new Ready to Send property on Client Requirements, emails the already-rendered PDF, and closes the deal. §1.2: “Send to client” flips from No to Yes. §7: “8 workflows total” becomes “10 workflows total.”</p>
<p>2.12 — §7d Decision 3 corrected: Workflow 10 on success also PATCHes the associated Deal's dealstage to contractsent (displayed as “sent” in this portal's pipeline), a stage-transition push already covered by §8's existing Supabase—HubSpot data-flow table. Closes a gap between the “closes the deal” language describing Workflow 10 in §1.2's capability table and elsewhere, and what Decision 3 actually specified — found via a live-system audit after Workflow 10 had already shipped and processed one real completed engagement without ever writing to the Deal object. Deal-won/lost progression remains Aaron's manual call; Workflow 10 does not write closedwon or closedlost. §1.2's capability-table description updated to match.</p>
<p>2.13 — §7e added: Deal-Stage Progression Automation (Architecture Decision Record). Workflow 5 succeeding, Workflow 6 creating the Gate #1 Task, and Workflow 7 creating the Gate #2 Task now each advance the Deal to the pipeline stage labeled “discovery completed,” “analysis pending,” and “deliverables pending” respectively, via a new shared “Advance Deal Stage” sub-workflow (label-match pattern, not hardcoded stage IDs — matching Workflow 3's own existing convention). Closes the remainder of the gap v2.12 partially addressed: the Deal previously only ever moved twice (qualified at booking, sent at close), skipping every stage in between. No new Postgres schema or HubSpot properties.</p>
<p>2.14 — §7f added: Discovery Recording Dropzone Automation (Architecture Decision Record). A new shared sub-workflow, triggered off Workflow 3, creates the discovery-recordings/{prospect_id}/ folder directly via the Supabase Storage API and sends a Slack message with the exact path and a short reference code, closing a real production mistake where Aaron used intake_submissions.id instead of prospects.id creating the folder manually. No new Postgres schema or HubSpot properties.</p>
<p>2.15 — §7g added: Outbound Discovery Bootstrap (Architecture Decision Record). A new workflow, triggered by a private Form Trigger Aaron fills in himself for prospects he sources directly, creates the same Supabase/HubSpot identity and context records the website-form path builds automatically (company/prospect find-or-create, an intake_submissions row tagged by source, HubSpot Contact/Company/Deal), reuses the existing dropzone sub-workflow, then converges unchanged into Workflows 5-10. No automated qualification runs for this route - Aaron's own decision to initiate contact is the gate. New Postgres enum intake_source (website | outbound_discovery) and intake_submissions.source column, backward-compatible default 'website'. (This entry documents §7g's acceptance retroactively - it was added to the document body when accepted on 2026-07-21 but the Status/Version/Date fields were not updated at the time; corrected here as part of this bump.)</p>
<p>2.16 — §7h added: Inbound Discovery Prep Integration (Architecture Decision Record). Extends the standalone Job Post Analyzer utility's AI-analysis pattern (LLM Chain, OpenRouter, structured discovery questions) to qualified inbound leads: a new branch off Workflow 3, firing only once a prospect is qualified (not on the raw intake submission), generates the same structured pre-call prep and posts it to the same Slack channel used by the outbound tool - renamed #job-post-intake to #discovery-prep, messages labeled by source since sharing one channel is a cosmetic choice, not a functional one. Job Post Analyzer's own AI-analysis logic is intentionally not yet extracted into a shared sub-workflow, matching §7g's own precedent of proving each route standalone first. No new Postgres schema or HubSpot properties.</p>
<p>2.17 — §7i added: Deposit-Gated Closed-Won &amp; Onboarding Kickoff (Architecture Decision Record). A Deal is not truly closed-won until a 50% client deposit is received via Stripe, verified through a signed webhook and matched to its Deal by an embedded ID; a match auto-advances the Deal and triggers automated onboarding (welcome message, contract copy, receipt as direct attachments), a mismatch or a post-close chargeback dispute routes to Aaron for manual review rather than guessing. Resolves the negotiating/won/lost Deal-stage behavior question parked since Progress 110. Workflow 9 also gains a branch syncing the Deal’s amount from the pricing deliverable’s approved total, replacing today’s manual entry.</p>
<p>2.18 — §7i corrected: automatic Stripe/Wise webhook-based payment detection dropped entirely after live research found both rails blocked for Philippines-based accounts (Stripe's direct signup does not cover the Philippines; Wise’s self-serve API access is Business-account-only and its fuller capabilities are limited to a short country list that excludes the Philippines) — independently confirmed by a contact in Aaron’s own developer network. Replaced with a human-in-the-loop confirmation gate: Aaron requests the deposit and confirms its receipt/amount manually via two new HubSpot Deal properties, which still triggers the same amount-match-or-flag logic and downstream Deal advance/onboarding automatically. Workflow 9’s Deal-amount-sync branch, the manual-override lock, the awaiting deposit stage, and the no-refunds policy are all unaffected and unchanged.</p></td>
</tr>
<tr>
<td><strong>Date</strong></td>
<td>2026-07-24</td>
</tr>
</tbody>
</table>

*If it is not in this document, it does not get built.*

# 1. Governing Principles

## 1.1 The Three Rules

These rules are load-bearing. Every design choice downstream must be reconcilable with them; if a proposed change conflicts, the change is wrong, not the rule.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr>
<td><p><strong>⚠ Rule 1 — Supabase is the Single Source of Truth (SSOT).</strong></p>
<p>All authoritative state lives in Supabase. Every other system — n8n, HubSpot, the Cloudflare Pages frontend, any future CRM — is a consumer or a view. When two systems disagree on a field, Supabase wins by definition. HubSpot changes route back to Supabase within 60 seconds or they are a bug.</p></td>
</tr>
</tbody>
</table>

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr>
<td><p><strong>⚠ Rule 2 — AI prepares, humans decide.</strong></p>
<p>AI drafts, structures, and surfaces intelligence. It does not send anything to a prospect, it does not set prices, and it does not qualify leads. Every client-facing artifact passes through Aaron before it leaves the system. AI should never feel like a gatekeeper.</p></td>
</tr>
</tbody>
</table>

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr>
<td><p><strong>⚠ Rule 3 — Deterministic where possible, AI where deterministic breaks.</strong></p>
<p>Qualification, routing, calendar unlocks, and status transitions are business rules — code, not prompts. AI enters only where structured output from unstructured input is genuinely required: transcript analysis, document drafting, semantic classification.</p></td>
</tr>
</tbody>
</table>

## 1.2 AI Placement Map

This table is the honest ledger of where AI touches the pipeline and where it does not. It supersedes all prior placement maps.

| **Stage** | **AI Used?** | **Aaron's role** |
|----|----|----|
| Intake form | No | Designed the fields, does not touch each submission |
| Qualification engine | No | Set the rules once; deterministic thereafter |
| Auto-acknowledgment email | No | Template only; sends automatically on submit |
| Booking + calendar email | No | Template only; sends on qualified result |
| Discovery call | No | Conducts the call personally |
| Audio transcription | Yes (Whisper) | Uploads recording; reviews transcript if needed |
| Post-call analysis JSON | Yes (Claude) | Gate \#1: approves or edits JSON before deliverables generate |
| Deliverable drafting (7 docs) | Yes (Claude, sequenced) | Gate \#2: per-document approve / edit / hold |
| Pricing draft | Yes (Claude) | AI drafts a number; Aaron sets the final number |
| Send to client | Yes | n8n (Workflow 9) auto-renders a combined PDF the moment all 7 deliverables are Gate \#2-approved; Aaron flips Client Requirements' Ready to Send property once negotiation concludes, and n8n (Workflow 10) emails that PDF and advances the associated Deal to the sent stage |
| Second-call proposal walkthrough | No | Aaron leads the call |
| Negotiation revision loop | Partial | Aaron captures notes; Claude re-drafts affected sections only |
| Deposit collection & closed-won gate | No | Manually initiates the payment request by moving the Deal to awaiting deposit; everything after that - amount matching, stage advance, dispute alerting - is rule-based, not AI |

## 1.3 End-to-End Flow

One diagram, read top to bottom. Every arrow is either a deterministic n8n step or a human action; there are no hidden branches.

| **Stage** | **What happens** |
|----|----|
| 1\. Intake | Prospect submits form on nogalsolutions.tech. Row written to Supabase.intake_submissions. Auto-acknowledgment email fires. |
| 2\. Qualification | n8n reads intake, applies 7 deterministic rules. Writes result to Supabase.qualification_results. |
| 3a. Qualified path | Booking email + Calendly link sent immediately. No AI gate before booking. |
| 3b. Not-qualified path | Polite decline email + free resource sent. Prospect moved to nurture status in Supabase + HubSpot (Contact only, no Deal — see §7a). n8n logs event to activity_logs. |
| 4\. Discovery call | Aaron + prospect on Zoom/Meet. Recorded with two-party consent (checkbox in intake T&C). Aaron uploads recording to designated Supabase Storage bucket after call. |
| 5\. Transcription | n8n watches the bucket, sends audio to Whisper, writes transcript to Supabase.discovery_sessions. |
| 6\. Post-call analysis | n8n sends transcript to Claude with Prompt A. Structured JSON written to Supabase.post_call_analyses with status = pending_review. |
| 7\. Gate \#1 (Aaron) | Aaron reviews the JSON in HubSpot. Edits inline as needed. Marks approved. Webhook fires back to n8n → Supabase status = approved. |
| 8\. Sequenced generation | n8n runs 7 Claude calls in sequence: Architecture → Spec → Roadmap → SOP → Proposal → Pricing → T&C. Each call receives all prior deliverables as context. Rows written to Supabase.deliverables with status = pending_review. |
| 9\. Gate \#2 (Aaron) | Aaron reviews each deliverable in HubSpot. Per-document approve / edit / hold. Approved deliverables sent to prospect via email (Aaron clicks Send). |
| 10\. Second call | Proposal walkthrough. Outcome recorded: Won / Lost / Negotiating. |
| 11\. Negotiation loop | If Negotiating, Aaron records revision notes. n8n triggers sequenced re-generation of only affected deliverables. Returns to Gate \#2. |
| 12\. Close | Won or Lost recorded in Supabase.meetings.outcome. Activity log updated. HubSpot pipeline stage synced. |

# 2. System Architecture

## 2.1 Tech Stack

| **Layer** | **Tool** | **Role** |
|----|----|----|
| Frontend | React + Vite on Cloudflare Pages | Intake form, marketing site. Deployed at nogalsolutions.tech. |
| Data Layer (SSOT) | Supabase (Postgres + Auth + Storage) | Canonical data store. RLS enabled with deny-by-default. Audio recordings in Storage. |
| Orchestration | n8n on Hostinger VPS | All workflows. Reads/writes Supabase. Calls Claude, Whisper, HubSpot, Calendly, email. |
| AI — Analysis & Drafting | Claude (Anthropic API) | Post-call analysis JSON; sequenced generation of 7 deliverables. |
| AI — Transcription | Whisper (OpenAI API) | Audio → text. |
| Calendar | Calendly | Booking after qualification. |
| Review Surface | HubSpot Free CRM | Aaron reviews Gate \#1 (JSON) and Gate \#2 (deliverables) in HubSpot UI. Two-way sync with Supabase. |
| Notifications | Slack + SMTP email | Aaron alerts on qualified leads, gate items awaiting review. |
| Frontend Impl. (v1) | Claude Code CLI | Already shipped. Cloudflare Pages deploy. |
| Backend Impl. (v2+) | Claude Code CLI (via n8n MCP + VS Code) | Human-review-before-deploy per §10.2. |

## 2.2 What Changed From v1.x

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr>
<td><p><strong>⚠ VAPI Voice Discovery Assistant — REMOVED.</strong></p>
<p>v1 required prospects to complete a 20–25 min AI voice session before booking Aaron. This violated §1.1 Rule 2 (AI as gatekeeper) and imposed friction on high-intent leads. Human discovery call restored as the trust-building first touch.</p></td>
</tr>
</tbody>
</table>

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr>
<td><p><strong>✓ Sequenced deliverable generation — NEW.</strong></p>
<p>The 7 deliverables (Architecture, Spec, Roadmap, SOP, Proposal, Pricing, T&amp;C) are generated in strict order, each receiving prior outputs as context. Prevents commercial docs from promising work the technical docs do not cover.</p></td>
</tr>
</tbody>
</table>

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr>
<td><p><strong>⚠ Pre-call brief — DEFERRED.</strong></p>
<p>v2-draft included an AI-generated pre-call brief. Deferred until Aaron has 15–20 real discovery calls under his belt and can pattern-match what a good brief actually looks like. Building it now, on zero real data, would ship generic output and over-engineer the pipeline.</p></td>
</tr>
</tbody>
</table>

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr>
<td><p><strong>✓ HubSpot as review surface — NEW.</strong></p>
<p>Custom Consultant Workspace replaced by HubSpot for Gate #1 and Gate #2. Weeks of frontend work eliminated. Supabase remains SSOT; HubSpot is a view, not a store.</p></td>
</tr>
</tbody>
</table>

# 3. Database Schema (Supabase)

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr>
<td><p><strong>⚠ RLS is mandatory.</strong></p>
<p>Row Level Security must be enabled on every table below with a deny-by-default policy before the anon key ships in any client build. Server-side writes (n8n, Edge Functions) use SUPABASE_SERVICE_ROLE_KEY, which bypasses RLS and must never reach the frontend or version control.</p></td>
</tr>
</tbody>
</table>

## 3.1 Table Inventory

Purpose-level summary of the 10 tables and their evolution from v1. Full column definitions live in §3.2.

| **Table** | **Purpose** | **v1 → v2** |
|----|----|----|
| **companies** | One row per prospect company. Name, website, industry, size. | Unchanged |
| **prospects** | One row per prospect person. FK to companies. Email is NOT NULL UNIQUE. Pipeline status tracked as enum. | Unchanged |
| **intake_submissions** | Raw form submission payload as jsonb + timestamp. Immutable audit record. | Unchanged |
| **qualification_results** | Rule-by-rule breakdown per submission stored as jsonb. Qualified boolean + summary reason. | Unchanged |
| **discovery_sessions** | Human discovery call metadata. Recording URL, transcript, transcription status. | Renamed from voice_sessions |
| **post_call_analyses** | Claude-generated structured JSON per session. Gate \#1 artifact. | New (split from discovery_reports) |
| **deliverables** | One row per generated document. Type, content jsonb, version, status, edit history. | New (absorbs proposals) |
| **meetings** | Discovery + proposal calls. Type + outcome per meeting. | Unchanged |
| **revision_loops** | Negotiation cycles. Notes, resolution status, meeting link. | New |
| **activity_logs** | Chronological event log per prospect. Every state transition. Append-only. | Unchanged |

## 3.2 Column Definitions — All 10 Tables

Each subsection defines the columns for one table. Types are Postgres types as they will appear in the migration. Every non-trivial decision is annotated in Notes. Tables are presented in FK-dependency order — earlier tables have no forward references to later ones.

### 3.2.1 companies

No foreign key dependencies. Root of the company graph.

| **Column** | **Type** | **Notes** |
|----|----|----|
| **id** | uuid PK | gen_random_uuid() default. |
| **name** | text NOT NULL | Company display name. Required. |
| **website** | text | Optional. No format constraint at DB level. |
| **industry** | text | Free text; no fixed taxonomy defined. |
| **size** | text | Stored as text to accommodate common range strings (e.g. '11–50', 'Enterprise'). No enum until a fixed tier model is committed. |
| **created_at** | timestamptz NOT NULL | Default now(). |
| **updated_at** | timestamptz NOT NULL | Default now(). Application layer or trigger maintains on update. |

### 

### 

### 

### 

### 

### 3.2.2 prospects

Depends on: companies. Central identity table for pipeline participants.

| **Column** | **Type** | **Notes** |
|----|----|----|
| **id** | uuid PK | gen_random_uuid() default. |
| **company_id** | uuid FK NULLABLE | REFERENCES companies(id) ON DELETE SET NULL. Nullable so a prospect may be captured before the company record is created. |
| **full_name** | text NOT NULL | Single field. Matches §4.2 intake form 'Name' field. Not split into first/last — the form does not split, and the pipeline treats the prospect as a single named contact. |
| **email** | text NOT NULL UNIQUE | Load-bearing. Used for qualification rules 2 and 3 (§4.1), booking email, deliverable delivery. |
| **phone** | text | Optional. Captured if provided; not required by qualification. |
| **status** | prospect_status NOT NULL | Enum. Default 'new'. See §3.3 for full enum values. |
| **created_at** | timestamptz NOT NULL | Default now(). |
| **updated_at** | timestamptz NOT NULL | Default now(). |

### 3.2.3 intake_submissions

Depends on: prospects. Immutable audit record of the raw form submission.

| **Column** | **Type** | **Notes** |
|----|----|----|
| **id** | uuid PK | gen_random_uuid() default. |
| **prospect_id** | uuid FK NULLABLE | REFERENCES prospects(id) ON DELETE SET NULL. Nullable because the match to a prospect record may occur asynchronously after the raw submission is persisted. |
| **payload** | jsonb NOT NULL | Full raw payload of every §4.2 field submitted, plus any additional client-side metadata. Immutable — writes only happen on insert. |
| **submitted_at** | timestamptz NOT NULL | Client-reported submission time. Distinct from created_at so DB-write latency does not overwrite the true submission moment. |
| **created_at** | timestamptz NOT NULL | DB insert time. Default now(). |

### 3.2.4 qualification_results

Depends on: intake_submissions. Rule-by-rule outcome for the 7 qualification rules (§4.1).

| **Column** | **Type** | **Notes** |
|----|----|----|
| **id** | uuid PK | gen_random_uuid() default. |
| **intake_submission_id** | uuid FK NOT NULL UNIQUE | REFERENCES intake_submissions(id) ON DELETE CASCADE. UNIQUE enforces one qualification result per submission — re-evaluation replaces the row. |
| **qualified** | boolean NOT NULL | Top-level pass/fail. Threshold: 6 of 7 rules passing (§4.1). |
| **reason** | text | Human-readable summary of the decision, used in comms and activity logs. |
| **rule_results** | jsonb NOT NULL | Array of per-rule outcomes. Element shape: {rule: int, name: string, pass: boolean, reason: string}. jsonb rather than 14 flat columns so rule metadata can evolve without schema migration. |
| **evaluated_at** | timestamptz NOT NULL | When rules were evaluated. Distinct from created_at for async/batch evaluation patterns. Default now(). |
| **created_at** | timestamptz NOT NULL | Default now(). |

### 

### 

### 3.2.5 meetings

Depends on: prospects. Discovery + proposal calls.

| **Column** | **Type** | **Notes** |
|----|----|----|
| **id** | uuid PK | gen_random_uuid() default. |
| **prospect_id** | uuid FK NOT NULL | REFERENCES prospects(id) ON DELETE CASCADE. |
| **type** | meeting_type NOT NULL | Enum: 'discovery' \| 'proposal'. See §3.3. |
| **scheduled_at** | timestamptz NOT NULL | When the meeting is booked to occur. |
| **outcome** | meeting_outcome NULLABLE | Enum: 'won' \| 'lost' \| 'negotiating'. Nullable until the meeting concludes. |
| **notes** | text | Free-text field for call context that does not belong in structured analysis. |
| **created_at** | timestamptz NOT NULL | Default now(). |
| **updated_at** | timestamptz NOT NULL | Default now(). |

### 3.2.6 discovery_sessions

Depends on: prospects, meetings. Metadata for the human discovery call.

| **Column** | **Type** | **Notes** |
|----|----|----|
| **id** | uuid PK | gen_random_uuid() default. |
| **prospect_id** | uuid FK NOT NULL | REFERENCES prospects(id) ON DELETE CASCADE. |
| **meeting_id** | uuid FK NULLABLE | REFERENCES meetings(id) ON DELETE SET NULL. Nullable so the session record can be created before the meeting is formally logged. |
| **recording_url** | text | Nullable until the recording is available in Supabase Storage post-call. |
| **transcript** | text | Full transcript in-column. Expected long-form. Nullable until transcription completes. |
| **transcription_status** | transcription_status NOT NULL | Enum: 'pending' \| 'complete'. Default 'pending'. See §3.3. |
| **created_at** | timestamptz NOT NULL | Default now(). |
| **updated_at** | timestamptz NOT NULL | Default now(). |

### 3.2.7 post_call_analyses

Depends on: discovery_sessions. Claude-generated JSON — the Gate \#1 artifact.

| **Column** | **Type** | **Notes** |
|----|----|----|
| **id** | uuid PK | gen_random_uuid() default. |
| **discovery_session_id** | uuid FK NOT NULL UNIQUE | REFERENCES discovery_sessions(id) ON DELETE CASCADE. UNIQUE — one analysis per session. Revisions update the existing row. |
| **analysis** | jsonb NOT NULL | Structured JSON output from Prompt A (§6). Shape defined in the Prompt Library, not here. |
| **status** | analysis_status NOT NULL | Enum: 'pending_review' \| 'approved'. Default 'pending_review'. See §3.3. |
| **reviewed_at** | timestamptz NULLABLE | Set when Aaron marks approved in HubSpot (Gate \#1). |
| **reviewed_by** | text | Identifier of the reviewer (email or display name). Not a users FK yet — auth integration is deferred. |
| **notes** | text | Reviewer notes capturing rationale for inline edits made pre-approval. |
| **generated_at** | timestamptz NOT NULL | When Claude produced the JSON. Default now(). |
| **created_at** | timestamptz NOT NULL | Default now(). |
| **updated_at** | timestamptz NOT NULL | Default now(). |

### 3.2.8 deliverables

Depends on: prospects, revision_loops. Load-bearing addition of v2 — replaces the v1 proposals table and holds all 7 generated document types under one schema.

| **Column** | **Type** | **Notes** |
|----|----|----|
| **id** | uuid PK | gen_random_uuid() default. |
| **prospect_id** | uuid FK NOT NULL | REFERENCES prospects(id) ON DELETE CASCADE. |
| **type** | deliverable_type NOT NULL | Enum with exactly 7 values: architecture, spec, roadmap, sop, proposal, pricing, tc. See §3.3. |
| **content** | jsonb | Structured document body. Schema per type documented in the Prompt Library. |
| **version** | int NOT NULL | Starts at 1. Application layer increments on each revision loop iteration. |
| **status** | deliverable_status NOT NULL | Enum: pending_review, approved, held, sent, revising. Default 'pending_review'. See §3.3. |
| **generated_at** | timestamptz NOT NULL | When Claude produced this version. Default now(). |
| **reviewed_at** | timestamptz NULLABLE | When Aaron marked Gate \#2 approve/edit/hold. |
| **sent_at** | timestamptz NULLABLE | When Aaron clicked Send. NULL until sent. |
| **edit_history** | jsonb NOT NULL | Array of {timestamp, field, before, after}. Default '\[\]'. Audit trail for inline edits made during review. |
| **revision_loop_id** | uuid FK NULLABLE | REFERENCES revision_loops(id) ON DELETE SET NULL. Populated only when this version was produced by a negotiation loop. This is the single source of truth for the deliverable→loop relationship — see §3.5 for why the inverse mapping is NOT stored on revision_loops. |
| **created_at** | timestamptz NOT NULL | Default now(). |
| **updated_at** | timestamptz NOT NULL | Default now(). |

### 3.2.9 revision_loops

Depends on: prospects, meetings. Negotiation cycles that produce new deliverable versions.

<table>
<colgroup>
<col style="width: 23%" />
<col style="width: 25%" />
<col style="width: 50%" />
</colgroup>
<thead>
<tr>
<th><strong>Column</strong></th>
<th><strong>Type</strong></th>
<th><strong>Notes</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>id</strong></td>
<td>uuid PK</td>
<td>gen_random_uuid() default.</td>
</tr>
<tr>
<td><strong>prospect_id</strong></td>
<td>uuid FK NOT NULL</td>
<td>REFERENCES prospects(id) ON DELETE CASCADE.</td>
</tr>
<tr>
<td><strong>meeting_id</strong></td>
<td>uuid FK NULLABLE</td>
<td>REFERENCES meetings(id) ON DELETE SET NULL. A loop may open without a formal meeting record (e.g. async email negotiation).</td>
</tr>
<tr>
<td><strong>notes</strong></td>
<td>text</td>
<td>Free-text summary of negotiation context or client objections.</td>
</tr>
<tr>
<td><strong>resolution_status</strong></td>
<td>resolution_status NOT NULL</td>
<td>Enum: 'open' | 'resolved'. Default 'open'. See §3.3.</td>
</tr>
<tr>
<td><strong>resolved_at</strong></td>
<td>timestamptz NULLABLE</td>
<td>Set when resolution_status transitions to 'resolved'.</td>
</tr>
<tr>
<td><strong>created_at</strong></td>
<td>timestamptz NOT NULL</td>
<td>Default now().</td>
</tr>
<tr>
<td><strong>updated_at</strong></td>
<td>timestamptz NOT NULL</td>
<td>Default now().</td>
</tr>
<tr>
<td colspan="3"><p><strong>▲ No affected_deliverable_ids column.</strong></p>
<p>The relationship 'which deliverables belong to this loop' is queried via deliverables.revision_loop_id — the FK on the deliverables side. Storing a jsonb array here would create a dual-source-of-truth requiring application-layer sync, which Rule 1 (SSOT) forbids.</p></td>
</tr>
</tbody>
</table>

### 3.2.10 activity_logs

Depends on: prospects. Append-only event log. No updated_at.

| **Column** | **Type** | **Notes** |
|----|----|----|
| **id** | uuid PK | gen_random_uuid() default. |
| **prospect_id** | uuid FK NOT NULL | REFERENCES prospects(id) ON DELETE CASCADE. |
| **event_type** | text NOT NULL | Free text, not enum. Application layer owns the known-values list. Example values: 'prospect.qualified', 'deliverable.sent', 'meeting.completed'. Text keeps the schema stable as event types are added. |
| **occurred_at** | timestamptz NOT NULL | When the event happened. Distinct from created_at so events can be back-dated (manual entries preserve true timestamp). Default now(). |
| **metadata** | jsonb | Event-specific payload. Shape varies by event_type. Example for a status transition: {from_status: 'new', to_status: 'qualified', rule_count: 7}. |
| **created_at** | timestamptz NOT NULL | Default now(). |

## 

## 

## 

## 

## 

## 3.3 Enum Types

All enums used above are defined at the type level in Postgres via CREATE TYPE ... AS ENUM. Adding a value later requires ALTER TYPE ... ADD VALUE (non-transactional, plan accordingly).

<table>
<colgroup>
<col style="width: 25%" />
<col style="width: 32%" />
<col style="width: 41%" />
</colgroup>
<thead>
<tr>
<th><strong>Enum</strong></th>
<th><strong>Values</strong></th>
<th><strong>Used By</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>prospect_status</strong></td>
<td>new, nurture, qualified, discovery, analysis, proposal, negotiating, won, lost</td>
<td>prospects.status</td>
</tr>
<tr>
<td><strong>meeting_type</strong></td>
<td>discovery, proposal</td>
<td>meetings.type</td>
</tr>
<tr>
<td><strong>meeting_outcome</strong></td>
<td>won, lost, negotiating</td>
<td>meetings.outcome</td>
</tr>
<tr>
<td><strong>transcription_status</strong></td>
<td>pending, complete</td>
<td>discovery_sessions.transcription_status</td>
</tr>
<tr>
<td><strong>analysis_status</strong></td>
<td>pending_review, approved</td>
<td>post_call_analyses.status</td>
</tr>
<tr>
<td><strong>deliverable_type</strong></td>
<td>architecture, spec, roadmap, sop, proposal, pricing, tc</td>
<td>deliverables.type</td>
</tr>
<tr>
<td><strong>deliverable_status</strong></td>
<td>pending_review, approved, held, sent, revising</td>
<td>deliverables.status</td>
</tr>
<tr>
<td><strong>resolution_status</strong></td>
<td>open, resolved</td>
<td>revision_loops.resolution_status</td>
</tr>
<tr>
<td colspan="3"><p><strong>⚠ prospect_status uses 'nurture' — NOT 'disqualified'.</strong></p>
<p>The v2.1 workflow narrative (§7 and roadmap Phase 2) explicitly moves not-qualified leads to nurture. The Spec is the source of truth for that term. Any migration or workflow using 'disqualified' is a bug against v2.2.</p></td>
</tr>
</tbody>
</table>

## 3.4 Row Level Security

RLS is mandatory on every table in §3.2. Table creation and RLS enablement are separated into distinct migration steps so that the schema can be reviewed and applied independently from the policy layer.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr>
<td><p><strong>⚠ RLS is mandatory before the frontend deploys.</strong></p>
<p>Row Level Security must be enabled on every table above with a deny-by-default policy before the publishable API key ships in any client build. Server-side writes (n8n, Edge Functions) use the sb_secret key (formerly SERVICE_ROLE_KEY), which bypasses RLS and must never reach the frontend or version control.</p>
<p>Deploy sequence: (1) apply this schema migration; (2) apply RLS enablement + deny-by-default policies as a second migration; (3) apply per-table access policies as the workflows requiring them come online; (4) only then wire the publishable key into Cloudflare Pages env vars for a rebuild.</p></td>
</tr>
</tbody>
</table>

## 3.4a Privilege Verification Checklist (added after live production audit, 2026-07-04)

RLS being enabled on a table is necessary but not sufficient for minimal privilege. This section exists because a live audit found anon and authenticated holding TRUNCATE, REFERENCES, and TRIGGER on nearly every table in public — privileges nobody intentionally granted, undiscovered until a cross-table check was run instead of stopping at the one table already under investigation. pg_default_acl was checked and confirmed empty for both roles on public, meaning this was a one-time historical over-grant (most likely from a table drop/recreate), not a standing rule reapplying itself — but the excess sat unnoticed regardless.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr>
<td><p><strong>⚠ Why RLS enabled didn't catch this</strong></p>
<p>RLS policies filter which rows a role may act on. They say nothing about which operations are available in the first place. TRUNCATE in particular is not row-scoped and is not subject to RLS at all, per Postgres's own documented behavior — a table can have a correct, airtight RLS policy and still be fully truncatable by a role that was never supposed to have that privilege. "RLS is on" and "privileges are minimal" are two separate claims; verifying one does not verify the other.</p></td>
</tr>
</tbody>
</table>

Checklist — run this any time a table in public is created or recreated, not just at initial schema setup:

1.  Query grants directly: SELECT table_name, grantee, privilege_type FROM information_schema.role_table_grants WHERE grantee IN ('anon','authenticated') AND table_schema = 'public' ORDER BY table_name, privilege_type;

2.  Expect ONLY the specific privilege(s) that role's actual function requires — e.g., anon should show INSERT on intake_submissions and nothing else, on no other table. Anything beyond the explicitly intended grant is excess until proven otherwise.

3.  If excess is found, also check pg_default_acl for public before revoking (SELECT defaclrole::regrole, defaclobjtype, defaclacl FROM pg_default_acl WHERE defaclnamespace = 'public'::regnamespace;) — this determines whether it's a one-time cleanup or an active rule that will silently reapply itself to the next table created, which needs to be dropped, not just worked around.

4.  service_role is exempt from this check by design. It exists specifically to bypass RLS for legitimate backend writes (n8n, migrations) — broad grants there are correct and expected, not a finding.

## 3.5 Notes on Modeling Decisions

### Single-direction FK for the loop ↔ deliverable relationship

A revision loop may affect multiple deliverables (proposal, pricing, T&C often revise together). The intuitive first draft stores this as an array on revision_loops AND a FK on deliverables — one record on each side. That pattern is forbidden here: two representations of the same relationship in the same database means every write path has to keep both in sync, and any missed update produces silent drift. The canonical direction is deliverables.revision_loop_id. To query 'which deliverables were affected by loop X', use: SELECT \* FROM deliverables WHERE revision_loop_id = X.

### Why jsonb over normalized child tables in three places

intake_submissions.payload, qualification_results.rule_results, and activity_logs.metadata all use jsonb rather than child tables. The rationale is identical in each case: the shape is expected to evolve (intake fields shift per campaign, rule metadata grows as new rules are added, event types multiply) and the read pattern is 'fetch the whole record and process in application code' rather than 'filter by a specific inner field at SQL level'. jsonb keeps the schema stable across those changes without paying the join cost on every read. If a filter-by-inner-field query pattern emerges later, migrate that specific inner field to a proper column then.

### Why deliverables.content is nullable but deliverables.type is not

A deliverable row may be created in a 'pending' or 'held' state before Claude has produced content — the row exists to represent the intent, and content arrives on the second write. type is committed at creation because the generation sequence (§7, prompts B1–B7) is deterministic and known before generation runs.

### Timestamps are triple-tracked in some tables — deliberately

post_call_analyses has generated_at, reviewed_at, and created_at. deliverables has generated_at, reviewed_at, sent_at, and created_at. These are not redundant — each answers a different question. generated_at answers 'when did AI produce this content'; created_at answers 'when did the DB row appear' (async/queue latency can separate these by seconds or more); reviewed_at answers 'when did the human approve'; sent_at answers 'when did it leave the system to the prospect'. Losing any one of these makes an audit or performance question harder to answer.

## 

## 

## 

## 3.6 Migration Ordering

Tables must be created in the order below so that every foreign key resolves to an existing target. This is the exact order the Phase 1 → Track B → Item 4 migration file must follow.

| **\#** | **Table** | **Reason** |
|----|----|----|
| **1** | companies | No FK dependencies. |
| **2** | prospects | FK → companies. |
| **3** | meetings | FK → prospects. |
| **4** | revision_loops | FK → prospects, meetings. Must exist before deliverables. |
| **5** | intake_submissions | FK → prospects. |
| **6** | qualification_results | FK → intake_submissions. |
| **7** | discovery_sessions | FK → prospects, meetings. |
| **8** | post_call_analyses | FK → discovery_sessions. |
| **9** | deliverables | FK → prospects, revision_loops (both must exist first). |
| **10** | activity_logs | FK → prospects. |

# Closing

This addendum locks the 10-table schema at the column level. It supersedes §3.1 and §3.2 of v2.1 in full. Downstream artifacts — the migration SQL, the n8n workflow node configs that read from and write to these tables, the HubSpot custom object mappings — must conform to this document, not the other way around.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr>
<td><p><strong>✓ v2.2 status: Locked.</strong></p>
<p>Any deviation from the columns, types, constraints, or enum values defined above requires a version bump on this Spec before the deviation is implemented.</p></td>
</tr>
</tbody>
</table>

# 4. Qualification Engine

## 4.1 Rules (deterministic, no AI)

7 rules, each pass/fail. Threshold: 6 of 7 = qualified. Threshold lives in config, not code.

| **\#** | **Rule** | **Check** |
|----|----|----|
| 1 | All required intake fields present | Every field in §4.2 non-empty |
| 2 | Email valid + not disposable | Regex + blocklist (mailinator, tempmail, guerrillamail, etc.) |
| 3 | No duplicate prospect | SELECT COUNT(\*) FROM prospects WHERE email = ? returns 0 |
| 4 | Problem maps to a service | Free-text problem field runs through keyword classifier against declared service categories |
| 5 | Budget is not "exploring" | Budget range field ≠ "just exploring / no budget" |
| 6 | Timeline is not "someday" | Timeline field ≠ "no urgency / whenever" |
| 7 | Tech stack disclosed | Tech stack field non-empty and ≠ "skip" |

## 4.1a Workflow 2 — Qualification Engine Architecture

Architecture decision record for Workflow 2, drafted by Claude (Architect role, §10.1) for Claude Code CLI implementation per the §10.2 handoff protocol. Supersedes the §7 Workflow 1 row and the Roadmap Phase 2 "Qualified path" checklist item on prospect/company row creation — see callout below.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr>
<td><p><strong>✓ Resolved deviation from §7 and the Roadmap: prospect/company creation moved to Workflow 2 (locked v2.4).</strong></p>
<p>§7 assigns companies/prospects row creation to Workflow 1; the Roadmap Phase 2 checklist assigns it to Workflow 3 (qualified path only). Both are superseded here. Every intake submission — qualified or not — now gets a prospects row, created inside Workflow 2 before the qualified/not-qualified branch.</p>
<p>Reason: activity_logs.prospect_id is FK NOT NULL (§3.2.10). Workflow 4 cannot log a decline or mark nurture status against a prospect that was never created. Scoping row creation to the qualified path only breaks Workflow 4 the first time a real lead is declined. It also silently breaks Rule 3's dedup coverage — a declined lead's email would never enter prospects, so resubmission after decline would go undetected indefinitely.</p>
<p>Resolved in v2.4: §7 Workflow 1 and Workflow 2 rows updated to match (2026-07-03). Roadmap Phase 2 "Qualified path" checklist updated to match — see Roadmap v2.4.</p></td>
</tr>
</tbody>
</table>

### Trigger

A dedicated Postgres trigger on intake_submissions (AFTER INSERT), independent of Workflow 1's trigger — not chained via an n8n Execute Workflow node off Workflow 1. §7's own framing ("8 workflows total, each has one trigger and one purpose") is the reason: chaining would make Workflow 2's reliability depend on Workflow 1 never changing, which defeats the isolation §7 asks for. Naming convention matches the existing trigger: notify_n8n_qualification_engine, calling net.http_post() to a dedicated Workflow 2 webhook.

### Execution phases

Rule evaluation and row creation are kept as two non-overlapping phases. Nothing is written to Supabase until every rule has a result — this is what keeps Rule 3's dedup query correct without needing to exclude a row it just created itself.

<table>
<colgroup>
<col style="width: 19%" />
<col style="width: 80%" />
</colgroup>
<thead>
<tr>
<th><strong>Phase</strong></th>
<th><strong>What happens</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td><p>1. Evaluate</p>
<p>(read-only)</p></td>
<td>Run all 7 §4.1 rules against intake_submissions.payload directly. No writes. See rule-by-rule notes below.</td>
</tr>
<tr>
<td>2. Write identity</td>
<td>Match-or-create companies (by name); insert prospects (status stays at schema default 'new' — Workflow 3/4 own the transition, not Workflow 2); update intake_submissions.prospect_id.</td>
</tr>
<tr>
<td>3. Write result</td>
<td>qualification_results via INSERT … ON CONFLICT (intake_submission_id) DO UPDATE. Must be an upsert — §3.2.4 states re-evaluation replaces the row, and a plain insert would fail on any re-run.</td>
</tr>
<tr>
<td>4. Branch</td>
<td>A second Postgres trigger, on qualification_results (AFTER INSERT OR UPDATE), fires to Workflow 3's or Workflow 4's webhook based on qualified. Not an n8n-internal If-branch — see reasoning below.</td>
</tr>
</tbody>
</table>

Phase 4 reasoning: if Workflow 2 crashed after writing qualification_results but before an internal call to Workflow 3/4, an internal-branch design would leave a qualified lead with a result row and no booking email, with nothing to signal the failure. Making the qualification_results write itself the trigger point means Workflow 3/4 don't depend on Workflow 2 staying alive one extra step.

### Rule implementation notes

| **\#** | **Rule** | **Implementation note** |
|----|----|----|
| 1 | Required fields present | Non-empty check against the exact §4.2 field list. |
| 2 | Email valid, not disposable | Regex + a maintained disposable-domain package (pinned dependency), not a hand-maintained list — §4.1's "mailinator, tempmail, etc." is illustrative, not exhaustive, and will go stale. |
| 3 | No duplicate prospect | SELECT count(\*) FROM prospects WHERE email = ?. Runs in Phase 1, before any write this run — no self-match possible. |
| 4 | Problem maps to a service | Category list confirmed by Aaron (Automation, Systems Integration, AI Systems, Business Intelligence, Dashboards, Workflow Optimization), matching the live Solutions() component. Case-insensitive substring match against the seed keyword list below — substring, not semantic matching, per §4.1's "deterministic, no AI" constraint. v1 draft; refine against real submissions, not before. |
| 5 | Budget not exploring | Match against the literal §4.2 enum value exploring — not the §4.1 prose gloss ("just exploring / no budget"), which isn't a real enum value. |
| 6 | Timeline not someday | Match against the literal §4.2 enum value no urgency — same correction as Rule 5; §4.1's "someday" is descriptive, not the field value. |
| 7 | Tech stack disclosed | Non-empty and ≠ skip. |

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr>
<td><p><strong>⚠ Rule 3 permanently caps any returning submission at 6/7</strong></p>
<p>Rule 3 (§4.1) fails for ANY email with an existing prospects row — not just prior nurture leads, but past won clients resubmitting for new work. Confirmed via live trace 2026-07-08: a returning lead correctly reuses their existing prospect_id (Prospect Exists? → Use Existing Prospect, no re-insert, no TOCTOU misroute) and can still qualify at exactly 6/7.</p>
<p>This is safe only because the threshold is 6, not 7. If QUALIFICATION_THRESHOLD is ever raised to 7, every returning lead and every repeat client becomes structurally unqualifiable, permanently — not an error, just a silent, correct-looking decline every time. Any future threshold change must account for this before being applied.</p></td>
</tr>
</tbody>
</table>

### 

### 

### Rule 4 — Keyword Seeds (v1 draft)

Case-insensitive substring match against the “Problem in operations” field. Rule 4 passes if any keyword from any category is present — this is a pass/fail input into the 6-of-7 threshold, not a per-category assignment; qualification_results does not currently store which category matched. Overlap between categories (e.g. “streamline” under both Automation and Workflow Optimization) is harmless for this reason. Starting list — refine against real submissions rather than trying to make it exhaustive up front.

| **Category** | **Keyword / phrase seeds** |
|----|----|
| **Automation** | automate, automation, manual, repetitive, by hand, copy-paste, data entry, slow, time-consuming, tedious, RPA, robotic process, eliminate manual work |
| **Systems Integration** | integrate, integration, connect, sync, API, doesn't talk to, disconnected systems, silo, silos, multiple systems, migrate data, single source of truth, consolidate |
| **AI Systems** | AI, artificial intelligence, machine learning, chatbot, agent, LLM, predictive, generative, smart assistant, AI-powered, recommendation engine |
| **Business Intelligence** | analytics, reporting, business intelligence, insights, KPI, metrics, data analysis, forecasting, trend, data-driven, benchmarking |
| **Dashboards** | dashboard, real-time view, visualize, visualization, single pane of glass, live data, monitor performance, at-a-glance |
| **Workflow Optimization** | optimize, optimization, streamline, bottleneck, slow, inefficient, efficiency, process improvement, restructure process, simplify process |

### Threshold configuration

n8n environment variable (QUALIFICATION_THRESHOLD=6), read at evaluation time — not a new Supabase config table. A new table would itself be a schema deviation requiring a version bump; an env var satisfies §4.1's "threshold lives in config, not code" without touching the locked §3.2 schema.

### Idempotency & error handling

- qualification_results write is an upsert (above) — safe to re-run for the same submission.

<!-- -->

- Two submissions with the same email arriving concurrently could both pass Rule 3 before either's prospects row exists (TOCTOU). Accepted risk at current solo-builder volume: prospects.email UNIQUE rejects the second insert; n8n's error branch catches the constraint violation and routes it to Workflow 4 as an effective duplicate rather than failing silently. Revisit if submission volume increases.

- Node failures in Phase 1–3 route to n8n's error workflow + Slack alert to Aaron (SLACK_WEBHOOK_URL already provisioned) rather than failing silently — a real lead should never vanish with no trace.

## 4.2 Intake Form Fields

All fields required unless marked optional. No AI processing at this stage.

| **Field** | **Purpose / notes** |
|----|----|
| Name | Prospect's full name |
| Email | Load-bearing. Used for qualification (rules 2 + 3), booking email, deliverable delivery. |
| Company | Company name → creates or matches companies row |
| Industry | Free-select from list |
| Problem in operations | Long text. Feeds Rule 4 classifier + Prompt A context. |
| Tech stack | Long text. Current tools in use. |
| Timeline | Enum: \<1mo / 1–3mo / 3–6mo / 6mo+ / no urgency |
| Budget range | Enum: under-2500 / 2500-7500 / 7500-20000 / 20000-plus / exploring |
| Goals & desired outcomes | Long text. Feeds Prompt A. |
| Consent checkbox | Two-party recording disclosure. Required for discovery call recording. |

# 5. Discovery Call Subsystem

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr>
<td><p><strong>■ This section replaces v1 §5 (VAPI Voice Discovery Assistant) in full.</strong></p>
<p>The v1 flow used AI voice agent Nova to conduct a 20–25 min pre-booking discovery. This entire subsystem was removed in v2. Discovery is now a human call between Aaron and the prospect.</p></td>
</tr>
</tbody>
</table>

## 5.1 Call Mechanics

- Platform: Zoom or Google Meet (Aaron's choice per call). Calendly booking includes the meeting link.

- Recording: Aaron enables recording at the start of the call. Two-party consent has already been captured via the intake form checkbox — Aaron restates it verbally as courtesy.

- Duration target: 30–45 minutes.

- Aaron's prep: manual research (LinkedIn, company website, prior activity_logs). No AI-generated pre-brief in v2.

## 5.2 Post-Call Upload Flow

After the call, Aaron uploads the audio file to a designated Supabase Storage bucket. Everything downstream is automatic.

| **\#** | **Step** |
|----|----|
| 1 | Aaron drops audio file into Supabase Storage bucket: discovery-recordings/{prospect_id}/ |
| 2 | n8n watcher polls bucket every 60s (or Storage webhook if enabled) |
| 3 | n8n creates discovery_sessions row: recording_url set, transcription_status = pending |
| 4 | n8n sends audio to Whisper API |
| 5 | On Whisper response: n8n writes transcript to discovery_sessions.transcript, sets transcription_status = complete |
| 6 | n8n triggers Prompt A (post-call analysis) — see §6.1 |
| 7 | On Claude response: n8n writes structured JSON to post_call_analyses, sets status = pending_review |
| 8 | n8n creates HubSpot task for Aaron: "Gate \#1 review: {prospect_name}" |

# 6. AI Prompt Contracts

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr>
<td><p><strong>■ Prompt text lives in a separate Prompt Library document.</strong></p>
<p>This section defines contracts only — what each prompt receives as input, what shape it must produce as output, and the execution order. The actual system-prompt text (role framing, JSON schemas, few-shot examples, failure modes) lives in NogalSolutions_Prompt_Library_V1.docx, versioned independently of this Spec. Reason: prompt text iterates constantly based on real output quality; the Spec is a stable contract that should not version-bump every time a word changes in a prompt. Write the Prompt Library when Phase 3 begins.</p></td>
</tr>
</tbody>
</table>

## 6.1 Prompt A — Post-Call Analysis

Input: Whisper transcript + intake form submission. Output: structured JSON matching post_call_analyses schema.

Output JSON fields:

- business_profile: {current_ops, workflows, tech_stack_detailed, team_structure}

- pain_points: array of {description, severity, evidence_quote}

- goals: array of {description, timeline, success_metric}

- automation_opportunities: array of {description, estimated_effort, expected_value}

- open_questions: array of clarifying questions the transcript did not resolve

- red_flags: array of concerns (misaligned expectations, budget mismatch, scope creep signals)

- summary_for_aaron: 3–5 sentence executive summary

## 6.2 Prompts B1–B7 — Sequenced Deliverable Generation

7 prompts executed in strict order. Each receives all prior prompt outputs as context, ensuring downstream deliverables reference upstream ones.

| **\#** | **Prompt** | **Input / Output** |
|----|----|----|
| B1 | Architecture | Input: Prompt A output. Output: proposed systems architecture solution design (jsonb). |
| B2 | Spec | Input: Prompt A + B1. Output: technical specification referencing B1 architecture. |
| B3 | Roadmap | Input: Prompt A + B1 + B2. Output: phased implementation checklist matching B2 spec. |
| B4 | SOP | Input: Prompt A + B1 + B2 + B3. Output: client-facing standard operating procedure. |
| B5 | Proposal | Input: all of A + B1–B4. Output: commercial proposal body. References scope from B2, timeline from B3. |
| B6 | Pricing | Input: all of A + B1–B5. Output: pricing draft with rationale. Aaron sets the final number. |
| B7 | T&C | Input: all of A + B1–B6. Output: terms and conditions referencing B4 SOP and B6 pricing. |

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr>
<td><p><strong>■ Why sequenced, not parallel.</strong></p>
<p>Parallel is faster (~30s vs 3min) but produces docs that do not know about each other. Sequenced ensures the Proposal cannot promise deliverables the Spec does not cover, and the Roadmap phases match the Spec. The latency does not matter because no human is watching this run.</p></td>
</tr>
</tbody>
</table>

# 7. n8n Workflows

10 workflows total. Each has one trigger and one purpose. Reviewing them in isolation must be possible.

| **\#** | **Workflow** | **Trigger → Purpose** |
|----|----|----|
| 1 | Intake ingestion | Webhook from Supabase intake_submissions insert → send auto-acknowledgment email. (Does not create companies/prospects rows — see §4.1a.) |
| 2 | Qualification | Independent trigger on intake_submissions insert (parallel to Workflow 1, not chained off it) → apply 7 rules, create companies/prospects rows, write qualification_results, branch to Workflow 3 or 4. Full architecture: §4.1a. |
| 3 | Qualified handoff | Send booking email with Calendly link. Push prospect to HubSpot (one-way mirror). Slack alert to Aaron. |
| 4 | Not-qualified decline | Send polite decline + free resource. Mark prospect as nurture in Supabase + HubSpot. |
| 5 | Recording watcher | Poll Supabase Storage / Storage webhook → send new audio to Whisper → write transcript. |
| 6 | Post-call analysis | Trigger on transcript complete → run Prompt A → write post_call_analyses (pending_review) → HubSpot task for Aaron. |
| 7 | Sequenced generation | Trigger on Gate \#1 approval webhook from HubSpot → run Prompts B1–B7 in sequence → write deliverables rows. |
| 8 | Revision loop | Trigger on negotiation notes from Aaron → re-run affected B-prompts only → new deliverable versions. |

## 7a Workflows 3 & 4 — Shared Sub-workflow Architecture

Architecture decision record, drafted by Claude (Architect role, §10.1) for Claude Code CLI implementation per the §10.2 handoff protocol. Resolves how Workflows 3 and 4 avoid duplicating status-update and logging logic without merging into a single workflow.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr>
<td><p><strong>Design decision, not a bug fix — merging 3 and 4 into one workflow was considered and rejected</strong></p>
<p>§7 states plainly: “8 workflows total. Each has one trigger and one purpose. Reviewing them in isolation must be possible.” Merging Workflows 3 and 4 into a single workflow would violate this directly — one save touching both the qualified-handoff path (Calendly, HubSpot) and the decline path (Resend, nurture status) at once, the same shared-surface risk already seen elsewhere in this project (systemic privilege grants, a stale browser tab racing a programmatic patch).</p>
<p>The genuine duplication between the two paths — both need to resolve the prospect record and update its status — is real, but it's resolved by extracting that shared step into a reusable sub-workflow, not by merging the entry points. Each of Workflow 3 and 4 keeps its own trigger, its own external-API surface, and its own isolated review surface, exactly as §7 requires.</p></td>
</tr>
</tbody>
</table>

### Shared sub-workflow: Resolve Prospect + Update Status

Called via n8n's Execute Workflow node from both Workflow 3 and Workflow 4 — not a webhook-triggered workflow itself, so it does not appear as a 9th row in §7's inventory; it has no independent trigger of its own.

| **Step** | **Detail** |
|----|----|
| Input parameters | intake_submission_id (uuid), qualified (boolean) |
| 1\. Resolve prospect | intake_submissions.prospect_id → fetch the full prospects row (email, full_name, company_id). This lookup exists because qualification_results only carries intake_submission_id, not prospect_id directly — both calling workflows need the resolved prospect record before they can do anything useful with it. |
| 2\. Update status | UPDATE prospects SET status = 'qualified' WHERE qualified = true, else status = 'nurture' (§3.3 — literal enum value is nurture, never disqualified). |
| 3\. Log activity | INSERT INTO activity_logs: prospect_id (resolved above), event_type = 'prospect.qualified' or 'prospect.nurture', occurred_at = now(), metadata = {from_status: 'new', to_status: '\<qualified\|nurture\>', rule_count: 7} — matches the metadata shape already illustrated in §3.2.10. |
| Output | Returns the resolved prospect record (id, email, full_name, company_id) so neither calling workflow needs a second lookup just to send an email or push to HubSpot. |

### Workflow 3 — Qualified handoff (unique responsibilities only)

- Trigger: webhook from notify_n8n_qual_branch, qualified = true path (§4.1a Phase 4).

- Call the shared sub-workflow with qualified = true.

- Send booking email with Calendly link, using the resolved prospect's email/name from the sub-workflow's return value.

- Push prospect to HubSpot (one-way mirror, per §8.1).

- Slack alert to Aaron.

### Workflow 4 — Not-qualified decline (unique responsibilities only)

- Trigger: same webhook, qualified = false path.

- Call the shared sub-workflow with qualified = false.

- Send polite decline email + free resource link.

- HubSpot Contact upsert (by email), no Deal and no pipeline stage — resolves the original §1.3/§7 disagreement (§1.3 said Supabase-only, §7 row 4 said Supabase + HubSpot; §7a previously sided with §1.3 without flagging the conflict). Contact-only, decided 2026-07-08: gives future re-engagement visibility without cluttering the sales pipeline with non-deals. This is why the upsert-by-email design in Workflow 3's Contact push matters: when a nurture lead later resubmits and qualifies, Workflow 3 finds and reuses this same Contact rather than creating a disconnected second one — confirmed structurally sound by the Phase 2 reactivation trace (2026-07-08).

# 7b. Workflows 5–8 — Architecture Decision Record

Architecture decision record, drafted by Claude (Architect role, §10.1) for Claude Code CLI implementation per the §10.2 handoff protocol — same status as §7a. Resolves the workflow-level design gaps left open after Prompt Library v1 defined the AI-contract layer for Workflows 6–8, and Roadmap Phase 3 defined Workflow 5's happy path. Four decisions, made with Aaron 2026-07-12: Workflow 5's trigger and failure handling, Workflow 7's idempotency/resume semantics, Workflow 8's revision-scope selection mechanism, and the Gate \#1/#2 HubSpot field mappings.

### 7b.1 Workflow 5 — Recording Watcher / Transcription

- **Trigger:** Supabase Database Webhook on storage.objects INSERT, scoped with WHERE bucket_id = 'discovery-recordings'. Same reactive pattern as Workflows 1 and 2 (webhook off a table insert) — not a new polling mechanism, so the pipeline has one trigger convention throughout, not two.

- **Path parsing:** the webhook payload's record.name gives the {prospect_id}/... path (per the SOP naming convention already in Roadmap Phase 3); Workflow 5 resolves prospect_id from this path when creating the discovery_sessions row.

- **Failure handling:** transcription_status extended to 'pending' \| 'complete' \| 'failed' (schema change below). On a Whisper API error, retry once; on second failure, set transcription_status = 'failed' and Slack-alert Aaron with prospect name + error detail — same retry-once-then-hard-fail shape as the Prompt Library's Claude-call failure protocol (§8 there), applied one layer earlier to the Whisper call.

- **Recovery:** a 'failed' row is manually re-run by Aaron once the underlying issue (bad audio, expired signed URL, etc.) is fixed. Single-call step — no resume/idempotency logic needed here, unlike Workflow 7.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr>
<td><p><strong>⚠ Required schema change.</strong></p>
<p>ALTER TYPE transcription_status ADD VALUE 'failed'; — non-transactional per §3.3's existing note on enum additions. This is a DDL change to the locked v2.8 schema and goes through the standard DB-write hard gate (exact SQL presented, explicit go-ahead required) before being applied, executed by whichever session holds the live Supabase connection — not this one.</p></td>
</tr>
</tbody>
</table>

### 7b.2 Workflow 7 — Sequenced Generation: Idempotency & Resume

**Problem:** Workflow 7 runs B1→B7 as seven separate Claude calls, each writing its own deliverables row. A mid-sequence crash (process restart, transient network failure) can leave a partial set of rows with no defined resume behavior — the exact gap the Prompt Library (§8) explicitly deferred to “workflow design.”

**Decision:** delete-and-restart, using existing columns — no new schema needed. A first-generation attempt is fully identified by (prospect_id, version = 1, revision_loop_id IS NULL), reusing the same single-direction-relationship principle already established in §3.5 rather than introducing a redundant generation_run_id.

On Workflow 7 start, count deliverables rows matching (prospect_id, version = 1, revision_loop_id IS NULL):

| **Count** | **Meaning** | **Action** |
|----|----|----|
| 0 | Fresh run | Start at B1 |
| 1–6 | Previous attempt died mid-sequence | Delete those rows, restart clean from B1 |
| 7 | Already complete | Should not be re-triggered by a legitimate Gate \#1 approval — log + Slack-alert Aaron rather than silently regenerating or no-op'ing; implies an upstream double-fire |

### 7b.3 Workflow 8 — Revision Scope Selection

**Decision:** a structured HubSpot multi-select property (one option per deliverable type: Architecture, Spec, Roadmap, SOP, Proposal, Pricing, T&C) drives Workflow 8's dispatch — not free-text classification by an LLM.

Free-text negotiation notes remain the content fed into the revision prompt (Prompt Library §7.1, the {{ revision_notes }} block); the multi-select is purely the dispatch mechanism and stays separate from prompt content.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr>
<td><p><strong>Design decision — structured dispatch, not AI-inferred scope</strong></p>
<p>Consistent with Rule 3 (deterministic where possible) and the existing Gate #1/#2 pattern — Aaron makes the explicit scope decision, the system executes deterministically on top of it, rather than an LLM inferring scope from prose ahead of a dispatch decision. The latter would reintroduce the AI-as-gatekeeper risk Rule 2 exists to prevent, for a decision that costs Aaron two seconds to make directly.</p></td>
</tr>
</tbody>
</table>

## 7b.4 Gate \#1 / Gate \#2 — HubSpot Field Mapping

Both objects follow the same split-by-risk principle: plain-string fields are directly editable; machine-structured or array-of-object fields are read-only, with corrections routed through a hold + note + targeted re-run rather than hand-edited JSON.

**PostCallAnalysis custom object (Gate \#1)**

- **Directly editable:** business_profile.current_ops, .workflows, .tech_stack_detailed, .team_structure (four properties); summary_for_aaron. Plain strings, trivial reconstruction back into the analysis jsonb.

- **Read-only (formatted text):** pain_points, goals, automation_opportunities, open_questions, red_flags. Structural corrections don't happen via inline edit — Aaron holds the record, uses the existing notes field (post_call_analyses.notes) to record what's wrong, and Prompt A re-runs. Consistent with notes' existing schema purpose (“rationale for inline edits made pre-approval”).

**Deliverable custom object (Gate \#2)**

- **Directly editable:** title, client_company, executive_summary (plain strings).

- **Directly editable, single concatenated markdown property:** sections\[\] — rendered as “## heading” + body_markdown blocks concatenated in document order, reconstructed back into sections\[\] by splitting on \## boundaries on save. This is the primary pre-send prose-editing surface Gate \#2's “edit” action is meant for.

- **Read-only:** type_payload. Machine-structured, feeds the Prompt Library's deterministic validators (e.g. B6's draft_total_usd = sum(line_items), B2/B5's FR cross-references). Corrections go through hold + note + single B-prompt re-run — same principle as Gate \#1's array fields.

- **Read-only (formatted text):** assumptions, source_refs, revision_summary (reference-only; revision_summary populated only on Workflow 8 runs).

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr>
<td><p><strong>✓ Resolved 2026-07-12 — pre-send correction versioning.</strong></p>
<p>Decision (Option B): a Gate #2 hold-and-regenerate still increments deliverables.version, but revision_loop_id stays NULL to mark it as a pre-send correction rather than a post-negotiation revision. This preserves the audit trail your own schema already protects elsewhere (§3.5's generated_at/reviewed_at/sent_at reasoning) — overwriting version = 1 in place would have silently discarded what Gate #2 caught and fixed before send. Implementation consequence, not a new decision: the Gate #2 queue definition (§8.2) must select the latest version per (prospect_id, type) with status = pending_review, not just any row with that status — otherwise a superseded version 1 and its correction (version 2) would both appear as pending review.</p></td>
</tr>
</tbody>
</table>

**Schema changes this ADR requires** (both subject to the DB-write hard gate, executed later, not in this session): (1) ALTER TYPE transcription_status ADD VALUE 'failed'; (2) no changes required for the Workflow 7 idempotency decision — it reuses existing deliverables columns.

**HubSpot-side changes** (not a production DB gate, but still subject to Aaron's node-by-node review per §10.2 when built): PostCallAnalysis custom object properties per §7b.4; Deliverable custom object properties per §7b.4; new multi-select property for Workflow 8 scope selection.

# 7c. AI Provider Migration — OpenRouter (Architecture Decision Record)

Architecture decision record, drafted directly by Claude Code CLI (Builder role, §10.1) with Aaron in this session — an exception to the usual Architect-drafts / Builder-implements split, at Aaron's explicit direction, following a 2026-07-13 consultation with outside AI/ML engineers. Supersedes the OpenAI/Whisper choice in §7b.1 for Workflow 5's transcription step, and establishes the provider baseline for Workflows 6–8's Claude calls (previously implied as direct Anthropic API by the Prompt Library). Four decisions below, made directly with Aaron.

**Decision 1 — Transcription (Workflow 5).** Whisper Large V3 via OpenRouter's /api/v1/audio/transcriptions endpoint, replacing direct OpenAI Whisper-1 (§7b.1's original choice). Verified pricing: \$0.0015/min via OpenRouter vs. \$0.006/min direct OpenAI — a 4x reduction. Same underlying model, so no expected change to transcription accuracy; this is a routing/cost change only, not a quality tradeoff.

**Decision 2 — Prompt A / B1–B7 (Workflows 6–8).** Anthropic model access moves from the direct Anthropic API to OpenRouter's /api/v1/chat/completions endpoint, using an OpenRouter-qualified Anthropic model slug. Prompt text, JSON contracts, and the failure protocol (Prompt Library §8) are unaffected — this is a transport-layer change only, not a prompt or contract change, so it does not trigger the Prompt Library's contract-change review path (§9 there).

**Decision 3 — Credentials.** ANTHROPIC_API_KEY and OPENAI_API_KEY are retired; replaced by a single OPENROUTER_API_KEY. Aaron provisions the OpenRouter account and API key directly and creates the corresponding n8n credential himself — consistent with standing practice; no AI session enters API keys on his behalf.

**Decision 4 — Rebuild scope.** Workflow 5 (built and mid-test on the OpenAI path as of 2026-07-13) is rebuilt against OpenRouter rather than finishing the OpenAI-based test — Aaron's explicit call, given bugs already hit during that test made finishing it just additional throwaway work. Workflows 6–8 (not yet built) are built OpenRouter-native from the start; no migration needed for those.

**Rejected approach — DeepSeek V4 Flash / Tencent HY3 for transcription.** Initial consultation suggested DeepSeek V4 Flash and Tencent HY3 for the transcription step, for cost efficiency on what was framed as a lightweight, deterministic task. Rejected after verification: both are text-only reasoning LLMs with no audio input capability (priced per text token, not per minute of audio) — a voice pipeline using them still requires a separate real ASR step upstream, since they never see audio directly. Not viable for transcription regardless of provider; likely a miscommunication in relaying the original advice, not a considered recommendation to override.

**Required verification before implementation.** Not yet done, flagged for whoever implements: (1) confirm OpenRouter's /api/v1/audio/transcriptions response shape matches (or requires adapting) the {text: "..."} shape Workflow 5's transcript-writing step expects; (2) confirm the exact OpenRouter model slug for whichever Claude model Aaron currently pins via ANTHROPIC_MODEL.

**Schema / env var impact.** §11 env vars: OPENROUTER_API_KEY replaces ANTHROPIC_API_KEY and OPENAI_API_KEY; ANTHROPIC_MODEL is retained (still a pinned exact-string env var) but now holds an OpenRouter-qualified slug instead of Anthropic's native model string; TRANSCRIPTION_MODEL is added, pinned to openai/whisper-large-v3 per Decision 1. See §11 for the updated table.

# 7d. Workflows 9 & 10 — Presentation & Send Flow (Architecture Decision Record)

Architecture decision record, drafted directly by Claude Code CLI with Aaron in this session. Closes the gap left open by the Roadmap's Phase 5 Send flow bullet, which named the intent (generate PDF from content jsonb, email to prospect) but specified no trigger, tooling, storage, precondition, or scope. Aaron's own insight drove the shape of this ADR: a presentable document needs to exist the moment he is ready to walk a client through it — the second-call proposal walkthrough §1.2 already names — not only at final send, and every revision round (Workflow 8) needs the same document refreshed for re-presentation. Since Aaron's own Gate \#2 approval is already a review gate, no separate manual render trigger is added; that would be a second gate. Three artifacts below, kept as two workflows rather than one despite sharing a purpose, per §7's one-trigger-one-purpose principle and its own precedent (Workflows 3 and 4 were explicitly kept separate for exactly this reason). Made directly with Aaron.

**Decision 1 — Shared renderer, reused by Workflows 9 and 10.** A new reusable sub-workflow (Execute Workflow child, matching the precedent already proven by Workflow 7's Generate One Deliverable child) renders title, executive_summary, and sections\[\] (markdown converted to real PDF formatting: headings, bold, lists) for all 7 types into one combined PDF, fixed order: architecture, spec, roadmap, sop, proposal, pricing, tc. type_payload is excluded from the client-facing document — sections is for the human reader, type_payload is what downstream automation reads and validates. Uses a fixed NogalSolutions branding template (logo, color, header/footer) built once and reusable for future client proposal drafts beyond this pipeline, per Aaron's explicit intent. Generation tool: a PDF-native JS library (pdfkit or pdf-lib) inside an n8n Code node — no new external service, credential, or cost. Storage: new Supabase Storage bucket generated-documents, same signed-URL pattern as discovery-recordings; each render stores the latest PDF for that prospect.

**Decision 2 — Workflow 9: Auto-Present on Approval.** Trigger: any Deliverable record's Status property changing to approved in HubSpot — Aaron's existing Gate \#2 review action, not a new manual trigger, since that approval is already the gate. On each such event, checks whether all 7 deliverables for that prospect are now status = approved; if yes, calls the shared renderer (Decision 1) and stores the resulting PDF. If not all 7 are approved yet, this is a normal intermediate state, not a failure — no-op, no alert. This single mechanism covers both the first presentation (after fresh generation is fully approved) and every re-presentation after a Workflow 8 revision is re-approved, with no separate revision-specific trigger needed.

**Decision 3 — Workflow 10: Send & Close.** Trigger: a new Ready to Send property (checkbox) on Client Requirements — the per-prospect record, not any individual Deliverable, matching the precedent already used for Gate \#1 approval and Workflow 8's revision trigger. Fetches the latest PDF already rendered by Workflow 9 — no re-render, the same document Aaron already presented, per his explicit call to avoid a second rendering path — and emails it to the prospect via the existing SMTP/Resend credential (§11). On success, writes sent_at = now() and status = 'sent' to all 7 deliverables rows for that prospect — HubSpot remains a view, not a store, per §8. On success, also updates the associated Deal's dealstage to contractsent (displayed as “sent” in this portal's pipeline) via a direct HubSpot PATCH — a stage-transition push per §8's existing data-flow table, not a new authoritative store. Workflow 10 deliberately does not write closedwon or closedlost; actual deal-won/lost progression remains Aaron's manual call in HubSpot once negotiation concludes. If no rendered PDF exists yet for this prospect, hard-fails clean and alerts Aaron via Slack rather than sending nothing or a stale document.

**Required verification before implementation.** (1) Confirm NODE_FUNCTION_ALLOW_EXTERNAL on the VPS permits pdfkit/pdf-lib in n8n Code nodes. (2) Set the new bucket's allowed_mime_types to application/pdf from the start — avoid repeating Workflow 5's original bucket-MIME bug. (3) Confirm what status Workflow 8 writes for a freshly revised deliverable version (expected: pending_review, matching the fresh-generation precedent) — this is what makes Workflow 9's all-7-approved check correctly go false until Aaron re-reviews the revision, and true again once he does.

**Schema / capability impact.** §1.2: "Send to client" flips from No / nothing auto-sends to Yes (n8n, Workflows 9 and 10). §7: "8 workflows total" becomes "10 workflows total." No new Postgres schema — deliverables.status/sent_at already support this; one new HubSpot property (Ready to Send) on Client Requirements, no new Supabase columns.

# 7e. Deal-Stage Progression Automation (Architecture Decision Record)

Architecture decision record, drafted by Claude Code CLI with Aaron in this session (2026-07-19), immediately following the same session that corrected §7d Decision 3 (v2.12). Closes a gap Aaron identified directly on HubSpot's own board view: the Deal created at Workflow 3's booking step never advances again until Workflow 10 sends the final proposal — every intermediate stage this portal's pipeline defines sits permanently unused, defeating the point of an automation-driven CRM.

Context. Workflow 3 already deliberately looks up and writes a Deal stage by label when creating the Deal (its Extract Qualified Stage ID node dynamically matches stage.label.toLowerCase() === “qualified” rather than hardcoding an internal stage ID — this portal's stage IDs and display labels are independently customizable, per v2.12's own closedwon/closedlost label-mismatch finding). A live-system audit (Hindsight 101) plus Aaron's own direct observation of the board view (2026-07-19) found nothing between Deal creation and Workflow 10's send ever advances that stage — confirmed against a real execution (414): the Deal jumped from “qualified” straight to “sent” in one PATCH, skipping three intermediate stages this pipeline's board already defines.

**Decision 1 — Stage-Advance Mapping.** Three additional Deal-stage writes, one per existing pipeline milestone, using the exact dynamic label-match pattern Workflow 3 already established (never hardcode an internal stage ID): Workflow 5 (Recording Watcher/Transcription) succeeding advances the Deal to the stage labeled “discovery completed” (this portal's qualifiedtobuy); Workflow 6 (Post-Call Analysis) creating the Gate \#1 review Task advances it to the stage labeled “analysis pending” (presentationscheduled); Workflow 7 (Sequenced Generation) creating the Gate \#2 review Task advances it to the stage labeled “deliverables pending” (decisionmakerboughtin). Workflow 10's contractsent write (v2.12) is unchanged. Aaron confirmed this exact mapping (2026-07-19) — no adjustment requested.

**Decision 2 — Shared “Advance Deal Stage” Sub-workflow.** Rather than duplicating the pipeline-stage-lookup-and-PATCH logic three times inline (as Workflow 10's v2.12 fix did once), a new shared sub-workflow — parameterized by {contactId, targetStageLabel} — is called via Execute Workflow from each of Workflows 5, 6, and 7, matching this project's existing precedent for reusable cross-workflow logic (the Resolve Prospect + Update Status sub-workflow; the shared Render Deliverables PDF sub-workflow). Internally it: fetches the deals pipeline's stage list, matches by label (Workflow 3's exact pattern — hard-fails with a clear error if no stage matches the given label, not a silent no-op), finds the Contact's associated Deal via the v4 associations endpoint (the same pattern proven working in Workflow 10's Find Associated Deal node), and PATCHes dealstage. Each calling workflow resolves its own Contact ID first: Workflows 6 and 7 already resolve one for their existing Client Requirements/Deliverable-to-Contact associations and can reuse it directly; Workflow 5 has no existing HubSpot interaction today and needs a new Contact-by-email lookup first, using the prospect's email already available via discovery_sessions — prospects.

**Failure handling.** Matching Workflow 10's v2.12 precedent, a stage-advance failure does not fail the calling workflow's primary job (transcription, analysis, or generation) — it is a secondary CRM sync, per §8 (“HubSpot remains a view, not a store”). Each calling workflow alerts via its own existing Slack pattern on failure rather than hard-failing its main task.

**Naming caveat.** Aaron flagged (2026-07-19) that “discovery scheduled” named the wrong moment — Workflow 5 succeeding means the call already happened and was transcribed, not that it's upcoming — so Decision 1 above uses “discovery completed” instead. “analysis pending” and “deliverables pending” are unchanged for now, though Aaron expects to refine this portal's stage-label naming further once tailoring the CRM to real client work. This ADR binds to behavior — which milestone advances the Deal — not to the literal label text; the label-match pattern in Decision 2 means any future relabel needs no workflow code change, only Aaron updating the label text passed as each workflow's targetStageLabel parameter (and the matching live HubSpot stage label itself, per Required verification (3) below).

**Required verification before implementation.** (1) Confirm Workflow 5's discovery_sessions — prospects email-resolution path is reliable before adding a first-ever HubSpot dependency to a workflow that currently has none. (2) Confirm the shared sub-workflow's label-match failure mode (stage not found) surfaces clearly rather than silently no-op'ing, matching Workflow 3's own throw new Error(...) precedent. (3) Aaron renames the live HubSpot pipeline stage currently labeled “discovery scheduled” to “discovery completed” (his own HubSpot config action) before this is built — the label-match pattern in Decision 2 depends on the live label matching exactly what each workflow passes as targetStageLabel.

**Schema / capability impact.** No new Postgres schema, no new HubSpot properties. §7's workflow count is unaffected in the pipeline-workflow sense — the new shared sub-workflow is not separately counted, matching the existing precedent that Resolve Prospect + Update Status and Render Deliverables PDF also aren't counted in “10 workflows total.”

# 7f. Discovery Recording Dropzone Automation (Architecture Decision Record)

Architecture decision record, drafted by Claude Code CLI with Aaron in this session (2026-07-20), following the first live exercise of §7e's Deal-stage-advance branches, which surfaced a real production mistake worth closing.

Context. Aaron used intake_submissions.id (a different table's own primary key) instead of prospects.id when creating the discovery-recordings/{prospect_id}/ folder by hand, causing two Workflow 5 executions to fail with a foreign-key violation before the correct folder was found. Today only Aaron conducts discovery calls and drops the recording himself; this ADR anticipates the process eventually including an employee or the client's own team, where a wrong-ID mistake becomes more likely, not less. A related, separately-found issue - creating a folder via Supabase Storage's own dashboard UI auto-generates a .emptyFolderPlaceholder object, which Workflow 5's trigger was treating as a real recording upload - was fixed independently as a defensive guard inside Workflow 5 itself, since it corrects existing behavior rather than adding new capability, and is not part of this ADR.

Decision. A new shared sub-workflow, Provision Discovery Recording Dropzone, triggered immediately after Workflow 3 (Qualified Handoff) successfully creates the Deal. It creates the discovery-recordings/{prospect_id}/ folder directly via the Supabase Storage API - not the dashboard UI - using the real prospect_id read from the just-created booking, never typed by a human, and sends a Slack message naming the prospect, the exact folder path already created and ready to receive the file, and a short reference code (the last 6 characters of prospect_id, uppercased) for a quick visual double-check. The message is written so it can be forwarded as-is to whoever is actually dropping the recording.

Implementation note. The folder-marker object this sub-workflow creates is named .emptyFolderPlaceholder - the same name Supabase's own dashboard UI creates when a folder is made manually - so Workflow 5's existing guard already excludes it, with no further change required.

Failure handling. Matching every other secondary-CRM/notification side effect in this pipeline (§7d, §7e), a failure to create the folder or send the Slack message does not fail Workflow 3's primary booking job. It is a non-blocking follow-on step, alerted via the existing failure-alert pattern if it fails.

Required verification before implementation. (1) Confirm the Supabase Storage API call used to create the folder object authenticates the same way as the existing Storage writes already proven in Workflows 5 and 9. (2) Confirm the reference-code truncation (last 6 characters of a UUID) is visually distinct enough in practice to prevent mismatches between concurrent engagements; if two prospects happen to share the same last 6 characters, the truncation rule can be lengthened. (3) Confirm which Slack destination is right - the shared pipeline-activity channel, since this message doubles as an actionable instruction rather than a pure status ping, or a direct message; Aaron's call.

Schema / capability impact. No new Postgres schema, no new HubSpot properties. §7's workflow count is unaffected in the pipeline-workflow sense - the new shared sub-workflow is not separately counted, matching the existing precedent for Resolve Prospect + Update Status, Render Deliverables PDF, and Advance Deal Stage.

# 7g. Outbound Discovery Bootstrap (Architecture Decision Record)

Architecture decision record, drafted by Claude Code CLI with Aaron in this session (2026-07-21), building on the outbound-entry-route design Codex produced on 2026-07-20 (Baton-Pass 137) and this session's own live-inspection review of it.

Context. Every prospect currently enters the pipeline through the website intake form (Workflows 1-4), which assumes the client is the one who found NogalSolutions and submitted a form. Aaron also wants to pursue prospects he sources directly - cold outreach, referrals, networking - where he books the call himself and the client will typically host the Zoom/Google Meet, so no website form submission ever happens. Workflow 6 (Post-Call Analysis) already depends on an intake_submissions.payload row existing for the prospect - it fetches the latest one and falls back to an empty object if none exists, silently degrading Prompt A's context quality rather than failing loudly. An outbound entry route therefore cannot simply drop a recording into Workflow 5; it must first create the same Supabase and HubSpot context the website-form path builds automatically, or Workflow 6 quietly loses input it currently always has.

Decision. A new workflow, Outbound Discovery Bootstrap, triggered by a private (non-public) n8n Form Trigger that Aaron fills in himself after deciding to open a discovery-call route with a prospect he found. It performs, in order: (1) find-or-create the company by domain/name, and find-or-create the prospect by exact email match; (2) insert an intake_submissions row carrying Aaron's outreach notes as context, tagged by source (see Schema impact below) so it is never mistaken for a real website submission; (3) upsert the HubSpot Contact and find-or-create the Company; (4) dynamically resolve the qualified Deal-stage ID and the Contact/Company association type IDs, the same way Workflow 3 already does, and create the Deal - reusing an existing open Deal for that Contact if one exists, rather than creating a duplicate (see "Returning prospect" below); (5) call the existing "Provision Discovery Recording Dropzone" shared sub-workflow and Slack Aaron the folder path and reference code, identical to Workflow 3's own use of it; (6) append an activity_logs entry recording the bootstrap event. From here the prospect converges into the existing pipeline unchanged - Aaron records the call (bot-free, Krisp or Otter Desktop, per "Consent and disclosure" below), uploads the file into the provisioned folder, and Workflows 5 through 10 run exactly as they do today.

No automated qualification (Workflow 2) runs for this route. Aaron's own decision to open an outbound discovery conversation with a specific prospect is the qualification gate - he does not cold-call unqualified leads. See "Qualification-bypass rationale" below.

No AI Agent, LLM Chain, or other non-deterministic node performs identity resolution, matching, association, or provisioning in this workflow - every one of those operations uses exact deterministic keys (email for prospect/Contact matching, domain or exact name for company matching), matching this pipeline's existing standing convention that identity-critical CRM writes are never left to a model's judgment.

Implementation note - reuse over rebuild. Workflow 3's own identity-resolution-and-Deal-creation logic (Contact upsert, Company find-or-create, pipeline-stage lookup, both association-type-ID lookups, Deal creation - roughly 10 of Workflow 3's 21 nodes) is the same logic this workflow needs. Recommended sequencing: build the Outbound Discovery Bootstrap standalone first, matching Workflow 3's proven node-for-node pattern rather than sharing a sub-workflow with it, so this new build can be reviewed and proven in isolation without touching a live, active workflow. Once both routes are live and independently proven, extracting that shared block into its own sub-workflow (following this project's existing precedent - Resolve Prospect, Advance Deal Stage, and Provision Discovery Recording Dropzone were all built once and then extracted) is a worthwhile follow-up refactor, but it is explicitly out of scope for this ADR and should be its own separately reviewed change against Workflow 3.

Failure handling. Same pattern as every other workflow in this pipeline: each phase (Supabase writes, HubSpot writes, dropzone provisioning) fails loudly with a Slack alert on error rather than continuing on partial state; no partial-write guarantee is weaker than what Workflows 3-10 already provide.

Returning prospect. If find-or-create locates an existing prospect/Contact by email, reuse the existing Contact and Company, and reuse an existing open Deal for that Contact if one exists rather than creating a second one; only create a new Deal if none is currently open. This applies the same way regardless of how the existing record originated - a prior inbound submission that never qualified is treated identically to a prior outbound attempt; prior history is useful context for the new engagement, not a reason to fork the identity-resolution behavior. Confirmed by Aaron (2026-07-21).

Qualification-bypass rationale. Aaron's own decision to initiate outbound contact is a sufficient substitute for Workflow 2's rule-based qualification, and no qualification_results row is written for outbound prospects. Confirmed safe: qualification_results has no downstream foreign-key dependents (checked directly against the live schema) - nothing later in the pipeline requires a qualification_results row to exist. Confirmed by Aaron (2026-07-21).

Consent and disclosure. The private outbound form includes a required checkbox confirming Aaron has disclosed, or will disclose before recording starts, that the call will be recorded and transcribed, logged as an activity_logs entry (event_type: outbound_consent_confirmed) at bootstrap time. Confirmed by Aaron (2026-07-21).

Private form fields. Prospect full name, email (required, used as the dedupe key), company name, company website (optional), Aaron's outreach/context notes (free text, becomes the intake_submissions payload), and the consent checkbox from the decision above. Confirmed by Aaron (2026-07-21).

Required verification before implementation. (1) Confirm the "Provision Discovery Recording Dropzone" sub-workflow's Execute Workflow contract (expected input fields) matches what this new workflow will pass - re-fetch it directly rather than assuming Workflow 3's exact shape carries over unchanged. (2) Confirm the private Form Trigger is not publicly discoverable (no link exposed anywhere on the public website) before activation.

Schema / capability impact. New Postgres enum intake_source with values website and outbound_discovery; new column intake_submissions.source intake_source not null default 'website' (backward-compatible default preserves every existing row's meaning without a data migration). Workflow 6's existing intake_submissions.payload fetch is unchanged - it already tolerates an empty object and needs no code change to also tolerate an outbound-sourced payload. §7's workflow count is unaffected in the pipeline-workflow sense per the existing shared-sub-workflow-doesn't-count precedent, but Outbound Discovery Bootstrap itself is a new primary workflow (not a shared sub-workflow), the first new entry point since Workflow 4.

# 7h. Inbound Discovery Prep Integration (Architecture Decision Record)

Architecture decision record, drafted by Claude Code CLI with Aaron in this session (2026-07-22), extending the standalone Job Post Analyzer utility (built and proven earlier this same session, outside this Spec's governed pipeline - the same category as the AI Job Scraper workflow) into the inbound flow at Aaron's request.

Context. The Job Post Analyzer utility gives Aaron AI-drafted discovery questions the moment he pastes a freelance job post into a dedicated Slack channel, before he decides whether to pursue it - solving a real problem where he already understands a given opportunity but writing well-refined questions by hand took roughly an hour. Aaron asked for the same capability on inbound leads: prospects who submit the website intake form and get qualified through Workflows 1-4 already have a discovery call booked, and deserve the same kind of AI-drafted pre-call prep, not just outbound leads he is still deciding whether to chase.

Decision. A new branch is added to Workflow 3 (Qualified Handoff), parallel to its existing Send Pipeline Activity Alert and Prepare Dropzone Input branches off HubSpot: Create Deal. This branch reads the prospect's intake_submissions.payload, normalizes its free-text content into the same shape the outbound tool's pasted text already provides, and runs it through the same AI-analysis pattern - an LLM Chain (OpenRouter, DeepSeek V4 Flash - a pure text-in/text-out model choice, unrelated to §7c's earlier rejection of the same model family for audio transcription, which concerned audio input capability specifically and does not apply to this text-only task) with a Structured Output Parser enforcing the five-field schema (client intent summary, stated scope, implied scope, discovery questions grouped by theme, watch-outs) - then posts the result to the same Slack channel the outbound tool already uses.

Trigger condition. Fires only for qualified prospects, at the same point in Workflow 3 where the Deal, Contact, and Company already get created - not on the raw intake form submission. Triggering earlier would spend an AI call and post a Slack message for every lead Workflow 2 is about to reject, including ones Workflow 4 declines seconds later. Confirmed by Aaron (2026-07-22).

Channel decision. Rather than a second Slack channel, the existing \#job-post-intake channel is renamed to \#discovery-prep and reused for both paths, with every message labeled by source (outbound vs. inbound) so the two remain visually distinguishable in one stream. This is a cosmetic choice, not a functional one: a channel rename does not change its Slack ID, so the outbound workflow's Slack Trigger node needs no reconfiguration, and its existing 'Usernames or IDs to Ignore' guard already excludes the shared bot's own posts regardless of which flow generated them - so an inbound-generated message cannot re-trigger the outbound analysis path. Confirmed by Aaron (2026-07-22).

Implementation note - reuse deferred. Job Post Analyzer's AI-analysis logic (LLM Chain, Chat Model, Structured Output Parser, prompt) is intentionally duplicated into the new Workflow 3 branch rather than extracted into a shared sub-workflow at this time, matching §7g's own precedent: prove each route standalone first, without touching an already-tested workflow while building a new one, and treat extraction into a shared sub-workflow as a deliberate follow-up refactor once both paths are live and independently proven.

Failure handling. Same non-blocking pattern as Workflow 3's other parallel branches (Pipeline Activity Alert, dropzone provisioning): a failure here posts a Slack alert and has no effect on the booking email, HubSpot Contact/Company/Deal, or dropzone provisioning, all of which complete independently.

Required verification before implementation. (1) Confirm which intake_submissions.payload field(s) actually carry free-text prospect notes suitable as AI input - re-fetch the live intake form schema rather than assuming a field name. (2) Confirm the \#discovery-prep channel rename does not break any reference to the old \#job-post-intake name elsewhere (none found in a search of this pipeline's other workflows as of this writing, but re-check directly before renaming).

Schema / capability impact. No new Postgres schema. No new HubSpot properties. §7's workflow count is unaffected - this is a new branch on an existing workflow, not a new primary or shared workflow, matching the same non-counting treatment already established for §7e's and §7f's branch/sub-workflow additions.

# 7i. Deposit-Gated Closed-Won & Onboarding Kickoff (Architecture Decision Record)

Architecture decision record, drafted by Claude Code CLI with Aaron across two sessions (2026-07-24), converging on a payment-gated definition of closed-won and the automated onboarding kickoff that follows it.

Correction (v2.18, 2026-07-24). Live research during this build found both intended payment rails blocked: Stripe's direct signup does not cover the Philippines (Stripe Atlas, incorporating a non-local entity, is the only path in — confirmed independently by both direct research and a contact in Aaron’s own developer network), and Wise's self-serve API/webhook access is documented as Business-account-only, with fuller capability (the kind needed to detect incoming money automatically) limited to a short list of countries that does not include the Philippines. Rather than keep chasing a workable payment-API integration, Aaron decided to drop automatic payment detection entirely and replace it with a human-in-the-loop confirmation gate. The Decision, chargeback, and payment-rail paragraphs below are corrected accordingly. Paragraphs describing Workflow 9's Deal-amount sync, the manual-override lock, the awaiting deposit stage, and the no-refunds policy are unaffected and unchanged from the original acceptance.

Context. Today the HubSpot Deal's dollar amount is entered by hand, and closed won is set the moment Aaron and a client verbally agree - a known, deliberate manual step the pipeline's own public case-study page already documents, flagging deal-value estimation as a real, scoped-but-not-yet-built future improvement. Aaron wants two things: a Deal is not truly closed-won until a 50% deposit is actually received - his own protection that a client is a serious paying partner, not just a verbal yes - and once that deposit lands, onboarding (welcome message, contract copy, payment receipt) fires automatically instead of being assembled by hand. This resolves the negotiating/won/lost Deal-stage behavior question parked since Progress 110: negotiating now precedes a new awaiting deposit stage, which precedes true won.

Decision (corrected, v2.18). Four pieces: three new primary workflows plus one addition to an already-live workflow. (1) Workflow 9 (Auto-Present on Approval) gains a branch that, on every Gate \#2 approval of the pricing deliverable specifically — not only the first — extracts its total figure and PATCHes the associated Deal's amount property, the single automatic source of truth for what a Deal is worth (unchanged from the original decision; already built). (2) Notify Expected Deposit, triggered by Aaron manually moving a Deal from negotiating to a new awaiting deposit stage, computes 50% of the Deal's amount and posts it to Slack so Aaron can request that exact figure from the client himself, through whatever rail he chooses — no payment API call is made. (3) Record Deposit Payment, triggered by Aaron manually checking a new Deposit Confirmed property and entering the amount he actually received, compares that entered figure against the expected 50% — a match calls the existing Advance Deal Stage sub-workflow to flip the Deal to real closed-won and then triggers (4); any mismatch (short, over, a plain typo) stops short and raises a Task/Slack alert for Aaron's manual review, the same pattern Gate \#1/#2 already use for content review, rather than guessing. (4) Send Onboarding Kit, triggered once a Deal genuinely reaches closed-won, emails the client the welcome message, a copy of the signed contract, and the payment receipt — all three as direct attachments, not a Google Drive link, matching Workflow 10's own precedent for the same reason: one less permission surface to silently break.

No AI, LLM Chain, or other non-deterministic node appears anywhere in this ADR. Every decision — amount matching, stage advancement — is rule-based, matching Rule 2 (AI prepares, humans decide) and Rule 3 (deterministic where possible) exactly. Detecting a verbal agreement itself is explicitly out of scope: Aaron rejected any AI-based call recording or transcription for the negotiation call, matching his existing boundary around the discovery call itself. Two deliberate actions by Aaron are now the only entry points into this automation: moving the Deal to awaiting deposit, and confirming the deposit’s receipt and amount once it actually lands — both replace what would otherwise have been automatic detection, per the correction above.

Deal-amount sync stays current, not one-shot. Because pricing can go through revision cycles (Workflow 8) before Aaron and a client settle on a final figure, Workflow 9's new sync branch fires on every approved pricing revision, not only the first, so the Deal's amount always reflects the latest approved total by the time negotiation concludes.

Manual override of Deal.amount is respected, not silently overwritten. If Aaron hand-adjusts the Deal's amount property himself - a discretionary correction the AI-generated pricing total doesn't capture - the sync stops writing to that Deal until Aaron explicitly signals it should resume. This pipeline has already been bitten once by an AI-generated value silently discarding a human's manual correction (Gate \#1's inline-edit fix, Progress 075); this decision applies that lesson here before it becomes a repeat, not after. Confirmed by Aaron (2026-07-24).

Chargebacks can no longer be automatically watched — this is now Aaron’s own monitoring responsibility, not something this automation detects. The original decision assumed a payment processor's webhook would surface a dispute automatically; with detection dropped entirely (see the correction above), Aaron needs to notice a dispute or reversal directly through his bank or Wise account and act on it manually, the same way he'll notice the original deposit landing. The pipeline's own no-refunds-once-signed policy still stands as the intended norm, but nothing in this build can now enforce or alert on a violation of it automatically.

Awaiting deposit has no timeout. A Deal may sit in this stage indefinitely; no reminder or stall alert exists in this ADR. Confirmed by Aaron (2026-07-24).

Payment rail is no longer this automation's concern. Both Stripe (Aaron's direct signup doesn't cover the Philippines — Stripe Atlas / incorporating a non-local entity is the only path in) and Wise’s self-serve API (Business-account-only, and even then documented as limited to a short list of countries that does not include the Philippines) turned out to have real, unresolved access barriers, confirmed independently by direct research and by a contact in Aaron's own developer network. Rather than keep chasing a workable payment-API integration, this correction drops automatic detection entirely — Aaron sends the payment request and confirms receipt manually, through whatever rail he actually used (Wise, bank transfer, or anything else), so the choice of rail has no bearing on how this automation works. PayPal remains dropped from consideration, as originally decided.

Currency: USD only. Aaron invoices exclusively in USD; no currency-aware comparison logic exists in this ADR.

A stale requested amount after a late pricing change is an accepted risk, not something this build guards against. In practice, awaiting deposit is only entered after verbal agreement, meaning the price should already be locked before Aaron requests payment from the client. Aaron accepted this as a rare, manually-recoverable edge case. Confirmed by Aaron (2026-07-24).

The remaining 50% is explicitly out of scope. Aaron's plan is to collect the remaining balance after design/architecture and implementation are complete, before official handoff to the client - a separate, not-yet-designed milestone this ADR does not build toward.

No refunds. Once a contract is signed, the deposit is held until the engagement’s goals are accomplished — a deliberate business rule, not a technical default. That policy can still be bypassed by the client’s own bank filing a dispute — see the chargeback note above, which now depends on Aaron noticing directly rather than an automated alert, since no payment-processor webhook exists in this corrected design.

Required verification before implementation. (1) Confirm the exact type_payload field that holds the pricing deliverable's computed total (Prompt Library §6/B6) so Workflow 9's sync step reads the right field — already confirmed live against a real deliverable row (type_payload.draft_total_usd). (2) Confirm HubSpot's Deal amount property accepts a plain decimal write via the API the same way every other Deal-stage PATCH in this pipeline already works — already confirmed live (a plain number property, no enumeration options). (3) The awaiting deposit HubSpot Deal stage is created (internal ID 4042373864, confirmed live, correctly positioned between negotiating and won). (4) New: confirm the two new Deal properties (Deposit Confirmed checkbox, Deposit Amount Received number) fire a property-change trigger the same way Gate \#1/#2/Ready to Send already do, before building Record Deposit Payment against that assumption.

Schema / capability impact. One new HubSpot Deal pipeline stage (awaiting deposit) — created and confirmed live, internal ID 4042373864. amount_manually_set (boolean) — created and confirmed live, already in use by Workflow 9's sync branch. Two more new HubSpot Deal properties needed for this correction: a Deposit Confirmed checkbox and a Deposit Amount Received number field — not yet created, exact naming finalized at build time under this project’s standing HubSpot config-change gate. No environment variables needed — STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET, added in the original v2.17 pass, are removed in this correction (§11) since no payment-processor API integration exists in this design anymore. No new Postgres schema. §7’s “10 workflows total” remains unaffected — these are new workflows outside that numbered sequence, the same precedent §7g's Outbound Discovery Bootstrap already established.

# 7j. Kickoff Prep (Architecture Decision Record)

Architecture decision record, drafted by Claude Code CLI with Aaron in this session (2026-07-25), extending the deposit-gated closing flow (§7i) with an AI-drafted kickoff-call agenda.

Context. §7i's Send Onboarding Kit ends the automated portion of closing a deal — the client has the welcome message, contract copy, and receipt — but the actual kickoff call still needs a real conversation between Aaron and the client, and until now Aaron would prepare an agenda for that call by hand, re-reading through the 7 approved deliverables himself. This mirrors the exact problem §7h already solved for discovery-call prep, just one stage later in the pipeline.

Decision. A new workflow, Kickoff Prep, is called via Execute Workflow from the end of Send Onboarding Kit's success path (§7i piece 4) — no separate HubSpot trigger, since n8n calls it directly once onboarding is confirmed sent. It fetches the prospect's 7 approved deliverables from Supabase (latest version per type, matching the dedupe-by-latest-version pattern already used by Workflow 9/the shared renderer), assembles their content (scope, timeline, pricing, architecture, SOP, T&Cs) into a single context payload, and runs it through an LLM Chain (OpenRouter, DeepSeek V4 Flash — a lightweight drafting task, not the same quality bar as B1–B7's client-facing deliverable generation) with a Structured Output Parser enforcing a fixed agenda schema (goals recap, key milestones/timeline, deliverables overview, proposed first check-in cadence, open questions to raise on the call). The result is formatted and posted to the existing \#pipeline-activity Slack channel (already used by Notify Expected Deposit) for Aaron to review and personalize before the actual call — nothing is sent to the client automatically.

Rule 2 (AI prepares, humans decide) applies exactly as it does at every other AI-touched point in this pipeline: the agenda is a draft, not a client-facing artifact, and the kickoff call itself remains a real human conversation this system makes no attempt to run or replace.

Failure handling. A failure here (missing deliverables, model output failure, Slack post failure) alerts to the existing failure-alert channel and has no effect on anything upstream — Send Onboarding Kit's own success is already complete and independent by the time this workflow is called.

Required verification before implementation. (1) Confirm all 7 deliverable types are reliably present and approved by the time Send Onboarding Kit fires. (2) Confirm DeepSeek V4 Flash with a Structured Output Parser produces a reliably well-formed agenda schema, matching §7h's own proven pattern.

Schema / capability impact. No new Postgres schema. No new HubSpot properties or workflows. No new Slack channel — reuses \#pipeline-activity. §7's "10 workflows total" remains unaffected — new workflow outside that numbered sequence, same precedent as §7g/§7i.

# 8. HubSpot Integration

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr>
<td><p><strong>⚠ HubSpot is a view, not a store.</strong></p>
<p>HubSpot is a read/write surface for human review. All authoritative writes route through Supabase — either directly (n8n → Supabase) or via HubSpot webhook → n8n → Supabase. Direct HubSpot writes that do not sync back to Supabase within 60 seconds are a bug, not a feature.</p></td>
</tr>
</tbody>
</table>

## 8.1 Data Flow

| **Direction** | **What flows** |
|----|----|
| Supabase → HubSpot (push) | New qualified prospect (contact + company); post_call_analyses JSON as custom object; deliverables as custom objects with content field; stage transitions. |
| HubSpot → Supabase (webhook) | Gate \#1 approval + JSON edits; Gate \#2 per-deliverable approval + content edits; Sent status when Aaron clicks Send; negotiation revision notes. |

## 8.2 Aaron's HubSpot Views

- Pipeline overview — prospects by stage (qualified /discovery completed / analysis pending / deliverables pending / sent / won / lost / negotiating).

- Gate \#1 queue — post_call_analyses with status = pending_review.

- Gate \#2 queue — deliverables with status = pending_review, grouped by prospect.

- Revision queue — negotiating prospects with unresolved revision_loops.

# 9. Deployment Topology

| **Component** | **Where it runs** |
|----|----|
| Frontend (nogalsolutions.tech) | Cloudflare Pages. DNS + CDN + SSL via Cloudflare. |
| Frontend env vars | Cloudflare Pages → Project Settings → Environment Variables. NOT the VPS. |
| Supabase | Managed (Supabase Cloud). Project: nogalsolutions-prod. |
| n8n | Self-hosted on Hostinger VPS. Reverse-proxied via Nginx with HTTPS. |
| n8n env vars | VPS-side .env file. Never committed. Includes SUPABASE_SERVICE_ROLE_KEY, OPENROUTER_API_KEY, HUBSPOT_API_KEY, SLACK_WEBHOOK_URL. |
| HubSpot | HubSpot Cloud (free tier). |
| Calendly | Calendly Cloud (free tier). |

# 10. Build Tooling & Review

## 10.1 AI Tool Roles

| **Tool** | **Role** | **Responsibilities** |
|----|----|----|
| Claude Sonnet (this document) | Architect | System design, specs, database schema, prompt engineering. |
| Claude Code CLI | Implementer (all platforms) | Frontend (VS Code), backend workflows (n8n via MCP), SQL migrations (Supabase). |
| Aaron | Reviewer (Option A) | Reviews every Claude Code output node-by-node before deployment. Sole independent check. |

## 10.2 Handoff Protocol

1.  Aaron requests a workflow, component, or migration from Claude Code CLI with a scoped prompt referencing the relevant Spec sections.

<!-- -->

5.  Claude Code generates the code / workflow JSON / migration script.

6.  Aaron opens the output in n8n editor / VS Code / Supabase SQL editor and reviews every node or line.

7.  Aaron runs it against staging or dry-run mode where possible.

8.  Only after review passes does Aaron activate / deploy / apply the migration.

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr>
<td><p><strong>✓ Reviewer decision — Option A (locked v2.0).</strong></p>
<p>Aaron is the sole human reviewer. No second AI review layer for the solo-builder phase. Revisit if drift becomes expensive with paying clients; upgrade to Option B (fresh-context Claude Code session) at that point. This closes the OPEN item from v1.2.</p></td>
</tr>
</tbody>
</table>

# 11. Environment Variables Reference

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr>
<td><p><strong>⚠ Never commit these to version control.</strong></p>
<p>Store in .env (local dev) and Cloudflare Pages env vars (frontend production) and VPS .env (n8n production). Service-role key never leaves the backend.</p></td>
</tr>
</tbody>
</table>

| **Variable** | **Where it lives + source** |
|----|----|
| VITE_SUPABASE_URL | Cloudflare Pages. From Supabase project settings. |
| VITE_SUPABASE_ANON_KEY | Cloudflare Pages. Public; RLS enforces safety. |
| SUPABASE_SERVICE_ROLE_KEY | VPS .env (n8n). NEVER Cloudflare Pages. NEVER frontend. Bypasses RLS. |
| OPENROUTER_API_KEY | VPS .env (n8n). From openrouter.ai — single key for all model calls (§7c). Replaces ANTHROPIC_API_KEY and OPENAI_API_KEY. |
| TRANSCRIPTION_MODEL | VPS .env (n8n). Pinned exact OpenRouter ASR model slug for Workflow 5 (§7c Decision 1). Default openai/whisper-large-v3. |
| CALENDLY_API_KEY | VPS .env (n8n). From Calendly settings. |
| HUBSPOT_API_KEY | VPS .env (n8n). Private App token from HubSpot. |
| SLACK_WEBHOOK_URL | VPS .env (n8n). From Slack Apps → Incoming Webhooks. |
| SMTP_HOST / SMTP_USER / SMTP_PASS | VPS .env (n8n). Transactional email provider. |
| ANTHROPIC_MODEL | VPS .env (n8n). Pinned exact model string for Prompts A and B1–B7 (Prompt Library §3.3). Now an OpenRouter-qualified slug (§7c), not Anthropic's native model string. |
| PROMPT_A_TEMP | VPS .env (n8n). Prompt A sampling temperature (Prompt Library §3.3). Default 0.2. |
| PROMPT_B_TEMP | VPS .env (n8n). Prompts B1–B7 sampling temperature (Prompt Library §3.3). Default 0.4. |
| PROMPT_A_MAX_TOKENS | VPS .env (n8n). Prompt A max output tokens (Prompt Library §3.3). Default 4096. |
| PROMPT_B_MAX_TOKENS | VPS .env (n8n). Prompts B1–B7 max output tokens (Prompt Library §3.3). Default 8192. |
| QUALIFICATION_THRESHOLD | VPS .env (n8n). Qualification engine pass threshold (§4.1a). Currently 6 — do not raise to 7 without reviewing the Rule 3 cap warning. |

***If it is not in this document, it does not get built.***

© 2026 Aaron Nogal. All rights reserved.

*This document is the canonical reference for the NogalSolutions internal build. Not for external distribution.*
