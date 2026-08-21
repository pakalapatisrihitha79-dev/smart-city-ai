import React, { useState } from "react";
import { useCity } from "../context/CityContext";
import { WasteBinSensor } from "../types";
import {
  Trash2,
  Recycle,
  Sparkles,
  Truck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Send,
  Navigation,
  ArrowRight,
  TrendingUp,
  MapPin,
  Flame,
} from "lucide-react";

export const SmartWasteIntelligence: React.FC = () => {
  const { allZones, currentZone } = useCity();

  // Smart Bin Network state
  const [bins, setBins] = useState<WasteBinSensor[]>([
    {
      id: "bin-27",
      code: "BIN-27",
      locationName: "Downtown Central Market Entrance",
      zoneName: "Zone 1 (Downtown)",
      fillPct: 86,
      hoursUntilFull: 5.5,
      wasteType: "Dry Recyclable",
      priorityLevel: "CRITICAL",
      lastEmptiedHoursAgo: 18,
    },
    {
      id: "bin-14",
      code: "BIN-14",
      locationName: "Arts District Food Court Plaza",
      zoneName: "Zone 2 (Uptown & Arts)",
      fillPct: 94,
      hoursUntilFull: 2.0,
      wasteType: "Organic / Wet",
      priorityLevel: "CRITICAL",
      lastEmptiedHoursAgo: 22,
    },
    {
      id: "bin-09",
      code: "BIN-09",
      locationName: "University Student Quadrangle",
      zoneName: "Zone 10 (University)",
      fillPct: 72,
      hoursUntilFull: 8.0,
      wasteType: "Mixed Municipal",
      priorityLevel: "ELEVATED",
      lastEmptiedHoursAgo: 14,
    },
    {
      id: "bin-33",
      code: "BIN-33",
      locationName: "Lowland Transit Inter-Modal Bus Bay",
      zoneName: "Zone 4 (Lowland District)",
      fillPct: 81,
      hoursUntilFull: 4.5,
      wasteType: "Mixed Municipal",
      priorityLevel: "ELEVATED",
      lastEmptiedHoursAgo: 16,
    },
    {
      id: "bin-05",
      code: "BIN-05",
      locationName: "Green Valley Community Park East Gate",
      zoneName: "Zone 8 (Green Valley)",
      fillPct: 34,
      hoursUntilFull: 36.0,
      wasteType: "Dry Recyclable",
      priorityLevel: "NORMAL",
      lastEmptiedHoursAgo: 6,
    },
    {
      id: "bin-19",
      code: "BIN-19",
      locationName: "Tech Park Metro Station Concourse",
      zoneName: "Zone 5 (Silicon Corridor)",
      fillPct: 58,
      hoursUntilFull: 14.0,
      wasteType: "E-Waste",
      priorityLevel: "NORMAL",
      lastEmptiedHoursAgo: 10,
    },
  ]);

  const [dispatchedTrucks, setDispatchedTrucks] = useState<string[]>([]);
  const [wasteLogs, setWasteLogs] = useState<string[]>([
    "08:15 AM: AI Waste Forecaster calculated Zone 2 Waste Generation Index at 8.8/10.",
    "07:50 AM: Automated route optimization algorithm reduced morning truck fuel consumption by 28%.",
  ]);

  const handleDispatchCollection = (binId: string, binName: string, zoneName: string) => {
    setDispatchedTrucks((prev) => [...prev, binId]);
    setBins((prev) =>
      prev.map((b) =>
        b.id === binId
          ? {
              ...b,
              fillPct: 8,
              hoursUntilFull: 48,
              priorityLevel: "NORMAL",
              lastEmptiedHoursAgo: 0,
            }
          : b
      )
    );
    setWasteLogs([
      `${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}: Dispatched Smart Compactor Truck #8 to empty ${binName} in ${zoneName}.`,
      ...wasteLogs,
    ]);
  };

  const handleDispatchAllCritical = () => {
    const criticalBinIds = bins.filter((b) => b.priorityLevel === "CRITICAL").map((b) => b.id);
    setDispatchedTrucks((prev) => [...prev, ...criticalBinIds]);
    setBins((prev) =>
      prev.map((b) =>
        b.priorityLevel === "CRITICAL"
          ? {
              ...b,
              fillPct: 10,
              hoursUntilFull: 48,
              priorityLevel: "NORMAL",
              lastEmptiedHoursAgo: 0,
            }
          : b
      )
    );
    setWasteLogs([
      `${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}: Scheduled Express Collection Route for all Critical Capacity Bins (BIN-14, BIN-27).`,
      ...wasteLogs,
    ]);
  };

  return (
    <div className="bg-[#0D1117]/95 border border-emerald-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5 text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <Recycle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black text-white uppercase tracking-wider font-display">
                Smart Waste Intelligence <span className="text-emerald-400">&bull; Predictive Sanitation</span>
              </h2>
              <span className="text-[9px] font-mono font-bold bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/40">
                OPTICAL BIN SENSOR MESH
              </span>
            </div>
            <p className="text-xs text-white/50">
              Waste Generation Index (WGI), predictive bin overflow forecasting & automated truck routing
            </p>
          </div>
        </div>

        <button
          onClick={handleDispatchAllCritical}
          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-black font-black rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-emerald-600/20 uppercase tracking-wider self-start sm:self-auto"
        >
          <Truck className="w-3.5 h-3.5" />
          <span>Dispatch Express Collection Fleet</span>
        </button>
      </div>

      {/* 4 HIGH LEVEL WASTE TELEMETRY CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-black/40 p-3.5 rounded-2xl border border-white/10 space-y-0.5">
          <span className="text-[10px] text-white/50 block font-mono uppercase font-bold">Waste Generation Index</span>
          <div className="text-xl font-black text-amber-400 font-mono">7.8 / 10</div>
          <span className="text-[10px] text-amber-300 font-mono">Elevated weekend commercial rate</span>
        </div>

        <div className="bg-black/40 p-3.5 rounded-2xl border border-white/10 space-y-0.5">
          <span className="text-[10px] text-white/50 block font-mono uppercase font-bold">Critical Saturation</span>
          <div className="text-xl font-black text-rose-400 font-mono">2 Bins &gt;85%</div>
          <span className="text-[10px] text-rose-300 font-mono">Capacity breach in &lt; 6 hrs</span>
        </div>

        <div className="bg-black/40 p-3.5 rounded-2xl border border-white/10 space-y-0.5">
          <span className="text-[10px] text-white/50 block font-mono uppercase font-bold">Recycling Diversion</span>
          <div className="text-xl font-black text-emerald-400 font-mono">48.2%</div>
          <span className="text-[10px] text-emerald-300 font-mono">Target: 55% by Q4</span>
        </div>

        <div className="bg-black/40 p-3.5 rounded-2xl border border-white/10 space-y-0.5">
          <span className="text-[10px] text-white/50 block font-mono uppercase font-bold">Truck Fuel Optimized</span>
          <div className="text-xl font-black text-cyan-400 font-mono">-28.4%</div>
          <span className="text-[10px] text-cyan-300 font-mono">Dynamic routing savings</span>
        </div>
      </div>

      {/* AI ROUTE PREDICTION CALLOUT */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-[#111C2B] to-teal-950/40 border border-emerald-500/40 p-4 rounded-2xl space-y-2 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="font-extrabold text-white text-xs sm:text-sm uppercase tracking-wider">
              AI Waste Generation Forecaster & Automated Fleet Route
            </span>
          </div>
          <span className="text-[10px] font-mono text-emerald-300 font-bold">Prediction Horizon: +6 Hours</span>
        </div>

        <p className="text-xs text-white/90 font-bold leading-relaxed">
          &ldquo;Bin #14 in Zone 2 is projected to reach 100% overflow capacity within 2.0 hours due to Arts Festival food court footfall. AI recommends scheduling Collection Compactor #8 for Zone 2 and Zone 1 immediately to prevent street littering.&rdquo;
        </p>
      </div>

      {/* SMART BIN GRID */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase text-white/50">
          <span>LIVE MONITORED SMART BINS (OPTICAL FILL SENSORS)</span>
          <span>TIME UNTIL FULL</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {bins.map((bin) => {
            const isCritical = bin.priorityLevel === "CRITICAL";
            const isElevated = bin.priorityLevel === "ELEVATED";
            const isDispatched = dispatchedTrucks.includes(bin.id);

            return (
              <div
                key={bin.id}
                className={`p-4 rounded-2xl border transition-all space-y-3 ${
                  isCritical && !isDispatched
                    ? "bg-rose-950/25 border-rose-500/40 shadow-lg shadow-rose-950/20"
                    : isElevated && !isDispatched
                    ? "bg-amber-950/25 border-amber-500/40 shadow-lg shadow-amber-950/20"
                    : "bg-black/40 border-white/10"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded border ${
                          isCritical && !isDispatched
                            ? "bg-rose-950 text-rose-300 border-rose-500/50"
                            : isElevated && !isDispatched
                            ? "bg-amber-950 text-amber-300 border-amber-500/50"
                            : "bg-emerald-950 text-emerald-300 border-emerald-500/40"
                        }`}
                      >
                        {isDispatched ? "EMPTIED" : bin.priorityLevel}
                      </span>
                      <span className="text-emerald-400 font-mono text-[10px] font-bold">
                        {bin.code}
                      </span>
                    </div>
                    <h4 className="font-extrabold text-white text-xs sm:text-sm mt-1">{bin.locationName}</h4>
                    <span className="text-white/50 text-[10px] block">{bin.zoneName} &bull; {bin.wasteType}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-black font-mono text-white">{bin.fillPct}% Full</span>
                    <span className="text-[9px] font-mono text-amber-300 block">
                      {bin.hoursUntilFull < 10 ? `~${bin.hoursUntilFull}h left` : "Adequate"}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden border border-white/10">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isCritical && !isDispatched
                          ? "bg-rose-500"
                          : isElevated && !isDispatched
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      }`}
                      style={{ width: `${bin.fillPct}%` }}
                    />
                  </div>
                </div>

                {/* Action button */}
                <button
                  onClick={() => handleDispatchCollection(bin.id, bin.locationName, bin.zoneName)}
                  disabled={isDispatched || bin.fillPct < 40}
                  className={`w-full py-2 rounded-xl font-extrabold text-xs transition-all uppercase tracking-wider flex items-center justify-center gap-1.5 ${
                    isDispatched
                      ? "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                      : isCritical
                      ? "bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/20"
                      : "bg-white/10 hover:bg-white/20 text-white"
                  }`}
                >
                  {isDispatched ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Truck Dispatched &bull; Empty</span>
                    </>
                  ) : (
                    <>
                      <Truck className="w-3.5 h-3.5" />
                      <span>Schedule Collection Vehicle</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* DISPATCH AUDIT LOG */}
      <div className="space-y-2 pt-2 border-t border-white/10">
        <span className="font-mono font-bold text-white/50 text-[10px] uppercase tracking-wider block">
          WASTE DISPATCH & SANITATION AUDIT TRAIL
        </span>
        <div className="bg-black/50 p-3.5 rounded-2xl border border-white/10 space-y-1.5 font-mono text-[10px] text-white/70 max-h-28 overflow-y-auto no-scrollbar">
          {wasteLogs.map((log, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{log}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
