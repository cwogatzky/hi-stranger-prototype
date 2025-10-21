# 🚀 Hi Stranger — Cloudflare & GitHub Deployment Runbook
_Version 1.0 (merged 21 Oct 2025)_
_Consolidated from project setup, debug sessions, and deployment logs_

---

## 🎯 Purpose
Comprehensive guide for managing the **Hi Stranger prototype** infrastructure:
how to **deploy, debug, connect environments, and maintain KV-based APIs** using
**Cloudflare Pages + Workers + GitHub integration**.

This runbook is the single reference for all technical workflows between **local**, **preview**, and **production**.

---

## 1. Overview

**Stack Overview**
- Cloudflare Pages + Workers
- KV namespaces for storage
- GitHub for version control & automated deploys
- Phoenix Editor for local commits & push
- Wrangler CLI (optional for local testing)

**Branch Logic**
| Branch | Environment | URL |
|---------|--------------|-----|
| main | Production | https://hi-stranger-prototype.pages.dev |
| preview | Testing | https://preview.hi-stranger-prototype.pages.dev |

---

## 2. Local Development

### Start Local Server
    wrangler pages dev ./ --local
Runs Pages with KV bindings and local routing.

### Test Endpoints Locally
    curl -i http://localhost:8788/api/ping
    curl -i http://localhost:8788/api/profiles/count

### Typical Directory Structure
    ai_buddy/
    ├── index.html
    ├── profiles.html
    ├── functions/
    │   └── api/
    │       ├── ping.js
    │       └── profiles/
    │           ├── import.js
    │           ├── count.js
    │           ├── item.js
    │           └── index.js
    ├── js/
    │   ├── app/
    │   ├── ui/
    │   ├── state/
    │   └── net/
    └── docs/

---

## 3. Git & GitHub Workflow

### Initial Setup
1. Create GitHub repo
2. Connect to local project
3. Configure branches:

       git branch -M main
       git push -u origin main
       git checkout -b preview
       git push -u origin preview

### Common Git Commands
| Action | Command |
|--------|----------|
| Add file(s) | git add . |
| Commit | git commit -m "msg" |
| Push to prod | git push origin main |
| Push to preview | git push origin preview |
| Force redeploy | git commit --allow-empty -m "redeploy" + push |
| Compare branches | via GitHub → Compare & pull request |

### Phoenix Workflow
- Use Source Control panel for commits
- Add comment → Click “Commit”
- Then click Push (↑) to deploy
- Phoenix automatically uses Git credentials from setup

---

## 4. Cloudflare Pages Configuration

### Build & Deploy
| Setting | Value |
|----------|--------|
| Build command | npm ci |
| Deploy command | (none) |
| Output directory | / |
| Framework preset | None |

### Automatic Deployments
- Enabled for main (Production)
- Enabled for preview (Testing)
- Each push = new build & deploy

### Verify Build Logs
1. Go to Workers & Pages → Deployments
2. Open the latest build
3. Look for:

       Found Functions directory at /functions. Uploading.
       ✨ Compiled Worker successfully

---

## 5. Functions & API Endpoints

### Healthcheck
    curl -i https://hi-stranger-prototype.pages.dev/api/ping
Expected: {"ok":true,"env":"pages"}

### Profiles Import
    curl -i -X POST https://hi-stranger-prototype.pages.dev/api/profiles/import \
      -H "Authorization: Bearer admin_local" \
      -H "Content-Type: application/x-ndjson" \
      --data-binary $'{"schema_version":"user_profile.v1","profile_id":"usr_demo","created_at":"2025-01-01T00:00:00Z","profile":{"identity":{"user_name":"Demo"}}}\n'

### Count Profiles
    curl -i https://hi-stranger-prototype.pages.dev/api/profiles/count

### Success Indicators
- HTTP 200 = ✅ OK
- HTTP 422 = ❌ Schema invalid
- HTTP 405 = ❌ Wrong HTTP method
- HTTP 401/403 = ❌ Missing or invalid Bearer token

