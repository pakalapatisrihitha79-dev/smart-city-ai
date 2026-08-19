import React, { useState } from "react";
import { useCity } from "../context/CityContext";
import {
  Search,
  MapPin,
  Car,
  Wind,
  Droplets,
  Zap,
  Sparkles,
  ArrowRight,
  X,
  HelpCircle,
} from "lucide-react";

export const GlobalCitySearch: React.FC = () => {
  const { allZones, primaryAreaId, setPrimaryAreaId, openExplainModal } = useCity();

  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredZones = query.trim()
    ? allZones.filter(
        (z) =>
          z.name.toLowerCase().includes(query.toLowerCase()) ||
          z.aqiStatus.toLowerCase().includes(query.toLowerCase()) ||
          z.waterStatus.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleSelectZone = (zoneId: string) => {
    setPrimaryAreaId(zoneId);
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div id="global-city-search" className="relative w-full max-w-md">
      <div className="relative flex items-center">
        <Search className="w-4 h-4 text-cyan-400 absolute left-3 pointer-events-none" />
        <input
          type="text"
          id="global-search-input"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          placeholder="Search any district, metric, or sensor (e.g. Riverside, AQI, Water)..."
          className="w-full bg-slate-900/90 border border-slate-700/80 hover:border-cyan-500/50 focus:border-cyan-400 text-xs text-slate-100 placeholder-slate-500 rounded-xl pl-9 pr-8 py-2 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all shadow-inner"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-2.5 p-1 text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && query.trim().length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-slate-900 border border-cyan-500/30 rounded-xl shadow-2xl p-2 z-50 space-y-1 max-h-72 overflow-y-auto">
          {filteredZones.length > 0 ? (
            filteredZones.map((z) => (
              <div
                key={z.id}
                onClick={() => handleSelectZone(z.id)}
                className="p-2.5 rounded-lg bg-slate-950/80 hover:bg-slate-800 border border-slate-800/80 hover:border-cyan-500/40 cursor-pointer transition-all flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div>
                    <span className="font-bold text-white block">{z.name}</span>
                    <span className="text-[10px] text-slate-400">
                      Health: {z.healthScore}/100 &bull; Traffic: {z.traffic} &bull; AQI: {z.aqi}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                    Select
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>
            ))
          ) : (
            <div className="p-3 text-center text-xs text-slate-400">
              No matching districts or telemetry streams found for "{query}".
            </div>
          )}
        </div>
      )}
    </div>
  );
};
