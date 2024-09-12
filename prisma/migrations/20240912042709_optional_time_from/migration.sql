-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Schedule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "timeFrom" TEXT NOT NULL,
    "timeTo" TEXT,
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
