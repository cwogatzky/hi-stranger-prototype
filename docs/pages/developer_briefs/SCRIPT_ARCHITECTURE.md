# Script Architecture & Communication (Hi Stranger) — v2025-10-16
_Patch 1 — Updated Docs Viewer path, port 8788, and unified Runtime & Recovery Layer section._

---

## Purpose
Define a clear, modular, and scalable script layout for the prototype that directly transfers to LIVE with minimal refactoring. This version combines **technical accuracy** with **plain-language explanations** so that everyone — from developers to designers — can understand how the app works and why each part matters.

---

## Modules (ES Modules, no globals)
*(Modules 1 – 24 unchanged from previous version.)*

---

## 🧩 Runtime & Recovery Layer (Modules 25 – 27 merged)

### Event Bus Extensions
- `profiles:saved`, `profiles:imported`, `profiles:validationError`
- Improves observability and reactive updates during profile edits or imports.
- All events follow colon-based naming conventions.

### Moderation & AI Enforcement
- Enforces structured JSON output for language consistency.
- Dual-language translation (DE/ES) + strict schema validation.
- Auto-fallback for missing translations (`""` fields).
- Language-agnostic and schema-safe moderation cycles.

### Runtime Resilience & Recovery
- `.assetsignore` prevents Wrangler overload (EMFILE).
- Fallback cleanup:
  ```bash
  rm -rf .wrangler
  wrangler pages dev ./ --local
  ```
- Full rebuild triggers restore missing directories.
- Local dev sessions recover automatically from corrupted caches.

---

## 🧭 Documentation Viewer System
**File:** `/docs/index.html`

**Purpose:** Developer tool for navigating and rendering project documentation.
- Automatically lists and renders all `.md` files under `/docs/pages/`.
- Sidebar navigation with nested folders.
- Serves as a lightweight, auto-updating knowledge base for the team.
- **Local access:** `http://localhost:8788/docs/`

---

**End of Script Architecture v2025-10-16 (Patch 1)**
