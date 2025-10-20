# Hi Stranger! — AI-Moderated Multilingual Chat Prototype  
_Version: 2025.10.21 — Patch 3_  
_Last updated: 21 Oct 2025_  
_Notes: Updated Quick Start for Wrangler workflow; clarified local mode and KV sync._

---

## 🧭 Overview
**Hi Stranger!** is a modular, multilingual group-chat prototype exploring how AI moderation can guide small-group discussions toward meaningful goals.

Each session combines:  
- **Human participants** with individual profiles (language, traits, tone)  
- **Vye**, an AI moderator managing flow, tone & context  
- **Owner controls** to define session purpose, guardrails, and success criteria  

The prototype focuses on clarity, translation accuracy, and adaptive moderation behavior.

---

## 🚀 Quick Start (Local)
1. Clone or download the repository.  
2. Ensure **Wrangler v4.42.2+** and **Node ≥ 18** are installed.  
3. Start the local Cloudflare Pages environment with full KV emulation:  
    
       wrangler pages dev ./ --local
    
4. Open `http://localhost:8788/` in your browser.  
5. The prototype will run with live Docs Viewer, chat persistence, and AI moderation simulation.

---

## 🧩 Core Features

| Area | Description |
|------|--------------|
| **Intro Mode** | Sequential introductions with Done/Next logic & localized hints. |
| **User Profiles** | Configurable via `/profiles.html`; traits, tone, language, role metadata. |
| **Owner Controls** | First user becomes **chat_owner** and can trigger group actions (e.g. restart intro). |
| **AI Moderation** | Goal-aware moderation by `Vye` using `chat_meta`, profiles, languages & rules. |
| **Translation Flow** | Deterministic dual-language output (de/es/en) with fallbacks & clean JSON. |
| **Make/OpenAI Pipeline** | Modular webhook flow with strict schemas & `parent_ID` routing. |
| **UI/UX** | Structured CSS, comment headers, consistent bubbles & responsive layout. |

---

## 🧠 Architecture Snapshot

    [Frontend]
      ├── User Panels (dynamic profiles)
      ├── Intro / Chat Flow Manager
      ├── i18n (localized system texts)
      └── Network Layer → Make Webhook
             ↓
          [OpenAI Translation + Moderation]
             ↓
         Structured JSON Output

---

## 📂 Repository Structure (snapshot)
> This is a **build-oriented snapshot** of key files.  
> The **full tree** lives in `docs/pages/SCRIPT_ARCHITECTURE.md`.

    .
    ├─ index.html
    ├─ profiles.html                # profiles UI entry
    ├─ styles.css
    ├─ chat_img/                    # chat UI image assets (icons, avatars, overlays)
    ├─ js/
    │  ├─ script.js                 # main orchestrator (entry)
    │  ├─ app/
    │  │  └─ boot.js               # init sequence controller
    │  ├─ state/
    │  │  ├─ adapters/
    │  │  │  └─ local.js           # localStorage adapter (AppStorage)
    │  │  ├─ chatMeta.js           # chat-wide metadata (goal, rules, metrics)
    │  │  ├─ profileStore.js       # user profiles CRUD + persistence
    │  │  └─ storage.js            # persistence abstraction
    │  ├─ types/
    │  │  └─ schemas.js            # data schemas + validation helpers
    │  └─ ui/
    │     └─ profileForm.js        # add/edit user profiles
    └─ docs/
       ├─ index.html
       ├─ _files.json
       └─ pages/
          ├─ AI_briefs/
          │  ├─ DEV_COLLAB_GUIDE.md
          │  └─ DEV_NOTES.md
          ├─ backlogs/
          ├─ data_entities/
          ├─ done/
          ├─ LOCAL_DEV_SETUP.md
          ├─ DATA_STORAGE_CONCEPT.md
          ├─ SCRIPT_ARCHITECTURE.md
          ├─ USER_PROFILE_ANALYSIS.md
          └─ SECURITY_PRIVACY.md

---

## 🧱 Development Guidelines
1. **No code without context.** Add a short technical brief before commits.  
2. **Comments in English, conversation in German.**  
3. **One feature per patch.** Never batch unrelated changes.  
4. **Before commit:**  
   - Check `console.debug` consistency  
   - Validate JSON schemas  
   - Test translation output (DE & ES)  
   - Confirm clean modular imports  
