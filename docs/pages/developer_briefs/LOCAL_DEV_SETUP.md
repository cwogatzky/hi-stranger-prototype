# ⚙️ Local Development & Architecture — Hi Stranger Prototype  
_Version 1.0 (merged 17 Oct 2025)_  
_Consolidated from `SCRIPT_ARCHITECTURE.md` + `LOCAL_DEV_SETUP.md`_

---

## 🎯 Purpose
Unified guide for developers and contributors.  
Explains **how the app is structured**, **how it runs locally**, and **how to recover or deploy it** with minimal friction.  
This document merges technical accuracy with plain-language explanations so everyone — from developers to designers — can understand how the app works and why each part matters.

---

## 1. Environment Overview

**Stack**
- **Cloudflare Workers + Pages** (local mode)  
- **Wrangler CLI** (v4.42.2 or higher)  
- **Node.js ≥ 18**  
- **Browser-based frontend** served from local Pages environment  
- **Cloudflare KV** for storage (no external DBs)

**Primary Command**
```bash
wrangler pages dev ./ --local
```
Runs the project locally with KV bindings, Pages routing, and hot reload.

---

## 2. Directory & Module Architecture

```
ai_buddy/
├── index.html
├── profiles.html
├── styles.css
├── js/
│   ├── script.js
│   ├── app/          # Boot, EventBus, Runtime
│   ├── ui/           # Interface, message flow
│   ├── state/        # Local + session state
│   ├── net/          # API, translation, moderation
│   └── types/        # Shared schemas
├── functions/
│   └── api/
│       └── profiles/ # Worker endpoints
│           ├── index.js
│           ├── item.js
│           └── import.js
├── docs/
│   └── pages/
│       ├── ...
└── .assetsignore
```

- All scripts are ES Modules (**no globals**).  
- Communication via central **event bus** (`App.emit`, `App.on`).  
- **Colon-based event naming** for clarity (`profiles:imported`, `moderation:ready`).  
- `App.debug()` wraps `console.debug()` when `DEBUG=true`.  
- Structure is designed to migrate to production Cloudflare Pages with minimal refactoring.

---

## 3. Runtime & Recovery Layer

### Event Bus Extensions
- Events: `profiles:saved`, `profiles:imported`, `profiles:validationError`  
- Improves observability and reactive updates during profile edits or imports.  
- Enables modular runtime communication.

### Moderation & AI Enforcement
- Enforces structured JSON output for all OpenAI moderation replies.  
- Dual-language translation (DE/ES) with strict schema validation.  
- Auto-fallback for missing translations (`""` fields).  
- Language-agnostic moderation cycles with schema-safe enforcement.

### Runtime Resilience & Recovery
- `.assetsignore` prevents Wrangler overload (`EMFILE` errors).  
- Recovery shortcut:
  ```bash
  rm -rf .wrangler
  wrangler pages dev ./ --local
  ```
- Full rebuild restores missing directories.  
- Local sessions recover automatically from corrupted caches.

---

## 4. Wrangler Configuration

**KV Bindings (local mode)**
- `env.PROFILES_KV`
- `env.IMPORT_REPORT_KV`
- `env.IDEMPOTENCY_KV`

**Environment Variables**
```
LOG_LEVEL="debug"
```

**Compatibility Date:**  
`2025-10-08`  
> Wrangler automatically falls back if newer date isn’t supported.

---

## 5. Docs Viewer System

**File:** `/docs/index.html`  
**Purpose:** Lightweight documentation browser for team knowledge.  
- Automatically lists and renders all `.md` files under `/docs/pages/`.  
- Sidebar navigation with nested folders.  
- Local access: `http://localhost:8788/docs/`  
- Auto-updates when `_files.json` changes.  
- Serves as developer knowledge base and quick reference.

---

## 6. Asset Handling

The `.assetsignore` file prevents Wrangler from loading unnecessary or large files (e.g., node_modules):

```
node_modules/
.wrangler/
.git/
.DS_Store
*.ndjson
*.ndjson.gz
```

> This protects against “too many open files (EMFILE)” errors on macOS and speeds up rebuilds.

---

## 7. Commands

| Action | Command |
|--------|----------|
| Start local server | `wrangler pages dev ./ --local` |
| Stop server | `Ctrl + C` |
| Build static version | `wrangler pages build` |
| Deploy manually | `wrangler pages deploy ./dist` |
| Update Wrangler | `npm install -g wrangler@latest` |

---

## 8. Common Issues & Fixes

### ❗ EMFILE: Too many open files
**Cause:** Too many concurrent file handles during Wrangler startup.  
**Fix:** Add `.assetsignore` as shown above; restart shell and rerun `wrangler pages dev ./ --local`.

---

### ❗ 422 Unprocessable Entity on `/api/profiles/import`
**Cause:** Invalid NDJSON payload structure or schema mismatch.  
**Fix:** Ensure payload matches `user_profile.v1` schema and contains all required nested keys (`identity`, `intent`, `behavior`, `emotional`, `interests`).

---

### ❗ 405 Method Not Allowed on `/api/profiles/item`
**Cause:** Wrong HTTP method (PUT not supported).  
**Fix:** Use `/api/profiles/import` endpoint for updates instead.

---

### ❗ 500 or “Cannot read properties of undefined (reading 'pipe')”
**Cause:** Local Wrangler version conflict or missing `.assetsignore` filter.  
**Fix:**  
1. Delete `.wrangler/` cache  
2. Update Wrangler (`npm install -g wrangler@latest`)  
3. Restart dev server  

---

## 9. Recovery Procedures

If project files are accidentally moved or deleted:

1. Stop Wrangler (`Ctrl + C`)  
2. Recreate missing folders via Finder or CLI  
3. Restore from backup or Git  
4. Restart:  
   ```bash
   wrangler pages dev ./ --local
   ```

If `.wrangler/` cache is corrupted:
```bash
rm -rf .wrangler
wrangler pages dev ./ --local
```

> After reset, Wrangler automatically recreates KV bindings on first startup.

---

## 10. Verification Checklist

- [x] `index.html` accessible at `http://localhost:8788/`  
- [x] `profiles.html` loads without 404 or 500 errors  
- [x] All JS modules resolve (`/js/app/boot.js`, `/js/script.js`)  
- [x] KV namespaces initialized successfully  
- [x] `Save` operations on profiles functional  
- [x] `DEBUG=true` toggle tested (console output visible, no PII)

---

## 11. References

- [Cloudflare Wrangler Docs](https://developers.cloudflare.com/workers/wrangler/)  
- [Cloudflare KV Storage](https://developers.cloudflare.com/workers/runtime-apis/kv/)  
- [Miniflare Local Runtime](https://developers.cloudflare.com/workers/testing/local-development/)

---

**Maintainer:** Carsten W.  
**Last verified:** 17 Oct 2025  
**Source files merged:** `SCRIPT_ARCHITECTURE.md`, `LOCAL_DEV_SETUP.md`