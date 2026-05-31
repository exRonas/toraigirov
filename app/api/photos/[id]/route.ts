import { NextRequest } from "next/server";
import { unlink } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/db";
import { requireAuth, withGuard, ok } from "@/lib/api";

export const runtime = "nodejs";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  return withGuard(async () => {
    await requireAuth();
    const body = await req.json();
    const photo = await prisma.photo.update({
      where: { id: params.id },
      data: {
        ...(body.title_kz !== undefined ? { title_kz: body.title_kz || null } : {}),
        ...(body.title_ru !== undefined ? { title_ru: body.title_ru || null } : {}),
        ...(body.altText !== undefined ? { altText: body.altText || null } : {}),
        ...(body.category !== undefined ? { category: body.category } : {}),
        ...(body.sortOrder !== undefined ? { sortOrder: body.sortOrder } : {}),
      },
    });
    return ok(photo);
  });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  return withGuard(async () => {
    await requireAuth();
    const photo = await prisma.photo.findUnique({ where: { id: params.id } });
    await prisma.photo.delete({ where: { id: params.id } });
    // Best-effort removal of the file from disk.
    if (photo?.filename?.startsWith("/uploads/")) {
      try {
        await unlink(path.join(process.cwd(), "public", photo.filename));
      } catch {
        /* ignore missing file */
      }
    }
    return ok({ success: true });
  });
}
