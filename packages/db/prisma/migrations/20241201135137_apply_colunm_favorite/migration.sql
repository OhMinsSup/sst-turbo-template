-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_work_spaces" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    "userId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "work_spaces_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_work_spaces" ("createdAt", "deletedAt", "description", "id", "title", "updatedAt", "userId") SELECT "createdAt", "deletedAt", "description", "id", "title", "updatedAt", "userId" FROM "work_spaces";
DROP TABLE "work_spaces";
ALTER TABLE "new_work_spaces" RENAME TO "work_spaces";
CREATE UNIQUE INDEX "work_spaces_title_key" ON "work_spaces"("title");
CREATE INDEX "work_spaces_user_id_index" ON "work_spaces"("userId");
CREATE INDEX "work_spaces_user_id_is_favorite_index" ON "work_spaces"("userId", "isFavorite");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
