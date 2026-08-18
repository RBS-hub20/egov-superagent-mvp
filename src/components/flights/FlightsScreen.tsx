"use client";
import { useState } from "react";
export function FlightsScreen() {
  const [from,setFrom]=useState("MNL");const [to,setTo]=useState("SIN");const [date,setDate]=useState("2026-08-18");const [name,setName]=useState("JEMAR TARSITA");const [fares,setFares]=useState<any[]>([]);const [loading,setLoading]=useState(false);const [bookingId,setBookingId]=useState<string|null>(null);const [msg,setMsg]=useState("Search a route and eTravel is auto-raised with booking");
  async function search(){
    setLoading(true);setMsg("Searching live via Duffel...");setBookingId(null);
    try{
      const res=await fetch("/api/flights/search",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({from,to,departure_date:date})});
      const data=await res.json();setFares(data.offers||[]);
      if(data.offers?.length){
        if(data.offers[0]?.is_test){
          setMsg("TEST MODE - Duffel test fares! Real booking needs LIVE key. "+data.offers.length+" offers found.");
        } else {
          setMsg("LIVE - "+data.offers.length+" real fares! P350 fee only!");
        }
      } else {
        setMsg("No fares - "+(data.error||"try again"));
      }
    }catch(e){setMsg("Error");}
    setLoading(false);
  }
  async function book(offer:any){
    const oid = offer.offer_id || offer.id;
    console.log("Booking oid:", oid);
    if(!oid){alert("No offer id - search again!");return;}
    if(!name){alert("Lagay passenger name!");return;}
    setLoading(true);setMsg("Booking "+offer.airline+" - "+oid.slice(0,8)+"...");
    try{
      const res=await fetch("/api/flights/book",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({offer_id: oid, passenger: name})});
      const data=await res.json();
      if(data.success){
        setBookingId(data.pnr);
        setMsg("BOOKED! PNR: "+data.pnr+" - Test booking success! eTravel raised!");
        alert("SUCCESS!\nPNR: "+data.pnr+"\n\nTest mode booking to - pag LIVE key na, real ticket na to!\n\nFee: P350 vs Trip.com P1200");
      }else{
        setMsg("Failed: "+data.error);
        alert("Booking failed: "+data.error+"\n\nTip: Offers expire in 1-2 mins in test mode - search ulit tapos book agad!");
      }
    }catch(e:any){setMsg("Booking error");}
    setLoading(false);
  }
  return (<div className="p-6 max-w-5xl mx-auto space-y-6"><h1 className="text-2xl font-bold">Flights + eTravel Bundle</h1><p className="text-sm opacity-60">Search a route and eTravel is auto-raised - one form instead of two.</p><div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-zinc-900 p-4 rounded-xl"><div><label className="text-xs opacity-60">FROM</label><input value={from} onChange={e=>setFrom(e.target.value.toUpperCase())} className="w-full bg-zinc-800 p-2 rounded mt-1"/></div><div><label className="text-xs opacity-60">TO</label><input value={to} onChange={e=>setTo(e.target.value.toUpperCase())} className="w-full bg-zinc-800 p-2 rounded mt-1"/></div><div><label className="text-xs opacity-60">DATE</label><input type="date" value={date} onChange={e=>setDate(e.target.value)} className="w-full bg-zinc-800 p-2 rounded mt-1"/></div><div><label className="text-xs opacity-60">PASSENGER</label><input value={name} onChange={e=>setName(e.target.value)} className="w-full bg-zinc-800 p-2 rounded mt-1"/></div></div><button onClick={search} disabled={loading} className="bg-blue-600 px-6 py-2 rounded-full">{loading?"Processing...":"Search flights"}</button><div className="text-xs p-3 rounded-lg bg-zinc-800 border border-zinc-700">{msg} {bookingId && <span className="font-bold text-green-400"> PNR {bookingId}</span>}</div><div className="space-y-3">{fares.map((f:any)=>(<div key={f.id} className="bg-zinc-900 p-4 rounded-xl flex justify-between border border-zinc-800"><div><div className="font-bold">{f.airline}</div><div className="text-xs opacity-60">{f.from} to {f.to} - ID {f.id?.slice(0,6)}...</div><div className="text-xs text-yellow-400 mt-1">{f.is_test?"TEST FARE":"LIVE"}: Base P{f.total_amount} + P350 fee = P{Math.round(f.price)}</div></div><div className="text-right"><div className="text-xl font-bold">P{Math.round(f.price)}</div><button onClick={()=>book(f)} disabled={loading} className="mt-2 bg-blue-600 px-4 py-2 rounded-full text-sm">Book with eTravel</button></div></div>))}</div></div>);
}
