// /functions/api/docs-pages.js
// Dev-freundliche Liste der Markdown-Dokumente aus /docs/pages/_files.json.
// Keine Abhängigkeit von __STATIC_CONTENT_MANIFEST oder Directory-Index.

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const q = (url.searchParams.get("q") || "").toLowerCase().trim();

  try {
    const filesUrl = new URL("/docs/pages/_files.json", url.origin).toString();
    const res = await fetch(filesUrl, { cache: "no-store" });
    if (!res.ok) {
      return json(200, { items: [], hint: "files_json_not_found" });
    }

    const data = await res.json();
    const files = Array.isArray(data.items) ? data.items : [];

    const items = files
      .filter((p) => typeof p === "string" && p.endsWith(".md"))
      .map((path) => ({
        path, // z.B. "docs/pages/README.md" (ohne führenden Slash)
        title: path
          .replace(/^docs\/pages\//, "")
          .replace(/\.md$/i, "")
          .replace(/[-_]/g, " ")
          .replace(/\s+/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase()),
      }))
      .filter((it) => !q || it.title.toLowerCase().includes(q) || it.path.toLowerCase().includes(q))
      .sort((a, b) => a.path.localeCompare(b.path));

    return json(200, { items });
  } catch (e) {
    return json(200, { items: [], hint: "error_loading_files_json" });
  }
}

function json(status, obj) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}