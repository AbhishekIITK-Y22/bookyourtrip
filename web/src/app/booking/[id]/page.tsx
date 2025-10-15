"use client";
import { useEffect, useState } from "react";
import { BOOKING_URL } from "@/lib/api";
import Link from "next/link";
import { useParams } from "next/navigation";

type Trip = {
  id: string;
  departure: string;
  route?: {
    source: string;
    destination: string;
  };
};

type Booking = {
  id: string;
  tripId: string;
  seatNo: string;
  priceApplied: number;
  state: string;
  paymentState: string;
  passengerName?: string;
  passengerEmail?: string;
  passengerPhone?: string;
  createdAt: string;
  trip?: Trip;
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
  const [showPassengerForm, setShowPassengerForm] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) { window.location.href = '/login'; return; }
        const res = await fetch(`${BOOKING_URL}/bookings/${params.id}`, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) throw new Error('Failed to load booking');
        const booking = await res.json();
        setData(booking);
        // Pre-fill passenger form with existing data
        setPassenger({
          name: booking.passengerName || '',
          email: booking.passengerEmail || '',
          phone: booking.passengerPhone || ''
        });
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Failed to load';
        setError(msg);
      } finally {
        setLoading(false);
      }
    })();
  }, [params.id]);

  async function pay() {
    // Validate passenger details before payment
    if (!data?.passengerName || !data?.passengerEmail || !data?.passengerPhone) {
      // Show inline alert instead of navigating away
      alert('⚠️ Passenger Details Required\n\nYou must add passenger details (Name, Email, Phone) before completing payment.\n\nPlease scroll down to the "Passenger Information" section and click "Add Details Now".');
      setShowPassengerForm(true);
      // Scroll to passenger section smoothly
      setTimeout(() => {
        document.getElementById('passenger-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
      return;
    }
    
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
      alert('✅ Payment Successful!\n\nYour booking is now confirmed. You will receive a confirmation email shortly.');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Payment failed';
      alert('❌ Payment Failed\n\n' + msg);
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
    if (!passenger.name.trim() || !passenger.email.trim() || !passenger.phone.trim()) {
      setError('Please fill in all passenger details');
      return;
    }
    try {
      setUpdating(true);
      setError(null);
      const token = localStorage.getItem('token');
      const res = await fetch(`${BOOKING_URL}/bookings/${params.id}/passenger`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ passengerName: passenger.name, passengerEmail: passenger.email, passengerPhone: passenger.phone })
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result?.error || 'Update failed');
      setData(result);
      setShowPassengerForm(false);
      alert('Passenger details updated successfully!');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Update failed';
      setError(msg);
    } finally {
      setUpdating(false);
    }
  }

  async function confirmCancel() {
    try {
      setCancelling(true);
      setError(null);
      const token = localStorage.getItem('token');
      const res = await fetch(`${BOOKING_URL}/bookings/${params.id}/cancel`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result?.error || 'Cancel failed');
      setData(result);
      setShowCancelModal(false);
      alert('Booking cancelled successfully. Refund will be processed within 5-7 business days.');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Cancel failed';
      setError(msg);
    } finally {
      setCancelling(false);
    }
  }

  if (loading) return <div className="max-w-4xl mx-auto p-6"><div className="text-center">Loading...</div></div>;
  if (!data) return <div className="max-w-4xl mx-auto p-6"><div className="text-gray-600">Booking not found</div></div>;

  // At this point, data is guaranteed to be non-null
  // Determine if booking is active (can be acted upon)
  const isPending = data.state === 'PENDING';
  const isConfirmed = data.state === 'CONFIRMED' && data.paymentState === 'PAID';
  const isCancelled = data.state === 'CANCELLED';
  const canPay = data.state === 'PENDING' && data.paymentState === 'PENDING';
  const canCancel = (isPending || isConfirmed) && !isCancelled;
  const canEditPassenger = !isCancelled; // Allow editing even for confirmed bookings

  // Get status badge
  const getStatusBadge = () => {
    if (isConfirmed) return <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">✓ Confirmed</span>;
    if (isCancelled) return <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">✗ Cancelled</span>;
    if (isPending) return <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-700">⏳ Payment Pending</span>;
    return <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">{data.state}</span>;
  };

  const departureDate = data.trip?.departure ? new Date(data.trip.departure) : null;
  const bookingDate = new Date(data.createdAt);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Booking Details</h1>
        <Link href="/bookings" className="text-blue-600 hover:text-blue-700 font-medium">← Back to My Bookings</Link>
      </div>

      {/* Status Banner */}
      <div className={`rounded-lg p-4 border-2 ${isConfirmed ? 'bg-green-50 border-green-200' : isPending ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600 mb-1">Booking Status</div>
            {getStatusBadge()}
          </div>
          {isPending && (
            <div className="text-right">
              <div className="text-sm text-gray-600">Action Required</div>
              <div className="text-lg font-semibold text-yellow-700">Complete Payment</div>
            </div>
          )}
        </div>
      </div>

      {/* Trip Information Card */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <span className="text-2xl">✈️</span> Trip Information
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="text-sm text-gray-500 mb-1">Route</div>
            <div className="text-lg font-medium">{data.trip?.route?.source || 'N/A'} → {data.trip?.route?.destination || 'N/A'}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">Departure</div>
            <div className="text-lg font-medium">{departureDate ? departureDate.toLocaleString() : 'N/A'}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">Seat Number</div>
            <div className="text-2xl font-bold text-blue-600">{data.seatNo}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">Price</div>
            <div className="text-2xl font-bold text-green-600">₹{data.priceApplied}</div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t">
          <div className="text-sm text-gray-500">Booking ID</div>
          <div className="text-xs font-mono text-gray-600">{data.id}</div>
          <div className="text-xs text-gray-400 mt-1">Booked on {bookingDate.toLocaleDateString()} at {bookingDate.toLocaleTimeString()}</div>
        </div>
      </div>

      {/* Passenger Information Card */}
      <div id="passenger-section" className={`bg-white rounded-xl border shadow-sm p-6 ${!data.passengerName && canEditPassenger ? 'border-2 border-yellow-400 ring-2 ring-yellow-100' : ''}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span className="text-2xl">👤</span> Passenger Information
            {!data.passengerName && canEditPassenger && (
              <span className="text-sm font-normal text-red-600">* Required for payment</span>
            )}
          </h2>
          {canEditPassenger && !showPassengerForm && (
            <button 
              onClick={() => setShowPassengerForm(true)} 
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              ✏️ Edit Details
            </button>
          )}
        </div>

        {!showPassengerForm ? (
          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-500">Name</div>
              <div className="text-lg">{data.passengerName || <span className="text-gray-400 italic">Not provided</span>}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Email</div>
              <div className="text-lg">{data.passengerEmail || <span className="text-gray-400 italic">Not provided</span>}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Phone</div>
              <div className="text-lg">{data.passengerPhone || <span className="text-gray-400 italic">Not provided</span>}</div>
            </div>
            {!data.passengerName && canEditPassenger && (
              <div className="mt-4 p-4 bg-red-50 border-2 border-red-300 rounded-lg text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <div className="font-semibold text-red-900 mb-1">Passenger Details Required</div>
                    <div className="text-red-700">You must add passenger details before you can complete payment and confirm this booking.</div>
                    <button 
                      onClick={() => setShowPassengerForm(true)} 
                      className="mt-3 bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-2 font-medium text-sm"
                    >
                      Add Details Now
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input 
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                placeholder="Enter passenger's full name" 
                value={passenger.name} 
                onChange={(e) => setPassenger({ ...passenger, name: e.target.value })} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
              <input 
                type="email"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                placeholder="passenger@example.com" 
                value={passenger.email} 
                onChange={(e) => setPassenger({ ...passenger, email: e.target.value })} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
              <input 
                type="tel"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                placeholder="+1 (555) 000-0000" 
                value={passenger.phone} 
                onChange={(e) => setPassenger({ ...passenger, phone: e.target.value })} 
              />
            </div>
            <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
              💡 <strong>Why we need this:</strong> Passenger details are required for ticket verification and important trip updates.
            </div>
            <div className="flex gap-3">
              <button 
                onClick={updatePassenger} 
                disabled={updating} 
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-lg px-6 py-2 font-medium"
              >
                {updating ? 'Saving...' : 'Save Details'}
              </button>
              <button 
                onClick={() => {
                  setShowPassengerForm(false);
                  // Reset to original values
                  setPassenger({
                    name: data.passengerName || '',
                    email: data.passengerEmail || '',
                    phone: data.passengerPhone || ''
                  });
                }} 
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg px-6 py-2 font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Actions Section */}
      {!isCancelled && (
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Manage Booking</h2>
          <div className="space-y-3">
            {canPay && (
              <div className={`p-4 border-2 rounded-lg ${!data.passengerName ? 'bg-gray-50 border-gray-300' : 'bg-blue-50 border-blue-200'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className={`font-semibold ${!data.passengerName ? 'text-gray-600' : 'text-blue-900'}`}>Complete Payment</div>
                    <div className={`text-sm ${!data.passengerName ? 'text-gray-500' : 'text-blue-700'}`}>
                      Pay ₹{data.priceApplied} to confirm your booking
                    </div>
                    {!data.passengerName && (
                      <div className="text-xs text-red-600 font-medium mt-1">
                        ⚠️ Add passenger details first
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={pay} 
                    disabled={paying} 
                    className={`px-6 py-3 text-lg font-semibold rounded-lg ${!data.passengerName ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'btn-primary-gradient disabled:opacity-60'}`}
                  >
                    {paying ? 'Processing...' : 'Pay Now'}
                  </button>
                </div>
              </div>
            )}
            {canCancel && (
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">Cancel Booking</div>
                    <div className="text-sm text-gray-600">Refund will be processed within 5-7 business days</div>
                  </div>
                  <button 
                    onClick={() => setShowCancelModal(true)} 
                    className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-6 py-2 font-medium"
                  >
                    Cancel Booking
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cancelled Status */}
      {isCancelled && (
        <div className="bg-gray-50 border border-gray-300 rounded-xl p-6 text-center">
          <div className="text-6xl mb-3">✗</div>
          <div className="text-2xl font-semibold text-gray-700 mb-2">This Booking Has Been Cancelled</div>
          <div className="text-gray-600">No further actions are available for this booking.</div>
          <div className="mt-4">
            <Link href="/search" className="inline-block bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-3 font-medium">
              Search for New Trips
            </Link>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md mx-4">
            <h3 className="text-xl font-bold mb-4">Confirm Cancellation</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel this booking? This action cannot be undone.
              {isConfirmed && ' A cancellation fee may apply.'}
            </p>
            <div className="flex gap-3">
              <button 
                onClick={confirmCancel} 
                disabled={cancelling} 
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white rounded-lg px-4 py-2 font-medium"
              >
                {cancelling ? 'Cancelling...' : 'Yes, Cancel Booking'}
              </button>
              <button 
                onClick={() => setShowCancelModal(false)} 
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg px-4 py-2 font-medium"
              >
                Keep Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


