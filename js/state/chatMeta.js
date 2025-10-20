// js/state/chatMeta.js
// Purpose: Persistent chat-level metadata (owner_id; later: goal, languages, rules, success_metrics)
// Events:  document.dispatchEvent(new CustomEvent('owner:changed', { detail: { owner_id } }))

import { AppStorage } from './storage.js'; // Pfad ggf. an Projektstruktur anpassen

const KEY = 'chat_meta';

let _meta = { owner_id: null };
let _loaded = false;

/* === Load/Save (async) ===
   Lädt/sichert die Chat-Meta-Struktur über AppStorage (async).
*/
async function load() {
  if (_loaded) return;
  const raw = await AppStorage.load(KEY);
  if (raw && typeof raw === 'object') {
    _meta = {
      owner_id: raw.owner_id ?? null,
      // Platzhalter für spätere Felder:
      // goal: raw.goal ?? null,
      // languages: Array.isArray(raw.languages) ? raw.languages : [],
      // rules: raw.rules ?? null,
      // success_metrics: raw.success_metrics ?? null,
    };
  }
  _loaded = true;
}

async function save() {
  await AppStorage.save(KEY, _meta);
}

/* === Public API (async) === */

export async function getOwnerId() {
  await load();
  return _meta.owner_id;
}

export async function setOwnerId(profileId) {
  await load();
  const next = profileId ?? null;
  if (_meta.owner_id === next) return false;
  _meta.owner_id = next;
  await save();
  document.dispatchEvent(new CustomEvent('owner:changed', { detail: { owner_id: next } }));
  return true;
}

export async function clearOwner() {
  return setOwnerId(null);
}

/** ensureOwner
 * Falls noch kein Owner gesetzt: optionalen Fallback verwenden (z. B. erstes Profil).
 * @param {string|null} fallbackProfileId
 * @returns {Promise<string|null>} final owner_id
 */
export async function ensureOwner(fallbackProfileId = null) {
  await load();
  if (_meta.owner_id) return _meta.owner_id;
  if (fallbackProfileId) {
    await setOwnerId(fallbackProfileId);
  } else {
    await save(); // persistiert leeren Zustand
  }
  return _meta.owner_id;
}

/** getChatMeta (readonly copy) */
export async function getChatMeta() {
  await load();
  return { ..._meta };
}