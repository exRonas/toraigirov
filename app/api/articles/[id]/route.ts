import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, withGuard, ok, badRequest } from "@/lib/api";
import { reindexDoc, removeDoc } from "@/lib/search-index";
import { SECTION_SLUGS } from "@/lib/sections";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  return withGuard(async () => {
    await requireAuth();
    const article = await prisma.article.findUnique({ where: { id: params.id } });
    if (!article) return badRequest("Not found");
    return ok(article);
  });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return withGuard(async () => {
    await requireAuth();
    const body = await req.json();
    if (body.sectionSlug && !SECTION_SLUGS.includes(body.sectionSlug)) {
      return badRequest("Invalid section");
    }

    const article = await prisma.article.update({
      where: { id: params.id },
      data: {
        ...(body.sectionSlug ? { sectionSlug: body.sectionSlug } : {}),
        ...(body.title_kz !== undefined ? { title_kz: body.title_kz } : {}),
        ...(body.title_ru !== undefined ? { title_ru: body.title_ru } : {}),
        ...(body.content_kz !== undefined ? { content_kz: body.content_kz } : {}),
        ...(body.content_ru !== undefined ? { content_ru: body.content_ru } : {}),
        ...(body.coverImage !== undefined ? { coverImage: body.coverImage || null } : {}),
        ...(body.isDraft !== undefined ? { isDraft: body.isDraft } : {}),
        ...(body.publishedAt ? { publishedAt: new Date(body.publishedAt) } : {}),
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

    return ok(article);
  });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  return withGuard(async () => {
    await requireAuth();
    await prisma.article.delete({ where: { id: params.id } });
    await removeDoc("article", params.id);
    return ok({ success: true });
  });
}
