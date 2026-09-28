import { createReadStream } from "node:fs";
import { mkdir, writeFile, unlink } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";

import { afterAll, describe, expect, it } from "vitest";

import { saveProfilePhoto } from "./uploads.js";

describe("saveProfilePhoto", () => {
  const tmpDir = path.resolve(process.cwd(), "uploads", "photos");
  const created: string[] = [];

  afterAll(async () => {
    for (const rel of created) {
      try {
        await unlink(path.resolve(process.cwd(), rel));
      } catch {
        /* ignore */
      }
    }
  });

  it("saves an image under uploads/photos and returns a relative path", async () => {
    await mkdir(tmpDir, { recursive: true });
    const src = path.join(tmpDir, "_fixture_src.jpg");
    // Minimal JPEG-ish bytes (not a valid image decode, but enough for mime + size checks).
    await writeFile(src, Buffer.from([0xff, 0xd8, 0xff, 0xd9, ...Buffer.alloc(64, 1)]));

    const stream = createReadStream(src);
    const file = {
      fieldname: "photo",
      filename: "avatar.jpg",
      encoding: "7bit",
      mimetype: "image/jpeg",
      file: stream,
      fields: {},
      type: "file" as const,
      toBuffer: async () => Buffer.alloc(0),
    };

    const savedPath = await saveProfilePhoto(file as never);
    created.push(savedPath);

    expect(savedPath.startsWith("uploads/photos/")).toBe(true);
    expect(savedPath.endsWith(".jpg")).toBe(true);

    await unlink(src).catch(() => undefined);
  });

  it("rejects non-image mime types", async () => {
    const stream = Readable.from([Buffer.from("%PDF-1.4")]);
    const file = {
      fieldname: "photo",
      filename: "doc.pdf",
      encoding: "7bit",
      mimetype: "application/pdf",
      file: stream,
      fields: {},
      type: "file" as const,
      toBuffer: async () => Buffer.alloc(0),
    };

    await expect(saveProfilePhoto(file as never)).rejects.toThrow("INVALID_FILE_TYPE");
  });
});
