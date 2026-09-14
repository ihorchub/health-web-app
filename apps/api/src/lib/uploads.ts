import { createWriteStream } from "node:fs";
import { mkdir, stat, unlink } from "node:fs/promises";
import path from "node:path";
import { pipeline } from "node:stream/promises";

import type { MultipartFile } from "@fastify/multipart";

import { newId } from "./ids.js";

const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
]);

export async function saveLicenseFile(file: MultipartFile): Promise<string> {
  if (!ALLOWED_TYPES.has(file.mimetype)) {
    throw new Error("INVALID_FILE_TYPE");
  }

  const dir = path.resolve(process.cwd(), "uploads", "licenses");
  await mkdir(dir, { recursive: true });

  const ext = path.extname(file.filename) || ".bin";
  const key = `${newId("lic")}${ext}`;
  const absolute = path.join(dir, key);

  await pipeline(file.file, createWriteStream(absolute, { flags: "w" }));

  const fileStat = await stat(absolute);
  if (fileStat.size > MAX_BYTES) {
    await unlink(absolute);
    throw new Error("FILE_TOO_LARGE");
  }

  return `uploads/licenses/${key}`;
}
