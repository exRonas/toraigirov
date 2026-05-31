import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, withGuard, ok, badRequest } from "@/lib/api";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  return withGuard(async () => {
    await requireAuth();
    const category = req.nextUrl.searchParams.get("category") || "";
    const where = category ? { category } : {};
    const items = await prisma.photo.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
    return ok({ items, total: items.length });
  });
}

// Accepts a single photo or { photos: [...] } for multi-upload.
export async function POST(req: NextRequest) {
  return withGuard(async () => {
    await requireAuth();
    const body = await req.json();
    const list = Array.isArray(body.photos) ? body.photos : [body];

    const created = [];
    for (const p of list) {
      if (!p.filename) return badRequest("filename is required");
      const photo = await prisma.photo.create({
        data: {
          filename: p.filename,
          title_kz: p.title_kz || null,
          title_ru: p.title_ru || null,
          altText: p.altText || null,
          category: p.category || "general",
          sortOrder: p.sortOrder ?? 0,
        },
      });
      created.push(photo);
    }
    return ok({ items: created }, 201);
  });
}
