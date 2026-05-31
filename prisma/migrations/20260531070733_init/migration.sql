-- CreateTable
CREATE TABLE "Article" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sectionSlug" TEXT NOT NULL,
    "title_kz" TEXT NOT NULL,
    "title_ru" TEXT NOT NULL,
    "content_kz" TEXT NOT NULL,
    "content_ru" TEXT NOT NULL,
    "coverImage" TEXT,
    "publishedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isDraft" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Poem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title_kz" TEXT NOT NULL,
    "title_ru" TEXT NOT NULL,
    "text_kz" TEXT NOT NULL,
    "text_ru" TEXT NOT NULL,
    "yearWritten" INTEGER,
    "audioFile" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Photo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "filename" TEXT NOT NULL,
    "title_kz" TEXT,
    "title_ru" TEXT,
    "altText" TEXT,
    "category" TEXT NOT NULL DEFAULT 'general',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "PhotoCategory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name_kz" TEXT NOT NULL,
    "name_ru" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Video" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "youtubeUrl" TEXT NOT NULL,
    "youtubeId" TEXT NOT NULL,
    "title_kz" TEXT NOT NULL,
    "title_ru" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'general',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "BibliographyEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "author" TEXT NOT NULL,
    "title_kz" TEXT NOT NULL,
    "title_ru" TEXT NOT NULL,
    "year" INTEGER,
    "publisher" TEXT,
    "type" TEXT NOT NULL DEFAULT 'book',
    "notes_kz" TEXT,
    "notes_ru" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Page" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title_kz" TEXT NOT NULL,
    "title_ru" TEXT NOT NULL,
    "content_kz" TEXT NOT NULL,
    "content_ru" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'singleton',
    "heroQuote_kz" TEXT NOT NULL DEFAULT '',
    "heroQuote_ru" TEXT NOT NULL DEFAULT '',
    "quoteAuthor_kz" TEXT NOT NULL DEFAULT 'Сұлтанмахмұт Торайғыров',
    "quoteAuthor_ru" TEXT NOT NULL DEFAULT 'Султанмахмут Торайгыров',
    "siteTitle_kz" TEXT NOT NULL DEFAULT 'Виртуалды энциклопедия',
    "siteTitle_ru" TEXT NOT NULL DEFAULT 'Виртуальная энциклопедия',
    "footerText_kz" TEXT NOT NULL DEFAULT '',
    "footerText_ru" TEXT NOT NULL DEFAULT '',
    "linkVk" TEXT NOT NULL DEFAULT '',
    "linkFacebook" TEXT NOT NULL DEFAULT '',
    "linkTelegram" TEXT NOT NULL DEFAULT '',
    "linkInstagram" TEXT NOT NULL DEFAULT '',
    "linkYoutube" TEXT NOT NULL DEFAULT '',
    "contactAddress" TEXT NOT NULL DEFAULT '',
    "contactPhone" TEXT NOT NULL DEFAULT '',
    "contactEmail" TEXT NOT NULL DEFAULT '',
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "Article_sectionSlug_idx" ON "Article"("sectionSlug");

-- CreateIndex
CREATE INDEX "Article_isDraft_idx" ON "Article"("isDraft");

-- CreateIndex
CREATE INDEX "Photo_category_idx" ON "Photo"("category");

-- CreateIndex
CREATE UNIQUE INDEX "PhotoCategory_slug_key" ON "PhotoCategory"("slug");

-- CreateIndex
CREATE INDEX "BibliographyEntry_type_idx" ON "BibliographyEntry"("type");

-- CreateIndex
CREATE UNIQUE INDEX "Page_slug_key" ON "Page"("slug");
