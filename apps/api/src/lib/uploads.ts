import { createWriteStream } from "node:fs";
import { mkdir, stat, unlink } from "node:fs/promises";
import path from "node:path";
import { pipeline } from "node:stream/promises";

import type { MultipartFile } from "@fastify/multipart";

import { newId } from "./ids.js";

const MAX_BYTES = 10 * 1024 * 1024;
const LICENSE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
]);
const PHOTO_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

async function saveUpload(
  file: MultipartFile,
  opts: { subdir: string; prefix: string; allowedTypes: Set<string> },
): Promise<string> {
  if (!opts.allowedTypes.has(file.mimetype)) {
    throw new Error("INVALID_FILE_TYPE");
  }

  const dir = path.resolve(process.cwd(), "uploads", opts.subdir);
  await mkdir(dir, { recursive: true });

  const ext = path.extname(file.filename) || ".bin";
  const key = `${newId(opts.prefix)}${ext}`;
  const absolute = path.join(dir, key);

  await pipeline(file.file, createWriteStream(absolute, { flags: "w" }));

  const fileStat = await stat(absolute);
  if (fileStat.size > MAX_BYTES) {
    await unlink(absolute);
    throw new Error("FILE_TOO_LARGE");
  }

  return `uploads/${opts.subdir}/${key}`;
}

export async function saveLicenseFile(file: MultipartFile): Promise<string> {
  return saveUpload(file, { subdir: "licenses", prefix: "lic", allowedTypes: LICENSE_TYPES });
}

/** SCR-07 profile photo — images only, max 10 MB; path stored in DB, file on disk. */
export async function saveProfilePhoto(file: MultipartFile): Promise<string> {
  return saveUpload(file, { subdir: "photos", prefix: "photo", allowedTypes: PHOTO_TYPES });
}

/** SCR-07 education/certificate image — images only, max 10 MB. */
export async function saveCertificateImage(file: MultipartFile): Promise<string> {
  return saveUpload(file, {
    subdir: "certificates",
    prefix: "cert",
    allowedTypes: PHOTO_TYPES,
  });
}
