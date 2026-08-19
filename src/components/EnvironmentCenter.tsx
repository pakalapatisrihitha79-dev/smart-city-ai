import React, { useState } from "react";
import { useCity } from "../context/CityContext";
import { Wind, ShieldCheck, HelpCircle, X } from "lucide-react";

export const EnvironmentCenter: React.FC = () => {
  const { currentZone, accessibilitySettings } = useCity();
  const [showTechDetails, setShowTechDetails] = useState(false);

  return (
    <div className={`bg-[#0D1117]/90 border border-white/10 rounded-2xl p-4 sm:p-5 shadow-2xl space-y-4 text-xs min-w-0 ${
      accessibilitySettings.highContrast ? "border-teal-500/50 bg-[#0D1117]" : ""
    }`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10 min-w-0">
        <div>
          <h2 className="text-xs font-bold text-teal-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <Wind className="w-4 h-4 text-teal-400 shrink-0" />
            <span>ENVIRONMENT & AIR FORECAST</span>
          </h2>
          <p className="text-xs text-white/50 mt-0.5">Air quality, particulates, and micro-climate sensors</p>
        </div>

        <button
          onClick={() => setShowTechDetails(true)}
          className="self-start sm:self-auto text-[11px] bg-white/5 hover:bg-white/10 text-teal-300 font-extrabold px-3.5 py-1.5 rounded-xl border border-white/10 uppercase tracking-wider transition-colors shrink-0"
        >
          Technical Details
        </button>
      </div>

      {/* Main AQI Status Card */}
      <div className="bg-black/40 p-4 rounded-xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 min-w-0">
        <div className="min-w-0">
          <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest block">
            AIR QUALITY STATUS
          </span>
          <div className="text-xl sm:text-2xl font-black text-white mt-0.5 font-display tracking-tight break-words">
            AQI: <span className="text-teal-400">{currentZone.aqiStatus.toUpperCase()}</span>
          </div>
          <p className="text-white/70 text-xs mt-1 leading-relaxed">
            Particulate levels within acceptable bounds. Favorable wind speeds ({currentZone.windSpeed || 14} km/h) clearing industrial emissions.
          </p>
        </div>

        <div className="text-left sm:text-right shrink-0 bg-white/5 sm:bg-transparent p-2.5 sm:p-0 rounded-xl sm:rounded-none w-full sm:w-auto flex sm:block items-center justify-between">
          <div>
            <div className="text-3xl font-black text-teal-400 font-display">{currentZone.aqi}</div>
            <div className="text-[9px] text-white/40 font-bold uppercase tracking-widest">AQI INDEX</div>
          </div>
        </div>
      </div>

      {/* Metric Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 min-w-0">
        <div className="bg-white/5 p-3 rounded-xl border border-white/5 min-w-0">
          <span className="text-[9px] font-bold uppercase tracking-wider text-white/40 block">PM2.5</span>
          <span className="font-extrabold text-white text-sm block truncate">{currentZone.pm25} µg/m³</span>
        </div>

        <div className="bg-white/5 p-3 rounded-xl border border-white/5 min-w-0">
          <span className="text-[9px] font-bold uppercase tracking-wider text-white/40 block">PM10</span>
          <span className="font-extrabold text-white text-sm block truncate">{currentZone.pm10} µg/m³</span>
        </div>

        <div className="bg-white/5 p-3 rounded-xl border border-white/5 min-w-0">
          <span className="text-[9px] font-bold uppercase tracking-wider text-white/40 block">Temperature</span>
          <span className="font-extrabold text-white text-sm block truncate">{currentZone.temp}°C</span>
        </div>

        <div className="bg-white/5 p-3 rounded-xl border border-white/5 min-w-0">
          <span className="text-[9px] font-bold uppercase tracking-wider text-white/40 block">Humidity</span>
          <span className="font-extrabold text-white text-sm block truncate">{currentZone.humidity}%</span>
        </div>
      </div>

      {/* PERSONAL AIR FORECAST */}
      <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-3 min-w-0">
        <span className="font-bold text-white text-xs uppercase tracking-wider block">
          PERSONAL AIR FORECAST &bull; {currentZone.name}
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-center min-w-0">
          <div className="bg-black/40 p-2.5 rounded-xl border border-white/5 min-w-0">
            <span className="text-[9px] font-bold text-white/40 block uppercase tracking-widest">MORNING</span>
            <span className="font-extrabold text-teal-400 text-xs block mt-0.5">Good (38 AQI)</span>
            <span className="text-[9px] text-white/50 block mt-0.5">High wind clearance</span>
          </div>

          <div className="bg-black/40 p-2.5 rounded-xl border border-white/5 min-w-0">
            <span className="text-[9px] font-bold text-white/40 block uppercase tracking-widest">AFTERNOON</span>
            <span className="font-extrabold text-amber-400 text-xs block mt-0.5">Moderate (72 AQI)</span>
            <span className="text-[9px] text-white/50 block mt-0.5">Traffic buildup</span>
          </div>

          <div className="bg-black/40 p-2.5 rounded-xl border border-white/5 min-w-0">
            <span className="text-[9px] font-bold text-white/40 block uppercase tracking-widest">EVENING</span>
            <span className="font-extrabold text-teal-400 text-xs block mt-0.5">Good (48 AQI)</span>
            <span className="text-[9px] text-white/50 block mt-0.5">Cool temp drop</span>
          </div>
        </div>

        <p className="text-[10px] text-white/40 italic pt-1 border-t border-white/5">
          Disclaimer: AI environmental estimates are for general guidance and do not constitute medical diagnoses or health guarantees.
        </p>
      </div>

      {/* Technical Details Modal */}
      {showTechDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0D1117] border border-white/10 w-full max-w-md rounded-2xl p-5 shadow-2xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="font-bold text-teal-400 text-xs uppercase tracking-wider">ENVIRONMENT SENSOR SPECS</span>
              <button onClick={() => setShowTechDetails(false)} className="p-1 text-white/60 hover:text-white rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-white/80">
              <div>
                <span className="text-white/40 block text-[10px] uppercase tracking-wider font-bold">SENSOR MODEL</span>
                <span className="font-extrabold text-white">NovaSense Optical Laser Counter V4</span>
              </div>
              <div>
                <span className="text-white/40 block text-[10px] uppercase tracking-wider font-bold">SAMPLING FREQUENCY</span>
                <span className="font-extrabold text-white">Continuous 5-second optical telemetry</span>
              </div>
              <div>
                <span className="text-white/40 block text-[10px] uppercase tracking-wider font-bold">NO2 / CO CONCENTRATION</span>
                <span className="font-extrabold text-white">0.014 ppm (Safe baseline)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

