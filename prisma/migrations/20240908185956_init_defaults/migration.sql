-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Daysheet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "venueId" TEXT NOT NULL,
    "hotelId" TEXT NOT NULL,
    "guestsLimit" INTEGER NOT NULL DEFAULT 20,
    "buyOut" BOOLEAN NOT NULL DEFAULT false,
    "buyOutAmount" INTEGER NOT NULL DEFAULT 0,
    "buyOutAlt" TEXT NOT NULL DEFAULT 'Dinner Provided',
    "mapIn" TEXT NOT NULL,
    "mapOut" TEXT NOT NULL,
    CONSTRAINT "Daysheet_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Daysheet_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Daysheet" ("buyOut", "buyOutAlt", "buyOutAmount", "date", "guestsLimit", "hotelId", "id", "mapIn", "mapOut", "slug", "venueId") SELECT "buyOut", "buyOutAlt", "buyOutAmount", "date", "guestsLimit", "hotelId", "id", "mapIn", "mapOut", "slug", "venueId" FROM "Daysheet";
DROP TABLE "Daysheet";
ALTER TABLE "new_Daysheet" RENAME TO "Daysheet";
CREATE UNIQUE INDEX "Daysheet_slug_key" ON "Daysheet"("slug");
CREATE TABLE "new_Guest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "party" INTEGER NOT NULL DEFAULT 0,
    "daysheetId" TEXT,
    CONSTRAINT "Guest_daysheetId_fkey" FOREIGN KEY ("daysheetId") REFERENCES "Daysheet" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Guest" ("daysheetId", "id", "name", "party", "slug") SELECT "daysheetId", "id", "name", "party", "slug" FROM "Guest";
DROP TABLE "Guest";
ALTER TABLE "new_Guest" RENAME TO "Guest";
CREATE UNIQUE INDEX "Guest_slug_key" ON "Guest"("slug");
CREATE TABLE "new_Schedule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "timeFrom" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeTo" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "daysheetId" TEXT,
    CONSTRAINT "Schedule_daysheetId_fkey" FOREIGN KEY ("daysheetId") REFERENCES "Daysheet" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Schedule" ("daysheetId", "id", "name", "slug", "timeFrom", "timeTo") SELECT "daysheetId", "id", "name", "slug", "timeFrom", "timeTo" FROM "Schedule";
DROP TABLE "Schedule";
ALTER TABLE "new_Schedule" RENAME TO "Schedule";
CREATE UNIQUE INDEX "Schedule_slug_key" ON "Schedule"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
