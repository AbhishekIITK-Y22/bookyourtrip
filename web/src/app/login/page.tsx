"use client";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const base = process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:3001";
      const res = await fetch(`${base}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Login failed");
      localStorage.setItem("token", data.token);
      window.location.href = "/";
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unexpected error";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold mb-2">Welcome back</h1>
        <p className="text-gray-600 mb-6">Login to manage your bookings.</p>
        <form onSubmit={onSubmit} className="grid gap-3">
          <input
            type="email"
            className="border rounded px-3 py-2"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="border rounded px-3 py-2"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded px-4 py-2"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="text-sm text-gray-600 mt-4">
          New here? <a href="/signup" className="text-blue-600">Create an account</a>
        </div>
      </div>
    </div>
  );
}


