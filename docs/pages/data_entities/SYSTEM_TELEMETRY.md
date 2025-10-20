# SYSTEM_TELEMETRY

## Design Purpose
System Telemetry is the **health and intelligence layer** of Hi Stranger.  
It continuously tracks runtime signals, latency, load, user flow patterns, and AI moderation performance — without storing any personally identifiable data.  
Its role is to ensure that the entire conversational experience remains **smooth, responsive, and reliable**.

### Why it exists
- **Performance Monitoring:** Detects slowdowns, connection drops, and processing spikes in real time.  
- **User Experience Assurance:** Helps identify friction points in the conversation journey (e.g. lag during moderation).  
- **AI Observability:** Tracks token usage, model latency, moderation-prompt complexity, and reasoning depth.  
- **Error Forensics:** Stores anonymized logs that help developers reproduce issues without exposing user data.  
- **Data Ethics:** Keeps telemetry strictly system-level — never tracking content or personal identifiers.

### Summary
| Function | Outcome |
|-----------|----------|
| Structural | Tracks global and session-specific runtime health |
| Analytical | Monitors latency, token use, moderation cycles |
| Diagnostic | Provides developers with context for errors |
| Preventive | Enables automated rate-limit & load-balancing logic |
| Ethical | 100 % anonymized — no user or content data retained |

---

## Overview
Records and aggregates metrics across sessions to support diagnostics, analytics, and scaling decisions.  
Can be stored locally (prototype) or streamed to a secure backend endpoint for the LIVE environment.  
All telemetry fields are system-level — **never user-identifiable**.

**Base Path:** `telemetry.*`  
**Links:**  
- `telemetry.session_id` → `chat_meta.session_id`
- `telemetry.app_version` → current deployed version

---

## Fields
- **telemetry_id** (unique identifier)
- **session_id** (foreign key → chat_meta.session_id)
- **timestamp** (datetime; ISO)
- **app_version** (string; semantic version)
- **env** (enum: prototype / staging / live)
- **latency_ms** (float; request–response roundtrip)
- **frontend_fps** (float; client-side frame rate)
- **network_status** (enum: online / degraded / offline)
- **active_users_count** (integer; real-time connected users)
- **token_usage** (object; `{input, output, total}`)
- **model_latency_ms** (float; OpenAI or moderation model latency)
- **errors[]** (array of `{code,message,stack}` objects)
- **warnings[]** (array of `{code,message}` objects)
- **event_name** (string; e.g. “moderation_cycle”, “ui_interaction”, “storage_write”)
- **event_context** (object; lightweight metadata)
- **cpu_load_pct** (float; server or worker load)
- **memory_usage_mb** (float)
- **network_rtt_ms** (float; ping round-trip time)
- **uptime_seconds** (float; since app boot)
- **is_rate_limited** (boolean)
- **queue_depth** (integer; pending moderation calls)
- **notes** (text; developer annotations)
- **version** (integer; readonly)

---

## Field → UI Mapping (for Dev-Tools Dashboard)

| Field Key | Control | Type | Req. | Storage Path | Options / Enum (key = label) |
|---|---|---|:--:|---|---|
| telemetry_id | hidden | string | ✓ | telemetry.telemetry_id | — |
| session_id | hidden | string | ✓ | telemetry.session_id | — |
| timestamp | datetime (readonly) | string | ✓ | telemetry.timestamp | ISO |
| app_version | text (readonly) | string | ✓ | telemetry.app_version | semver |
| env | select | string | ✓ | telemetry.env | `prototype / staging / live` |
| latency_ms | number | float | — | telemetry.latency_ms | — |
| frontend_fps | number | float | — | telemetry.frontend_fps | — |
| network_status | select | string | — | telemetry.network_status | `online / degraded / offline` |
| active_users_count | number | integer | — | telemetry.active_users_count | — |
| token_usage | key/value | object | — | telemetry.token_usage | `{input, output, total}` |
| model_latency_ms | number | float | — | telemetry.model_latency_ms | — |
| errors | expandable list | array<object> | — | telemetry.errors | `{code,message,stack}` |
| warnings | expandable list | array<object> | — | telemetry.warnings | `{code,message}` |
| event_name | text | string | — | telemetry.event_name | label |
| event_context | JSON viewer | object | — | telemetry.event_context | metadata |
| cpu_load_pct | number | float | — | telemetry.cpu_load_pct | — |
| memory_usage_mb | number | float | — | telemetry.memory_usage_mb | — |
| network_rtt_ms | number | float | — | telemetry.network_rtt_ms | — |
| uptime_seconds | number | float | — | telemetry.uptime_seconds | — |
| is_rate_limited | checkbox | boolean | — | telemetry.is_rate_limited | true/false |
| queue_depth | number | integer | — | telemetry.queue_depth | — |
| notes | textarea | string | — | telemetry.notes | internal |
| version | number (readonly) | integer | — | telemetry.version | — |