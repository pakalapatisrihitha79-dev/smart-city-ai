import React, { useState } from "react";
import { useCity } from "../context/CityContext";
import { ShieldAlert, ChevronRight, AlertTriangle, Lightbulb, HelpCircle, X } from "lucide-react";

export const CityRiskRadar: React.FC = () => {
  const { currentZone } = useCity();

  const [selectedRisk, setSelectedRisk] = useState<{
    dimension: string;
    riskLevel: string;
    why: string;
    factors: string[];
    recommendation: string;
  } | null>(null);

  const riskDimensions = [
    {
      dimension: "Traffic & Mobility",
      riskLevel: currentZone.traffic === "Congested" || currentZone.traffic === "High" ? "High" : "Low",
      why: `Vehicle density in ${currentZone.name} is ${currentZone.traffic.toLowerCase()}.`,
      factors: ["Corridor volume", "Signal timing", "Weather conditions"],
      recommendation: "Consider metro transit bypass.",
    },
    {
      dimension: "Environment & Air Quality",
      riskLevel: currentZone.aqi > 120 ? "High" : currentZone.aqi > 80 ? "Medium" : "Low",
      why: `AQI recorded at ${currentZone.aqi} with PM2.5 particulates.`,
      factors: ["Particulate count", "Wind velocity", "Industrial emissions"],
      recommendation: "Limit strenuous outdoor exercise if AQI exceeds 100.",
    },
    {
      dimension: "Weather & Flood Risk",
      riskLevel: currentZone.floodRiskPct > 50 ? "High" : "Low",
      why: `Precipitation levels at ${currentZone.rainfallMm}mm with flood risk at ${currentZone.floodRiskPct}%.`,
      factors: ["Precipitation rate", "Drainage capacity", "Elevation"],
      recommendation: "Stay clear of underpass routes during heavy downpours.",
    },
    {
      dimension: "Infrastructure & Roads",
      riskLevel: "Low",
      why: "Primary road surfaces and transit structures operating normally.",
      factors: ["Asphalt integrity", "Bridge vibration sensors", "Lighting"],
      recommendation: "Report surface potholes via civic reporting tool.",
    },
    {
      dimension: "Utilities & Energy Grid",
      riskLevel: currentZone.waterStatus === "Anomaly Leakage" ? "Medium" : "Low",
      why: `Grid power at ${currentZone.energyDemandKw} kW; water supply ${currentZone.waterStatus.toLowerCase()}.`,
      factors: ["Power load peak", "Water line pressure", "Waste bin fill rate"],
      recommendation: "Shift high energy appliance usage away from evening peak hours (6:30 PM - 9:00 PM).",
    },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 text-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            MY CITY RISK RADAR
          </h2>
          <p className="text-xs text-slate-400">Multi-dimensional risk analysis for {currentZone.name}</p>
        </div>
      </div>

      <div className="space-y-2">
        {riskDimensions.map((dim) => {
          const isHigh = dim.riskLevel === "High" || dim.riskLevel === "Critical";
          const isMedium = dim.riskLevel === "Medium";

          return (
            <div
              key={dim.dimension}
              onClick={() => setSelectedRisk(dim)}
              className="flex items-center justify-between p-3 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl cursor-pointer transition-colors"
            >
              <div>
                <span className="font-bold text-slate-200 text-xs block">{dim.dimension}</span>
                <span className="text-[10px] text-slate-400">{dim.why}</span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${
                    isHigh
                      ? "bg-rose-950 text-rose-400 border-rose-800"
                      : isMedium
                      ? "bg-amber-950 text-amber-400 border-amber-800"
                      : "bg-emerald-950 text-emerald-400 border-emerald-800"
                  }`}
                >
                  {dim.riskLevel} Risk
                </span>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Risk Details Modal */}
      {selectedRisk && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-5 shadow-2xl space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-bold text-slate-100 text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                RISK RADAR DETAIL: {selectedRisk.dimension.toUpperCase()}
              </span>
              <button onClick={() => setSelectedRisk(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <div>
                <span className="font-bold text-cyan-400 text-[11px] block mb-0.5">WHY?</span>
                <p className="text-slate-300">{selectedRisk.why}</p>
              </div>

              <div>
                <span className="font-bold text-cyan-400 text-[11px] block mb-0.5">CONTRIBUTING FACTORS</span>
                <ul className="list-disc list-inside text-slate-400 space-y-0.5">
                  {selectedRisk.factors.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-emerald-950/40 border border-emerald-800/60 p-2.5 rounded-xl text-emerald-200 mt-2">
                <span className="font-bold text-emerald-400 block mb-0.5">RECOMMENDED ACTION</span>
                <p>{selectedRisk.recommendation}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
