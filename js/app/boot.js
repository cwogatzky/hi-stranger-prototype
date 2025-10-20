// js/app/boot.js
// Thin app entry — load storage first, then everything that depends on it.

import { useStorageDriver } from '../state/storage.js';
import { initProfileStore } from '../state/profileStore.js';
import { mountProfilesUI } from '../ui/profileForm.js';

export function boot() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
}

async function init() {
  console.log('[boot] app initialized');

  // simple config default
  window.__cfg = window.__cfg || {};
  const driver = (window.__cfg.STORAGE_DRIVER || 'local');

  // 1) Storage zuerst verdrahten
  await useStorageDriver(driver);
  console.log('[boot] storage driver ready:', driver);

  // 2) Profile-Store initialisieren (nutzt Storage)
  await initProfileStore();
  console.log('[boot] profiles loaded');

  // 3) Profile-UI nur auf Seiten mit #profiles-ui mounten
  const el = document.getElementById('profiles-ui');
  if (el && typeof mountProfilesUI === 'function') {
    mountProfilesUI('profiles-ui');
  } else {
    console.debug('[boot] skip profile UI mount (no #profiles-ui on this page)');
  }

  // 4) Jetzt erst Module importieren, die beim Import auf Storage zugreifen
  const ChatMeta = await import('../state/chatMeta.js');
  window.ChatMeta = ChatMeta; // Dev-Konsole Zugriff

  // 5) Haupt-App laden (nutzt u.a. ChatMeta/Storage)
  await import('../script.js');
}