"use client";

import { Button } from "@/components/ui/button";
import { Plane, User, Menu, LogOut, Briefcase, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

interface NavbarProps {
  user?: {
    email?: string;
    role?: string;
  } | null;
  isAuthenticated?: boolean;
  onLogout?: () => void;
}

export const Navbar = ({ user, isAuthenticated, onLogout }: NavbarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  
  const isActive = (path: string) => pathname === path;

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    router.push("/");
  };

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={mobile ? "flex flex-col gap-4" : "hidden md:flex items-center gap-6"}>
      <Link
        href="/"
        className={`text-sm font-medium transition-colors hover:text-blue-600 ${
          isActive("/") ? "text-blue-600" : "text-gray-600"
        }`}
      >
        Home
      </Link>
      <Link
        href="/bookings"
        className={`text-sm font-medium transition-colors hover:text-blue-600 ${
          isActive("/bookings") ? "text-blue-600" : "text-gray-600"
        }`}
      >
        My Bookings
      </Link>
      {isAuthenticated && (
        <>
          <Link
            href="/dashboard"
            className={`text-sm font-medium transition-colors hover:text-blue-600 ${
              isActive("/dashboard") ? "text-blue-600" : "text-gray-600"
            }`}
          >
            Dashboard
          </Link>
          {user?.role === 'PROVIDER' && (
            <Link
              href="/provider"
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                isActive("/provider") ? "text-blue-600" : "text-gray-600"
              }`}
            >
              Provider
            </Link>
          )}
        </>
      )}
      <Link
        href="/ai-assistant"
        className={`text-sm font-medium transition-colors hover:text-blue-600 ${
          isActive("/ai-assistant") ? "text-blue-600" : "text-gray-600"
        }`}
      >
        AI Assistant
      </Link>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Plane className="h-6 w-6 text-blue-600" />
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            BookYourTrip
          </span>
        </div>

        <NavLinks />

        <div className="flex items-center gap-3">
                 {isAuthenticated ? (
                   <div className="hidden md:flex items-center gap-2">
                     <Link 
                       href="/profile"
                       className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                     >
                       {user?.email}
                     </Link>
                     <button 
                       onClick={handleLogout}
                       className="p-2 hover:bg-gray-100 rounded-md"
                     >
                       <LogOut className="h-5 w-5" />
                     </button>
                   </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link 
                href="/login"
                className="px-4 py-2 text-gray-600 hover:text-blue-600"
              >
                Login
              </Link>
              <Link 
                href="/signup"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </div>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-md"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-white">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                BookYourTrip
              </span>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-md"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 p-4 space-y-6">
              <NavLinks mobile />
              {isAuthenticated ? (
                <div className="space-y-4 pt-4 border-t">
                  <div className="text-sm font-medium">{user?.email}</div>
                  <div className="text-xs text-gray-500">{user?.role}</div>
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  <User className="h-4 w-4" />
                  My Dashboard
                </Link>
                {user?.role === 'PROVIDER' && (
                  <Link
                    href="/provider"
                    onClick={() => setIsOpen(false)}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center gap-2"
                  >
                    <Briefcase className="h-4 w-4" />
                    Provider Console
                  </Link>
                )}
                  <button 
                    onClick={handleLogout} 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center justify-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-2 pt-4 border-t">
                  <Link 
                    href="/login" 
                    onClick={() => setIsOpen(false)}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    Login
                  </Link>
                  <Link 
                    href="/signup" 
                    onClick={() => setIsOpen(false)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center justify-center"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
