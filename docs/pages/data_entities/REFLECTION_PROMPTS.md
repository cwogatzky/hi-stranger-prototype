# REFLECTION_PROMPTS

## Design Purpose
Reflection Prompts are the **bridge between conversation and growth** in Hi Stranger.  
They mark the transition from active dialogue to **self-awareness and emotional closure**, turning each chat into a complete “Journey” rather than an exchange of messages.

### Why they exist
- **Emotional Processing:** They invite users to pause, reflect, and articulate what they discovered or felt.  
- **Growth Signals:** Responses feed the Growth Metrics engine — enabling measurement of empathy, clarity, vulnerability, and self-awareness.  
- **Adaptive Moderation:** The moderation AI (Vye) uses reflection patterns to adjust tone, depth, and topic suggestions in later sessions.  
- **Narrative Structure:** Reflection Prompts define the **Reflection → Closure** phases of a Chat Journey, giving every conversation a natural end and continuity into the next one.  
- **User Feedback Loop:** Over time, they form a personal reflection log, allowing users to see how their perspectives evolve.

### Summary
| Function | Outcome |
|-----------|----------|
| Structural | Defines Reflection + Closure phase |
| Psychological | Encourages self-understanding & emotional processing |
| Analytical | Feeds Growth Metrics and behavior modeling |
| Adaptive | Tunes future moderation & personalization |
| Experiential | Provides meaningful closure and long-term insight |

---

## Overview
Holds curated reflection questions and runtime-issued prompts used to deepen conversations and generate signals for Growth Metrics.  
Supports scheduling, targeting (by user traits or chat phase), and multilingual text.

**Base Path:** `reflection.*`  
**Links:**  
- `reflection.chat_id` → `chat_meta.chat_id`  
- `reflection.user_id` → `profile.identity.user_id` (targeted recipient)  
- `reflection.issued_by` → `"system" | "moderator" | user_id`

---

## Fields
- **prompt_id** (unique identifier)
- **chat_id** (optional; if session-specific)
- **user_id** (optional; if directed to a specific user)
- **title** (short label)
- **body** (full prompt text; i18n supported)
- **language** (ISO code; e.g., `en`, `de`, `es`, `pt`)
- **tags[]** (topic labels; e.g., `trust`, `values`, `goals`)
- **phase** (enum: introduction / exploration / reflection / closure)
- **target_traits[]** (optional; e.g., `analytical`, `calm`, `humorous`)
- **difficulty** (enum: light / medium / deep)
- **response_type** (enum: free_text / scale_1_5 / choices)
- **choices[]** (when `response_type = choices`; array of `{key,label}`)
- **issued_by** (enum: system / moderator / user_id)
- **issued_at** (datetime; ISO)
- **due_at** (optional; ISO)
- **status** (enum: pending / answered / skipped)
- **answer_text** (when free_text)
- **answer_scale** (when scale_1_5; integer 1–5)
- **answer_choice_key** (when choices; string key)
- **answer_language** (ISO; detected or set)
- **signals{}** (optional; extracted analytics)
- **notes** (moderator/system notes)
- **version** (integer; schema/content version)

---

## Field → UI Mapping (with explicit parameter keys)

| Field Key | Control | Type | Req. | Storage Path | Options / Enum (key = label) |
|---|---|---|:--:|---|---|
| prompt_id | hidden | string | ✓ | reflection.prompt_id | — |
| chat_id | hidden | string | — | reflection.chat_id | — |
| user_id | hidden | string | — | reflection.user_id | — |
| title | text | string | ✓ | reflection.title | short label |
| body | textarea | string | ✓ | reflection.body | i18n supported |
| language | select | string | ✓ | reflection.language | `en = "English"<br>de = "German"<br>es = "Spanish"<br>pt = "Portuguese"` |
| tags | tags | array<string> | — | reflection.tags | topic labels |
| phase | select | string | — | reflection.phase | `introduction / exploration / reflection / closure` |
| target_traits | multiselect | array<string> | — | reflection.target_traits | `analytical / calm / humorous / empathetic / reflective / direct / diplomatic` |
| difficulty | radio | string | — | reflection.difficulty | `light = "Light"<br>medium = "Medium"<br>deep = "Deep"` |
| response_type | select | string | ✓ | reflection.response_type | `free_text = "Free text"<br>scale_1_5 = "Scale 1–5"<br>choices = "Multiple choice"` |
| choices | key/label editor | array<object> | — | reflection.choices | Only if `response_type = choices` |
| issued_by | select | string | — | reflection.issued_by | `system = "System"<br>moderator = "Moderator"<br>user = "User (by id)"` |
| issued_at | datetime (readonly) | string | ✓ | reflection.issued_at | ISO |
| due_at | datetime | string | — | reflection.due_at | ISO |
| status | select | string | ✓ | reflection.status | `pending = "Pending"<br>answered = "Answered"<br>skipped = "Skipped"` |
| answer_text | textarea | string | — | reflection.answer_text | only if free text |
| answer_scale | slider (1–5) | integer | — | reflection.answer_scale | only if scale 1–5 |
| answer_choice_key | select | string | — | reflection.answer_choice_key | only if choices |
| answer_language | select | string | — | reflection.answer_language | ISO |
| signals | key/value inspector | object | — | reflection.signals | `{depth, positivity, clarity, …}` |
| notes | textarea | string | — | reflection.notes | internal |
| version | number (readonly) | integer | — | reflection.version | — |