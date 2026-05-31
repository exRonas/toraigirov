import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, withGuard, ok, badRequest } from "@/lib/api";

export const runtime = "nodejs";

export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
  return withGuard(async () => {
    await requireAuth();
    const body = await req.json();
    const cat = await prisma.photoCategory.update({
      where: { slug: params.slug },
      data: {
        ...(body.name_kz !== undefined ? { name_kz: body.name_kz } : {}),
        ...(body.name_ru !== undefined ? { name_ru: body.name_ru } : {}),
      },
    });
    return ok(cat);
  });
}

export async function DELETE(_req: NextRequest, { params }: { params: { slug: string } }) {
  return withGuard(async () => {
    await requireAuth();
    if (params.slug === "general") return badRequest("Cannot delete default category");
    // Reassign photos in this category back to 'general'.
    await prisma.photo.updateMany({
      where: { category: params.slug },
      data: { category: "general" },
    });
    await prisma.photoCategory.delete({ where: { slug: params.slug } });
    return ok({ success: true });
  });
}
