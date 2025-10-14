"use client";
import { useEffect, useMemo, useState } from "react";
import { BOOKING_URL, AI_URL } from "@/lib/api";
import { useParams } from "next/navigation";

type Seat = { seatNo: string; status: string };
type Trip = {
  id: string;
  departure: string;
  capacity: number;
  basePrice: number;
  route: { source: string; destination: string };
  seats?: Seat[];
};

async function getTrip(id: string): Promise<Trip | null> {
  try {
    const res = await fetch(`${BOOKING_URL}/trips/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export default function TripPage() {
  const { id } = useParams() as { id: string };
  const [trip, setTrip] = useState<Trip | null>(null);
  const [seat, setSeat] = useState<string>("");
  const [aiPrice, setAiPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const t = await getTrip(id);
      setTrip(t);
      setLoading(false);
    })();
  }, [id]);

  const availableSeats = useMemo(() => (trip?.seats || []).filter(s => s.status === 'AVAILABLE'), [trip]);

  useEffect(() => {
    if (!trip) return;
    const seatsAvailable = availableSeats.length;
    const totalSeats = trip.capacity;
    const basePrice = trip.basePrice;
    (async () => {
      try {
        const res = await fetch(`${AI_URL}/pricing/${trip.id}?basePrice=${basePrice}&seatsAvailable=${seatsAvailable}&totalSeats=${totalSeats}`);
        const data = await res.json();
        setAiPrice(data.finalPrice ?? null);
      } catch {
        setAiPrice(null);
      }
    })();
  }, [trip, availableSeats.length]);

  async function book() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }
      const res = await fetch(`${BOOKING_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ tripId: id, seatNo: seat, price: aiPrice ?? undefined, idempotencyKey: `web-${Date.now()}` })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Booking failed');
      window.location.href = `/booking/${data.id}`;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Booking failed';
      setError(msg);
    }
  }

  if (loading) return <div>Loading...</div>;
  if (!trip) return <div className="text-gray-600">Trip not found</div>;

  return (
    <div className="grid gap-6">
      <div className="rounded-xl border bg-white p-4">
        <div className="text-sm text-gray-500">{trip.route.source} → {trip.route.destination}</div>
        <div className="text-xl font-semibold">{new Date(trip.departure).toLocaleString()}</div>
        <div className="text-sm text-gray-600">Capacity: {trip.capacity}</div>
      </div>

      <div className="rounded-xl border bg-white p-4 grid gap-3">
        <div className="font-medium">Select a seat</div>
        <select className="border rounded px-3 py-2 max-w-xs" value={seat} onChange={(e) => setSeat(e.target.value)}>
          <option value="">Choose seat</option>
          {availableSeats.map(s => (
            <option key={s.seatNo} value={s.seatNo}>{s.seatNo}</option>
          ))}
        </select>
        <div className="text-sm text-gray-600">Base Price: ₹{trip.basePrice} {aiPrice && (<span className="ml-2">• AI Price: <span className="font-medium">₹{aiPrice}</span></span>)}</div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button onClick={book} disabled={!seat} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded px-4 py-2 max-w-xs">Book</button>
      </div>
    </div>
  );
}


