'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const BOOKING_URL = process.env.NEXT_PUBLIC_BOOKING_URL || 'http://localhost:3002';

interface Booking {
  id: string;
  userId: string;
  tripId: string;
  seatNo: string;
  priceApplied: number;
  state: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'RESCHEDULED';
  paymentState: 'PENDING' | 'PROCESSING' | 'PAID' | 'FAILED' | 'REFUNDED';
  passengerName?: string;
  passengerEmail?: string;
  passengerPhone?: string;
  createdAt: string;
  updatedAt: string;
  trip: {
    id: string;
    departure: string;
    capacity: number;
    basePrice: number;
    route: {
      id: string;
      source: string;
      destination: string;
      provider: {
        id: string;
        name: string;
      };
    };
  };
}

interface Trip {
  id: string;
  departure: string;
  capacity: number;
  basePrice: number;
  route: {
    source: string;
    destination: string;
  };
}

export default function ProviderBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [myProvider, setMyProvider] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTripId, setSelectedTripId] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('');
  const router = useRouter();

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.role !== 'PROVIDER') {
        router.push('/');
        return;
      }
    } catch {
      router.push('/login');
      return;
    }
  }, [router]);

  // Fetch provider data
  useEffect(() => {
    fetchMyProvider();
  }, []);

  // Fetch trips when provider is loaded
  useEffect(() => {
    if (myProvider) {
      fetchTrips();
    }
  }, [myProvider]);

  // Fetch bookings when trips are loaded
  useEffect(() => {
    if (myProvider && trips.length >= 0) {
      fetchBookings();
    }
  }, [myProvider, trips, selectedTripId, selectedState]);

  async function fetchMyProvider() {
    try {
      const token = localStorage.getItem('token');
      const payload = JSON.parse(atob(token!.split('.')[1]));
      const userId = payload.sub;

      const res = await fetch(`${BOOKING_URL}/providers?userId=${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        const providers = await res.json();
        setMyProvider(providers[0] || null);
      }
    } catch (e) {
      console.error('Failed to fetch provider:', e);
    }
  }

  async function fetchTrips() {
    if (!myProvider) return;
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${BOOKING_URL}/trips?providerId=${myProvider.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        const tripsData = await res.json();
        setTrips(tripsData);
      }
    } catch (e) {
      console.error('Failed to fetch trips:', e);
    } finally {
      setLoading(false);
    }
  }

  async function fetchBookings() {
    if (!myProvider) return;
    
    try {
      const token = localStorage.getItem('token');
      let url = `${BOOKING_URL}/providers/${myProvider.id}/bookings`;
      const params = new URLSearchParams();
      
      if (selectedTripId) params.append('tripId', selectedTripId);
      if (selectedState) params.append('state', selectedState);
      
      if (params.toString()) url += `?${params.toString()}`;
      
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        const bookingsData = await res.json();
        setBookings(bookingsData);
      }
    } catch (e) {
      console.error('Failed to fetch bookings:', e);
    }
  }

  function getStateBadgeColor(state: string) {
    switch (state) {
      case 'CONFIRMED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      case 'RESCHEDULED': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  function getPaymentBadgeColor(paymentState: string) {
    switch (paymentState) {
      case 'PAID': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      case 'PROCESSING': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-600">Loading bookings...</div>
        </div>
      </div>
    );
  }

  if (!myProvider) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🚫</div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">No Provider Account Found</h1>
          <p className="text-gray-600 mb-4">It looks like your provider account wasn't created automatically during signup.</p>
          <button 
            onClick={() => router.push('/provider')}
            className="btn-primary-gradient text-white px-4 py-2 rounded-lg"
          >
            Go to Provider Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">📋 Booking Management</h1>
              <p className="text-gray-600 mt-1">Manage all bookings for {myProvider.name}</p>
            </div>
            <button 
              onClick={() => router.push('/provider')}
              className="btn-primary-gradient text-white px-4 py-2 rounded-lg"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">🔍 Filter Bookings</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Trip</label>
              <select
                className="w-full border rounded-lg px-3 py-2"
                value={selectedTripId}
                onChange={(e) => setSelectedTripId(e.target.value)}
              >
                <option value="">All Trips</option>
                {trips.map((trip) => (
                  <option key={trip.id} value={trip.id}>
                    {trip.route.source} → {trip.route.destination} - {trip.departure ? new Date(trip.departure).toLocaleString() : 'N/A'}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
              <select
                className="w-full border rounded-lg px-3 py-2"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="RESCHEDULED">Rescheduled</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setSelectedTripId('');
                  setSelectedState('');
                }}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border p-4">
            <div className="text-2xl font-bold text-blue-600">{bookings.length}</div>
            <div className="text-sm text-gray-600">Total Bookings</div>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <div className="text-2xl font-bold text-green-600">
              {bookings.filter(b => b.state === 'CONFIRMED').length}
            </div>
            <div className="text-sm text-gray-600">Confirmed</div>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {bookings.filter(b => b.state === 'PENDING').length}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <div className="text-2xl font-bold text-red-600">
              {bookings.filter(b => b.state === 'CANCELLED').length}
            </div>
            <div className="text-sm text-gray-600">Cancelled</div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold">📊 All Bookings</h2>
          </div>
          
          {bookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📭</div>
              <div className="text-gray-500 text-lg">No bookings found</div>
              <div className="text-gray-400 text-sm mt-2">
                {selectedTripId || selectedState ? 'Try adjusting your filters' : 'Create trips to start receiving bookings'}
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="text-left text-sm text-gray-600">
                    <th className="px-6 py-3">Booking ID</th>
                    <th className="px-6 py-3">Route</th>
                    <th className="px-6 py-3">Departure</th>
                    <th className="px-6 py-3">Passenger</th>
                    <th className="px-6 py-3">Seat</th>
                    <th className="px-6 py-3">Price</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Payment</th>
                    <th className="px-6 py-3">Booked</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-mono text-xs text-gray-500">
                          {booking.id.slice(0, 12)}...
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium">
                          {booking.trip.route.source} → {booking.trip.route.destination}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          {booking.trip.departure ? new Date(booking.trip.departure).toLocaleString() : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="font-medium">{booking.passengerName || 'Not provided'}</div>
                          <div className="text-gray-500">{booking.passengerEmail || 'No email'}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {booking.seatNo}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-green-600">₹{booking.priceApplied}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStateBadgeColor(booking.state)}`}>
                          {booking.state}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentBadgeColor(booking.paymentState)}`}>
                          {booking.paymentState}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-gray-500">
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
