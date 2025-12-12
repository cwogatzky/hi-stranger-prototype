# 🧠 HI STRANGER — AI MODERATION MEMORY MODEL  
_Version: 2025-10-19 | Draft 1.2 (clarified proactive moderation logic)_

---

## 🎯 Purpose
Defines how the moderation AI stores, updates, and retrieves context —  
to achieve **maximum conversational intelligence with minimal token usage.**  
Unlike traditional "backstage" systems, the Hi Stranger AI acts as a **situational moderator** —  
it recognizes when a conversation needs guidance, **steps in dynamically**, and **leads with context-aware precision** whenever human flow stalls, drifts, or derails.

---

## 🧩 1. Core-Principles

| Principle | Description |
|------------|-------------|
| **Persistence over redundancy** | Store state (KV / D1) instead of resending full context each call. |
| **Rolling summaries** | Compress chat history into short periodic summaries. |
| **Delta updates** | Send only profile or state changes to the AI. |
| **Model tiering** | Use lightweight models for routine tasks (translation, tagging). |
| **Session memory** | Each chat has a persistent memory object (`session:<chat_id>`). |
| **Schema enforcement** | Responses follow strict Zod schemas → fewer retries & token waste. |
| **Contextual proactivity** | The AI doesn’t wait for escalation — it anticipates conversational friction, helps refocus, and keeps users aligned with the shared goal. |

---

### 1.1 Moderation Operating Model (Intervention Ladder)

The AI acts as an **intelligent co-moderator** — both **observing silently** when flow is healthy  
and **actively intervening** when the chat loses coherence, purpose, or balance.

| Level | Mode | Description |
|-------|------|-------------|
| **0 – Silent Observation** | Passive | Tracks dynamics, sentiment, and topic drift; logs signals only. |
| **1 – Subtle Guidance** | Soft proactive | Inserts hints or UI cues (“want to circle back?”, “new question?”). |
| **2 – Conversational Steering** | Moderate | Posts short, human-style summaries or reflective questions to refocus. |
| **3 – Norms & Balance** | Corrective | Gently reminds users of tone, equality, or topic relevance. |
| **4 – Boundary & Escalation** | Protective | Intervenes directly or alerts the owner if boundaries are crossed. |

**Moderation goals:**
- Maintain **momentum** (avoid silence or stuck loops).  
- Preserve **alignment** (keep conversation on its shared goal).  
- Reinforce **tone and fairness** (no dominance or exclusion).  
- Balance **AI visibility** — the AI appears when *needed*, not constantly.  

---

### 1.2 Signals (what the AI watches)

Each signal is normalized to **0–1** and tracked in real time.  
The AI uses weighted thresholds to decide when a proactive action is justified.

- `silence` – inactivity or halted response flow  
- `offtopic` – topic drift vs `active_topic`  
- `confusion` – rising contradiction or unclear references  
- `dominance` – imbalance between participants  
- `tension` – argument frequency or polarity in tone  
- `repetition` – circular argument loops  
- `goal_drift` – deviation from the session’s target outcome  
- `engagement_drop` – declining message participation  
- `sentiment_decay` – shift toward negativity or disengagement  

> Signals feed a scoring matrix that determines whether the AI should stay silent, nudge, or steer the chat forward.

---

### 1.3 Action Taxonomy & Response Schema

Allowed actions (validated via Zod):

- `silent_log`  
- `suggest_ui` (small guidance hints)  
- `summarize_and_refocus` (recap + direction)  
- `pose_reflective_question` (help users deepen discussion)  
- `invite_quiet_user` (balance voices)  
- `norms_reminder` (soft tone correction)  
- `boundary_enforcement` (firm redirect or stop)  
- `escalate_to_owner` (handover to human moderation)

```ts
const ModActionSchema = z.object({
  action: z.enum([
    'silent_log','suggest_ui','summarize_and_refocus','pose_reflective_question',
    'invite_quiet_user','norms_reminder','boundary_enforcement','escalate_to_owner'
  ]),
  level: z.number().int().min(0).max(4),
  reason: z.string(),
  targets: z.array(z.string()).optional(),
  content: z.object({
    summary: z.string().optional(),
    prompt: z.string().optional(),
    ui_suggestion: z.string().optional()
  }).default({}),
  cooldown_sec: z.number().int().default(120)
});
```

---

### 1.4 Decision Policy (scoring + cooldowns)

- Compute a **score per action** from relevant signals:

  ```
  score_refocus = 0.5*offtopic + 0.3*goal_drift + 0.2*confusion
  score_reflective_question = 0.4*silence + 0.3*engagement_drop + 0.3*confusion
  score_invite = 0.5*dominance + 0.5*silence
  score_norms = 0.6*tension + 0.4*sentiment_decay
  ```

- When a score exceeds threshold (e.g., 0.7) and the cooldown has expired → trigger corresponding action.  
- If multiple actions exceed threshold, priority:  
  `boundary_enforcement > norms_reminder > summarize_and_refocus > pose_reflective_question > invite_quiet_user > suggest_ui`.  
- **Dynamic weighting:** thresholds rise temporarily after each intervention to prevent overactivity.