5. **Boot Sequence:**  
   `boot() → UI.init() → Presets.load() → Events.bind() → Moderation.start()`

---

## 🪲 Debug & Logging
- Use `console.debug()` for internal tracing (automatically namespaced per module).  
- Toggle via `DEBUG=true` in `boot.js` or query param `?debug`.  
- **No sensitive data** in console output (see `SECURITY_PRIVACY.md`).

---

## 💾 Persistence
The prototype uses **Cloudflare KV** (for live sessions) and **localStorage** (for local tests).  
Synchronization runs automatically on boot and before moderation calls.

---

## ☁️ Deployment
Prototype now **runs live** on **Cloudflare Pages** with Wrangler v4.42.2.

- Local dev: `wrangler pages dev ./ --local`  
- KV namespaces auto-bound to worker env  
- Domain mapping active on Cloudflare DNS  
- See `docs/pages/LOCAL_DEV_SETUP.md` for full setup

---

## 🧩 Documentation
All documentation is now served through the integrated Docs Viewer system (`/docs/index.html`).

**Structure overview:**
- `/docs/pages/LOCAL_DEV_SETUP.md` — local setup & Wrangler instructions  
- `/docs/pages/DATA_STORAGE_CONCEPT.md` — Cloudflare KV + localStorage concept  
- `/docs/pages/SCRIPT_ARCHITECTURE.md` — full repository tree & file structure  
- `/docs/pages/USER_PROFILE_ANALYSIS.md` — profile system & traits model  
- `/docs/pages/SECURITY_PRIVACY.md` — privacy and access rules  
- `/docs/pages/data_entities/*.md` — all data schemas (chat_meta, profiles, etc.)  
- `/docs/pages/backlogs/*.md` — daily backlog & runplan documentation  
- `/docs/pages/done/*.md` — completed work logs  
- `/docs/pages/AI_briefs/*.md` — developer notes & collaboration guides  

The Docs Viewer automatically indexes and renders these files via KV-backed `_files.json`.

---

## 📚 Documentation & Internal Tools
### Docs Viewer
- **Source:** `/docs/index.html` + `_files.json` (auto-generated KV manifest)  
- **Purpose:** Serves all `.md` files from `/docs/pages/` in a single-page viewer.  
- **Features:**  
  - Sidebar navigation with live folder hierarchy  
  - Auto-refresh on KV updates  
  - Uniform markdown rendering  
- **Local Access:** `http://localhost:8788/docs/`  
- **Deployed Access:** Cloudflare Pages (internal instance)  
- **Archives:** `/docs/pages/done/` — completed logs & changelogs

---

## 👥 User Profiles Module
Persistent profiles for simulated users in tests.

- **Core Files:**  
  - `js/state/profileStore.js` — CRUD store (AppStorage)  
  - `js/ui/profileForm.js` — Profile UI (Add/Edit/Delete)  
- **Key Features:**  
  - Persistent storage via local adapter  
  - Unique IDs with collision protection  
  - Active profile tracking (`active_profile_id`)  
- **Roadmap:**  
  - CSV/JSON import/export  
  - Trait chips (visual tags)  
  - Link with Chat Owner + Moderation logic  
  - See `docs/pages/USER_PROFILE_ANALYSIS.md`

---

## 🧠 Moderation Policy Layer (Personality Mapping)
Maps `profile.traits` → `moderation.policies`.

- **Examples:**  
  - “Calm” → softer tone, less intervention  
  - “Humorous” → creative tone  
  - “Analytical” → precise, structured responses  
- **Implementation:**  
  - `js/moderation/policies.js`  
  - `js/moderation/promptBuilder.js`

---

## 🧭 Daily Workflow
All documentation and coordination use English.

- **Backlogs:** `/docs/pages/backlogs/`  
- **Run Plans:** `/docs/pages/backlogs/RUNPLAN-YYYY-MM-DD.md`  
- Both integrated into Docs Viewer and synced via KV index.  

---

## 🔐 Security Note
See `docs/pages/SECURITY_PRIVACY.md` for privacy and access policies.

---

## 📜 License
© 2025 Hi Stranger Project.  
All rights reserved — private internal testing build (Cloudflare Pages deployment).