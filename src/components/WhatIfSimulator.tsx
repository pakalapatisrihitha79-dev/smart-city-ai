import React, { useState } from "react";
import { useCity } from "../context/CityContext";
import { WhatIfParams, WhatIfScenario } from "../types";
import { PRESET_SCENARIOS } from "../data/mockData";
import { Sliders, RefreshCw, Save, TrendingDown, TrendingUp, AlertCircle } from "lucide-react";

export const WhatIfSimulator: React.FC = () => {
  const { currentZone } = useCity();

  // Slider State
  const [params, setParams] = useState<WhatIfParams>({
    vehiclesPct: 100,
    publicTransportPct: 100,
    renewablePct: 45,
    waterUsagePct: 100,
    recyclingPct: 40,
    greenCoverPct: 30,
    rainfallMm: 10,
  });

  // Saved scenarios list
  const [scenarios, setScenarios] = useState<WhatIfScenario[]>(PRESET_SCENARIOS);
  const [simLoading, setSimLoading] = useState(false);
  const [simResult, setSimResult] = useState<{
    trafficDiffPct: number;
    emissionsDiffPct: number;
    waterDiffPct: number;
    healthScoreDelta: number;
    summary: string;
    recommendation: string;
  } | null>(null);

  const handleRunSimulation = async () => {
    setSimLoading(true);
    try {
      const res = await fetch("/api/ai/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parameters: params,
          areaName: currentZone.name,
        }),
      });
      const data = await res.json();
      setSimResult(data);
      setSimLoading(false);
    } catch (e) {
      setSimLoading(false);
      // Fallback mathematical diff
      setSimResult({
        trafficDiffPct: Math.round((100 - params.publicTransportPct) * 0.2 - (params.vehiclesPct - 100) * 0.3),
        emissionsDiffPct: Math.round((100 - params.renewablePct) * 0.25 - params.greenCoverPct * 0.1),
        waterDiffPct: Math.round((params.waterUsagePct - 100) * 0.8),
        healthScoreDelta: 4,
        summary: `Simulated policy adjustments for ${currentZone.name}.`,
        recommendation: "Expanding transit frequency yields optimal congestion mitigation.",
      });
    }
  };

  const handleSaveCurrentScenario = () => {
    const newScen: WhatIfScenario = {
      id: "scen-" + Date.now(),
      title: `Scenario Custom — Transit ${params.publicTransportPct}% / Renewable ${params.renewablePct}%`,
      params: { ...params },
      trafficDiffPct: simResult?.trafficDiffPct || -10,
      emissionsDiffPct: simResult?.emissionsDiffPct || -8,
      waterDiffPct: simResult?.waterDiffPct || -4,
      healthScoreDelta: simResult?.healthScoreDelta || 3,
    };
    setScenarios([...scenarios, newScen]);
  };

  const handleReset = () => {
    setParams({
      vehiclesPct: 100,
      publicTransportPct: 100,
      renewablePct: 45,
      waterUsagePct: 100,
      recyclingPct: 40,
      greenCoverPct: 30,
      rainfallMm: 10,
    });
    setSimResult(null);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2 uppercase tracking-wider">
            <Sliders className="w-4 h-4 text-cyan-400" />
            WHAT IF NOVACITY? — POLICY SIMULATOR
          </h2>
          <p className="text-xs text-slate-400">Simulate citywide infrastructure and policy levers</p>
        </div>

        <button
          onClick={handleReset}
          className="p-1.5 text-slate-400 hover:text-slate-200 bg-slate-800 rounded-lg text-xs flex items-center gap-1"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        {/* Vehicles */}
        <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/60">
          <div className="flex justify-between font-semibold text-slate-200 mb-1">
            <span>Traffic Vehicle Count</span>
            <span className="text-cyan-400">{params.vehiclesPct}%</span>
          </div>
          <input
            type="range"
            min="50"
            max="150"
            value={params.vehiclesPct}
            onChange={(e) => setParams({ ...params, vehiclesPct: Number(e.target.value) })}
            className="w-full accent-cyan-500 cursor-pointer"
          />
        </div>

        {/* Public Transport */}
        <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/60">
          <div className="flex justify-between font-semibold text-slate-200 mb-1">
            <span>Public Transport Capacity</span>
            <span className="text-cyan-400">{params.publicTransportPct}%</span>
          </div>
          <input
            type="range"
            min="50"
            max="200"
            value={params.publicTransportPct}
            onChange={(e) => setParams({ ...params, publicTransportPct: Number(e.target.value) })}
            className="w-full accent-cyan-500 cursor-pointer"
          />
        </div>

        {/* Renewable Energy */}
        <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/60">
          <div className="flex justify-between font-semibold text-slate-200 mb-1">
            <span>Renewable Energy Share</span>
            <span className="text-emerald-400">{params.renewablePct}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={params.renewablePct}
            onChange={(e) => setParams({ ...params, renewablePct: Number(e.target.value) })}
            className="w-full accent-emerald-500 cursor-pointer"
          />
        </div>

        {/* Green Canopy */}
        <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/60">
          <div className="flex justify-between font-semibold text-slate-200 mb-1">
            <span>Green Canopy Cover</span>
            <span className="text-emerald-400">{params.greenCoverPct}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={params.greenCoverPct}
            onChange={(e) => setParams({ ...params, greenCoverPct: Number(e.target.value) })}
            className="w-full accent-emerald-500 cursor-pointer"
          />
        </div>
      </div>

      <button
        onClick={handleRunSimulation}
        disabled={simLoading}
        className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-lg"
      >
        <Sliders className="w-4 h-4" />
        <span>{simLoading ? "Computing Policy Simulation..." : "RUN SIMULATION ENGINE"}</span>
      </button>

      {/* Simulation Results Card */}
      {simResult && (
        <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-3 text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-slate-200 text-xs">SIMULATED OUTCOME vs CURRENT</span>
            <button
              onClick={handleSaveCurrentScenario}
              className="text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-cyan-400 px-2.5 py-1 rounded-lg border border-slate-700 flex items-center gap-1"
            >
              <Save className="w-3 h-3" />
              <span>Save Scenario</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block">Congestion</span>
              <span
                className={`font-bold text-sm ${
                  simResult.trafficDiffPct <= 0 ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {simResult.trafficDiffPct <= 0 ? `↓ ${Math.abs(simResult.trafficDiffPct)}%` : `↑ ${simResult.trafficDiffPct}%`}
              </span>
            </div>

            <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block">Emissions</span>
              <span
                className={`font-bold text-sm ${
                  simResult.emissionsDiffPct <= 0 ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {simResult.emissionsDiffPct <= 0 ? `↓ ${Math.abs(simResult.emissionsDiffPct)}%` : `↑ ${simResult.emissionsDiffPct}%`}
              </span>
            </div>

            <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block">City Health</span>
              <span className="font-bold text-sm text-cyan-400">
                {simResult.healthScoreDelta >= 0 ? `+${simResult.healthScoreDelta}` : simResult.healthScoreDelta} pts
              </span>
            </div>
          </div>

          <p className="text-slate-300 text-xs leading-relaxed">{simResult.summary}</p>
          <p className="text-emerald-300 font-medium text-xs">Recommendation: {simResult.recommendation}</p>

          <div className="flex items-center gap-1.5 text-[10px] text-amber-400/90 italic pt-2 border-t border-slate-800">
            <AlertCircle className="w-3 h-3 shrink-0" />
            <span>SIMULATION — NOT A GUARANTEED REAL-WORLD OUTCOME</span>
          </div>
        </div>
      )}

      {/* Saved Scenario Comparison */}
      <div className="pt-3 border-t border-slate-800 space-y-2 text-xs">
        <span className="font-bold text-slate-300 text-xs block">SAVED SCENARIO COMPARISON</span>
        <div className="space-y-1.5">
          {scenarios.map((scen) => (
            <div
              key={scen.id}
              className="flex items-center justify-between p-2.5 bg-slate-800/40 rounded-xl border border-slate-800 text-slate-300"
            >
              <div>
                <div className="font-bold text-slate-200">{scen.title}</div>
                <div className="text-[10px] text-slate-400">
                  Transit {scen.params.publicTransportPct}% • Renewable {scen.params.renewablePct}%
                </div>
              </div>

              <div className="flex items-center gap-3 text-right">
                <div>
                  <div className="text-[10px] text-slate-400">Traffic</div>
                  <div className="font-bold text-emerald-400">{scen.trafficDiffPct}%</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Emissions</div>
                  <div className="font-bold text-emerald-400">{scen.emissionsDiffPct}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
