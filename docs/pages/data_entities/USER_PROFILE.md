# USER_PROFILE

## Design Purpose
User Profile defines the **human layer** of Hi Stranger — the personal, psychological, and social framework that drives how each participant interacts.  
It turns static user data into a **living identity model** used by the moderation and personalization engines.

### Why it exists
- **Personalization:** Adapts tone, depth, and moderation flow to the user’s traits.  
- **Consistency:** Keeps the user’s communication style stable across sessions.  
- **Empathy Modeling:** Enables AI to predict comfort zones and avoid friction.  
- **Matchmaking:** Provides a semantic base for compatible chat pairings.  
- **Growth Reflection:** Tracks self-reported traits that evolve over time.

### Summary
| Function | Outcome |
|-----------|----------|
| Structural | Core representation of user personality and preferences |
| Adaptive | Guides moderation tone, prompts, and translation |
| Analytical | Enables trait-based matchmaking and trend analysis |
| Experiential | Creates coherent, deeply personal experiences |

---

## Overview
Holds descriptive and behavioral attributes like communication style, social energy, and emotional tendencies.  
Used throughout the app to personalize moderation, pairing, and tone consistency.

---

**Base Path:** `profile.*`  
**Layers:** identity, intent, behavior, emotional, interests, safety, system

---

## Identity
- **user_name** (text, required)  
- **gender** (radio, required)  
- **birthday** (date, required) → derives **age** (computed)  
- **age** (number, readonly)  
- **avatar_picture** (image/url)

## Intent
- **expectations[]** (checkbox, required)  
  Deep connection / Meaningful conversations / Personal growth / Mainly fun / Professional mentorship / Advice / Create a community / Just checking  
- **biography** (text, optional)  
- **conversation_goals[]** (checkbox, required)  
  Deepen understanding / Explore new perspectives / Build empathy / Practice language / Gain advice / Develop self-awareness / Enjoy casual talk  
- **values_and_beliefs[]** (checkbox, required)  
  Loyalty & Trust / Honest & Open Communication / Sense of Humor & Playfulness / Intellectual Stimulation & Deep Conversations / Cultural Curiosity & Openness to Diversity / Personal Growth & Ambition / Spontaneity & Adventure  
- **topics_to_avoid[]** (checkbox, optional)  
  Political debates / Religious or spiritual topics / Controversial or polarizing topics / Trolling or toxic behavior / Conspiracy theories / Unverified health & wellness claims

## Behavior
*(extended for OCEAN-DISC coverage)*
- **social_energy[]** (checkbox, required)  
- **communication_style[]** (checkbox, required)  
- **conflict_response** (radio)  
- **support_style** (radio)  
- **🔴 assertiveness_level** (scale 1–5, required)  
  Measures initiative, confidence, and leadership tendency.  
- **🔴 decision_style** (radio, required)  
  Structured / Adaptive / Impulsive — reflects planning vs. spontaneity.

## Emotional
*(extended for emotional stability modeling)*
- **emotional_needs[]** (checkbox, required)  
- **maintenance_style[]** (checkbox, required)  
- **🔴 emotional_regulation** (radio, required)  
  Calm / Sensitive / Volatile — captures stress regulation ability.  
- **🔴 empathy_depth** (scale 1–5, required)  
  Determines emotional responsiveness and sensitivity.  
- **🔴 stress_tolerance** (scale 1–5, required)  
  Indicates resilience under prolonged stress or tension.
  
## Interests
- **shared_lifestyle_type[]** (checkbox, required)  
  Engaging in intellectual discussions or creative projects / Exploring new places and trying adventurous activities / Relaxing in familiar settings and having lighthearted fun  
- **interests[]** (comma-separated, required)

---

## Field → UI Mapping (with explicit parameter keys)

