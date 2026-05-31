-- Full-text search index (SQLite FTS5).
-- A single unified index across articles, poems, bibliography and static pages.
-- Maintained from application code via lib/search-index.ts (reindexDoc / removeDoc).
--
-- Columns:
--   docType  : 'article' | 'poem' | 'bibliography' | 'page'   (UNINDEXED — stored, not searched)
--   docId    : source row id                                  (UNINDEXED)
--   slug     : optional routing slug                          (UNINDEXED)
--   title_kz, title_ru, body_kz, body_ru : searchable text columns

CREATE VIRTUAL TABLE IF NOT EXISTS "SearchIndex" USING fts5 (
  docType UNINDEXED,
  docId UNINDEXED,
  slug UNINDEXED,
  title_kz,
  title_ru,
  body_kz,
  body_ru,
  tokenize = 'unicode61 remove_diacritics 2'
);
