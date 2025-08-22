-- CreateTable
CREATE TABLE "Link" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "logoUrl" TEXT NOT NULL,
    "backgroundCss" TEXT NOT NULL,
    "textColor" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "targetUrl" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "MediaItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT NOT NULL,
    "src" TEXT,
    "description" TEXT,
    "author" TEXT,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "shares" INTEGER NOT NULL DEFAULT 0,
    "views" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AboutUs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT NOT NULL,
    "overviewLabel" TEXT,
    "overviewContent" INTEGER,
    "statisticsLabel" TEXT,
    "statisticsContent" INTEGER,
    "siteInfoLabel" TEXT,
    "siteInfoContent" INTEGER
);

-- CreateTable
CREATE TABLE "Support" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "support_creator" TEXT NOT NULL,
    "supportUrl" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "MediaItem_slug_key" ON "MediaItem"("slug");
