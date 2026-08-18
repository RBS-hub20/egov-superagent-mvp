"use client";
import { useState } from "react";
export function FlightsScreen() {
  const [from,setFrom]=useState("MNL");const [to,setTo]=useState("SIN");const [date,setDate]=useState("2026-08-18");const [name,setName]=useState("JEMAR TARSITA");const [fares,setFares]=useState<any[]>([]);const [loading,setLoading]=useState(false);const [bookingId,setBookingId]=useState<string | null>(null);const [isLive,setIsLive]=useState(false);const [msg,setMsg]=useState("Click Search to go live");
  async function search(){
    setLoading(true);setMsg("Searching live fares via Duffel...");setBookingId(null);
    try{
      const res=await fetch("/api/flights/search",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({from,to,departure_date:date})});
      const data=await res.json();setFares(data.offers||[]);setIsLive(!!data.live);
      if(data.live){setMsg("LIVE - "+(data.offers?.length||0)+" fares found! P350 fee only! Mas mura vs Trip.com P1200");}else{setMsg("Demo mode");}
    }catch(e){setMsg("Error");}
    setLoading(false);
  }
  async function book(offer:any){
    if(!name){alert("Lagay mo passenger name muna Boss!");return;}
    setLoading(true);setMsg("Booking "+offer.airline+"... + raising eTravel...");
    try{
      const res=await fetch("/api/flights/book",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({offer_id: offer.id, passenger: name})});
      const data=await res.json();
      if(data.success){
        setBookingId(data.pnr);
        setMsg("SUCCESS! PNR: "+data.pnr+" - eTravel raised! P350 fee only!");
        alert("BOOKED! PNR: "+data.pnr+"\n\nNext: eTravel auto-filed for "+name);
      }else{
        setMsg("Booking failed: "+data.error);
        alert("Failed: "+data.error);
      }
    }catch(e:any){setMsg("Booking error");}
    setLoading(false);
  }
  return (<div className="p-6 max-w-5xl mx-auto space-y-6"><h1 className="text-2xl font-bold">Flights + eTravel Bundle</h1><p className="text-sm opacity-60">Search a route and eTravel declaration is raised with booking - one form instead of two.</p><div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-zinc-900 p-4 rounded-xl"><div><label className="text-xs opacity-60">FROM</label><input value={from} onChange={e=>setFrom(e.target.value.toUpperCase())} className="w-full bg-zinc-800 p-2 rounded mt-1"/></div><div><label className="text-xs opacity-60">TO</label><input value={to} onChange={e=>setTo(e.target.value.toUpperCase())} className="w-full bg-zinc-800 p-2 rounded mt-1"/></div><div><label className="text-xs opacity-60">DATE</label><input type="date" value={date} onChange={e=>setDate(e.target.value)} className="w-full bg-zinc-800 p-2 rounded mt-1"/></div><div><label className="text-xs opacity-60">PASSENGER</label><input value={name} onChange={e=>setName(e.target.value)} placeholder="Juan Dela Cruz" className="w-full bg-zinc-800 p-2 rounded mt-1"/></div></div><button onClick={search} disabled={loading} className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-full font-medium">{loading?"Processing...":"Search flights"}</button><div className={`text-xs p-3 rounded-lg ${bookingId?"bg-green-900/50 text-green-200": isLive?"bg-green-900/30 text-green-300":"bg-yellow-900/30 text-yellow-300"}`}>{msg} {bookingId && <span className="font-bold"> - PNR {bookingId}</span>}</div><div className="space-y-3">{fares.map((f:any)=>(<div key={f.id} className="bg-zinc-900 p-4 rounded-xl flex justify-between items-center border border-zinc-800"><div><div className="font-bold">{f.airline} {f.flight_number}</div><div className="text-xs opacity-60">{f.from} to {f.to}</div><div className="text- text-green-400 mt-1">Base P{Math.round(f.base_price||0)} + P350 fee = P{Math.round(f.price||0)}</div></div><div className="text-right"><div className="text-xl font-bold">P{Math.round(f.price||0)}</div><button onClick={()=>book(f)} disabled={loading} className="mt-2 bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-full text-sm">Book with eTravel</button></div></div>))}</div></div>);
}
