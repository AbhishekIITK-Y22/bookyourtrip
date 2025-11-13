"use client";

import { Button } from "@/components/ui/button";
import { Plane, User, Menu, LogOut, Briefcase } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Navbar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  
  const isActive = (path: string) => pathname === path;

  const NavLinks = ({ mobile = false }) => (
    <div className={mobile ? "flex flex-col gap-4" : "hidden md:flex items-center gap-6"}>
      <Link
        href="/"
        className={`text-sm font-medium transition-colors hover:text-primary ${
          isActive("/") ? "text-primary" : "text-foreground/80"
        }`}
      >
        Home
      </Link>
      <Link
        href="/bookings"
        className={`text-sm font-medium transition-colors hover:text-primary ${
          isActive("/bookings") ? "text-primary" : "text-foreground/80"
        }`}
      >
        My Bookings
      </Link>
      <Link
        href="/provider"
        className={`text-sm font-medium transition-colors hover:text-primary ${
          isActive("/provider") ? "text-primary" : "text-foreground/80"
        }`}
      >
        Provider
      </Link>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Plane className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            BookYourTrip
          </span>
        </div>

        <NavLinks />

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {/* Handle auth */}}
            className="hidden md:flex"
          >
            <User className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
