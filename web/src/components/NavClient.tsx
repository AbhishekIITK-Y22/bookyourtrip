"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

function decodeRole(token: string): string | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return payload?.role ?? null;
  } catch {
    return null;
  }
}

export default function NavClient() {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem('token');
    setToken(t);
    setRole(t ? decodeRole(t) : null);
  }, []);

  return (
    <nav className="text-sm text-gray-600 flex gap-4">
      <Link href="/" className="hover:text-blue-600">Search</Link>
      <Link href="/bookings" className="hover:text-blue-600">My Bookings</Link>
      {role === 'PROVIDER' && (
        <Link href="/provider" className="hover:text-blue-600">Provider</Link>
      )}
      {token ? (
        <Link href="/logout" className="hover:text-blue-600">Logout</Link>
      ) : (
        <Link href="/login" className="hover:text-blue-600">Login</Link>
      )}
    </nav>
  );
}