| Field Key | Control | Type | Req. | Storage Path | Options / Enum (key = label) |
|---|---|---|:--:|---|---|
| user_name | text | string | ✓ | profile.identity.user_name | — |
| gender | radio | string | ✓ | profile.identity.gender | `m = "Male"<br>f = "Female"<br>nonbinary = "Non-binary"<br>prefer_not_to_say = "Prefer not to say"` |
| birthday | date | string (ISO) | ✓ | profile.identity.birthday | — |
| age | number (readonly) | number | — | profile.identity.age | Derived from birthday |
| avatar_picture | file/url | string | — | profile.identity.avatar_picture | — |
| expectations | checkbox-group | array<string> | ✓ | profile.intent.expectations | `deep_connection = "Deep connection"<br>meaningful_conversations = "Meaningful conversations"<br>personal_growth = "Personal growth"<br>mainly_fun = "Mainly fun"<br>professional_mentorship = "Professional mentorship"<br>advice = "Advice"<br>create_community = "Create a community"<br>just_checking = "Just checking"` |
| biography | textarea | string | — | profile.intent.biography | `maxLength: 800` |
| conversation_goals | checkbox-group | array<string> | ✓ | profile.intent.conversation_goals | `deepen_understanding = "Deepen understanding"<br>explore_new_perspectives = "Explore new perspectives"<br>build_empathy = "Build empathy"<br>practice_language = "Practice language"<br>gain_advice = "Gain advice"<br>develop_self_awareness = "Develop self-awareness"<br>enjoy_casual_talk = "Enjoy casual talk"` |
| values_and_beliefs | checkbox-group | array<string> | ✓ | profile.intent.values_and_beliefs | `loyalty_trust = "Loyalty & Trust"<br>honest_open_comm = "Honest & Open Communication"<br>humor_playfulness = "Sense of Humor & Playfulness"<br>intellectual_stimulation = "Intellectual Stimulation & Deep Conversations"<br>cultural_curiosity = "Cultural Curiosity & Openness to Diversity"<br>personal_growth_ambition = "Personal Growth & Ambition"<br>spontaneity_adventure = "Spontaneity & Adventure"` |
| topics_to_avoid | checkbox-group | array<string> | — | profile.intent.topics_to_avoid | `politics = "Political debates"<br>religion = "Religious or spiritual topics"<br>polarizing = "Controversial / polarizing topics"<br>toxic_behavior = "Trolling or toxic behavior"<br>conspiracy = "Conspiracy theories"<br>unverified_health = "Unverified health & wellness claims"` |
| social_energy | checkbox-group | array<string> | ✓ | profile.behavior.social_energy | `social_events_new_people = "Attending social events and engaging with new people"<br>small_close_group = "Spending time with a small, close-knit group"<br>solitary_creative_work = "Engaging in solitary activities such as reading, writing, or artistic work"<br>lead_conversations = "I enjoy leading conversations and bringing people together"<br>prefer_listening_value_add = "I prefer listening and contributing only when I have something valuable to add"<br>overwhelmed_large_pref_1to1 = "I find large discussions overwhelming and prefer one-on-one conversations"` |
| communication_style | checkbox-group | array<string> | ✓ | profile.behavior.communication_style | `open_direct = "Open and direct"<br>more_structured = "More structured"<br>casual_quick = "Casual & quick"<br>selective_engagement = "Selective engagement"` |
| conflict_response | radio | string | — | profile.behavior.conflict_response | `direct_resolution = "I address the issue directly and seek an immediate resolution"<br>reflective_delayed = "I take time to process my thoughts before engaging in discussion"<br>avoidant = "I tend to avoid confrontation and hope the issue resolves itself over time"` |
| support_style | radio | string | — | profile.behavior.support_style | `practical_problem_solving = "By offering practical advice and problem-solving strategies"<br>empathetic_listening = "By listening empathetically and validating their emotions"<br>humor_distraction = "By creating a distraction through humor or activities"` |
| emotional_needs | checkbox-group | array<string> | ✓ | profile.emotional.emotional_needs | `availability_trust = "Emotional availability and deep trust"<br>shared_interests_experiences = "Mutual interests and shared experiences"<br>consistency_reliability = "Consistency and reliability in communication"` |
| maintenance_style | checkbox-group | array<string> | ✓ | profile.emotional.maintenance_style | `regular_deep_checkins = "Regular check-ins and deep conversations"<br>spontaneous_connection = "Spontaneous interactions whenever possible"<br>intermittent_but_reliable = "Intermittent contact but always available when needed"` |
| shared_lifestyle_type | checkbox-group | array<string> | ✓ | profile.interests.shared_lifestyle_type | `creative_intellectual = "Engaging in intellectual discussions or creative projects"<br>adventurous_exploratory = "Exploring new places and trying adventurous activities"<br>relaxed_playful = "Relaxing in familiar settings and having lighthearted fun"` |
| interests | tags (comma-supported) | array<string> | ✓ | profile.interests.interests | Comma-separated list |
| **🔴 assertiveness_level** | range-slider | number (1–5) | ✓ | profile.behavior.assertiveness_level | `1 = "Very reserved" <br> 3 = "Moderate" <br> 5 = "Very assertive"` |
| **🔴 decision_style** | radio | string | ✓ | profile.behavior.decision_style | `structured = "Structured / methodical" <br> adaptive = "Adaptive / flexible" <br> impulsive = "Impulsive / spontaneous"` |
| **🔴 emotional_regulation** | radio | string | ✓ | profile.emotional.emotional_regulation | `calm = "Remains calm under stress" <br> sensitive = "Easily affected but recovers fast" <br> volatile = "Strong emotional swings"` |
| **🔴 empathy_depth** | range-slider | number (1–5) | ✓ | profile.emotional.empathy_depth | `1 = "Low emotional resonance" <br> 3 = "Balanced empathy" <br> 5 = "Highly empathetic"` |
| **🔴 stress_tolerance** | range-slider | number (1–5) | ✓ | profile.emotional.stress_tolerance | `1 = "Low tolerance" <br> 3 = "Moderate resilience" <br> 5 = "Highly resilient"` |
