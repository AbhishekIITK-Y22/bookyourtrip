"use client";
import { useEffect, useState } from "react";
import { BOOKING_URL } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, Clock, CreditCard, TrendingUp, Plus, Bus } from "lucide-react";

function decodeToken(token: string): { sub: string; role: string } | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    if (!payload?.sub || !payload?.role) return null;
    return { sub: payload.sub, role: payload.role };
  } catch {
    return null;
  }
}

type BookingItem = {
  id: string;
  seatNo: string;
  priceApplied: number;
  state: string;
  paymentState: string;
  createdAt: string;
  trip?: { 
    route?: { source?: string; destination?: string }; 
    departure?: string;
    basePrice?: number;
  };
};

export default function CustomerDashboard() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBookings: 0,
    confirmedBookings: 0,
    pendingBookings: 0,
    totalSpent: 0
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    
    const decoded = decodeToken(token);
    if (!decoded) {
      router.push("/login");
      return;
    }
    
    // Check if user is a customer
    // if (decoded.role !== "CUSTOMER") {
    //   alert("Access denied. This page is for customers only.");
    //   router.push("/");
    //   return;
    // }
    
    setUserId(decoded.sub);
  }, [router]);

  useEffect(() => {
    if (userId) {
      fetchBookings();
    }
  }, [userId]);

  useEffect(() => {
    if (bookings.length > 0) {
      calculateStats();
    }
  }, [bookings]);

  async function fetchBookings() {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${BOOKING_URL}/bookings`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      if (!res.ok) throw new Error('Failed to load bookings');
      const data = await res.json();
      setBookings(data);
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  }

  function calculateStats() {
    const total = bookings.length;
    const confirmed = bookings.filter(b => b.state === 'CONFIRMED' && b.paymentState === 'PAID').length;
    const pending = bookings.filter(b => b.state === 'PENDING' && b.paymentState === 'PENDING').length;
    const spent = bookings
      .filter(b => b.state === 'CONFIRMED' && b.paymentState === 'PAID')
      .reduce((sum, b) => sum + b.priceApplied, 0);
    
    setStats({ totalBookings: total, confirmedBookings: confirmed, pendingBookings: pending, totalSpent: spent });
  }

  function getStatusBadge(state: string, paymentState: string) {
    if (state === 'CANCELLED') {
      return <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">Cancelled</span>;
    }
    if (state === 'CONFIRMED' && paymentState === 'PAID') {
      return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">Confirmed</span>;
    }
    if (state === 'PENDING' && paymentState === 'PENDING') {
      return <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">Payment Pending</span>;
    }
    if (state === 'PENDING' && paymentState === 'FAILED') {
      return <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">Payment Failed</span>;
    }
    return <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">{state}</span>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's an overview of your travel bookings.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 rounded-full p-2">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Bookings</p>
                <p className="text-2xl font-bold text-blue-700">{stats.totalBookings}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 rounded-full p-2">
                <CreditCard className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-green-600 font-medium">Confirmed</p>
                <p className="text-2xl font-bold text-green-700">{stats.confirmedBookings}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-100 rounded-full p-2">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-yellow-600 font-medium">Pending</p>
                <p className="text-2xl font-bold text-yellow-700">{stats.pendingBookings}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 rounded-full p-2">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-purple-600 font-medium">Total Spent</p>
                <p className="text-2xl font-bold text-purple-700">₹{stats.totalSpent}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a 
              href="/search" 
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="bg-blue-100 rounded-full p-2">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Search Trips</h3>
                <p className="text-sm text-gray-600">Find your next journey</p>
              </div>
            </a>
            
            <a 
              href="/bookings" 
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="bg-green-100 rounded-full p-2">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">View Bookings</h3>
                <p className="text-sm text-gray-600">Manage your trips</p>
              </div>
            </a>
            
            <a 
              href="/" 
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="bg-purple-100 rounded-full p-2">
                <Plus className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Book New Trip</h3>
                <p className="text-sm text-gray-600">Start planning</p>
              </div>
            </a>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Bookings</h2>
            <a 
              href="/bookings" 
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View all
            </a>
          </div>
          
          {bookings.length === 0 ? (
            <div className="text-center py-12">
              <Bus className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
              <p className="text-gray-600 mb-6">Start your journey by booking your first trip!</p>
              <a 
                href="/" 
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Book Your First Trip
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.slice(0, 5).map((booking) => (
                <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-100 rounded-full p-2">
                        <MapPin className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {booking.trip?.route?.source || 'N/A'} → {booking.trip?.route?.destination || 'N/A'}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>Seat: {booking.seatNo}</span>
                          <span>₹{booking.priceApplied}</span>
                          <span>
                            {booking.trip?.departure ? new Date(booking.trip.departure).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(booking.state, booking.paymentState)}
                      <a 
                        href={`/booking/${booking.id}`}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        View
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
