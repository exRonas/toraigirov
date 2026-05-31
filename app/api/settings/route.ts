import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, withGuard, ok } from "@/lib/api";

export const runtime = "nodejs";

const FIELDS = [
  "heroQuote_kz", "heroQuote_ru", "quoteAuthor_kz", "quoteAuthor_ru",
  "siteTitle_kz", "siteTitle_ru", "footerText_kz", "footerText_ru",
  "linkVk", "linkFacebook", "linkTelegram", "linkInstagram", "linkYoutube",
  "contactAddress", "contactPhone", "contactEmail",
];

export async function GET() {
  return withGuard(async () => {
    await requireAuth();
    const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
    return ok(settings);
  });
}

export async function PUT(req: NextRequest) {
  return withGuard(async () => {
    await requireAuth();
    const body = await req.json();
    const data: Record<string, string> = {};
    for (const f of FIELDS) {
      if (body[f] !== undefined) data[f] = String(body[f] ?? "");
    }
    const settings = await prisma.siteSettings.upsert({
      where: { id: "singleton" },
      update: data,
      create: { id: "singleton", ...data },
    });
    return ok(settings);
  });
}
