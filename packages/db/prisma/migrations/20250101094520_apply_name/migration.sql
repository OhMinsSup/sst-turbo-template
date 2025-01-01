/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `tables` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[dbTableName]` on the table `tables` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "user_profiles" ADD COLUMN "firstName" TEXT;
ALTER TABLE "user_profiles" ADD COLUMN "lastName" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "tables_name_key" ON "tables"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tables_dbTableName_key" ON "tables"("dbTableName");
