// js/types/schemas.js
// Step 2.1 — base constants (versions & enumerations)

// Versioning (bump when schema changes)
export const PROFILES_VERSION = 1;
export const META_VERSION = 1;

// Supported languages (ISO-ish short tags used by UI & policies)
export const ALLOWED_LANGUAGES = ['de', 'en', 'es', 'fr', 'pt'];

// Profile fields enums
export const FORMALITY_LEVELS = ['informal', 'neutral', 'formal'];
export const TONE_PREFERENCES = ['neutral', 'warm', 'humorous', 'direct', 'supportive'];

// Common trait tags (free to extend; UI can suggest from this set)
export const TRAIT_CATALOG = [
  'creative', 'analytical', 'empathetic', 'curious', 'structured', 'spontaneous',
  'conflict-avoidant', 'extrovert', 'introvert'
];

// Chat meta enums
export const CHAT_TYPES = ['one-on-one', 'multi'];
export const CHAT_GOALS = ['exploration', 'learning', 'debate', 'collaboration', 'social'];

// Timestamp helper (used by defaults; keep local time semantics in UI)
export function nowIso() {
  return new Date().toISOString();
}

// --- Step 2.2: basic profile schema guard ---

/**
 * Validate if an object matches the expected UserProfile shape.
 * Returns true/false. Does not throw.
 * @param {any} x
 */
export function isUserProfile(x) {
  if (typeof x !== 'object' || x === null) return false;

  const { id, name, language, formality, traits, tone_pref, conflict_avoidant } = x;

  if (typeof id !== 'string' || !id) return false;
  if (typeof name !== 'string') return false;
  if (!ALLOWED_LANGUAGES.includes(language)) return false;
  if (!FORMALITY_LEVELS.includes(formality)) return false;
  if (!Array.isArray(traits)) return false;
  if (tone_pref && !TONE_PREFERENCES.includes(tone_pref)) return false;
  if (typeof conflict_avoidant !== 'boolean') return false;

  return true;
}

// --- Step 2.3: chat meta schema guard ---

/**
 * Validate if an object matches the expected ChatMeta shape.
 * Returns true/false. Does not throw.
 * @param {any} x
 */
export function isChatMeta(x) {
  if (typeof x !== 'object' || x === null) return false;

  const { chat_id, owner_id, type, goal, languages, created_at } = x;

  if (typeof chat_id !== 'string' || !chat_id) return false;
  if (typeof owner_id !== 'string' || !owner_id) return false;
  if (!CHAT_TYPES.includes(type)) return false;
  if (!CHAT_GOALS.includes(goal)) return false;
  if (!Array.isArray(languages) || languages.length === 0) return false;
  if (!languages.every(l => ALLOWED_LANGUAGES.includes(l))) return false;
  if (created_at && typeof created_at !== 'string') return false;

  return true;
}

// --- Step 2.4: defaults / factories ---

/**
 * Create a default (empty) user profile template.
 * You must set id & name after creation.
 */
export function makeDefaultProfile() {
  return {
    id: '',                       // <-- set by caller (uuid)
    name: '',                     // <-- set by caller
    language: 'de',
    formality: 'neutral',
    traits: [],
    tone_pref: 'neutral',
    conflict_avoidant: false,
    notes: '',
    created_at: nowIso(),
    updated_at: nowIso(),
    version: PROFILES_VERSION
  };
}

/**
 * Create a default chat meta template.
 * You must set chat_id & owner_id after creation.
 */
export function makeDefaultChatMeta() {
  return {
    chat_id: '',                  // <-- set by caller (uuid)
    owner_id: '',                 // <-- set by caller (profile id)
    type: 'one-on-one',
    goal: 'exploration',
    languages: ['de'],
    created_at: nowIso(),
    updated_at: nowIso(),
    version: META_VERSION
  };
}