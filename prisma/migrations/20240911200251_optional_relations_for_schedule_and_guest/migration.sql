-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
    "note" TEXT NOT NULL,
    "timeFrom" TEXT NOT NULL,
    "timeTo" TEXT NOT NULL,
    "daysheetId" TEXT,
    CONSTRAINT "Schedule_daysheetId_fkey" FOREIGN KEY ("daysheetId") REFERENCES "Daysheet" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Schedule" ("daysheetId", "id", "name", "note", "slug", "timeFrom", "timeTo") SELECT "daysheetId", "id", "name", "note", "slug", "timeFrom", "timeTo" FROM "Schedule";
DROP TABLE "Schedule";
ALTER TABLE "new_Schedule" RENAME TO "Schedule";
CREATE UNIQUE INDEX "Schedule_slug_key" ON "Schedule"("slug");
CREATE UNIQUE INDEX "Schedule_daysheetId_key" ON "Schedule"("daysheetId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
