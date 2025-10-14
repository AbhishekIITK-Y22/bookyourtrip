"use client";
import { useState } from "react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CUSTOMER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const base = process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:3001";
      const res = await fetch(`${base}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Signup failed");
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
        <h1 className="text-2xl font-semibold mb-2">Create your account</h1>
        <p className="text-gray-600 mb-6">Join as a customer or provider.</p>
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
          <select
            className="border rounded px-3 py-2"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="CUSTOMER">Customer</option>
            <option value="PROVIDER">Provider</option>
          </select>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded px-4 py-2"
          >
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>
        <div className="text-sm text-gray-600 mt-4">
          Already have an account? <a href="/login" className="text-blue-600">Login</a>
        </div>
      </div>
    </div>
  );
}


