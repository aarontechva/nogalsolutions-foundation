**NORTH STAR CANONICAL REFERENCE**

**NogalSolutions System Specification**

*AI-augmented consulting operations --- the contract every builder
builds against.*

  ----------------------- -----------------------------------------------
  **Document Type**       System Specification (canonical reference)

  **Built By**            Aaron Nogal

  **Platform**            Cloudflare Pages (frontend) + Supabase + n8n on
                          Hostinger VPS + HubSpot (review surface)

  **Status**              v2.8 --- Locked. Deviations require version
                          bump.

  **Version**             2.8 --- Workflow 4 HubSpot resolution added to
                          §7a (Contact-only upsert, no Deal --- resolves
                          the §1.3/§7 disagreement on whether decline
                          path touches HubSpot); Rule 3 cap-at-6/7
                          warning added to §4.1a (returning leads and
                          repeat clients always fail Rule 3 by definition
                          --- safe only while threshold stays at 6).

  **Date**                2026-07-08
  ----------------------- -----------------------------------------------

*If it is not in this document, it does not get built.*

# 1. Governing Principles

## 1.1 The Three Rules

These rules are load-bearing. Every design choice downstream must be
reconcilable with them; if a proposed change conflicts, the change is
wrong, not the rule.

+-----------------------------------------------------------------------+
| **⚠ Rule 1 --- Supabase is the Single Source of Truth (SSOT).**       |
|                                                                       |
| All authoritative state lives in Supabase. Every other system ---     |
| n8n, HubSpot, the Cloudflare Pages frontend, any future CRM --- is a  |
| consumer or a view. When two systems disagree on a field, Supabase    |
| wins by definition. HubSpot changes route back to Supabase within 60  |
| seconds or they are a bug.                                            |
+-----------------------------------------------------------------------+

+-----------------------------------------------------------------------+
| **⚠ Rule 2 --- AI prepares, humans decide.**                          |
|                                                                       |
| AI drafts, structures, and surfaces intelligence. It does not send    |
| anything to a prospect, it does not set prices, and it does not       |
| qualify leads. Every client-facing artifact passes through Aaron      |
| before it leaves the system. AI should never feel like a gatekeeper.  |
+-----------------------------------------------------------------------+

+-----------------------------------------------------------------------+
| **⚠ Rule 3 --- Deterministic where possible, AI where deterministic   |
| breaks.**                                                             |
|                                                                       |
| Qualification, routing, calendar unlocks, and status transitions are  |
| business rules --- code, not prompts. AI enters only where structured |
| output from unstructured input is genuinely required: transcript      |
| analysis, document drafting, semantic classification.                 |
+-----------------------------------------------------------------------+

## 1.2 AI Placement Map

This table is the honest ledger of where AI touches the pipeline and
where it does not. It supersedes all prior placement maps.

  ---------------------------------------------------------------------------
  **Stage**             **AI Used?** **Aaron\'s role**
  --------------------- ------------ ----------------------------------------
  Intake form           No           Designed the fields, does not touch each
                                     submission

  Qualification engine  No           Set the rules once; deterministic
                                     thereafter

  Auto-acknowledgment   No           Template only; sends automatically on
  email                              submit

  Booking + calendar    No           Template only; sends on qualified result
  email                              

  Discovery call        No           Conducts the call personally

  Audio transcription   Yes          Uploads recording; reviews transcript if
                        (Whisper)    needed

  Post-call analysis    Yes (Claude) Gate #1: approves or edits JSON before
  JSON                               deliverables generate

  Deliverable drafting  Yes (Claude, Gate #2: per-document approve / edit /
  (7 docs)              sequenced)   hold

  Pricing draft         Yes (Claude) AI drafts a number; Aaron sets the final
                                     number

  Send to client        No           Aaron clicks Send; nothing auto-sends

  Second-call proposal  No           Aaron leads the call
  walkthrough                        

  Negotiation revision  Partial      Aaron captures notes; Claude re-drafts
  loop                               affected sections only
  ---------------------------------------------------------------------------

## 1.3 End-to-End Flow

One diagram, read top to bottom. Every arrow is either a deterministic
n8n step or a human action; there are no hidden branches.

  -------------------------------------------------------------------------
  **Stage**       **What happens**
  --------------- ---------------------------------------------------------
  1\. Intake      Prospect submits form on nogalsolutions.tech. Row written
                  to Supabase.intake_submissions. Auto-acknowledgment email
                  fires.

  2\.             n8n reads intake, applies 7 deterministic rules. Writes
  Qualification   result to Supabase.qualification_results.

  3a. Qualified   Booking email + Calendly link sent immediately. No AI
  path            gate before booking.

  3b.             Polite decline email + free resource sent. Prospect moved
  Not-qualified   to nurture status in Supabase + HubSpot (Contact only, no
  path            Deal --- see §7a). n8n logs event to activity_logs.

  4\. Discovery   Aaron + prospect on Zoom/Meet. Recorded with two-party
  call            consent (checkbox in intake T&C). Aaron uploads recording
                  to designated Supabase Storage bucket after call.

  5\.             n8n watches the bucket, sends audio to Whisper, writes
  Transcription   transcript to Supabase.discovery_sessions.

  6\. Post-call   n8n sends transcript to Claude with Prompt A. Structured
  analysis        JSON written to Supabase.post_call_analyses with status =
                  pending_review.

  7\. Gate #1     Aaron reviews the JSON in HubSpot. Edits inline as
  (Aaron)         needed. Marks approved. Webhook fires back to n8n →
                  Supabase status = approved.

  8\. Sequenced   n8n runs 7 Claude calls in sequence: Architecture → Spec
  generation      → Roadmap → SOP → Proposal → Pricing → T&C. Each call
                  receives all prior deliverables as context. Rows written
                  to Supabase.deliverables with status = pending_review.

  9\. Gate #2     Aaron reviews each deliverable in HubSpot. Per-document
  (Aaron)         approve / edit / hold. Approved deliverables sent to
                  prospect via email (Aaron clicks Send).

  10\. Second     Proposal walkthrough. Outcome recorded: Won / Lost /
  call            Negotiating.

  11\.            If Negotiating, Aaron records revision notes. n8n
  Negotiation     triggers sequenced re-generation of only affected
  loop            deliverables. Returns to Gate #2.

  12\. Close      Won or Lost recorded in Supabase.meetings.outcome.
                  Activity log updated. HubSpot pipeline stage synced.
  -------------------------------------------------------------------------

# 2. System Architecture

## 2.1 Tech Stack

  ------------------------------------------------------------------------
  **Layer**        **Tool**                 **Role**
  ---------------- ------------------------ ------------------------------
  Frontend         React + Vite on          Intake form, marketing site.
                   Cloudflare Pages         Deployed at
                                            nogalsolutions.tech.

  Data Layer       Supabase (Postgres +     Canonical data store. RLS
  (SSOT)           Auth + Storage)          enabled with deny-by-default.
                                            Audio recordings in Storage.

  Orchestration    n8n on Hostinger VPS     All workflows. Reads/writes
                                            Supabase. Calls Claude,
                                            Whisper, HubSpot, Calendly,
                                            email.

  AI --- Analysis  Claude (Anthropic API)   Post-call analysis JSON;
  & Drafting                                sequenced generation of 7
                                            deliverables.

  AI ---           Whisper (OpenAI API)     Audio → text.
  Transcription                             

  Calendar         Calendly                 Booking after qualification.

  Review Surface   HubSpot Free CRM         Aaron reviews Gate #1 (JSON)
                                            and Gate #2 (deliverables) in
                                            HubSpot UI. Two-way sync with
                                            Supabase.

  Notifications    Slack + SMTP email       Aaron alerts on qualified
                                            leads, gate items awaiting
                                            review.

  Frontend Impl.   Claude Code CLI          Already shipped. Cloudflare
  (v1)                                      Pages deploy.

  Backend Impl.    Claude Code CLI (via n8n Human-review-before-deploy per
  (v2+)            MCP + VS Code)           §10.2.
  ------------------------------------------------------------------------

## 2.2 What Changed From v1.x

