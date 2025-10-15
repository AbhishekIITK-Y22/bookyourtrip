"use client";
import { useState } from "react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CUSTOMER");
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const base = process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:3001";
      const body: any = { email, password, role };
      if (role === "PROVIDER" && companyName) {
        body.companyName = companyName;
      }
      const res = await fetch(`${base}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        // Handle both string errors and validation error objects
        let errorMsg = "Signup failed";
        if (typeof data?.error === 'string') {
          errorMsg = data.error;
        } else if (data?.error?.formErrors?.length > 0) {
          errorMsg = data.error.formErrors.join(', ');
        } else if (data?.error?.fieldErrors) {
          const fieldErrors = Object.entries(data.error.fieldErrors)
            .map(([field, errors]: [string, any]) => `${field}: ${errors.join(', ')}`)
            .join('; ');
          errorMsg = fieldErrors || "Validation failed";
        }
        throw new Error(errorMsg);
      }
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
            placeholder="Password (min 8 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
            <select
              className="w-full border rounded px-3 py-2 bg-white"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="CUSTOMER">🎫 Customer (Book tickets)</option>
              <option value="PROVIDER">🚌 Provider (Offer transport)</option>
            </select>
          </div>
          {role === "PROVIDER" && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
              <label className="block text-sm font-semibold text-blue-900 mb-2">
                Company Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                className="w-full border border-blue-300 rounded px-3 py-2"
                placeholder="e.g., Express Bus Co."
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
              <p className="text-xs text-blue-700 mt-2">
                This will be the name of your transportation company visible to customers.
              </p>
            </div>
          )}
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary-gradient disabled:opacity-60 text-white rounded-lg px-4 py-3 font-medium"
          >
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>
        <div className="text-sm text-gray-600 mt-4">
          Already have an account? <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">Login</a>
        </div>
      </div>
    </div>
  );
}


