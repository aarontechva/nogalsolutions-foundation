**NORTH STAR CANONICAL REFERENCE**

**NogalSolutions System Specification**

*AI-augmented consulting operations --- the contract every builder builds
against.*

  ------------------- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **Document Type**   System Specification (canonical reference)
  **Built By**        Aaron Nogal
  **Platform**        Cloudflare Pages (frontend) + Supabase + n8n on Hostinger VPS + HubSpot (review surface)
  **Status**          v2.9 --- Locked. Deviations require version bump.
  **Version**         2.9 --- §7b added: Workflows 5--8 architecture (Workflow 5 trigger + failure handling, Workflow 7 idempotency/resume, Workflow 8 revision-scope selection, Gate \#1/\#2 HubSpot field mapping), including resolution of its own pre-send correction versioning gap (Option B --- version-bumped, revision\_loop\_id stays NULL). §11 gained six env vars: ANTHROPIC\_MODEL, PROMPT\_A\_TEMP, PROMPT\_B\_TEMP, PROMPT\_A\_MAX\_TOKENS, PROMPT\_B\_MAX\_TOKENS, QUALIFICATION\_THRESHOLD.
  **Date**            2026-07-12
  ------------------- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

*If it is not in this document, it does not get built.*

1. Governing Principles
=======================

1.1 The Three Rules
-------------------

These rules are load-bearing. Every design choice downstream must be
reconcilable with them; if a proposed change conflicts, the change is wrong, not
the rule.

+------------------------------------------------------------------------------+
| **⚠ Rule 1 --- Supabase is the Single Source of Truth (SSOT).**              |
|                                                                              |
| All authoritative state lives in Supabase. Every other system --- n8n,       |
| HubSpot, the Cloudflare Pages frontend, any future CRM --- is a consumer or  |
| a view. When two systems disagree on a field, Supabase wins by definition.   |
| HubSpot changes route back to Supabase within 60 seconds or they are a bug.  |
+------------------------------------------------------------------------------+

+------------------------------------------------------------------------------+
| **⚠ Rule 2 --- AI prepares, humans decide.**                                 |
|                                                                              |
| AI drafts, structures, and surfaces intelligence. It does not send anything  |
| to a prospect, it does not set prices, and it does not qualify leads. Every  |
| client-facing artifact passes through Aaron before it leaves the system. AI  |
| should never feel like a gatekeeper.                                         |
+------------------------------------------------------------------------------+

+------------------------------------------------------------------------------+
| **⚠ Rule 3 --- Deterministic where possible, AI where deterministic          |
| breaks.**                                                                    |
|                                                                              |
| Qualification, routing, calendar unlocks, and status transitions are         |
| business rules --- code, not prompts. AI enters only where structured output |
| from unstructured input is genuinely required: transcript analysis, document |
| drafting, semantic classification.                                           |
+------------------------------------------------------------------------------+

1.2 AI Placement Map
--------------------

This table is the honest ledger of where AI touches the pipeline and where it
does not. It supersedes all prior placement maps.

  ---------------------------------- ------------------------- ---------------------------------------------------------------
  **Stage**                          **AI Used?**              **Aaron\'s role**
  Intake form                        No                        Designed the fields, does not touch each submission
  Qualification engine               No                        Set the rules once; deterministic thereafter
  Auto-acknowledgment email          No                        Template only; sends automatically on submit
  Booking + calendar email           No                        Template only; sends on qualified result
  Discovery call                     No                        Conducts the call personally
  Audio transcription                Yes (Whisper)             Uploads recording; reviews transcript if needed
  Post-call analysis JSON            Yes (Claude)              Gate \#1: approves or edits JSON before deliverables generate
  Deliverable drafting (7 docs)      Yes (Claude, sequenced)   Gate \#2: per-document approve / edit / hold
  Pricing draft                      Yes (Claude)              AI drafts a number; Aaron sets the final number
  Send to client                     No                        Aaron clicks Send; nothing auto-sends
  Second-call proposal walkthrough   No                        Aaron leads the call
  Negotiation revision loop          Partial                   Aaron captures notes; Claude re-drafts affected sections only
  ---------------------------------- ------------------------- ---------------------------------------------------------------

1.3 End-to-End Flow
-------------------

One diagram, read top to bottom. Every arrow is either a deterministic n8n step
or a human action; there are no hidden branches.

  -------------------------- ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **Stage**                  **What happens**
  1\. Intake                 Prospect submits form on nogalsolutions.tech. Row written to Supabase.intake\_submissions. Auto-acknowledgment email fires.
  2\. Qualification          n8n reads intake, applies 7 deterministic rules. Writes result to Supabase.qualification\_results.
  3a. Qualified path         Booking email + Calendly link sent immediately. No AI gate before booking.
  3b. Not-qualified path     Polite decline email + free resource sent. Prospect moved to nurture status in Supabase + HubSpot (Contact only, no Deal --- see §7a). n8n logs event to activity\_logs.
  4\. Discovery call         Aaron + prospect on Zoom/Meet. Recorded with two-party consent (checkbox in intake T&C). Aaron uploads recording to designated Supabase Storage bucket after call.
  5\. Transcription          n8n watches the bucket, sends audio to Whisper, writes transcript to Supabase.discovery\_sessions.
  6\. Post-call analysis     n8n sends transcript to Claude with Prompt A. Structured JSON written to Supabase.post\_call\_analyses with status = pending\_review.
  7\. Gate \#1 (Aaron)       Aaron reviews the JSON in HubSpot. Edits inline as needed. Marks approved. Webhook fires back to n8n → Supabase status = approved.
  8\. Sequenced generation   n8n runs 7 Claude calls in sequence: Architecture → Spec → Roadmap → SOP → Proposal → Pricing → T&C. Each call receives all prior deliverables as context. Rows written to Supabase.deliverables with status = pending\_review.
  9\. Gate \#2 (Aaron)       Aaron reviews each deliverable in HubSpot. Per-document approve / edit / hold. Approved deliverables sent to prospect via email (Aaron clicks Send).
  10\. Second call           Proposal walkthrough. Outcome recorded: Won / Lost / Negotiating.
  11\. Negotiation loop      If Negotiating, Aaron records revision notes. n8n triggers sequenced re-generation of only affected deliverables. Returns to Gate \#2.
  12\. Close                 Won or Lost recorded in Supabase.meetings.outcome. Activity log updated. HubSpot pipeline stage synced.
  -------------------------- ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

2. System Architecture
======================

2.1 Tech Stack
--------------

  ---------------------------- ----------------------------------------- ------------------------------------------------------------------------------------------------------
  **Layer**                    **Tool**                                  **Role**
  Frontend                     React + Vite on Cloudflare Pages          Intake form, marketing site. Deployed at nogalsolutions.tech.
  Data Layer (SSOT)            Supabase (Postgres + Auth + Storage)      Canonical data store. RLS enabled with deny-by-default. Audio recordings in Storage.
  Orchestration                n8n on Hostinger VPS                      All workflows. Reads/writes Supabase. Calls Claude, Whisper, HubSpot, Calendly, email.
  AI --- Analysis & Drafting   Claude (Anthropic API)                    Post-call analysis JSON; sequenced generation of 7 deliverables.
  AI --- Transcription         Whisper (OpenAI API)                      Audio → text.
  Calendar                     Calendly                                  Booking after qualification.
  Review Surface               HubSpot Free CRM                          Aaron reviews Gate \#1 (JSON) and Gate \#2 (deliverables) in HubSpot UI. Two-way sync with Supabase.
  Notifications                Slack + SMTP email                        Aaron alerts on qualified leads, gate items awaiting review.
  Frontend Impl. (v1)          Claude Code CLI                           Already shipped. Cloudflare Pages deploy.
  Backend Impl. (v2+)          Claude Code CLI (via n8n MCP + VS Code)   Human-review-before-deploy per §10.2.
  ---------------------------- ----------------------------------------- ------------------------------------------------------------------------------------------------------

2.2 What Changed From v1.x
--------------------------

+------------------------------------------------------------------------------+
| **⚠ VAPI Voice Discovery Assistant --- REMOVED.**                            |
|                                                                              |
| v1 required prospects to complete a 20--25 min AI voice session before       |
| booking Aaron. This violated §1.1 Rule 2 (AI as gatekeeper) and imposed      |
| friction on high-intent leads. Human discovery call restored as the          |
| trust-building first touch.                                                  |
+------------------------------------------------------------------------------+

+------------------------------------------------------------------------------+
| **✓ Sequenced deliverable generation --- NEW.**                              |
|                                                                              |
| The 7 deliverables (Architecture, Spec, Roadmap, SOP, Proposal, Pricing,     |
| T&C) are generated in strict order, each receiving prior outputs as context. |
| Prevents commercial docs from promising work the technical docs do not       |
| cover.                                                                       |
+------------------------------------------------------------------------------+

+------------------------------------------------------------------------------+
| **⚠ Pre-call brief --- DEFERRED.**                                           |
|                                                                              |
| v2-draft included an AI-generated pre-call brief. Deferred until Aaron has   |
| 15--20 real discovery calls under his belt and can pattern-match what a good |
| brief actually looks like. Building it now, on zero real data, would ship    |
| generic output and over-engineer the pipeline.                               |
+------------------------------------------------------------------------------+

+------------------------------------------------------------------------------+
| **✓ HubSpot as review surface --- NEW.**                                     |
|                                                                              |
| Custom Consultant Workspace replaced by HubSpot for Gate \#1 and Gate \#2.   |
| Weeks of frontend work eliminated. Supabase remains SSOT; HubSpot is a view, |
| not a store.                                                                 |
+------------------------------------------------------------------------------+

3. Database Schema (Supabase)
=============================

+------------------------------------------------------------------------------+
| **⚠ RLS is mandatory.**                                                      |
|                                                                              |
| Row Level Security must be enabled on every table below with a               |
| deny-by-default policy before the anon key ships in any client build.        |
| Server-side writes (n8n, Edge Functions) use SUPABASE\_SERVICE\_ROLE\_KEY,   |
| which bypasses RLS and must never reach the frontend or version control.     |
+------------------------------------------------------------------------------+

3.1 Table Inventory
-------------------

Purpose-level summary of the 10 tables and their evolution from v1. Full column
definitions live in §3.2.

  ---------------------------- ---------------------------------------------------------------------------------------------------------- -------------------------------------
  **Table**                    **Purpose**                                                                                                **v1 → v2**
  **companies**                One row per prospect company. Name, website, industry, size.                                               Unchanged
  **prospects**                One row per prospect person. FK to companies. Email is NOT NULL UNIQUE. Pipeline status tracked as enum.   Unchanged
  **intake\_submissions**      Raw form submission payload as jsonb + timestamp. Immutable audit record.                                  Unchanged
  **qualification\_results**   Rule-by-rule breakdown per submission stored as jsonb. Qualified boolean + summary reason.                 Unchanged
  **discovery\_sessions**      Human discovery call metadata. Recording URL, transcript, transcription status.                            Renamed from voice\_sessions
  **post\_call\_analyses**     Claude-generated structured JSON per session. Gate \#1 artifact.                                           New (split from discovery\_reports)
  **deliverables**             One row per generated document. Type, content jsonb, version, status, edit history.                        New (absorbs proposals)
  **meetings**                 Discovery + proposal calls. Type + outcome per meeting.                                                    Unchanged
  **revision\_loops**          Negotiation cycles. Notes, resolution status, meeting link.                                                New
  **activity\_logs**           Chronological event log per prospect. Every state transition. Append-only.                                 Unchanged
  ---------------------------- ---------------------------------------------------------------------------------------------------------- -------------------------------------

3.2 Column Definitions --- All 10 Tables
----------------------------------------

Each subsection defines the columns for one table. Types are Postgres types as
they will appear in the migration. Every non-trivial decision is annotated in
Notes. Tables are presented in FK-dependency order --- earlier tables have no
forward references to later ones.

### 3.2.1 companies

No foreign key dependencies. Root of the company graph.

  ----------------- ---------------------- --------------------------------------------------------------------------------------------------------------------------------------
  **Column**        **Type**               **Notes**
  **id**            uuid PK                gen\_random\_uuid() default.
  **name**          text NOT NULL          Company display name. Required.
  **website**       text                   Optional. No format constraint at DB level.
  **industry**      text                   Free text; no fixed taxonomy defined.
  **size**          text                   Stored as text to accommodate common range strings (e.g. \'11--50\', \'Enterprise\'). No enum until a fixed tier model is committed.
  **created\_at**   timestamptz NOT NULL   Default now().
  **updated\_at**   timestamptz NOT NULL   Default now(). Application layer or trigger maintains on update.
  ----------------- ---------------------- --------------------------------------------------------------------------------------------------------------------------------------

### 

### 

### 

### 

### 

### 3.2.2 prospects

Depends on: companies. Central identity table for pipeline participants.

  ----------------- --------------------------- -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **Column**        **Type**                    **Notes**
  **id**            uuid PK                     gen\_random\_uuid() default.
  **company\_id**   uuid FK NULLABLE            REFERENCES companies(id) ON DELETE SET NULL. Nullable so a prospect may be captured before the company record is created.
  **full\_name**    text NOT NULL               Single field. Matches §4.2 intake form \'Name\' field. Not split into first/last --- the form does not split, and the pipeline treats the prospect as a single named contact.
  **email**         text NOT NULL UNIQUE        Load-bearing. Used for qualification rules 2 and 3 (§4.1), booking email, deliverable delivery.
  **phone**         text                        Optional. Captured if provided; not required by qualification.
  **status**        prospect\_status NOT NULL   Enum. Default \'new\'. See §3.3 for full enum values.
  **created\_at**   timestamptz NOT NULL        Default now().
  **updated\_at**   timestamptz NOT NULL        Default now().
  ----------------- --------------------------- -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

### 3.2.3 intake\_submissions

Depends on: prospects. Immutable audit record of the raw form submission.

  ------------------- ---------------------- --------------------------------------------------------------------------------------------------------------------------------------------------------------
  **Column**          **Type**               **Notes**
  **id**              uuid PK                gen\_random\_uuid() default.
  **prospect\_id**    uuid FK NULLABLE       REFERENCES prospects(id) ON DELETE SET NULL. Nullable because the match to a prospect record may occur asynchronously after the raw submission is persisted.
  **payload**         jsonb NOT NULL         Full raw payload of every §4.2 field submitted, plus any additional client-side metadata. Immutable --- writes only happen on insert.
  **submitted\_at**   timestamptz NOT NULL   Client-reported submission time. Distinct from created\_at so DB-write latency does not overwrite the true submission moment.
  **created\_at**     timestamptz NOT NULL   DB insert time. Default now().
  ------------------- ---------------------- --------------------------------------------------------------------------------------------------------------------------------------------------------------

### 3.2.4 qualification\_results

Depends on: intake\_submissions. Rule-by-rule outcome for the 7 qualification
rules (§4.1).

  ---------------------------- ------------------------- ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **Column**                   **Type**                  **Notes**
  **id**                       uuid PK                   gen\_random\_uuid() default.
  **intake\_submission\_id**   uuid FK NOT NULL UNIQUE   REFERENCES intake\_submissions(id) ON DELETE CASCADE. UNIQUE enforces one qualification result per submission --- re-evaluation replaces the row.
  **qualified**                boolean NOT NULL          Top-level pass/fail. Threshold: 6 of 7 rules passing (§4.1).
  **reason**                   text                      Human-readable summary of the decision, used in comms and activity logs.
  **rule\_results**            jsonb NOT NULL            Array of per-rule outcomes. Element shape: {rule: int, name: string, pass: boolean, reason: string}. jsonb rather than 14 flat columns so rule metadata can evolve without schema migration.
  **evaluated\_at**            timestamptz NOT NULL      When rules were evaluated. Distinct from created\_at for async/batch evaluation patterns. Default now().
  **created\_at**              timestamptz NOT NULL      Default now().
  ---------------------------- ------------------------- ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

### 

### 3.2.5 meetings

Depends on: prospects. Discovery + proposal calls.

  ------------------- --------------------------- -------------------------------------------------------------------------------------
  **Column**          **Type**                    **Notes**
  **id**              uuid PK                     gen\_random\_uuid() default.
  **prospect\_id**    uuid FK NOT NULL            REFERENCES prospects(id) ON DELETE CASCADE.
  **type**            meeting\_type NOT NULL      Enum: \'discovery\' \| \'proposal\'. See §3.3.
  **scheduled\_at**   timestamptz NOT NULL        When the meeting is booked to occur.
  **outcome**         meeting\_outcome NULLABLE   Enum: \'won\' \| \'lost\' \| \'negotiating\'. Nullable until the meeting concludes.
  **notes**           text                        Free-text field for call context that does not belong in structured analysis.
  **created\_at**     timestamptz NOT NULL        Default now().
  **updated\_at**     timestamptz NOT NULL        Default now().
  ------------------- --------------------------- -------------------------------------------------------------------------------------

### 3.2.6 discovery\_sessions

Depends on: prospects, meetings. Metadata for the human discovery call.

  --------------------------- -------------------------------- ----------------------------------------------------------------------------------------------------------------------------------
  **Column**                  **Type**                         **Notes**
  **id**                      uuid PK                          gen\_random\_uuid() default.
  **prospect\_id**            uuid FK NOT NULL                 REFERENCES prospects(id) ON DELETE CASCADE.
  **meeting\_id**             uuid FK NULLABLE                 REFERENCES meetings(id) ON DELETE SET NULL. Nullable so the session record can be created before the meeting is formally logged.
  **recording\_url**          text                             Nullable until the recording is available in Supabase Storage post-call.
  **transcript**              text                             Full transcript in-column. Expected long-form. Nullable until transcription completes.
  **transcription\_status**   transcription\_status NOT NULL   Enum: \'pending\' \| \'complete\'. Default \'pending\'. See §3.3.
  **created\_at**             timestamptz NOT NULL             Default now().
  **updated\_at**             timestamptz NOT NULL             Default now().
  --------------------------- -------------------------------- ----------------------------------------------------------------------------------------------------------------------------------

### 3.2.7 post\_call\_analyses

Depends on: discovery\_sessions. Claude-generated JSON --- the Gate \#1
artifact.

  ---------------------------- --------------------------- -------------------------------------------------------------------------------------------------------------------------------
  **Column**                   **Type**                    **Notes**
  **id**                       uuid PK                     gen\_random\_uuid() default.
  **discovery\_session\_id**   uuid FK NOT NULL UNIQUE     REFERENCES discovery\_sessions(id) ON DELETE CASCADE. UNIQUE --- one analysis per session. Revisions update the existing row.
  **analysis**                 jsonb NOT NULL              Structured JSON output from Prompt A (§6). Shape defined in the Prompt Library, not here.
  **status**                   analysis\_status NOT NULL   Enum: \'pending\_review\' \| \'approved\'. Default \'pending\_review\'. See §3.3.
  **reviewed\_at**             timestamptz NULLABLE        Set when Aaron marks approved in HubSpot (Gate \#1).
  **reviewed\_by**             text                        Identifier of the reviewer (email or display name). Not a users FK yet --- auth integration is deferred.
  **notes**                    text                        Reviewer notes capturing rationale for inline edits made pre-approval.
  **generated\_at**            timestamptz NOT NULL        When Claude produced the JSON. Default now().
  **created\_at**              timestamptz NOT NULL        Default now().
  **updated\_at**              timestamptz NOT NULL        Default now().
  ---------------------------- --------------------------- -------------------------------------------------------------------------------------------------------------------------------

### 3.2.8 deliverables

Depends on: prospects, revision\_loops. Load-bearing addition of v2 --- replaces
the v1 proposals table and holds all 7 generated document types under one
schema.

  ------------------------ ------------------------------ -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **Column**               **Type**                       **Notes**
  **id**                   uuid PK                        gen\_random\_uuid() default.
  **prospect\_id**         uuid FK NOT NULL               REFERENCES prospects(id) ON DELETE CASCADE.
  **type**                 deliverable\_type NOT NULL     Enum with exactly 7 values: architecture, spec, roadmap, sop, proposal, pricing, tc. See §3.3.
  **content**              jsonb                          Structured document body. Schema per type documented in the Prompt Library.
  **version**              int NOT NULL                   Starts at 1. Application layer increments on each revision loop iteration.
  **status**               deliverable\_status NOT NULL   Enum: pending\_review, approved, held, sent, revising. Default \'pending\_review\'. See §3.3.
  **generated\_at**        timestamptz NOT NULL           When Claude produced this version. Default now().
  **reviewed\_at**         timestamptz NULLABLE           When Aaron marked Gate \#2 approve/edit/hold.
  **sent\_at**             timestamptz NULLABLE           When Aaron clicked Send. NULL until sent.
  **edit\_history**        jsonb NOT NULL                 Array of {timestamp, field, before, after}. Default \'\[\]\'. Audit trail for inline edits made during review.
  **revision\_loop\_id**   uuid FK NULLABLE               REFERENCES revision\_loops(id) ON DELETE SET NULL. Populated only when this version was produced by a negotiation loop. This is the single source of truth for the deliverable→loop relationship --- see §3.5 for why the inverse mapping is NOT stored on revision\_loops.
  **created\_at**          timestamptz NOT NULL           Default now().
  **updated\_at**          timestamptz NOT NULL           Default now().
  ------------------------ ------------------------------ -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

### 3.2.9 revision\_loops

Depends on: prospects, meetings. Negotiation cycles that produce new deliverable
versions.

+-------------------------+-------------------------+-------------------------+
| **Column**              | **Type**                | **Notes**               |
+-------------------------+-------------------------+-------------------------+
| **id**                  | uuid PK                 | gen\_random\_uuid()     |
|                         |                         | default.                |
+-------------------------+-------------------------+-------------------------+
| **prospect\_id**        | uuid FK NOT NULL        | REFERENCES              |
|                         |                         | prospects(id) ON DELETE |
|                         |                         | CASCADE.                |
+-------------------------+-------------------------+-------------------------+
| **meeting\_id**         | uuid FK NULLABLE        | REFERENCES meetings(id) |
|                         |                         | ON DELETE SET NULL. A   |
|                         |                         | loop may open without a |
|                         |                         | formal meeting record   |
|                         |                         | (e.g. async email       |
|                         |                         | negotiation).           |
+-------------------------+-------------------------+-------------------------+
| **notes**               | text                    | Free-text summary of    |
|                         |                         | negotiation context or  |
|                         |                         | client objections.      |
+-------------------------+-------------------------+-------------------------+
| **resolution\_status**  | resolution\_status NOT  | Enum: \'open\' \|       |
|                         | NULL                    | \'resolved\'. Default   |
|                         |                         | \'open\'. See §3.3.     |
+-------------------------+-------------------------+-------------------------+
| **resolved\_at**        | timestamptz NULLABLE    | Set when                |
|                         |                         | resolution\_status      |
|                         |                         | transitions to          |
|                         |                         | \'resolved\'.           |
+-------------------------+-------------------------+-------------------------+
| **created\_at**         | timestamptz NOT NULL    | Default now().          |
+-------------------------+-------------------------+-------------------------+
| **updated\_at**         | timestamptz NOT NULL    | Default now().          |
+-------------------------+-------------------------+-------------------------+
| **▲ No                  |                         |                         |
| aff                     |                         |                         |
| ected\_deliverable\_ids |                         |                         |
| column.**               |                         |                         |
|                         |                         |                         |
| The relationship        |                         |                         |
| \'which deliverables    |                         |                         |
| belong to this loop\'   |                         |                         |
| is queried via          |                         |                         |
| delivera                |                         |                         |
| bles.revision\_loop\_id |                         |                         |
| --- the FK on the       |                         |                         |
| deliverables side.      |                         |                         |
| Storing a jsonb array   |                         |                         |
| here would create a     |                         |                         |
| dual-source-of-truth    |                         |                         |
| requiring               |                         |                         |
| application-layer sync, |                         |                         |
| which Rule 1 (SSOT)     |                         |                         |
| forbids.                |                         |                         |
+-------------------------+-------------------------+-------------------------+

### 3.2.10 activity\_logs

Depends on: prospects. Append-only event log. No updated\_at.

  ------------------ ---------------------- ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **Column**         **Type**               **Notes**
  **id**             uuid PK                gen\_random\_uuid() default.
  **prospect\_id**   uuid FK NOT NULL       REFERENCES prospects(id) ON DELETE CASCADE.
  **event\_type**    text NOT NULL          Free text, not enum. Application layer owns the known-values list. Example values: \'prospect.qualified\', \'deliverable.sent\', \'meeting.completed\'. Text keeps the schema stable as event types are added.
  **occurred\_at**   timestamptz NOT NULL   When the event happened. Distinct from created\_at so events can be back-dated (manual entries preserve true timestamp). Default now().
  **metadata**       jsonb                  Event-specific payload. Shape varies by event\_type. Example for a status transition: {from\_status: \'new\', to\_status: \'qualified\', rule\_count: 7}.
  **created\_at**    timestamptz NOT NULL   Default now().
  ------------------ ---------------------- ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

3.3 Enum Types
--------------

All enums used above are defined at the type level in Postgres via CREATE TYPE
\... AS ENUM. Adding a value later requires ALTER TYPE \... ADD VALUE
(non-transactional, plan accordingly).

+-------------------------+-------------------------+-------------------------+
| **Enum**                | **Values**              | **Used By**             |
+-------------------------+-------------------------+-------------------------+
| **prospect\_status**    | new, nurture,           | prospects.status        |
|                         | qualified, discovery,   |                         |
|                         | analysis, proposal,     |                         |
|                         | negotiating, won, lost  |                         |
+-------------------------+-------------------------+-------------------------+
| **meeting\_type**       | discovery, proposal     | meetings.type           |
+-------------------------+-------------------------+-------------------------+
| **meeting\_outcome**    | won, lost, negotiating  | meetings.outcome        |
+-------------------------+-------------------------+-------------------------+
| **                      | pending, complete       | discovery\_session      |
| transcription\_status** |                         | s.transcription\_status |
+-------------------------+-------------------------+-------------------------+
| **analysis\_status**    | pending\_review,        | post                    |
|                         | approved                | \_call\_analyses.status |
+-------------------------+-------------------------+-------------------------+
| **deliverable\_type**   | architecture, spec,     | deliverables.type       |
|                         | roadmap, sop, proposal, |                         |
|                         | pricing, tc             |                         |
+-------------------------+-------------------------+-------------------------+
| **deliverable\_status** | pending\_review,        | deliverables.status     |
|                         | approved, held, sent,   |                         |
|                         | revising                |                         |
+-------------------------+-------------------------+-------------------------+
| **resolution\_status**  | open, resolved          | revision\_l             |
|                         |                         | oops.resolution\_status |
+-------------------------+-------------------------+-------------------------+
| **⚠ prospect\_status    |                         |                         |
| uses \'nurture\' ---    |                         |                         |
| NOT \'disqualified\'.** |                         |                         |
|                         |                         |                         |
| The v2.1 workflow       |                         |                         |
| narrative (§7 and       |                         |                         |
| roadmap Phase 2)        |                         |                         |
| explicitly moves        |                         |                         |
| not-qualified leads to  |                         |                         |
| nurture. The Spec is    |                         |                         |
| the source of truth for |                         |                         |
| that term. Any          |                         |                         |
| migration or workflow   |                         |                         |
| using \'disqualified\'  |                         |                         |
| is a bug against v2.2.  |                         |                         |
+-------------------------+-------------------------+-------------------------+

3.4 Row Level Security
----------------------

RLS is mandatory on every table in §3.2. Table creation and RLS enablement are
separated into distinct migration steps so that the schema can be reviewed and
applied independently from the policy layer.

+------------------------------------------------------------------------------+
| **⚠ RLS is mandatory before the frontend deploys.**                          |
|                                                                              |
| Row Level Security must be enabled on every table above with a               |
| deny-by-default policy before the publishable API key ships in any client    |
| build. Server-side writes (n8n, Edge Functions) use the sb\_secret key       |
| (formerly SERVICE\_ROLE\_KEY), which bypasses RLS and must never reach the   |
| frontend or version control.                                                 |
|                                                                              |
| Deploy sequence: (1) apply this schema migration; (2) apply RLS enablement + |
| deny-by-default policies as a second migration; (3) apply per-table access   |
| policies as the workflows requiring them come online; (4) only then wire the |
| publishable key into Cloudflare Pages env vars for a rebuild.                |
+------------------------------------------------------------------------------+

3.4a Privilege Verification Checklist (added after live production audit, 2026-07-04)
-------------------------------------------------------------------------------------

RLS being enabled on a table is necessary but not sufficient for minimal
privilege. This section exists because a live audit found anon and authenticated
holding TRUNCATE, REFERENCES, and TRIGGER on nearly every table in public ---
privileges nobody intentionally granted, undiscovered until a cross-table check
was run instead of stopping at the one table already under investigation.
pg\_default\_acl was checked and confirmed empty for both roles on public,
meaning this was a one-time historical over-grant (most likely from a table
drop/recreate), not a standing rule reapplying itself --- but the excess sat
unnoticed regardless.

+------------------------------------------------------------------------------+
| **⚠ Why RLS enabled didn\'t catch this**                                     |
|                                                                              |
| RLS policies filter which rows a role may act on. They say nothing about     |
| which operations are available in the first place. TRUNCATE in particular is |
| not row-scoped and is not subject to RLS at all, per Postgres\'s own         |
| documented behavior --- a table can have a correct, airtight RLS policy and  |
| still be fully truncatable by a role that was never supposed to have that    |
| privilege. \"RLS is on\" and \"privileges are minimal\" are two separate     |
| claims; verifying one does not verify the other.                             |
+------------------------------------------------------------------------------+

Checklist --- run this any time a table in public is created or recreated, not
just at initial schema setup:

1.  Query grants directly: SELECT table\_name, grantee, privilege\_type FROM
    information\_schema.role\_table\_grants WHERE grantee IN
    (\'anon\',\'authenticated\') AND table\_schema = \'public\' ORDER BY
    table\_name, privilege\_type;

2.  Expect ONLY the specific privilege(s) that role\'s actual function requires
    --- e.g., anon should show INSERT on intake\_submissions and nothing else,
    on no other table. Anything beyond the explicitly intended grant is excess
    until proven otherwise.

3.  If excess is found, also check pg\_default\_acl for public before revoking
    (SELECT defaclrole::regrole, defaclobjtype, defaclacl FROM pg\_default\_acl
    WHERE defaclnamespace = \'public\'::regnamespace;) --- this determines
    whether it\'s a one-time cleanup or an active rule that will silently
    reapply itself to the next table created, which needs to be dropped, not
    just worked around.

4.  service\_role is exempt from this check by design. It exists specifically to
    bypass RLS for legitimate backend writes (n8n, migrations) --- broad grants
    there are correct and expected, not a finding.

3.5 Notes on Modeling Decisions
-------------------------------

### Single-direction FK for the loop ↔ deliverable relationship

A revision loop may affect multiple deliverables (proposal, pricing, T&C often
revise together). The intuitive first draft stores this as an array on
revision\_loops AND a FK on deliverables --- one record on each side. That
pattern is forbidden here: two representations of the same relationship in the
same database means every write path has to keep both in sync, and any missed
update produces silent drift. The canonical direction is
deliverables.revision\_loop\_id. To query \'which deliverables were affected by
loop X\', use: SELECT \* FROM deliverables WHERE revision\_loop\_id = X.

### Why jsonb over normalized child tables in three places

intake\_submissions.payload, qualification\_results.rule\_results, and
activity\_logs.metadata all use jsonb rather than child tables. The rationale is
identical in each case: the shape is expected to evolve (intake fields shift per
campaign, rule metadata grows as new rules are added, event types multiply) and
the read pattern is \'fetch the whole record and process in application code\'
rather than \'filter by a specific inner field at SQL level\'. jsonb keeps the
schema stable across those changes without paying the join cost on every read.
If a filter-by-inner-field query pattern emerges later, migrate that specific
inner field to a proper column then.

### Why deliverables.content is nullable but deliverables.type is not

A deliverable row may be created in a \'pending\' or \'held\' state before
Claude has produced content --- the row exists to represent the intent, and
content arrives on the second write. type is committed at creation because the
generation sequence (§7, prompts B1--B7) is deterministic and known before
generation runs.

### Timestamps are triple-tracked in some tables --- deliberately

post\_call\_analyses has generated\_at, reviewed\_at, and created\_at.
deliverables has generated\_at, reviewed\_at, sent\_at, and created\_at. These
are not redundant --- each answers a different question. generated\_at answers
\'when did AI produce this content\'; created\_at answers \'when did the DB row
appear\' (async/queue latency can separate these by seconds or more);
reviewed\_at answers \'when did the human approve\'; sent\_at answers \'when did
it leave the system to the prospect\'. Losing any one of these makes an audit or
performance question harder to answer.

3.6 Migration Ordering
----------------------

Tables must be created in the order below so that every foreign key resolves to
an existing target. This is the exact order the Phase 1 → Track B → Item 4
migration file must follow.

  -------- ------------------------ -----------------------------------------------------------
  **\#**   **Table**                **Reason**
  **1**    companies                No FK dependencies.
  **2**    prospects                FK → companies.
  **3**    meetings                 FK → prospects.
  **4**    revision\_loops          FK → prospects, meetings. Must exist before deliverables.
  **5**    intake\_submissions      FK → prospects.
  **6**    qualification\_results   FK → intake\_submissions.
  **7**    discovery\_sessions      FK → prospects, meetings.
  **8**    post\_call\_analyses     FK → discovery\_sessions.
  **9**    deliverables             FK → prospects, revision\_loops (both must exist first).
  **10**   activity\_logs           FK → prospects.
  -------- ------------------------ -----------------------------------------------------------

Closing
=======

This addendum locks the 10-table schema at the column level. It supersedes §3.1
and §3.2 of v2.1 in full. Downstream artifacts --- the migration SQL, the n8n
workflow node configs that read from and write to these tables, the HubSpot
custom object mappings --- must conform to this document, not the other way
around.

+------------------------------------------------------------------------------+
| **✓ v2.2 status: Locked.**                                                   |
|                                                                              |
| Any deviation from the columns, types, constraints, or enum values defined   |
| above requires a version bump on this Spec before the deviation is           |
| implemented.                                                                 |
+------------------------------------------------------------------------------+

4. Qualification Engine
=======================

4.1 Rules (deterministic, no AI)
--------------------------------

7 rules, each pass/fail. Threshold: 6 of 7 = qualified. Threshold lives in
config, not code.

  -------- ------------------------------------ ---------------------------------------------------------------------------------------------
  **\#**   **Rule**                             **Check**
  1        All required intake fields present   Every field in §4.2 non-empty
  2        Email valid + not disposable         Regex + blocklist (mailinator, tempmail, guerrillamail, etc.)
  3        No duplicate prospect                SELECT COUNT(\*) FROM prospects WHERE email = ? returns 0
  4        Problem maps to a service            Free-text problem field runs through keyword classifier against declared service categories
  5        Budget is not \"exploring\"          Budget range field ≠ \"just exploring / no budget\"
  6        Timeline is not \"someday\"          Timeline field ≠ \"no urgency / whenever\"
  7        Tech stack disclosed                 Tech stack field non-empty and ≠ \"skip\"
  -------- ------------------------------------ ---------------------------------------------------------------------------------------------

4.1a Workflow 2 --- Qualification Engine Architecture
-----------------------------------------------------

Architecture decision record for Workflow 2, drafted by Claude (Architect role,
§10.1) for Claude Code CLI implementation per the §10.2 handoff protocol.
Supersedes the §7 Workflow 1 row and the Roadmap Phase 2 \"Qualified path\"
checklist item on prospect/company row creation --- see callout below.

+------------------------------------------------------------------------------+
| **✓ Resolved deviation from §7 and the Roadmap: prospect/company creation    |
| moved to Workflow 2 (locked v2.4).**                                         |
|                                                                              |
| §7 assigns companies/prospects row creation to Workflow 1; the Roadmap Phase |
| 2 checklist assigns it to Workflow 3 (qualified path only). Both are         |
| superseded here. Every intake submission --- qualified or not --- now gets a |
| prospects row, created inside Workflow 2 before the qualified/not-qualified  |
| branch.                                                                      |
|                                                                              |
| Reason: activity\_logs.prospect\_id is FK NOT NULL (§3.2.10). Workflow 4     |
| cannot log a decline or mark nurture status against a prospect that was      |
| never created. Scoping row creation to the qualified path only breaks        |
| Workflow 4 the first time a real lead is declined. It also silently breaks   |
| Rule 3\'s dedup coverage --- a declined lead\'s email would never enter      |
| prospects, so resubmission after decline would go undetected indefinitely.   |
|                                                                              |
| Resolved in v2.4: §7 Workflow 1 and Workflow 2 rows updated to match         |
| (2026-07-03). Roadmap Phase 2 \"Qualified path\" checklist updated to match  |
| --- see Roadmap v2.4.                                                        |
+------------------------------------------------------------------------------+

### Trigger

A dedicated Postgres trigger on intake\_submissions (AFTER INSERT), independent
of Workflow 1\'s trigger --- not chained via an n8n Execute Workflow node off
Workflow 1. §7\'s own framing (\"8 workflows total, each has one trigger and one
purpose\") is the reason: chaining would make Workflow 2\'s reliability depend
on Workflow 1 never changing, which defeats the isolation §7 asks for. Naming
convention matches the existing trigger: notify\_n8n\_qualification\_engine,
calling net.http\_post() to a dedicated Workflow 2 webhook.

### Execution phases

Rule evaluation and row creation are kept as two non-overlapping phases. Nothing
is written to Supabase until every rule has a result --- this is what keeps Rule
3\'s dedup query correct without needing to exclude a row it just created
itself.

+--------------------+--------------------------------------------------------+
| **Phase**          | **What happens**                                       |
+--------------------+--------------------------------------------------------+
| 1\. Evaluate       | Run all 7 §4.1 rules against                           |
|                    | intake\_submissions.payload directly. No writes. See   |
| (read-only)        | rule-by-rule notes below.                              |
+--------------------+--------------------------------------------------------+
| 2\. Write identity | Match-or-create companies (by name); insert prospects  |
|                    | (status stays at schema default \'new\' --- Workflow   |
|                    | 3/4 own the transition, not Workflow 2); update        |
|                    | intake\_submissions.prospect\_id.                      |
+--------------------+--------------------------------------------------------+
| 3\. Write result   | qualification\_results via INSERT ... ON CONFLICT      |
|                    | (intake\_submission\_id) DO UPDATE. Must be an upsert  |
|                    | --- §3.2.4 states re-evaluation replaces the row, and  |
|                    | a plain insert would fail on any re-run.               |
+--------------------+--------------------------------------------------------+
| 4\. Branch         | A second Postgres trigger, on qualification\_results   |
|                    | (AFTER INSERT OR UPDATE), fires to Workflow 3\'s or    |
|                    | Workflow 4\'s webhook based on qualified. Not an       |
|                    | n8n-internal If-branch --- see reasoning below.        |
+--------------------+--------------------------------------------------------+

Phase 4 reasoning: if Workflow 2 crashed after writing qualification\_results
but before an internal call to Workflow 3/4, an internal-branch design would
leave a qualified lead with a result row and no booking email, with nothing to
signal the failure. Making the qualification\_results write itself the trigger
point means Workflow 3/4 don\'t depend on Workflow 2 staying alive one extra
step.

### Rule implementation notes

  -------- ----------------------------- -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **\#**   **Rule**                      **Implementation note**
  1        Required fields present       Non-empty check against the exact §4.2 field list.
  2        Email valid, not disposable   Regex + a maintained disposable-domain package (pinned dependency), not a hand-maintained list --- §4.1\'s \"mailinator, tempmail, etc.\" is illustrative, not exhaustive, and will go stale.
  3        No duplicate prospect         SELECT count(\*) FROM prospects WHERE email = ?. Runs in Phase 1, before any write this run --- no self-match possible.
  4        Problem maps to a service     Category list confirmed by Aaron (Automation, Systems Integration, AI Systems, Business Intelligence, Dashboards, Workflow Optimization), matching the live Solutions() component. Case-insensitive substring match against the seed keyword list below --- substring, not semantic matching, per §4.1\'s \"deterministic, no AI\" constraint. v1 draft; refine against real submissions, not before.
  5        Budget not exploring          Match against the literal §4.2 enum value exploring --- not the §4.1 prose gloss (\"just exploring / no budget\"), which isn\'t a real enum value.
  6        Timeline not someday          Match against the literal §4.2 enum value no urgency --- same correction as Rule 5; §4.1\'s \"someday\" is descriptive, not the field value.
  7        Tech stack disclosed          Non-empty and ≠ skip.
  -------- ----------------------------- -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

+------------------------------------------------------------------------------+
| **⚠ Rule 3 permanently caps any returning submission at 6/7**                |
|                                                                              |
| Rule 3 (§4.1) fails for ANY email with an existing prospects row --- not     |
| just prior nurture leads, but past won clients resubmitting for new work.    |
| Confirmed via live trace 2026-07-08: a returning lead correctly reuses their |
| existing prospect\_id (Prospect Exists? → Use Existing Prospect, no          |
| re-insert, no TOCTOU misroute) and can still qualify at exactly 6/7.         |
|                                                                              |
| This is safe only because the threshold is 6, not 7. If                      |
| QUALIFICATION\_THRESHOLD is ever raised to 7, every returning lead and every |
| repeat client becomes structurally unqualifiable, permanently --- not an     |
| error, just a silent, correct-looking decline every time. Any future         |
| threshold change must account for this before being applied.                 |
+------------------------------------------------------------------------------+

### Rule 4 --- Keyword Seeds (v1 draft)

Case-insensitive substring match against the "Problem in operations" field. Rule
4 passes if any keyword from any category is present --- this is a pass/fail
input into the 6-of-7 threshold, not a per-category assignment;
qualification\_results does not currently store which category matched. Overlap
between categories (e.g. "streamline" under both Automation and Workflow
Optimization) is harmless for this reason. Starting list --- refine against real
submissions rather than trying to make it exhaustive up front.

  --------------------------- ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **Category**                **Keyword / phrase seeds**
  **Automation**              automate, automation, manual, repetitive, by hand, copy-paste, data entry, slow, time-consuming, tedious, RPA, robotic process, eliminate manual work
  **Systems Integration**     integrate, integration, connect, sync, API, doesn\'t talk to, disconnected systems, silo, silos, multiple systems, migrate data, single source of truth, consolidate
  **AI Systems**              AI, artificial intelligence, machine learning, chatbot, agent, LLM, predictive, generative, smart assistant, AI-powered, recommendation engine
  **Business Intelligence**   analytics, reporting, business intelligence, insights, KPI, metrics, data analysis, forecasting, trend, data-driven, benchmarking
  **Dashboards**              dashboard, real-time view, visualize, visualization, single pane of glass, live data, monitor performance, at-a-glance
  **Workflow Optimization**   optimize, optimization, streamline, bottleneck, slow, inefficient, efficiency, process improvement, restructure process, simplify process
  --------------------------- ----------------------------------------------------------------------------------------------------------------------------------------------------------------------

### Threshold configuration

n8n environment variable (QUALIFICATION\_THRESHOLD=6), read at evaluation time
--- not a new Supabase config table. A new table would itself be a schema
deviation requiring a version bump; an env var satisfies §4.1\'s \"threshold
lives in config, not code\" without touching the locked §3.2 schema.

### Idempotency & error handling

-   qualification\_results write is an upsert (above) --- safe to re-run for the
    same submission.

```{=html}
<!-- -->
```
-   Two submissions with the same email arriving concurrently could both pass
    Rule 3 before either\'s prospects row exists (TOCTOU). Accepted risk at
    current solo-builder volume: prospects.email UNIQUE rejects the second
    insert; n8n\'s error branch catches the constraint violation and routes it
    to Workflow 4 as an effective duplicate rather than failing silently.
    Revisit if submission volume increases.

-   Node failures in Phase 1--3 route to n8n\'s error workflow + Slack alert to
    Aaron (SLACK\_WEBHOOK\_URL already provisioned) rather than failing silently
    --- a real lead should never vanish with no trace.

4.2 Intake Form Fields
----------------------

All fields required unless marked optional. No AI processing at this stage.

  -------------------------- ------------------------------------------------------------------------------------------
  **Field**                  **Purpose / notes**
  Name                       Prospect\'s full name
  Email                      Load-bearing. Used for qualification (rules 2 + 3), booking email, deliverable delivery.
  Company                    Company name → creates or matches companies row
  Industry                   Free-select from list
  Problem in operations      Long text. Feeds Rule 4 classifier + Prompt A context.
  Tech stack                 Long text. Current tools in use.
  Timeline                   Enum: \<1mo / 1--3mo / 3--6mo / 6mo+ / no urgency
  Budget range               Enum: under-2500 / 2500-7500 / 7500-20000 / 20000-plus / exploring
  Goals & desired outcomes   Long text. Feeds Prompt A.
  Consent checkbox           Two-party recording disclosure. Required for discovery call recording.
  -------------------------- ------------------------------------------------------------------------------------------

5. Discovery Call Subsystem
===========================

+------------------------------------------------------------------------------+
| **■ This section replaces v1 §5 (VAPI Voice Discovery Assistant) in full.**  |
|                                                                              |
| The v1 flow used AI voice agent Nova to conduct a 20--25 min pre-booking     |
| discovery. This entire subsystem was removed in v2. Discovery is now a human |
| call between Aaron and the prospect.                                         |
+------------------------------------------------------------------------------+

5.1 Call Mechanics
------------------

-   Platform: Zoom or Google Meet (Aaron\'s choice per call). Calendly booking
    includes the meeting link.

-   Recording: Aaron enables recording at the start of the call. Two-party
    consent has already been captured via the intake form checkbox --- Aaron
    restates it verbally as courtesy.

-   Duration target: 30--45 minutes.

-   Aaron\'s prep: manual research (LinkedIn, company website, prior
    activity\_logs). No AI-generated pre-brief in v2.

5.2 Post-Call Upload Flow
-------------------------

After the call, Aaron uploads the audio file to a designated Supabase Storage
bucket. Everything downstream is automatic.

  -------- ---------------------------------------------------------------------------------------------------------------------
  **\#**   **Step**
  1        Aaron drops audio file into Supabase Storage bucket: discovery-recordings/{prospect\_id}/
  2        n8n watcher polls bucket every 60s (or Storage webhook if enabled)
  3        n8n creates discovery\_sessions row: recording\_url set, transcription\_status = pending
  4        n8n sends audio to Whisper API
  5        On Whisper response: n8n writes transcript to discovery\_sessions.transcript, sets transcription\_status = complete
  6        n8n triggers Prompt A (post-call analysis) --- see §6.1
  7        On Claude response: n8n writes structured JSON to post\_call\_analyses, sets status = pending\_review
  8        n8n creates HubSpot task for Aaron: \"Gate \#1 review: {prospect\_name}\"
  -------- ---------------------------------------------------------------------------------------------------------------------

6. AI Prompt Contracts
======================

+------------------------------------------------------------------------------+
| **■ Prompt text lives in a separate Prompt Library document.**               |
|                                                                              |
| This section defines contracts only --- what each prompt receives as input,  |
| what shape it must produce as output, and the execution order. The actual    |
| system-prompt text (role framing, JSON schemas, few-shot examples, failure   |
| modes) lives in NogalSolutions\_Prompt\_Library\_V1.docx, versioned          |
| independently of this Spec. Reason: prompt text iterates constantly based on |
| real output quality; the Spec is a stable contract that should not           |
| version-bump every time a word changes in a prompt. Write the Prompt Library |
| when Phase 3 begins.                                                         |
+------------------------------------------------------------------------------+

6.1 Prompt A --- Post-Call Analysis
-----------------------------------

Input: Whisper transcript + intake form submission. Output: structured JSON
matching post\_call\_analyses schema.

Output JSON fields:

-   business\_profile: {current\_ops, workflows, tech\_stack\_detailed,
    team\_structure}

-   pain\_points: array of {description, severity, evidence\_quote}

-   goals: array of {description, timeline, success\_metric}

-   automation\_opportunities: array of {description, estimated\_effort,
    expected\_value}

-   open\_questions: array of clarifying questions the transcript did not
    resolve

-   red\_flags: array of concerns (misaligned expectations, budget mismatch,
    scope creep signals)

-   summary\_for\_aaron: 3--5 sentence executive summary

6.2 Prompts B1--B7 --- Sequenced Deliverable Generation
-------------------------------------------------------

7 prompts executed in strict order. Each receives all prior prompt outputs as
context, ensuring downstream deliverables reference upstream ones.

  -------- -------------- ---------------------------------------------------------------------------------------------------------
  **\#**   **Prompt**     **Input / Output**
  B1       Architecture   Input: Prompt A output. Output: proposed systems architecture solution design (jsonb).
  B2       Spec           Input: Prompt A + B1. Output: technical specification referencing B1 architecture.
  B3       Roadmap        Input: Prompt A + B1 + B2. Output: phased implementation checklist matching B2 spec.
  B4       SOP            Input: Prompt A + B1 + B2 + B3. Output: client-facing standard operating procedure.
  B5       Proposal       Input: all of A + B1--B4. Output: commercial proposal body. References scope from B2, timeline from B3.
  B6       Pricing        Input: all of A + B1--B5. Output: pricing draft with rationale. Aaron sets the final number.
  B7       T&C            Input: all of A + B1--B6. Output: terms and conditions referencing B4 SOP and B6 pricing.
  -------- -------------- ---------------------------------------------------------------------------------------------------------

+------------------------------------------------------------------------------+
| **■ Why sequenced, not parallel.**                                           |
|                                                                              |
| Parallel is faster (\~30s vs 3min) but produces docs that do not know about  |
| each other. Sequenced ensures the Proposal cannot promise deliverables the   |
| Spec does not cover, and the Roadmap phases match the Spec. The latency does |
| not matter because no human is watching this run.                            |
+------------------------------------------------------------------------------+

7. n8n Workflows
================

8 workflows total. Each has one trigger and one purpose. Reviewing them in
isolation must be possible.

  -------- ----------------------- -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **\#**   **Workflow**            **Trigger → Purpose**
  1        Intake ingestion        Webhook from Supabase intake\_submissions insert → send auto-acknowledgment email. (Does not create companies/prospects rows --- see §4.1a.)
  2        Qualification           Independent trigger on intake\_submissions insert (parallel to Workflow 1, not chained off it) → apply 7 rules, create companies/prospects rows, write qualification\_results, branch to Workflow 3 or 4. Full architecture: §4.1a.
  3        Qualified handoff       Send booking email with Calendly link. Push prospect to HubSpot (one-way mirror). Slack alert to Aaron.
  4        Not-qualified decline   Send polite decline + free resource. Mark prospect as nurture in Supabase + HubSpot.
  5        Recording watcher       Poll Supabase Storage / Storage webhook → send new audio to Whisper → write transcript.
  6        Post-call analysis      Trigger on transcript complete → run Prompt A → write post\_call\_analyses (pending\_review) → HubSpot task for Aaron.
  7        Sequenced generation    Trigger on Gate \#1 approval webhook from HubSpot → run Prompts B1--B7 in sequence → write deliverables rows.
  8        Revision loop           Trigger on negotiation notes from Aaron → re-run affected B-prompts only → new deliverable versions.
  -------- ----------------------- -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

7a Workflows 3 & 4 --- Shared Sub-workflow Architecture
-------------------------------------------------------

Architecture decision record, drafted by Claude (Architect role, §10.1) for
Claude Code CLI implementation per the §10.2 handoff protocol. Resolves how
Workflows 3 and 4 avoid duplicating status-update and logging logic without
merging into a single workflow.

+------------------------------------------------------------------------------+
| **Design decision, not a bug fix --- merging 3 and 4 into one workflow was   |
| considered and rejected**                                                    |
|                                                                              |
| §7 states plainly: "8 workflows total. Each has one trigger and one purpose. |
| Reviewing them in isolation must be possible." Merging Workflows 3 and 4     |
| into a single workflow would violate this directly --- one save touching     |
| both the qualified-handoff path (Calendly, HubSpot) and the decline path     |
| (Resend, nurture status) at once, the same shared-surface risk already seen  |
| elsewhere in this project (systemic privilege grants, a stale browser tab    |
| racing a programmatic patch).                                                |
|                                                                              |
| The genuine duplication between the two paths --- both need to resolve the   |
| prospect record and update its status --- is real, but it\'s resolved by     |
| extracting that shared step into a reusable sub-workflow, not by merging the |
| entry points. Each of Workflow 3 and 4 keeps its own trigger, its own        |
| external-API surface, and its own isolated review surface, exactly as §7     |
| requires.                                                                    |
+------------------------------------------------------------------------------+

### Shared sub-workflow: Resolve Prospect + Update Status

Called via n8n\'s Execute Workflow node from both Workflow 3 and Workflow 4 ---
not a webhook-triggered workflow itself, so it does not appear as a 9th row in
§7\'s inventory; it has no independent trigger of its own.

  ---------------------- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **Step**               **Detail**
  Input parameters       intake\_submission\_id (uuid), qualified (boolean)
  1\. Resolve prospect   intake\_submissions.prospect\_id → fetch the full prospects row (email, full\_name, company\_id). This lookup exists because qualification\_results only carries intake\_submission\_id, not prospect\_id directly --- both calling workflows need the resolved prospect record before they can do anything useful with it.
  2\. Update status      UPDATE prospects SET status = \'qualified\' WHERE qualified = true, else status = \'nurture\' (§3.3 --- literal enum value is nurture, never disqualified).
  3\. Log activity       INSERT INTO activity\_logs: prospect\_id (resolved above), event\_type = \'prospect.qualified\' or \'prospect.nurture\', occurred\_at = now(), metadata = {from\_status: \'new\', to\_status: \'\<qualified\|nurture\>\', rule\_count: 7} --- matches the metadata shape already illustrated in §3.2.10.
  Output                 Returns the resolved prospect record (id, email, full\_name, company\_id) so neither calling workflow needs a second lookup just to send an email or push to HubSpot.
  ---------------------- -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

### Workflow 3 --- Qualified handoff (unique responsibilities only)

-   Trigger: webhook from notify\_n8n\_qual\_branch, qualified = true path
    (§4.1a Phase 4).

-   Call the shared sub-workflow with qualified = true.

-   Send booking email with Calendly link, using the resolved prospect\'s
    email/name from the sub-workflow\'s return value.

-   Push prospect to HubSpot (one-way mirror, per §8.1).

-   Slack alert to Aaron.

### Workflow 4 --- Not-qualified decline (unique responsibilities only)

-   Trigger: same webhook, qualified = false path.

-   Call the shared sub-workflow with qualified = false.

-   Send polite decline email + free resource link.

-   HubSpot Contact upsert (by email), no Deal and no pipeline stage ---
    resolves the original §1.3/§7 disagreement (§1.3 said Supabase-only, §7 row
    4 said Supabase + HubSpot; §7a previously sided with §1.3 without flagging
    the conflict). Contact-only, decided 2026-07-08: gives future re-engagement
    visibility without cluttering the sales pipeline with non-deals. This is why
    the upsert-by-email design in Workflow 3\'s Contact push matters: when a
    nurture lead later resubmits and qualifies, Workflow 3 finds and reuses this
    same Contact rather than creating a disconnected second one --- confirmed
    structurally sound by the Phase 2 reactivation trace (2026-07-08).

7b. Workflows 5--8 --- Architecture Decision Record
===================================================

Architecture decision record, drafted by Claude (Architect role, §10.1) for
Claude Code CLI implementation per the §10.2 handoff protocol --- same status as
§7a. Resolves the workflow-level design gaps left open after Prompt Library v1
defined the AI-contract layer for Workflows 6--8, and Roadmap Phase 3 defined
Workflow 5\'s happy path. Four decisions, made with Aaron 2026-07-12: Workflow
5\'s trigger and failure handling, Workflow 7\'s idempotency/resume semantics,
Workflow 8\'s revision-scope selection mechanism, and the Gate \#1/\#2 HubSpot
field mappings.

7b.1 Workflow 5 --- Recording Watcher / Transcription
-----------------------------------------------------

-   **Trigger:** Supabase Database Webhook on storage.objects INSERT, scoped
    with WHERE bucket\_id = \'discovery-recordings\'. Same reactive pattern as
    Workflows 1 and 2 (webhook off a table insert) --- not a new polling
    mechanism, so the pipeline has one trigger convention throughout, not two.

-   **Path parsing:** the webhook payload\'s record.name gives the
    {prospect\_id}/\... path (per the SOP naming convention already in Roadmap
    Phase 3); Workflow 5 resolves prospect\_id from this path when creating the
    discovery\_sessions row.

-   **Failure handling:** transcription\_status extended to \'pending\' \|
    \'complete\' \| \'failed\' (schema change below). On a Whisper API error,
    retry once; on second failure, set transcription\_status = \'failed\' and
    Slack-alert Aaron with prospect name + error detail --- same
    retry-once-then-hard-fail shape as the Prompt Library\'s Claude-call failure
    protocol (§8 there), applied one layer earlier to the Whisper call.

-   **Recovery:** a \'failed\' row is manually re-run by Aaron once the
    underlying issue (bad audio, expired signed URL, etc.) is fixed. Single-call
    step --- no resume/idempotency logic needed here, unlike Workflow 7.

+------------------------------------------------------------------------------+
| **⚠ Required schema change.**                                                |
|                                                                              |
| ALTER TYPE transcription\_status ADD VALUE \'failed\'; --- non-transactional |
| per §3.3\'s existing note on enum additions. This is a DDL change to the     |
| locked v2.8 schema and goes through the standard DB-write hard gate (exact   |
| SQL presented, explicit go-ahead required) before being applied, executed by |
| whichever session holds the live Supabase connection --- not this one.       |
+------------------------------------------------------------------------------+

7b.2 Workflow 7 --- Sequenced Generation: Idempotency & Resume
--------------------------------------------------------------

**Problem:** Workflow 7 runs B1→B7 as seven separate Claude calls, each writing
its own deliverables row. A mid-sequence crash (process restart, transient
network failure) can leave a partial set of rows with no defined resume behavior
--- the exact gap the Prompt Library (§8) explicitly deferred to "workflow
design."

**Decision:** delete-and-restart, using existing columns --- no new schema
needed. A first-generation attempt is fully identified by (prospect\_id, version
= 1, revision\_loop\_id IS NULL), reusing the same single-direction-relationship
principle already established in §3.5 rather than introducing a redundant
generation\_run\_id.

On Workflow 7 start, count deliverables rows matching (prospect\_id, version =
1, revision\_loop\_id IS NULL):

  ----------- ------------------------------------ ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **Count**   **Meaning**                          **Action**
  0           Fresh run                            Start at B1
  1--6        Previous attempt died mid-sequence   Delete those rows, restart clean from B1
  7           Already complete                     Should not be re-triggered by a legitimate Gate \#1 approval --- log + Slack-alert Aaron rather than silently regenerating or no-op\'ing; implies an upstream double-fire
  ----------- ------------------------------------ ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------

7b.3 Workflow 8 --- Revision Scope Selection
--------------------------------------------

**Decision:** a structured HubSpot multi-select property (one option per
deliverable type: Architecture, Spec, Roadmap, SOP, Proposal, Pricing, T&C)
drives Workflow 8\'s dispatch --- not free-text classification by an LLM.

Free-text negotiation notes remain the content fed into the revision prompt
(Prompt Library §7.1, the {{ revision\_notes }} block); the multi-select is
purely the dispatch mechanism and stays separate from prompt content.

+------------------------------------------------------------------------------+
| **Design decision --- structured dispatch, not AI-inferred scope**           |
|                                                                              |
| Consistent with Rule 3 (deterministic where possible) and the existing Gate  |
| \#1/\#2 pattern --- Aaron makes the explicit scope decision, the system      |
| executes deterministically on top of it, rather than an LLM inferring scope  |
| from prose ahead of a dispatch decision. The latter would reintroduce the    |
| AI-as-gatekeeper risk Rule 2 exists to prevent, for a decision that costs    |
| Aaron two seconds to make directly.                                          |
+------------------------------------------------------------------------------+

7b.4 Gate \#1 / Gate \#2 --- HubSpot Field Mapping
--------------------------------------------------

Both objects follow the same split-by-risk principle: plain-string fields are
directly editable; machine-structured or array-of-object fields are read-only,
with corrections routed through a hold + note + targeted re-run rather than
hand-edited JSON.

**PostCallAnalysis custom object (Gate \#1)**

-   **Directly editable:** business\_profile.current\_ops, .workflows,
    .tech\_stack\_detailed, .team\_structure (four properties);
    summary\_for\_aaron. Plain strings, trivial reconstruction back into the
    analysis jsonb.

-   **Read-only (formatted text):** pain\_points, goals,
    automation\_opportunities, open\_questions, red\_flags. Structural
    corrections don\'t happen via inline edit --- Aaron holds the record, uses
    the existing notes field (post\_call\_analyses.notes) to record what\'s
    wrong, and Prompt A re-runs. Consistent with notes\' existing schema purpose
    ("rationale for inline edits made pre-approval").

**Deliverable custom object (Gate \#2)**

-   **Directly editable:** title, client\_company, executive\_summary (plain
    strings).

-   **Directly editable, single concatenated markdown property:** sections\[\]
    --- rendered as "\#\# heading" + body\_markdown blocks concatenated in
    document order, reconstructed back into sections\[\] by splitting on \#\#
    boundaries on save. This is the primary pre-send prose-editing surface Gate
    \#2\'s "edit" action is meant for.

-   **Read-only:** type\_payload. Machine-structured, feeds the Prompt
    Library\'s deterministic validators (e.g. B6\'s draft\_total\_usd =
    sum(line\_items), B2/B5\'s FR cross-references). Corrections go through
    hold + note + single B-prompt re-run --- same principle as Gate \#1\'s array
    fields.

-   **Read-only (formatted text):** assumptions, source\_refs, revision\_summary
    (reference-only; revision\_summary populated only on Workflow 8 runs).

+------------------------------------------------------------------------------+
| **✓ Resolved 2026-07-12 --- pre-send correction versioning.**                |
|                                                                              |
| Decision (Option B): a Gate \#2 hold-and-regenerate still increments         |
| deliverables.version, but revision\_loop\_id stays NULL to mark it as a      |
| pre-send correction rather than a post-negotiation revision. This preserves  |
| the audit trail your own schema already protects elsewhere (§3.5\'s          |
| generated\_at/reviewed\_at/sent\_at reasoning) --- overwriting version = 1   |
| in place would have silently discarded what Gate \#2 caught and fixed before |
| send. Implementation consequence, not a new decision: the Gate \#2 queue     |
| definition (§8.2) must select the latest version per (prospect\_id, type)    |
| with status = pending\_review, not just any row with that status ---         |
| otherwise a superseded version 1 and its correction (version 2) would both   |
| appear as pending review.                                                    |
+------------------------------------------------------------------------------+

**Schema changes this ADR requires** (both subject to the DB-write hard gate,
executed later, not in this session): (1) ALTER TYPE transcription\_status ADD
VALUE \'failed\'; (2) no changes required for the Workflow 7 idempotency
decision --- it reuses existing deliverables columns.

**HubSpot-side changes** (not a production DB gate, but still subject to
Aaron\'s node-by-node review per §10.2 when built): PostCallAnalysis custom
object properties per §7b.4; Deliverable custom object properties per §7b.4; new
multi-select property for Workflow 8 scope selection.

8. HubSpot Integration
======================

+------------------------------------------------------------------------------+
| **⚠ HubSpot is a view, not a store.**                                        |
|                                                                              |
| HubSpot is a read/write surface for human review. All authoritative writes   |
| route through Supabase --- either directly (n8n → Supabase) or via HubSpot   |
| webhook → n8n → Supabase. Direct HubSpot writes that do not sync back to     |
| Supabase within 60 seconds are a bug, not a feature.                         |
+------------------------------------------------------------------------------+

8.1 Data Flow
-------------

  ------------------------------ ---------------------------------------------------------------------------------------------------------------------------------------------------------------
  **Direction**                  **What flows**
  Supabase → HubSpot (push)      New qualified prospect (contact + company); post\_call\_analyses JSON as custom object; deliverables as custom objects with content field; stage transitions.
  HubSpot → Supabase (webhook)   Gate \#1 approval + JSON edits; Gate \#2 per-deliverable approval + content edits; Sent status when Aaron clicks Send; negotiation revision notes.
  ------------------------------ ---------------------------------------------------------------------------------------------------------------------------------------------------------------

8.2 Aaron\'s HubSpot Views
--------------------------

-   Pipeline overview --- prospects by stage (qualified / discovery scheduled /
    analysis pending / deliverables pending / sent / won / lost / negotiating).

-   Gate \#1 queue --- post\_call\_analyses with status = pending\_review.

-   Gate \#2 queue --- deliverables with status = pending\_review, grouped by
    prospect.

-   Revision queue --- negotiating prospects with unresolved revision\_loops.

9. Deployment Topology
======================

  -------------------------------- ------------------------------------------------------------------------------------------------------------------------------------------------------------
  **Component**                    **Where it runs**
  Frontend (nogalsolutions.tech)   Cloudflare Pages. DNS + CDN + SSL via Cloudflare.
  Frontend env vars                Cloudflare Pages → Project Settings → Environment Variables. NOT the VPS.
  Supabase                         Managed (Supabase Cloud). Project: nogalsolutions-prod.
  n8n                              Self-hosted on Hostinger VPS. Reverse-proxied via Nginx with HTTPS.
  n8n env vars                     VPS-side .env file. Never committed. Includes SUPABASE\_SERVICE\_ROLE\_KEY, ANTHROPIC\_API\_KEY, OPENAI\_API\_KEY, HUBSPOT\_API\_KEY, SLACK\_WEBHOOK\_URL.
  HubSpot                          HubSpot Cloud (free tier).
  Calendly                         Calendly Cloud (free tier).
  -------------------------------- ------------------------------------------------------------------------------------------------------------------------------------------------------------

10. Build Tooling & Review
==========================

10.1 AI Tool Roles
------------------

  ------------------------------- ----------------------------- ------------------------------------------------------------------------------------------
  **Tool**                        **Role**                      **Responsibilities**
  Claude Sonnet (this document)   Architect                     System design, specs, database schema, prompt engineering.
  Claude Code CLI                 Implementer (all platforms)   Frontend (VS Code), backend workflows (n8n via MCP), SQL migrations (Supabase).
  Aaron                           Reviewer (Option A)           Reviews every Claude Code output node-by-node before deployment. Sole independent check.
  ------------------------------- ----------------------------- ------------------------------------------------------------------------------------------

10.2 Handoff Protocol
---------------------

1.  Aaron requests a workflow, component, or migration from Claude Code CLI with
    a scoped prompt referencing the relevant Spec sections.

```{=html}
<!-- -->
```
5.  Claude Code generates the code / workflow JSON / migration script.

6.  Aaron opens the output in n8n editor / VS Code / Supabase SQL editor and
    reviews every node or line.

7.  Aaron runs it against staging or dry-run mode where possible.

8.  Only after review passes does Aaron activate / deploy / apply the migration.

+------------------------------------------------------------------------------+
| **✓ Reviewer decision --- Option A (locked v2.0).**                          |
|                                                                              |
| Aaron is the sole human reviewer. No second AI review layer for the          |
| solo-builder phase. Revisit if drift becomes expensive with paying clients;  |
| upgrade to Option B (fresh-context Claude Code session) at that point. This  |
| closes the OPEN item from v1.2.                                              |
+------------------------------------------------------------------------------+

11. Environment Variables Reference
===================================

+------------------------------------------------------------------------------+
| **⚠ Never commit these to version control.**                                 |
|                                                                              |
| Store in .env (local dev) and Cloudflare Pages env vars (frontend            |
| production) and VPS .env (n8n production). Service-role key never leaves the |
| backend.                                                                     |
+------------------------------------------------------------------------------+

  -------------------------------------- ------------------------------------------------------------------------------------------------------------------------------------------
  **Variable**                           **Where it lives + source**
  VITE\_SUPABASE\_URL                    Cloudflare Pages. From Supabase project settings.
  VITE\_SUPABASE\_ANON\_KEY              Cloudflare Pages. Public; RLS enforces safety.
  SUPABASE\_SERVICE\_ROLE\_KEY           VPS .env (n8n). NEVER Cloudflare Pages. NEVER frontend. Bypasses RLS.
  ANTHROPIC\_API\_KEY                    VPS .env (n8n). From console.anthropic.com.
  OPENAI\_API\_KEY                       VPS .env (n8n). For Whisper transcription.
  CALENDLY\_API\_KEY                     VPS .env (n8n). From Calendly settings.
  HUBSPOT\_API\_KEY                      VPS .env (n8n). Private App token from HubSpot.
  SLACK\_WEBHOOK\_URL                    VPS .env (n8n). From Slack Apps → Incoming Webhooks.
  SMTP\_HOST / SMTP\_USER / SMTP\_PASS   VPS .env (n8n). Transactional email provider.
  ANTHROPIC\_MODEL                       VPS .env (n8n). Pinned exact model string for Prompts A and B1--B7 (Prompt Library §3.3).
  PROMPT\_A\_TEMP                        VPS .env (n8n). Prompt A sampling temperature (Prompt Library §3.3). Default 0.2.
  PROMPT\_B\_TEMP                        VPS .env (n8n). Prompts B1--B7 sampling temperature (Prompt Library §3.3). Default 0.4.
  PROMPT\_A\_MAX\_TOKENS                 VPS .env (n8n). Prompt A max output tokens (Prompt Library §3.3). Default 4096.
  PROMPT\_B\_MAX\_TOKENS                 VPS .env (n8n). Prompts B1--B7 max output tokens (Prompt Library §3.3). Default 8192.
  QUALIFICATION\_THRESHOLD               VPS .env (n8n). Qualification engine pass threshold (§4.1a). Currently 6 --- do not raise to 7 without reviewing the Rule 3 cap warning.
  -------------------------------------- ------------------------------------------------------------------------------------------------------------------------------------------

***If it is not in this document, it does not get built.***

© 2026 Aaron Nogal. All rights reserved.

*This document is the canonical reference for the NogalSolutions internal build.
Not for external distribution.*
