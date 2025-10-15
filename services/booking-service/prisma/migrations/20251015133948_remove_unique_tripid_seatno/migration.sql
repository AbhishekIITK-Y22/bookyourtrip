-- Drop the unique constraint on (tripId, seatNo) to allow historical bookings
ALTER TABLE "Booking" DROP CONSTRAINT IF EXISTS "Booking_tripId_seatNo_key";
