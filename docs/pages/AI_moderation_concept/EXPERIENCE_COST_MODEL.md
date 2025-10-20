# 🧭 HI STRANGER — EXPERIENCE COST MODEL  
_Version: 2025-10-18 | Draft 1.3 (complete; includes Ad & Journey logic, budget modes, KPIs & EAD governor)_

---

## 🎯 Purpose
This document defines how **user experience**, **AI token cost**, and **monetization** interact inside the Hi Stranger chat system.  
The goal is to maintain a **smooth, scalable, and financially efficient** experience that adapts dynamically to usage intensity, token spending, and engagement — without degrading conversational flow.

---

## 💰 1. Cost Sources

| Phase | Process | Description | Cost Type | Frequency |
|------|---------|-------------|-----------|-----------|
| A. Profiling | Profile creation / update | Short AI check or tagging | one-time | rare |
| B. Chat Setup | Context build-up | Initial prompt (profiles, goal, phase) | high | per chat |
| C. Chat Loop | Moderation / translation / summarization | Continuous token cost | ongoing | frequent |
| D. Chat End | Summary & profile update | Wrap-up operation | medium | per chat |
| E. Debug | Shadow mode / analysis | Development only | optional | rare |

---

## 📊 2. Core Metrics

| Metric | Description | Source |
|--------|-------------|--------|
| `tokens_in`, `tokens_out` | Tokens per turn | OpenAI headers |
| `token_cost_usd` | Price per model | internal table |
| `ads_shown` | Ads × users | frontend |
| `ads_revenue_usd` | CPM × ads_shown / 1000 | calculation |
| `credits_used` | Chat credits (user fee) | backend |
| `session_balance` | `ads_revenue + credits - token_costs` | dashboard |
| `experience_mode` | Full / Balanced / Low-Frequency | system |

---

## ⚙️ 3. Technical Principles

1. **Token Logging Worker** — collects per-chat token usage from OpenAI headers.  
2. **Cost Analyzer Script** — multiplies token usage × model cost and writes `session_balance`.  
3. **Ad Trigger** — shows subtle ad banners when balance < 0.  
4. **Budget Visualizer** — displays live budget, credits, and efficiency meter.  
5. **Model Switcher** — automatically downgrades models (GPT-4 → GPT-3.5) when budget is tight.

---

## 🧮 4. Example Calculation

| Parameter | Value |
|-----------|-------|
| 3 users × 30 turns | 90 user turns |
| ~800 tokens per turn | 72,000 total |
| GPT-4-Turbo ($0.01 / 1K) | ≈ $0.72 per chat |
| CPM $4 | Break-even ≈ 180 ad impressions |
| Result | ~60 ads per user or €1 entry fee covers session |

---

## ⚖️ 5. Experience Balance

- **Experience First:** no ads as long as budget > 5 %.  
- **Dynamic Compensation:** ads or credit reminders only when balance drops.  
- **Fail-Safe:** AI switches to low-frequency mode instead of aborting the session.

---

## 🧭 6. Control Logic

| Goal | Action |
|------|--------|
| Reduce costs | memory caching, low-frequency mode, tiered models |
| Increase revenue | ads, credits, premium subscriptions |
| Preserve experience | adaptive ad timing, non-intrusive UI |
| Ensure transparency | live token dashboard, rolling forecast |

### 6.1 Budget Modes & Thresholds (dynamic controls)

Define modes by `session_balance` and live token velocity:

| Mode | Condition | System Behavior |
|------|-----------|------------------|
| **Full** | `session_balance ≥ $0.10` and `tokens/min ≤ T1` | All features active; GPT-4 for reasoning; minimal ads. |
| **Balanced** | `$0 ≤ balance < $0.10` or `tokens/min > T1` | Switch routine to GPT-3.5; enable Layer-2 ads; summaries less frequent. |
| **Low-Frequency** | `balance < $0` or `tokens/min > T2` | Reduce moderation cadence (batch every 3–5 msgs); Layer-3 ads allowed; aggressive rolling summaries. |
| **Guarded** | `balance < −$0.30` | Require credits/premium for continued high-intensity features; chat remains open but in lean mode. |

Typical parameters (tunable): `T1 = 1500 tokens/min`, `T2 = 3000 tokens/min`.

---

## 💡 7. Advertising Model Integration

Hi Stranger’s monetization combines **advertising**, **credits**, and **premium tiers**.  
Advertising is not limited to the chat screen — it spans the entire app environment.

### 7.1 Ad Layers

| Layer | Placement | CPM Range | Visibility | Notes |
|------|-----------|-----------|------------|-------|
| **Layer 1 — Passive Surface Ads** | Splash / waiting screens | $2–6 | 100 % of non-premium users | Pre- and post-chat; skippable |
| **Layer 2 — Engagement-Linked Ads** | UI overlays, reflection cards | $5–12 | 30–50 % (non-premium) | Soft native placements |
| **Layer 3 — Companion / Feed Ads** | Home feed, summaries, notifications | $3–8 | 70–90 % (non-premium) | Long-tail monetization |

**Effective Ad Density (EAD):** 0.03–0.06 impressions per second per user  
**Goal:** 1 ad every 20–30 seconds app-wide, not only in chat.

---

## 🧩 8. Journey-Level Cost Logic

