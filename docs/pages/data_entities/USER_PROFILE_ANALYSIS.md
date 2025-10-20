# USER_PROFILE_ANALYSIS.md
*(Version 1.2 – Pre-Calibration Draft, UX Parameter Gap Added)*

---

## 1. Purpose and Context

This document explains how Hi Stranger evaluates and classifies user profiles to understand personality, communication style, and emotional tendencies.  
It describes the **hybrid OCEAN + DISC model**, why it was chosen, and how data from `USER_PROFILE.md` is translated into measurable behavioral vectors.

Goal:  
> To help the entire team understand how the personality engine interprets each user and how its parameters are defined and weighted.

---

## 2. Why We Use OCEAN + DISC

| Model | Origin & Authority | Focus | Benefit |
|--------|--------------------|--------|----------|
| **OCEAN (Big Five)** | Academic model by Goldberg, Costa & McCrae (1980s–1990s) | Inner personality structure (motivation, curiosity, emotion) | Provides a stable psychological base for behavioral prediction. |
| **DISC** | William M. Marston (1928); modernized by Wiley (discprofile.com) | Observable communication and reaction patterns | Helps simulate interaction style, tone, and assertiveness. |

**Why the hybrid works:**  
OCEAN models *who a person is* → internal drivers.  
DISC models *how they behave* → external interaction patterns.  
Together they form a **9-axis system** that covers both depth and dynamics of personality.

