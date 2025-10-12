/*
  k6 load test for BookYourTrip
  - Sign up a random customer
  - Search trips
  - Create/cancel a booking (idempotent, unique seat)

  Usage (local):
    k6 run load/k6-booking.js \
      -e AUTH_BASE=http://localhost:3001 \
      -e BOOKING_BASE=http://localhost:3002 \
      -e AI_BASE=http://localhost:3003

  Environment vars (defaults):
    AUTH_BASE, BOOKING_BASE, AI_BASE
*/

import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 20,          // concurrent users
  duration: '1m',   // total duration
  thresholds: {
    http_req_duration: ['p(95)<800'],
    http_req_failed: ['rate<0.05'],
  },
};

const AUTH_BASE = __ENV.AUTH_BASE || 'http://localhost:3001';
const BOOKING_BASE = __ENV.BOOKING_BASE || 'http://localhost:3002';
// AI_BASE not required directly here (booking calls it)

export default function () {
  // 1) Sign up a random user
  const email = `k6_${Math.floor(Math.random()*1e9)}@test.com`;
  const signupRes = http.post(`${AUTH_BASE}/auth/signup`, JSON.stringify({
    email,
    password: 'password123',
    role: 'CUSTOMER',
  }), { headers: { 'Content-Type': 'application/json' } });

  check(signupRes, {
    'signup status 201/200': (r) => r.status === 201 || r.status === 200,
  });

  const token = (signupRes.json('token')) || '';

  // 2) Search trips (filter optional)
  const searchRes = http.get(`${BOOKING_BASE}/search`);
  check(searchRes, {
    'search 200': (r) => r.status === 200,
  });

  const trips = searchRes.json();
  if (!Array.isArray(trips) || trips.length === 0) {
    // No trips to book, skip this iteration
    sleep(0.2);
    return;
  }

  const tripId = trips[0].id || trips[0].tripId || trips[0].Id;
  const seatNo = `K6-${Math.floor(Math.random()*1e9)}`;
  const idemKey = `idem-${Math.floor(Math.random()*1e9)}`;

  // 3) Create booking (idempotent)
  const bookRes = http.post(`${BOOKING_BASE}/bookings`, JSON.stringify({
    tripId,
    seatNo,
  }), {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'Idempotency-Key': idemKey,
    },
  });

  check(bookRes, {
    'booking created 201/200/409': (r) => [200,201,409].includes(r.status),
  });

  if (bookRes.status === 201 || bookRes.status === 200) {
    const bookingId = bookRes.json('id');
    // 4) Cancel booking to release seat
    const cancelRes = http.post(`${BOOKING_BASE}/bookings/${bookingId}/cancel`, null, {
      headers: { Authorization: `Bearer ${token}` },
    });
    check(cancelRes, { 'cancel 200': (r) => r.status === 200 });
  }

  sleep(0.2);
}
