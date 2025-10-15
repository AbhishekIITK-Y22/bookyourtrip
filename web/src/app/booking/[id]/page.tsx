"use client";
import { useEffect, useState } from "react";
import { BOOKING_URL } from "@/lib/api";
import Link from "next/link";
import { useParams } from "next/navigation";

type Booking = {
  id: string;
  tripId: string;
  seatNo: string;
  priceApplied: number;
  state: string;
  paymentState: string;
};

export default function BookingPage() {
  const params = useParams() as { id: string };
  const [data, setData] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [passenger, setPassenger] = useState({ name: '', email: '', phone: '' });
  const [rescheduling, setRescheduling] = useState(false);
  const [resched, setResched] = useState({ newTripId: '', newSeatNo: '' });

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) { window.location.href = '/login'; return; }
        const res = await fetch(`${BOOKING_URL}/bookings/${params.id}`, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) throw new Error('Failed to load booking');
        setData(await res.json());
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Failed to load';
        setError(msg);
      } finally {
        setLoading(false);
      }
    })();
  }, [params.id]);

  async function pay() {
    try {
      setPaying(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${BOOKING_URL}/bookings/${params.id}/payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ cardNumber: '4111111111111111' })
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result?.error || 'Payment failed');
      setData(result.booking);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Payment failed';
      setError(msg);
    } finally {
      setPaying(false);
    }
  }

  async function cancelBooking() {
    try {
      setCancelling(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${BOOKING_URL}/bookings/${params.id}/cancel`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result?.error || 'Cancel failed');
      setData(result);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Cancel failed';
      setError(msg);
    } finally {
      setCancelling(false);
    }
  }

  async function updatePassenger() {
    try {
      setUpdating(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${BOOKING_URL}/bookings/${params.id}/passenger`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ passengerName: passenger.name, passengerEmail: passenger.email, passengerPhone: passenger.phone })
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result?.error || 'Update failed');
      setData(result);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Update failed';
      setError(msg);
    } finally {
      setUpdating(false);
    }
  }

  async function rescheduleBooking() {
    try {
      setRescheduling(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${BOOKING_URL}/bookings/${params.id}/reschedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(resched)
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result?.error || 'Reschedule failed');
      setData(result);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Reschedule failed';
      setError(msg);
    } finally {
      setRescheduling(false);
    }
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!data) return <div className="text-gray-600">Booking not found</div>;

  // Determine if booking is active (can be acted upon)
  const isActive = data.state === 'PENDING' || data.state === 'CONFIRMED';
  const isCancelled = data.state === 'CANCELLED';
  const canPay = data.state === 'PENDING' && data.paymentState !== 'PAID';
  const canCancel = isActive && data.state !== 'CANCELLED';
  const canEdit = isActive;

  // Get status badge color
  const getStatusColor = () => {
    if (data.state === 'CONFIRMED' && data.paymentState === 'PAID') return 'text-green-600';
    if (data.state === 'CANCELLED') return 'text-gray-600';
    if (data.state === 'PENDING') return 'text-yellow-600';
    return 'text-blue-600';
  };

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-gray-500">Booking ID</div>
          <div className="text-xl font-semibold">{data.id}</div>
        </div>
        <div className={`text-sm font-medium ${getStatusColor()}`}>
          {data.state} • {data.paymentState}
        </div>
      </div>
      <div className="mt-3 grid md:grid-cols-2 gap-3 text-sm text-gray-700">
        <div>Trip: {data.tripId}</div>
        <div>Seat: {data.seatNo}</div>
        <div>Price: ₹{data.priceApplied}</div>
      </div>
      
      {isCancelled && (
        <div className="mt-4 p-3 bg-gray-100 border border-gray-300 rounded text-sm text-gray-700">
          This booking has been cancelled. No further actions are available.
        </div>
      )}
      
      {isActive && (
        <div className="flex gap-3 mt-6">
          {canPay && (
            <button onClick={pay} disabled={paying} className="btn-primary-gradient disabled:opacity-60">
              {paying ? 'Processing...' : 'Pay Now'}
            </button>
          )}
          {canCancel && (
            <button onClick={cancelBooking} disabled={cancelling} className="bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white rounded px-4 py-2">
              {cancelling ? 'Cancelling...' : 'Cancel Booking'}
            </button>
          )}
          <Link href="/bookings" className="inline-block bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2">My Bookings</Link>
        </div>
      )}
      
      {!isActive && !isCancelled && (
        <div className="mt-4">
          <Link href="/bookings" className="inline-block bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2">Back to My Bookings</Link>
        </div>
      )}
      
      {canEdit && (
        <>
          <div className="mt-6 rounded-xl border bg-white p-4 grid gap-2 max-w-lg">
            <div className="font-medium">Update passenger details</div>
            <input className="border rounded px-3 py-2" placeholder="Name" value={passenger.name} onChange={(e) => setPassenger({ ...passenger, name: e.target.value })} />
            <input className="border rounded px-3 py-2" placeholder="Email" value={passenger.email} onChange={(e) => setPassenger({ ...passenger, email: e.target.value })} />
            <input className="border rounded px-3 py-2" placeholder="Phone" value={passenger.phone} onChange={(e) => setPassenger({ ...passenger, phone: e.target.value })} />
            <button onClick={updatePassenger} disabled={updating} className="bg-gray-800 hover:bg-black disabled:opacity-60 text-white rounded px-4 py-2 w-max">{updating ? 'Saving...' : 'Save'}</button>
          </div>
          <div className="mt-6 rounded-xl border bg-white p-4 grid gap-2 max-w-lg">
            <div className="font-medium">Reschedule booking</div>
            <input className="border rounded px-3 py-2" placeholder="New Trip ID" value={resched.newTripId} onChange={(e) => setResched({ ...resched, newTripId: e.target.value })} />
            <input className="border rounded px-3 py-2" placeholder="New Seat No (e.g., A05)" value={resched.newSeatNo} onChange={(e) => setResched({ ...resched, newSeatNo: e.target.value })} />
            <button onClick={rescheduleBooking} disabled={rescheduling} className="bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white rounded px-4 py-2 w-max">{rescheduling ? 'Rescheduling...' : 'Reschedule'}</button>
            <div className="text-xs text-gray-500">Penalty may apply if &lt; 24 hours to original departure.</div>
          </div>
        </>
      )}
    </div>
  );
}


