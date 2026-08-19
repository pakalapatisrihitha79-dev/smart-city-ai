import React from "react";
import { useCity } from "../context/CityContext";
import { Droplets, Zap, Trash2, AlertTriangle, Lightbulb } from "lucide-react";

export const UtilitiesWatch: React.FC = () => {
  const { currentZone, accessibilitySettings } = useCity();

  const isWaterAnomaly = currentZone.waterStatus === "Anomaly Leakage";

  return (
    <div className="space-y-4 min-w-0">
      {/* WATER WATCH */}
      <div className={`bg-[#0D1117]/90 border border-white/10 rounded-2xl p-4 sm:p-5 shadow-2xl space-y-3 text-xs min-w-0 ${
        accessibilitySettings.highContrast ? "border-teal-500/50 bg-[#0D1117]" : ""
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/10 min-w-0">
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-teal-400 shrink-0" />
            <h2 className="font-bold text-teal-400 uppercase tracking-[0.2em] text-xs">WATER WATCH</h2>
          </div>
          <span className="text-[10px] bg-white/5 text-white/50 px-2.5 py-0.5 rounded-full font-mono border border-white/10 self-start sm:self-auto">
            Grid: {currentZone.name}
          </span>
        </div>

        {isWaterAnomaly && (
          <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl space-y-1 text-amber-200 min-w-0">
            <div className="flex items-center gap-1.5 font-bold text-amber-400 text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>AI DETECTED ANOMALY</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-200/90 font-medium">
              Water consumption is approximately 28% above its normal pattern in {currentZone.name}.
            </p>
            <div className="text-[10px] text-amber-300/80 pt-1">
              Possible causes: Unusual demand spike or potential underground valve leakage.
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 min-w-0">
          <div className="bg-white/5 p-3 rounded-xl border border-white/5 min-w-0">
            <span className="text-[9px] font-bold uppercase tracking-wider text-white/40 block">Grid Pressure</span>
            <span className="font-extrabold text-white text-sm block truncate">4.2 Bar</span>
          </div>

          <div className="bg-white/5 p-3 rounded-xl border border-white/5 min-w-0">
            <span className="text-[9px] font-bold uppercase tracking-wider text-white/40 block">Reservoir Capacity</span>
            <span className="font-extrabold text-teal-400 text-sm block truncate">84% Full</span>
          </div>

          <div className="bg-white/5 p-3 rounded-xl border border-white/5 min-w-0">
            <span className="text-[9px] font-bold uppercase tracking-wider text-white/40 block">Supply Purity</span>
            <span className="font-extrabold text-green-400 text-sm block truncate">99.4%</span>
          </div>
        </div>
      </div>

      {/* ENERGY PULSE */}
      <div className={`bg-[#0D1117]/90 border border-white/10 rounded-2xl p-4 sm:p-5 shadow-2xl space-y-3 text-xs min-w-0 ${
        accessibilitySettings.highContrast ? "border-teal-500/50 bg-[#0D1117]" : ""
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/10 min-w-0">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400 shrink-0" />
            <h2 className="font-bold text-teal-400 uppercase tracking-[0.2em] text-xs">ENERGY PULSE</h2>
          </div>
          <span className="text-[10px] bg-white/5 text-white/50 px-2.5 py-0.5 rounded-full font-mono border border-white/10 self-start sm:self-auto">
            Demand: {currentZone.energyDemandKw} kW
          </span>
        </div>

        <div className="bg-black/40 p-3.5 rounded-xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 min-w-0">
          <div>
            <span className="text-[9px] font-bold text-white/40 uppercase tracking-wider block">RENEWABLE ENERGY SHARE</span>
            <div className="text-lg font-black text-teal-300 font-display">{currentZone.renewablePct}% Clean Grid</div>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-[9px] font-bold text-white/40 uppercase tracking-wider block">GRID LOAD STATUS</span>
            <span className="font-extrabold text-amber-400">{currentZone.energyPeakStatus}</span>
          </div>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl text-amber-200 text-[11px] flex items-center gap-2 min-w-0">
          <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="leading-relaxed font-medium">Peak electricity demand predicted between 6:30 PM and 9:00 PM today.</span>
        </div>
      </div>

      {/* SMART WASTE */}
      <div className={`bg-[#0D1117]/90 border border-white/10 rounded-2xl p-4 sm:p-5 shadow-2xl space-y-3 text-xs min-w-0 ${
        accessibilitySettings.highContrast ? "border-teal-500/50 bg-[#0D1117]" : ""
      }`}>
        <div className="flex items-center justify-between pb-2 border-b border-white/10 min-w-0">
          <div className="flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-amber-400 shrink-0" />
            <h2 className="font-bold text-teal-400 uppercase tracking-[0.2em] text-xs">SMART WASTE MONITORING</h2>
          </div>
        </div>

        <div className="bg-black/40 p-3.5 rounded-xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 min-w-0">
          <div>
            <span className="text-[9px] font-bold text-white/40 uppercase tracking-wider block">SMART CONTAINER FILL LEVEL</span>
            <span className="font-extrabold text-white text-sm">Average 42% Capacity</span>
          </div>
          <span className="text-[10px] bg-teal-500/20 text-teal-300 px-2.5 py-1 rounded-lg font-bold border border-teal-500/30 uppercase tracking-wider shrink-0">
            Route Optimized
          </span>
        </div>
      </div>
    </div>
  );
};

