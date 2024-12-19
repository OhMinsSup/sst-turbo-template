/*
  Warnings:

  - You are about to drop the `table_meta` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `tableMetaId` on the `fields` table. All the data in the column will be lost.
  - Added the required column `tableId` to the `fields` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "table_meta";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "tables" (
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
    CONSTRAINT "tables_workSpaceId_fkey" FOREIGN KEY ("workSpaceId") REFERENCES "work_spaces" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "tables_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_fields" (
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
    "tableId" TEXT NOT NULL,
    CONSTRAINT "fields_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "fields_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "tables" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_fields" ("createdAt", "dbFieldName", "dbFieldType", "deletedAt", "fieldDesciption", "fieldName", "fieldType", "id", "isComputed", "isLookup", "isMultiple", "isNotNull", "isPending", "isPrimary", "isUnique", "lookupLinkedFieldId", "lookupOptions", "options", "order", "primitiveType", "updatedAt", "userId", "version") SELECT "createdAt", "dbFieldName", "dbFieldType", "deletedAt", "fieldDesciption", "fieldName", "fieldType", "id", "isComputed", "isLookup", "isMultiple", "isNotNull", "isPending", "isPrimary", "isUnique", "lookupLinkedFieldId", "lookupOptions", "options", "order", "primitiveType", "updatedAt", "userId", "version" FROM "fields";
DROP TABLE "fields";
ALTER TABLE "new_fields" RENAME TO "fields";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
