import type { FastifyRequest } from "fastify";

import { ApiError } from "./errors.js";
import { saveCertificateImage, saveProfilePhoto } from "./uploads.js";

const JSON_ARRAY_FIELDS = new Set(["education", "languages"]);
const EDUCATION_IMAGE_FIELD = /^educationImage_(\d+)$/;

/**
 * SCR-07 PATCH body: JSON application/json **or** multipart/form-data with optional `photo` file
 * and optional `educationImage_<index>` files for certificate images.
 * Files are written under `uploads/`; only paths are stored on the profile / education rows.
 */
export async function parseProfilePatchBody(request: FastifyRequest): Promise<Record<string, unknown>> {
  const contentType = request.headers["content-type"] ?? "";
  if (!contentType.includes("multipart/form-data")) {
    return (request.body ?? {}) as Record<string, unknown>;
  }

  const fields: Record<string, unknown> = {};
  const educationImages: Record<number, string> = {};

  for await (const part of request.parts()) {
    if (part.type === "file") {
      if (part.fieldname === "photo") {
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

      const match = EDUCATION_IMAGE_FIELD.exec(part.fieldname);
      if (match) {
        const index = Number(match[1]);
        try {
          educationImages[index] = await saveCertificateImage(part);
        } catch (err) {
          const code = err instanceof Error ? err.message : "INVALID";
          if (code === "FILE_TOO_LARGE") {
            throw new ApiError("AUTH_VALIDATION_FAILED", 400, {
              educationImage: "FILE_TOO_LARGE",
            });
          }
          throw new ApiError("AUTH_VALIDATION_FAILED", 400, { educationImage: "INVALID" });
        }
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

  if (Array.isArray(fields.education) && Object.keys(educationImages).length > 0) {
    fields.education = (fields.education as Array<Record<string, unknown>>).map((item, index) => {
      const uploaded = educationImages[index];
      if (!uploaded) {
        return item;
      }
      return { ...item, imageUrl: uploaded };
    });
  }

  return fields;
}
