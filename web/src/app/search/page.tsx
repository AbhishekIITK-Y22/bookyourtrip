"use client";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BOOKING_URL } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SearchForm } from "@/components/SearchForm";
import { Clock, Users, MapPin, ArrowRight, Loader2, Filter, DollarSign, Calendar } from "lucide-react";

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
  const [filteredTrips, setFilteredTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    maxPrice: '',
    minPrice: '',
    sortBy: 'departure', // departure, price, capacity
    sortOrder: 'asc' // asc, desc
  });

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
        // If no search criteria, fetch all trips
        const url = query.params.toString() ? 
          `${BOOKING_URL}/search?${query.params.toString()}` : 
          `${BOOKING_URL}/trips`;
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) {
          setTrips([]);
        } else {
          const data = await res.json();
          setTrips(data);
          setFilteredTrips(data);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [query.params]);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...trips];

    // Price filters
    if (filters.minPrice) {
      filtered = filtered.filter(trip => trip.basePrice >= parseInt(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(trip => trip.basePrice <= parseInt(filters.maxPrice));
    }

    // Sorting
    filtered.sort((a, b) => {
      let aVal, bVal;
      switch (filters.sortBy) {
        case 'price':
          aVal = a.basePrice;
          bVal = b.basePrice;
          break;
        case 'capacity':
          aVal = a.capacity;
          bVal = b.capacity;
          break;
        case 'departure':
        default:
          aVal = new Date(a.departure).getTime();
          bVal = new Date(b.departure).getTime();
          break;
      }
      
      if (filters.sortOrder === 'desc') {
        return bVal - aVal;
      }
      return aVal - bVal;
    });

    setFilteredTrips(filtered);
  }, [trips, filters]);

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Search Form */}
        <div className="mb-8">
          <SearchForm variant="compact" />
        </div>

        {/* Filters */}
        <div className="mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Filter className="h-4 w-4" />
            Filters
          </button>
          
          {showFilters && (
            <div className="mt-4 bg-white border border-gray-200 rounded-lg p-4">
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Price (₹)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Price (₹)</label>
                  <input
                    type="number"
                    placeholder="10000"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="departure">Departure Time</option>
                    <option value="price">Price</option>
                    <option value="capacity">Capacity</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                  <select
                    value={filters.sortOrder}
                    onChange={(e) => setFilters({ ...filters, sortOrder: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Header */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
          <div className="p-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              Search Results
            </h2>
            <div className="text-gray-600">
              Showing results for <span className="font-semibold text-gray-900">{query.from || 'Anywhere'}</span> 
              <ArrowRight className="inline h-4 w-4 mx-2" />
              <span className="font-semibold text-gray-900">{query.to || 'Anywhere'}</span>
              {query.date && (
                <span className="ml-2">on <span className="font-semibold text-gray-900">{query.date}</span></span>
              )}
            </div>
          </div>
        </div>

        {/* Trip Results */}
        <div className="grid gap-4">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Searching for trips...</span>
            </div>
          )}
          
          {!loading && filteredTrips.length === 0 && trips.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="py-12 text-center">
                <div className="text-gray-600 mb-4">No trips match your filters</div>
                <p className="text-sm text-gray-500">Try adjusting your filter criteria</p>
              </div>
            </div>
          )}

          {!loading && trips.length === 0 && (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="py-12 text-center">
                <div className="text-gray-600 mb-4">No trips found</div>
                <p className="text-sm text-gray-500">Try adjusting your search criteria or dates</p>
              </div>
            </div>
          )}
          
          {filteredTrips.map((trip) => (
            <div key={trip.id} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-blue-600" />
                        <span className="font-semibold">{trip.route.source}</span>
                        <ArrowRight className="h-4 w-4 text-gray-500" />
                        <span className="font-semibold">{trip.route.destination}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {new Date(trip.departure).toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {trip.capacity} seats available
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <span className="text-2xl font-bold text-blue-600">₹{trip.basePrice}</span>
                      <span className="text-sm text-gray-600 ml-2">base price</span>
                    </div>
                  </div>
                  
                  <a 
                    href={`/trip/${trip.id}`}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View & Book
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
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


