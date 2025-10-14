"use client";
import { useEffect, useState } from "react";
import { BOOKING_URL } from "@/lib/api";

type BookingItem = {
  id: string;
  seatNo: string;
  priceApplied: number;
  state: string;
  trip?: { route?: { source?: string; destination?: string }; departure?: string };
};

export default function MyBookingsPage() {
  const [items, setItems] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) { window.location.href = '/login'; return; }
        const res = await fetch(`${BOOKING_URL}/bookings`, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) throw new Error('Failed to load bookings');
        setItems(await res.json());
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Failed to load';
        setError(msg);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-semibold">My Bookings</h1>
      {items.length === 0 && <div className="text-gray-600">No bookings yet.</div>}
      {items.map((b) => (
        <div key={b.id} className="rounded-xl border bg-white p-4 flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500">{b.trip?.route?.source} → {b.trip?.route?.destination}</div>
            <div className="font-medium">{b.trip?.departure ? new Date(b.trip?.departure as string).toLocaleString() : '-'}</div>
            <div className="text-sm text-gray-600">Seat: {b.seatNo} • Price: ₹{b.priceApplied} • Status: {b.state}</div>
          </div>
          <a href={`/booking/${b.id}`} className="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2">View</a>
        </div>
      ))}
    </div>
  );
}


