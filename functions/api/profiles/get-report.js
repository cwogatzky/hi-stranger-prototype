// /functions/api/profiles/get-report.js
// Minimal GET endpoint: returns stored import report by ?id= param

export async function onRequestGet(context) {
  const { env } = context;
  const url = new URL(context.request.url);
  const id = url.searchParams.get("id")?.trim();

  if (!id) {
    return json(400, { error: "bad_request", message: "Missing ?id parameter." });
  }
  if (!env?.IMPORT_REPORT_KV) {
    return json(500, { error: "kv_missing", message: "IMPORT_REPORT_KV binding not available." });
  }

  try {
    const report = await env.IMPORT_REPORT_KV.get(`report:${id}`, { type: "json" });
    if (!report) {
      return json(404, { error: "not_found", message: `No report found for id ${id}` });
    }
    return json(200, report);
  } catch (e) {
    return json(500, { error: "kv_error", message: "Failed to read report from KV." });
  }
}

function json(status, obj) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}