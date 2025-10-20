# CHAT_META

## Design Purpose
Chat Meta defines the **structural identity and configuration** of each conversation.  
It captures ownership, participants, goals, and active parameters — forming the metadata backbone for all chat-related entities.  
Every Chat Journey starts with a Chat Meta record that anchors its scope, purpose, and participants.

### Why it exists
- **Session Context:** Provides a persistent root reference for all conversation data.  
- **Ownership Definition:** Identifies the chat owner and type (1:1, group, event).  
- **Moderation Context:** Supplies key configuration for tone, depth, and translation.  
- **Analytical Linking:** Enables relational joins across logs, goals, and profiles.  
- **Lifecycle Management:** Tracks chat state (active, paused, closed, archived).

### Summary
| Function | Outcome |
|-----------|----------|
| Structural | Defines the boundaries and identity of a chat |
| Analytical | Connects all entities referencing the same conversation |
| Operational | Enables lifecycle tracking and moderation configuration |
| Experiential | Anchors ownership and purpose for consistent behavior |

---

## Overview
Holds essential identifiers and runtime metadata for a conversation, serving as the root node for entities like Conversation Context, Goal Tracker, and Moderation Policy.  
Without Chat Meta, no other chat-related entities can exist.

---

**Base Path:** `chat_meta.*`  
**Links:**  
- `chat_meta.owner_id` → `profile.identity.user_id`  
- `chat_meta.participant_ids[]` → `profile.identity.user_id`

---

## Fields
- **chat_id** (unique identifier)
- **owner_id** (user who initiated the chat)
- **participant_ids[]** (array of users in the chat)
- **chat_type** (enum: one_on_one / group)
- **goal** (text, required)
- **description** (text, optional)
- **languages[]** (array of ISO codes used in chat)
- **created_at** (datetime)
- **last_active_at** (datetime)
- **status** (enum: active / paused / closed)
- **moderation_stage** (enum: intro / ongoing / reflection / finished)
- **topic_stack[]** (array of current and past topics)
- **success_metrics[]** (array of goals/outcomes defined by owner)
- **rules[]** (list of explicit conversation rules)
- **owner_actions[]** (array of permitted owner actions)
- **moderator_actions[]** (array of permitted moderator actions)
- **session_duration** (integer; seconds)
- **auto_topic_switch** (boolean)
- **language_matching** (boolean)
- **contextual_suggestions** (boolean)
- **translation_logic** (enum: single / dual / mixed)
- **moderation_tone** (enum: neutral / warm / reflective / concise)
- **active_topic** (string)
- **phase** (enum: introduction / exploration / synthesis / closure)

---

## Field → UI Mapping (with explicit parameter keys)

| Field Key | Control | Type | Req. | Storage Path | Options / Enum (key = label) |
|---|---|---|:--:|---|---|
| chat_id | hidden | string | ✓ | chat_meta.chat_id | — |
| owner_id | hidden | string | ✓ | chat_meta.owner_id | — |
| participant_ids | token list | array<string> | ✓ | chat_meta.participant_ids | User IDs |
| chat_type | radio | string | ✓ | chat_meta.chat_type | `one_on_one = "One-on-One"<br>group = "Group"` |
| goal | textarea | string | ✓ | chat_meta.goal | — |
| description | textarea | string | — | chat_meta.description | — |
| languages | multiselect | array<string> | ✓ | chat_meta.languages | ISO codes (`de`, `en`, `es`, `pt`, …) |
| created_at | datetime (readonly) | string | ✓ | chat_meta.created_at | ISO |
| last_active_at | datetime (readonly) | string | — | chat_meta.last_active_at | ISO |
| status | select | string | ✓ | chat_meta.status | `active = "Active"<br>paused = "Paused"<br>closed = "Closed"` |
| moderation_stage | select | string | ✓ | chat_meta.moderation_stage | `intro = "Introduction"<br>ongoing = "Ongoing"<br>reflection = "Reflection"<br>finished = "Finished"` |
| topic_stack | tag-list | array<string> | — | chat_meta.topic_stack | ordered list of topic strings |
| success_metrics | tag-list | array<string> | — | chat_meta.success_metrics | owner-defined |
| rules | text-list | array<string> | — | chat_meta.rules | one rule per line |
| owner_actions | checkbox-group | array<string> | — | chat_meta.owner_actions | `start_intro = "Start new intro"<br>end_session = "End session"<br>pause_chat = "Pause chat"` |
| moderator_actions | checkbox-group | array<string> | — | chat_meta.moderator_actions | `nudge = "Send nudge"<br>summarize = "Send summary"<br>suggest_topic = "Suggest topic"` |
| session_duration | number (readonly) | integer | — | chat_meta.session_duration | in seconds |
| auto_topic_switch | toggle | boolean | — | chat_meta.auto_topic_switch | `true = "Enabled"<br>false = "Disabled"` |
| language_matching | toggle | boolean | — | chat_meta.language_matching | `true = "Enabled"<br>false = "Disabled"` |
| contextual_suggestions | toggle | boolean | — | chat_meta.contextual_suggestions | `true = "Enabled"<br>false = "Disabled"` |
| translation_logic | select | string | — | chat_meta.translation_logic | `single = "Single"<br>dual = "Dual"<br>mixed = "Mixed"` |
| moderation_tone | select | string | — | chat_meta.moderation_tone | `neutral = "Neutral"<br>warm = "Warm"<br>reflective = "Reflective"<br>concise = "Concise"` |
| active_topic | text | string | — | chat_meta.active_topic | current focus topic |
| phase | select | string | — | chat_meta.phase | `introduction / exploration / synthesis / closure` |