import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, withGuard, ok, badRequest } from "@/lib/api";
import { slugify } from "@/lib/utils";

export const runtime = "nodejs";

export async function GET() {
  return withGuard(async () => {
    await requireAuth();
    const items = await prisma.photoCategory.findMany();
    return ok({ items });
  });
}

export async function POST(req: NextRequest) {
  return withGuard(async () => {
    await requireAuth();
    const body = await req.json();
    if (!body.name_ru?.trim() && !body.name_kz?.trim()) {
      return badRequest("Name is required");
    }
    const slug = body.slug?.trim() || slugify(body.name_ru || body.name_kz);
    const existing = await prisma.photoCategory.findUnique({ where: { slug } });
    if (existing) return badRequest("Category already exists");
    const cat = await prisma.photoCategory.create({
      data: {
        slug,
        name_kz: body.name_kz || body.name_ru,
        name_ru: body.name_ru || body.name_kz,
      },
    });
    return ok(cat, 201);
  });
}
