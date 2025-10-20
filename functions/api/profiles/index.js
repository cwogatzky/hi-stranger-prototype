// lists profile IDs from PROFILES_KV using the unified prefix "profile:"

export async function onRequestGet({ request, env }) {
  try {
    if (!env?.PROFILES_KV) {
      return json(500, { error: "kv_unavailable", message: "PROFILES_KV binding missing." });
    }

    const url = new URL(request.url);
    const limit = clampInt(url.searchParams.get("limit"), 1, 1000, 100); // default 100, up to 1000
    const cursor = url.searchParams.get("cursor") || undefined;
    const prefix = "profile:";

    const { keys, list_complete, cursor: next } = await env.PROFILES_KV.list({
      prefix,
      cursor,
      limit
    });

    const items = (keys || []).map(k => ({ id: k.name.slice(prefix.length) }));

    return json(200, {
      items,
      list_complete: !!list_complete,
      next_cursor: next || null
    });
  } catch (err) {
    return json(500, { error: "internal_error", message: err?.message || String(err) });
  }
}

function clampInt(v, min, max, def) {
  const n = Number(v);
  if (!Number.isFinite(n)) return def;
  return Math.max(min, Math.min(max, Math.floor(n)));
}

function json(status, obj) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" }
  });
}