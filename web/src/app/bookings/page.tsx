"use client";
import { useEffect, useState } from "react";
import { BOOKING_URL } from "@/lib/api";

type BookingItem = {
  id: string;
  seatNo: string;
  priceApplied: number;
  state: string;
  paymentState: string;
  createdAt: string;
  trip?: { route?: { source?: string; destination?: string }; departure?: string };
};

function getStatusBadge(state: string, paymentState: string) {
  if (state === 'CANCELLED') {
    return <span className="px-2 py-1 rounded text-xs bg-gray-200 text-gray-700">Cancelled</span>;
  }
  if (state === 'CONFIRMED' && paymentState === 'PAID') {
    return <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-700">Confirmed</span>;
  }
  if (state === 'PENDING' && paymentState === 'PENDING') {
    return <span className="px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-700">Payment Pending</span>;
  }
  if (state === 'PENDING' && paymentState === 'FAILED') {
    return <span className="px-2 py-1 rounded text-xs bg-red-100 text-red-700">Payment Failed</span>;
  }
  if (state === 'RESCHEDULED') {
    return <span className="px-2 py-1 rounded text-xs bg-purple-100 text-purple-700">Rescheduled</span>;
  }
  return <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-600">{state}</span>;
}

function getTimeRemaining(createdAt: string, state: string, paymentState: string): string | null {
  if (state !== 'PENDING' || paymentState !== 'PENDING') return null;
  
  const created = new Date(createdAt).getTime();
  const expiresAt = created + (15 * 60 * 1000); // 15 minutes
  const now = Date.now();
  const remaining = expiresAt - now;
  
  if (remaining <= 0) return 'Expired';
  
  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  return `${minutes}m ${seconds}s remaining`;
}

export default function MyBookingsPage() {
  const [items, setItems] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());

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
    
    // Update countdown every second
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-semibold">My Bookings</h1>
      {items.length === 0 && <div className="text-gray-600">No bookings yet.</div>}
      {items.map((b) => {
        const timeRemaining = getTimeRemaining(b.createdAt, b.state, b.paymentState);
        const isExpiring = timeRemaining && timeRemaining !== 'Expired';
        
        return (
          <div key={b.id} className={`rounded-xl border bg-white p-4 ${isExpiring ? 'border-yellow-400 border-2' : ''}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className="text-sm text-gray-500">{b.trip?.route?.source} → {b.trip?.route?.destination}</div>
                  {getStatusBadge(b.state, b.paymentState)}
                </div>
                <div className="font-medium">{b.trip?.departure ? new Date(b.trip?.departure as string).toLocaleString() : '-'}</div>
                <div className="text-sm text-gray-600 mt-1">
                  Seat: {b.seatNo} • Price: ₹{b.priceApplied}
                </div>
                {isExpiring && (
                  <div className="text-xs font-medium text-yellow-700 mt-2 bg-yellow-50 inline-block px-2 py-1 rounded">
                    ⏰ {timeRemaining} - Complete payment or booking will be cancelled
                  </div>
                )}
                {timeRemaining === 'Expired' && b.state === 'PENDING' && (
                  <div className="text-xs text-red-600 mt-2">
                    This booking has expired and will be auto-cancelled shortly
                  </div>
                )}
              </div>
              <a href={`/booking/${b.id}`} className="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2 ml-4">View</a>
            </div>
          </div>
        );
      })}
    </div>
  );
}


