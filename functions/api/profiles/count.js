// /functions/api/profiles/count.js
// GET /api/profiles/count
// Summiert alle Profile über mehrere mögliche Prefixes (z. B. "profile:", "profiles:").
// Nutzt KV-Cursor-Pagination bis zur Erschöpfung. Antwort liefert Total + Breakdown.

export async function onRequestGet({ env }) {
  if (!env?.PROFILES_KV) {
    return json(500, { error: "kv_missing", message: "PROFILES_KV binding not configured." });
  }

  // Bekannte/erlaubte Prefixes (Legacy sicherheitshalber mitnehmen)
  const prefixes = ["profile:", "profiles:"];

  const result = { total: 0, by_prefix: {}, distinct_ids: 0 };

  // Optional: Deduplikation, falls Keys unter mehreren Prefixes existieren
  const seen = new Set();

  for (const prefix of prefixes) {
    let cursor;
    let countForPrefix = 0;

    do {
      const page = await env.PROFILES_KV.list({ prefix, cursor, limit: 1000 });
      const keys = page.keys || [];

      for (const k of keys) {
        // id extrahieren
        const id = k.name.startsWith(prefix) ? k.name.slice(prefix.length) : k.name;
        countForPrefix++;
        if (!seen.has(id)) seen.add(id);
      }

      cursor = page.cursor || null;
    } while (cursor);

    result.by_prefix[prefix] = countForPrefix;
  }

  result.total = Array.from(seen).length;
  result.distinct_ids = result.total;

  return json(200, result);
}

function json(status, obj) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }
  });
}