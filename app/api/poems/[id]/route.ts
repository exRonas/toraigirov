import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, withGuard, ok, badRequest } from "@/lib/api";
import { reindexDoc, removeDoc } from "@/lib/search-index";

export const runtime = "nodejs";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  return withGuard(async () => {
    await requireAuth();
    const poem = await prisma.poem.findUnique({ where: { id: params.id } });
    if (!poem) return badRequest("Not found");
    return ok(poem);
  });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  return withGuard(async () => {
    await requireAuth();
    const body = await req.json();
    const poem = await prisma.poem.update({
      where: { id: params.id },
      data: {
        ...(body.title_kz !== undefined ? { title_kz: body.title_kz } : {}),
        ...(body.title_ru !== undefined ? { title_ru: body.title_ru } : {}),
        ...(body.text_kz !== undefined ? { text_kz: body.text_kz } : {}),
        ...(body.text_ru !== undefined ? { text_ru: body.text_ru } : {}),
        ...(body.yearWritten !== undefined
          ? { yearWritten: body.yearWritten ? parseInt(String(body.yearWritten), 10) : null }
          : {}),
        ...(body.audioFile !== undefined ? { audioFile: body.audioFile || null } : {}),
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
    return ok(poem);
  });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  return withGuard(async () => {
    await requireAuth();
    await prisma.poem.delete({ where: { id: params.id } });
    await removeDoc("poem", params.id);
    return ok({ success: true });
  });
}
