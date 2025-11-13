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
    if (from && to && date) {
      router.push(`/search?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${date}`);
    }
  };

  const isHero = variant === "hero";

  return (
    <form
      onSubmit={handleSearch}
      className={`${
        isHero
          ? "bg-card rounded-2xl shadow-xl p-6 md:p-8"
          : "bg-secondary/50 rounded-xl p-4"
      }`}
    >
      <div className={`grid gap-4 ${isHero ? "md:grid-cols-4" : "md:grid-cols-3"}`}>
        <div className="relative">
          <label className="text-sm font-medium mb-2 block">From</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="New York"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        <div className="relative">
          <label className="text-sm font-medium mb-2 block">To</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Boston"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        <div className="relative">
          <label className="text-sm font-medium mb-2 block">Date</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="pl-10"
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </div>
        </div>

        <Button type="submit" variant={isHero ? "hero" : "default"} size="lg" className={isHero ? "md:mt-7" : ""}>
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>
    </form>
  );
};
