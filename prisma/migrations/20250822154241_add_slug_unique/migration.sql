/*
  Warnings:

  - Added the required column `slug` to the `Link` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Link" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "logoUrl" TEXT NOT NULL,
    "backgroundCss" TEXT NOT NULL,
    "textColor" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "targetUrl" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Link" ("backgroundCss", "createdAt", "id", "label", "logoUrl", "targetUrl", "textColor", "updatedAt", "username") SELECT "backgroundCss", "createdAt", "id", "label", "logoUrl", "targetUrl", "textColor", "updatedAt", "username" FROM "Link";
DROP TABLE "Link";
ALTER TABLE "new_Link" RENAME TO "Link";
CREATE UNIQUE INDEX "Link_slug_key" ON "Link"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
