-- Migration: Fix Workflow 1 — GRANT INSERT + notify_n8n_intake_submission trigger
-- Spec v2.4 §7 (Workflow 1) / §3.4 (RLS / grants)
-- Date: 2026-07-04
--
-- DO NOT APPLY DIRECTLY via apply_migration.
-- Review in the Supabase SQL editor, then run manually. (§10.2 review protocol)
--
-- What this fixes:
--   1. GRANT INSERT on intake_submissions TO anon was never issued.
--      The RLS policy alone is insufficient — Postgres requires a base grant
--      AND a permitting RLS policy. Without the grant, every anon INSERT
--      fails silently (PGRST301 / 403). The live intake form has been
--      sending 0 rows since launch.
--   2. The trigger notify_n8n_intake_submission (AFTER INSERT, FOR EACH ROW)
--      described in §7 Workflow 1 was never created. This migration creates it.


-- ─── Step 1: Base Postgres grant ────────────────────────────────────────────
-- Required because this project unchecked "Automatically expose new tables"
-- in Supabase (§3.4). The anon role has no implicit access.

GRANT INSERT ON public.intake_submissions TO anon;


-- ─── Step 2: Trigger function ───────────────────────────────────────────────
-- Sends a POST to the Auto-Ack n8n webhook on every intake_submissions INSERT.
-- Payload shape matches what the existing workflow already expects at
--   $json.body.record.payload.email
-- Do not change the n8n side — this trigger is written to match it.

CREATE OR REPLACE FUNCTION public.notify_n8n_intake_submission()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM net.http_post(
    url     := 'https://n8n-j7un.srv1769180.hstgr.cloud/webhook/intake-submission-ack',
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


-- ─── Step 3: Trigger ────────────────────────────────────────────────────────

CREATE TRIGGER notify_n8n_intake_submission
  AFTER INSERT ON public.intake_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_n8n_intake_submission();
