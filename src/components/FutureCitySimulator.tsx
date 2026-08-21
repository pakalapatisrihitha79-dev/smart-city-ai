import React, { useState } from "react";
import { useCity } from "../context/CityContext";
import {
  Compass,
  Sparkles,
  Calendar,
  Sliders,
  TrendingDown,
  TrendingUp,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Flame,
  TreePine,
  Car,
  Zap,
} from "lucide-react";

export const FutureCitySimulator: React.FC = () => {
  const { allZones, currentZone } = useCity();

  const [horizonYear, setHorizonYear] = useState<2030 | 2035 | 2040>(2035);
  const [popGrowthPct, setPopGrowthPct] = useState<number>(25);
  const [evAutonomyPct, setEvAutonomyPct] = useState<number>(55);
  const [climateWarmingC, setClimateWarmingC] = useState<number>(1.5);
  const [cleanGridSharePct, setCleanGridSharePct] = useState<number>(75);

  // Auto-tune defaults when switching years
  const handleSelectYear = (year: 2030 | 2035 | 2040) => {
    setHorizonYear(year);
    if (year === 2030) {
      setPopGrowthPct(15);
      setEvAutonomyPct(35);
      setClimateWarmingC(1.0);
      setCleanGridSharePct(55);
    } else if (year === 2035) {
      setPopGrowthPct(25);
      setEvAutonomyPct(55);
      setClimateWarmingC(1.5);
      setCleanGridSharePct(75);
    } else {
      setPopGrowthPct(45);
      setEvAutonomyPct(85);
      setClimateWarmingC(2.2);
      setCleanGridSharePct(95);
    }
  };

  // Compute live Business As Usual vs AI Masterplan outcomes
  // 1. Business As Usual
  const bauGridlockPct = Math.min(95, Math.round(55 + popGrowthPct * 0.9 - evAutonomyPct * 0.15));
  const bauFloodIncidentsPct = Math.min(100, Math.round(30 + climateWarmingC * 24));
  const bauHeatDays = Math.round(18 + climateWarmingC * 16);
  const bauRiskScore = Math.min(96, Math.round(50 + popGrowthPct * 0.4 + climateWarmingC * 12));

  // 2. AI Adaptive Masterplan
  const aiGridlockPct = Math.max(22, Math.round(bauGridlockPct * 0.4 - evAutonomyPct * 0.18));
  const aiFloodIncidentsPct = Math.max(10, Math.round(bauFloodIncidentsPct * 0.25));
  const aiHeatDays = Math.max(6, Math.round(bauHeatDays * 0.35));
  const aiRiskScore = Math.max(24, Math.round(bauRiskScore * 0.48));

  return (
    <div className="bg-[#0D1117]/95 border border-purple-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5 text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black text-white uppercase tracking-wider font-display">
                Future City Horizon Mode <span className="text-purple-400">&bull; 2030 / 2035 / 2040</span>
              </h2>
              <span className="text-[9px] font-mono font-bold bg-purple-950 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/40">
                PREDICTIVE HORIZON SIMULATOR
              </span>
            </div>
            <p className="text-xs text-white/50">
              Compare long-term Business-As-Usual degradation vs. CityMind AI Adaptive Masterplan
            </p>
          </div>
        </div>

        {/* Year Horizon Switcher */}
        <div className="flex gap-1.5 bg-black/60 p-1 rounded-2xl border border-white/10 font-mono font-black text-xs">
          {[2030, 2035, 2040].map((year) => (
            <button
              key={year}
              onClick={() => handleSelectYear(year as any)}
              className={`px-4 py-1.5 rounded-xl transition-all ${
                horizonYear === year
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30 font-black"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      {/* MACRO DRIVER SLIDERS */}
      <div className="bg-black/40 border border-white/10 p-4 rounded-2xl space-y-3">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-400 block">
          Macro Demographic & Climate Drivers for Year {horizonYear}
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-bold">
          {/* Pop Growth */}
          <div className="bg-[#0D1117] p-3 rounded-xl border border-white/5 space-y-1.5">
            <div className="flex justify-between text-[11px]">
              <span className="text-white/70">Population Growth</span>
              <span className="text-purple-400 font-mono">+{popGrowthPct}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="60"
              value={popGrowthPct}
              onChange={(e) => setPopGrowthPct(Number(e.target.value))}
              className="w-full h-1.5 bg-black/80 rounded-lg appearance-none cursor-pointer accent-purple-400"
            />
          </div>

          {/* EV & Autonomous */}
          <div className="bg-[#0D1117] p-3 rounded-xl border border-white/5 space-y-1.5">
            <div className="flex justify-between text-[11px]">
              <span className="text-white/70">Autonomous Transit</span>
              <span className="text-cyan-400 font-mono">{evAutonomyPct}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="95"
              value={evAutonomyPct}
              onChange={(e) => setEvAutonomyPct(Number(e.target.value))}
              className="w-full h-1.5 bg-black/80 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          {/* Climate Warming */}
          <div className="bg-[#0D1117] p-3 rounded-xl border border-white/5 space-y-1.5">
            <div className="flex justify-between text-[11px]">
              <span className="text-white/70">Climate Warming</span>
              <span className="text-rose-400 font-mono">+{climateWarmingC}&deg;C</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="3.5"
              step="0.1"
              value={climateWarmingC}
              onChange={(e) => setClimateWarmingC(Number(e.target.value))}
              className="w-full h-1.5 bg-black/80 rounded-lg appearance-none cursor-pointer accent-rose-400"
            />
          </div>

          {/* Clean Grid */}
          <div className="bg-[#0D1117] p-3 rounded-xl border border-white/5 space-y-1.5">
            <div className="flex justify-between text-[11px]">
              <span className="text-white/70">Renewable Energy</span>
              <span className="text-emerald-400 font-mono">{cleanGridSharePct}%</span>
            </div>
            <input
              type="range"
              min="30"
              max="100"
              value={cleanGridSharePct}
              onChange={(e) => setCleanGridSharePct(Number(e.target.value))}
              className="w-full h-1.5 bg-black/80 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
          </div>
        </div>
      </div>

      {/* SIDE-BY-SIDE PROJECTION: BAU VS AI MASTERPLAN */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Scenario A: Business As Usual */}
        <div className="bg-rose-950/20 border border-rose-500/40 p-4 sm:p-5 rounded-2xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-rose-500/20 pb-3">
            <div>
              <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/40 font-mono font-black text-[9px] uppercase">
                SCENARIO A &bull; WITHOUT AI
              </span>
              <h3 className="font-black text-white text-sm sm:text-base mt-1">
                Business-As-Usual ({horizonYear})
              </h3>
            </div>

            <div className="text-right">
              <span className="text-2xl font-black font-mono text-rose-400">{bauRiskScore}/100</span>
              <span className="text-[8px] font-mono text-white/40 block uppercase">Overall Risk</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
            <div className="bg-[#0D1117] p-2.5 rounded-xl border border-white/5">
              <span className="text-white/40 uppercase block text-[8px]">Gridlock Saturation</span>
              <span className="font-black text-rose-400 text-sm">{bauGridlockPct}%</span>
            </div>
            <div className="bg-[#0D1117] p-2.5 rounded-xl border border-white/5">
              <span className="text-white/40 uppercase block text-[8px]">Flood Frequency</span>
              <span className="font-black text-rose-400 text-sm">+{bauFloodIncidentsPct}%</span>
            </div>
            <div className="bg-[#0D1117] p-2.5 rounded-xl border border-white/5">
              <span className="text-white/40 uppercase block text-[8px]">Extreme Heat Days</span>
              <span className="font-black text-rose-400 text-sm">{bauHeatDays} days/yr</span>
            </div>
          </div>

          <p className="text-white/70 text-[11px] leading-relaxed">
            Without adaptive interventions, population growth pushes arterial corridors past structural capacity. Monsoon rainfall overwhelms legacy concrete drainage, leading to chronic multi-day city paralysis.
          </p>
        </div>

        {/* Scenario B: CityMind AI Adaptive Masterplan */}
        <div className="bg-gradient-to-br from-purple-950/30 via-[#111C2B] to-emerald-950/40 border border-emerald-500/50 p-4 sm:p-5 rounded-2xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
            <div>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-mono font-black text-[9px] uppercase">
                SCENARIO B &bull; CITYMIND AI OPTIMIZED
              </span>
              <h3 className="font-black text-white text-sm sm:text-base mt-1">
                AI Adaptive Masterplan ({horizonYear})
              </h3>
            </div>

            <div className="text-right">
              <span className="text-2xl font-black font-mono text-emerald-400">{aiRiskScore}/100</span>
              <span className="text-[8px] font-mono text-white/40 block uppercase">Low Risk</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
            <div className="bg-[#0D1117] p-2.5 rounded-xl border border-white/5">
              <span className="text-white/40 uppercase block text-[8px]">Gridlock Saturation</span>
              <span className="font-black text-emerald-400 text-sm">{aiGridlockPct}%</span>
            </div>
            <div className="bg-[#0D1117] p-2.5 rounded-xl border border-white/5">
              <span className="text-white/40 uppercase block text-[8px]">Flood Frequency</span>
              <span className="font-black text-emerald-400 text-sm">+{aiFloodIncidentsPct}%</span>
            </div>
            <div className="bg-[#0D1117] p-2.5 rounded-xl border border-white/5">
              <span className="text-white/40 uppercase block text-[8px]">Extreme Heat Days</span>
              <span className="font-black text-emerald-400 text-sm">{aiHeatDays} days/yr</span>
            </div>
          </div>

          <p className="text-white/90 text-[11px] leading-relaxed font-medium">
            AI coordinates autonomous shared shuttles, converts flood zones into bio-retention sponge parks, and scales urban tree canopies to reduce surface heat by -2.8&deg;C.
          </p>
        </div>
      </div>
    </div>
  );
};
