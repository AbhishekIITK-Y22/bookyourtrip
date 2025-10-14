export const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:3001';
export const BOOKING_URL = process.env.NEXT_PUBLIC_BOOKING_URL || 'http://localhost:3002';
export const AI_URL = process.env.NEXT_PUBLIC_AI_URL || 'http://localhost:3003';

export async function apiFetch<T>(
  base: string,
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const res = await fetch(`${base}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || 'Request failed');
  return data as T;
}

export const AuthAPI = {
  login: (email: string, password: string) =>
    apiFetch<{ token: string }>(AUTH_URL, '/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  signup: (email: string, password: string, role: 'CUSTOMER' | 'PROVIDER') =>
    apiFetch<{ token: string }>(AUTH_URL, '/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    }),
};

type CreateBookingPayload = {
  tripId: string;
  seatNo: string;
  idempotencyKey?: string;
  price?: number;
  passengerName?: string;
  passengerEmail?: string;
  passengerPhone?: string;
};

export const BookingAPI = {
  search: (params: Record<string, string>) =>
    apiFetch(BOOKING_URL, `/search?${new URLSearchParams(params).toString()}`),
  myBookings: () => apiFetch(BOOKING_URL, '/bookings'),
  createBooking: (payload: CreateBookingPayload) =>
    apiFetch(BOOKING_URL, '/bookings', { method: 'POST', body: JSON.stringify(payload) }),
};


