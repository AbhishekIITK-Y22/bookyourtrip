-- CreateEnum
CREATE TYPE "PaymentState" AS ENUM ('PENDING', 'PROCESSING', 'PAID', 'FAILED', 'REFUNDED');

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "passengerEmail" TEXT,
ADD COLUMN     "passengerName" TEXT,
ADD COLUMN     "passengerPhone" TEXT,
ADD COLUMN     "paymentState" "PaymentState" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Provider" ADD COLUMN     "description" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "phone" TEXT;
