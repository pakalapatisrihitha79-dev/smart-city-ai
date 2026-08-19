import React, { useState } from "react";
import { useCity } from "../context/CityContext";
import { Navigation, Car, Bus, Footprints, Bike, Clock, Leaf, AlertTriangle } from "lucide-react";

export const SmartTravel: React.FC = () => {
  const { currentZone } = useCity();

  const [destination, setDestination] = useState("University District");
  const [departureTime, setDepartureTime] = useState("08:30");

  const isCongested = currentZone.traffic === "High" || currentZone.traffic === "Congested";

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 text-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <Navigation className="w-4 h-4 text-cyan-400" />
            SMART TRAVEL INTELLIGENCE
          </h2>
          <p className="text-xs text-slate-400">Multimodal route comparison & departure optimization</p>
        </div>
      </div>

      {/* Input controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
        <div>
          <label className="text-[10px] font-bold text-slate-400 block mb-1">DESTINATION</label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label className="text-[10px] font-bold text-slate-400 block mb-1">DEPARTURE TIME</label>
          <input
            type="time"
            value={departureTime}
            onChange={(e) => setDepartureTime(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* AI Recommendation Banner */}
      {isCongested && (
        <div className="bg-amber-950/30 border border-amber-800/50 p-3 rounded-xl flex items-start gap-2 text-amber-200">
          <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-amber-300">DEPARTURE OPTIMIZATION RECOMMENDATION</div>
            <p className="text-[11px] text-amber-200/90 mt-0.5">
              Leaving 20 minutes earlier (at 08:10) may reduce predicted drive travel time by 16 minutes bypassing morning corridor congestion.
            </p>
          </div>
        </div>
      )}

      {/* Mode Comparison Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
        {/* Car */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-blue-400 font-bold mb-1">
              <span className="flex items-center gap-1">
                <Car className="w-3.5 h-3.5" />
                Car / Taxi
              </span>
            </div>
            <div className="text-lg font-black text-slate-100">{isCongested ? "38 min" : "22 min"}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Traffic: {currentZone.traffic}</div>
          </div>
          <div className="text-[10px] text-rose-400 font-semibold mt-2">1,850g CO₂</div>
        </div>

        {/* Bus */}
        <div className="bg-slate-950 p-3 rounded-xl border border-emerald-800/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-emerald-400 font-bold mb-1">
              <span className="flex items-center gap-1">
                <Bus className="w-3.5 h-3.5" />
                Metro Bus
              </span>
              <span className="text-[9px] bg-emerald-950 text-emerald-400 px-1 rounded">Fastest</span>
            </div>
            <div className="text-lg font-black text-slate-100">26 min</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Dedicated Lane • Low Crowd</div>
          </div>
          <div className="text-[10px] text-emerald-400 font-semibold mt-2">320g CO₂ (Recommended)</div>
        </div>

        {/* Cycling */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-cyan-400 font-bold mb-1">
              <span className="flex items-center gap-1">
                <Bike className="w-3.5 h-3.5" />
                Cycling
              </span>
            </div>
            <div className="text-lg font-black text-slate-100">28 min</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Green Bike Path Available</div>
          </div>
          <div className="text-[10px] text-cyan-400 font-semibold mt-2">0g CO₂</div>
        </div>

        {/* Walking */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 font-bold mb-1">
              <span className="flex items-center gap-1">
                <Footprints className="w-3.5 h-3.5" />
                Walking
              </span>
            </div>
            <div className="text-lg font-black text-slate-100">54 min</div>
            <div className="text-[10px] text-slate-400 mt-0.5">3.8 km Shaded Walk</div>
          </div>
          <div className="text-[10px] text-cyan-400 font-semibold mt-2">0g CO₂</div>
        </div>
      </div>
    </div>
  );
};
