# MODERATION_POLICY

## Design Purpose
Moderation Policy defines the **behavioral boundaries and tone adaptation rules** for Vye, the AI moderator.  
It operationalizes ethics, empathy, and safety into structured, context-sensitive rules.

### Why it exists
- **Dynamic Tone Management:** Adjusts tone per user traits and conversation phase.  
- **Safety Enforcement:** Prevents escalation, toxicity, or harm.  
- **Context Awareness:** Aligns moderation with chat goals and participant traits.  
- **Localization:** Controls language, tone, and cultural sensitivity.  
- **Auditability:** Keeps moderation explainable and rule-based.

### Summary
| Function | Outcome |
|-----------|----------|
| Structural | Framework defining all moderation decisions |
| Adaptive | Tailors behavior to tone, goal, and user profile |
| Ethical | Ensures empathy, inclusion, and content safety |
| Analytical | Feeds moderation telemetry and audit logs |

---

## Overview
Contains structured rules mapping user profiles, chat types, and goals to specific moderation strategies.  
Acts as the bridge between data-driven context and behavioral AI decisioning.

---

**Base Path:** `policy.*`  
**Links:**  
- `policy.chat_id` → `chat_meta.chat_id`  
- `policy.profile_id` → `profile.identity.user_id`

---

## Fields
- **policy_id** (unique identifier)
- **chat_id** (foreign key → chat_meta.chat_id)
- **profile_id** (foreign key → profile.identity.user_id)
- **tone_profile** (enum: neutral / warm / humorous / reflective / concise)
- **tone_adaptation** (boolean; dynamically adjust tone to mood)
- **conflict_style** (enum: direct / gentle / diplomatic / avoidant)
- **engagement_style** (enum: proactive / responsive / balanced)
- **support_strategy** (enum: empathetic / analytical / motivational / neutral)
- **humor_level** (integer 0–3)
- **ai_intervention_level** (enum: low / medium / high)
- **language_preference** (enum: match_user / match_majority / neutral)
- **topic_sensitivity_threshold** (float 0–1)
- **sentiment_balance_target** (float −1 to 1)
- **interruption_tolerance** (integer 0–5)
- **verbosity_preference** (enum: concise / balanced / elaborate)
- **reflection_depth_target** (integer 1–5)
- **allow_silent_periods** (boolean)
- **on_conflict_detected** (enum: deescalate / redirect / pause)
- **on_inactivity** (enum: summarize / nudge / remain_silent)
- **language_switch_behavior** (enum: strict / adaptive / free)
- **user_personality_alignment** (enum: mirror / complement / neutral)
- **policy_version** (integer; readonly)
- **created_at** (datetime)
- **updated_at** (datetime)

---

## Field → UI Mapping (with explicit parameter keys)

| Field Key | Control | Type | Req. | Storage Path | Options / Enum (key = label) |
|---|---|---|:--:|---|---|
| policy_id | hidden | string | ✓ | policy.policy_id | — |
| chat_id | hidden | string | ✓ | policy.chat_id | — |
| profile_id | hidden | string | ✓ | policy.profile_id | — |
| tone_profile | select | string | ✓ | policy.tone_profile | `neutral = "Neutral"<br>warm = "Warm"<br>humorous = "Humorous"<br>reflective = "Reflective"<br>concise = "Concise"` |
| tone_adaptation | toggle | boolean | — | policy.tone_adaptation | `true = "Adaptive"<br>false = "Static"` |
| conflict_style | select | string | — | policy.conflict_style | `direct = "Direct"<br>gentle = "Gentle"<br>diplomatic = "Diplomatic"<br>avoidant = "Avoidant"` |
| engagement_style | select | string | — | policy.engagement_style | `proactive = "Proactive"<br>responsive = "Responsive"<br>balanced = "Balanced"` |
| support_strategy | select | string | — | policy.support_strategy | `empathetic = "Empathetic"<br>analytical = "Analytical"<br>motivational = "Motivational"<br>neutral = "Neutral"` |
| humor_level | slider (0–3) | integer | — | policy.humor_level | 0 = None → 3 = High |
| ai_intervention_level | select | string | — | policy.ai_intervention_level | `low = "Low"<br>medium = "Medium"<br>high = "High"` |
| language_preference | select | string | — | policy.language_preference | `match_user = "Match user"<br>match_majority = "Match majority"<br>neutral = "Neutral"` |
| topic_sensitivity_threshold | slider (0–1) | float | — | policy.topic_sensitivity_threshold | 0 = Very sensitive → 1 = Very tolerant |
| sentiment_balance_target | slider (−1 to 1) | float | — | policy.sentiment_balance_target | −1 = Negative bias → +1 = Positive bias |
| interruption_tolerance | slider (0–5) | integer | — | policy.interruption_tolerance | 0 = No interruptions → 5 = Free-flow |
| verbosity_preference | select | string | — | policy.verbosity_preference | `concise = "Concise"<br>balanced = "Balanced"<br>elaborate = "Elaborate"` |
| reflection_depth_target | slider (1–5) | integer | — | policy.reflection_depth_target | 1 = Shallow → 5 = Deep |
| allow_silent_periods | toggle | boolean | — | policy.allow_silent_periods | `true = "Yes"<br>false = "No"` |
| on_conflict_detected | select | string | — | policy.on_conflict_detected | `deescalate = "De-escalate"<br>redirect = "Redirect"<br>pause = "Pause"` |
| on_inactivity | select | string | — | policy.on_inactivity | `summarize = "Summarize"<br>nudge = "Send gentle nudge"<br>remain_silent = "Remain silent"` |
| language_switch_behavior | select | string | — | policy.language_switch_behavior | `strict = "Strict"<br>adaptive = "Adaptive"<br>free = "Free"` |
| user_personality_alignment | select | string | — | policy.user_personality_alignment | `mirror = "Mirror user style"<br>complement = "Complement user"<br>neutral = "Neutral"` |
| policy_version | number (readonly) | integer | — | policy.policy_version | — |
| created_at | datetime (readonly) | string | — | policy.created_at | ISO |
| updated_at | datetime (readonly) | string | — | policy.updated_at | ISO |