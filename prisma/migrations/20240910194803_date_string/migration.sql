-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Daysheet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "date" TEXT NOT NULL,
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
CREATE UNIQUE INDEX "Daysheet_venueId_key" ON "Daysheet"("venueId");
CREATE UNIQUE INDEX "Daysheet_hotelId_key" ON "Daysheet"("hotelId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
