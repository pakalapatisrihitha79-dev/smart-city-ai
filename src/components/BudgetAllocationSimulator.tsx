import React, { useState } from "react";
import { useCity } from "../context/CityContext";
import {
  Coins,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  DollarSign,
  PieChart,
  ArrowRight,
  RefreshCw,
  Building,
  Waves,
  TreePine,
  Lightbulb,
  Recycle,
} from "lucide-react";

export const BudgetAllocationSimulator: React.FC = () => {
  const { allZones, currentZone } = useCity();

  // Total Capital Pool: 100 Lakhs / 10 Crore ($10 Million equivalent)
  const [budget, setBudget] = useState({
    roads: 25, // ₹2.5 Cr
    drainage: 35, // ₹3.5 Cr
    greenery: 15, // ₹1.5 Cr
    streetlights: 10, // ₹1.0 Cr
    waste: 15, // ₹1.5 Cr
  });

  const totalAllocated =
    budget.roads + budget.drainage + budget.greenery + budget.streetlights + budget.waste;

  // Compute live multi-vector simulated outcome
  const riskReductionPct = Math.round(
    budget.drainage * 0.45 + budget.roads * 0.25 + budget.streetlights * 0.15 + budget.waste * 0.1
  );
  const healthAndAirGainPct = Math.round(
    budget.greenery * 0.55 + budget.waste * 0.3 + budget.roads * 0.15
  );
  const citizenSatisfactionGainPct = Math.round(
    budget.roads * 0.3 + budget.streetlights * 0.25 + budget.drainage * 0.25 + budget.greenery * 0.2
  );
  const cityHealthDelta = Math.round((riskReductionPct * 0.22 + healthAndAirGainPct * 0.18) * 10) / 10;

  const applyAIOptimalPreset = () => {
    setBudget({
      drainage: 35, // Drainage is #1 vulnerability
      roads: 25,
      greenery: 18,
      waste: 12,
      streetlights: 10,
    });
  };

  const applyGreenResiliencePreset = () => {
    setBudget({
      greenery: 35,
      drainage: 30,
      waste: 15,
      streetlights: 10,
      roads: 10,
    });
  };

  const applyRapidInfrastructurePreset = () => {
    setBudget({
      roads: 40,
      streetlights: 20,
      drainage: 25,
      waste: 10,
      greenery: 5,
    });
  };

  return (
    <div className="bg-[#0D1117]/95 border border-emerald-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5 text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black text-white uppercase tracking-wider font-display">
                AI Budget Allocation Simulator <span className="text-emerald-400">&bull; Capital ROI Optimizer</span>
              </h2>
              <span className="text-[9px] font-mono font-bold bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/40">
                ₹10 CRORE ($10M) CAPITAL POOL
              </span>
            </div>
            <p className="text-xs text-white/50">
              Simulate municipal budget distribution across 5 core sectors and forecast city health & risk ROI
            </p>
          </div>
        </div>

        {/* AI Presets */}
        <div className="flex flex-wrap gap-1.5 font-bold font-mono text-[10px]">
          <button
            onClick={applyAIOptimalPreset}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-black rounded-xl flex items-center gap-1 shadow-lg shadow-emerald-600/20 font-black uppercase tracking-wider transition-all"
          >
            <Sparkles className="w-3 h-3" />
            <span>AI Optimal Allocation</span>
          </button>
          <button
            onClick={applyGreenResiliencePreset}
            className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 text-emerald-300 border border-white/10 rounded-xl uppercase tracking-wider transition-all"
          >
            Eco-Resilience
          </button>
          <button
            onClick={applyRapidInfrastructurePreset}
            className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 text-cyan-300 border border-white/10 rounded-xl uppercase tracking-wider transition-all"
          >
            Roads & Grid
          </button>
        </div>
      </div>

      {/* 4 SIMULATED IMPACT FORECAST CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-black/40 p-3.5 rounded-2xl border border-white/10 space-y-0.5">
          <span className="text-[10px] text-white/50 block font-mono uppercase font-bold">Risk Reduction Impact</span>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            -{riskReductionPct}%
          </div>
          <span className="text-[10px] text-emerald-300 font-mono">Flood & road hazard abatement</span>
        </div>

        <div className="bg-black/40 p-3.5 rounded-2xl border border-white/10 space-y-0.5">
          <span className="text-[10px] text-white/50 block font-mono uppercase font-bold">Public Health & Air ROI</span>
          <div className="text-2xl font-black text-cyan-400 font-mono">
            +{healthAndAirGainPct}%
          </div>
          <span className="text-[10px] text-cyan-300 font-mono">Canopy & sanitation gains</span>
        </div>

        <div className="bg-black/40 p-3.5 rounded-2xl border border-white/10 space-y-0.5">
          <span className="text-[10px] text-white/50 block font-mono uppercase font-bold">Citizen Approval Delta</span>
          <div className="text-2xl font-black text-amber-400 font-mono">
            +{citizenSatisfactionGainPct}%
          </div>
          <span className="text-[10px] text-amber-300 font-mono">Direct satisfaction response</span>
        </div>

        <div className="bg-black/40 p-3.5 rounded-2xl border border-white/10 space-y-0.5">
          <span className="text-[10px] text-white/50 block font-mono uppercase font-bold">City Health Index Score</span>
          <div className="text-2xl font-black text-teal-400 font-mono">
            +{cityHealthDelta} pts
          </div>
          <span className="text-[10px] text-teal-300 font-mono">Longitudinal resilience gain</span>
        </div>
      </div>

      {/* 5 SECTOR SLIDERS */}
      <div className="bg-black/40 border border-white/10 p-4 sm:p-5 rounded-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <span className="font-extrabold text-white text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-400" />
            Sector Capital Expenditure Distribution (Total: {totalAllocated}%)
          </span>
          <span
            className={`font-mono text-xs font-bold ${
              totalAllocated === 100 ? "text-emerald-400" : "text-amber-400"
            }`}
          >
            {totalAllocated === 100 ? "Balanced (100% of ₹10 Cr)" : `Allocated: ${totalAllocated}%`}
          </span>
        </div>

        <div className="space-y-3.5">
          {/* Roads */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-bold">
              <div className="flex items-center gap-2 text-white">
                <Building className="w-3.5 h-3.5 text-cyan-400" />
                <span>Road Health & Resurfacing</span>
              </div>
              <span className="font-mono text-cyan-400">
                {budget.roads}% (₹{(budget.roads * 0.1).toFixed(1)} Crore)
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={budget.roads}
              onChange={(e) => setBudget({ ...budget, roads: Number(e.target.value) })}
              className="w-full h-2 bg-black/80 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          {/* Drainage */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-bold">
              <div className="flex items-center gap-2 text-white">
                <Waves className="w-3.5 h-3.5 text-blue-400" />
                <span>Stormwater Drainage & Flood Sump Upgrades</span>
              </div>
              <span className="font-mono text-blue-400">
                {budget.drainage}% (₹{(budget.drainage * 0.1).toFixed(1)} Crore)
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={budget.drainage}
              onChange={(e) => setBudget({ ...budget, drainage: Number(e.target.value) })}
              className="w-full h-2 bg-black/80 rounded-lg appearance-none cursor-pointer accent-blue-400"
            />
          </div>

          {/* Greenery */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-bold">
              <div className="flex items-center gap-2 text-white">
                <TreePine className="w-3.5 h-3.5 text-emerald-400" />
                <span>Green Spaces, Afforestation & Pocket Parks</span>
              </div>
              <span className="font-mono text-emerald-400">
                {budget.greenery}% (₹{(budget.greenery * 0.1).toFixed(1)} Crore)
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={budget.greenery}
              onChange={(e) => setBudget({ ...budget, greenery: Number(e.target.value) })}
              className="w-full h-2 bg-black/80 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
          </div>

          {/* Streetlights */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-bold">
              <div className="flex items-center gap-2 text-white">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                <span>Smart LED Streetlights & Dark Spot Elimination</span>
              </div>
              <span className="font-mono text-amber-400">
                {budget.streetlights}% (₹{(budget.streetlights * 0.1).toFixed(1)} Crore)
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="40"
              value={budget.streetlights}
              onChange={(e) => setBudget({ ...budget, streetlights: Number(e.target.value) })}
              className="w-full h-2 bg-black/80 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
          </div>

          {/* Waste */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-bold">
              <div className="flex items-center gap-2 text-white">
                <Recycle className="w-3.5 h-3.5 text-teal-400" />
                <span>Smart Waste Compactor Fleet & Sensor Bins</span>
              </div>
              <span className="font-mono text-teal-400">
                {budget.waste}% (₹{(budget.waste * 0.1).toFixed(1)} Crore)
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="40"
              value={budget.waste}
              onChange={(e) => setBudget({ ...budget, waste: Number(e.target.value) })}
              className="w-full h-2 bg-black/80 rounded-lg appearance-none cursor-pointer accent-teal-400"
            />
          </div>
        </div>
      </div>

      {/* AI STRATEGIC RECOMMENDATION BANNER */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-[#111C2B] to-cyan-950/40 border border-emerald-500/40 p-4 rounded-2xl space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span className="font-extrabold text-white text-xs uppercase tracking-wider">
            CityMind Capital Allocation Intelligence
          </span>
        </div>
        <p className="text-xs text-white/90 font-bold leading-relaxed">
          &ldquo;Prioritizing Drainage (₹3.5 Cr) + Road Resurfacing (₹2.5 Cr) delivers the maximum combined risk reduction score (-{riskReductionPct}%), effectively shielding the lowlands against monsoon floods while keeping arterial traffic velocities above 38 km/h.&rdquo;
        </p>
      </div>
    </div>
  );
};
