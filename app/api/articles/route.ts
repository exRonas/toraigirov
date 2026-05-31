import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, withGuard, ok, badRequest } from "@/lib/api";
import { reindexDoc } from "@/lib/search-index";
import { SECTION_SLUGS } from "@/lib/sections";

export const runtime = "nodejs";

// GET /api/articles?page=1&q=&section=&status=all|draft|published
export async function GET(req: NextRequest) {
  return withGuard(async () => {
    await requireAuth();
    const sp = req.nextUrl.searchParams;
    const page = Math.max(1, parseInt(sp.get("page") || "1", 10));
    const pageSize = 10;
    const q = (sp.get("q") || "").trim();
    const section = sp.get("section") || "";
    const status = sp.get("status") || "all";

    const where: any = {};
    if (section) where.sectionSlug = section;
    if (status === "draft") where.isDraft = true;
    if (status === "published") where.isDraft = false;
    if (q) {
      where.OR = [
        { title_kz: { contains: q } },
        { title_ru: { contains: q } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.article.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.article.count({ where }),
    ]);

    return ok({ items, total, page, pageSize });
  });
}

// POST /api/articles
export async function POST(req: NextRequest) {
  return withGuard(async () => {
    await requireAuth();
    const body = await req.json();

    if (!body.sectionSlug || !SECTION_SLUGS.includes(body.sectionSlug)) {
      return badRequest("Invalid section");
    }
    if (!body.title_kz?.trim() && !body.title_ru?.trim()) {
      return badRequest("Title is required");
    }

    const article = await prisma.article.create({
      data: {
        sectionSlug: body.sectionSlug,
        title_kz: body.title_kz || "",
        title_ru: body.title_ru || "",
        content_kz: body.content_kz || "",
        content_ru: body.content_ru || "",
        coverImage: body.coverImage || null,
        isDraft: body.isDraft ?? true,
        publishedAt: body.publishedAt ? new Date(body.publishedAt) : new Date(),
      },
    });

    await reindexDoc({
      docType: "article",
      docId: article.id,
      slug: article.sectionSlug,
      title_kz: article.title_kz,
      title_ru: article.title_ru,
      body_kz: article.content_kz,
      body_ru: article.content_ru,
    });

    return ok(article, 201);
  });
}
