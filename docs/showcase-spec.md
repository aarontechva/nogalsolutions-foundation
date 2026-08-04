# NogalSolutions Showcase Systems Spec

**Version 1.0, ACCEPTED by Aaron 2026-08-04**
**Canonical format: markdown-native, this file. There is no docx original.**
Last updated: 2026-08-04

---

## 0. Status and provenance

This document is canonical for the Showcase Systems project. Unlike the Consultant Engagement Pipeline (CEP) Spec, which is maintained as a Word document outside the repo and mirrored to `docs/spec.md`, this spec has no external original: the markdown file **is** the source of truth, versioned through git.

That choice is deliberate. The docx workflow exists for the CEP because Aaron reviews it with tracked changes, and it carries a real acceptance ceremony. It also introduced a recurring failure class of its own, where the in-repo mirror drifts from the docx. No external stakeholder needs a Word copy of this document, so keeping it markdown-native removes that failure class entirely.

What is retained from the CEP's discipline: version locking, architecture decisions recorded before implementation, hard gates on irreversible actions, and the baton-pass verification vocabulary.

---

## 1. Purpose and scope

### 1.1 What this governs

The **Showcase Systems**: standalone n8n workflows built to demonstrate capability to prospective clients, together with the public website pages that present them.

These are portfolio artifacts. They run against fictional businesses and synthetic data, they have no real customers, and no real money moves through them.

### 1.2 What this does not govern

The **Consultant Engagement Pipeline (CEP)**: Aaron's own live business operations, covering intake through kickoff. That system is governed by `docs/spec.md` (canonical: `NogalSolutions_Spec_V2_19.docx`) and is out of scope here.

The two projects share an n8n instance, a Slack workspace, and a git repository. They do not share data, risk profile, or governance.

### 1.3 Relationship to the CEP Spec

Neither spec overrides the other. Where a rule is genuinely universal (the hard gates on the production Supabase project and on HubSpot schema changes, the no-em-dash rule, the verification standard), it lives in `CLAUDE.md` and applies to both.

**Critical distinction, and the reason this document exists:** a session that reads only the CEP Spec will find no mention of any showcase system. Before this spec existed, that gap caused `docs/current-state.md` to assert things about the triage system that were false, because those facts had no governed home and lived only in log prose. A fresh agent must be able to learn what exists in Project B without inferring it from Project A.

### 1.4 Workflow inventory (verified live 2026-08-03)

The n8n instance holds 28 workflows. They partition as follows.

**Showcase Systems (this spec): 3 active.**

| Workflow | ID | Nodes | Status |
|---|---|---|---|
| NogalSolutions-Util Informed AI Email Enquiry Triage | `QBWxEVh6hY5QJ7bn` | 68 (63 executable + 5 sticky) | active |
| NogalSolutions-Util Job Post Analyzer | `JcVSUVtWlHQE2ua2` | 16 | active |
| NogalSolutions- AI Job Scraper + ATS-Resume Optimizer | `QyPEUQbTkLeto8wA` | 24 | active |

**CEP (`docs/spec.md`): 23 active.** BW1 through BW10, five shared sub-workflows, three infra workflows, plus Outbound Discovery Bootstrap, Kickoff Prep, Notify Expected Deposit, Record Deposit Payment, and Send Onboarding Kit.

**Archived, governed by neither: 2.** `QB9hloBVidllxLDk` ("AI Receptionist", 1 node) and `eSAaGom7fJW3JwMo` ("Sales Order Filter for Central Regions", 4 nodes). The former is an empty stub, not an implementation; the roadmap's eventual AI Voice Receptionist is unbuilt work, not a continuation of this shell.

---

## 2. Core principles

### 2.1 AI proposes, deterministic code disposes, humans approve anything consequential

The AI classifies, extracts, drafts, and recommends. Deterministic workflow steps perform the actual writes, calculations, permission checks, and notifications. Humans approve anything involving legal commitments, pricing exceptions, or customer-facing claims.

This principle has now been derived independently three times in this project: as Rule 2 of the CEP Spec ("AI prepares, humans decide"), as the thesis of the Vendor Invoice Processing design ("AI extracts and proposes, deterministic code validates and routes, humans approve anything that moves money"), and as the design principle of the vertical research that produced §7.4. Three arrivals at the same conclusion from three different starting points is treated here as structural, not stylistic.

