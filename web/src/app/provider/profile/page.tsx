"use client";
import { useEffect, useState } from "react";
import { BOOKING_URL } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function ProviderProfilePage() {
  const router = useRouter();
  const [providerId, setProviderId] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", description: "" });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
  }, [router]);

  async function save() {
    try {
      setSaving(true);
      setMessage(null);
      const res = await fetch(`${BOOKING_URL}/providers/${providerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Update failed');
      setMessage('Profile updated');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Update failed';
      setMessage(msg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-4 max-w-xl">
      <h1 className="text-2xl font-semibold">Provider Profile</h1>
      {message && <div className="rounded border bg-gray-50 p-3 text-sm">{message}</div>}
      <input className="border rounded px-3 py-2" placeholder="Provider ID" value={providerId} onChange={(e) => setProviderId(e.target.value)} />
      <input className="border rounded px-3 py-2" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input className="border rounded px-3 py-2" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input className="border rounded px-3 py-2" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      <textarea className="border rounded px-3 py-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <button onClick={save} disabled={saving} className="btn-primary-gradient disabled:opacity-60 w-max">{saving ? 'Saving...' : 'Save Changes'}</button>
    </div>
  );
}


