-- CreateTable
CREATE TABLE "PricingLog" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "inputs" JSONB NOT NULL,
    "price" INTEGER NOT NULL,
    "strategy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PricingLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PricingConfig" (
    "id" TEXT NOT NULL,
    "loadFactorT1" INTEGER NOT NULL DEFAULT 0,
    "loadFactorT2" INTEGER NOT NULL DEFAULT 0,
    "timeBandBoost" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PricingConfig_pkey" PRIMARY KEY ("id")
);
