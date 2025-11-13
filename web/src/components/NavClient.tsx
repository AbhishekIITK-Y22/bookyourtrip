"use client";
import { useEffect, useState } from "react";
import { Navbar } from "./Navbar";

function decodeToken(token: string): { role?: string; email?: string } | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return payload;
  } catch {
    return null;
  }
}

export default function NavClient() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<{ role?: string; email?: string } | null>(null);

  useEffect(() => {
    const t = localStorage.getItem('token');
    setToken(t);
    setUser(t ? decodeToken(t) : null);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <Navbar 
      isAuthenticated={!!token}
      user={user}
      onLogout={handleLogout}
    />
  );
}


