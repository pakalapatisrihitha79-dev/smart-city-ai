import React, { useState } from "react";
import { useCity } from "../context/CityContext";
import {
  Dna,
  Car,
  Wind,
  Droplets,
  Zap,
  ShieldAlert,
  Building2,
  Leaf,
  ChevronRight,
  Sparkles,
  HelpCircle,
  TrendingUp,
} from "lucide-react";

export const CityDNAView: React.FC = () => {
  const { cityDNA, currentZone, openExplainModal } = useCity();

  const [selectedDimension, setSelectedDimension] = useState<string | null>(null);

  const dimensions = [
    {
      id: "mobility",
      label: "Mobility & Transit",
      score: cityDNA.mobility,
      icon: Car,
      color: "text-blue-400",
      bgColor: "bg-blue-500",
      description: "Corridor throughput, transit modal share, and average travel delays.",
      keyFactors: ["Intersection signal green time", "Bus route on-time rate", "Congestion index"],
      metricKey: "traffic" as const,
    },
    {
      id: "environment",
      label: "Environment & Air",
      score: cityDNA.environment,
      icon: Wind,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500",
      description: "PM2.5 / PM10 particulate levels, wind dispersion, and urban canopy.",
      keyFactors: ["Particulate sensor mesh", "Urban tree cover", "Industrial stack emissions"],
      metricKey: "aqi" as const,
    },
    {
      id: "water",
      label: "Water & Drainage",
      score: cityDNA.water,
      icon: Droplets,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500",
      description: "Pressure integrity, acoustic leak detection, and stormwater absorption.",
      keyFactors: ["Smart flow telemetry", "Reservoir balance", "Storm drain discharge rate"],
      metricKey: "water" as const,
    },
    {
      id: "energy",
      label: "Energy & Grid",
      score: cityDNA.energy,
      icon: Zap,
      color: "text-amber-400",
      bgColor: "bg-amber-500",
      description: "Clean power percentage, substation peak load status, and battery buffers.",
      keyFactors: ["Solar/wind supply ratio", "Substation demand draw", "Battery reserve state"],
      metricKey: "energy" as const,
    },
    {
      id: "safety",
      label: "Civic Safety",
      score: cityDNA.safety,
      icon: ShieldAlert,
      color: "text-rose-400",
      bgColor: "bg-rose-500",
      description: "Incident response readiness, flood hazards, and structural alerts.",
      keyFactors: ["Emergency dispatch readiness", "Active hazard reports", "VMS road safety alerts"],
      metricKey: "flood" as const,
    },
    {
      id: "infrastructure",
      label: "Infrastructure",
      score: cityDNA.infrastructure,
      icon: Building2,
      color: "text-purple-400",
      bgColor: "bg-purple-500",
      description: "Road surface integrity, bridge strain gauges, and culvert capacities.",
      keyFactors: ["Pavement roughness index", "Bridge vibration sensors", "Underpass pump health"],
      metricKey: "flood" as const,
    },
    {
      id: "sustainability",
      label: "Sustainability",
      score: cityDNA.sustainability,
      icon: Leaf,
      color: "text-teal-400",
      bgColor: "bg-teal-500",
      description: "Composite circularity, recycling rates, and net carbon reduction trajectory.",
      keyFactors: ["Carbon offset velocity", "Waste diversion rate", "EV charging adoption"],
      metricKey: "health" as const,
    },
  ];

  return (
    <div
      id="city-dna-view"
      className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 text-xs"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
            <Dna className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black text-white uppercase tracking-wider font-display">
                NOVACITY DNA
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-purple-500/10 text-purple-300 border border-purple-500/30">
                7 CORE DIMENSIONS
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Composite vitality and resilience index across all urban systems
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <span className="text-[9px] text-slate-400 uppercase tracking-wider block">
              COMPOSITE DNA HEALTH
            </span>
            <span className="text-lg font-black text-white">{cityDNA.healthScore}/100</span>
          </div>
          <button
            onClick={() => openExplainModal("health")}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
            title="Explain City Health Score"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 7 Dimensions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2">
        {dimensions.map((dim) => {
          const IconComp = dim.icon;
          const isSelected = selectedDimension === dim.id;

          return (
            <div
              key={dim.id}
              id={`dna-card-${dim.id}`}
              onClick={() => setSelectedDimension(isSelected ? null : dim.id)}
              className={`p-3 rounded-xl border cursor-pointer transition-all space-y-2 flex flex-col justify-between ${
                isSelected
                  ? "bg-slate-800 border-purple-400 shadow-lg shadow-purple-500/10"
                  : "bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <IconComp className={`w-4 h-4 ${dim.color}`} />
                <span className="font-mono font-black text-xs text-white">{dim.score}%</span>
              </div>

              <div>
                <span className="font-bold text-slate-200 text-xs block truncate">{dim.label}</span>
                <div className="w-full bg-slate-800 rounded-full h-1 mt-1 overflow-hidden">
                  <div
                    className={`${dim.bgColor} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${dim.score}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/60">
                <span>{dim.score >= 80 ? "Healthy" : dim.score >= 60 ? "Moderate" : "Stressed"}</span>
                <ChevronRight className="w-3 h-3 text-slate-500" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Dimension Detail Drawer */}
      {selectedDimension && (
        <div className="p-4 bg-slate-950 rounded-xl border border-purple-500/30 space-y-2 animate-in fade-in duration-150">
          {(() => {
            const activeDim = dimensions.find((d) => d.id === selectedDimension);
            if (!activeDim) return null;
            return (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <activeDim.icon className={`w-4 h-4 ${activeDim.color}`} />
                    <span className="font-black text-sm text-white">{activeDim.label} DNA Profile</span>
                    <span className="font-mono text-xs px-2 py-0.5 bg-slate-800 rounded text-slate-300">
                      Score: {activeDim.score}/100
                    </span>
                  </div>
                  <button
                    onClick={() => openExplainModal(activeDim.metricKey)}
                    className="px-2.5 py-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 rounded-lg text-[11px] font-bold flex items-center gap-1"
                  >
                    <span>Inspect Why</span>
                    <HelpCircle className="w-3 h-3" />
                  </button>
                </div>

                <p className="text-xs text-slate-300">{activeDim.description}</p>

                <div className="flex items-center gap-2 flex-wrap text-[11px] pt-1">
                  <span className="text-slate-400 font-bold">Key Telemetry Factors:</span>
                  {activeDim.keyFactors.map((kf, i) => (
                    <span key={i} className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-slate-300">
                      {kf}
                    </span>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