---

### 1.5 UI/UX Patterns (how actions surface)

- **Inline summaries:** appear naturally in chat flow, visually distinct but human-like.  
- **Chips / prompts:** optional, ephemeral UI buttons.  
- **Reflective follow-ups:** phrased as open, inclusive questions.  
- **Invisible cooldowns:** prevent over-moderation.  
- **Owner moderation assist:** allows human moderator to post AI suggestions manually.  

The AI should *feel like a presence*, not a system message — guiding the vibe, not dominating it.

---

## 🧮 2. Data Schemas

**User Profile**
```ts
{
  "id": "user123",
  "name": "Anna",
  "language": "de",
  "traits": ["reflective", "curious"],
  "topics": ["travel", "art"],
  "tone": "warm"
}
```

**Room State**
```ts
{
  "chat_id": "chat_001",
  "phase": "topic_core",
  "active_topic": "Meaningful connections",
  "target_outcome": "mutual insight",
  "participants": ["Anna", "Carlos"]
}
```

**Memory Object**
```ts
{
  "session_id": "chat_001",
  "profiles": [...],
  "summaries": [
    {"t": "2025-10-18T09:00Z", "content": "Short recap of last phase."}
  ],
  "signals": [
    {"type": "silence", "value": 0.6},
    {"type": "offtopic", "value": 0.3}
  ]
}
```

---

## ⚙️ 3. Operational Flow

1. **Chat Start**  
   - Load `session:<chat_id>` from KV.  
   - Inject latest summary + profile delta into setup prompt.  
   - Keeps initialization under ~1–2k tokens.

2. **Chat Loop**  
   - Worker logs live signals and token usage.  
   - Every N messages, create rolling summary (200–400 tokens).  
   - If `goal_drift` or `tension` crosses threshold → partial prompt update + AI steering.  
   - Older turns archived as compressed summaries.

3. **Chat End**  
   - Generate final summary (500–700 tokens).  
   - Update profiles (`last_active`, `topics_new`).  
   - Persist to `profiles:<user_id>` and `sessions:<chat_id>`.

---

## 🧠 4. Token Optimization Techniques

| Technique | Expected Savings | Description |
|------------|------------------|--------------|
| Rolling summaries | 40–60 % | Replace full 30k-token history with 3×400-token recaps. |
| Delta profiles | 20–30 % | Only changed profile fields transmitted. |
| Tiered models | 30–70 % | GPT-3.5 for monitoring, GPT-4-Turbo for intervention logic. |
| Session cache | 15–25 % | Prompt-hash caching prevents redundant setup. |
| Local heuristics | 10–15 % | Silence/off-topic detection runs client-side. |

---

## 🔍 5. Prompt Structure

**System Prompt**
> “You are an intelligent conversational moderator.  
> You monitor the ongoing chat and intervene only when flow slows, drifts, or escalates.  
> Guide participants gently toward their shared goal.  
> Respond only with JSON following `ModActionSchema`. Avoid redundancy.  
> Keep public interventions concise, warm, and inclusive.”

**Context Payload**
```json
{
  "room_state": {...},
  "recent_summary": "...",
  "new_messages": [...],
  "signals": {"silence":0.4,"goal_drift":0.6},
  "delta_profiles": {"Anna": {"topics":["travel"]}}
}
```

**Response**
```json
{
  "action": "pose_reflective_question",
  "reason": "participants lost momentum",
  "prompt": "It feels like we’ve paused for a moment — what stands out most to each of you so far?",
  "cooldown_sec": 180
}
```

---

### 5.1 Prompt Guardrails

- Always return **JSON-only** conforming to `ModActionSchema`.  
- Public interventions limited to: `summarize_and_refocus`, `pose_reflective_question`, `norms_reminder`, `boundary_enforcement`.  
- Max 2 sentences per visible message.  
- Prefer `suggest_ui` when in doubt or if multiple triggers overlap.  
- Respect cooldowns and keep the tone **calm, neutral, and human-like.**

---

## 📦 6. Storage Architecture

| Component | Storage | Purpose |
|------------|----------|----------|
| `PROFILES_KV` | KV | user profiles and preferences |
| `SESSION_KV` | KV | active chat memory |
| `SUMMARIES_D1` | SQL | compressed chat summaries |
| `ACTIONS_KV` | KV | last AI actions (debug / replay) |

---

## 🔧 7. Debug & Testing

- **Shadow Mode:** AI generates but does not post actions.  
- **Signal Dashboard:** real-time visualization of silence/offtopic/goal_drift.  
- **Token Counter:** tracks model usage and savings.  
- **Diff Log:** shows delta between prompt context and AI response.  
- **Version Control:** each decision logs `prompt_version` + `schema_version`.

---

## 🔮 8. Target State

A proactive yet cost-efficient AI that:
- detects when a chat loses focus or energy,  
- re-aligns participants gently and contextually,  
- uses memory intelligently to minimize token load,  
- and **balances presence with restraint** —  
creating the world’s first truly *intelligent conversational moderator.*

---

**Maintainer:** _Hi Stranger Core Team_  
**Last updated:** 19 Oct 2025
