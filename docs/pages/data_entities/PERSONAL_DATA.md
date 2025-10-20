# PERSONAL_DATA (PII, ENCRYPTED)

## Design Purpose
Personal Data (PII) ensures **privacy-first storage of sensitive user information**, completely isolated from all conversational data.  
It allows Hi Stranger to comply with GDPR and data ethics requirements while maintaining personalization through linkage identifiers only.

### Why it exists
- **Legal Compliance:** Required for GDPR, CCPA, and similar data laws.  
- **Security Segregation:** Separates identifiable data from interactional data.  
- **User Rights Management:** Enables data export, deletion, and consent auditing.  
- **Minimal Surface Area:** Only the necessary fields for identification or payment.  
- **Encryption Layer:** All data encrypted at rest and in transit.

### Summary
| Function | Outcome |
|-----------|----------|
| Structural | Stores only minimal PII with encryption and consent control |
| Legal | Enables compliance with global privacy regulations |
| Ethical | Decouples identity from behavioral data |
| Operational | Supports secure authentication and account management |

---

## Overview
Contains strictly limited personally identifiable information (PII), encrypted using AES-256 or equivalent methods.  
Linked to profiles through non-reversible pseudonymized keys.

---

**Base Path:** `pii.*`  
**Links:** `pii.user_id` → `profile.identity.user_id`

---

## Fields
- **user_id** (foreign key → User Profile)  
- **email** (required)  
- **country** (ISO code)  
- **timezone** (IANA)  
- **payment_info** (tokenized; never raw PAN)  
- **consent_flags[]** (GDPR/CCPA & product consents)  
- **device_fingerprint** (optional)  
- **session_history[]** (readonly; ISO timestamps)  
- **last_login** (readonly; ISO)  
- **verification_status** (readonly; email/identity verified)  
- **account_created_at** (readonly; ISO)

---

## Field → UI Mapping (with explicit parameter keys)

| Field Key | Control | Type | Req. | Storage Path | Options / Enum (key = label) |
|---|---|---|:--:|---|---|
| user_id | hidden | string | ✓ | pii.user_id | — |
| email | email | string | ✓ | pii.email | — |
| country | select | string (enum) | — | pii.country | `DE = "Germany"<br>US = "United States"<br>GB = "United Kingdom"<br>PT = "Portugal"<br>ES = "Spain"<br>FR = "France"<br>… (ISO 3166-1 alpha-2)` |
| timezone | select | string | — | pii.timezone | `Europe/Berlin`, `Europe/Lisbon`, `UTC`, … (IANA) |
| payment_info | token (readonly in UI) | string | — | pii.payment_info | `tokenized = "PCI Token"` |
| consent_flags | checkbox-group | array<string> | — | pii.consent_flags | `gdpr_terms = "Terms accepted (GDPR)"<br>privacy_policy = "Privacy Policy accepted"<br>marketing_opt_in = "Marketing emails opt-in"` |
| device_fingerprint | text (readonly) | string | — | pii.device_fingerprint | — |
| session_history | readonly list | array<string> | — | pii.session_history | ISO timestamps |
| last_login | datetime (readonly) | string | — | pii.last_login | ISO |
| verification_status | toggle (readonly) | boolean | — | pii.verification_status | `true = "Verified"<br>false = "Not verified"` |
| account_created_at | datetime (readonly) | string | — | pii.account_created_at | ISO |