| Journey Type | Description | KI Intensity | Est. Token Budget | CPM Layer (Ad Density) | Cost per Session (est.) | Monetization Path |
|--------------|-------------|--------------|-------------------|------------------------|-------------------------|-------------------|
| **Entry Convo Journey** | 1:1 intro chat between two matched users; structured flow with light moderation | **Low** | ~10k–15k | Layer 1 (Pre/Post-Chat) | ~$0.10–0.15 | Free / Ad-supported |
| **Convo Journey A** | Thematic 1:1 or small-group chat, mild emotional depth | **Low–Mid** | ~20k–25k | Layer 1–2 | ~$0.25 | Free or €0.49 |
| **Convo Journey B** | Reflective or goal-oriented chat with moderate AI depth | **Mid–High** | ~35k–40k | Layer 1–3 | ~$0.40–0.50 | €0.99 / Premium |
| **Convo Journey C** | Purpose-driven (e.g., conflict resolution, advice) | **High** | ~45k–55k | Layer 2–3 | ~$0.60–0.75 | €1.49 / Premium+ |
| **Convo Journey D** | Extended narrative / deep dive conversation | **High** | ~60k–80k | Layer 2–3 | ~$0.80–1.00 | €1.99 / Premium+ |
| **Into-the-Space: Low-Intensity** | Multi-user, casual topic chat | **Low–Mid** | ~30k | Layer 1–2 | ~$0.30 | Free / Ads |
| **Into-the-Space: Mid-Intensity** | Recurring discussion with light summaries | **Mid** | ~50k–70k | Layer 2–3 | ~$0.60–0.80 | Premium or €1.00 |
| **Into-the-Space: High-Intensity** | Multi-user deep topic (1–3 days) | **High** | ~90k–120k | Layer 3 | ~$1.20–1.50 | Premium / Paid Entry |
| **Into-the-Space: Extreme-Intensity** | Long-running themed circle (multi-day / week-long) | **Extreme** | ~150k–250k | Layer 3 + Tiered | ~$2.00–3.00 | Premium+ / Subscription Only |

#### 8.1 Journey KPIs (track per journey type)

| Journey | Token cap | Target CPM mix | Target ARPU | Success KPI |
|---------|-----------|----------------|-------------|-------------|
| Entry Convo | ≤ 15k | L1 heavy | ≥ $0.15 | 25% convert to next journey |
| Convo A | ≤ 25k | L1–L2 | ≥ $0.25 | 15% upsell to B |
| Convo B | ≤ 40k | L1–L3 | ≥ $0.50 | 10% upsell to C |
| Convo C | ≤ 55k | L2–L3 | ≥ $0.75 | NPS ≥ 45 |
| Convo D | ≤ 80k | L2–L3 | ≥ $1.00 | premium attach ≥ 12% |
| Space Low | ≤ 30k | L1–L2 | ≥ $0.30 | DAU retention +5% |
| Space Mid | ≤ 70k | L2–L3 | ≥ $0.80 | session depth ≥ 20 min |
| Space High | ≤ 120k | L3 | ≥ $1.50 | paid entry ≥ 20% |
| Space Extreme | ≤ 250k | L3 tiered | ≥ $3.00 | subscription attach ≥ 15% |

---

## 📈 9. Revenue Composition Diagram

```
Revenue Composition (per user lifecycle)

        +------------------------------------+
        |              Premium               |  ≈ 40%  |
        +-----------------+------------------+
        |    Ads          |   Credits        |
        |    ≈ 35%        |   ≈ 20%          |
        +-----------------+------------------+
        |  Data Value &   |
        |  Engagement     |  ≈ 5% (indirect) |
        +-----------------+

→ Goal Mix: 
   Ads < 40%, 
   Premium Subscriptions stabilize base, 
   Credits provide elasticity for high-intensity journeys.
```

**Interpretation:**
- Premium tiers cover fixed infrastructure & baseline AI costs.  
- Ads scale revenue dynamically without hard paywalls.  
- Credits absorb peak AI costs in high-load sessions.  
- Data value (interests, engagement patterns) indirectly raises CPM and targeting quality.

### 9.1 Ad Density Governor (EAD controller)

- Base EAD: **0.03–0.06** impressions/sec/user across app surfaces.  
- Increase EAD by **+20%** when `balance < $0` for > 60 s.  
- Decrease EAD by **−20%** when `balance ≥ $0.10` for > 120 s.  
- Never exceed UX cap: **max 1 ad per 15 s** per user (global).

---

## 📊 10. Cost–Experience Matrix

```
                EXPERIENCE QUALITY ↑
                   (Fluidity / Perceived Value)
High ────────────────────────────────────────────────
│        • Journey D / High-Intensity Space
│          (High AI depth, rich context, costly)
│
│        • Convo Journey B/C
│          (Balanced experience, mid-cost)
│
│
│        • Entry Convo / Journey A
│          (Efficient, low cost, simple AI layer)
│
│
└───────────────────────────────────────────────────────→ AI INTENSITY / TOKEN USE
   Low                   Medium                    High
```

**Zones:**
- **Lean Zone (bottom-left):** ad-supported, highly scalable, low-cost entry experiences.  
- **Value Zone (middle):** balanced cost vs. emotional return, strong conversion potential.  
- **Premium Zone (top-right):** paid or limited access, high satisfaction & retention.

---

## 🧠 11. Journey-as-Product Principle

Each journey represents a self-contained **micro-product** combining:
- **Experience Design (UX flow)**  
- **AI cost profile (token budget)**  
- **Revenue stream (ads / credits / premium)**  

Tracking KPIs per journey ensures that cost and value remain in sync.  
Future dashboards should display **token usage, revenue, and retention** for each journey type.

---

**Maintainer:** _Hi Stranger Core Team_  
**Last updated:** 18 Oct 2025