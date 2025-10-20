# 🔐 PROTOTYPE_SECURITY_PRIVACY.md  
_Version: 1.4 — Last updated: 16 Oct 2025_  
_Patch Notes:_ Added KV/local sync reference, Access JWT verification note, and audit-log retention policy._

---

## Cloudflare Access & Authentication Setup
**Project:** Hi Stranger Prototype  
**Scope:** Password-protected live deployment on Cloudflare Pages  
**Author:** Carsten Wogatzky  
**Date:** October 2025  

---

## 🔐 Overview
The live prototype (`prototype.histrangerapp.ai`) and its source deployment (`histrangerprototype.pages.dev`) are protected via **Cloudflare Zero Trust Access**.  
Access control is handled by Cloudflare’s managed authentication layer instead of application-side login logic.

---

## ⚙️ Local Development Security
Local development runs entirely offline using Wrangler’s built-in KV emulation, allowing isolated testing without sending data to the live environment.

**Local Mode Details**
- Command: `wrangler pages dev ./ --local`  
- KV namespaces:  
  - `PROFILES_KV` → Stores demo user profiles  
  - `IMPORT_REPORT_KV` → Stores validation and import logs  
  - `IDEMPOTENCY_KV` → Prevents duplicate writes  
- All local data contains **no PII** and can be deleted safely:  
  ```bash
  rm -rf .wrangler
  wrangler pages dev ./ --local
  ```  
- **KV/local sync** occurs automatically on boot to mirror prototype persistence.  

These namespaces are resettable and exist only for prototype simulation.

---

## 🧱 Architecture Summary
| Component | Purpose | Notes |
|------------|----------|-------|
| **Cloudflare Pages** | Hosts static site (HTML + JS + assets) | Deployed via manual upload (no Git). |
| **Custom Domain** | `prototype.histrangerapp.ai` | CNAME → `histrangerprototype.pages.dev` |
| **Cloudflare Zero Trust (Access)** | Authentication & authorization | Protects both domains. |
| **Team Domain** | `hi-stranger.cloudflareaccess.com` | Central auth endpoint for all apps |

---

## 🧩 Setup Steps
*(unchanged from v1.3)*  
(1 Cloudflare Pages Deployment, 2 Custom Domain Mapping, 3 Zero Trust Access Configuration, 4 Session Behavior)

---

## 🔐 Data Handling & Encryption
Hi Stranger follows the **Envelope Encryption Model** defined in `DATA_STORAGE_CONCEPT.md`.

- DEK / KEK hierarchy (AES-GCM)  
- PII encrypted; non-PII plain (KV or D1)  
- No plaintext PII logged or exported  
- Keys rotated via Worker Secrets  
- **Worker endpoints reject unauthenticated POST requests**; Access JWT verification is handled by Cloudflare before invocation.  

For prototype data, all profile and meta information is non-PII and unencrypted by design.

---

## 🧾 API Validation & Audit Logging
All data written through `/api/profiles/import` undergoes strict validation:  
- Must match `user_profile.v1` schema  
- Invalid payloads → `HTTP 422`  
- Valid payloads → Audit entry in `IMPORT_REPORT_KV` with: ID, timestamp, checksum, result  
- **Audit logs auto-purge after 30 days**

Ensures traceability without storing credentials.

---

## ⚖️ Version Control & Compliance
- Versioned schemas (`user_profile.v1`) ensure forward compatibility  
- PII / non-PII stored in separate layers (D1 vs. KV)  
- GDPR alignment: explicit consent, no analytics in prototype, DPIA planned for production  

---

✅ `prototype.histrangerapp.ai` and `histrangerprototype.pages.dev` are fully protected by Cloudflare Zero Trust.  
Only whitelisted emails can access them; no user data is stored inside the app itself.

**Maintainer:** Carsten Wogatzky  
**Last Verified:** 16 Oct 2025