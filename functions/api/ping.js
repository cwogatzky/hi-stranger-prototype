export async function onRequestGet() {
  return new Response(JSON.stringify({ ok: true, env: "pages" }), {
    headers: { "content-type": "application/json" },
  });
}
