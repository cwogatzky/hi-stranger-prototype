# 🗄️ DATA STORAGE CONCEPT (Hi Stranger Prototype → LIVE)

_Version: 1.2 — Last updated: 16 Oct 2025_  
_Patch Notes:_ Added Wrangler version and port note, audit log retention, and reference to SECURITY_PRIVACY.md for encryption policies.  
_See also:_ [`SECURITY_PRIVACY.md`](../pages/SECURITY_PRIVACY.md) — encryption & access policies.

---

## 1. Overview
This document outlines the current and future data-storage strategy for *Hi Stranger*, covering:
- where data lives today (prototype)
- how it will migrate to a secure production setup
- encryption, privacy, and performance considerations
- compliance and migration paths.

---

## 2. Current Prototype (Local)
**Storage:** Browser `localStorage`

- No sync, no encryption — purely for testing and fast iteration.  
- Stores: user profiles (non-PII), chat meta, moderation state.  
- Purpose: simulate CRUD and persistence between sessions.  
- Contains *no real personal data (PII)* — only demo profiles.

---

## 3. Future LIVE Setup (Cloudflare Stack)
**Storage Layers**

| Purpose | Service | Notes |
|----------|----------|-------|
| Relational data (profiles, chats) | **D1 (SQLite)** | transactional, indexable |
| Configs & small JSON caches | **KV** | edge-cached, fast reads |
| Attachments / media | **R2** | object storage, optional |
| Real-time session state | **Durable Objects** | for chat rooms / moderation contexts |
| API / Access control | **Workers + Pages Functions** | unified interface for CRUD, encryption, auth |

**Edge benefit:** All components run close to the user (low latency, fast boot).

---

### 3.1 Prototype KV & Local Mode
During active development, data is stored in **local KV namespaces** managed by Wrangler.

**KV Namespaces:**

| Namespace | Purpose |
|------------|----------|
| `PROFILES_KV` | Stores user profiles in NDJSON format |
| `IMPORT_REPORT_KV` | Tracks imports and validation logs |
| `IDEMPOTENCY_KV` | Prevents duplicate writes via idempotency keys |

**Local Persistence**
- Wrangler keeps data under `.wrangler/state/`.  
- Tested with **Wrangler v4.42.2** (default local port **8788**).  
- Safe to delete during resets or schema changes.  
- Reset command:
  ```bash
  rm -rf .wrangler
  wrangler pages dev ./ --local
  ```
- **Audit logs** in `IMPORT_REPORT_KV` are auto-purged after **30 days**.  

---

### 3.2 Import / Update Flow
All profile data (both new and updates) use the same import endpoint to ensure consistency.

| Action | Endpoint | Method | Notes |
|--------|-----------|--------|-------|
| Import / Update | `/api/profiles/import` | POST | NDJSON-based upsert |
| Get profile | `/api/profiles/item?id={id}` | GET | Single record fetch |
| List profiles | `/api/profiles?limit=100` | GET | Paginates with cursor |
| Count | `/api/profiles/count` | GET | Returns total |

**Why no PUT or PATCH**  
Workers KV has no atomic record-level operations; therefore, updates use the **idempotent import model**, safely overwriting existing keys only if validated.

---

## 4. Data Model (Separation of Concerns)

| Object | Description | Sensitive? | Encryption |
|---------|--------------|-------------|-------------|
| `profile` | Pseudonymous persona (traits, language, tone, preferences) | No | None |
| `personal_data` | Name, email, address, payment info | Yes | AES-GCM (envelope) |
| `link_profile_personal` | Mapping table (IDs only) | No | None |
| `chat_meta` | Owner, type, goal, languages, timestamps | No | None |
| `policy_state` | Moderation rules and derived tone/safety states | No | None |
| `messages` | Chat logs (optional encryption) | Partial | AES-GCM (if sensitive) |

All imported profiles must conform to **`user_profile.v1`** schema.  
Each NDJSON line is validated before storage.  
Invalid lines are rejected with **HTTP 422 (Unprocessable Entity)**.  

**Versioning:** Each core object carries a `schema_version` and migration plan.

---

## 5. Security Model
**Transport:** HTTPS enforced, HSTS enabled.  
**Authentication & Access:**  
- Short-lived JWT or Magic-Link tokens  
- `httpOnly`, `SameSite` cookies; no tokens in JS scope  
- Role-based access control (owner / participant / admin)  
- Row-level permissions verified server-side  
- Rate limiting and anomaly detection at Worker edge  

**At Rest:**  
- Server-side encryption (Cloudflare infra)  
- Application-level envelope encryption for PII  
- Regular dumps / versioned backups with restricted access  

---

## 6. Application-Level Encryption (Envelope Model)
**1. Server-Managed Encryption (default MVP)**  
- Each user has a **Data Encryption Key (DEK)**, wrapped by a **Key Encryption Key (KEK)**.  
- PII fields → AES-GCM (DEK).  
- Optional hashed side fields for lookups:  
  `email_hash = HMAC(KEK, normalized_email)`.  

**2. Optional End-to-End Encryption (future)**  
- User passphrase → derived Passkey (PBKDF2/Argon2).  
- Client-side encryption before upload.  
- Server stores only ciphertext.  

**Never log or export plaintext PII.**

---

## 7. Threats & Mitigations
| Threat | Countermeasure |
|---------|----------------|
| XSS / injection | CSP, sanitization, encoding |
| CSRF | Tokens + SameSite cookies |
| Token theft | httpOnly cookies, short TTL, rotation |
| IDOR / enumeration | Context-based access checks |
| Replay attacks | Idempotency keys on writes |
| Excessive data exposure | Strict schema validation on API ingress |

---

## 8. Compliance (GDPR / EU Data)
- **Data minimization:** store only essential fields.  
- **Consent:** explicit opt-in with timestamp.  
- **Rights:** export / correction / deletion endpoints (DSAR).  
- **Retention:** auto-delete or pseudonymize after 12 months inactivity.  
- **DPIA:** pending before launch.  
- **Data residency:** prefer EU Cloudflare region.

---

## 9. Efficiency & Performance
- Lazy load; cache non-PII in KV.  
- Paginate (50 messages per page).  
- D1 indexes: `owner_id`, `chat_id`, `created_at`.  
- Gzip / brotli compression.  
- Edge caching for static policy templates.

---

## 10. Migration Plan
**Prototype → LIVE**
- `migrateLocalToRemote()` reads `localStorage`, sends non-PII to API.  
- Server `/bulk/import` validates via JSON schema.  
- Add `profiles_version`, `meta_version` to payloads.  
- Scripts idempotent and reversible.  

**Additional**  
Prototype KV data exportable via NDJSON and re-importable into KV or D1.  
Schemas ensure forward compatibility.

---

## 11. Default MVP Assumptions

| Area | Decision |
|------|-----------|
| Encryption mode | Server-managed envelope (AES-GCM) |
| PII fields | Minimal (name optional, email if registered) |
| Lookup | `email_hash` (HMAC) |
| Region | EU (Cloudflare region stickiness) |
| Key storage | Workers Secrets, rotated regularly |
| E2EE | Optional later, toggle-ready |

---

## 12. Summary
- **Prototype:** `localStorage` + local KV namespaces, no PII, instant CRUD.  
- **LIVE:** Cloudflare D1 + KV + Workers + encryption.  
- **Security:** Envelope encryption, strict access & logging, GDPR-aligned.  
- **Scalability:** Edge-first, low latency, clear data boundaries.  
- **Future-proof:** Versioned schemas + modular adapters = safe evolution.  