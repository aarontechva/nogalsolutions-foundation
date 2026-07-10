**MASTER ROADMAP & IMPLEMENTATION CHECKLIST**

**NogalSolutions Build Roadmap**

*Phased build plan matched line-by-line to Spec v2.4.*

  ----------------------- -----------------------------------------------
  **Document Type**       Implementation checklist (canonical reference)

  **Built By**            Aaron Nogal

  **Platform**            Cloudflare Pages + Supabase + n8n (Hostinger
                          VPS) + HubSpot

  **Status**              v2.4 --- active build

  **Version**             2.4 --- Prospect/company row creation moved
                          from Workflow 3 to Workflow 2, matching Spec
                          §4.1a; Workflow 2 checklist expanded
                          accordingly.

  **Spec Version**        V2.4 (NogalSolutions_Spec_V2.4.docx)

  **Date**                2026-07-03
  ----------------------- -----------------------------------------------

*Every checkbox is a spec section made concrete.*

# How to Use This Roadmap

Each phase has three parts: a goal statement, a spec-section index, and
a checklist. Work top-down within a phase; do not skip ahead. Each
checklist item includes the Spec section it derives from.

+-----------------------------------------------------------------------+
| **⚠ Human-review-before-deploy is non-negotiable.**                   |
|                                                                       |
| Claude Code CLI generates code and workflows. Aaron reviews every     |
| file, node, and migration before activation. This is the sole review  |
| layer (Spec §10.2 Option A). Skipping review means shipping           |
| unreviewed work.                                                      |
+-----------------------------------------------------------------------+

# Phase 1 --- Infrastructure Foundation

Goal: All infrastructure provisioned and reachable. Frontend live,
Supabase reachable with schema in place and RLS enabled, n8n accessible
at its subdomain.

*Spec sections: 2 (Tech Stack), 3 (Database Schema), 9 (Deployment), 11
(Environment Variables).*

### Track A --- Frontend (COMPLETE)

-   Cloudflare Pages project created, GitHub repo connected

> *Already done --- nogalsolutions.tech is live with HTTPS.*

-   DNS via Cloudflare, SSL provisioned

+-----------------------------------------------------------------------+
| **■ Intake form is a Phase 2 deliverable, not Phase 1.**              |
|                                                                       |
| The marketing site + \"Start a Project\" button ship in Phase 1       |
| (already done). The actual intake form gets built in Phase 2 --- it   |
| depends on Supabase tables, RLS policies, and the anon key existing   |
| first (Tracks B below). Building the form now would point it at a     |
| target that does not exist yet.                                       |
+-----------------------------------------------------------------------+

### Track B --- Supabase

-   Create Supabase project → name: nogalsolutions-prod

> *Region closest to Hostinger VPS. Save DB password in password
> manager.*

-   Save project URL and anon key

-   Save SERVICE_ROLE_KEY --- VPS only, never frontend, never git

-   Apply Spec §3 schema --- create all 10 tables via SQL migrations

> *Use Claude Code to generate migrations from Spec §3.1 and §3.2. Aaron
> reviews SQL before applying.*

-   Verify all 10 tables created: companies, prospects,
    intake_submissions, qualification_results, discovery_sessions,
    post_call_analyses, deliverables, meetings, revision_loops,
    activity_logs

-   Enable RLS on all 10 tables with deny-by-default policy

> *Critical: anon key is public once frontend deploys. Without RLS the
> anon key can read/write every table.*

-   Create Storage bucket: discovery-recordings

> *Private bucket. Access via signed URLs from n8n only.*

-   Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to Cloudflare Pages
    environment

> *Cloudflare Pages → Settings → Environment Variables. Frontend deploys
> there, not the VPS.*

### Track C --- n8n on Hostinger VPS

-   Provision Hostinger VPS

-   Install Docker + Docker Compose

-   Deploy n8n via docker-compose with persistent volume

-   Configure Nginx reverse proxy + Certbot for HTTPS on n8n subdomain

-   Set n8n basic auth or SSO

-   Create /root/.env with SUPABASE_SERVICE_ROLE_KEY (chmod 600)

