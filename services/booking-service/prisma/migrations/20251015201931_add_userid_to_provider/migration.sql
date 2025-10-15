-- Add userId column to Provider table to link with User in auth-service
-- This establishes a one-to-one relationship between User and Provider

-- Add the column (nullable first to allow existing data)
ALTER TABLE "Provider" ADD COLUMN "userId" TEXT;

-- Make it unique (will fail if there are duplicate values, but we don't have data yet)
CREATE UNIQUE INDEX "Provider_userId_key" ON "Provider"("userId");

-- For existing providers without userId, we'll handle this in application logic
-- New providers will require userId
