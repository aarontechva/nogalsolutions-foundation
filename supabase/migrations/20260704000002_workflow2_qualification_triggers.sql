-- Migration: Workflow 2 — Qualification Engine Postgres Triggers
-- Spec v2.5 §4.1a / §3.4a
-- Date: 2026-07-04
--
-- DO NOT APPLY DIRECTLY via apply_migration or any auto-run path.
-- Review in the Supabase SQL editor, then run manually per §10.2.
--
-- Prerequisites verified 2026-07-04:
--   pg_net v0.20.3 enabled ✓
--   intake_submissions table exists, RLS enabled ✓
--   qualification_results table exists, RLS enabled ✓
--   notify_n8n_intake_submission trigger already on intake_submissions ✓
--
-- Delivers:
--   1. notify_n8n_qualification_engine() + trigger on intake_submissions
--      AFTER INSERT — calls Workflow 2 webhook (parallel to Workflow 1,
--      not chained off it per §7 isolation requirement and §4.1a).
--
--   2. notify_n8n_qual_branch() + trigger on qualification_results
--      AFTER INSERT OR UPDATE — Phase 4 handoff. Routes to Workflow 3
--      (qualified=true) or Workflow 4 (qualified=false) via DB trigger,
--      not n8n-internal IF-branch. Reason: if Workflow 2 crashed after
--      Phase 3 write, an internal branch would leave a qualified lead with
--      no booking email and no trace. The DB write itself is the handoff.
--
-- ⚠ STUB URLS: Workflow 3 and 4 webhook paths (qualified-handoff,
--   not-qualified-decline) do not exist yet. The trigger calls will return
--   404 until those workflows are built and activated. Expected behavior
--   per §4.1a: stub rather than guess at their shape.
--   Update the URLs inside notify_n8n_qual_branch() when Workflows 3/4
--   are deployed.
--
-- ⚠ §3.4a CHECKLIST: After applying, verify anon/authenticated grants:
--   SELECT table_name, grantee, privilege_type
--   FROM information_schema.role_table_grants
--   WHERE grantee IN ('anon','authenticated') AND table_schema = 'public'
--   ORDER BY table_name, privilege_type;
--   Expected: only anon → INSERT on intake_submissions. Nothing else.


-- ─── Trigger 1: notify_n8n_qualification_engine ───────────────────────────────
-- Fires on every intake_submissions INSERT, parallel to the existing
-- notify_n8n_intake_submission trigger. Both fire independently for the same
-- INSERT — Workflow 1 sends the ack email, Workflow 2 runs the qualification.

CREATE OR REPLACE FUNCTION public.notify_n8n_qualification_engine()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM net.http_post(
    url     := 'https://n8n-j7un.srv1769180.hstgr.cloud/webhook/qualification-engine',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body    := jsonb_build_object(
                 'type',       'INSERT',
                 'table',      'intake_submissions',
                 'schema',     'public',
                 'record',     jsonb_build_object(
                                 'id',           NEW.id,
                                 'prospect_id',  NEW.prospect_id,
                                 'payload',      NEW.payload,
                                 'submitted_at', NEW.submitted_at,
                                 'created_at',   NEW.created_at
                               ),
                 'old_record', NULL
               )
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER notify_n8n_qualification_engine
  AFTER INSERT ON public.intake_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_n8n_qualification_engine();


-- ─── Trigger 2: notify_n8n_qual_branch ───────────────────────────────────────
-- Phase 4 handoff. Fires on every qualification_results INSERT OR UPDATE.
-- Routes based on the qualified boolean — qualified=true → Workflow 3 (booking
-- email), qualified=false → Workflow 4 (polite decline + nurture).
--
-- ON CONFLICT upsert (§3.2.4): if Workflow 2 re-evaluates the same submission,
-- the UPDATE fires this trigger again. Workflow 3/4 must be idempotent for
-- re-triggered calls.

CREATE OR REPLACE FUNCTION public.notify_n8n_qual_branch()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.qualified THEN
    -- ⚠ STUB: replace with real URL when Workflow 3 is deployed
    PERFORM net.http_post(
      url     := 'https://n8n-j7un.srv1769180.hstgr.cloud/webhook/qualified-handoff',
      headers := '{"Content-Type": "application/json"}'::jsonb,
      body    := jsonb_build_object(
                   'type',       TG_OP,
                   'table',      'qualification_results',
                   'schema',     'public',
                   'record',     jsonb_build_object(
                                   'id',                    NEW.id,
                                   'intake_submission_id',  NEW.intake_submission_id,
                                   'qualified',             NEW.qualified,
                                   'reason',                NEW.reason,
                                   'rule_results',          NEW.rule_results,
                                   'evaluated_at',          NEW.evaluated_at,
                                   'created_at',            NEW.created_at
                                 ),
                   'old_record', CASE WHEN TG_OP = 'UPDATE'
                                   THEN jsonb_build_object(
                                          'id',                   OLD.id,
                                          'intake_submission_id', OLD.intake_submission_id,
                                          'qualified',            OLD.qualified,
                                          'reason',               OLD.reason,
                                          'rule_results',         OLD.rule_results,
                                          'evaluated_at',         OLD.evaluated_at,
                                          'created_at',           OLD.created_at
                                        )
                                   ELSE NULL
                                 END
                 )
    );
  ELSE
    -- ⚠ STUB: replace with real URL when Workflow 4 is deployed
    PERFORM net.http_post(
      url     := 'https://n8n-j7un.srv1769180.hstgr.cloud/webhook/not-qualified-decline',
      headers := '{"Content-Type": "application/json"}'::jsonb,
      body    := jsonb_build_object(
                   'type',       TG_OP,
                   'table',      'qualification_results',
                   'schema',     'public',
                   'record',     jsonb_build_object(
                                   'id',                    NEW.id,
                                   'intake_submission_id',  NEW.intake_submission_id,
                                   'qualified',             NEW.qualified,
                                   'reason',                NEW.reason,
                                   'rule_results',          NEW.rule_results,
                                   'evaluated_at',          NEW.evaluated_at,
                                   'created_at',            NEW.created_at
                                 ),
                   'old_record', CASE WHEN TG_OP = 'UPDATE'
                                   THEN jsonb_build_object(
                                          'id',                   OLD.id,
                                          'intake_submission_id', OLD.intake_submission_id,
                                          'qualified',            OLD.qualified,
                                          'reason',               OLD.reason,
                                          'rule_results',         OLD.rule_results,
                                          'evaluated_at',         OLD.evaluated_at,
                                          'created_at',           OLD.created_at
                                        )
                                   ELSE NULL
                                 END
                 )
    );
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER notify_n8n_qual_branch
  AFTER INSERT OR UPDATE ON public.qualification_results
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_n8n_qual_branch();