+-----------------------------------------------------------------------+
| **✓ Phase 1 done when**                                               |
|                                                                       |
| nogalsolutions.tech is live with HTTPS; Supabase has all 10 tables    |
| with RLS enabled; discovery-recordings bucket exists; n8n is          |
| accessible at its subdomain with basic auth.                          |
+-----------------------------------------------------------------------+

# Phase 2 --- Intake & Qualification

Goal: A prospect submits the intake form on nogalsolutions.tech and n8n
either sends them a booking link (qualified) or a polite decline (not
qualified). Fully deterministic, no AI.

*Spec sections: 3 (schema), 4 (qualification rules + intake fields), 7
(Workflows 1--4).*

### Prerequisite --- Tooling (do this before the first n8n workflow)

-   Generate n8n API key (n8n UI → Settings → API → Create API key).
    Store in VPS .env alongside other secrets.

-   Install the n8n MCP server (czlonkowski/n8n-mcp) so Claude Code can
    draft workflows against your instance

> *Verify current install instructions against the repo README at
> install time --- package versions and paths change. Treat the API key
> like SUPABASE_SERVICE_ROLE_KEY: VPS-only, never git, never chat.*

-   Configure Claude Code MCP config to point at the n8n MCP server

-   Hello-world test: ask Claude Code to list existing n8n workflows. If
    it returns them, integration works. Stop tuning here.

+-----------------------------------------------------------------------+
| **⚠ Human-review-before-deploy applies to MCP-generated workflows     |
| too.**                                                                |
|                                                                       |
| Spec §10.2 Option A: Aaron reviews every workflow before activation,  |
| whether it arrived as a VS Code file or as a workflow appearing in    |
| n8n via MCP. Do not activate Claude-Code-drafted workflows without    |
| walking through every node first.                                     |
+-----------------------------------------------------------------------+

### Frontend intake form

-   Build React intake form component with all Spec §4.2 fields (name,
    email, company, industry, problem, tech stack, timeline, budget,
    goals, consent checkbox)

> *Field list is canonical in Spec §4.2. Do not add or drop fields
> without a spec version bump.*

-   Verify built form matches Spec §4.2 exactly --- no missing fields,
    no extras

> *Verification step before wiring to Supabase. Absorbed from Phase 1
> Track A (moved here because the form does not exist until now).*

-   Client-side validation (email format, required fields, consent
    checkbox required)

-   Wire \"Start a Project\" button on marketing site to the intake form
    route

-   Form POST → Supabase intake_submissions table

> *Frontend uses anon key. RLS policy allows public INSERT on
> intake_submissions only --- no SELECT, no UPDATE, no DELETE from the
> frontend.*

-   Deploy form to Cloudflare Pages, test end-to-end from browser

### Auto-acknowledgment email

-   n8n Workflow 1: trigger on new intake_submissions insert

-   Send auto-ack email confirming receipt within 5 seconds

> *Copy: \"We received your inquiry and are reviewing. You will hear
> back within one business day.\" No fake pending states.*

### Qualification engine

-   n8n Workflow 2: apply 7 deterministic rules from Spec §4.1

-   Rule 1: all required fields present

-   Rule 2: email valid + not on disposable domain blocklist

-   Rule 3: no duplicate email in prospects table

-   Rule 4: problem maps to declared service (keyword classifier) ---
    category list + keyword seeds defined in Spec §4.1a

-   Rule 5: budget not \"exploring\"

-   Rule 6: timeline not \"someday\"

-   Rule 7: tech stack disclosed

-   Threshold check: 6 of 7 → qualified. Threshold in n8n config, not
    code.

-   Write qualification_results row with rule-by-rule breakdown

-   Create prospects + companies rows in Supabase, before the
    qualified/not-qualified branch (moved here from Workflow 3 --- see
    Spec §4.1a, v2.4)

### Qualified path (Workflow 3)

-   (Prospect/company row creation now happens in Workflow 2, before the
    branch --- see Spec §4.1a)

-   Send booking email with Calendly link

-   Push contact + company to HubSpot (one-way mirror)

-   Slack alert to Aaron with prospect summary

### Not-qualified path (Workflow 4)

-   Send polite decline email + free resource attachment/link

-   Mark prospect as nurture status in Supabase

-   Log event to activity_logs

