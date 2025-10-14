"use client";
import { useEffect, useState } from "react";
import { BOOKING_URL } from "@/lib/api";
import { useRouter } from "next/navigation";

function decodeRole(token: string): string | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return payload?.role ?? null;
  } catch {
    return null;
  }
}

export default function ProviderDashboard() {
  const router = useRouter();
  type RouteItem = { id: string; provider?: { name?: string }; providerId?: string; source: string; destination: string };
  type TripItem = { id: string; route?: { source?: string; destination?: string }; departure: string; capacity: number; basePrice: number };
  const [routes, setRoutes] = useState<RouteItem[]>([]);
  const [trips, setTrips] = useState<TripItem[]>([]);
  const [providerName, setProviderName] = useState("");
  const [newRoute, setNewRoute] = useState({ providerId: "", source: "", destination: "" });
  const [newTrip, setNewTrip] = useState({ routeId: "", departure: "", capacity: 40, basePrice: 1000 });
  const [message, setMessage] = useState<string | null>(null);

  async function load() {
    const [routesRes, tripsRes] = await Promise.all([
      fetch(`${BOOKING_URL}/routes`),
      fetch(`${BOOKING_URL}/trips`),
    ]);
    setRoutes(await routesRes.json());
    setTrips(await tripsRes.json());
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = token ? decodeRole(token) : null;
    if (!token) { router.push('/login'); return; }
    if (role !== 'PROVIDER') { router.push('/'); return; }
    load();
  }, []);

  async function createProvider() {
    setMessage(null);
    const res = await fetch(`${BOOKING_URL}/providers`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: providerName }) });
    if (res.ok) { setProviderName(""); setMessage('Provider created'); load(); }
  }

  async function createRoute() {
    setMessage(null);
    const res = await fetch(`${BOOKING_URL}/routes`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newRoute) });
    if (res.ok) { setNewRoute({ providerId: "", source: "", destination: "" }); setMessage('Route created'); load(); }
  }

  async function createTrip() {
    setMessage(null);
    const res = await fetch(`${BOOKING_URL}/trips`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newTrip) });
    if (res.ok) { setNewTrip({ routeId: "", departure: "", capacity: 40, basePrice: 1000 }); setMessage('Trip created'); load(); }
  }

  return (
    <div className="grid gap-6">
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold mb-2">Provider Dashboard</h1>
        <p className="text-gray-600">Create providers, routes, and trips.</p>
      </div>

      {message && <div className="rounded border bg-green-50 text-green-800 p-3">{message}</div>}

      <div className="grid md:grid-cols-3 gap-4">
        <div className="rounded-xl border bg-white p-4 grid gap-2">
          <div className="font-medium">Create Provider</div>
          <input className="border rounded px-3 py-2" placeholder="Provider name" value={providerName} onChange={(e) => setProviderName(e.target.value)} />
          <button onClick={createProvider} className="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2">Create</button>
        </div>

        <div className="rounded-xl border bg-white p-4 grid gap-2">
          <div className="font-medium">Create Route</div>
          <input className="border rounded px-3 py-2" placeholder="Provider ID" value={newRoute.providerId} onChange={(e) => setNewRoute({ ...newRoute, providerId: e.target.value })} />
          <input className="border rounded px-3 py-2" placeholder="Source" value={newRoute.source} onChange={(e) => setNewRoute({ ...newRoute, source: e.target.value })} />
          <input className="border rounded px-3 py-2" placeholder="Destination" value={newRoute.destination} onChange={(e) => setNewRoute({ ...newRoute, destination: e.target.value })} />
          <button onClick={createRoute} className="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2">Create</button>
        </div>

        <div className="rounded-xl border bg-white p-4 grid gap-2">
          <div className="font-medium">Create Trip</div>
          <input className="border rounded px-3 py-2" placeholder="Route ID" value={newTrip.routeId} onChange={(e) => setNewTrip({ ...newTrip, routeId: e.target.value })} />
          <input className="border rounded px-3 py-2" type="datetime-local" value={newTrip.departure} onChange={(e) => setNewTrip({ ...newTrip, departure: e.target.value })} />
          <input className="border rounded px-3 py-2" type="number" placeholder="Capacity" value={newTrip.capacity} onChange={(e) => setNewTrip({ ...newTrip, capacity: Number(e.target.value) })} />
          <input className="border rounded px-3 py-2" type="number" placeholder="Base Price" value={newTrip.basePrice} onChange={(e) => setNewTrip({ ...newTrip, basePrice: Number(e.target.value) })} />
          <button onClick={createTrip} className="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2">Create</button>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-4">
        <div className="font-medium mb-2">Routes</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-gray-500">
              <tr><th>Route ID</th><th>Provider</th><th>From</th><th>To</th></tr>
            </thead>
            <tbody>
              {routes.map((r) => (
                <tr key={r.id} className="border-t"><td>{r.id}</td><td>{r.provider?.name || r.providerId}</td><td>{r.source}</td><td>{r.destination}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-4">
        <div className="font-medium mb-2">Trips</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-gray-500">
              <tr><th>Trip ID</th><th>Route</th><th>Departure</th><th>Capacity</th><th>Base Price</th></tr>
            </thead>
            <tbody>
              {trips.map((t) => (
                <tr key={t.id} className="border-t"><td>{t.id}</td><td>{t.route?.source}→{t.route?.destination}</td><td>{new Date(t.departure).toLocaleString()}</td><td>{t.capacity}</td><td>₹{t.basePrice}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


