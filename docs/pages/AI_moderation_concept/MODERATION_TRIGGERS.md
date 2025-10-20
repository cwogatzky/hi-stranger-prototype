# MODERATION_TRIGGERS  
_Version: Draft 1.0 – Combined Passive & Active Trigger Logic_

---

## 🧩 Overview
Moderation Triggers define **when** and **how** the AI moderator (“Vye”) activates.  
They are divided into two major types:

- **Passive Triggers** → system-detected, based on conversation signals  
- **Active Triggers** → user-initiated, typically by the Chat Owner via UI controls  

Both operate within a shared priority and cooldown framework to maintain balance and prevent over-moderation.

---

## 🧠 1. Passive Triggers (AI-detected, system-driven)

These triggers are automatically activated when specific conversational signals or thresholds are met.  
They determine **when Vye intervenes** and what type of moderation action is appropriate.

| Category | Trigger | Detection Logic / Description | Typical Action |
|-----------|----------|-------------------------------|----------------|
| **Flow** | `silence_timeout` | No new message for X seconds | `pose_reflective_question` |
| | `offtopic_drift` | Semantic distance > 0.7 from current topic | `summarize_and_refocus` |
| | `looping_discussion` | Repetition of same arguments > 3× | `suggest_ui:new_angle` |
| **Tone / Balance** | `dominance_score` | One user speaks > 70 % of turns | `invite_quiet_user` |
| | `tension_rise` | Sentiment polarity < –0.4 | `norms_reminder` |
| | `sentiment_decay` | Gradual negativity across 5+ messages | `pose_reflective_question` |
| **Ethics / Boundaries** | `policy_violation` | Detected rule breach (toxicity, discrimination) | `boundary_enforcement` *(shadow / live)* |
| | `safety_flag` | Sensitive content (PII, triggers, unsafe themes) | `pause_chat` / `escalate_to_owner` |
| **Meta** | `goal_drift` | Chat diverges from defined goal > 0.6 | `summarize_and_refocus` |
| | `phase_inactivity` | No progress within current phase | `suggest_ui:next_phase` |
| | `low_engagement` | All participants < 30 % speaking ratio | `invite_reflection` |

These are continuously evaluated within the Decision-Matrix scoring model (see *AI Moderation Memory Model*).

---

## ⚙️ 2. Active Triggers (User-initiated)

Active triggers are explicit commands or UI actions performed by the **Chat Owner** or, in some cases, participants.  
They give users **direct control** over the moderation engine.

| Category | Trigger | Access | Description / Output |
|-----------|----------|---------|----------------------|
| **Owner Assist** | `request_summary` | Owner | “Give me a neutral summary of the chat so far.” |
| | `request_sentiment_overview` | Owner | Returns tone & balance status (positive / neutral / tense). |
| | `request_direction` | Owner | “How can I steer this chat toward [X]?” |
| | `request_suggestion` | Owner | Suggests next questions or discussion angles. |
| | `start_new_intro` | Owner | Restarts intro round for newcomers. |
| | `trigger_reflection_phase` | Owner | Forces transition into reflection / closure phase. |
| **System Support** | `ai_explain_action` | Owner | Explains why a moderation action was taken (transparency). |
| | `ai_toggle_visibility` | Owner | Shows / hides Vye’s interventions from participants. |
| **User Level** | `ask_ai` | Any participant | Directly ask Vye a question or for clarification. |
| | `flag_content` | Any participant | Flags a message for review or moderation audit. |

---

## 🔁 3. Control & Priority Logic

Both Passive and Active triggers operate under a shared scheduling system:

| Rule | Description |
|------|--------------|
| **Passive → Automatic** | Triggered through continuous signal scoring and cooldown validation. |
| **Active → Owner Priority** | Overrides cooldowns and executes immediately. |
| **Trigger Queue System** | All triggers feed into a unified queue with prioritized processing. |
| **Priority Order** | `Owner > Safety > Tone > Flow` |
| **Cooldown Enforcement** | Prevents identical action types from repeating within their defined cooldown window. |
| **Telemetry Integration** | Every trigger logs an event to `SESSION_LOGS` and `SYSTEM_TELEMETRY` with `event_name`, `trigger_type`, and timestamp. |

---

## 🧩 4. Integration Summary
- Passive triggers maintain conversational flow and safety autonomously.  
- Active triggers empower the Owner to guide or query the moderation engine.  
- Both feed into the **Decision Matrix** and respect tone, phase, and policy rules.  
- This dual-trigger model balances **autonomy**, **control**, and **transparency**, giving the AI a situational presence while keeping human oversight intact.

---