+-----------------------------------------------------------------------+
| **✓ Phase 2 done when**                                               |
|                                                                       |
| Submitting the form as a qualified prospect produces a booking email  |
| within 30 seconds. Submitting as a not-qualified prospect produces a  |
| polite decline within 30 seconds. HubSpot shows the new qualified     |
| contact.                                                              |
+-----------------------------------------------------------------------+

# Phase 3 --- Discovery Call Subsystem

Goal: After Aaron completes a discovery call and drops the recording
into the Supabase bucket, n8n transcribes it, runs Prompt A, and creates
a Gate #1 review task in HubSpot.

*Spec sections: 5 (Discovery Call Subsystem), 6.1 (Prompt A), 7
(Workflows 5--6).*

+-----------------------------------------------------------------------+
| **■ This phase replaces v1.x Phase 3 (VAPI) in full.**                |
|                                                                       |
| The v1 checklist to provision VAPI, configure Nova, and build voice   |
| session capture is retired. Discovery is a human call in v2.          |
+-----------------------------------------------------------------------+

### Recording capture

-   Confirm discovery-recordings Supabase Storage bucket exists (Phase 1
    Track B)

-   Document Aaron\'s upload procedure: after each call, upload audio
    file to discovery-recordings/{prospect_id}/

> *Naming convention captured in SOP. n8n uses the prospect_id in the
> path to link the recording.*

### Transcription (Workflow 5)

-   n8n Workflow 5: trigger on new file in discovery-recordings bucket

-   Create discovery_sessions row with recording_url +
    transcription_status = pending

-   Download file from Supabase Storage via signed URL

-   POST audio to OpenAI Whisper API

-   On Whisper response: write transcript to
    discovery_sessions.transcript, set transcription_status = complete

-   Trigger Workflow 6 (post-call analysis)

### Post-call analysis (Workflow 6)

-   n8n Workflow 6: trigger on transcription complete

-   Send transcript + linked intake_submission to Claude API with Prompt
    A (Spec §6.1)

-   Parse structured JSON response

-   Validate JSON matches post_call_analyses schema (all required fields
    present)

> *Validation layer prevents malformed JSON from silently propagating
> into Gate #2.*

-   Write to post_call_analyses with status = pending_review

-   Push analysis to HubSpot as custom object linked to prospect

-   Create HubSpot task for Aaron: \"Gate #1 review: {prospect_name}\"

+-----------------------------------------------------------------------+
| **✓ Phase 3 done when**                                               |
|                                                                       |
| Uploading a test audio file to                                        |
| discovery-recordings/{test_prospect_id}/ produces a transcript, a     |
| validated Prompt A JSON in Supabase, and a HubSpot task for Aaron     |
| within 3 minutes.                                                     |
+-----------------------------------------------------------------------+

# Phase 4 --- Gate #1 & Sequenced Deliverable Generation

Goal: Aaron approves the Prompt A JSON in HubSpot, which triggers
sequenced generation of 7 deliverables. Each deliverable lands in
Supabase with status = pending_review.

*Spec sections: 6.2 (Prompts B1--B7), 7 (Workflow 7), 8 (HubSpot
integration).*

### HubSpot Gate #1 configuration

-   Configure HubSpot custom object type: PostCallAnalysis

-   Configure inline-edit UI for JSON fields

-   Add \"Approve\" button --- fires webhook to n8n on click

-   Test webhook receives edited JSON payload

### Sequenced generation (Workflow 7)

-   n8n Workflow 7: trigger on Gate #1 approval webhook

-   Read latest approved JSON from post_call_analyses

-   Run Prompt B1 (Architecture) --- write deliverables row, type =
    architecture

-   Run Prompt B2 (Spec) with A + B1 as context --- write deliverables
    row, type = spec

-   Run Prompt B3 (Roadmap) with A + B1 + B2 --- write row, type =
    roadmap

-   Run Prompt B4 (SOP) with A + B1--B3 --- write row, type = sop

-   Run Prompt B5 (Proposal) with A + B1--B4 --- write row, type =
    proposal

-   Run Prompt B6 (Pricing) with A + B1--B5 --- write row, type =
    pricing

-   Run Prompt B7 (T&C) with A + B1--B6 --- write row, type = tc

-   All 7 rows set to status = pending_review

-   Push all 7 deliverables to HubSpot as custom objects

