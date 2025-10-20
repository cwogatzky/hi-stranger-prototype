/* === js/ui/profileForm.js ===
   PF-1/2: Minimal functional profile form for USER_PROFILE schema
   - Keeps old UI flow
   - Maps to new nested profile format on save
   - Exports mountProfilesUI() for boot.js
*/

import * as ProfileStore from '../state/profileStore.js'; // fixed relative path

/* ---------- DOM refs (resolved after mount) ---------- */
let form, nameInput, list;

/* ---------- Rendering ---------- */

async function renderProfiles() {
  const profiles = await ProfileStore.getAll();
  if (!list) return;
  list.innerHTML = '';
  for (const p of profiles) {
    const li = document.createElement('li');
    li.textContent = `${p.name} (${p.profile?.system?.language || 'en'})`;
    list.appendChild(li);
  }
}

/* ---------- Create ---------- */

async function handleCreateProfile(e) {
  e.preventDefault();
  const name = (nameInput?.value || '').trim();
  if (!name) return;

  // Minimal schema object (PF-1 adapter)
  const newProfile = {
    name,
    profile: {
      identity: { user_name: name },
      system: { language: 'en', formality: 'informal' },
    },
  };

  await ProfileStore.createProfile(newProfile);
  if (nameInput) nameInput.value = '';
  await renderProfiles();
}

/* ---------- Public init (for legacy direct init) ---------- */

export async function initProfileForm() {
  // Resolve refs (after mount)
  form = document.getElementById('profile-form');
  nameInput = document.getElementById('profile-name');
  list = document.getElementById('profiles-list');

  if (!form) return;
  form.addEventListener('submit', handleCreateProfile);
  await renderProfiles();
}

/* ---------- mountProfilesUI (expected by boot.js) ---------- */
/** Mounts the minimal profile form UI into the given container id. */
export async function mountProfilesUI(targetId = 'profiles-ui') {
  const el = document.getElementById(targetId);
  if (!el) {
    console.warn('[profileForm] container not found:', targetId);
    return;
  }

  // Minimal legacy form markup (keeps existing IDs for compatibility)
  el.innerHTML = `
    <form id="profile-form" style="display:flex;gap:8px;align-items:center;margin:8px 0;">
      <input id="profile-name" type="text" placeholder="Profile name" required
             style="padding:6px 8px;border:1px solid #d1d5db;border-radius:6px;min-width:220px;font:14px system-ui,Segoe UI,Roboto,Arial,sans-serif;" />
      <button type="submit" style="padding:6px 10px;border:1px solid #d1d5db;border-radius:8px;background:#fff;cursor:pointer;font:14px system-ui,Segoe UI,Roboto,Arial,sans-serif;">
        Add Profile
      </button>
    </form>
    <ul id="profiles-list" style="margin:8px 0 0 0;padding-left:18px;"></ul>
  `;

  // Resolve fresh refs & init logic
  form = document.getElementById('profile-form');
  nameInput = document.getElementById('profile-name');
  list = document.getElementById('profiles-list');

  await initProfileForm();
}

/* ---------- Legacy event export (kept for back-compat) ---------- */
export const onProfilesChanged = ProfileStore.onProfilesChanged;