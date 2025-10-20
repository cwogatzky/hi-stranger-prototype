# INTERACTION_HISTORY

## Design Purpose
Interaction History represents a user’s **long-term footprint** within the Hi Stranger ecosystem.  
It records participation rates, number of sessions, engagement quality, and recurring behaviors — without including message content.

### Why it exists
- **Longitudinal Insight:** Tracks how often and how deeply a user interacts.  
- **Retention Signals:** Measures engagement patterns and social consistency.  
- **Trust Layer:** Helps moderation assess reliability (e.g., frequent disconnects).  
- **Behavioral Analytics:** Supports adaptive experiences based on activity type.  
- **Privacy Compliance:** Stores only anonymized and aggregated participation data.

### Summary
| Function | Outcome |
|-----------|----------|
| Structural | Keeps high-level record of user participation across sessions |
| Analytical | Enables frequency, engagement, and trust analysis |
| Adaptive | Feeds Growth Metrics and personalization layers |
| Ethical | No message or personal content stored |

---

## Overview
Captures abstracted interaction patterns such as number of sessions, average session duration, participation ratio, and preferred modes of interaction.  
Acts as a behavioral layer between User Profile and Growth Metrics.

---

**Base Path:** `history.*`  
**Links:** `history.user_id` → `profile.identity.user_id`

---

## Fields
- **user_id** (foreign key → User Profile)
- **total_chats** (integer, auto-increment)
- **unique_connections** (integer; total distinct users interacted with)
- **journeys_completed** (integer)
- **intro_sessions_joined** (integer)
- **average_message_length** (float)
- **average_response_time** (ms)
- **preferred_time_of_day** (derived: morning / afternoon / evening / night)
- **topics_engaged[]** (list of topic keys)
- **interaction_frequency_score** (float, normalized 0–1)
- **interaction_recency_score** (float, normalized 0–1)
- **growth_index** (composite metric combining depth, diversity, and reflection)
- **last_active_chat_id** (string; foreign key → chat_meta.id)
- **last_active_at** (datetime; ISO)
- **streak_days_active** (integer; daily consecutive sessions)
- **sentiment_balance** (float; -1 to 1; aggregated tone)
- **conversation_depth_index** (float; 0–1; average over last 5 chats)

---

## Field → UI Mapping (with explicit parameter keys)

| Field Key | Control | Type | Req. | Storage Path | Options / Enum (key = label) |
|---|---|---|:--:|---|---|
| user_id | hidden | string | ✓ | history.user_id | — |
| total_chats | number (readonly) | integer | — | history.total_chats | Auto-generated |
| unique_connections | number (readonly) | integer | — | history.unique_connections | Auto-generated |
| journeys_completed | number (readonly) | integer | — | history.journeys_completed | Auto-generated |
| intro_sessions_joined | number (readonly) | integer | — | history.intro_sessions_joined | Auto-generated |
| average_message_length | number (readonly) | float | — | history.average_message_length | Measured in characters |
| average_response_time | number (readonly) | float | — | history.average_response_time | Measured in ms |
| preferred_time_of_day | derived (readonly) | string | — | history.preferred_time_of_day | `morning / afternoon / evening / night` |
| topics_engaged | tag-list | array<string> | — | history.topics_engaged | topic keys |
| interaction_frequency_score | meter (readonly) | float | — | history.interaction_frequency_score | 0.0–1.0 |
| interaction_recency_score | meter (readonly) | float | — | history.interaction_recency_score | 0.0–1.0 |
| growth_index | composite (readonly) | float | — | history.growth_index | 0.0–1.0 |
| last_active_chat_id | hidden | string | — | history.last_active_chat_id | chat_meta.id |
| last_active_at | datetime (readonly) | string | — | history.last_active_at | ISO |
| streak_days_active | number (readonly) | integer | — | history.streak_days_active | — |
| sentiment_balance | slider (readonly) | float | — | history.sentiment_balance | -1 (negative) → +1 (positive) |
| conversation_depth_index | slider (readonly) | float | — | history.conversation_depth_index | 0–1 |