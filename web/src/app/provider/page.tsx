"use client";
import { useEffect, useState } from "react";
import { BOOKING_URL } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Bus, Route, Calendar, Users, DollarSign, Plus, MapPin, Clock, TrendingUp } from "lucide-react";

function decodeToken(token: string): { sub: string; role: string } | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    if (!payload?.sub || !payload?.role) return null;
    return { sub: payload.sub, role: payload.role };
  } catch {
    return null;
  }
}

export default function ProviderPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [myProvider, setMyProvider] = useState<any | null>(null);
  const [routes, setRoutes] = useState<any[]>([]);
  const [trips, setTrips] = useState<any[]>([]);
  const [stats, setStats] = useState<{ totalBookings: number; revenue: number }>({ totalBookings: 0, revenue: 0 });
  const [newRoute, setNewRoute] = useState({ source: "", destination: "" });
  const [newTrip, setNewTrip] = useState({ routeId: "", departure: "", capacity: "", basePrice: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get userId from JWT token
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
    
    // Check if user is a provider
    if (decoded.role !== "PROVIDER") {
      alert("Access denied. This page is for providers only.");
      router.push("/");
      return;
    }
    
    setUserId(decoded.sub);
  }, [router]);

  useEffect(() => {
    if (userId) {
      fetchMyProvider();
    }
  }, [userId]);

  useEffect(() => {
    if (myProvider) {
      fetchRoutes();
    }
  }, [myProvider]);

  useEffect(() => {
    if (myProvider && routes.length >= 0) {
      fetchTrips();
    }
  }, [myProvider, routes]);

  useEffect(() => {
    if (myProvider) {
      fetchStats();
    }
  }, [myProvider]);

  async function fetchMyProvider() {
    try {
      // Fetch only this user's provider (single-owner model)
      const res = await fetch(`${BOOKING_URL}/providers?userId=${userId}`);
      const data = await res.json();
      const provider = Array.isArray(data) && data.length > 0 ? data[0] : null;
      setMyProvider(provider);
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  }

  async function fetchRoutes() {
    try {
      const res = await fetch(`${BOOKING_URL}/routes`);
      const data = await res.json();
      // Filter routes that belong to my provider
      if (myProvider) {
        setRoutes((data || []).filter((r: any) => r.providerId === myProvider.id));
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function fetchStats() {
    try {
      if (!myProvider) return;
      const token = localStorage.getItem('token');
      const res = await fetch(`${BOOKING_URL}/providers/${myProvider.id}/stats`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      });
      if (res.ok) {
        const data = await res.json();
        setStats({
          totalBookings: Number(data.totalBookings || 0),
          revenue: Number(data.revenue || 0)
        });
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function fetchTrips() {
    try {
      const res = await fetch(`${BOOKING_URL}/trips`);
      const data = await res.json();
      // Filter trips that belong to my routes
      if (myProvider) {
        const myRouteIds = routes.map(r => r.id);
        setTrips((data || []).filter((t: any) => myRouteIds.includes(t.routeId)));
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function createRoute(e: React.FormEvent) {
    e.preventDefault();
    if (!myProvider) {
      alert("Provider not found. Please contact support.");
      return;
    }
    try {
      const res = await fetch(`${BOOKING_URL}/routes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          providerId: myProvider.id,
          source: newRoute.source,
          destination: newRoute.destination,
        }),
      });
      if (res.ok) {
        setNewRoute({ source: "", destination: "" });
        await fetchRoutes();
      } else {
        const error = await res.json();
        alert(`Failed to create route: ${error.error || 'Unknown error'}`);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to create route");
    }
  }

  async function createTrip(e: React.FormEvent) {
    e.preventDefault();
    if (!myProvider) {
      alert("Provider not found. Please contact support.");
      return;
    }
    try {
      const res = await fetch(`${BOOKING_URL}/trips`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          routeId: newTrip.routeId,
          departure: newTrip.departure,
          capacity: Number(newTrip.capacity),
          basePrice: Number(newTrip.basePrice),
        }),
      });
      if (res.ok) {
        setNewTrip({ routeId: "", departure: "", capacity: "", basePrice: "" });
        await fetchTrips();
      } else {
        const error = await res.json();
        alert(`Failed to create trip: ${error.error || 'Unknown error'}`);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to create trip");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading provider dashboard...</p>
        </div>
      </div>
    );
  }

  if (!myProvider) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <Bus className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-semibold mb-2">No Provider Account Found</h1>
            <p className="text-gray-600 mb-6">
              It looks like your provider account wasn't created automatically during signup. Please contact support to set up your provider account.
            </p>
            <button 
              onClick={() => router.push("/")} 
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Provider Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{myProvider.name}</h1>
              <p className="text-gray-600">Provider Dashboard</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                myProvider.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
              }`}>
                {myProvider.status}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Route className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm text-blue-600 font-medium">Total Routes</p>
                  <p className="text-2xl font-bold text-blue-700">{routes.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Bus className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-sm text-purple-600 font-medium">Active Trips</p>
                  <p className="text-2xl font-bold text-purple-700">{trips.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm text-green-600 font-medium">Total Bookings</p>
                  <p className="text-2xl font-bold text-green-700">{stats.totalBookings}</p>
                </div>
              </div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-sm text-orange-600 font-medium">Revenue</p>
                  <p className="text-2xl font-bold text-orange-700">₹{stats.revenue}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Create Route */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">1</div>
              <h2 className="text-xl font-semibold text-gray-900">Create Route</h2>
            </div>
            <p className="text-sm text-gray-600 mb-6">Define a path between two cities for your company</p>
            <form onSubmit={createRoute} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., New York"
                  value={newRoute.source}
                  onChange={(e) => setNewRoute({ ...newRoute, source: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Boston"
                  value={newRoute.destination}
                  onChange={(e) => setNewRoute({ ...newRoute, destination: e.target.value })}
                  required
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-purple-600 text-white rounded-lg px-4 py-2 font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Create Route
              </button>
            </form>
          </div>

          {/* Create Trip */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">2</div>
              <h2 className="text-xl font-semibold text-gray-900">Create Trip</h2>
            </div>
            <p className="text-sm text-gray-600 mb-6">Schedule a new trip on one of your routes</p>
            <form onSubmit={createTrip} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Route</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newTrip.routeId}
                  onChange={(e) => setNewTrip({ ...newTrip, routeId: e.target.value })}
                  required
                >
                  <option value="">Select Route</option>
                  {routes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.source} → {r.destination}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Departure Date & Time</label>
                <input
                  type="datetime-local"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newTrip.departure}
                  onChange={(e) => setNewTrip({ ...newTrip, departure: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Capacity (seats)</label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 50"
                  value={newTrip.capacity}
                  onChange={(e) => setNewTrip({ ...newTrip, capacity: e.target.value })}
                  required
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Base Price (₹)</label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 500"
                  value={newTrip.basePrice}
                  onChange={(e) => setNewTrip({ ...newTrip, basePrice: e.target.value })}
                  required
                  min="1"
                />
              </div>
              <button
                type="submit"
                disabled={routes.length === 0}
                className="w-full bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg px-4 py-2 font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Create Trip
              </button>
            </form>
            {routes.length === 0 && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-700">
                  ⚠️ Create a route first before adding trips
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Routes Section */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Route className="h-6 w-6 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900">Your Routes</h2>
          </div>
          {routes.length === 0 ? (
            <div className="text-center py-12">
              <Route className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No routes yet</h3>
              <p className="text-gray-600">Create your first route above to get started!</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {routes.map((r) => (
                <div key={r.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-purple-100 rounded-full p-2">
                        <MapPin className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {r.source} → {r.destination}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Created {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 font-mono">{r.id.slice(0, 8)}...</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Trips Section */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <Bus className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Your Trips</h2>
          </div>
          {trips.length === 0 ? (
            <div className="text-center py-12">
              <Bus className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No trips yet</h3>
              <p className="text-gray-600">Create your first trip to start accepting bookings!</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {trips.map((t) => (
                <div key={t.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 rounded-full p-2">
                        <Bus className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {t.route?.source || 'N/A'} → {t.route?.destination || 'N/A'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Trip ID: {t.id.slice(0, 8)}...
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">₹{t.basePrice}</p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-600">Departure</p>
                        <p className="font-medium">
                          {t.departure ? new Date(t.departure).toLocaleString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-600">Capacity</p>
                        <p className="font-medium">{t.capacity} seats</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-600">Base Price</p>
                        <p className="font-medium text-green-600">₹{t.basePrice}</p>
                      </div>
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
