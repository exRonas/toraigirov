import { NextRequest } from "next/server";
import { withGuard, ok } from "@/lib/api";
import { searchIndex, type DocType } from "@/lib/search-index";

export const runtime = "nodejs";

const VALID: DocType[] = ["article", "poem", "bibliography", "page"];

// Public JSON search endpoint: /api/search?q=...&type=...
export async function GET(req: NextRequest) {
  return withGuard(async () => {
    const sp = req.nextUrl.searchParams;
    const q = (sp.get("q") || "").trim();
    const type = sp.get("type") || "";
    const docType = VALID.includes(type as DocType) ? (type as DocType) : undefined;
    if (!q) return ok({ hits: [] });
    const hits = await searchIndex(q, docType);
    return ok({ hits });
  });
}
