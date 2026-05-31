import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, withGuard, ok, badRequest } from "@/lib/api";
import { reindexDoc } from "@/lib/search-index";

export const runtime = "nodejs";

const TYPES = ["book", "article", "dissertation", "other"];

export async function GET(req: NextRequest) {
  return withGuard(async () => {
    await requireAuth();
    const sp = req.nextUrl.searchParams;
    const q = (sp.get("q") || "").trim();
    const type = sp.get("type") || "";
    const where: any = {};
    if (type && TYPES.includes(type)) where.type = type;
    if (q) {
      where.OR = [
        { author: { contains: q } },
        { title_kz: { contains: q } },
        { title_ru: { contains: q } },
      ];
    }
    const items = await prisma.bibliographyEntry.findMany({
      where,
      orderBy: { year: "desc" },
    });
    return ok({ items, total: items.length });
  });
}

export async function POST(req: NextRequest) {
  return withGuard(async () => {
    await requireAuth();
    const body = await req.json();
    if (!body.author?.trim()) return badRequest("Author is required");
    const entry = await prisma.bibliographyEntry.create({
      data: {
        author: body.author,
        title_kz: body.title_kz || "",
        title_ru: body.title_ru || "",
        year: body.year ? parseInt(String(body.year), 10) : null,
        publisher: body.publisher || null,
        type: TYPES.includes(body.type) ? body.type : "book",
        notes_kz: body.notes_kz || null,
        notes_ru: body.notes_ru || null,
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
    return ok(entry, 201);
  });
}
