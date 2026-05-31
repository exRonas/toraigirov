import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, withGuard, ok, badRequest } from "@/lib/api";
import { reindexDoc } from "@/lib/search-index";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  return withGuard(async () => {
    await requireAuth();
    const sp = req.nextUrl.searchParams;
    const page = Math.max(1, parseInt(sp.get("page") || "1", 10));
    const pageSize = 15;
    const [items, total] = await Promise.all([
      prisma.poem.findMany({
        orderBy: { updatedAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.poem.count(),
    ]);
    return ok({ items, total, page, pageSize });
  });
}

export async function POST(req: NextRequest) {
  return withGuard(async () => {
    await requireAuth();
    const body = await req.json();
    if (!body.title_kz?.trim() && !body.title_ru?.trim()) {
      return badRequest("Title is required");
    }
    const poem = await prisma.poem.create({
      data: {
        title_kz: body.title_kz || "",
        title_ru: body.title_ru || "",
        text_kz: body.text_kz || "",
        text_ru: body.text_ru || "",
        yearWritten: body.yearWritten ? parseInt(String(body.yearWritten), 10) : null,
        audioFile: body.audioFile || null,
      },
    });
    await reindexDoc({
      docType: "poem",
      docId: poem.id,
      title_kz: poem.title_kz,
      title_ru: poem.title_ru,
      body_kz: poem.text_kz,
      body_ru: poem.text_ru,
    });
    return ok(poem, 201);
  });
}
