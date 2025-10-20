// /functions/api/profiles/import.js
// PATCH C (CORS + OPTIONS) + Persist: Streaming + gzip + NDJSON + JSON Schema validation
// Stores valid profiles in PROFILES_KV (key: profile:{profile_id})

import { Validator } from "@cfworker/json-schema";
/* jshint ignore:start */
import schema from "../../_schemas/user_profile.v1.schema.json" assert { type: "json" };
/* jshint ignore:end */

const MAX_UPLOAD_BYTES = 50 * 1024 * 1024; // 50 MB
const MAX_LINE_BYTES = 128 * 1024; // 128 KB per line
const ALLOWED_CT = new Set(["application/x-ndjson", "application/gzip"]);
const SCOPE = "profiles:import";
const ERROR_SAMPLE_LIMIT = 200;

// --- CORS helper (ADD) -------------------------------------------------
function cors() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "Authorization, Content-Type, Idempotency-Key, X-Checksum-Sha256, X-Shard-Id, X-Import-Notes",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  };
}

// Preflight handler (ADD)
export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: cors() });
}

// Main POST handler
export async function onRequestPost(context) {
  const { request, env } = context;

  // === AUTH & SCOPE =====================================================
  const auth = request.headers.get("authorization") || "";
  const token = auth.toLowerCase().startsWith("bearer ") ? auth.slice(7) : "";
  if (!token) return json(401, { error: "unauthorized", message: "Missing Bearer token" });
  if (!hasImportScope(token, env)) {
    return json(403, { error: "forbidden", message: `Required scope: ${SCOPE}` });
  }

  // === CONTENT-TYPE CHECK ==============================================
  const ct = (request.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
  if (!ALLOWED_CT.has(ct)) {
    return json(415, { error: "unsupported_media_type", message: "Use application/x-ndjson or application/gzip" });
  }

  // === SIZE GUARD =======================================================
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (Number.isFinite(contentLength) && contentLength > MAX_UPLOAD_BYTES) {
    return json(413, { error: "payload_too_large", message: `Max ${MAX_UPLOAD_BYTES} bytes` });
  }

  // === OPTIONAL HEADERS =================================================
  const idempotencyKey = request.headers.get("idempotency-key") || null;
  const checksumSha256 = request.headers.get("x-checksum-sha256") || null;
  const shardId = request.headers.get("x-shard-id") || null;
  const importNotes = request.headers.get("x-import-notes") || null;

  // === IMPORT ID ========================================================
  const importId = makeImportId();

  // === IDEMPOTENCY LOOKUP (KV) ==========================================
  if (idempotencyKey) {
    const cached = await idempotencyLookup(env, idempotencyKey);
    if (cached) {
      return json(200, { ...cached, idempotency_key: idempotencyKey, note: "replayed (idempotent)" });
    }
  }

  // === PREPARE PARSE STREAM ============================================
  let parseStream = request.body;
  if (ct === "application/gzip") {
    const ds = new DecompressionStream("gzip");
    parseStream = request.body.pipeThrough(ds);
  }

  // === INIT VALIDATOR ===================================================
  const validator = new Validator(schema);

  // === STREAM → LINES → JSON.parse → VALIDATE ===========================
  const decoder = new TextDecoder();
  let leftover = "";
  let lineNo = 0;

  let linesTotal = 0;
  let linesValid = 0;
  let linesInvalid = 0;
  let profilesStored = 0;

  const errorsSample = [];

  const reader = parseStream.getReader();

  const processLine = async (line) => {
    lineNo++;
    const trimmed = line.trim();
    if (!trimmed) return; // skip empty lines
    linesTotal++;

    // Per-line length guard
    if (byteLength(line) > MAX_LINE_BYTES) {
      linesInvalid++;
      pushError(errorsSample, lineNo, ".", "line_too_large", `line exceeds ${MAX_LINE_BYTES} bytes`);
      return;
    }

    let obj;
    try {
      obj = JSON.parse(trimmed);
    } catch {
      linesInvalid++;
      pushError(errorsSample, lineNo, ".", "json_parse_error", "invalid JSON syntax");
      return;
    }

    // Validate
    const { valid, errors } = validator.validate(obj);
    if (valid) {
      linesValid++;

      // === persist valid profile in PROFILES_KV =========================
      try {
        const pid = String(obj.profile_id || "").trim();
        if (pid && env.PROFILES_KV) {
          await env.PROFILES_KV.put(`profile:${pid}`, JSON.stringify(obj));
          profilesStored++;
        }
      } catch (e) {
        pushError(
          errorsSample,
          lineNo,
          ".",
          "storage_error",
          (e && e.message) ? e.message : "failed to store profile in KV"
        );
      }

    } else {
      linesInvalid++;
      for (const e of errors || []) {
        if (errorsSample.length >= ERROR_SAMPLE_LIMIT) break;
        const mapped = mapCfworkerError(e);
        mapped.line_no = lineNo;
        errorsSample.push(mapped);
      }
    }
  };

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    leftover += chunk;

    let idx;
    while ((idx = leftover.indexOf("\n")) >= 0) {
      const line = leftover.slice(0, idx);
      leftover = leftover.slice(idx + 1);
      // eslint-disable-next-line no-await-in-loop
      await processLine(line);
    }
  }
  if (leftover.length > 0) {
    await processLine(leftover);
  }

  // === RESULT & STATUS MAPPING =========================================
  const base = {
    import_id: importId,
    received_content_type: ct,
    idempotency_key: idempotencyKey,
    checksum_sha256: checksumSha256,
    shard_id: shardId,
    notes: importNotes,
    lines_total: linesTotal,
    lines_valid: linesValid,
    lines_invalid: linesInvalid,
    profiles_stored: profilesStored
  };

  let status = 200;
  if (linesTotal === 0) status = 422;
  else if (linesValid > 0 && linesInvalid > 0) status = 207;
  else if (linesValid === 0) status = 422;
  else status = 200;

  const body = { ...base };
  if (linesInvalid > 0 || linesTotal === 0) {
    body.errors_sample = errorsSample;
    body.errors_truncated = errorsSample.length >= ERROR_SAMPLE_LIMIT;
  }

  if (idempotencyKey) await idempotencyStore(env, idempotencyKey, body);

  return json(status, body);
}

