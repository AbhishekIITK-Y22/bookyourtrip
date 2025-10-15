"use client";
import { useEffect, useState } from "react";
import { BOOKING_URL } from "@/lib/api";
import { useRouter } from "next/navigation";

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
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-12">
          <div className="text-xl text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  if (!myProvider) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="rounded-xl border bg-white p-8 shadow-sm text-center">
          <div className="text-6xl mb-4">🚌</div>
          <h1 className="text-2xl font-semibold mb-2">No Provider Account Found</h1>
          <p className="text-gray-600 mb-6">
            It looks like your provider account wasn't created automatically during signup. Please contact support to set up your provider account.
          </p>
          <button onClick={() => router.push("/")} className="btn-primary-gradient text-white rounded-lg px-6 py-3 font-medium">
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto grid gap-6">
      {/* Provider Info */}
      <div className="rounded-xl border bg-gradient-to-r from-purple-50 to-blue-50 p-6 shadow-sm">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
          {myProvider.name}
        </h1>
        <p className="text-gray-600">Provider Dashboard</p>
        <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
          <div className="bg-white rounded-lg p-3">
            <div className="text-gray-600">Routes</div>
            <div className="text-2xl font-bold text-purple-600">{routes.length}</div>
          </div>
          <div className="bg-white rounded-lg p-3">
            <div className="text-gray-600">Trips</div>
            <div className="text-2xl font-bold text-blue-600">{trips.length}</div>
          </div>
          <div className="bg-white rounded-lg p-3">
            <div className="text-gray-600">Status</div>
            <div className="text-sm font-semibold text-green-600">{myProvider.status}</div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Create Route */}
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">1</span>
            <h2 className="text-xl font-semibold">Create Route</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">Define a path between two cities for your company</p>
          <form onSubmit={createRoute} className="grid gap-3">
            <input
              className="border rounded-lg px-3 py-2"
              placeholder="From (e.g., New York)"
              value={newRoute.source}
              onChange={(e) => setNewRoute({ ...newRoute, source: e.target.value })}
              required
            />
            <input
              className="border rounded-lg px-3 py-2"
              placeholder="To (e.g., Boston)"
              value={newRoute.destination}
              onChange={(e) => setNewRoute({ ...newRoute, destination: e.target.value })}
              required
            />
            <button type="submit" className="btn-primary-gradient text-white rounded-lg px-4 py-2 font-medium">
              Create Route
            </button>
          </form>
        </div>

        {/* Create Trip */}
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">2</span>
            <h2 className="text-xl font-semibold">Create Trip</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">Schedule a new trip on one of your routes</p>
          <form onSubmit={createTrip} className="grid gap-3">
            <select
              className="border rounded-lg px-3 py-2 bg-white"
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
            <input
              type="datetime-local"
              className="border rounded-lg px-3 py-2"
              value={newTrip.departure}
              onChange={(e) => setNewTrip({ ...newTrip, departure: e.target.value })}
              required
            />
            <input
              type="number"
              className="border rounded-lg px-3 py-2"
              placeholder="Capacity (seats)"
              value={newTrip.capacity}
              onChange={(e) => setNewTrip({ ...newTrip, capacity: e.target.value })}
              required
              min="1"
            />
            <input
              type="number"
              className="border rounded-lg px-3 py-2"
              placeholder="Base Price (₹)"
              value={newTrip.basePrice}
              onChange={(e) => setNewTrip({ ...newTrip, basePrice: e.target.value })}
              required
              min="1"
            />
            <button
              type="submit"
              disabled={routes.length === 0}
              className="btn-primary-gradient disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg px-4 py-2 font-medium"
            >
              Create Trip
            </button>
          </form>
          {routes.length === 0 && (
            <div className="mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded p-2">
              ⚠️ Create a route first before adding trips
            </div>
          )}
        </div>
      </div>

      {/* Routes Table */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Your Routes</h2>
        {routes.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <div className="text-4xl mb-2">🛣️</div>
            <div>No routes yet. Create one above to get started!</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr className="text-left text-gray-600">
                  <th className="pb-2">Route ID</th>
                  <th className="pb-2">From</th>
                  <th className="pb-2">To</th>
                  <th className="pb-2">Created</th>
                </tr>
              </thead>
              <tbody>
                {routes.map((r) => (
                  <tr key={r.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 font-mono text-xs text-gray-500">{r.id.slice(0, 12)}...</td>
                    <td className="py-3 font-medium">{r.source}</td>
                    <td className="py-3 font-medium">{r.destination}</td>
                    <td className="py-3 text-gray-600">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Trips Table */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Your Trips</h2>
        {trips.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <div className="text-4xl mb-2">🚌</div>
            <div>No trips yet. Create a trip to start accepting bookings!</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr className="text-left text-gray-600">
                  <th className="pb-2">Trip ID</th>
                  <th className="pb-2">Route</th>
                  <th className="pb-2">Departure</th>
                  <th className="pb-2">Capacity</th>
                  <th className="pb-2">Base Price</th>
                </tr>
              </thead>
              <tbody>
                {trips.map((t) => (
                  <tr key={t.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 font-mono text-xs text-gray-500">{t.id.slice(0, 12)}...</td>
                    <td className="py-3">
                      {t.route?.source || 'N/A'} → {t.route?.destination || 'N/A'}
                    </td>
                    <td className="py-3 font-medium">{t.departure ? new Date(t.departure).toLocaleString() : 'N/A'}</td>
                    <td className="py-3">{t.capacity} seats</td>
                    <td className="py-3 font-semibold text-green-600">₹{t.basePrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
