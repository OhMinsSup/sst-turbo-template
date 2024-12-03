-- DropIndex
DROP INDEX "user_profiles_user_id_index";

-- CreateTable
CREATE TABLE "work_spaces" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    "userId" TEXT NOT NULL,
    CONSTRAINT "work_spaces_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "databases" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    "workSpaceId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "databases_workSpaceId_fkey" FOREIGN KEY ("workSpaceId") REFERENCES "work_spaces" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "databases_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "work_spaces_title_key" ON "work_spaces"("title");

-- CreateIndex
CREATE INDEX "work_spaces_user_id_index" ON "work_spaces"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "databases_title_key" ON "databases"("title");

-- CreateIndex
CREATE INDEX "databases_work_space_id_index" ON "databases"("workSpaceId");

-- CreateIndex
CREATE INDEX "identities_provider_id_provider_index" ON "identities"("providerId", "provider");

-- CreateIndex
CREATE INDEX "identities_user_id_provider_index" ON "identities"("userId", "provider");

-- CreateIndex
CREATE INDEX "identities_user_id_index" ON "identities"("userId");

-- CreateIndex
CREATE INDEX "refresh_tokens_token_index" ON "refresh_tokens"("token");

-- CreateIndex
CREATE INDEX "refresh_tokens_session_id_revoked_index" ON "refresh_tokens"("sessionId", "revoked");
