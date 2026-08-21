import React, { useState } from "react";
import { useCity } from "../context/CityContext";
import { WhatIfParams, WhatIfScenario } from "../types";
import { PRESET_SCENARIOS } from "../data/mockData";
import {
  Sliders,
  RefreshCw,
  Save,
  TrendingDown,
  TrendingUp,
  AlertCircle,
  CloudRain,
  Car,
  Bus,
  Sun,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  MapPin,
  CheckCircle2,
  Navigation,
} from "lucide-react";

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

  const [activePreset, setActivePreset] = useState<string | null>(null);

  // Saved scenarios list
  const [scenarios, setScenarios] = useState<WhatIfScenario[]>(PRESET_SCENARIOS);
  const [simLoading, setSimLoading] = useState(false);
  const [simResult, setSimResult] = useState<{
    scenarioTitle: string;
    trafficDiffPct: number;
    floodRiskDiffPct: number;
    emissionsDiffPct: number;
    waterDiffPct: number;
    healthScoreDelta: number;
    affectedRoads: string[];
    evacuationZones?: string[];
    trafficRedistribution?: { route: string; sharePct: number; delayMinutes: number }[];
    emergencyVehicleImpact?: string;
    summary: string;
    recommendedResponse: string;
  } | null>(null);

  // Signature 1-Click Simulation Presets from Specification
  const featurePresets = [
    {
      id: "rain-40",
      title: "What if rainfall increases by 40%?",
      icon: CloudRain,
      color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30",
      params: {
        vehiclesPct: 110,
        publicTransportPct: 90,
        renewablePct: 45,
        waterUsagePct: 120,
        recyclingPct: 40,
        greenCoverPct: 30,
        rainfallMm: 45,
      },
      result: {
        scenarioTitle: "Simulated Scenario: +40% Rainfall Inundation Event",
        trafficDiffPct: +45,
        floodRiskDiffPct: +38,
        emissionsDiffPct: +12,
        waterDiffPct: +24,
        healthScoreDelta: -14,
        affectedRoads: [
          "Lowland Basin Underpass (Waterlogged 40cm)",
          "Harbor Expressway Slip Road (Slowed 12 km/h)",
          "River Bridge South Approach (Restricted to 1 lane)",
        ],
        evacuationZones: [
          "Ward 12 Low-Elevation Basin Sector B (approx. 240 residents)",
          "Creek Valley Sump Area Sector C (advisory standby)",
        ],
        emergencyVehicleImpact: "Emergency response times delayed by +8.5 mins in Lowland sector.",
        summary:
          "Precipitation surge to 45mm/h overwhelms primary culverts. Drainage reaches 94% saturation causing localized arterial flooding.",
        recommendedResponse:
          "Pre-activate Stormwater Sump Pump #4, open Retention Gate #3, divert Transit Lines 14/18 to Upper Ridge Bypass, and dispatch municipal sandbag units.",
      },
    },
    {
      id: "bridge-closure",
      title: "What if a major arterial road/bridge is closed?",
      icon: Car,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/30",
      params: {
        vehiclesPct: 100,
        publicTransportPct: 120,
        renewablePct: 45,
        waterUsagePct: 100,
        recyclingPct: 40,
        greenCoverPct: 30,
        rainfallMm: 10,
      },
      result: {
        scenarioTitle: "Simulated Scenario: Central Arterial Flyover Full Closure",
        trafficDiffPct: +35,
        floodRiskDiffPct: 0,
        emissionsDiffPct: +18,
        waterDiffPct: 0,
        healthScoreDelta: -8,
        affectedRoads: [
          "East-West Central Arterial Flyover (CLOSED)",
          "4th Avenue Radial Connector (Severe Bottleneck)",
          "7th Ring Road Junction (Queue Length +650m)",
        ],
        trafficRedistribution: [
          { route: "North Outer Bypass Corridor", sharePct: 65, delayMinutes: +14 },
          { route: "River Ridge Parkway", sharePct: 35, delayMinutes: +9 },
        ],
        emergencyVehicleImpact:
          "Ambulance hospital transit route severed (+12 mins). System auto-designates an emergency-only contraflow corridor on West Link.",
        summary:
          "Arterial closure forces 14,200 vehicles/hour to reroute. Secondary chokepoints form at two connector junctions within 20 minutes.",
        recommendedResponse:
          "Activate Dynamic Signal Phase #7 on North Bypass (+22s green wave), push navigation alerts to 4,200 vehicles, and open automated contraflow lane for emergency services.",
      },
    },
    {
      id: "transit-50",
      title: "What if public transit capacity increases by 50%?",
      icon: Bus,
      color: "text-teal-400 bg-teal-500/10 border-teal-500/30",
      params: {
        vehiclesPct: 70,
        publicTransportPct: 150,
        renewablePct: 60,
        waterUsagePct: 95,
        recyclingPct: 55,
        greenCoverPct: 35,
        rainfallMm: 10,
      },
      result: {
        scenarioTitle: "Simulated Scenario: +50% High-Frequency Public Transit Expansion",
        trafficDiffPct: -28,
        floodRiskDiffPct: -5,
        emissionsDiffPct: -32,
        waterDiffPct: -5,
        healthScoreDelta: +12,
        affectedRoads: [
          "Downtown Arterial Flow (+34% speed improvement to 52 km/h)",
          "University Avenue Express Bus Corridor (Zero congestion)",
        ],
        emergencyVehicleImpact: "Emergency response clearance times improved by -4.2 minutes.",
        summary:
          "Modal shift shifts 30% of private car commutes into zero-emission electric buses and rapid metro, reducing corridor smog by 32%.",
        recommendedResponse:
          "Maintain 4-minute metro headway during peak hours and expand park-and-ride feeder stations.",
      },
    },
    {
      id: "solar-80",
      title: "What if solar & renewable mandate reaches 80%?",
      icon: Sun,
      color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
      params: {
        vehiclesPct: 90,
        publicTransportPct: 110,
        renewablePct: 80,
        waterUsagePct: 90,
        recyclingPct: 65,
        greenCoverPct: 45,
        rainfallMm: 10,
      },
      result: {
        scenarioTitle: "Simulated Scenario: 80% Clean Grid & Rooftop Solar Mandate",
        trafficDiffPct: -8,
        floodRiskDiffPct: -8,
        emissionsDiffPct: -46,
        waterDiffPct: -10,
        healthScoreDelta: +16,
        affectedRoads: ["All Municipal Districts (Grid Stress Dropped by 40%)"],
        emergencyVehicleImpact: "100% uninterrupted power security for municipal hospitals and pump stations.",
        summary:
          "Clean energy surplus of 1,200 kW allows continuous battery buffer charging, completely eliminating summer heatwave brownout risks.",
        recommendedResponse:
          "Incentivize commercial building battery storage retrofits and feed excess generation into wastewater treatment electrolyzers.",
      },
    },
  ];

  const handleApplyPreset = (preset: typeof featurePresets[0]) => {
    setActivePreset(preset.id);
    setParams(preset.params);
    setSimLoading(true);
    setTimeout(() => {
      setSimResult(preset.result);
      setSimLoading(false);
    }, 450);
  };

  const handleCustomSimulation = () => {
    setSimLoading(true);
    setTimeout(() => {
      const trafficDiff = Math.round(
        (100 - params.publicTransportPct) * 0.25 + (params.vehiclesPct - 100) * 0.4
      );
      const emissionsDiff = Math.round(
        (100 - params.renewablePct) * 0.3 - params.greenCoverPct * 0.15 + (params.vehiclesPct - 100) * 0.2
      );
      const floodDiff = Math.round((params.rainfallMm - 10) * 0.8 - params.greenCoverPct * 0.2);
      const healthDelta = Math.round(-trafficDiff * 0.2 - emissionsDiff * 0.25 - floodDiff * 0.2);

      setSimResult({
        scenarioTitle: `Custom Policy Scenario for ${currentZone.name}`,
        trafficDiffPct: trafficDiff,
        floodRiskDiffPct: Math.max(0, floodDiff),
        emissionsDiffPct: emissionsDiff,
        waterDiffPct: Math.round((params.waterUsagePct - 100) * 0.5),
        healthScoreDelta: healthDelta,
        affectedRoads: [
          `${currentZone.name} Primary Corridor (Congestion: ${trafficDiff > 0 ? "Elevated" : "Smooth"})`,
          `Urban Drainage Network (Runoff: ${floodDiff > 0 ? "Under Stress" : "Normal"})`,
        ],
        summary: `Custom policy levers simulated across ${currentZone.name}. Modulating transit capacity to ${params.publicTransportPct}% and renewables to ${params.renewablePct}%.`,
        recommendedResponse:
          trafficDiff > 10
            ? "Expand public transit frequency and calibrate dynamic traffic signals."
            : "Policy set maintains optimal citywide health and low carbon intensity.",
      });
      setSimLoading(false);
    }, 400);
  };

  const handleSaveCurrentScenario = () => {
    if (!simResult) return;
    const newScen: WhatIfScenario = {
      id: "scen-" + Date.now(),
      title: simResult.scenarioTitle,
      params: { ...params },
      trafficDiffPct: simResult.trafficDiffPct,
      emissionsDiffPct: simResult.emissionsDiffPct,
      waterDiffPct: simResult.waterDiffPct,
      healthScoreDelta: simResult.healthScoreDelta,
    };
    setScenarios([newScen, ...scenarios]);
  };

  const handleReset = () => {
    setActivePreset(null);
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
    <div className="bg-[#0D1117]/95 border border-cyan-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5 text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-black text-white uppercase tracking-wider font-display">
              City Scenario Simulator <span className="text-cyan-400">&bull; "What If?" Mode</span>
            </h2>
            <p className="text-xs text-white/50">
              Simulate hypothetical urban stressors, closures & climate shocks in real-time
            </p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="px-3 py-1.5 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-xs font-bold flex items-center gap-1.5 transition-colors uppercase tracking-wider self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* 1-CLICK TEST DRIVE PRESETS */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 block">
          Featured Hypothetical Scenarios (1-Click Instant Simulation)
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {featurePresets.map((preset) => {
            const IconComp = preset.icon;
            const isSelected = activePreset === preset.id;

            return (
              <button
                key={preset.id}
                onClick={() => handleApplyPreset(preset)}
                className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between gap-2 transition-all ${
                  isSelected
                    ? "bg-cyan-500/20 border-cyan-400 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-400"
                    : `${preset.color} hover:border-white/30 hover:scale-[1.01]`
                }`}
              >
                <div className="flex items-center justify-between">
                  <IconComp className="w-5 h-5" />
                  <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-black/40 text-white/80">
                    SIMULATE
                  </span>
                </div>
                <div>
                  <span className="font-extrabold text-white text-xs block leading-snug">
                    {preset.title}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* CUSTOM POLICY SLIDERS */}
      <div className="bg-black/40 border border-white/10 rounded-2xl p-4 sm:p-5 space-y-4">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-white/50 block">
          Or Adjust Fine-Grained Policy & Climate Levers
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Vehicles Slider */}
          <div className="bg-[#0D1117] p-3 rounded-xl border border-white/5 space-y-1.5">
            <div className="flex justify-between font-bold text-white text-xs">
              <span>Private Vehicles</span>
              <span className="text-cyan-400 font-mono">{params.vehiclesPct}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="160"
              value={params.vehiclesPct}
              onChange={(e) => {
                setActivePreset(null);
                setParams({ ...params, vehiclesPct: Number(e.target.value) });
              }}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <span className="text-[9px] text-white/40 block">50% (Low) to 160% (Gridlock)</span>
          </div>

          {/* Transit Slider */}
          <div className="bg-[#0D1117] p-3 rounded-xl border border-white/5 space-y-1.5">
            <div className="flex justify-between font-bold text-white text-xs">
              <span>Transit Capacity</span>
              <span className="text-teal-400 font-mono">{params.publicTransportPct}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="200"
              value={params.publicTransportPct}
              onChange={(e) => {
                setActivePreset(null);
                setParams({ ...params, publicTransportPct: Number(e.target.value) });
              }}
              className="w-full accent-teal-400 cursor-pointer"
            />
            <span className="text-[9px] text-white/40 block">50% (Reduced) to 200% (High-Freq)</span>
          </div>

          {/* Rainfall Slider */}
          <div className="bg-[#0D1117] p-3 rounded-xl border border-white/5 space-y-1.5">
            <div className="flex justify-between font-bold text-white text-xs">
              <span>Rainfall Intensity</span>
              <span className="text-indigo-400 font-mono">{params.rainfallMm} mm/h</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={params.rainfallMm}
              onChange={(e) => {
                setActivePreset(null);
                setParams({ ...params, rainfallMm: Number(e.target.value) });
              }}
              className="w-full accent-indigo-400 cursor-pointer"
            />
            <span className="text-[9px] text-white/40 block">0mm (Dry) to 100mm (Cloudburst)</span>
          </div>

          {/* Renewable Energy Slider */}
          <div className="bg-[#0D1117] p-3 rounded-xl border border-white/5 space-y-1.5">
            <div className="flex justify-between font-bold text-white text-xs">
              <span>Clean Renewables</span>
              <span className="text-emerald-400 font-mono">{params.renewablePct}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={params.renewablePct}
              onChange={(e) => {
                setActivePreset(null);
                setParams({ ...params, renewablePct: Number(e.target.value) });
              }}
              className="w-full accent-emerald-400 cursor-pointer"
            />
            <span className="text-[9px] text-white/40 block">0% (Fossil) to 100% (Solar/Hydro)</span>
          </div>
        </div>

        <button
          onClick={handleCustomSimulation}
          disabled={simLoading}
          className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/20 uppercase tracking-wider"
        >
          <Sliders className="w-4 h-4" />
          <span>{simLoading ? "Running Multi-Agent Physics Simulation..." : "Run Custom Simulation Engine"}</span>
        </button>
      </div>

      {/* DETAILED SIMULATION OUTCOME BREAKDOWN */}
      {simResult && (
        <div className="bg-gradient-to-b from-[#111C2B] to-[#0D1117] border border-cyan-500/40 p-5 rounded-2xl space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400 block">
                SIMULATION RESULT &bull; COMPUTED CASCADE
              </span>
              <h3 className="text-sm sm:text-base font-extrabold text-white mt-0.5">
                {simResult.scenarioTitle}
              </h3>
            </div>

            <button
              onClick={handleSaveCurrentScenario}
              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-cyan-300 rounded-xl border border-white/10 text-xs font-bold flex items-center gap-1.5 transition-colors uppercase tracking-wider self-start sm:self-auto"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Scenario</span>
            </button>
          </div>

          {/* 4 Core Metrics Impact */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-black/40 p-3 rounded-xl border border-white/5 text-center">
              <span className="text-[10px] text-white/50 block font-mono uppercase">Traffic Congestion</span>
              <span
                className={`font-black font-mono text-base ${
                  simResult.trafficDiffPct <= 0 ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {simResult.trafficDiffPct <= 0
                  ? `↓ ${Math.abs(simResult.trafficDiffPct)}%`
                  : `↑ ${simResult.trafficDiffPct}%`}
              </span>
            </div>

            <div className="bg-black/40 p-3 rounded-xl border border-white/5 text-center">
              <span className="text-[10px] text-white/50 block font-mono uppercase">Flood Inundation Risk</span>
              <span
                className={`font-black font-mono text-base ${
                  simResult.floodRiskDiffPct <= 0 ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {simResult.floodRiskDiffPct <= 0 ? `Stable` : `↑ ${simResult.floodRiskDiffPct}%`}
              </span>
            </div>

            <div className="bg-black/40 p-3 rounded-xl border border-white/5 text-center">
              <span className="text-[10px] text-white/50 block font-mono uppercase">Carbon Emissions</span>
              <span
                className={`font-black font-mono text-base ${
                  simResult.emissionsDiffPct <= 0 ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {simResult.emissionsDiffPct <= 0
                  ? `↓ ${Math.abs(simResult.emissionsDiffPct)}%`
                  : `↑ ${simResult.emissionsDiffPct}%`}
              </span>
            </div>

            <div className="bg-black/40 p-3 rounded-xl border border-white/5 text-center">
              <span className="text-[10px] text-white/50 block font-mono uppercase">City Health Score &Delta;</span>
              <span
                className={`font-black font-mono text-base ${
                  simResult.healthScoreDelta >= 0 ? "text-cyan-400" : "text-rose-400"
                }`}
              >
                {simResult.healthScoreDelta >= 0
                  ? `+${simResult.healthScoreDelta} pts`
                  : `${simResult.healthScoreDelta} pts`}
              </span>
            </div>
          </div>

          {/* Affected Roads & Traffic Redistribution Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {/* Affected Roads */}
            <div className="bg-black/40 p-3.5 rounded-xl border border-white/5 space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase text-amber-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                Affected Roads & Infrastructure Corridors
              </span>
              <div className="space-y-1">
                {simResult.affectedRoads.map((road, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-white/80 text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                    <span>{road}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Evacuation Zones or Traffic Redistribution */}
            {simResult.evacuationZones ? (
              <div className="bg-rose-950/30 p-3.5 rounded-xl border border-rose-500/30 space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase text-rose-300 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                  Possible Evacuation & Standby Zones
                </span>
                <div className="space-y-1">
                  {simResult.evacuationZones.map((zone, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-white/90 text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                      <span>{zone}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : simResult.trafficRedistribution ? (
              <div className="bg-cyan-950/30 p-3.5 rounded-xl border border-cyan-500/30 space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase text-cyan-300 flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                  Calculated Traffic Redistribution Routes
                </span>
                <div className="space-y-1.5">
                  {simResult.trafficRedistribution.map((route, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs text-white/80">
                      <span>&bull; {route.route}</span>
                      <span className="font-mono font-bold text-cyan-300">
                        {route.sharePct}% flow ({route.delayMinutes > 0 ? `+${route.delayMinutes}m` : "normal"})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-emerald-950/30 p-3.5 rounded-xl border border-emerald-500/30 space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase text-emerald-300 block">
                  Transit & Road Efficiency Gain
                </span>
                <p className="text-white/80 text-xs">
                  Corridor throughput increased with modal transit adoption.
                </p>
              </div>
            )}
          </div>

          {/* Emergency Vehicle Impact */}
          {simResult.emergencyVehicleImpact && (
            <div className="bg-black/50 p-3 rounded-xl border border-white/5 flex items-center gap-2 text-xs">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-white/80 font-medium">
                <strong>Emergency Vehicle Impact:</strong> {simResult.emergencyVehicleImpact}
              </span>
            </div>
          )}

          {/* AI Recommended Response */}
          <div className="bg-teal-950/40 border border-teal-500/40 p-4 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 text-teal-300 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4 text-teal-400" />
              <span>AI Recommended Operational Response</span>
            </div>
            <p className="text-white/90 text-xs leading-relaxed font-medium">
              {simResult.recommendedResponse}
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-white/40 italic pt-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>SIMULATION RUN — Powered by CityMind Multi-Agent Deterministic Decision Model</span>
          </div>
        </div>
      )}
    </div>
  );
};
