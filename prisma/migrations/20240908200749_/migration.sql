/*
  Warnings:

  - A unique constraint covering the columns `[venueId]` on the table `Daysheet` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[hotelId]` on the table `Daysheet` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[addressId]` on the table `Hotel` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[addressId]` on the table `Venue` will be added. If there are existing duplicate values, this will fail.
  - Made the column `daysheetId` on table `Contact` required. This step will fail if there are existing NULL values in that column.
  - Made the column `venueId` on table `Contact` required. This step will fail if there are existing NULL values in that column.
  - Made the column `daysheetId` on table `Guest` required. This step will fail if there are existing NULL values in that column.
  - Made the column `daysheetId` on table `Schedule` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Contact" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "venueId" TEXT NOT NULL,
    "daysheetId" TEXT NOT NULL,
    CONSTRAINT "Contact_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Contact_daysheetId_fkey" FOREIGN KEY ("daysheetId") REFERENCES "Daysheet" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Contact" ("daysheetId", "email", "id", "name", "phone", "slug", "venueId") SELECT "daysheetId", "email", "id", "name", "phone", "slug", "venueId" FROM "Contact";
DROP TABLE "Contact";
ALTER TABLE "new_Contact" RENAME TO "Contact";
CREATE UNIQUE INDEX "Contact_slug_key" ON "Contact"("slug");
CREATE UNIQUE INDEX "Contact_venueId_key" ON "Contact"("venueId");
CREATE UNIQUE INDEX "Contact_daysheetId_key" ON "Contact"("daysheetId");
CREATE TABLE "new_Guest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "party" INTEGER NOT NULL DEFAULT 0,
    "daysheetId" TEXT NOT NULL,
    CONSTRAINT "Guest_daysheetId_fkey" FOREIGN KEY ("daysheetId") REFERENCES "Daysheet" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Guest" ("daysheetId", "id", "name", "party", "slug") SELECT "daysheetId", "id", "name", "party", "slug" FROM "Guest";
DROP TABLE "Guest";
ALTER TABLE "new_Guest" RENAME TO "Guest";
CREATE UNIQUE INDEX "Guest_slug_key" ON "Guest"("slug");
CREATE UNIQUE INDEX "Guest_daysheetId_key" ON "Guest"("daysheetId");
CREATE TABLE "new_Schedule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "timeFrom" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeTo" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "daysheetId" TEXT NOT NULL,
    CONSTRAINT "Schedule_daysheetId_fkey" FOREIGN KEY ("daysheetId") REFERENCES "Daysheet" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Schedule" ("daysheetId", "id", "name", "slug", "timeFrom", "timeTo") SELECT "daysheetId", "id", "name", "slug", "timeFrom", "timeTo" FROM "Schedule";
DROP TABLE "Schedule";
ALTER TABLE "new_Schedule" RENAME TO "Schedule";
CREATE UNIQUE INDEX "Schedule_slug_key" ON "Schedule"("slug");
CREATE UNIQUE INDEX "Schedule_daysheetId_key" ON "Schedule"("daysheetId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Daysheet_venueId_key" ON "Daysheet"("venueId");

-- CreateIndex
CREATE UNIQUE INDEX "Daysheet_hotelId_key" ON "Daysheet"("hotelId");

-- CreateIndex
CREATE UNIQUE INDEX "Hotel_addressId_key" ON "Hotel"("addressId");

-- CreateIndex
CREATE UNIQUE INDEX "Venue_addressId_key" ON "Venue"("addressId");
