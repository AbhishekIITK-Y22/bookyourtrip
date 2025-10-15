export default function Home() {
  return (
    <div className="grid gap-8">
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold mb-2">Plan your next trip</h1>
        <p className="text-gray-600 mb-6">Search routes, compare dynamic prices, and book securely.</p>
        <form className="grid md:grid-cols-5 gap-3" action="/search" method="get">
          <input className="border rounded px-3 py-2 md:col-span-2" placeholder="From (City)" name="from" />
          <input className="border rounded px-3 py-2 md:col-span-2" placeholder="To (City)" name="to" />
          <input className="border rounded px-3 py-2" type="date" name="date" />
          <button type="submit" className="md:col-span-5 btn-primary-gradient">Search</button>
        </form>
      </section>

      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-1">Why BookYourTrip?</h2>
        <ul className="text-gray-700 grid md:grid-cols-3 gap-4 mt-3">
          <li className="rounded border p-4">
            <div className="font-medium mb-1">Agentic AI Pricing</div>
            <div className="text-sm text-gray-600">Transparent, data-driven prices with confidence and reasoning.</div>
          </li>
          <li className="rounded border p-4">
            <div className="font-medium mb-1">Real-time Seat Locks</div>
            <div className="text-sm text-gray-600">No double booking — your seat is reserved while you pay.</div>
          </li>
          <li className="rounded border p-4">
            <div className="font-medium mb-1">Flexible Changes</div>
            <div className="text-sm text-gray-600">Cancel or reschedule with clear penalties and instant updates.</div>
          </li>
        </ul>
      </section>
    </div>
  );
}
