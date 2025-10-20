# SESSION_LOGS

## Design Purpose
Session Logs provide the **operational record** of what occurred during a chat — messages, actions, and system events — in a structured, developer-friendly format.  
They form the technical foundation for debugging, analysis, and replay.

### Why it exists
- **Debugging:** Enables reconstruction of technical issues and errors.  
- **Transparency:** Documents message flow and moderation interventions.  
- **AI Evaluation:** Supplies anonymized data for improvement of AI behavior.  
- **Compliance:** Supports audit trails for content review under data policies.  
- **Analytics:** Offers a basis for performance and topic modeling.

### Summary
| Function | Outcome |
|-----------|----------|
| Structural | Stores session-level message and event data |
| Analytical | Feeds AI tuning and moderation performance evaluation |
| Diagnostic | Enables developer debugging and audit replay |
| Ethical | Content anonymized, personally detached |

---

## Overview
Captures all non-PII operational logs, including message timestamps, user references (hashed), system actions, moderation events, and summary tokens.  
Works as the central bridge between user-visible chat flow and backend observability.

---

**Base Path:** `logs.*`  
**Links:**  
- `logs.chat_id` → `chat_meta.chat_id`  
- `logs.user_id` → `profile.identity.user_id` (optional)  
- `logs.policy_id` → `policy.policy_id` (optional)

---

## Fields
- **log_id** (unique identifier)
- **chat_id** (foreign key → chat_meta.chat_id)
- **user_id** (optional; actor)
- **event_type** (enum: message_sent / moderation_action / policy_update / error / system)
- **event_source** (enum: user / ai / system)
- **timestamp** (datetime; ISO)
- **duration_ms** (integer; duration of event in milliseconds)
- **latency_ms** (integer; delay before response)
- **token_count_in** (integer; input tokens used)
- **token_count_out** (integer; output tokens generated)
- **payload_size_bytes** (integer)
- **status** (enum: success / warning / error)
- **metadata{}** (object; contextual info)
- **moderation_action_type** (optional; e.g., `nudge`, `summary`, `redirect`)
- **message_reference_id** (optional; message id linked to this log)
- **error_code** (optional)
- **error_message** (optional)
- **trace_id** (unique trace identifier for grouped events)
- **session_step** (integer; chronological sequence)
- **version** (integer; readonly)

---

## Field → UI Mapping (with explicit parameter keys)

| Field Key | Control | Type | Req. | Storage Path | Options / Enum (key = label) |
|---|---|---|:--:|---|---|
| log_id | hidden | string | ✓ | logs.log_id | — |
| chat_id | hidden | string | ✓ | logs.chat_id | — |
| user_id | hidden | string | — | logs.user_id | — |
| event_type | select | string | ✓ | logs.event_type | `message_sent = "Message sent"<br>moderation_action = "Moderation action"<br>policy_update = "Policy update"<br>error = "Error"<br>system = "System event"` |
| event_source | select | string | ✓ | logs.event_source | `user = "User"<br>ai = "AI"<br>system = "System"` |
| timestamp | datetime | string | ✓ | logs.timestamp | ISO |
| duration_ms | number (readonly) | integer | — | logs.duration_ms | Duration in ms |
| latency_ms | number (readonly) | integer | — | logs.latency_ms | Delay before response |
| token_count_in | number (readonly) | integer | — | logs.token_count_in | Input tokens |
| token_count_out | number (readonly) | integer | — | logs.token_count_out | Output tokens |
| payload_size_bytes | number (readonly) | integer | — | logs.payload_size_bytes | Payload size in bytes |
| status | select | string | ✓ | logs.status | `success / warning / error` |
| metadata | key/value inspector | object | — | logs.metadata | structured contextual data |
| moderation_action_type | text | string | — | logs.moderation_action_type | e.g., "nudge" |
| message_reference_id | text | string | — | logs.message_reference_id | linked message id |
| error_code | text | string | — | logs.error_code | optional |
| error_message | textarea | string | — | logs.error_message | optional |
| trace_id | text | string | — | logs.trace_id | trace group identifier |
| session_step | number (readonly) | integer | — | logs.session_step | event order index |
| version | number (readonly) | integer | — | logs.version | schema version |