import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, withGuard, ok, badRequest } from "@/lib/api";
import { reindexDoc, removeDoc } from "@/lib/search-index";

export const runtime = "nodejs";

const TYPES = ["book", "article", "dissertation", "other"];

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  return withGuard(async () => {
    await requireAuth();
    const entry = await prisma.bibliographyEntry.findUnique({ where: { id: params.id } });
    if (!entry) return badRequest("Not found");
    return ok(entry);
  });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  return withGuard(async () => {
    await requireAuth();
    const body = await req.json();
    const entry = await prisma.bibliographyEntry.update({
      where: { id: params.id },
      data: {
        ...(body.author !== undefined ? { author: body.author } : {}),
        ...(body.title_kz !== undefined ? { title_kz: body.title_kz } : {}),
        ...(body.title_ru !== undefined ? { title_ru: body.title_ru } : {}),
        ...(body.year !== undefined
          ? { year: body.year ? parseInt(String(body.year), 10) : null }
          : {}),
        ...(body.publisher !== undefined ? { publisher: body.publisher || null } : {}),
        ...(body.type !== undefined && TYPES.includes(body.type) ? { type: body.type } : {}),
        ...(body.notes_kz !== undefined ? { notes_kz: body.notes_kz || null } : {}),
        ...(body.notes_ru !== undefined ? { notes_ru: body.notes_ru || null } : {}),
      },
    });
    await reindexDoc({
      docType: "bibliography",
      docId: entry.id,
      title_kz: entry.title_kz,
      title_ru: entry.title_ru,
      body_kz: `${entry.author} ${entry.notes_kz ?? ""}`,
      body_ru: `${entry.author} ${entry.notes_ru ?? ""}`,
    });
    return ok(entry);
  });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  return withGuard(async () => {
    await requireAuth();
    await prisma.bibliographyEntry.delete({ where: { id: params.id } });
    await removeDoc("bibliography", params.id);
    return ok({ success: true });
  });
}
