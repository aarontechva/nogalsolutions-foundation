# Job Scraper Workflow Export

Point-in-time export of **`NogalSolutions- AI Job Scraper + ATS-Resume Optimizer`** (`QyPEUQbTkLeto8wA`).

Kept in its own subfolder because this workflow isn't part of NogalSolutions' core operations (the intake → qualification → handoff pipeline documented in the Spec). It's a separate anchor: a Slack-triggered job scraper that queries the JSearch API (via RapidAPI) and produces an ATS-tailored resume per matching job.

## Redaction notice

The `Get All Jobs` node normally carries a **live RapidAPI key** in its `x-rapidapi-key` header, hardcoded directly in the node's parameters rather than referenced through an n8n credential (unlike every other secret-bearing node in this project). That value has been replaced with a placeholder string in this export:

```
"x-rapidapi-key": "REDACTED — real key lives only in n8n; not stored in this export"
```

The live workflow in n8n is untouched and still has the real key — only this exported file is redacted, to avoid putting a working third-party API key in git history.

**If restoring this workflow from this file into another n8n instance:** you'll need to paste the real RapidAPI key back into that header manually (or, better, move it into a proper n8n credential first so future exports don't have this problem).

## What this is — and isn't

Same caveats as the main `n8n-workflows/README.md`: point-in-time, not live-synced, no credential values included (all other credentials referenced by n8n's internal `id`/`name`, same as the main export).
