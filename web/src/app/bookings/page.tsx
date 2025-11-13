"use client";
import { useEffect, useState } from "react";
import { BOOKING_URL } from "@/lib/api";
import { Calendar, MapPin, Clock, CreditCard, User, AlertCircle } from "lucide-react";

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
    return <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">Cancelled</span>;
  }
  if (state === 'CONFIRMED' && paymentState === 'PAID') {
    return <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">Confirmed</span>;
  }
  if (state === 'PENDING' && paymentState === 'PENDING') {
    return <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">Payment Pending</span>;
  }
  if (state === 'PENDING' && paymentState === 'FAILED') {
    return <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">Payment Failed</span>;
  }
  if (state === 'RESCHEDULED') {
    return <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">Rescheduled</span>;
  }
  return <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">{state}</span>;
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

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading your bookings...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-600 text-lg">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600">Manage and track your travel bookings</p>
        </div>
        
        {items.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
            <p className="text-gray-600 mb-6">Start your journey by booking your first trip!</p>
            <a 
              href="/" 
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <MapPin className="h-4 w-4 mr-2" />
              Browse Trips
            </a>
          </div>
        )}
        
        <div className="grid gap-6">
          {items.map((b) => {
            const timeRemaining = getTimeRemaining(b.createdAt, b.state, b.paymentState);
            const isExpiring = timeRemaining && timeRemaining !== 'Expired';
            
            return (
              <div key={b.id} className={`bg-white rounded-xl shadow-sm border ${isExpiring ? 'border-yellow-400 border-2' : 'border-gray-200'} hover:shadow-md transition-shadow`}>
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-blue-600" />
                          <span className="font-semibold text-gray-900">
                            {b.trip?.route?.source} → {b.trip?.route?.destination}
                          </span>
                        </div>
                        {getStatusBadge(b.state, b.paymentState)}
                      </div>
                      
                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-600">Departure</p>
                            <p className="font-medium">
                              {b.trip?.departure ? new Date(b.trip?.departure as string).toLocaleString() : '-'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-600">Seat</p>
                            <p className="font-medium">{b.seatNo}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-600">Price</p>
                            <p className="font-medium text-green-600">₹{b.priceApplied}</p>
                          </div>
                        </div>
                      </div>
                      
                      {isExpiring && (
                        <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                          <Clock className="h-4 w-4 text-yellow-600" />
                          <div className="text-sm">
                            <p className="font-medium text-yellow-800">
                              Payment expires in {timeRemaining}
                            </p>
                            <p className="text-yellow-700">Complete payment or booking will be cancelled</p>
                          </div>
                        </div>
                      )}
                      
                      {timeRemaining === 'Expired' && b.state === 'PENDING' && (
                        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                          <AlertCircle className="h-4 w-4 text-red-600" />
                          <div className="text-sm">
                            <p className="font-medium text-red-800">Booking Expired</p>
                            <p className="text-red-700">This booking has expired and will be auto-cancelled shortly</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-2 ml-6">
                      <a 
                        href={`/booking/${b.id}`} 
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
                      >
                        View Details
                      </a>
                      {b.state === 'CONFIRMED' && b.paymentState === 'PAID' && (
                        <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