---

## 6. KV Namespaces & Bindings

### What They Are
Cloudflare KV (Key-Value) storage is a distributed, low-latency data layer used by your API routes.
Each namespace acts as a lightweight persistent store (e.g., for profiles or import reports).

### Required Namespaces
| Binding | Namespace | Purpose |
|----------|------------|----------|
| PROFILES_KV | hi_stranger_profiles | Stores user profile JSONs |
| IMPORT_REPORTS_KV | hi_stranger_import_reports | Stores import summaries |
| IDEMPOTENCY_KV | hi_stranger_idempotency | Prevents duplicate uploads |

### Add Bindings
1. Open your Cloudflare project → *Workers & Pages → Settings → Bindings*
2. Choose the correct **environment** (Preview or Production)
3. Add each binding manually:
   - Type: KV namespace
   - Name: e.g. PROFILES_KV
   - Value: select existing namespace (hi_stranger_profiles)

### Apply Changes
After adding bindings → trigger a redeploy:
    git commit --allow-empty -m "redeploy after bindings"
    git push origin main

---

## 7. Deployment Workflows

### Production Flow
1. Make changes → Commit → Push to `main`
2. Cloudflare auto-builds and publishes live
3. Verify:
       curl -i https://hi-stranger-prototype.pages.dev/api/ping

### Preview Flow
1. Commit to `preview`
2. Automatic deploy to https://preview.hi-stranger-prototype.pages.dev
3. Test endpoints and UI changes
4. Merge back via GitHub Pull Request

### Emergency Redeploy
If Cloudflare cache fails to refresh:
    git commit --allow-empty -m "force redeploy"
    git push origin main

---

## 8. Debugging & Logs

### Build Logs
Check Cloudflare → Workers & Pages → Deployments → View details
Look for typical lines like:
    ✨ Compiled Worker successfully
    Success: Your site was deployed!

### Common Issues

| Symptom | Likely Cause | Fix |
|----------|---------------|-----|
| 405 Method Not Allowed | Wrong HTTP method | Use POST for imports |
| 422 Unprocessable Entity | Schema mismatch | Check JSON format |
| kv_missing | Missing KV bindings | Add them and redeploy |
| Could not resolve "@cfworker/json-schema" | Missing dependency | Add `functions/package.json` and lockfile |
| HTML instead of JSON | Wrong route (missing /api/ path) | Use full `/api/...` URL |

---

## 9. Common Commands (Cheatsheet)

| Action | Command |
|--------|----------|
| Local dev server | wrangler pages dev ./ --local |
| Clean Wrangler cache | rm -rf .wrangler |
| Deploy manually | wrangler pages deploy ./_deployments/<folder> |
| Check CF login | wrangler whoami |
| Update Wrangler | npm install -g wrangler@latest |
| Create empty commit | git commit --allow-empty -m "msg" |
| Push to GitHub | git push origin main |

---

## 10. Appendix

### Directory Map
    ai_buddy/
    ├── functions/
    │   └── api/
    │       ├── ping.js
    │       └── profiles/
    │           ├── import.js
    │           └── count.js
    ├── js/
    ├── docs/
    ├── .gitignore
    ├── package.json
    ├── wrangler.toml
    └── README.md

### Nomenclature & Conventions
- All endpoints under `/api/...` map to `/functions/api/...`
- Each environment (preview, main) has its own KV bindings
- Use Bearer `admin_local` for internal import tests
- Only `main` branch merges trigger live builds

### Notes for Future Automation
- Integrate Make.com for post-deploy validation
- Use Cloudflare Queues for async profile imports
- Auto-cleanup old KV keys via cron Worker

---

**Maintainer:** Carsten W.
**Last updated:** 21 Oct 2025
**Validated Environments:** Local, Preview, Production
**Sources merged:** Setup sessions + CF build logs + Git/GitHub integration
