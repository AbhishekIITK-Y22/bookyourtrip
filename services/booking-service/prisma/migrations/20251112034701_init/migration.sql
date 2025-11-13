/*
  Warnings:

  - You are about to drop the column `rescheduleCount` on the `Booking` table. All the data in the column will be lost.
  - Made the column `userId` on table `Provider` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updatedAt` to the `Route` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Trip` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Booking_tripId_seatNo_key";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "rescheduleCount";

-- AlterTable
ALTER TABLE "Provider" ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Route" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Trip" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
