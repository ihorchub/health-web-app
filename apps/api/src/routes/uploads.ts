/**
 * Public static files for SCR-07 profile photos (and license files if linked).
 * Paths stored in DB look like `uploads/photos/…` → served at `/api/uploads/photos/…`.
 */
import { createReadStream } from "node:fs";
import { access } from "node:fs/promises";
import path from "node:path";
import { constants as fsConstants } from "node:fs";

import type { FastifyPluginAsync } from "fastify";

const UPLOADS_ROOT = path.resolve(process.cwd(), "uploads");

export const uploadsRoutes: FastifyPluginAsync = async (app) => {
  // Static binary serve — not a typed API. Hide from OpenAPI so Orval does not emit broken `/*` params.
  app.get<{ Params: { "*": string } }>(
    "/api/uploads/*",
    { schema: { hide: true } },
    async (request, reply) => {
      const rel = request.params["*"] ?? "";
      const normalized = path.normalize(rel).replace(/^([/\\])+/, "");
      if (!normalized || normalized.startsWith("..")) {
        return reply.code(400).send({ message: "Invalid path" });
      }

      const absolute = path.resolve(UPLOADS_ROOT, normalized);
      if (!absolute.startsWith(UPLOADS_ROOT + path.sep) && absolute !== UPLOADS_ROOT) {
        return reply.code(400).send({ message: "Invalid path" });
      }

      try {
        await access(absolute, fsConstants.R_OK);
      } catch {
        return reply.code(404).send({ message: "Not found" });
      }

      const ext = path.extname(absolute).toLowerCase();
      const type =
        ext === ".png"
          ? "image/png"
          : ext === ".webp"
            ? "image/webp"
            : ext === ".jpg" || ext === ".jpeg"
              ? "image/jpeg"
              : ext === ".pdf"
                ? "application/pdf"
                : "application/octet-stream";

      return reply.type(type).send(createReadStream(absolute));
    },
  );
};
