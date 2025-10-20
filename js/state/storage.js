// js/state/storage.js
// Step 1.1 — API skeleton (no driver logic yet). ES module.

/**
 * ### AppStorage API — unified interface
 * All app modules must use these methods. The concrete driver is wired in Step 1.2.
 *
 * Methods:
 *  - load(key: string): Promise<any | null>
 *  - save(key: string, value: any): Promise<void>
 *  - remove(key: string): Promise<void>
 *  - list(prefix?: string): Promise<Array<{ key: string, value: any }>>
 *  - exportJSON(prefix?: string): Promise<{ exported_at: string, items: Array<{ key: string, value: any }> }>
 *  - importJSON(payload: { items: Array<{ key: string, value: any }> }): Promise<{ imported: number }>
 *
 * Notes:
 *  - Keys are strings (namespaced by caller, e.g. "profiles:123").
 *  - All methods are async (Promise-based) to match future remote drivers.
 *  - Validation & schema checks happen in the calling layer (schemas.js).
 */

/** @typedef {{ 
 *   load(key:string):Promise<any|null>,
 *   save(key:string, value:any):Promise<void>,
 *   remove(key:string):Promise<void>,
 *   list(prefix?:string):Promise<Array<{key:string,value:any}>>,
 *   exportJSON(prefix?:string):Promise<{exported_at:string,items:Array<{key:string,value:any}>}>,
 *   importJSON(payload:{items:Array<{key:string,value:any}>}):Promise<{imported:number}>
 * }} StorageAPI */

/** @type {StorageAPI} */
let _impl = notInitialized();

/** Helper: default implementation before a driver is wired. */
function notInitialized() {
  const err = () => Promise.reject(
    new Error('[AppStorage] Not initialized — driver will be wired in Step 1.2')
  );
  return {
    load: err,
    save: err,
    remove: err,
    list: err,
    exportJSON: err,
    importJSON: err,
  };
}

/** Basic input guard for keys. */
function assertKey(key) {
  if (typeof key !== 'string' || key.trim() === '') {
    throw new TypeError('[AppStorage] "key" must be a non-empty string');
  }
}

/** Public facade — delegates to the active implementation. */
export const AppStorage = {
  /** @param {string} key */
  async load(key) {
    assertKey(key);
    return _impl.load(key);
  },

  /** @param {string} key @param {any} value */
  async save(key, value) {
    assertKey(key);
    return _impl.save(key, value);
  },

  /** @param {string} key */
  async remove(key) {
    assertKey(key);
    return _impl.remove(key);
  },

  /** @param {string} [prefix] */
  async list(prefix) {
    if (prefix != null && typeof prefix !== 'string') {
      throw new TypeError('[AppStorage] "prefix" must be a string if provided');
    }
    return _impl.list(prefix);
  },

  /** @param {string} [prefix] */
  async exportJSON(prefix) {
    if (prefix != null && typeof prefix !== 'string') {
      throw new TypeError('[AppStorage] "prefix" must be a string if provided');
    }
    return _impl.exportJSON(prefix);
  },

  /** @param {{items:Array<{key:string,value:any}>}} payload */
  async importJSON(payload) {
    if (!payload || !Array.isArray(payload.items)) {
      throw new TypeError('[AppStorage] "payload.items" must be an array');
    }
    return _impl.importJSON(payload);
  },
};

/**
 * Internal hook (will be used in Step 1.2).
 * Sets the concrete driver implementation.
 * @param {StorageAPI} impl
 */
export function __setStorageImpl(impl) {
  // minimal shape check to catch obvious wiring mistakes:
  const required = ['load','save','remove','list','exportJSON','importJSON'];
  for (const fn of required) {
    if (typeof impl?.[fn] !== 'function') {
      throw new Error(`[AppStorage] Invalid implementation: missing ${fn}()`);
    }
  }
  _impl = impl;
}

// For diagnostics — can be removed later if undesired.
export function __getStorageImplForDebug() {
  return _impl;
}

// --- Step 1.2.b: driver switch (local only for now) ---

/**
 * Select and wire a concrete storage driver.
 * @param {'local'|'remote'} [name='local']
 */
export async function useStorageDriver(name = 'local') {
  const n = String(name || 'local').toLowerCase();
  switch (n) {
    case 'local': {
      const mod = await import('./adapters/local.js');
      __setStorageImpl(mod.localAdapter);
      console.debug('[AppStorage] using local adapter');
      return;
    }
    default: {
      console.warn(`[AppStorage] unknown driver "${n}", falling back to local`);
      const mod = await import('./adapters/local.js');
      __setStorageImpl(mod.localAdapter);
      return;
    }
  }
}