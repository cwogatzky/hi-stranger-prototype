# CONVERSATION_CONTEXT

## Design Purpose
Conversation Context is the **semantic and emotional memory** of a chat.  
It captures evolving topics, emotional tone, and contextual cues that allow moderation and summarization to feel coherent and continuous.

### Why it exists
- **Continuity:** Keeps track of conversation topics, subthreads, and transitions.  
- **Moderation Intelligence:** Provides Vye with emotional and semantic grounding.  
- **Summarization:** Enables “catch-up intros” and history-based guidance.  
- **Adaptive Flow:** Detects when participants drift off-topic or need re-centering.  
- **AI Safety:** Maintains a lightweight filtered log for contextual grounding only.

### Summary
| Function | Outcome |
|-----------|----------|
| Structural | Maintains structured memory of conversation content |
| Analytical | Supports emotion, topic, and semantic tracking |
| Adaptive | Enables continuity across moderation and phases |
| Safety | Provides filtered memory for model grounding |

---

## Overview
Stores contextual snapshots extracted from conversation logs, including topics, sentiments, user references, and moderation-relevant markers.  
Acts as the semantic bridge between Chat Meta and the moderation engine.

---

**Base Path:** `context.*`  
**Links:**  
- `context.chat_id` → `chat_meta.chat_id`  
- `context.user_ids[]` → `profile.identity.user_id`

---

## Fields
- **context_id** (unique identifier)
- **chat_id** (foreign key → chat_meta.chat_id)
- **user_ids[]** (participants)
- **active_topic** (string)
- **active_phase** (enum: introduction / exploration / reflection / closure)
- **last_messages[]** (list of last 10–20 message objects)
- **message_embeddings[]** (optional; vector data for semantic retrieval)
- **summary_cache** (text; short version of current context)
- **sentiment_avg** (float; −1 to 1)
- **tone_distribution{}** (object; e.g., `{warm:0.3,neutral:0.5,reflective:0.2}`)
- **dominant_language** (ISO)
- **dominant_speaker_id** (string)
- **engagement_index** (float 0–1)
- **off_topic_score** (float 0–1)
- **silence_duration** (integer; seconds since last message)
- **intervention_suggested** (boolean)
- **intervention_reason** (enum: inactivity / conflict / topic_loop / imbalance)
- **context_confidence** (float 0–1)
- **last_updated** (datetime; ISO)
- **version** (integer; readonly)

---

## Field → UI Mapping (with explicit parameter keys)

| Field Key | Control | Type | Req. | Storage Path | Options / Enum (key = label) |
|---|---|---|:--:|---|---|
| context_id | hidden | string | ✓ | context.context_id | — |
| chat_id | hidden | string | ✓ | context.chat_id | — |
| user_ids | token list | array<string> | ✓ | context.user_ids | user ids |
| active_topic | text | string | ✓ | context.active_topic | current discussion focus |
| active_phase | select | string | ✓ | context.active_phase | `introduction / exploration / reflection / closure` |
| last_messages | structured list (readonly) | array<object> | — | context.last_messages | recent messages with sender, timestamp, text |
| message_embeddings | binary/vector (readonly) | array<float[]> | — | context.message_embeddings | for semantic retrieval |
| summary_cache | textarea (readonly) | string | — | context.summary_cache | short summary |
| sentiment_avg | meter | float | — | context.sentiment_avg | −1 negative → +1 positive |
| tone_distribution | bar graph (readonly) | object | — | context.tone_distribution | `{neutral, warm, reflective, humorous}` |
| dominant_language | select (readonly) | string | — | context.dominant_language | ISO code |
| dominant_speaker_id | token (readonly) | string | — | context.dominant_speaker_id | user id |
| engagement_index | meter | float | — | context.engagement_index | 0.0–1.0 |
| off_topic_score | meter | float | — | context.off_topic_score | 0.0–1.0 |
| silence_duration | number (readonly) | integer | — | context.silence_duration | seconds since last user message |
| intervention_suggested | toggle (readonly) | boolean | — | context.intervention_suggested | — |
| intervention_reason | select (readonly) | string | — | context.intervention_reason | `inactivity = "Inactivity"<br>conflict = "Conflict"<br>topic_loop = "Topic repetition"<br>imbalance = "Speaking imbalance"` |
| context_confidence | meter | float | — | context.context_confidence | 0.0–1.0 |
| last_updated | datetime (readonly) | string | — | context.last_updated | ISO |
| version | number (readonly) | integer | — | context.version | — |