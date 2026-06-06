-- Add videoFile column and make youtubeUrl/youtubeId nullable
-- SQLite cannot ALTER COLUMN to remove NOT NULL, so we recreate the table.

CREATE TABLE "_Video_new" (
  "id"         TEXT     NOT NULL PRIMARY KEY,
  "youtubeUrl" TEXT,
  "youtubeId"  TEXT,
  "videoFile"  TEXT,
  "title_kz"   TEXT     NOT NULL DEFAULT '',
  "title_ru"   TEXT     NOT NULL DEFAULT '',
  "category"   TEXT     NOT NULL DEFAULT 'general',
  "createdAt"  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO "_Video_new" ("id","youtubeUrl","youtubeId","title_kz","title_ru","category","createdAt")
SELECT "id","youtubeUrl","youtubeId","title_kz","title_ru","category","createdAt" FROM "Video";

DROP TABLE "Video";

ALTER TABLE "_Video_new" RENAME TO "Video";
