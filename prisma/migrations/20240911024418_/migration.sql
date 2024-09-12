/*
  Warnings:

  - A unique constraint covering the columns `[venueId]` on the table `Daysheet` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[hotelId]` on the table `Daysheet` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Daysheet_venueId_key" ON "Daysheet"("venueId");

-- CreateIndex
CREATE UNIQUE INDEX "Daysheet_hotelId_key" ON "Daysheet"("hotelId");