### 2.2 Evidence-first

Nothing is claimed as working because it validates clean. A showcase system is "proven" only when a real trigger has produced a real result traced end to end. `n8n_validate_workflow` returning 0 errors is a precondition for testing, never a substitute for it.

### 2.3 Honest demonstration

A showcase is a demonstration, not a deception. Every published page must make clear that the business is fictional and the data synthetic. Capability may not be implied beyond what actually ran.

---

## 3. Platform constraints (binding)

These are not preferences. Each was established by a live failure, and each will recur if ignored.

### 3.1 Genuine tool-calling does not work on this n8n instance

**Status: confirmed, version-independent, no known fix.**

Every available route for giving an AI Agent live tool access has been tried and has failed:

| Node type | Failure | Evidence |
|---|---|---|
| `n8n-nodes-base.googleSheetsTool` | Hangs the task runner for ~300s, deterministic | n8n GitHub issue [#20752](https://github.com/n8n-io/n8n/issues/20752), closed "not planned" by maintainers. Confirmed in VPS docker logs: `Unrecognized node type` followed by task-runner timeout. |
| `@n8n/n8n-nodes-langchain.toolHttpRequest` | `has a 'supplyData' method but no 'execute' method` | Reproduced on n8n 2.26.7 and again, word for word, on 2.32.7 after a real upgrade. Not a version gap. |
| `@n8n/n8n-nodes-langchain.toolCode` | Same LangChain tool family, same assessed risk | Not separately tested; ruled out by family. |
| `n8n-nodes-base.httpRequestTool` | Reintroduces #20752 | Same `nodes-base.*Tool` family as the first row. |

The #20752 trigger is the workflow's **shape**, not one node's configuration: task runners, plus a Code node using `$('NodeName')` cross-references, plus an AI Agent anywhere in the same workflow with a Tool-variant sub-node. Removing the reference from a single node does not help.

**Required approach: context injection.** Fetch the data with plain `httpRequest` nodes before the model runs, render it into the prompt, and use an LLM Chain (`chainLlm` + `lmChatOpenRouter` + `outputParserStructured`). The model never decides to invoke anything.

**Naming honesty follows from this.** A system built this way is not agentic and must not be described as such, on the canvas or on the website. This is why the triage system's branch was renamed from "Agentic Triage" to "Informed Email Enquiry Triage."

**Known limit of this approach, unresolved:** injecting a whole dataset into the prompt only works at demo scale (roughly 6 to 10 rows). At 1,000+ rows it degrades on cost, latency, and accuracy. The real fix is retrieval (embed, then inject only relevant rows), which is already the RAG-for-FAQs showcase on the roadmap.

### 3.2 Long waits must be external state, never in-workflow waits

A system that waits hours or days for a human decision must not hold that state inside a running execution. State belongs in an external system of record, and each resumption is a fresh, separately triggered execution.

The CEP already proves this pattern: state lives in HubSpot Deal stages, and every stage advance is its own webhook-triggered run. Any showcase system with an approval step inherits this design, not a Wait node.

### 3.3 No dead-end configuration nodes

A node with no outgoing `main` connection, referenced only through `$('NodeName')` expressions, is **not guaranteed by n8n to execute**. This is non-deterministic: the triage system's `Client Config` node worked on one run and failed on the next, taking 13 reference sites down with it.

**Required pattern:** force execution ordering with a Merge node (`Choose Branch` / `waitForAll`) so the config node is a hard prerequisite of everything downstream. The triage system's `Sync Client Config Dependency` node is the reference implementation.

### 3.4 Build prompt strings as template literals

Single-quoted JavaScript string literals holding prompt text have broken on unescaped apostrophes at least four times in this project, in the same node each time. `n8n_validate_workflow` does not reliably catch it.

**Required:** use backtick template literals for all prompt text, which removes the need to escape apostrophes at all.

### 3.5 Brace spacing in n8n expressions

Adjacent closing braces inside a `{{ }}` expression (for example `'HIGH'}})`) create a literal `}}` that confuses n8n's expression-delimiter scanner and produces an opaque `invalid syntax` error. Insert a space: `'HIGH' } })`. Prefer moving non-trivial logic into a Code node entirely.

---

## 4. Standard architecture pattern

Showcase systems follow one shape. Deviations must be justified in the system's own entry in §7.

```
Trigger
  -> Normalize and validate the inbound payload
  -> Guard: is this the event we expect?
  -> Fetch full source data
  -> Guard: did the fetch succeed?
  -> Sync configuration dependency (Merge, per §3.3)
  -> Pre-fetch any reference data (plain httpRequest, per §3.1)
  -> Build prompt (template literal, per §3.4)
  -> LLM Chain with Structured Output Parser
  -> Parse and validate the model output deterministically
  -> Guard: is the output structurally valid?
  -> Route: autonomous action, or human handoff
  -> Log the outcome
  -> Notify
```

Every guard has a failure branch that produces a real alert. No branch may terminate silently.

### 4.1 Configuration-driven templates

Where a system is intended to be reusable across clients, all client-specific values (categories, thresholds, routing targets, business name) live in a single `Client Config` Code node that everything else reads from. Swapping clients should require editing one node, not the workflow.

This is subject to §3.3: a config node must be wired through a Merge, never left dangling.

### 4.2 Error handling requirements

- Every LLM Chain carries `onError: continueRegularOutput` so a failure routes to an alert path instead of vanishing.
- Every LLM Chain carries `retryOnFail: true`, `maxTries: 2`, `waitBetweenTries: 1000`. Model format-compliance slips are rare but real, and one automatic retry removes most of them.
- Every AI-generated customer-facing send is preceded by a **validity gate**: an IF node confirming the expected field is actually populated, routing failures to an alert rather than sending.

That last rule exists because the naive fix is worse than the bug it fixes. Adding `onError` to a drafting chain without a validity gate converts "hard crash, nothing sent" into "blank email sent to a real customer."

---

## 5. Autonomy gates

A showcase system may send a customer-facing message without human review only when **every** condition below holds. Conditions are evaluated deterministically in code, never by the model.

**Universal preconditions:**
1. The model did not flag the case as requiring expert intervention.
2. The classification passed structural validation.
3. The drafted reply passed its validity gate (§4.2).

**Category-specific preconditions, informational replies (parts pricing, scheduling availability):**
4. A lookup returned a concrete, specific fact.

Rationale: stating a price or an open appointment slot is reporting a fact. Quoting a new installation is a judgment that depends on factors no lookup captures, so it stays human-routed.

**Category-specific preconditions, complaint replies:**
4. Urgency is low.
5. A knowledge-base vector match scored at or above 0.75.
6. This is not a repeat complaint from the same customer.

**Hard limits on autonomous replies:** the drafting chain has no tool access, and the prompt forbids promising refunds, committing to dates, or confirming a booking or sale. An informational reply states a fact; it does not transact.

**Escalation is not failure.** When a gate blocks autonomy, the system sends a fixed (not AI-generated) holding message, logs the case, and alerts a human with a summary and a suggested response angle. The design goal is reducing manual labour while preserving a good handoff, not achieving full autonomy.

---

## 6. Demo data and fictional businesses

- Every showcase system runs against a named fictional business. Reusing one across systems is preferred, because it compounds into a single coherent story rather than a set of unrelated demos.
- Synthetic data lives outside production. The triage system uses a **separate Supabase project** on Aaron's own account, deliberately not `nogalsolutions-prod`.
- Because that project is not production, the `CLAUDE.md` Supabase hard gate does not apply to it. The hard gate is scoped to `nogalsolutions-prod`.
- Disposable setup workflows (seeding a sheet, creating a table) are deleted once used. One was left orphaned historically and had to be cleaned up later.

**Current fictional business: ClimateWorks HVAC.** Its assets are shared by every HVAC-vertical showcase:

| Asset | Detail |
|---|---|
| Supabase project | Separate from prod; n8n credential `Supabase Mock-HVAC` (`HBYfDg0J51o7Kzu4`) |
| `csa_hvac_faq` | Knowledge base, 6 seeded rows, pgvector |
| `csa_complaint_log` | Complaint audit log |
| Inventory sheet | Google Sheets `105pGcj3FRdjcZNWxQIe-k3_3YQjG9bK6KAm8d5Kcstw`, tab "Inventory", with a `Price` column and one deliberately zero-stock part |
| Appointment slots sheet | Synthetic availability (n8n has no node to query real Calendly availability, only a booking-event trigger). Columns confirmed live 2026-08-04 via a disposable diagnostic workflow: `Date`, `Time Slot`, `Status` (values seen: `Open`, `Booked`). 8 rows at time of check. |
| Slack | `#customer-support-tickets` (`C0BM5P4LU2U`), `#failure-alert` |
| Inbound email | `aaron@nogalsolutions.tech` via Resend inbound (MX verified), Full-access credential `NogalSolutions-Util AI CSA HVAC` (`gwZZxXSEI34BgHHz`) |

Note the credential distinction: Resend's Received Emails API requires a **Full access** key. The Sending-access-only key used by CEP workflow BW1 will fail against it.

---

## 7. Systems

### 7.1 Informed AI Email Enquiry Triage

**Status: live, proven.** `QBWxEVh6hY5QJ7bn`, 68 nodes (63 executable + 5 sticky), active.

**Demonstrates:** an inbound customer email is read, classified, enriched with real business data, and either answered autonomously or routed to a human with full context.

**Architecture, as verified live 2026-08-03:**

Phase 1, intake. `Inbound Ticket Webhook` fans out to both `Normalize Webhook` and `Client Config`. The event type is checked, the full email is fetched from Resend's API, content is extracted, and a fetch guard routes failures to a Slack alert.

Phase 2, triage. `Sync Client Config Dependency` (Merge) joins the config branch, then `Requires Lookup?` selects one of two engines that converge on the same parser:

- **Informed Email Enquiry Triage** (`requiresLookup: true`, the live configuration): `Fetch Inventory Sheet` and `Fetch Appointment Slots Sheet` (plain `httpRequest`) run first, their contents are rendered as plain-text tables into the prompt, and an LLM Chain classifies against real data.
- **Simple Triage** (`requiresLookup: false`): prompt built without reference data, otherwise identical.

Phase 3, routing. Output is validated deterministically, then routed: complaints to the complaint gate (repeat check, then pgvector FAQ match, then eligibility evaluation), parts and scheduling enquiries to the informational-autonomy gate, everything else to a human ticket in Slack.

**Model:** DeepSeek V4 Flash via OpenRouter, hardcoded per the Kickoff Prep precedent. Embeddings via OpenAI.

**What is proven live:** classification on clean and deliberately messy input (executions 603 to 608, including non-native phrasing that still matched an exact SKU and correctly reported it out of stock), parts and scheduling autonomy with real lookups (599, 602), complaint escalation (609), complaint autonomous reply (610), the retry and validity-gate safety net, and the failure-alert path (594).

**What is built but has never fired live:** the Simple Triage engine (the template's other half), and Option B's `needsHumanFollowUp` framing, which distinguishes an autonomous reply that resolved the issue from one that acknowledged it and still needs a human.

**Known behaviour, accepted, not a bug:** `Check FAQ Match` embeds the triage step's AI-generated summary rather than the raw email, and that summary's wording varies slightly between runs on identical input. That variance can move the similarity score across the 0.75 boundary (0.783 on one run, 0.707 on another, same customer wording). Aaron's explicit call is to leave the threshold alone: a human handles the complaint on either path, and both paths carry a summary and suggested angle.

**Public page:** `/ai-email-enquiry-triage`. Published, live.

### 7.2 Job Post Analyzer

**Status: live.** `JcVSUVtWlHQE2ua2`, 16 nodes, active.

Aaron pastes a raw job post into Slack `#discovery-prep`; an LLM Chain (OpenRouter, DeepSeek V4 Flash) with a Structured Output Parser returns a fixed five-field analysis, formatted and replied in-thread.

Note: the CEP separately calls the same analysis pattern from BW3 for qualified inbound leads (CEP Spec §7h). The logic was deliberately not extracted into a shared sub-workflow, on the same "prove each route standalone first" precedent used elsewhere.

**Public page:** none.

### 7.3 AI Job Scraper + ATS-Resume Optimizer

**Status: live.** `QyPEUQbTkLeto8wA`, 24 nodes, active.

Predates this spec and the showcase programme; retained and governed here because it is the same category. `Does Resume Exist?` correctly skips regeneration for an existing same-named resume; this is intended behaviour, confirmed with Aaron, not a bug.

**Public page:** none.

### 7.4 HVAC Service Operations Coordinator

**Status: SELECTED as the next build (Aaron, 2026-08-04). Not built.**

Chosen over Vendor Invoice Processing. Aaron's stated reason: building for one specific target business, so the showcase compounds on ClimateWorks HVAC rather than spreading across unrelated demos. Vendor Invoice Processing is not cancelled, it is deferred; its architecture is recorded in `docs/progress.md` (Save-State 171) and is not lost.

**Origin.** Codex researched recurring operational pain across HVAC, healthcare clinics, real estate, and solar, and recommended HVAC first on the combination of urgent pain, SMB accessibility, measurable ROI, and low regulatory risk. Solar ranked second (document-heavy, strong automation potential), real estate third (crowded, contract and fair-housing sensitivity), healthcare fourth (large pain, but only behind a HIPAA-ready architecture with BAAs, access controls, and audit logging).

**Additional argument, not in the original research:** ClimateWorks HVAC already exists in this repo (§6), with a live triage system, synthetic inventory and availability, a knowledge base, and 19 published screenshots. Building HVAC next extends an existing demo business, and makes §7.1 the coordinator's intake stage rather than an unrelated exhibit.

**Design constraints inherited from §3.** The research described this as a "stateful AI Operations Coordinator" with a `wait for response` stage. Two corrections are binding:
1. It must not be built as a tool-calling Agent (§3.1). The `extract / validate / enrich / decide` sequence is deterministic orchestration with bounded LLM steps, which is exactly the context-injection pattern that works.
2. `wait for response` must be external state with re-entrant triggers, never an in-workflow wait (§3.2).

**Scope decision, phase 1 (recommended, awaiting Aaron's confirmation).** The full research proposed ten stages amounting to an entire field-service operations platform, and it assumes a field-service CRM that does not exist. Phase 1 is one bounded slice, proven end to end:

```
Inbound service request
  -> extract customer, address, equipment, urgency, problem
  -> validate and enrich against service area and existing records
  -> propose appointment slots
  -> HUMAN APPROVAL (dispatcher)
  -> job created
```

Explicitly deferred to a documented phase 2: technician-note parsing, estimate drafting, unpaid-invoice follow-up, and the daily at-risk-jobs summary.

**Unverified, blocking publication (§8).** Every statistic in the source research (BLS and ACCA on HVAC employment, CAQH and AMA on prior authorization, NAR on real estate technology, DOE and NREL on solar soft costs) is recorded as cited but **has not been independently checked**. None may appear on a public page until verified against the actual source. This blocks publishing an HVAC page, not building the system.

**Open before building:** Aaron's confirmation of the phase-1 scope above, and the §5 autonomy-gate boundary for this system (which steps, if any, may act without dispatcher approval). Everything through job creation is currently specified as human-approved.

---

## 8. Publication rules (HARD GATE)

**This is the one hard gate in this spec, and it is deliberately placed here rather than on building.**

Showcase systems run against synthetic data, so building one wrong carries near-zero risk and does not warrant heavyweight process. Publishing is different: it is the irreversible step. Once a page is indexed or scraped, it cannot be recalled. Three consecutive full-chain audits were dominated by a single screenshot containing a personal email address, for exactly this reason.

Before any showcase page is committed and pushed:

**8.1 Privacy review of every image.** Read every screenshot directly. Do not trust a previously recorded count: the last audit found the tracked exposure was 5 images and 10 instances when the true figure was 9 images and 14 instances, and four images would have shipped with the address intact.

Redact with **solid opaque bars**, never blur or pixelation. Both have been reversed for short predictable strings, and an email address is exactly that: known format, small alphabet, guessable domain.

Verify redaction three ways: re-read every edited image, assert programmatically that each bar region is uniform fill, and sweep the remaining images to confirm they are clean. Back up originals outside the working tree so nothing carrying the original can be committed by accident.

Deliberately retained: `aaron@nogalsolutions.tech`, the public business address.

**8.2 Every published number must be real and traceable.** No fabricated figures, and no plausible-sounding estimates. If a number cannot be traced to a real execution or a verified source, it does not go on the page.

Worked example, the "automated workflows" stat on the homepage and the CEP case-study page. It read **18** until 2026-08-04, which was accurate only under an unstated definition: BW1 through BW10 (10), plus Outbound Discovery Bootstrap, Kickoff Prep, Notify Expected Deposit, Record Deposit Payment, and Send Onboarding Kit (5), plus three infra workflows, excluding the five shared sub-workflows.

A stat that needs an unstated exclusion to be true is exactly what this rule exists to catch. Verified live via `n8n_list_workflows` on 2026-08-03: the CEP is **23** workflows, counting everything that runs. Aaron's call was to publish the real number, so all five instances were changed to 23 (two meta descriptions, three stat arrays, plus one code comment).

The remaining 5 of the 28 on the instance are the 3 showcase systems (governed by this spec, deliberately not counted in a CEP stat) and 2 archived stubs.

Third-party statistics (§7.4) must be checked against the actual source before publication, not accepted from a research summary.

**8.3 Honest framing.** Every page carries an explicit statement that the business is fictional and the data synthetic. Capability claims may not exceed what has actually run. A system that does not do genuine tool-calling is not described as agentic (§3.1).

**8.4 Caption accuracy.** Every caption must match the image above it. One caption previously claimed the scheduler deliberately omitted afternoon slots while the screenshot beneath it plainly offered a 1pm to 3pm appointment.

**8.5 Aaron's explicit go-ahead.** Website changes are never committed or pushed without it. This is a standing rule and this spec does not relax it.

### 8.6 Website verification checklist

- `npx tsc --noEmit` clean (one pre-existing unrelated `src/lib/theme.tsx` error is the known baseline)
- `npm run build` clean
- Console clean **after a dev-server restart**. The console buffer retains errors from transient mid-edit states, and this has produced alarming but false failures at least three times.
- No horizontal overflow at desktop 1280 and mobile 375
- Every referenced image confirmed present on disk, and every image on disk confirmed referenced
- Never use `loading="lazy"` inside a dialog or modal: the intersection observer does not fire reliably inside a freshly mounted portal, and this shipped a page where every screenshot rendered blank

**Measurement traps, all previously hit:** never measure a dialog laid out at a different viewport width (reload and open fresh); reload between dialogs when testing several, because an open modal blocks subsequent clicks and silently reports the first dialog's content for all of them; `scrollWidth - clientWidth` cannot reveal slack in a centred flex container that fits.

---

## 9. Versioning discipline

Deliberately lighter than the CEP's, because the risk profile is different.

- **Building and iterating** does not require a version bump. Showcase systems are exploratory by nature.
- **A new system, a change to a §3 platform constraint, or a change to the §5 autonomy gates** requires a version bump to this document, recorded in Appendix A, before implementation.
- **Publication** requires §8 in full, every time.
- **Activation** requires Aaron's node-by-node review, matching the standing practice for every workflow on this instance regardless of project.

---

## 10. Verification standard

Inherited from the CEP unchanged, because it is what makes any claim here trustworthy.

- Trace the real chain: trigger event, then execution log, then data written, then downstream delivery, then confirmation at the final destination. Do not infer a later step from an earlier one succeeding.
- Use the baton-pass vocabulary exactly: `passed`, `passed outside sandbox`, `not run (reason)`, `expected to pass, unverified`, `not stated`. A check that ran and reported only a known pre-existing error is `passed`, not `not run`.
- `n8n_executions` with `mode=error` can misreport on fully successful executions. Cross-check with `mode=full` whenever anything looks inconsistent. This has been independently confirmed twice.
- On every audit pass, query `n8n_executions` directly for any workflow carrying an "awaiting first trigger" item, rather than waiting for a run to be reported.

---

## Appendix A: Change log

| Version | Date | Change |
|---|---|---|
| 1.0 | 2026-08-03 | Initial version drafted. Establishes the Showcase Systems project as distinct from the CEP; documents §7.1 to §7.3 retroactively (decisions that still bind, not node-by-node history); records the §3 platform constraints established by live failures across 2026-07-28 to 2026-08-01; adds §7.4 as the first forward-looking entry. |
| 1.0 | 2026-08-04 | **Accepted by Aaron.** §7.4 selected as the next build over Vendor Invoice Processing. §8.2's worked example updated after the published workflow count was corrected from 18 to 23 (commit `9f872fe`). |

---

## Appendix B: Carried risks and open items

Every item here is deliberately carried, not forgotten. An item leaves this table only by being resolved or explicitly dropped, never by going unmentioned. Items marked with a carry count have survived multiple audits and are due a decision rather than another carry.

### Open decisions (Aaron's)

| Item | Detail |
|---|---|
| §7.4 phase-1 scope | Bounded slice recommended (request through job creation). Awaiting confirmation before build. |
| §7.4 autonomy boundary | Which steps, if any, may act without dispatcher approval. Currently specified as fully human-approved. |
| `PROMPT_A_MAX_TOKENS` docx value | Spec §11 and Prompt Library §3.3 still document the old 4096 default; live value is correct at 16000. **Carried across 4 audits.** Fix or drop. |
| Roadmap `revision_loops` mention | Stale reference. **Carried across 4 audits.** Fix or drop. |

### Unproven (built, never exercised live)

| Item | Risk if it stays unproven |
|---|---|
| Simple Triage engine (§7.1, `requiresLookup: false`) | The reusable template's other half is unverified. Any client onboarded onto the simple path would be running untested code. |
| Option B `needsHumanFollowUp` (§7.1) | The distinction between "resolved" and "acknowledged, needs follow-up" has never been produced by a real run. |

### Known limits (understood, accepted, not defects)

| Item | Status |
|---|---|
| Whole-dataset prompt injection (§3.1) | Fine at demo scale (6 to 10 rows). Degrades on cost, latency, and accuracy at 1,000+. The RAG showcase on the roadmap is the real fix. |
| FAQ match score variance (§7.1) | `Check FAQ Match` embeds an AI-generated summary whose wording varies run to run, which can move the score across the 0.75 boundary. Aaron's explicit call: leave the threshold alone, a human handles the complaint either way. |
| No genuine tool-calling (§3.1) | Structural on this instance, not a bug awaiting a patch. `N8N_RUNNERS_ENABLED=false` is an untested hypothesis that would target only one of the two bugs and carries production-wide blast radius. Not recommended. |

### Blocking publication only

| Item | Detail |
|---|---|
| §7.4 third-party statistics | BLS, ACCA, CAQH, AMA, NAR, DOE, NREL figures are cited but unverified. Must be checked against the actual sources before appearing on any page (§8.2). Does not block building. |

### Infrastructure

| Item | Detail |
|---|---|
| `www.nogalsolutions.tech` | Returns HTTP 522; not configured as a Pages custom domain. Apex domain is fine, so this is cosmetic. Requires a Cloudflare dashboard action by Aaron, not a code change. |

### Resolved since v1.0 drafting

| Item | Resolution |
|---|---|
| §7.4 versus Vendor Invoice Processing | HVAC selected 2026-08-04. Invoice deferred, architecture preserved in `docs/progress.md`. |
| Published workflow count | Corrected 18 to 23, commit `9f872fe`, confirmed live. |
| Site-wide meta description | Closed 2026-08-04, but **the original flag rested on a false premise**. It was recorded as "disagrees with the page it describes"; in fact all three content routes (`index`, `consultant-engagement-pipeline`, `ai-email-enquiry-triage`) define their own `description`, so `__root.tsx`'s value is overridden everywhere and is never served. It was changed from "operations" to "tasks" anyway, since it remains the fallback for any future route, but no page's served metadata changed. Verified by fetching all three live pages. Lesson: a claim about published metadata is only verified by reading what the server actually returns, not by reading the source file that appears to set it. |
| Personal email in showcase screenshots | Redacted with solid bars, verified byte-for-byte against the live CDN copy (Hindsight 177). |
| `service_role` grant on `hvac_jobs` | Confirmed live 2026-08-04 via a disposable diagnostic workflow (insert, read back, delete), not a raw SQL grant check. Deliberately tested the credential path, not just the Postgres permission: this project's Resend send-only-vs-full-access split showed those can differ. Delete's own response echoed the deleted row back by id, confirming genuine round-trip, not an inferred success. Diagnostic workflow deleted after use, no leftover data. |
| Appointment Slots sheet column names | Confirmed live in the same diagnostic pass: `Date`, `Time Slot`, `Status`. Workflow A's open-slot filter assumption was correct. Recorded in §6. |
