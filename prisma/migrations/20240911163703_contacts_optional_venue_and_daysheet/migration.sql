-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Contact" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
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
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
