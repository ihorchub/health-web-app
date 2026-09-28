/**
 * Builds the Fastify app (no listen) and writes OpenAPI JSON for Orval.
 * Output: apps/web/openapi/openapi.json
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { buildApp } from "../app.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.resolve(here, "../../../../apps/web/openapi/openapi.json");

function isNullSchema(node: unknown): boolean {
  if (!node || typeof node !== "object" || Array.isArray(node)) return false;
  const o = node as Record<string, unknown>;
  if (o.type === "null") return true;
  return (
    o.type === "object" &&
    o.nullable === true &&
    Array.isArray(o.enum) &&
    o.enum.length === 1 &&
    o.enum[0] === null
  );
}

/**
 * OpenAPI 3.0: flatten `anyOf: [Schema, null]` → `{ ...Schema, nullable: true }`
 * so Orval accepts the document (type: null is 3.1-only).
 */
function fixNullSchemas(node: unknown): unknown {
  if (Array.isArray(node)) return node.map(fixNullSchemas);
  if (!node || typeof node !== "object") return node;

  const o = node as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(o)) {
    out[k] = fixNullSchemas(v);
  }

  const unionKey = out.anyOf ? "anyOf" : out.oneOf ? "oneOf" : null;
  if (unionKey && Array.isArray(out[unionKey])) {
    const parts = out[unionKey] as unknown[];
    const nonNull = parts.filter((p) => !isNullSchema(p));
    const hadNull = nonNull.length < parts.length;
    if (hadNull && nonNull.length === 1 && nonNull[0] && typeof nonNull[0] === "object") {
      const only = { ...(nonNull[0] as Record<string, unknown>), nullable: true };
      // Prefer collapsing into the parent object shape.
      return only;
    }
    if (hadNull && nonNull.length > 1) {
      return { anyOf: nonNull, nullable: true };
    }
  }

  return out;
}

const app = await buildApp({ docsUi: false });
await app.ready();

const spec = fixNullSchemas(app.swagger()) as {
  paths?: Record<string, unknown>;
  servers?: Array<{ url: string; description?: string }>;
  [key: string]: unknown;
};

// FE Axios baseURL is `/api` (vite proxy). Strip `/api` from path keys so Orval
// emits `/v1/...` URLs that compose correctly with that baseURL.
if (spec.paths) {
  const rewritten: Record<string, unknown> = {};
  for (const [url, def] of Object.entries(spec.paths)) {
    const next = url.startsWith("/api/") ? url.slice("/api".length) : url;
    rewritten[next.length > 0 ? next : "/"] = def;
  }
  spec.paths = rewritten;
}
spec.servers = [{ url: "/api", description: "Vite proxy / same-origin /api" }];

await mkdir(path.dirname(outPath), { recursive: true });
await writeFile(outPath, `${JSON.stringify(spec, null, 2)}\n`, "utf8");

await app.close();

// eslint-disable-next-line no-console
console.log(`Wrote OpenAPI → ${outPath}`);
