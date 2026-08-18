"use client";
import { useState } from "react";

export function FlightsScreen() {
  const [from, setFrom] = useState("MNL");
  const [to, setTo] = useState("SIN");
  const [date, setDate] = useState("2026-08-18");
  const [name, setName] = useState("");
  const [fares, setFares] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [msg, setMsg] = useState("");

  async function search() {
    setLoading(true);
    setMsg("Searching live fares...");
    try {
      const res = await fetch("/api/flights/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from, to, departure_date: date }),
      });
      const data = await res.json();
      setFares(data.offers || []);
      setIsLive(data.live);
      setMsg(data.live? Live fares from Duffel - ${data.offers.length} found! Mas mura tayo P350 lang fee! : "Demo fares - add DUFFEL token to go live");
    } catch (e) {
      setMsg("Error searching");
    }
    setLoading(false);
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Flights + eTravel Bundle</h1>
        <p className="text-sm opacity-70">Search a route and the eTravel declaration is raised with the booking — one form instead of two.</p>
      </div>

      <div className="grid grid-cols-4 gap-3 bg-zinc-900 p-4 rounded-xl">
        <div>
          <label className="text-xs opacity-60">FROM</label>
          <input value={from} onChange={e=>setFrom(e.target.value.toUpperCase())} className="w-full bg-zinc-800 p-2 rounded mt-1" />
        </div>
        <div>
          <label className="text-xs opacity-60">TO</label>
          <input value={to} onChange={e=>setTo(e.target.value.toUpperCase())} className="w-full bg-zinc-800 p-2 rounded mt-1" />
        </div>
        <div>
          <label className="text-xs opacity-60">DEPARTURE DATE</label>
          <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="w-full bg-zinc-800 p-2 rounded mt-1" />
        </div>
        <div>
          <label className="text-xs opacity-60">PASSENGER NAME</label>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Juan Dela Cruz" className="w-full bg-zinc-800 p-2 rounded mt-1" />
        </div>
      </div>

      <button onClick={search} disabled={loading} className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-full font-medium disabled:opacity-50">
        {loading? "Searching..." : "🔍 Search flights"}
      </button>

      <div className={`text-xs p-3 rounded-lg ${isLive? "bg-green-900/50 text-green-300" : "bg-yellow-900/30 text-yellow-300"}`}>
        {isLive? "✅ " : "⚠️ "}{msg || (isLive? "Live fares from Duffel - Test mode. P350 service fee only!" : "Demonstration fares from a fixed sample catalog. No airline or booking system is connected.")}
      </div>

      <div className="space-y-3">
        {fares.map((f:any)=>(
          <div key={f.id} className="bg-zinc-900 p-4 rounded-xl flex justify-between items-center">
            <div>
              <div className="font-bold">{f.airline} {f.flight_number}</div>
              <div className="text-xs opacity-60">{f.from} → {f.to} • {f.departure? new Date(f.departure).toLocaleTimeString() : "Direct"}</div>
              {isLive && <div className="text-[10px] mt-1 text-green-400">P{Math.round(f.base_price)} + P350 fee = P{Math.round(f.price)} — Mas mura vs Trip.com!</div>}
            </div>
            <div className="text-right">
              <div className="text-xl font-bold">P{Math.round(f.price  f.total  5590).toLocaleString()}</div>
              <button className="mt-2 bg-blue-600 px-4 py-1.5 rounded-full text-sm">Book with eTravel →</button>
            </div>
          </div>
        ))}
      </div>

      {fares.length===0 &&!loading && (
        <div className="text-center opacity-50 py-10">Search MNL → SIN to see live fares</div>
      )}
    </div>
  );
}
