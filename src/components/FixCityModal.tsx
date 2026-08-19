import React, { useState } from "react";
import { useCity } from "../context/CityContext";
import {
  Wrench,
  X,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";

export const FixCityModal: React.FC = () => {
  const { isFixCityOpen, setIsFixCityOpen, currentZone, demoScenario } = useCity();

  // Active toggles for interventions
  const [activeInterventions, setActiveInterventions] = useState<{ [key: string]: boolean }>({
    "adaptive-signals": true,
    "metro-surge": true,
    "storm-gates": false,
    "water-isolation": false,
    "battery-dispatch": false,
    "mist-cannons": false,
  });

  if (!isFixCityOpen) return null;

  const interventionsList = [
    {
      id: "adaptive-signals",
      name: "Adaptive Green-Wave Signal Extension",
      category: "Mobility",
      description: "Extend arterial corridor green light duration by +18s to clear bottlenecks.",
      trafficDiff: -12,
      emissionsDiff: -6,
      healthDelta: +4,
    },
    {
      id: "metro-surge",
      name: "Surge Public Metro Transit Frequency",
      category: "Mobility",
      description: "Deploy 6 auxiliary electric express trains at 3.5 min headways.",
      trafficDiff: -15,
      emissionsDiff: -11,
      healthDelta: +6,
    },
    {
      id: "storm-gates",
      name: "Engage Lowland Storm Drainage Pumps",
      category: "Water & Flood",
      description: "Activate 4 high-capacity submersible pump stations to protect underpasses.",
      trafficDiff: -4,
      emissionsDiff: 0,
      healthDelta: +7,
    },
    {
      id: "water-isolation",
      name: "Smart Sub-Zone Pressure Throttling",
      category: "Utilities",
      description: "Throttle distribution valve 4B by 15% to mitigate sub-surface pipe rupture loss.",
      trafficDiff: 0,
      emissionsDiff: 0,
      healthDelta: +5,
    },
    {
      id: "battery-dispatch",
      name: "Community Battery Peak Shaving",
      category: "Energy Grid",
      description: "Discharge 140 kWh storage reserve to alleviate evening substation stress.",
      trafficDiff: 0,
      emissionsDiff: -4,
      healthDelta: +3,
    },
    {
      id: "mist-cannons",
      name: "Deploy Urban Plaza Mist Dispensers",
      category: "Air Quality",
      description: "Supress airborne PM2.5 particulates across high-pedestrian public plazas.",
      trafficDiff: 0,
      emissionsDiff: -14,
      healthDelta: +5,
    },
  ];

  // Calculate cumulative simulation outcome
  const enabledItems = interventionsList.filter((item) => activeInterventions[item.id]);
  const totalTrafficDiff = Math.max(-45, enabledItems.reduce((acc, curr) => acc + curr.trafficDiff, 0));
  const totalEmissionsDiff = Math.max(-40, enabledItems.reduce((acc, curr) => acc + curr.emissionsDiff, 0));
  const totalHealthDelta = Math.min(32, enabledItems.reduce((acc, curr) => acc + curr.healthDelta, 0));

  const baseHealth = currentZone.healthScore;
  const simulatedHealth = Math.min(100, baseHealth + totalHealthDelta);

  const toggleIntervention = (id: string) => {
    setActiveInterventions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleReset = () => {
    setActiveInterventions({
      "adaptive-signals": false,
      "metro-surge": false,
      "storm-gates": false,
      "water-isolation": false,
      "battery-dispatch": false,
      "mist-cannons": false,
    });
  };

  return (
    <div
      id="fix-city-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl space-y-5 p-6 text-slate-100 relative">
        {/* Close Button */}
        <button
          id="close-fix-city-modal-btn"
          onClick={() => setIsFixCityOpen(false)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-xl transition-colors"
          title="Close Fix City"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1 pr-8">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
              <Wrench className="w-3 h-3" />
              FIX THE CITY ENGINE
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
              REAL-TIME INTERVENTION LAB
            </span>
          </div>

          <h2 className="text-xl font-black tracking-tight text-white uppercase font-display">
            SIMULATE CITY INTERVENTIONS FOR {currentZone.name}
          </h2>
          <p className="text-xs text-slate-400">
            Select policy levers to observe predicted improvements before executing city directives
          </p>
        </div>

        {/* Before vs Simulated After Comparison Bar */}
        <div className="p-4 bg-slate-950 border border-emerald-500/30 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              BEFORE VS SIMULATED AFTER
            </span>
            <button
              onClick={handleReset}
              className="text-[10px] text-slate-400 hover:text-slate-200 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Levers
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            {/* Health Score */}
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block">
                CITY HEALTH SCORE
              </span>
              <div className="flex items-center justify-center gap-2 mt-1">
                <span className="text-sm font-bold text-slate-400">{baseHealth}</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-lg font-black text-emerald-300">{simulatedHealth}/100</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-400">
                +{totalHealthDelta} pts improvement
              </span>
            </div>

            {/* Traffic Diff */}
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block">
                TRAFFIC CONGESTION
              </span>
              <div className="text-lg font-black text-emerald-300 mt-1">
                {totalTrafficDiff}%
              </div>
              <span className="text-[10px] text-slate-400">Corridor delay reduction</span>
            </div>

            {/* Emissions Diff */}
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block">
                EMISSIONS &amp; PM2.5
              </span>
              <div className="text-lg font-black text-emerald-300 mt-1">
                {totalEmissionsDiff}%
              </div>
              <span className="text-[10px] text-slate-400">Particulate alleviation</span>
            </div>
          </div>
        </div>

        {/* Selectable Policy Interventions */}
        <div className="space-y-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
            AVAILABLE INTERVENTION LEVERS
          </span>

          <div className="space-y-2">
            {interventionsList.map((item) => {
              const isChecked = !!activeInterventions[item.id];

              return (
                <div
                  key={item.id}
                  id={`fix-lever-${item.id}`}
                  onClick={() => toggleIntervention(item.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                    isChecked
                      ? "bg-emerald-950/40 border-emerald-500/50 shadow-md shadow-emerald-500/10"
                      : "bg-slate-950/70 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center ${
                          isChecked
                            ? "bg-emerald-400 border-emerald-400 text-slate-950"
                            : "border-slate-600 bg-transparent"
                        }`}
                      >
                        {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                      <span className="font-bold text-xs text-slate-100">{item.name}</span>
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-slate-800 text-slate-300">
                        {item.category}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 pl-6">{item.description}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-black text-emerald-400 block">
                      +{item.healthDelta} pts
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Traffic {item.trafficDiff}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
          <span className="flex items-center gap-1 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Deterministic simulation with real-time physics bounds
          </span>

          <button
            onClick={() => setIsFixCityOpen(false)}
            className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-colors shadow-lg shadow-emerald-500/20"
          >
            Apply Simulated Levers
          </button>
        </div>
      </div>
    </div>
  );
};