-   Create HubSpot task: \"Gate #2 review: {prospect_name} --- 7
    deliverables ready\"

+-----------------------------------------------------------------------+
| **⚠ Order matters. Do not parallelize.**                              |
|                                                                       |
| Each B-prompt is designed assuming prior outputs exist. Parallel      |
| execution will produce docs that contradict each other. If a B-prompt |
| fails, retry it before proceeding --- do not skip.                    |
+-----------------------------------------------------------------------+

+-----------------------------------------------------------------------+
| **✓ Phase 4 done when**                                               |
|                                                                       |
| Approving a test Gate #1 JSON produces 7 pending_review deliverables  |
| in Supabase within 5 minutes, all visible in HubSpot.                 |
+-----------------------------------------------------------------------+

# Phase 5 --- Gate #2, Send, and Negotiation Loop

Goal: Aaron reviews each deliverable in HubSpot, edits inline, approves
per-doc, and clicks Send. Negotiation triggers targeted re-generation.

*Spec sections: 6.2 (Prompts B1--B7), 7 (Workflow 8), 8 (HubSpot
integration).*

### HubSpot Gate #2 configuration

-   Configure HubSpot custom object type: Deliverable (one type,
    distinguished by type enum)

-   Configure per-doc inline edit UI for content jsonb

-   Add per-doc \"Approve\", \"Hold\", \"Edit\" buttons

-   Add \"Send to Client\" button (only enabled when status = approved)

-   Each button fires webhook to n8n → Supabase writes back

-   Edit history captured to deliverables.edit_history jsonb
    (append-only)

### Send flow

-   n8n endpoint: when Aaron clicks Send on a deliverable, generate
    PDF/DOCX from content jsonb

-   Send email to prospect with attachment

-   Update deliverable status = sent, set sent_at

-   Log to activity_logs

### Second call + outcome capture

-   Aaron books second call via Calendly (proposal walkthrough)

-   After second call, Aaron records outcome in HubSpot: Won / Lost /
    Negotiating

-   HubSpot webhook syncs outcome to Supabase.meetings.outcome

### Negotiation revision loop (Workflow 8)

-   When outcome = Negotiating, Aaron enters revision notes + selects
    which deliverables need revision

-   n8n Workflow 8: create revision_loops row with notes +
    affected_deliverable_ids

-   Re-run only the affected B-prompts (in sequence, with prior context)

-   New deliverables row per affected type with version += 1 and
    revision_loop_id set

-   Back to Gate #2 for the revised deliverables

+-----------------------------------------------------------------------+
| **✓ Phase 5 done when**                                               |
|                                                                       |
| A full end-to-end run --- intake submission → discovery call →        |
| transcript → Gate #1 → 7 deliverables → Gate #2 → Send → negotiation  |
| revision → resend --- completes without manual intervention outside   |
| the two gates.                                                        |
+-----------------------------------------------------------------------+

**Phase 6 --- Hardening & Observability**

Goal: The system runs unattended in production. Failures are visible;
recovery is documented; no silent corruption possible.

### Monitoring

-   n8n workflow error notifications → Slack channel

-   Supabase database size + row count alerts

-   HubSpot ↔ Supabase sync lag monitoring (alert if \> 60s)

-   Whisper + Claude API cost dashboard (per-prospect + monthly)

### Backup + recovery

-   Supabase automated daily backups verified

-   n8n workflow JSON exported to git weekly

-   Recovery runbook: what to do when Supabase is down; when n8n is
    down; when HubSpot sync is stuck

### Data hygiene

-   Retention policy: audio recordings deleted after 90 days (Whisper
    transcript retained)

-   GDPR/data-request runbook: how to export or delete a prospect record
    end-to-end

+-----------------------------------------------------------------------+
| **✓ Phase 6 done when**                                               |
|                                                                       |
| Aaron can leave the system unattended for a week and know from Slack  |
| alerts alone whether it is healthy. A restore from backup has been    |
| dry-run at least once.                                                |
+-----------------------------------------------------------------------+

***Build slow. Review everything. Ship deliberately.***

© 2026 Aaron Nogal. All rights reserved.

*This document is the canonical build reference for the NogalSolutions
internal build. Not for external distribution.*
