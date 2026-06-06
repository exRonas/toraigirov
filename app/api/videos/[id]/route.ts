import { NextRequest } from "next/server";
import { unlink } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/db";
import { requireAuth, withGuard, ok, badRequest } from "@/lib/api";
import { extractYouTubeId } from "@/lib/youtube";

export const runtime = "nodejs";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  return withGuard(async () => {
    await requireAuth();
    const body = await req.json();
    const data: Record<string, unknown> = {};
    if (body.title_kz !== undefined) data.title_kz = body.title_kz;
    if (body.title_ru !== undefined) data.title_ru = body.title_ru;
    if (body.category !== undefined) data.category = body.category;
    if (body.youtubeUrl) {
      const id = extractYouTubeId(body.youtubeUrl);
      if (!id) return badRequest("Invalid YouTube URL");
      data.youtubeUrl = body.youtubeUrl;
      data.youtubeId = id;
    }
    const video = await prisma.video.update({ where: { id: params.id }, data });
    return ok(video);
  });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  return withGuard(async () => {
    await requireAuth();
    const video = await prisma.video.findUnique({ where: { id: params.id } });
    if (video?.videoFile) {
      const filename = path.basename(video.videoFile);
      const filePath = path.join(process.cwd(), "public", "uploads", filename);
      await unlink(filePath).catch(() => {});
    }
    await prisma.video.delete({ where: { id: params.id } });
    return ok({ success: true });
  });
}
