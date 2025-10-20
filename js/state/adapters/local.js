// js/state/adapters/local.js
// Local adapter — complete interface for wiring

export const localAdapter = {
  async load(key) {
    const raw = localStorage.getItem(key);
    if (raw == null) return null;
    try { return JSON.parse(raw); } catch { return null; }
  },

  async save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  async remove(key) {
    localStorage.removeItem(key);
  },

  async list(prefix = '') {
    const out = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k) continue;
      if (prefix && !k.startsWith(prefix)) continue;
      let value = null;
      try { value = JSON.parse(localStorage.getItem(k)); } catch {}
      out.push({ key: k, value });
    }
    out.sort((a,b)=> a.key.localeCompare(b.key));
    return out;
  },

  async exportJSON(prefix = '') {
    const items = await this.list(prefix);
    return { exported_at: new Date().toISOString(), items };
  },

  async importJSON(payload) {
    let imported = 0;
    for (const it of (payload?.items || [])) {
      if (!it || typeof it.key !== 'string') continue;
      localStorage.setItem(it.key, JSON.stringify(it.value ?? null));
      imported++;
    }
    return { imported };
  }
};