+-----------------------------------------------------------------------+
| **⚠ VAPI Voice Discovery Assistant --- REMOVED.**                     |
|                                                                       |
| v1 required prospects to complete a 20--25 min AI voice session       |
| before booking Aaron. This violated §1.1 Rule 2 (AI as gatekeeper)    |
| and imposed friction on high-intent leads. Human discovery call       |
| restored as the trust-building first touch.                           |
+-----------------------------------------------------------------------+

+-----------------------------------------------------------------------+
| **✓ Sequenced deliverable generation --- NEW.**                       |
|                                                                       |
| The 7 deliverables (Architecture, Spec, Roadmap, SOP, Proposal,       |
| Pricing, T&C) are generated in strict order, each receiving prior     |
| outputs as context. Prevents commercial docs from promising work the  |
| technical docs do not cover.                                          |
+-----------------------------------------------------------------------+

+-----------------------------------------------------------------------+
| **⚠ Pre-call brief --- DEFERRED.**                                    |
|                                                                       |
| v2-draft included an AI-generated pre-call brief. Deferred until      |
| Aaron has 15--20 real discovery calls under his belt and can          |
| pattern-match what a good brief actually looks like. Building it now, |
| on zero real data, would ship generic output and over-engineer the    |
| pipeline.                                                             |
+-----------------------------------------------------------------------+

+-----------------------------------------------------------------------+
| **✓ HubSpot as review surface --- NEW.**                              |
|                                                                       |
| Custom Consultant Workspace replaced by HubSpot for Gate #1 and Gate  |
| #2. Weeks of frontend work eliminated. Supabase remains SSOT; HubSpot |
| is a view, not a store.                                               |
+-----------------------------------------------------------------------+

# 3. Database Schema (Supabase)

+-----------------------------------------------------------------------+
| **⚠ RLS is mandatory.**                                               |
|                                                                       |
| Row Level Security must be enabled on every table below with a        |
| deny-by-default policy before the anon key ships in any client build. |
| Server-side writes (n8n, Edge Functions) use                          |
| SUPABASE_SERVICE_ROLE_KEY, which bypasses RLS and must never reach    |
| the frontend or version control.                                      |
+-----------------------------------------------------------------------+

## 3.1 Table Inventory

