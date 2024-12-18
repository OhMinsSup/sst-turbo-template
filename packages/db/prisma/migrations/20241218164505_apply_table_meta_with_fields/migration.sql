/*
  Warnings:

  - The primary key for the `work_spaces` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `order` on the `work_spaces` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.

*/
-- CreateTable
CREATE TABLE "table_meta" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "dbTableName" TEXT NOT NULL,
    "version" INTEGER,
    "order" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    "userId" TEXT NOT NULL,
    "workSpaceId" TEXT NOT NULL,
    CONSTRAINT "table_meta_workSpaceId_fkey" FOREIGN KEY ("workSpaceId") REFERENCES "work_spaces" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "table_meta_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "fields" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fieldName" TEXT NOT NULL,
    "fieldType" TEXT NOT NULL,
    "fieldDesciption" TEXT,
    "primitiveType" TEXT NOT NULL,
    "dbFieldName" TEXT NOT NULL,
    "dbFieldType" TEXT NOT NULL,
    "options" TEXT,
    "version" INTEGER,
    "order" REAL,
    "isMultiple" BOOLEAN NOT NULL DEFAULT false,
    "isNotNull" BOOLEAN NOT NULL DEFAULT false,
    "isUnique" BOOLEAN NOT NULL DEFAULT false,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "isComputed" BOOLEAN NOT NULL DEFAULT false,
    "isLookup" BOOLEAN NOT NULL DEFAULT false,
    "isPending" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    "lookupLinkedFieldId" TEXT,
    "lookupOptions" TEXT,
    "userId" TEXT NOT NULL,
    "tableMetaId" TEXT NOT NULL,
    CONSTRAINT "fields_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "fields_tableMetaId_fkey" FOREIGN KEY ("tableMetaId") REFERENCES "table_meta" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_work_spaces" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    "userId" TEXT NOT NULL,
    "version" INTEGER,
    "order" REAL,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "work_spaces_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_work_spaces" ("createdAt", "deletedAt", "description", "id", "isFavorite", "order", "title", "updatedAt", "userId") SELECT "createdAt", "deletedAt", "description", "id", "isFavorite", "order", "title", "updatedAt", "userId" FROM "work_spaces";
DROP TABLE "work_spaces";
ALTER TABLE "new_work_spaces" RENAME TO "work_spaces";
CREATE UNIQUE INDEX "work_spaces_title_key" ON "work_spaces"("title");
CREATE INDEX "work_spaces_user_id_index" ON "work_spaces"("userId");
CREATE INDEX "work_spaces_user_id_is_favorite_index" ON "work_spaces"("userId", "isFavorite");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
