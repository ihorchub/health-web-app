import type { FastifyRequest } from "fastify";

import { ApiError } from "./errors.js";
import { saveProfilePhoto } from "./uploads.js";

const JSON_ARRAY_FIELDS = new Set(["education", "languages"]);

/**
 * SCR-07 PATCH body: JSON application/json **or** multipart/form-data with optional `photo` file.
 * File is written under `uploads/photos/`; only the path is returned as `photoUrl`.
 */
export async function parseProfilePatchBody(request: FastifyRequest): Promise<Record<string, unknown>> {
  const contentType = request.headers["content-type"] ?? "";
  if (!contentType.includes("multipart/form-data")) {
    return (request.body ?? {}) as Record<string, unknown>;
  }

  const fields: Record<string, unknown> = {};

  for await (const part of request.parts()) {
    if (part.type === "file") {
      if (part.fieldname !== "photo") continue;
      try {
        fields.photoUrl = await saveProfilePhoto(part);
      } catch (err) {
        const code = err instanceof Error ? err.message : "INVALID";
        if (code === "FILE_TOO_LARGE") {
          throw new ApiError("AUTH_VALIDATION_FAILED", 400, { photo: "FILE_TOO_LARGE" });
        }
        throw new ApiError("AUTH_VALIDATION_FAILED", 400, { photo: "INVALID" });
      }
      continue;
    }

    const raw = String(part.value);
    if (JSON_ARRAY_FIELDS.has(part.fieldname)) {
      try {
        fields[part.fieldname] = JSON.parse(raw);
      } catch {
        throw new ApiError("AUTH_VALIDATION_FAILED", 400, { [part.fieldname]: "INVALID" });
      }
      continue;
    }

    if (raw === "null") {
      fields[part.fieldname] = null;
    } else if (raw === "true" || raw === "false") {
      fields[part.fieldname] = raw === "true";
    } else {
      fields[part.fieldname] = raw;
    }
  }

  return fields;
}
