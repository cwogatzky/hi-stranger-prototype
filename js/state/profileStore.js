/* === js/state/profileStore.js ===
   Purpose: Manage User Profiles according to USER_PROFILE.md
   - Layered structure: profile.identity / intent / behavior / emotional / interests / system
   - Backward compatible: legacy entries {id,name} normalized on load
   - Async AppStorage API
   - Events: 'profiles:changed' with detail { profiles }
   - Legacy shims: getAllProfiles, onProfilesChanged, initProfileStore
*/

import { AppStorage } from './storage.js';

const KEY = 'profiles';

/* ---------- Utils ---------- */

/** Compute age (years) from birthday (ISO yyyy-mm-dd). Returns null if invalid. */
function computeAgeFromBirthday(birthday) {
  if (!birthday || typeof birthday !== 'string') return null;
  const d = new Date(birthday);
  if (Number.isNaN(d.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - d.getFullYear();
  const m = today.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--;
  return age < 0 ? null : age;
}

/** Deep-safe clone */
function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/** Simple ID helper (no external dep) */
function cryptoRandomId() {
  // 16 hex chars
  const arr = new Uint8Array(8);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(arr);
  } else {
    for (let i = 0; i < arr.length; i++) arr[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
}

/* ---------- Default Builder (USER_PROFILE.md aligned) ---------- */

function buildDefaultProfileShape() {
  return {
    id: '',                   // filled by caller/normalizer
    name: '',                 // mirrors profile.identity.user_name
    profile: {
      identity: {
        user_name: '',
        gender: null,         // 'm' | 'f' | 'nonbinary' | 'prefer_not_to_say'
        birthday: null,       // ISO date string
        age: null,            // computed readonly
        avatar_picture: null  // url/string
      },
      intent: {
        expectations: [],
        biography: '',
        conversation_goals: [],
        values_and_beliefs: [],
        topics_to_avoid: []
      },
      behavior: {
        social_energy: [],
        communication_style: [],
        conflict_response: null,
        support_style: null
      },
      emotional: {
        emotional_needs: [],
        maintenance_style: []
      },
      interests: {
        shared_lifestyle_type: [],
        interests: []
      },
      system: {
        language: 'en',
        formality: 'informal',  // 'formal' | 'informal'
        intro_done: false,
        joined_at: null,        // ISO string
        last_active: null       // ISO string
      }
    }
  };
}

/* === normalizeProfile ===
   - Accepts any partial/legacy object
   - Ensures full schema presence
   - Mirrors name <-> profile.identity.user_name
   - Recomputes age from birthday (readonly)
*/
function normalizeProfile(input) {
  const def = buildDefaultProfileShape();
  const p = clone(input || {});

  // id
  def.id = (typeof p.id === 'string' && p.id) ? p.id : cryptoRandomId();

  // name + identity.user_name mirror
  const incomingName = (typeof p.name === 'string' && p.name) ? p.name
    : (p.profile?.identity?.user_name || '');

  def.name = incomingName || def.name;
  def.profile.identity.user_name = incomingName || def.profile.identity.user_name;

  // merge identity
  const idSrc = p.profile?.identity || {};
  def.profile.identity.gender = idSrc.gender ?? def.profile.identity.gender;
  def.profile.identity.birthday = idSrc.birthday ?? def.profile.identity.birthday;
  def.profile.identity.avatar_picture = idSrc.avatar_picture ?? def.profile.identity.avatar_picture;

  // compute age (never trust stored age)
  def.profile.identity.age = computeAgeFromBirthday(def.profile.identity.birthday);

  // merge intent
  const inIntent = p.profile?.intent || {};
  def.profile.intent.expectations = Array.isArray(inIntent.expectations) ? inIntent.expectations : def.profile.intent.expectations;
  def.profile.intent.biography = (typeof inIntent.biography === 'string') ? inIntent.biography : def.profile.intent.biography;
  def.profile.intent.conversation_goals = Array.isArray(inIntent.conversation_goals) ? inIntent.conversation_goals : def.profile.intent.conversation_goals;
  def.profile.intent.values_and_beliefs = Array.isArray(inIntent.values_and_beliefs) ? inIntent.values_and_beliefs : def.profile.intent.values_and_beliefs;
  def.profile.intent.topics_to_avoid = Array.isArray(inIntent.topics_to_avoid) ? inIntent.topics_to_avoid : def.profile.intent.topics_to_avoid;

  // merge behavior
  const inBeh = p.profile?.behavior || {};
  def.profile.behavior.social_energy = Array.isArray(inBeh.social_energy) ? inBeh.social_energy : def.profile.behavior.social_energy;
  def.profile.behavior.communication_style = Array.isArray(inBeh.communication_style) ? inBeh.communication_style : def.profile.behavior.communication_style;
  def.profile.behavior.conflict_response = inBeh.conflict_response ?? def.profile.behavior.conflict_response;
  def.profile.behavior.support_style = inBeh.support_style ?? def.profile.behavior.support_style;

  // merge emotional
  const inEmo = p.profile?.emotional || {};
  def.profile.emotional.emotional_needs = Array.isArray(inEmo.emotional_needs) ? inEmo.emotional_needs : def.profile.emotional.emotional_needs;
  def.profile.emotional.maintenance_style = Array.isArray(inEmo.maintenance_style) ? inEmo.maintenance_style : def.profile.emotional.maintenance_style;

  // merge interests
  const inInt = p.profile?.interests || {};
  def.profile.interests.shared_lifestyle_type = Array.isArray(inInt.shared_lifestyle_type) ? inInt.shared_lifestyle_type : def.profile.interests.shared_lifestyle_type;
  def.profile.interests.interests = Array.isArray(inInt.interests) ? inInt.interests : def.profile.interests.interests;

  // merge system
  const inSys = p.profile?.system || {};
  def.profile.system.language = inSys.language || def.profile.system.language;
  def.profile.system.formality = inSys.formality || def.profile.system.formality;
  def.profile.system.intro_done = (inSys.intro_done ?? def.profile.system.intro_done);
  def.profile.system.joined_at = inSys.joined_at ?? def.profile.system.joined_at;
  def.profile.system.last_active = inSys.last_active ?? def.profile.system.last_active;

  return def;
}

/* ---------- In-memory cache ---------- */

let _loaded = false;
let _profiles = []; // normalized array

async function loadAll() {
  if (_loaded) return;
  const raw = await AppStorage.load(KEY);
  const incoming = Array.isArray(raw) ? raw : [];
  const normalized = incoming.map(normalizeProfile);

  const migrationNeeded = JSON.stringify(incoming) !== JSON.stringify(normalized);
  _profiles = normalized;
  _loaded = true;

  if (migrationNeeded) {
    await AppStorage.save(KEY, _profiles);
    console.debug('[profileStore] migrated profiles to USER_PROFILE schema');
  }
}

async function persistAll() {
  await AppStorage.save(KEY, _profiles);
}

/* ---------- Events ---------- */

function emitChanged() {
  document.dispatchEvent(new CustomEvent('profiles:changed', { detail: { profiles: clone(_profiles) } }));
}

/* ---------- Public API ---------- */

export async function getAll() {
  await loadAll();
  _profiles = _profiles.map(normalizeProfile); // keep mirrors correct
  return clone(_profiles);
}

export async function getById(id) {
  await loadAll();
  return clone(_profiles.find(p => p.id === id) || null);
}

/** Create new profile (partial allowed). Returns created profile. */
export async function createProfile(partial) {
  await loadAll();
  const np = normalizeProfile({
    ...partial,
    id: partial?.id || cryptoRandomId(),
  });

  if (!np.profile.system.joined_at) {
    np.profile.system.joined_at = new Date().toISOString();
  }

  _profiles.push(np);
  await persistAll();
  emitChanged();
  return clone(np);
}

/** Update existing profile by id. Returns updated profile or null if not found. */
export async function updateProfile(id, patch) {
  await loadAll();
  const idx = _profiles.findIndex(p => p.id === id);
  if (idx === -1) return null;

  const merged = normalizeProfile({ ..._profiles[idx], ...patch });

  // keep existing joined_at if already set
  if (_profiles[idx]?.profile?.system?.joined_at && !merged.profile.system.joined_at) {
    merged.profile.system.joined_at = _profiles[idx].profile.system.joined_at;
  }

  _profiles[idx] = merged;
  await persistAll();
  emitChanged();
  return clone(merged);
}

export async function deleteProfile(id) {
  await loadAll();
  const before = _profiles.length;
  _profiles = _profiles.filter(p => p.id !== id);
  if (_profiles.length !== before) {
    await persistAll();
    emitChanged();
    return true;
  }
  return false;
}

/** Replace all profiles (e.g., import). Expects array of partials. */
export async function replaceAll(list) {
  const arr = Array.isArray(list) ? list : [];
  _profiles = arr.map(normalizeProfile);
  await persistAll();
  emitChanged();
  return clone(_profiles);
}

/** Export snapshot (for download / backup) */
export async function exportAll() {
  await loadAll();
  return clone(_profiles);
}

/* ---------- Legacy shims (back-compat) ---------- */

/** onProfilesChanged(handler) — legacy event API */
export function onProfilesChanged(handler) {
  if (typeof handler !== 'function') return;
  document.addEventListener('profiles:changed', (e) => {
    try {
      const list = (e && e.detail && e.detail.profiles) ? e.detail.profiles : [];
      handler(list);
    } catch (err) {
      console.error('[profileStore] onProfilesChanged handler error:', err);
    }
  });
}

/** getAllProfiles — alias for legacy imports */
export { getAll as getAllProfiles };

/** initProfileStore — legacy init hook for boot sequence */
export async function initProfileStore() {
  await loadAll();
  // Emit initial state once so legacy UIs bind immediately
  emitChanged();
}