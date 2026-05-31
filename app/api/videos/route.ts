import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, withGuard, ok, badRequest } from "@/lib/api";
import { extractYouTubeId } from "@/lib/youtube";

export const runtime = "nodejs";

export async function GET() {
  return withGuard(async () => {
    await requireAuth();
    const items = await prisma.video.findMany({ orderBy: { createdAt: "desc" } });
    return ok({ items, total: items.length });
  });
}

export async function POST(req: NextRequest) {
  return withGuard(async () => {
    await requireAuth();
    const body = await req.json();
    const youtubeId = extractYouTubeId(body.youtubeUrl || "");
    if (!youtubeId) return badRequest("Invalid YouTube URL");
    const video = await prisma.video.create({
      data: {
        youtubeUrl: body.youtubeUrl,
        youtubeId,
        title_kz: body.title_kz || "",
        title_ru: body.title_ru || "",
        category: body.category || "general",
      },
    });
    return ok(video, 201);
  });
}
