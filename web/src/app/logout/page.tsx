"use client";
import { useEffect } from "react";

export default function LogoutPage() {
  useEffect(() => {
    try {
      localStorage.removeItem('token');
      // also clear cookie if we ever set it later
      document.cookie = 'token=; Max-Age=0; path=/';
    } finally {
      window.location.href = '/';
    }
  }, []);
  return <div>Logging out...</div>;
}