Purpose-level summary of the 10 tables and their evolution from v1. Full
column definitions live in §3.2.

  -----------------------------------------------------------------------------------
  **Table**                   **Purpose**                        **v1 → v2**
  --------------------------- ---------------------------------- --------------------
  **companies**               One row per prospect company.      Unchanged
                              Name, website, industry, size.     

  **prospects**               One row per prospect person. FK to Unchanged
                              companies. Email is NOT NULL       
                              UNIQUE. Pipeline status tracked as 
                              enum.                              

  **intake_submissions**      Raw form submission payload as     Unchanged
                              jsonb + timestamp. Immutable audit 
                              record.                            

  **qualification_results**   Rule-by-rule breakdown per         Unchanged
                              submission stored as jsonb.        
                              Qualified boolean + summary        
                              reason.                            

  **discovery_sessions**      Human discovery call metadata.     Renamed from
                              Recording URL, transcript,         voice_sessions
                              transcription status.              

  **post_call_analyses**      Claude-generated structured JSON   New (split from
                              per session. Gate #1 artifact.     discovery_reports)

  **deliverables**            One row per generated document.    New (absorbs
                              Type, content jsonb, version,      proposals)
                              status, edit history.              

  **meetings**                Discovery + proposal calls. Type + Unchanged
                              outcome per meeting.               

  **revision_loops**          Negotiation cycles. Notes,         New
                              resolution status, meeting link.   

  **activity_logs**           Chronological event log per        Unchanged
                              prospect. Every state transition.  
                              Append-only.                       
  -----------------------------------------------------------------------------------

## 3.2 Column Definitions --- All 10 Tables

Each subsection defines the columns for one table. Types are Postgres
types as they will appear in the migration. Every non-trivial decision
is annotated in Notes. Tables are presented in FK-dependency order ---
earlier tables have no forward references to later ones.

### 3.2.1 companies

No foreign key dependencies. Root of the company graph.

  ------------------------------------------------------------------------
  **Column**       **Type**           **Notes**
  ---------------- ------------------ ------------------------------------
  **id**           uuid PK            gen_random_uuid() default.

  **name**         text NOT NULL      Company display name. Required.

  **website**      text               Optional. No format constraint at DB
                                      level.

  **industry**     text               Free text; no fixed taxonomy
                                      defined.

  **size**         text               Stored as text to accommodate common
                                      range strings (e.g. \'11--50\',
                                      \'Enterprise\'). No enum until a
                                      fixed tier model is committed.

  **created_at**   timestamptz NOT    Default now().
                   NULL               

  **updated_at**   timestamptz NOT    Default now(). Application layer or
                   NULL               trigger maintains on update.
  ------------------------------------------------------------------------






### 3.2.2 prospects

Depends on: companies. Central identity table for pipeline participants.

  ------------------------------------------------------------------------
  **Column**       **Type**           **Notes**
  ---------------- ------------------ ------------------------------------
  **id**           uuid PK            gen_random_uuid() default.

  **company_id**   uuid FK NULLABLE   REFERENCES companies(id) ON DELETE
                                      SET NULL. Nullable so a prospect may
                                      be captured before the company
                                      record is created.

  **full_name**    text NOT NULL      Single field. Matches §4.2 intake
                                      form \'Name\' field. Not split into
                                      first/last --- the form does not
                                      split, and the pipeline treats the
                                      prospect as a single named contact.

  **email**        text NOT NULL      Load-bearing. Used for qualification
                   UNIQUE             rules 2 and 3 (§4.1), booking email,
                                      deliverable delivery.

  **phone**        text               Optional. Captured if provided; not
                                      required by qualification.

  **status**       prospect_status    Enum. Default \'new\'. See §3.3 for
                   NOT NULL           full enum values.

  **created_at**   timestamptz NOT    Default now().
                   NULL               

  **updated_at**   timestamptz NOT    Default now().
                   NULL               
  ------------------------------------------------------------------------

### 3.2.3 intake_submissions

Depends on: prospects. Immutable audit record of the raw form
submission.

  --------------------------------------------------------------------------
  **Column**         **Type**           **Notes**
  ------------------ ------------------ ------------------------------------
  **id**             uuid PK            gen_random_uuid() default.

  **prospect_id**    uuid FK NULLABLE   REFERENCES prospects(id) ON DELETE
                                        SET NULL. Nullable because the match
                                        to a prospect record may occur
                                        asynchronously after the raw
                                        submission is persisted.

  **payload**        jsonb NOT NULL     Full raw payload of every §4.2 field
                                        submitted, plus any additional
                                        client-side metadata. Immutable ---
                                        writes only happen on insert.

  **submitted_at**   timestamptz NOT    Client-reported submission time.
                     NULL               Distinct from created_at so DB-write
                                        latency does not overwrite the true
                                        submission moment.

  **created_at**     timestamptz NOT    DB insert time. Default now().
                     NULL               
  --------------------------------------------------------------------------

### 3.2.4 qualification_results

Depends on: intake_submissions. Rule-by-rule outcome for the 7
qualification rules (§4.1).

  -------------------------------------------------------------------------------
  **Column**                 **Type**          **Notes**
  -------------------------- ----------------- ----------------------------------
  **id**                     uuid PK           gen_random_uuid() default.

  **intake_submission_id**   uuid FK NOT NULL  REFERENCES intake_submissions(id)
                             UNIQUE            ON DELETE CASCADE. UNIQUE enforces
                                               one qualification result per
                                               submission --- re-evaluation
                                               replaces the row.

  **qualified**              boolean NOT NULL  Top-level pass/fail. Threshold: 6
                                               of 7 rules passing (§4.1).

  **reason**                 text              Human-readable summary of the
                                               decision, used in comms and
                                               activity logs.

  **rule_results**           jsonb NOT NULL    Array of per-rule outcomes.
                                               Element shape: {rule: int, name:
                                               string, pass: boolean, reason:
                                               string}. jsonb rather than 14 flat
                                               columns so rule metadata can
                                               evolve without schema migration.

  **evaluated_at**           timestamptz NOT   When rules were evaluated.
                             NULL              Distinct from created_at for
                                               async/batch evaluation patterns.
                                               Default now().

  **created_at**             timestamptz NOT   Default now().
                             NULL              
  -------------------------------------------------------------------------------


### 3.2.5 meetings

Depends on: prospects. Discovery + proposal calls.

  --------------------------------------------------------------------------
  **Column**         **Type**           **Notes**
  ------------------ ------------------ ------------------------------------
  **id**             uuid PK            gen_random_uuid() default.

  **prospect_id**    uuid FK NOT NULL   REFERENCES prospects(id) ON DELETE
                                        CASCADE.

  **type**           meeting_type NOT   Enum: \'discovery\' \| \'proposal\'.
                     NULL               See §3.3.

  **scheduled_at**   timestamptz NOT    When the meeting is booked to occur.
                     NULL               

  **outcome**        meeting_outcome    Enum: \'won\' \| \'lost\' \|
                     NULLABLE           \'negotiating\'. Nullable until the
                                        meeting concludes.

  **notes**          text               Free-text field for call context
                                        that does not belong in structured
                                        analysis.

  **created_at**     timestamptz NOT    Default now().
                     NULL               

  **updated_at**     timestamptz NOT    Default now().
                     NULL               
  --------------------------------------------------------------------------

### 3.2.6 discovery_sessions

Depends on: prospects, meetings. Metadata for the human discovery call.

  -------------------------------------------------------------------------------------
  **Column**                 **Type**               **Notes**
  -------------------------- ---------------------- -----------------------------------
  **id**                     uuid PK                gen_random_uuid() default.

  **prospect_id**            uuid FK NOT NULL       REFERENCES prospects(id) ON DELETE
                                                    CASCADE.

  **meeting_id**             uuid FK NULLABLE       REFERENCES meetings(id) ON DELETE
                                                    SET NULL. Nullable so the session
                                                    record can be created before the
                                                    meeting is formally logged.

  **recording_url**          text                   Nullable until the recording is
                                                    available in Supabase Storage
                                                    post-call.

  **transcript**             text                   Full transcript in-column. Expected
                                                    long-form. Nullable until
                                                    transcription completes.

  **transcription_status**   transcription_status   Enum: \'pending\' \| \'complete\'.
                             NOT NULL               Default \'pending\'. See §3.3.

  **created_at**             timestamptz NOT NULL   Default now().

  **updated_at**             timestamptz NOT NULL   Default now().
  -------------------------------------------------------------------------------------

### 3.2.7 post_call_analyses

Depends on: discovery_sessions. Claude-generated JSON --- the Gate #1
artifact.

  -------------------------------------------------------------------------------
  **Column**                 **Type**          **Notes**
  -------------------------- ----------------- ----------------------------------
  **id**                     uuid PK           gen_random_uuid() default.

  **discovery_session_id**   uuid FK NOT NULL  REFERENCES discovery_sessions(id)
                             UNIQUE            ON DELETE CASCADE. UNIQUE --- one
                                               analysis per session. Revisions
                                               update the existing row.

  **analysis**               jsonb NOT NULL    Structured JSON output from Prompt
                                               A (§6). Shape defined in the
                                               Prompt Library, not here.

  **status**                 analysis_status   Enum: \'pending_review\' \|
                             NOT NULL          \'approved\'. Default
                                               \'pending_review\'. See §3.3.

  **reviewed_at**            timestamptz       Set when Aaron marks approved in
                             NULLABLE          HubSpot (Gate #1).

  **reviewed_by**            text              Identifier of the reviewer (email
                                               or display name). Not a users FK
                                               yet --- auth integration is
                                               deferred.

  **notes**                  text              Reviewer notes capturing rationale
                                               for inline edits made
                                               pre-approval.

  **generated_at**           timestamptz NOT   When Claude produced the JSON.
                             NULL              Default now().

  **created_at**             timestamptz NOT   Default now().
                             NULL              

  **updated_at**             timestamptz NOT   Default now().
                             NULL              
  -------------------------------------------------------------------------------

### 3.2.8 deliverables

Depends on: prospects, revision_loops. Load-bearing addition of v2 ---
replaces the v1 proposals table and holds all 7 generated document types
under one schema.

  --------------------------------------------------------------------------------
  **Column**             **Type**             **Notes**
  ---------------------- -------------------- ------------------------------------
  **id**                 uuid PK              gen_random_uuid() default.

  **prospect_id**        uuid FK NOT NULL     REFERENCES prospects(id) ON DELETE
                                              CASCADE.

  **type**               deliverable_type NOT Enum with exactly 7 values:
                         NULL                 architecture, spec, roadmap, sop,
                                              proposal, pricing, tc. See §3.3.

  **content**            jsonb                Structured document body. Schema per
                                              type documented in the Prompt
                                              Library.

  **version**            int NOT NULL         Starts at 1. Application layer
                                              increments on each revision loop
                                              iteration.

  **status**             deliverable_status   Enum: pending_review, approved,
                         NOT NULL             held, sent, revising. Default
                                              \'pending_review\'. See §3.3.

  **generated_at**       timestamptz NOT NULL When Claude produced this version.
                                              Default now().

  **reviewed_at**        timestamptz NULLABLE When Aaron marked Gate #2
                                              approve/edit/hold.

  **sent_at**            timestamptz NULLABLE When Aaron clicked Send. NULL until
                                              sent.

  **edit_history**       jsonb NOT NULL       Array of {timestamp, field, before,
                                              after}. Default \'\[\]\'. Audit
                                              trail for inline edits made during
                                              review.

  **revision_loop_id**   uuid FK NULLABLE     REFERENCES revision_loops(id) ON
                                              DELETE SET NULL. Populated only when
                                              this version was produced by a
                                              negotiation loop. This is the single
                                              source of truth for the
                                              deliverable→loop relationship ---
                                              see §3.5 for why the inverse mapping
                                              is NOT stored on revision_loops.

  **created_at**         timestamptz NOT NULL Default now().

  **updated_at**         timestamptz NOT NULL Default now().
  --------------------------------------------------------------------------------

### 3.2.9 revision_loops

Depends on: prospects, meetings. Negotiation cycles that produce new
deliverable versions.

+---------------+-----------------+-----------------------------------+
| **Column**    | **Type**        | **Notes**                         |
+===============+=================+===================================+
| **id**        | uuid PK         | gen_random_uuid() default.        |
+---------------+-----------------+-----------------------------------+
| **            | uuid FK NOT     | REFERENCES prospects(id) ON       |
| prospect_id** | NULL            | DELETE CASCADE.                   |
+---------------+-----------------+-----------------------------------+
| *             | uuid FK         | REFERENCES meetings(id) ON DELETE |
| *meeting_id** | NULLABLE        | SET NULL. A loop may open without |
|               |                 | a formal meeting record (e.g.     |
|               |                 | async email negotiation).         |
+---------------+-----------------+-----------------------------------+
| **notes**     | text            | Free-text summary of negotiation  |
|               |                 | context or client objections.     |
+---------------+-----------------+-----------------------------------+
| **resolu      | re              | Enum: \'open\' \| \'resolved\'.   |
| tion_status** | solution_status | Default \'open\'. See §3.3.       |
|               | NOT NULL        |                                   |
+---------------+-----------------+-----------------------------------+
| **            | timestamptz     | Set when resolution_status        |
| resolved_at** | NULLABLE        | transitions to \'resolved\'.      |
+---------------+-----------------+-----------------------------------+
| *             | timestamptz NOT | Default now().                    |
| *created_at** | NULL            |                                   |
+---------------+-----------------+-----------------------------------+
| *             | timestamptz NOT | Default now().                    |
| *updated_at** | NULL            |                                   |
+---------------+-----------------+-----------------------------------+
| **▲ No        |                 |                                   |
| affected_de   |                 |                                   |
| liverable_ids |                 |                                   |
| column.**     |                 |                                   |
|               |                 |                                   |
| The           |                 |                                   |
| relationship  |                 |                                   |
| \'which       |                 |                                   |
| deliverables  |                 |                                   |
| belong to     |                 |                                   |
| this loop\'   |                 |                                   |
| is queried    |                 |                                   |
| via           |                 |                                   |
| del           |                 |                                   |
| iverables.rev |                 |                                   |
| ision_loop_id |                 |                                   |
| --- the FK on |                 |                                   |
| the           |                 |                                   |
| deliverables  |                 |                                   |
| side. Storing |                 |                                   |
| a jsonb array |                 |                                   |
| here would    |                 |                                   |
| create a      |                 |                                   |
| dual-so       |                 |                                   |
| urce-of-truth |                 |                                   |
| requiring     |                 |                                   |
| appl          |                 |                                   |
| ication-layer |                 |                                   |
| sync, which   |                 |                                   |
| Rule 1 (SSOT) |                 |                                   |
| forbids.      |                 |                                   |
+---------------+-----------------+-----------------------------------+

### 3.2.10 activity_logs

Depends on: prospects. Append-only event log. No updated_at.

  -------------------------------------------------------------------------
  **Column**        **Type**           **Notes**
  ----------------- ------------------ ------------------------------------
  **id**            uuid PK            gen_random_uuid() default.

  **prospect_id**   uuid FK NOT NULL   REFERENCES prospects(id) ON DELETE
                                       CASCADE.

  **event_type**    text NOT NULL      Free text, not enum. Application
                                       layer owns the known-values list.
                                       Example values:
                                       \'prospect.qualified\',
                                       \'deliverable.sent\',
                                       \'meeting.completed\'. Text keeps
                                       the schema stable as event types are
                                       added.

  **occurred_at**   timestamptz NOT    When the event happened. Distinct
                    NULL               from created_at so events can be
                                       back-dated (manual entries preserve
                                       true timestamp). Default now().

  **metadata**      jsonb              Event-specific payload. Shape varies
                                       by event_type. Example for a status
                                       transition: {from_status: \'new\',
                                       to_status: \'qualified\',
                                       rule_count: 7}.

  **created_at**    timestamptz NOT    Default now().
                    NULL               
  -------------------------------------------------------------------------

## 

## 

## 

## 

## 3.3 Enum Types

All enums used above are defined at the type level in Postgres via
CREATE TYPE \... AS ENUM. Adding a value later requires ALTER TYPE \...
ADD VALUE (non-transactional, plan accordingly).

+-----------------+----------------------+----------------------------+
| **Enum**        | **Values**           | **Used By**                |
+=================+======================+============================+
| **pr            | new, nurture,        | prospects.status           |
| ospect_status** | qualified,           |                            |
|                 | discovery, analysis, |                            |
|                 | proposal,            |                            |
|                 | negotiating, won,    |                            |
|                 | lost                 |                            |
+-----------------+----------------------+----------------------------+
| *               | discovery, proposal  | meetings.type              |
| *meeting_type** |                      |                            |
+-----------------+----------------------+----------------------------+
| **me            | won, lost,           | meetings.outcome           |
| eting_outcome** | negotiating          |                            |
+-----------------+----------------------+----------------------------+
| **transcr       | pending, complete    | discovery_ses              |
| iption_status** |                      | sions.transcription_status |
+-----------------+----------------------+----------------------------+
| **an            | pending_review,      | post_call_analyses.status  |
| alysis_status** | approved             |                            |
+-----------------+----------------------+----------------------------+
| **del           | architecture, spec,  | deliverables.type          |
| iverable_type** | roadmap, sop,        |                            |
|                 | proposal, pricing,   |                            |
|                 | tc                   |                            |
+-----------------+----------------------+----------------------------+
| **deliv         | pending_review,      | deliverables.status        |
| erable_status** | approved, held,      |                            |
|                 | sent, revising       |                            |
+-----------------+----------------------+----------------------------+
| **reso          | open, resolved       | revisi                     |
| lution_status** |                      | on_loops.resolution_status |
+-----------------+----------------------+----------------------------+
| **⚠             |                      |                            |
| prospect_status |                      |                            |
| uses            |                      |                            |
| \'nurture\' --- |                      |                            |
| NOT             |                      |                            |
| \'di            |                      |                            |
| squalified\'.** |                      |                            |
|                 |                      |                            |
| The v2.1        |                      |                            |
| workflow        |                      |                            |
| narrative (§7   |                      |                            |
| and roadmap     |                      |                            |
| Phase 2)        |                      |                            |
| explicitly      |                      |                            |
| moves           |                      |                            |
| not-qualified   |                      |                            |
| leads to        |                      |                            |
| nurture. The    |                      |                            |
| Spec is the     |                      |                            |
| source of truth |                      |                            |
| for that term.  |                      |                            |
| Any migration   |                      |                            |
| or workflow     |                      |                            |
| using           |                      |                            |
| \               |                      |                            |
| 'disqualified\' |                      |                            |
| is a bug        |                      |                            |
| against v2.2.   |                      |                            |
+-----------------+----------------------+----------------------------+

## 3.4 Row Level Security

RLS is mandatory on every table in §3.2. Table creation and RLS
enablement are separated into distinct migration steps so that the
schema can be reviewed and applied independently from the policy layer.

+-----------------------------------------------------------------------+
| **⚠ RLS is mandatory before the frontend deploys.**                   |
|                                                                       |
| Row Level Security must be enabled on every table above with a        |
| deny-by-default policy before the publishable API key ships in any    |
| client build. Server-side writes (n8n, Edge Functions) use the        |
| sb_secret key (formerly SERVICE_ROLE_KEY), which bypasses RLS and     |
| must never reach the frontend or version control.                     |
|                                                                       |
| Deploy sequence: (1) apply this schema migration; (2) apply RLS       |
| enablement + deny-by-default policies as a second migration; (3)      |
| apply per-table access policies as the workflows requiring them come  |
| online; (4) only then wire the publishable key into Cloudflare Pages  |
| env vars for a rebuild.                                               |
+-----------------------------------------------------------------------+

## 3.4a Privilege Verification Checklist (added after live production audit, 2026-07-04)

RLS being enabled on a table is necessary but not sufficient for minimal
privilege. This section exists because a live audit found anon and
authenticated holding TRUNCATE, REFERENCES, and TRIGGER on nearly every
table in public --- privileges nobody intentionally granted,
undiscovered until a cross-table check was run instead of stopping at
the one table already under investigation. pg_default_acl was checked
and confirmed empty for both roles on public, meaning this was a
one-time historical over-grant (most likely from a table drop/recreate),
not a standing rule reapplying itself --- but the excess sat unnoticed
regardless.

+-----------------------------------------------------------------------+
| **⚠ Why RLS enabled didn\'t catch this**                              |
|                                                                       |
| RLS policies filter which rows a role may act on. They say nothing    |
| about which operations are available in the first place. TRUNCATE in  |
| particular is not row-scoped and is not subject to RLS at all, per    |
| Postgres\'s own documented behavior --- a table can have a correct,   |
| airtight RLS policy and still be fully truncatable by a role that was |
| never supposed to have that privilege. \"RLS is on\" and \"privileges |
| are minimal\" are two separate claims; verifying one does not verify  |
| the other.                                                            |
+-----------------------------------------------------------------------+

Checklist --- run this any time a table in public is created or
recreated, not just at initial schema setup:

1.  Query grants directly: SELECT table_name, grantee, privilege_type
    FROM information_schema.role_table_grants WHERE grantee IN
    (\'anon\',\'authenticated\') AND table_schema = \'public\' ORDER BY
    table_name, privilege_type;

2.  Expect ONLY the specific privilege(s) that role\'s actual function
    requires --- e.g., anon should show INSERT on intake_submissions and
    nothing else, on no other table. Anything beyond the explicitly
    intended grant is excess until proven otherwise.

3.  If excess is found, also check pg_default_acl for public before
    revoking (SELECT defaclrole::regrole, defaclobjtype, defaclacl FROM
    pg_default_acl WHERE defaclnamespace = \'public\'::regnamespace;)
    --- this determines whether it\'s a one-time cleanup or an active
    rule that will silently reapply itself to the next table created,
    which needs to be dropped, not just worked around.

4.  service_role is exempt from this check by design. It exists
    specifically to bypass RLS for legitimate backend writes (n8n,
    migrations) --- broad grants there are correct and expected, not a
    finding.

## 3.5 Notes on Modeling Decisions

### Single-direction FK for the loop ↔ deliverable relationship

A revision loop may affect multiple deliverables (proposal, pricing, T&C
often revise together). The intuitive first draft stores this as an
array on revision_loops AND a FK on deliverables --- one record on each
side. That pattern is forbidden here: two representations of the same
relationship in the same database means every write path has to keep
both in sync, and any missed update produces silent drift. The canonical
direction is deliverables.revision_loop_id. To query \'which
deliverables were affected by loop X\', use: SELECT \* FROM deliverables
WHERE revision_loop_id = X.

### Why jsonb over normalized child tables in three places

intake_submissions.payload, qualification_results.rule_results, and
activity_logs.metadata all use jsonb rather than child tables. The
rationale is identical in each case: the shape is expected to evolve
(intake fields shift per campaign, rule metadata grows as new rules are
added, event types multiply) and the read pattern is \'fetch the whole
record and process in application code\' rather than \'filter by a
specific inner field at SQL level\'. jsonb keeps the schema stable
across those changes without paying the join cost on every read. If a
filter-by-inner-field query pattern emerges later, migrate that specific
inner field to a proper column then.

### Why deliverables.content is nullable but deliverables.type is not

A deliverable row may be created in a \'pending\' or \'held\' state
before Claude has produced content --- the row exists to represent the
intent, and content arrives on the second write. type is committed at
creation because the generation sequence (§7, prompts B1--B7) is
deterministic and known before generation runs.

### Timestamps are triple-tracked in some tables --- deliberately

post_call_analyses has generated_at, reviewed_at, and created_at.
deliverables has generated_at, reviewed_at, sent_at, and created_at.
These are not redundant --- each answers a different question.
generated_at answers \'when did AI produce this content\'; created_at
answers \'when did the DB row appear\' (async/queue latency can separate
these by seconds or more); reviewed_at answers \'when did the human
approve\'; sent_at answers \'when did it leave the system to the
prospect\'. Losing any one of these makes an audit or performance
question harder to answer.

## 

## 3.6 Migration Ordering

Tables must be created in the order below so that every foreign key
resolves to an existing target. This is the exact order the Phase 1 →
Track B → Item 4 migration file must follow.

  ------------------------------------------------------------------------------
  **\#**   **Table**               **Reason**
  -------- ----------------------- ---------------------------------------------
  **1**    companies               No FK dependencies.

  **2**    prospects               FK → companies.

  **3**    meetings                FK → prospects.

  **4**    revision_loops          FK → prospects, meetings. Must exist before
                                   deliverables.

  **5**    intake_submissions      FK → prospects.

  **6**    qualification_results   FK → intake_submissions.

  **7**    discovery_sessions      FK → prospects, meetings.

  **8**    post_call_analyses      FK → discovery_sessions.

  **9**    deliverables            FK → prospects, revision_loops (both must
                                   exist first).

  **10**   activity_logs           FK → prospects.
  ------------------------------------------------------------------------------

# Closing

This addendum locks the 10-table schema at the column level. It
supersedes §3.1 and §3.2 of v2.1 in full. Downstream artifacts --- the
migration SQL, the n8n workflow node configs that read from and write to
these tables, the HubSpot custom object mappings --- must conform to
this document, not the other way around.

+-----------------------------------------------------------------------+
| **✓ v2.2 status: Locked.**                                            |
|                                                                       |
| Any deviation from the columns, types, constraints, or enum values    |
| defined above requires a version bump on this Spec before the         |
| deviation is implemented.                                             |
+-----------------------------------------------------------------------+

# 4. Qualification Engine

## 4.1 Rules (deterministic, no AI)

7 rules, each pass/fail. Threshold: 6 of 7 = qualified. Threshold lives
in config, not code.

  --------------------------------------------------------------------------
  **\#**   **Rule**                 **Check**
  -------- ------------------------ ----------------------------------------
  1        All required intake      Every field in §4.2 non-empty
           fields present           

  2        Email valid + not        Regex + blocklist (mailinator, tempmail,
           disposable               guerrillamail, etc.)

  3        No duplicate prospect    SELECT COUNT(\*) FROM prospects WHERE
                                    email = ? returns 0

  4        Problem maps to a        Free-text problem field runs through
           service                  keyword classifier against declared
                                    service categories

  5        Budget is not            Budget range field ≠ \"just exploring /
           \"exploring\"            no budget\"

  6        Timeline is not          Timeline field ≠ \"no urgency /
           \"someday\"              whenever\"

  7        Tech stack disclosed     Tech stack field non-empty and ≠
                                    \"skip\"
  --------------------------------------------------------------------------

## 4.1a Workflow 2 --- Qualification Engine Architecture

Architecture decision record for Workflow 2, drafted by Claude
(Architect role, §10.1) for Claude Code CLI implementation per the §10.2
handoff protocol. Supersedes the §7 Workflow 1 row and the Roadmap Phase
2 \"Qualified path\" checklist item on prospect/company row creation ---
see callout below.

+-----------------------------------------------------------------------+
| **✓ Resolved deviation from §7 and the Roadmap: prospect/company      |
| creation moved to Workflow 2 (locked v2.4).**                         |
|                                                                       |
| §7 assigns companies/prospects row creation to Workflow 1; the        |
| Roadmap Phase 2 checklist assigns it to Workflow 3 (qualified path    |
| only). Both are superseded here. Every intake submission ---          |
| qualified or not --- now gets a prospects row, created inside         |
| Workflow 2 before the qualified/not-qualified branch.                 |
|                                                                       |
| Reason: activity_logs.prospect_id is FK NOT NULL (§3.2.10). Workflow  |
| 4 cannot log a decline or mark nurture status against a prospect that |
| was never created. Scoping row creation to the qualified path only    |
| breaks Workflow 4 the first time a real lead is declined. It also     |
| silently breaks Rule 3\'s dedup coverage --- a declined lead\'s email |
| would never enter prospects, so resubmission after decline would go   |
| undetected indefinitely.                                              |
|                                                                       |
| Resolved in v2.4: §7 Workflow 1 and Workflow 2 rows updated to match  |
| (2026-07-03). Roadmap Phase 2 \"Qualified path\" checklist updated to |
| match --- see Roadmap v2.4.                                           |
+-----------------------------------------------------------------------+

### Trigger

A dedicated Postgres trigger on intake_submissions (AFTER INSERT),
independent of Workflow 1\'s trigger --- not chained via an n8n Execute
Workflow node off Workflow 1. §7\'s own framing (\"8 workflows total,
each has one trigger and one purpose\") is the reason: chaining would
make Workflow 2\'s reliability depend on Workflow 1 never changing,
which defeats the isolation §7 asks for. Naming convention matches the
existing trigger: notify_n8n_qualification_engine, calling
net.http_post() to a dedicated Workflow 2 webhook.

### Execution phases

Rule evaluation and row creation are kept as two non-overlapping phases.
Nothing is written to Supabase until every rule has a result --- this is
what keeps Rule 3\'s dedup query correct without needing to exclude a
row it just created itself.

+------------+---------------------------------------------------------+
| **Phase**  | **What happens**                                        |
+============+=========================================================+
| 1\.        | Run all 7 §4.1 rules against intake_submissions.payload |
| Evaluate   | directly. No writes. See rule-by-rule notes below.      |
|            |                                                         |
| (          |                                                         |
| read-only) |                                                         |
+------------+---------------------------------------------------------+
| 2\. Write  | Match-or-create companies (by name); insert prospects   |
| identity   | (status stays at schema default \'new\' --- Workflow    |
|            | 3/4 own the transition, not Workflow 2); update         |
|            | intake_submissions.prospect_id.                         |
+------------+---------------------------------------------------------+
| 3\. Write  | qualification_results via INSERT ... ON CONFLICT        |
| result     | (intake_submission_id) DO UPDATE. Must be an upsert --- |
|            | §3.2.4 states re-evaluation replaces the row, and a     |
|            | plain insert would fail on any re-run.                  |
+------------+---------------------------------------------------------+
| 4\. Branch | A second Postgres trigger, on qualification_results     |
|            | (AFTER INSERT OR UPDATE), fires to Workflow 3\'s or     |
|            | Workflow 4\'s webhook based on qualified. Not an        |
|            | n8n-internal If-branch --- see reasoning below.         |
+------------+---------------------------------------------------------+

Phase 4 reasoning: if Workflow 2 crashed after writing
qualification_results but before an internal call to Workflow 3/4, an
internal-branch design would leave a qualified lead with a result row
and no booking email, with nothing to signal the failure. Making the
qualification_results write itself the trigger point means Workflow 3/4
don\'t depend on Workflow 2 staying alive one extra step.

### Rule implementation notes

  ----------------------------------------------------------------------------
  **\#**   **Rule**            **Implementation note**
  -------- ------------------- -----------------------------------------------
  1        Required fields     Non-empty check against the exact §4.2 field
           present             list.

  2        Email valid, not    Regex + a maintained disposable-domain package
           disposable          (pinned dependency), not a hand-maintained list
                               --- §4.1\'s \"mailinator, tempmail, etc.\" is
                               illustrative, not exhaustive, and will go
                               stale.

  3        No duplicate        SELECT count(\*) FROM prospects WHERE email =
           prospect            ?. Runs in Phase 1, before any write this run
                               --- no self-match possible.

  4        Problem maps to a   Category list confirmed by Aaron (Automation,
           service             Systems Integration, AI Systems, Business
                               Intelligence, Dashboards, Workflow
                               Optimization), matching the live Solutions()
                               component. Case-insensitive substring match
                               against the seed keyword list below ---
                               substring, not semantic matching, per §4.1\'s
                               \"deterministic, no AI\" constraint. v1 draft;
                               refine against real submissions, not before.

  5        Budget not          Match against the literal §4.2 enum value
           exploring           exploring --- not the §4.1 prose gloss (\"just
                               exploring / no budget\"), which isn\'t a real
                               enum value.

  6        Timeline not        Match against the literal §4.2 enum value no
           someday             urgency --- same correction as Rule 5; §4.1\'s
                               \"someday\" is descriptive, not the field
                               value.

  7        Tech stack          Non-empty and ≠ skip.
           disclosed           
  ----------------------------------------------------------------------------

+-----------------------------------------------------------------------+
| **⚠ Rule 3 permanently caps any returning submission at 6/7**         |
|                                                                       |
| Rule 3 (§4.1) fails for ANY email with an existing prospects row ---  |
| not just prior nurture leads, but past won clients resubmitting for   |
| new work. Confirmed via live trace 2026-07-08: a returning lead       |
| correctly reuses their existing prospect_id (Prospect Exists? → Use   |
| Existing Prospect, no re-insert, no TOCTOU misroute) and can still    |
| qualify at exactly 6/7.                                               |
|                                                                       |
| This is safe only because the threshold is 6, not 7. If               |
| QUALIFICATION_THRESHOLD is ever raised to 7, every returning lead and |
| every repeat client becomes structurally unqualifiable, permanently   |
| --- not an error, just a silent, correct-looking decline every time.  |
| Any future threshold change must account for this before being        |
| applied.                                                              |
+-----------------------------------------------------------------------+

### Rule 4 --- Keyword Seeds (v1 draft)

Case-insensitive substring match against the "Problem in operations"
field. Rule 4 passes if any keyword from any category is present ---
this is a pass/fail input into the 6-of-7 threshold, not a per-category
assignment; qualification_results does not currently store which
category matched. Overlap between categories (e.g. "streamline" under
both Automation and Workflow Optimization) is harmless for this reason.
Starting list --- refine against real submissions rather than trying to
make it exhaustive up front.

  -----------------------------------------------------------------------
  **Category**       **Keyword / phrase seeds**
  ------------------ ----------------------------------------------------
  **Automation**     automate, automation, manual, repetitive, by hand,
                     copy-paste, data entry, slow, time-consuming,
                     tedious, RPA, robotic process, eliminate manual work

  **Systems          integrate, integration, connect, sync, API, doesn\'t
  Integration**      talk to, disconnected systems, silo, silos, multiple
                     systems, migrate data, single source of truth,
                     consolidate

  **AI Systems**     AI, artificial intelligence, machine learning,
                     chatbot, agent, LLM, predictive, generative, smart
                     assistant, AI-powered, recommendation engine

  **Business         analytics, reporting, business intelligence,
  Intelligence**     insights, KPI, metrics, data analysis, forecasting,
                     trend, data-driven, benchmarking

  **Dashboards**     dashboard, real-time view, visualize, visualization,
                     single pane of glass, live data, monitor
                     performance, at-a-glance

  **Workflow         optimize, optimization, streamline, bottleneck,
  Optimization**     slow, inefficient, efficiency, process improvement,
                     restructure process, simplify process
  -----------------------------------------------------------------------

### Threshold configuration

n8n environment variable (QUALIFICATION_THRESHOLD=6), read at evaluation
time --- not a new Supabase config table. A new table would itself be a
schema deviation requiring a version bump; an env var satisfies §4.1\'s
\"threshold lives in config, not code\" without touching the locked §3.2
schema.

### Idempotency & error handling

-   qualification_results write is an upsert (above) --- safe to re-run
    for the same submission.

```{=html}
<!-- -->
```
-   Two submissions with the same email arriving concurrently could both
    pass Rule 3 before either\'s prospects row exists (TOCTOU). Accepted
    risk at current solo-builder volume: prospects.email UNIQUE rejects
    the second insert; n8n\'s error branch catches the constraint
    violation and routes it to Workflow 4 as an effective duplicate
    rather than failing silently. Revisit if submission volume
    increases.

```{=html}
<!-- -->
```
-   Node failures in Phase 1--3 route to n8n\'s error workflow + Slack
    alert to Aaron (SLACK_WEBHOOK_URL already provisioned) rather than
    failing silently --- a real lead should never vanish with no trace.

## 4.2 Intake Form Fields

All fields required unless marked optional. No AI processing at this
stage.

  -----------------------------------------------------------------------
  **Field**           **Purpose / notes**
  ------------------- ---------------------------------------------------
  Name                Prospect\'s full name

  Email               Load-bearing. Used for qualification (rules 2 + 3),
                      booking email, deliverable delivery.

  Company             Company name → creates or matches companies row

  Industry            Free-select from list

  Problem in          Long text. Feeds Rule 4 classifier + Prompt A
  operations          context.

  Tech stack          Long text. Current tools in use.

  Timeline            Enum: \<1mo / 1--3mo / 3--6mo / 6mo+ / no urgency

  Budget range        Enum: under-2500 / 2500-7500 / 7500-20000 /
                      20000-plus / exploring

  Goals & desired     Long text. Feeds Prompt A.
  outcomes            

  Consent checkbox    Two-party recording disclosure. Required for
                      discovery call recording.
  -----------------------------------------------------------------------

# 5. Discovery Call Subsystem

+-----------------------------------------------------------------------+
| **■ This section replaces v1 §5 (VAPI Voice Discovery Assistant) in   |
| full.**                                                               |
|                                                                       |
| The v1 flow used AI voice agent Nova to conduct a 20--25 min          |
| pre-booking discovery. This entire subsystem was removed in v2.       |
| Discovery is now a human call between Aaron and the prospect.         |
+-----------------------------------------------------------------------+

## 5.1 Call Mechanics

-   Platform: Zoom or Google Meet (Aaron\'s choice per call). Calendly
    booking includes the meeting link.

```{=html}
<!-- -->
```
-   Recording: Aaron enables recording at the start of the call.
    Two-party consent has already been captured via the intake form
    checkbox --- Aaron restates it verbally as courtesy.

```{=html}
<!-- -->
```
-   Duration target: 30--45 minutes.

```{=html}
<!-- -->
```
-   Aaron\'s prep: manual research (LinkedIn, company website, prior
    activity_logs). No AI-generated pre-brief in v2.

## 5.2 Post-Call Upload Flow

After the call, Aaron uploads the audio file to a designated Supabase
Storage bucket. Everything downstream is automatic.

  -------------------------------------------------------------------------
  **\#**   **Step**
  -------- ----------------------------------------------------------------
  1        Aaron drops audio file into Supabase Storage bucket:
           discovery-recordings/{prospect_id}/

  2        n8n watcher polls bucket every 60s (or Storage webhook if
           enabled)

  3        n8n creates discovery_sessions row: recording_url set,
           transcription_status = pending

  4        n8n sends audio to Whisper API

  5        On Whisper response: n8n writes transcript to
           discovery_sessions.transcript, sets transcription_status =
           complete

  6        n8n triggers Prompt A (post-call analysis) --- see §6.1

  7        On Claude response: n8n writes structured JSON to
           post_call_analyses, sets status = pending_review

  8        n8n creates HubSpot task for Aaron: \"Gate #1 review:
           {prospect_name}\"
  -------------------------------------------------------------------------

# 6. AI Prompt Contracts

+-----------------------------------------------------------------------+
| **■ Prompt text lives in a separate Prompt Library document.**        |
|                                                                       |
| This section defines contracts only --- what each prompt receives as  |
| input, what shape it must produce as output, and the execution order. |
| The actual system-prompt text (role framing, JSON schemas, few-shot   |
| examples, failure modes) lives in                                     |
| NogalSolutions_Prompt_Library_V1.docx, versioned independently of     |
| this Spec. Reason: prompt text iterates constantly based on real      |
| output quality; the Spec is a stable contract that should not         |
| version-bump every time a word changes in a prompt. Write the Prompt  |
| Library when Phase 3 begins.                                          |
+-----------------------------------------------------------------------+

## 6.1 Prompt A --- Post-Call Analysis

Input: Whisper transcript + intake form submission. Output: structured
JSON matching post_call_analyses schema.

Output JSON fields:

-   business_profile: {current_ops, workflows, tech_stack_detailed,
    team_structure}

```{=html}
<!-- -->
```
-   pain_points: array of {description, severity, evidence_quote}

```{=html}
<!-- -->
```
-   goals: array of {description, timeline, success_metric}

```{=html}
<!-- -->
```
-   automation_opportunities: array of {description, estimated_effort,
    expected_value}

```{=html}
<!-- -->
```
-   open_questions: array of clarifying questions the transcript did not
    resolve

```{=html}
<!-- -->
```
-   red_flags: array of concerns (misaligned expectations, budget
    mismatch, scope creep signals)

```{=html}
<!-- -->
```
-   summary_for_aaron: 3--5 sentence executive summary

## 6.2 Prompts B1--B7 --- Sequenced Deliverable Generation

7 prompts executed in strict order. Each receives all prior prompt
outputs as context, ensuring downstream deliverables reference upstream
ones.

  --------------------------------------------------------------------------
  **\#**   **Prompt**         **Input / Output**
  -------- ------------------ ----------------------------------------------
  B1       Architecture       Input: Prompt A output. Output: proposed
                              systems architecture solution design (jsonb).

  B2       Spec               Input: Prompt A + B1. Output: technical
                              specification referencing B1 architecture.

  B3       Roadmap            Input: Prompt A + B1 + B2. Output: phased
                              implementation checklist matching B2 spec.

  B4       SOP                Input: Prompt A + B1 + B2 + B3. Output:
                              client-facing standard operating procedure.

  B5       Proposal           Input: all of A + B1--B4. Output: commercial
                              proposal body. References scope from B2,
                              timeline from B3.

  B6       Pricing            Input: all of A + B1--B5. Output: pricing
                              draft with rationale. Aaron sets the final
                              number.

  B7       T&C                Input: all of A + B1--B6. Output: terms and
                              conditions referencing B4 SOP and B6 pricing.
  --------------------------------------------------------------------------

+-----------------------------------------------------------------------+
| **■ Why sequenced, not parallel.**                                    |
|                                                                       |
| Parallel is faster (\~30s vs 3min) but produces docs that do not know |
| about each other. Sequenced ensures the Proposal cannot promise       |
| deliverables the Spec does not cover, and the Roadmap phases match    |
| the Spec. The latency does not matter because no human is watching    |
| this run.                                                             |
+-----------------------------------------------------------------------+

# 7. n8n Workflows

8 workflows total. Each has one trigger and one purpose. Reviewing them
in isolation must be possible.

  ---------------------------------------------------------------------------
  **\#**   **Workflow**        **Trigger → Purpose**
  -------- ------------------- ----------------------------------------------
  1        Intake ingestion    Webhook from Supabase intake_submissions
                               insert → send auto-acknowledgment email. (Does
                               not create companies/prospects rows --- see
                               §4.1a.)

  2        Qualification       Independent trigger on intake_submissions
                               insert (parallel to Workflow 1, not chained
                               off it) → apply 7 rules, create
                               companies/prospects rows, write
                               qualification_results, branch to Workflow 3 or
                               4. Full architecture: §4.1a.

  3        Qualified handoff   Send booking email with Calendly link. Push
                               prospect to HubSpot (one-way mirror). Slack
                               alert to Aaron.

  4        Not-qualified       Send polite decline + free resource. Mark
           decline             prospect as nurture in Supabase + HubSpot.

  5        Recording watcher   Poll Supabase Storage / Storage webhook → send
                               new audio to Whisper → write transcript.

  6        Post-call analysis  Trigger on transcript complete → run Prompt A
                               → write post_call_analyses (pending_review) →
                               HubSpot task for Aaron.

  7        Sequenced           Trigger on Gate #1 approval webhook from
           generation          HubSpot → run Prompts B1--B7 in sequence →
                               write deliverables rows.

  8        Revision loop       Trigger on negotiation notes from Aaron →
                               re-run affected B-prompts only → new
                               deliverable versions.
  ---------------------------------------------------------------------------

## 7a Workflows 3 & 4 --- Shared Sub-workflow Architecture

Architecture decision record, drafted by Claude (Architect role, §10.1)
for Claude Code CLI implementation per the §10.2 handoff protocol.
Resolves how Workflows 3 and 4 avoid duplicating status-update and
logging logic without merging into a single workflow.

+-----------------------------------------------------------------------+
| **Design decision, not a bug fix --- merging 3 and 4 into one         |
| workflow was considered and rejected**                                |
|                                                                       |
| §7 states plainly: "8 workflows total. Each has one trigger and one   |
| purpose. Reviewing them in isolation must be possible." Merging       |
| Workflows 3 and 4 into a single workflow would violate this directly  |
| --- one save touching both the qualified-handoff path (Calendly,      |
| HubSpot) and the decline path (Resend, nurture status) at once, the   |
| same shared-surface risk already seen elsewhere in this project       |
| (systemic privilege grants, a stale browser tab racing a programmatic |
| patch).                                                               |
|                                                                       |
| The genuine duplication between the two paths --- both need to        |
| resolve the prospect record and update its status --- is real, but    |
| it\'s resolved by extracting that shared step into a reusable         |
| sub-workflow, not by merging the entry points. Each of Workflow 3 and |
| 4 keeps its own trigger, its own external-API surface, and its own    |
| isolated review surface, exactly as §7 requires.                      |
+-----------------------------------------------------------------------+

### Shared sub-workflow: Resolve Prospect + Update Status

Called via n8n\'s Execute Workflow node from both Workflow 3 and
Workflow 4 --- not a webhook-triggered workflow itself, so it does not
appear as a 9th row in §7\'s inventory; it has no independent trigger of
its own.

  -----------------------------------------------------------------------
  **Step**        **Detail**
  --------------- -------------------------------------------------------
  Input           intake_submission_id (uuid), qualified (boolean)
  parameters      

  1\. Resolve     intake_submissions.prospect_id → fetch the full
  prospect        prospects row (email, full_name, company_id). This
                  lookup exists because qualification_results only
                  carries intake_submission_id, not prospect_id directly
                  --- both calling workflows need the resolved prospect
                  record before they can do anything useful with it.

  2\. Update      UPDATE prospects SET status = \'qualified\' WHERE
  status          qualified = true, else status = \'nurture\' (§3.3 ---
                  literal enum value is nurture, never disqualified).

  3\. Log         INSERT INTO activity_logs: prospect_id (resolved
  activity        above), event_type = \'prospect.qualified\' or
                  \'prospect.nurture\', occurred_at = now(), metadata =
                  {from_status: \'new\', to_status:
                  \'\<qualified\|nurture\>\', rule_count: 7} --- matches
                  the metadata shape already illustrated in §3.2.10.

  Output          Returns the resolved prospect record (id, email,
                  full_name, company_id) so neither calling workflow
                  needs a second lookup just to send an email or push to
                  HubSpot.
  -----------------------------------------------------------------------

### Workflow 3 --- Qualified handoff (unique responsibilities only)

-   Trigger: webhook from notify_n8n_qual_branch, qualified = true path
    (§4.1a Phase 4).

```{=html}
<!-- -->
```
-   Call the shared sub-workflow with qualified = true.

```{=html}
<!-- -->
```
-   Send booking email with Calendly link, using the resolved
    prospect\'s email/name from the sub-workflow\'s return value.

```{=html}
<!-- -->
```
-   Push prospect to HubSpot (one-way mirror, per §8.1).

```{=html}
<!-- -->
```
-   Slack alert to Aaron.

### Workflow 4 --- Not-qualified decline (unique responsibilities only)

-   Trigger: same webhook, qualified = false path.

```{=html}
<!-- -->
```
-   Call the shared sub-workflow with qualified = false.

```{=html}
<!-- -->
```
-   Send polite decline email + free resource link.

```{=html}
<!-- -->
```
-   HubSpot Contact upsert (by email), no Deal and no pipeline stage ---
    resolves the original §1.3/§7 disagreement (§1.3 said Supabase-only,
    §7 row 4 said Supabase + HubSpot; §7a previously sided with §1.3
    without flagging the conflict). Contact-only, decided 2026-07-08:
    gives future re-engagement visibility without cluttering the sales
    pipeline with non-deals. This is why the upsert-by-email design in
    Workflow 3\'s Contact push matters: when a nurture lead later
    resubmits and qualifies, Workflow 3 finds and reuses this same
    Contact rather than creating a disconnected second one --- confirmed
    structurally sound by the Phase 2 reactivation trace (2026-07-08).

# 8. HubSpot Integration

+-----------------------------------------------------------------------+
| **⚠ HubSpot is a view, not a store.**                                 |
|                                                                       |
| HubSpot is a read/write surface for human review. All authoritative   |
| writes route through Supabase --- either directly (n8n → Supabase) or |
| via HubSpot webhook → n8n → Supabase. Direct HubSpot writes that do   |
| not sync back to Supabase within 60 seconds are a bug, not a feature. |
+-----------------------------------------------------------------------+

## 8.1 Data Flow

  -----------------------------------------------------------------------
  **Direction**            **What flows**
  ------------------------ ----------------------------------------------
  Supabase → HubSpot       New qualified prospect (contact + company);
  (push)                   post_call_analyses JSON as custom object;
                           deliverables as custom objects with content
                           field; stage transitions.

  HubSpot → Supabase       Gate #1 approval + JSON edits; Gate #2
  (webhook)                per-deliverable approval + content edits; Sent
                           status when Aaron clicks Send; negotiation
                           revision notes.
  -----------------------------------------------------------------------

## 8.2 Aaron\'s HubSpot Views

-   Pipeline overview --- prospects by stage (qualified / discovery
    scheduled / analysis pending / deliverables pending / sent / won /
    lost / negotiating).

```{=html}
<!-- -->
```
-   Gate #1 queue --- post_call_analyses with status = pending_review.

```{=html}
<!-- -->
```
-   Gate #2 queue --- deliverables with status = pending_review, grouped
    by prospect.

```{=html}
<!-- -->
```
-   Revision queue --- negotiating prospects with unresolved
    revision_loops.

# 9. Deployment Topology

  ---------------------------------------------------------------------------
  **Component**           **Where it runs**
  ----------------------- ---------------------------------------------------
  Frontend                Cloudflare Pages. DNS + CDN + SSL via Cloudflare.
  (nogalsolutions.tech)   

  Frontend env vars       Cloudflare Pages → Project Settings → Environment
                          Variables. NOT the VPS.

  Supabase                Managed (Supabase Cloud). Project:
                          nogalsolutions-prod.

  n8n                     Self-hosted on Hostinger VPS. Reverse-proxied via
                          Nginx with HTTPS.

  n8n env vars            VPS-side .env file. Never committed. Includes
                          SUPABASE_SERVICE_ROLE_KEY, ANTHROPIC_API_KEY,
                          OPENAI_API_KEY, HUBSPOT_API_KEY, SLACK_WEBHOOK_URL.

  HubSpot                 HubSpot Cloud (free tier).

  Calendly                Calendly Cloud (free tier).
  ---------------------------------------------------------------------------

# 10. Build Tooling & Review

## 10.1 AI Tool Roles

  ------------------------------------------------------------------------
  **Tool**           **Role**         **Responsibilities**
  ------------------ ---------------- ------------------------------------
  Claude Sonnet      Architect        System design, specs, database
  (this document)                     schema, prompt engineering.

  Claude Code CLI    Implementer (all Frontend (VS Code), backend
                     platforms)       workflows (n8n via MCP), SQL
                                      migrations (Supabase).

  Aaron              Reviewer (Option Reviews every Claude Code output
                     A)               node-by-node before deployment. Sole
                                      independent check.
  ------------------------------------------------------------------------

## 10.2 Handoff Protocol

1.  Aaron requests a workflow, component, or migration from Claude Code
    CLI with a scoped prompt referencing the relevant Spec sections.

```{=html}
<!-- -->
```
5.  Claude Code generates the code / workflow JSON / migration script.

6.  Aaron opens the output in n8n editor / VS Code / Supabase SQL editor
    and reviews every node or line.

7.  Aaron runs it against staging or dry-run mode where possible.

8.  Only after review passes does Aaron activate / deploy / apply the
    migration.

+-----------------------------------------------------------------------+
| **✓ Reviewer decision --- Option A (locked v2.0).**                   |
|                                                                       |
| Aaron is the sole human reviewer. No second AI review layer for the   |
| solo-builder phase. Revisit if drift becomes expensive with paying    |
| clients; upgrade to Option B (fresh-context Claude Code session) at   |
| that point. This closes the OPEN item from v1.2.                      |
+-----------------------------------------------------------------------+

# 11. Environment Variables Reference

+-----------------------------------------------------------------------+
| **⚠ Never commit these to version control.**                          |
|                                                                       |
| Store in .env (local dev) and Cloudflare Pages env vars (frontend     |
| production) and VPS .env (n8n production). Service-role key never     |
| leaves the backend.                                                   |
+-----------------------------------------------------------------------+

  -----------------------------------------------------------------------
  **Variable**                  **Where it lives + source**
  ----------------------------- -----------------------------------------
  VITE_SUPABASE_URL             Cloudflare Pages. From Supabase project
                                settings.

  VITE_SUPABASE_ANON_KEY        Cloudflare Pages. Public; RLS enforces
                                safety.

  SUPABASE_SERVICE_ROLE_KEY     VPS .env (n8n). NEVER Cloudflare Pages.
                                NEVER frontend. Bypasses RLS.

  ANTHROPIC_API_KEY             VPS .env (n8n). From
                                console.anthropic.com.

  OPENAI_API_KEY                VPS .env (n8n). For Whisper
                                transcription.

  CALENDLY_API_KEY              VPS .env (n8n). From Calendly settings.

  HUBSPOT_API_KEY               VPS .env (n8n). Private App token from
                                HubSpot.

  SLACK_WEBHOOK_URL             VPS .env (n8n). From Slack Apps →
                                Incoming Webhooks.

  SMTP_HOST / SMTP_USER /       VPS .env (n8n). Transactional email
  SMTP_PASS                     provider.
  -----------------------------------------------------------------------

***If it is not in this document, it does not get built.***

© 2026 Aaron Nogal. All rights reserved.

*This document is the canonical reference for the NogalSolutions
internal build. Not for external distribution.*
