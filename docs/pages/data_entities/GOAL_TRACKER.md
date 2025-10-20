# GOAL_TRACKER

## Design Purpose
Goal Tracker is the **link between intention and measurable progress** in Hi Stranger.  
It defines what the chat (or chat owner) wants to achieve — and allows both the system and the user to see **how close they are to fulfilling that intention**.  
It transforms abstract conversation aims (e.g. “deeper connection” or “creative ideation”) into **quantifiable experiences**.

### Why it exists
- **Intent Anchoring:** Every Chat Journey starts with a purpose — the Goal Tracker formalizes it.  
- **Progress Feedback:** It measures milestones, achievements, and alignment with the intended goal over time.  
- **Adaptive Moderation:** The AI moderation system (Vye) uses goal data to decide *how* to intervene or guide — e.g. whether to summarize, nudge, or deepen.  
- **Motivational Design:** Users can see how interactions contribute to their objectives — enhancing intrinsic motivation and engagement.  
- **Data Linkage:** It connects goals with Growth Metrics and Conversation Context, so learning loops can form between sessions.

### Summary
| Function | Outcome |
|-----------|----------|
| Structural | Defines purpose and measurable success for each chat |
| Analytical | Quantifies alignment between goal and conversation flow |
| Adaptive | Guides moderation tone, timing, and focus |
| Psychological | Reinforces user intent and self-awareness |
| Experiential | Creates sense of progression and closure |

---

## Overview
Tracks declared chat or user goals, measurable milestones, and outcomes derived from session analysis.  
Acts as a persistent data layer that feeds both the moderation logic and Growth Metrics.  
Goals can be created by users (chat owners), moderators, or the system.

**Base Path:** `goals.*`  
**Links:**  
- `goals.chat_id` → `chat_meta.chat_id`  
- `goals.owner_id` → `profile.identity.user_id`

---

## Fields
- **goal_id** (unique identifier)
- **chat_id** (foreign key → chat_meta.chat_id)
- **owner_id** (foreign key → profile.identity.user_id)
- **goal_type** (enum: connection / exploration / ideation / learning / reflection / support)
- **goal_title** (short label, required)
- **goal_description** (text)
- **success_criteria[]** (list of conditions or statements)
- **goal_phase** (enum: planned / active / completed / archived)
- **progress_score** (float 0–1)
- **achievement_level** (enum: low / medium / high)
- **completion_reason** (enum: goal_reached / timeout / user_exit / moderator_closure)
- **related_topics[]** (tags, linked to conversation topics)
- **milestones[]** (array of `{label, achieved, date}` objects)
- **owner_reflection** (text; optional)
- **moderator_notes** (text; optional)
- **auto_assessed_outcome** (object; results from AI analysis)
- **manual_feedback_score** (integer 1–5; user evaluation)
- **version** (integer; readonly)
- **created_at** (datetime; ISO)
- **updated_at** (datetime; ISO)

---

## Field → UI Mapping (with explicit parameter keys)

| Field Key | Control | Type | Req. | Storage Path | Options / Enum (key = label) |
|---|---|---|:--:|---|---|
| goal_id | hidden | string | ✓ | goals.goal_id | — |
| chat_id | hidden | string | ✓ | goals.chat_id | — |
| owner_id | hidden | string | ✓ | goals.owner_id | — |
| goal_type | select | string | ✓ | goals.goal_type | `connection = "Connection"<br>exploration = "Exploration"<br>ideation = "Ideation"<br>learning = "Learning"<br>reflection = "Reflection"<br>support = "Support"` |
| goal_title | text | string | ✓ | goals.goal_title | short user-defined label |
| goal_description | textarea | string | — | goals.goal_description | — |
| success_criteria | text-list | array<string> | — | goals.success_criteria | user-defined or template |
| goal_phase | select | string | ✓ | goals.goal_phase | `planned = "Planned"<br>active = "Active"<br>completed = "Completed"<br>archived = "Archived"` |
| progress_score | meter (readonly) | float | — | goals.progress_score | 0.0–1.0 |
| achievement_level | select | string | — | goals.achievement_level | `low = "Low"<br>medium = "Medium"<br>high = "High"` |
| completion_reason | select | string | — | goals.completion_reason | `goal_reached = "Goal reached"<br>timeout = "Timeout"<br>user_exit = "User exited"<br>moderator_closure = "Moderator closed"` |
| related_topics | tags | array<string> | — | goals.related_topics | topic tags |
| milestones | structured list | array<object> | — | goals.milestones | `{label, achieved, date}` |
| owner_reflection | textarea | string | — | goals.owner_reflection | Owner’s closing reflection |
| moderator_notes | textarea | string | — | goals.moderator_notes | Internal notes |
| auto_assessed_outcome | key/value | object | — | goals.auto_assessed_outcome | AI-generated metrics |
| manual_feedback_score | slider (1–5) | integer | — | goals.manual_feedback_score | user-evaluated satisfaction |
| version | number (readonly) | integer | — | goals.version | — |
| created_at | datetime (readonly) | string | — | goals.created_at | ISO |
| updated_at | datetime (readonly) | string | — | goals.updated_at | ISO |