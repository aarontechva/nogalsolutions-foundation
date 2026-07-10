# Data Deletion Runbook — Manual Process

*Operational guidance, not legal advice — not a lawyer. This documents a technically correct, complete deletion process across every system holding prospect data. Whether/when a deletion request is legally mandatory depends on your prospects' jurisdiction; this runbook exists so you have a real, working answer the moment anyone asks, regardless of the legal question.*

---

## Why the order below is not arbitrary

Most of this schema cascades cleanly from `prospects` — delete the prospect, and `activity_logs`, `meetings`, `discovery_sessions`, `post_call_analyses`, `deliverables`, and `revision_loops` all correctly disappear with it automatically (verified against the actual `ON DELETE CASCADE` constraints in Spec §3.2, not assumed).

**One table doesn't follow that pattern:** `intake_submissions` — the table holding the actual raw form submission — is deliberately set to `ON DELETE SET NULL`, not `CASCADE`. If you delete the prospect first, this table doesn't get cleaned up; it just goes orphaned, silently retaining the full original submission forever. **This is why intake_submissions gets deleted explicitly, and first** — not because of a preference, because of how the schema is actually built.

---

## Step-by-step process

### 1. Find the prospect and capture their IDs

```sql
SELECT id, company_id, email, full_name
FROM prospects
WHERE email = '<the requester's email>';
```

Write down both `id` and `company_id` from the result — you'll need both below, and capturing them now avoids any ordering confusion later.

### 2. Delete the raw intake submission(s) — first, explicitly

```sql
DELETE FROM intake_submissions WHERE prospect_id = '<id from step 1>';
```

This also automatically cascades to delete any linked `qualification_results` row (`ON DELETE CASCADE` from `intake_submissions`).

### 3. Delete the prospect itself

```sql
DELETE FROM prospects WHERE id = '<id from step 1>';
```

This automatically cascades to `activity_logs`, `meetings`, `discovery_sessions`, `post_call_analyses`, `deliverables`, and `revision_loops` — no separate deletes needed for any of those six tables.

### 4. Check whether the associated company should also be deleted

**Don't delete it automatically** — a company can legitimately have multiple prospects (e.g., two people from the same business both submitted the form). Deleting it would silently corrupt the other person's record.

```sql
SELECT count(*) FROM prospects WHERE company_id = '<company_id from step 1>';
```

If this returns `0`, this was the only prospect linked to that company — safe to also delete:
```sql
DELETE FROM companies WHERE id = '<company_id from step 1>';
```
If it returns anything greater than `0`, leave the company record alone.

### 5. HubSpot — manual deletion, same "shared company" caution applies

- Search HubSpot for the Contact by email, delete it.
- If a Deal exists (qualified-path prospects only), delete it — check that no other Contact is associated with the same Deal first (shouldn't happen given how Workflow 3 creates Deals, but verify rather than assume).
- **Same rule as step 4:** before deleting the Company object in HubSpot, check whether any other real Contact is still associated with it. If yes, leave it.

### 6. Verify — don't consider this done until you've actually confirmed zero rows remain

```sql
SELECT
  (SELECT count(*) FROM prospects WHERE email = '<email>') AS prospects,
  (SELECT count(*) FROM intake_submissions WHERE payload->>'email' = '<email>') AS intake_submissions;
```

Both should return `0`. This is the same "verify against the live system, don't trust that the deletes ran without error" discipline as everything else in this project — a delete statement returning successfully tells you it ran, not that every related row is actually gone.

---

## What this process does not yet cover

- **Recordings/transcripts** (`discovery_sessions.recording_url`, `.transcript`) — these cascade-delete correctly via the `prospects` cascade above, but if a recording file also exists in Supabase Storage separately from the database row, confirm the storage object itself is deleted too, not just the row referencing it. Not yet relevant today since Workflow 5 (Recording Watcher) isn't built — revisit this note once it is.
- **Backups** — a deleted prospect's data will still exist in any R2 backup file created before the deletion. This runbook only covers live/production data; whether and how to also purge historical backups is a separate decision, not addressed here.

Backup residual exposure window. Deleting a prospect via this runbook removes their data from Supabase and HubSpot only. R2 daily backups retain a copy for up to 90 days after deletion, per the automated retention purge (NogalSolutions-Infra Backup Retention Purge (R2)). No manual backup purge is performed or supported. If a data-request requires guaranteed removal from backups faster than 90 days, that is not currently supported by this process — escalate manually.
