import { prisma } from "@/lib/db";
import { stripHtml } from "@/lib/utils";

export type DocType = "article" | "poem" | "bibliography" | "page";

type IndexDoc = {
  docType: DocType;
  docId: string;
  slug?: string | null;
  title_kz?: string | null;
  title_ru?: string | null;
  body_kz?: string | null;
  body_ru?: string | null;
};

/** Insert/replace a document in the FTS index. */
export async function reindexDoc(doc: IndexDoc): Promise<void> {
  await removeDoc(doc.docType, doc.docId);
  await prisma.$executeRaw`
    INSERT INTO "SearchIndex" (docType, docId, slug, title_kz, title_ru, body_kz, body_ru)
    VALUES (
      ${doc.docType},
      ${doc.docId},
      ${doc.slug ?? ""},
      ${doc.title_kz ?? ""},
      ${doc.title_ru ?? ""},
      ${stripHtml(doc.body_kz ?? "")},
      ${stripHtml(doc.body_ru ?? "")}
    )`;
}

export async function removeDoc(docType: DocType, docId: string): Promise<void> {
  await prisma.$executeRaw`
    DELETE FROM "SearchIndex" WHERE docType = ${docType} AND docId = ${docId}`;
}

/** Turn a free-text query into a safe FTS5 prefix MATCH expression. */
export function toMatchQuery(raw: string): string {
  const tokens = raw
    .toLowerCase()
    .replace(/["'()*:^]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 8);
  if (tokens.length === 0) return "";
  return tokens.map((tok) => `"${tok}"*`).join(" ");
}

export type SearchHit = {
  docType: DocType;
  docId: string;
  slug: string;
  title_kz: string;
  title_ru: string;
  snippet_kz: string;
  snippet_ru: string;
};

export async function searchIndex(
  raw: string,
  type?: DocType
): Promise<SearchHit[]> {
  const match = toMatchQuery(raw);
  if (!match) return [];

  // Column order: 0 docType, 1 docId, 2 slug, 3 title_kz, 4 title_ru, 5 body_kz, 6 body_ru
  const typeFilter = type ? `AND docType = '${type}'` : "";
  const sql = `
    SELECT docType, docId, slug, title_kz, title_ru,
           snippet("SearchIndex", 5, '<mark>', '</mark>', '…', 12) AS snippet_kz,
           snippet("SearchIndex", 6, '<mark>', '</mark>', '…', 12) AS snippet_ru
    FROM "SearchIndex"
    WHERE "SearchIndex" MATCH ? ${typeFilter}
    ORDER BY rank
    LIMIT 60`;

  const rows = await prisma.$queryRawUnsafe<SearchHit[]>(sql, match);
  return rows;
}
