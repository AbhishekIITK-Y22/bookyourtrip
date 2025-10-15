"use client";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BOOKING_URL } from "@/lib/api";

type Trip = {
  id: string;
  departure: string;
  capacity: number;
  basePrice: number;
  route: { source: string; destination: string };
  seats?: { seatNo: string; status: string }[];
};

function SearchContent() {
  const sp = useSearchParams();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  const query = useMemo(() => {
    const params = new URLSearchParams();
    const from = sp.get('from');
    const to = sp.get('to');
    const date = sp.get('date');
    if (from) params.set('from', from);
    if (to) params.set('to', to);
    if (date) params.set('date', date);
    return { params, from: from || '', to: to || '', date: date || '' };
  }, [sp]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BOOKING_URL}/search?${query.params.toString()}`, { cache: 'no-store' });
        if (!res.ok) {
          setTrips([]);
        } else {
          setTrips(await res.json());
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [query.params]);

  return (
    <div className="grid gap-6">
      <div className="rounded-xl border bg-white p-4">
        <div className="text-sm text-gray-600">Showing results for</div>
        <div className="text-lg font-medium">{query.from || 'Anywhere'} → {query.to || 'Anywhere'} {query.date && `on ${query.date}`}</div>
      </div>

      <div className="grid gap-4">
        {loading && <div>Loading...</div>}
        {!loading && trips.length === 0 && (
          <div className="text-gray-600">No trips found. Try adjusting your filters.</div>
        )}
        {trips.map((trip) => (
          <div key={trip.id} className="rounded-xl border bg-white p-4 flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">{trip.route.source} → {trip.route.destination}</div>
              <div className="font-medium">{new Date(trip.departure).toLocaleString()}</div>
              <div className="text-sm text-gray-600">Capacity: {trip.capacity} • Base: ₹{trip.basePrice}</div>
            </div>
            <a href={`/trip/${trip.id}`} className="btn-primary-gradient">View & Book</a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}


