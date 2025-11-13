"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Calendar } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface SearchFormProps {
  variant?: "hero" | "compact";
}

export const SearchForm = ({ variant = "hero" }: SearchFormProps) => {
  const router = useRouter();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (from) params.set('from', from);
    if (to) params.set('to', to);
    if (date) params.set('date', date);
    router.push(`/search?${params.toString()}`);
  };

  const isHero = variant === "hero";

  return (
    <form
      onSubmit={handleSearch}
      className={`${
        isHero
          ? "bg-white rounded-2xl shadow-xl p-6 md:p-8"
          : "bg-gray-50 rounded-xl p-4"
      }`}
    >
      <div className={`grid gap-4 ${isHero ? "md:grid-cols-4" : "md:grid-cols-3"}`}>
        <div className="relative">
          <label className="text-sm font-medium mb-2 block">From</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="New York"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="relative">
          <label className="text-sm font-medium mb-2 block">To</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Boston"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="relative">
          <label className="text-sm font-medium mb-2 block">Date</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="pl-10"
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>

        <button 
          type="submit" 
          className={`px-6 py-3 rounded-lg font-semibold text-white flex items-center justify-center gap-2 ${
            isHero 
              ? "bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90 shadow-lg hover:shadow-xl md:mt-7" 
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          <Search className="h-4 w-4" />
          Search
        </button>
      </div>
    </form>
  );
};
