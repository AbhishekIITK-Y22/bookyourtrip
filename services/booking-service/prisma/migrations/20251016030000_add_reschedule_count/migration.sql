-- Add rescheduleCount column to Booking table
-- This tracks the number of times a booking has been rescheduled
-- Industry standard: Usually 1 reschedule allowed per booking

ALTER TABLE "Booking" ADD COLUMN "rescheduleCount" INTEGER NOT NULL DEFAULT 0;
