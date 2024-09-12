/*
  Warnings:

  - You are about to drop the `Address` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `addressId` on the `Venue` table. All the data in the column will be lost.
  - Added the required column `city` to the `Hotel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Hotel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Hotel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Hotel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `Hotel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zip` to the `Hotel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Venue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Venue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Venue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Venue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `Venue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zip` to the `Venue` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Address_slug_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Address";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Hotel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "addressId" TEXT NOT NULL
);
INSERT INTO "new_Hotel" ("addressId", "id", "name", "slug") SELECT "addressId", "id", "name", "slug" FROM "Hotel";
DROP TABLE "Hotel";
ALTER TABLE "new_Hotel" RENAME TO "Hotel";
CREATE UNIQUE INDEX "Hotel_slug_key" ON "Hotel"("slug");
CREATE UNIQUE INDEX "Hotel_addressId_key" ON "Hotel"("addressId");
CREATE TABLE "new_Venue" (
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
INSERT INTO "new_Venue" ("id", "name", "slug") SELECT "id", "name", "slug" FROM "Venue";
DROP TABLE "Venue";
ALTER TABLE "new_Venue" RENAME TO "Venue";
CREATE UNIQUE INDEX "Venue_slug_key" ON "Venue"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
