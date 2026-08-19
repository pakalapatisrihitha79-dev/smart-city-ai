import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useCity } from "../context/CityContext";
import { ResourceTrendCharts } from "./ResourceTrendCharts";
import { ResourceDistributionCharts } from "./ResourceDistributionCharts";
import { EnvironmentCenter } from "./EnvironmentCenter";
import { UtilitiesWatch } from "./UtilitiesWatch";
import {
  Wind,
  Zap,
  Droplets,
  Calendar,
  Leaf,
} from "lucide-react";

export const EnvironmentGridDashboard: React.FC = () => {
  const { currentZone, accessibilitySettings } = useCity();
  const [timeRange, setTimeRange] = useState<"6h" | "24h" | "7d">("24h");
  const [activeSubTab, setActiveSubTab] = useState<"all" | "trends" | "distribution" | "sensors">("all");

  const prefersReducedMotion = accessibilitySettings.reduceMotion;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.08,
        delayChildren: prefersReducedMotion ? 0 : 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: prefersReducedMotion ? 0.01 : 0.35, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-5 min-w-0"
    >
      {/* Top Banner with Quick Vital Statistics & Time Range Controls */}
      <motion.div
        variants={itemVariants}
        className="bg-[#0D1117]/95 border border-white/10 rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300">
              <Leaf className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                <span>ENVIRONMENT & RESOURCE GRID INTELLIGENCE</span>
                <span className="text-[10px] bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full border border-teal-500/40 font-mono">
                  ACTIVE TWIN SYNC
                </span>
              </h2>
              <p className="text-[11px] text-white/50">
                Interactive telemetry, Recharts resource trends, and distribution breakdowns for {currentZone.name}
              </p>
            </div>
          </div>
        </div>

        {/* Time Horizon Selector & Subtab Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Time Range Pills */}
          <div className="flex items-center bg-black/60 p-1 rounded-xl border border-white/10 text-xs font-mono">
            <span className="text-white/40 px-2 text-[10px] flex items-center gap-1 font-bold">
              <Calendar className="w-3 h-3" />
              RANGE:
            </span>
            {(["6h", "24h", "7d"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase transition-all ${
                  timeRange === range
                    ? "bg-teal-500 text-black shadow-md font-extrabold"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          {/* View Filter */}
          <div className="flex items-center bg-black/60 p-1 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => setActiveSubTab("all")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                activeSubTab === "all"
                  ? "bg-white/20 text-white font-extrabold"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Full Dashboard
            </button>
            <button
              onClick={() => setActiveSubTab("trends")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                activeSubTab === "trends"
                  ? "bg-white/20 text-white font-extrabold"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Trends
            </button>
            <button
              onClick={() => setActiveSubTab("distribution")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                activeSubTab === "distribution"
                  ? "bg-white/20 text-white font-extrabold"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Distributions
            </button>
          </div>
        </div>
      </motion.div>

      {/* Real-time KPI Ribbon */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#0D1117]/90 border border-white/10 p-3.5 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-white/50 text-[10px] font-bold uppercase tracking-wider">
            <span>Air Quality Index</span>
            <Wind className="w-3.5 h-3.5 text-teal-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-teal-400 font-display">{currentZone.aqi}</span>
            <span className="text-xs font-bold text-white/70 font-mono">({currentZone.aqiStatus})</span>
          </div>
          <span className="text-[10px] text-white/40 block font-mono">PM2.5: {currentZone.pm25} µg/m³</span>
        </div>

        <div className="bg-[#0D1117]/90 border border-white/10 p-3.5 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-white/50 text-[10px] font-bold uppercase tracking-wider">
            <span>Grid Power Demand</span>
            <Zap className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-400 font-display">{currentZone.energyDemandKw}</span>
            <span className="text-xs font-bold text-white/70 font-mono">kW</span>
          </div>
          <span className="text-[10px] text-white/40 block font-mono">{currentZone.energyPeakStatus}</span>
        </div>

        <div className="bg-[#0D1117]/90 border border-white/10 p-3.5 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-white/50 text-[10px] font-bold uppercase tracking-wider">
            <span>Renewable Mix</span>
            <Leaf className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-400 font-display">{currentZone.renewablePct}%</span>
            <span className="text-xs font-bold text-emerald-300 font-mono">Solar + Wind</span>
          </div>
          <span className="text-[10px] text-white/40 block font-mono">Offset: 4.8t CO₂/day</span>
        </div>

        <div className="bg-[#0D1117]/90 border border-white/10 p-3.5 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-white/50 text-[10px] font-bold uppercase tracking-wider">
            <span>Water Network</span>
            <Droplets className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-cyan-400 font-display">4.2</span>
            <span className="text-xs font-bold text-white/70 font-mono">Bar (84% Res)</span>
          </div>
          <span className={`text-[10px] font-mono block ${
            currentZone.waterStatus === "Anomaly Leakage" ? "text-rose-400 font-bold" : "text-white/40"
          }`}>
            Status: {currentZone.waterStatus}
          </span>
        </div>
      </motion.div>

      {/* Main Visualizations: Trends & Distributions */}
      <AnimatePresence mode="wait">
        {(activeSubTab === "all" || activeSubTab === "trends") && (
          <motion.div
            key="trends-view"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
          >
            <ResourceTrendCharts
              zone={currentZone}
              timeRange={timeRange}
              highContrast={accessibilitySettings.highContrast}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {(activeSubTab === "all" || activeSubTab === "distribution") && (
          <motion.div
            key="distribution-view"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
          >
            <ResourceDistributionCharts
              zone={currentZone}
              highContrast={accessibilitySettings.highContrast}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Deep-dive sensor & municipal infrastructure panels */}
      <AnimatePresence mode="wait">
        {(activeSubTab === "all" || activeSubTab === "sensors") && (
          <motion.div
            key="sensors-view"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-5 min-w-0"
          >
            <EnvironmentCenter />
            <UtilitiesWatch />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
