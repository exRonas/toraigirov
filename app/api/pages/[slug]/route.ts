import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, withGuard, ok, badRequest } from "@/lib/api";
import { reindexDoc } from "@/lib/search-index";
import { getSection } from "@/lib/sections";

export const runtime = "nodejs";

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  return withGuard(async () => {
    await requireAuth();
    const page = await prisma.page.findUnique({ where: { slug: params.slug } });
    if (!page) return badRequest("Not found");
    return ok(page);
  });
}

export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
  return withGuard(async () => {
    await requireAuth();
    const body = await req.json();
    const section = getSection(params.slug);

    const page = await prisma.page.upsert({
      where: { slug: params.slug },
      update: {
        ...(body.title_kz !== undefined ? { title_kz: body.title_kz } : {}),
        ...(body.title_ru !== undefined ? { title_ru: body.title_ru } : {}),
        ...(body.content_kz !== undefined ? { content_kz: body.content_kz } : {}),
        ...(body.content_ru !== undefined ? { content_ru: body.content_ru } : {}),
      },
      create: {
        slug: params.slug,
        title_kz: body.title_kz ?? section?.kz ?? params.slug,
        title_ru: body.title_ru ?? section?.ru ?? params.slug,
        content_kz: body.content_kz ?? "",
        content_ru: body.content_ru ?? "",
      },
    });

    await reindexDoc({
      docType: "page",
      docId: page.id,
      slug: page.slug,
      title_kz: page.title_kz,
      title_ru: page.title_ru,
      body_kz: page.content_kz,
      body_ru: page.content_ru,
    });

    return ok(page);
  });
}
