import { PrismaClient } from '../prisma/generated/client/index.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clean existing data
  await prisma.booking.deleteMany();
  await prisma.seat.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.route.deleteMany();
  await prisma.provider.deleteMany();

  // Create providers with dummy userIds (for seed data only)
  // In production, these would be created via auth service signup
  const provider1 = await prisma.provider.create({
    data: {
      userId: 'seed_user_express_bus',
      name: 'Express Bus Co.',
      status: 'ACTIVE',
    },
  });

  const provider2 = await prisma.provider.create({
    data: {
      userId: 'seed_user_fast_travel',
      name: 'Fast Travel Inc.',
      status: 'ACTIVE',
    },
  });

  console.log('✅ Created providers');

  // Create routes
  const route1 = await prisma.route.create({
    data: {
      providerId: provider1.id,
      source: 'New York',
      destination: 'Boston',
    },
  });

  const route2 = await prisma.route.create({
    data: {
      providerId: provider1.id,
      source: 'Boston',
      destination: 'Philadelphia',
    },
  });

  const route3 = await prisma.route.create({
    data: {
      providerId: provider2.id,
      source: 'New York',
      destination: 'Washington DC',
    },
  });

  console.log('✅ Created routes');

  // Create trips
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(9, 0, 0, 0);

  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  nextWeek.setHours(14, 30, 0, 0);

  const trip1 = await prisma.trip.create({
    data: {
      routeId: route1.id,
      departure: tomorrow,
      capacity: 40,
      basePrice: 2500, // $25.00
    },
  });

  const trip2 = await prisma.trip.create({
    data: {
      routeId: route1.id,
      departure: nextWeek,
      capacity: 40,
      basePrice: 3000, // $30.00
    },
  });

  const trip3 = await prisma.trip.create({
    data: {
      routeId: route2.id,
      departure: tomorrow,
      capacity: 30,
      basePrice: 2000, // $20.00
    },
  });

  const trip4 = await prisma.trip.create({
    data: {
      routeId: route3.id,
      departure: nextWeek,
      capacity: 50,
      basePrice: 3500, // $35.00
    },
  });

  // Create seats for each trip
  const trips = [trip1, trip2, trip3, trip4];
  const capacities = [40, 40, 30, 50];
  
  for (let i = 0; i < trips.length; i++) {
    const trip = trips[i];
    const capacity = capacities[i];
    
    const seats = [];
    for (let seatNum = 1; seatNum <= capacity; seatNum++) {
      seats.push({
        tripId: trip.id,
        seatNo: `A${seatNum.toString().padStart(2, '0')}`,
        status: 'AVAILABLE' as const
      });
    }
    
    await prisma.seat.createMany({ data: seats });
  }

  console.log('✅ Created trips');

  const tripCount = await prisma.trip.count();
  const routeCount = await prisma.route.count();
  const providerCount = await prisma.provider.count();

  console.log(`
🎉 Seeding complete!
   - ${providerCount} providers
   - ${routeCount} routes
   - ${tripCount} trips
  `);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

