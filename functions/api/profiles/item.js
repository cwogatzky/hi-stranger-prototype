// returns one profile object from PROFILES_KV by id, using key "profile:<id>"

export async function onRequestGet({ request, env }) {
  if (!env?.PROFILES_KV) {
    return json(500, { error: "kv_unavailable", message: "PROFILES_KV binding missing." });
  }

  const url = new URL(request.url);
  // support both query (?id=usr_x) and potential path fallback (/api/profiles/item/usr_x)
  let id = url.searchParams.get("id");
  if (!id) {
    const parts = url.pathname.split("/").filter(Boolean);
    id = parts[parts.length - 1]; // last segment
  }
  if (!id || !/^usr_[a-z0-9]+$/i.test(id)) {
    return json(400, { error: "bad_request", message: "Missing or invalid 'id'." });
  }

  const key = `profile:${id}`;
  const obj = await env.PROFILES_KV.get(key, { type: "json" });
  if (!obj) {
    return json(404, { error: "not_found", message: `Profile '${id}' not found.` });
  }

  return json(200, obj);
}

function json(status, obj) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" }
  });
}