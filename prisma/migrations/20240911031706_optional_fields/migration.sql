-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Contact" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "venueId" TEXT,
    "daysheetId" TEXT,
    CONSTRAINT "Contact_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Contact_daysheetId_fkey" FOREIGN KEY ("daysheetId") REFERENCES "Daysheet" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Contact" ("daysheetId", "email", "id", "name", "phone", "role", "slug", "venueId") SELECT "daysheetId", "email", "id", "name", "phone", "role", "slug", "venueId" FROM "Contact";
DROP TABLE "Contact";
ALTER TABLE "new_Contact" RENAME TO "Contact";
CREATE UNIQUE INDEX "Contact_slug_key" ON "Contact"("slug");
CREATE UNIQUE INDEX "Contact_venueId_key" ON "Contact"("venueId");
CREATE UNIQUE INDEX "Contact_daysheetId_key" ON "Contact"("daysheetId");
CREATE TABLE "new_Daysheet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "venueId" TEXT,
    "hotelId" TEXT,
    "guestsLimit" INTEGER NOT NULL DEFAULT 20,
    "buyOut" BOOLEAN NOT NULL DEFAULT false,
    "buyOutAmount" INTEGER DEFAULT 0,
    "buyOutAlt" TEXT DEFAULT 'Dinner Provided',
    "mapIn" TEXT,
    "mapOut" TEXT,
    CONSTRAINT "Daysheet_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Daysheet_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Daysheet" ("buyOut", "buyOutAlt", "buyOutAmount", "date", "guestsLimit", "hotelId", "id", "mapIn", "mapOut", "slug", "venueId") SELECT "buyOut", "buyOutAlt", "buyOutAmount", "date", "guestsLimit", "hotelId", "id", "mapIn", "mapOut", "slug", "venueId" FROM "Daysheet";
DROP TABLE "Daysheet";
ALTER TABLE "new_Daysheet" RENAME TO "Daysheet";
CREATE UNIQUE INDEX "Daysheet_slug_key" ON "Daysheet"("slug");
CREATE UNIQUE INDEX "Daysheet_venueId_key" ON "Daysheet"("venueId");
CREATE UNIQUE INDEX "Daysheet_hotelId_key" ON "Daysheet"("hotelId");
CREATE TABLE "new_Guest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "party" INTEGER DEFAULT 0,
    "daysheetId" TEXT,
    CONSTRAINT "Guest_daysheetId_fkey" FOREIGN KEY ("daysheetId") REFERENCES "Daysheet" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Guest" ("daysheetId", "id", "name", "party", "slug") SELECT "daysheetId", "id", "name", "party", "slug" FROM "Guest";
DROP TABLE "Guest";
ALTER TABLE "new_Guest" RENAME TO "Guest";
CREATE UNIQUE INDEX "Guest_slug_key" ON "Guest"("slug");
CREATE UNIQUE INDEX "Guest_daysheetId_key" ON "Guest"("daysheetId");
CREATE TABLE "new_Hotel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "site" TEXT,
    "street" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zip" TEXT,
    "phone" TEXT,
    "email" TEXT
);
INSERT INTO "new_Hotel" ("city", "email", "id", "name", "phone", "site", "slug", "state", "street", "zip") SELECT "city", "email", "id", "name", "phone", "site", "slug", "state", "street", "zip" FROM "Hotel";
DROP TABLE "Hotel";
ALTER TABLE "new_Hotel" RENAME TO "Hotel";
CREATE UNIQUE INDEX "Hotel_slug_key" ON "Hotel"("slug");
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
CREATE UNIQUE INDEX "Schedule_daysheetId_key" ON "Schedule"("daysheetId");
CREATE TABLE "new_Venue" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "site" TEXT,
    "street" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zip" TEXT,
    "phone" TEXT,
    "email" TEXT
);
INSERT INTO "new_Venue" ("city", "email", "id", "name", "phone", "site", "slug", "state", "street", "zip") SELECT "city", "email", "id", "name", "phone", "site", "slug", "state", "street", "zip" FROM "Venue";
DROP TABLE "Venue";
ALTER TABLE "new_Venue" RENAME TO "Venue";
CREATE UNIQUE INDEX "Venue_slug_key" ON "Venue"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
