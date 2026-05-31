import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, withGuard, ok, badRequest } from "@/lib/api";
import { extractYouTubeId } from "@/lib/youtube";

export const runtime = "nodejs";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  return withGuard(async () => {
    await requireAuth();
    const body = await req.json();
    const data: any = {
      ...(body.title_kz !== undefined ? { title_kz: body.title_kz } : {}),
      ...(body.title_ru !== undefined ? { title_ru: body.title_ru } : {}),
      ...(body.category !== undefined ? { category: body.category } : {}),
    };
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
    await prisma.video.delete({ where: { id: params.id } });
    return ok({ success: true });
  });
}
