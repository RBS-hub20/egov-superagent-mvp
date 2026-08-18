"use client";
import { useState } from "react";
export function FlightsScreen() {
  const [from,setFrom]=useState("MNL");const [to,setTo]=useState("SIN");const [date,setDate]=useState("2026-08-18");const [name,setName]=useState("");const [fares,setFares]=useState<any[]>([]);const [loading,setLoading]=useState(false);const [isLive,setIsLive]=useState(false);const [msg,setMsg]=useState("Click Search to go live");
  async function search(){
    setLoading(true);setMsg("Searching live fares via Duffel...");
    try{
      const res=await fetch("/api/flights/search",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({from,to,departure_date:date})});
      const data=await res.json();setFares(data.offers||[]);setIsLive(!!data.live);
      if(data.live){setMsg("LIVE - "+(data.offers?.length||0)+" fares found! P350 fee only!");}else{setMsg("Demo mode");}
    }catch(e){setMsg("Error");}
    setLoading(false);
  }
  return (<div className="p-6 max-w-5xl mx-auto space-y-6"><h1 className="text-2xl font-bold">Flights + eTravel Bundle</h1><div className="grid grid-cols-4 gap-3 bg-zinc-900 p-4 rounded-xl"><div><label className="text-xs">FROM</label><input value={from} onChange={e=>setFrom(e.target.value.toUpperCase())} className="w-full bg-zinc-800 p-2 rounded mt-1"/></div><div><label className="text-xs">TO</label><input value={to} onChange={e=>setTo(e.target.value.toUpperCase())} className="w-full bg-zinc-800 p-2 rounded mt-1"/></div><div><label className="text-xs">DATE</label><input type="date" value={date} onChange={e=>setDate(e.target.value)} className="w-full bg-zinc-800 p-2 rounded mt-1"/></div><div><label className="text-xs">PASSENGER</label><input value={name} onChange={e=>setName(e.target.value)} className="w-full bg-zinc-800 p-2 rounded mt-1"/></div></div><button onClick={search} disabled={loading} className="bg-blue-600 px-6 py-2 rounded-full">{loading?"Searching...":"Search flights"}</button><div className="text-xs p-3 rounded-lg bg-yellow-900/30">{msg}</div><div className="space-y-3">{fares.map((f:any)=>(<div key={f.id} className="bg-zinc-900 p-4 rounded-xl flex justify-between"><div><div className="font-bold">{f.airline}</div><div className="text-xs">{f.from}-{f.to}</div></div><div className="font-bold">P{Math.round(f.price||0)}</div></div>))}</div></div>);
}