// ======================================================================
// Helper Functions
// ======================================================================

function json(status, obj) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...cors(), // ensure CORS on every response
    },
  });
}

function makeImportId() {
  const now = new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14); // YYYYMMDDHHMMSS
  const rand = Math.random().toString(36).slice(2, 8);
  return `imp_${now}_${rand}`;
}

function hasImportScope(token /*, env */) {
  return token.startsWith("admin_") || token === "test-admin" || token === "admin_local";
}

function byteLength(str) { return new TextEncoder().encode(str).length; }

function pushError(arr, lineNo, path, code, message) {
  if (arr.length >= ERROR_SAMPLE_LIMIT) return;
  arr.push({ line_no: lineNo, path, error_code: code, message });
}

// Map cfworker/json-schema error item → our normalized format
function mapCfworkerError(e) {
  const keywordMap = {
    required: "required",
    type: "type",
    enum: "enum",
    format: "format",
    pattern: "pattern",
    maximum: "maximum",
    minimum: "minimum",
    minItems: "minItems",
    maxLength: "maxLength",
    additionalProperties: "additional_properties",
    const: "const",
    properties: "properties"
  };
  const code = keywordMap[e.keyword] || e.keyword || "validation";
  const path = normalizePath(e.instancePath || "", e);
  const message = e.message || "validation error";
  if (e.keyword === "required" && e.params && e.params.missingProperty) {
    return {
      path: `${path}.${e.params.missingProperty}`,
      error_code: code,
      message: `missing required property "${path}.${e.params.missingProperty}"`
    };
  }
  return { path, error_code: code, message };
}

function normalizePath(instancePath /* string */) {
  if (!instancePath) return ".";
  const parts = instancePath.split("/").filter(Boolean);
  if (!parts.length) return ".";
  let out = "";
  for (const seg of parts) {
    if (/^\d+$/.test(seg)) out += `[${seg}]`;
    else out += `.${seg}`;
  }
  return out || ".";
}

// --- Idempotency helpers (KV) ------------------------------------------
async function idempotencyLookup(env, key) {
  if (!env?.IDEMPOTENCY_KV) return null;
  try {
    const v = await env.IDEMPOTENCY_KV.get(`import:${key}`, { type: "json" });
    return v || null;
  } catch {
    return null;
  }
}

async function idempotencyStore(env, key, payload) {
  if (!env?.IDEMPOTENCY_KV) return;
  try {
    await env.IDEMPOTENCY_KV.put(`import:${key}`, JSON.stringify(payload), { expirationTtl: 3600 });
  } catch { /* noop */ }
}