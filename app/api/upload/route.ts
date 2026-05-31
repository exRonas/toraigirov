import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { requireAuth, withGuard, badRequest, ok } from "@/lib/api";

export const runtime = "nodejs";

const IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
const AUDIO_TYPES: Record<string, string> = {
  "audio/mpeg": "mp3",
  "audio/mp3": "mp3",
};

const MAX_IMAGE = 10 * 1024 * 1024; // 10 MB
const MAX_AUDIO = 25 * 1024 * 1024; // 25 MB

export async function POST(req: NextRequest) {
  return withGuard(async () => {
    await requireAuth();

    const form = await req.formData();
    const file = form.get("file");
    const kind = (form.get("kind") as string) || "image";

    if (!(file instanceof File)) {
      return badRequest("No file provided");
    }

    const allowed = kind === "audio" ? AUDIO_TYPES : IMAGE_TYPES;
    const maxSize = kind === "audio" ? MAX_AUDIO : MAX_IMAGE;
    const ext = allowed[file.type];

    if (!ext) {
      return badRequest(
        kind === "audio"
          ? "Invalid file type. Only MP3 is allowed."
          : "Invalid file type. Only JPG, PNG, WEBP are allowed."
      );
    }
    if (file.size > maxSize) {
      return badRequest(
        `File too large. Max ${Math.round(maxSize / 1024 / 1024)} MB.`
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const filename = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}.${ext}`;
    await writeFile(path.join(uploadDir, filename), buffer);

    const url = `/uploads/${filename}`;
    return ok({ url, filename });
  });
}