**References:**  
- [Big Five Personality Traits (SimplyPsychology)](https://www.simplypsychology.org/big-five-personality.html)  
- [What Is the DiSC Assessment (discprofile.com)](https://www.discprofile.com/what-is-disc)

---

## 3. How the Model Works

### Step 1 – Input
We use descriptive fields from `USER_PROFILE.md` — such as `social_energy`, `communication_style`, `conflict_response`, `support_style`, `assertiveness_level`, `decision_style`, `emotional_regulation`, etc.

### Step 2 – Normalization
Each answer is converted into a **numeric range [0–1]**.  
Example:  
| Field | Example Value | Normalized |
|--------|----------------|-------------|
| `assertiveness_level` | 4 (of 5) | 0.75 |
| `emotional_regulation` | "Calm" | 1.0 |
| `decision_style` | "Impulsive" | 0.1 |

### Step 3 – Weighted Mapping  
Every OCEAN or DISC dimension aggregates several fields.  
Each field has a **weight** (influence) and a **direction** (+ increases the score, − decreases it).

---

## ⚠️ Important Note  
The following table lists **initial theoretical weights (v1.0)** based on psychological literature and logical mapping.  
These are **assumptions**, not final values — they **must be calibrated** against real or expert-rated profiles.

---

## Appendix A – Parameter Weight Mapping (v1.0 Pre-Calibration)

| Axis | Input Fields | Weight | Direction | Description |
|------|---------------|---------|------------|--------------|
| **O – Openness** | `conversation_goals.exploratory` | 0.55 | + | Curiosity, creativity, openness to ideas |
|  | `values_and_beliefs.cultural_curiosity` | 0.25 | + | Openness to diversity |
|  | `topics_to_avoid.count_norm` | 0.20 | − | Fewer restrictions = more openness |
| **C – Conscientiousness (Big Five)** | `communication_style.structure` | 0.60 | + | Preference for organization and clarity |
|  | `formality_proxy` | 0.25 | + | Carefulness, detail orientation |
|  | `decision_style.structured` | 0.15 | + | Preference for order and planning |
| **E – Extraversion** | `social_energy.level` | 0.60 | + | Sociability, talkativeness |
|  | `assertiveness_level` | 0.25 | + | Initiative and confidence |
|  | `communication_style.directness` | 0.15 | + | Expressive communication |
| **A – Agreeableness** | `support_style.empathy` | 0.55 | + | Cooperative, understanding |
|  | `conflict_response.directness` | 0.30 | − | Less direct = more agreeable |
|  | `values_and_beliefs.cooperation` | 0.15 | + | Trust and collaboration orientation |
| **N – Neuroticism** | `emotional_regulation` | 0.55 | − | High calmness lowers N |
|  | `stress_tolerance` | 0.30 | − | High tolerance lowers N |
|  | `topics_to_avoid.sensitivity` | 0.15 | + | Sensitive topics increase N |
| **D – Dominance (DISC)** | `assertiveness_level` | 0.60 | + | Confidence, leadership tendency |
|  | `conflict_response.directness` | 0.25 | + | Decisive confrontation |
|  | `decision_style.decide_fast` | 0.15 | + | Quick decision-making |
| **I – Influence (DISC)** | `social_energy.expressiveness` | 0.60 | + | Enthusiastic communication |
|  | `communication_style.expressiveness` | 0.25 | + | Persuasive tone |
|  | `interests.sociality` | 0.15 | + | Enjoys social interaction |
| **S – Steadiness (DISC)** | `support_style.steady` | 0.55 | + | Calm, consistent, patient |
|  | `topics_to_avoid.sensitivity` | 0.25 | + | Avoids confrontation, values stability |
|  | `empathy_depth` | 0.20 | + | Emotional warmth and patience |
| **C_disc – Conscientiousness (DISC)** | `communication_style.structure` | 0.65 | + | Precision, methodical approach |
|  | `formality_proxy` | 0.20 | + | Professional standards |
|  | `decision_style.structured` | 0.15 | + | Systematic behavior |

---

## 4. Output

After weighting and summation, the system creates a normalized **behavior_vector** and a short **type_signature**:

```json
{
  "behavior_vector": {
    "O": 0.72, "C": 0.63, "E": 0.55, "A": 0.81, "N": 0.34,
    "D": 0.66, "I": 0.72, "S": 0.59, "C_disc": 0.70
  },
  "type_signature": ["open", "steady", "empathetic"],
  "explainability": "High empathy_depth and low conflict_response indicate a calm, cooperative communication style."
}
```

---

## 5. Example Interpretation

> **Profile Input:**  
> social_energy = high, communication_style = open & structured, assertiveness = 4/5, empathy_depth = 5/5, stress_tolerance = 3/5.  
>
> **Result:**  
> E = 0.78 (high), A = 0.82 (high), N = 0.40 (low).  
> Signature → `["open", "steady", "empathetic"]`.  
>
> **Meaning:**  
> This user is socially confident, warm, and stable under pressure — ideal for group discussions and positive tone balancing.

---

## 6. Calibration (Next Step)

Theoretical weights (v1.0) will be calibrated once a diverse dataset of user profiles is available.  
Calibration will be done by:

1. **Creating synthetic or real profiles** with distinct behavioral patterns.  
2. **Having human evaluators** (team or psychologists) rate them on OCEAN/DISC scales.  
3. **Comparing algorithmic vs. human scores** to measure correlation and bias.  
4. **Adjusting weights** until alignment reaches ≥ 0.75 correlation across axes.  
5. Publishing the validated version as `profile_behavior_weights.v2.json` and updating this document accordingly.

---

## 7. Missing Parameters (UX Concept Gap Abstract)

The following personality-relevant parameters are already part of the analytical model but are **not yet captured in the current frontend**.  
They must be added to the profile creation UI to fully support OCEAN + DISC computation.

| Missing Parameter | Purpose in Model | Related Axis | Suggested Control Type |
|-------------------|------------------|---------------|------------------------|
| **assertiveness_level** | Measures self-confidence and initiative in communication. | Extraversion (E), Dominance (D) | Range slider (1–5) |
| **decision_style** | Indicates whether the user is structured, adaptive, or impulsive in decisions. | Conscientiousness (C), Influence (I) | Radio (3 options) |
| **emotional_regulation** | Evaluates calmness and emotional control under stress. | Neuroticism (N), Steadiness (S) | Radio (3 options) |
| **empathy_depth** | Quantifies emotional awareness and sensitivity to others. | Agreeableness (A), Steadiness (S) | Range slider (1–5) |
| **stress_tolerance** | Captures resilience and stress endurance. | Neuroticism (N), Dominance (D) | Range slider (1–5) |
| **formality_proxy** *(derived)* | Reflects tone preference (formal vs. casual) if not directly captured. | Conscientiousness (C), C_disc | Optional toggle / inferred from text tone |

---

### Implementation Note
These missing inputs are already defined in `USER_PROFILE.md` (Behavior and Emotional sections, red-marked in v1.1).  
They simply need to be:
1. Added to the **frontend form and data model**,  
2. Stored under `profile.behavior` or `profile.emotional`,  
3. Included in the payload for OpenAI moderation and profile analysis.

Once these inputs are captured, the OCEAN + DISC model can be computed **end-to-end without synthetic assumptions**.

---

### Summary

This analysis model gives Hi Stranger a consistent, explainable way to interpret personality traits in user interactions.  
The current version (v1.0) provides **logical, research-aligned assumptions**, which will be **empirically refined** during calibration to ensure accuracy and fairness across user types.
