/*
  Warnings:

  - You are about to drop the column `streetAddress` on the `Address` table. All the data in the column will be lost.
  - Added the required column `street` to the `Address` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Address" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL
);
INSERT INTO "new_Address" ("city", "email", "id", "name", "phone", "slug", "state", "zip") SELECT "city", "email", "id", "name", "phone", "slug", "state", "zip" FROM "Address";
DROP TABLE "Address";
ALTER TABLE "new_Address" RENAME TO "Address";
CREATE UNIQUE INDEX "Address_slug_key" ON "Address"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
