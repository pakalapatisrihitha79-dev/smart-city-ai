import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { CityZone } from "../types";
import { PieChart as PieIcon, BarChart3, Zap, Droplets, Trash2 } from "lucide-react";

interface ResourceDistributionChartsProps {
  zone: CityZone;
  highContrast?: boolean;
}

const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-[#0B0F17]/95 border border-teal-500/40 p-3 rounded-xl shadow-2xl backdrop-blur-md text-xs font-mono">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.payload.fill || data.color }} />
          <span className="font-bold text-white text-xs">{data.name}</span>
        </div>
        <div className="flex items-center justify-between gap-4 text-[11px] text-white/80">
          <span>Contribution:</span>
          <span className="font-extrabold text-teal-400 font-mono text-sm">{data.value}%</span>
        </div>
        {data.payload.detail && (
          <div className="text-[10px] text-white/50 pt-1 mt-1 border-t border-white/10">
            {data.payload.detail}
          </div>
        )}
      </div>
    );
  }
  return null;
};

const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0B0F17]/95 border border-teal-500/40 p-3 rounded-xl shadow-2xl backdrop-blur-md text-xs font-mono">
        <div className="font-bold text-white pb-1 mb-1 border-b border-white/10 uppercase tracking-wider text-[11px]">
          {label}
        </div>
        <div className="space-y-1">
          {payload.map((p: any, idx: number) => (
            <div key={idx} className="flex items-center justify-between gap-3 text-[11px]">
              <span className="text-white/70">{p.name}:</span>
              <span className="font-bold text-white font-mono" style={{ color: p.color }}>
                {p.value} {p.unit || ""}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export const ResourceDistributionCharts: React.FC<ResourceDistributionChartsProps> = ({
  zone,
  highContrast,
}) => {
  const [distributionView, setDistributionView] = useState<"energy" | "water" | "waste" | "comparison">("energy");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // 1. Energy Mix Distribution Data (dynamically adapted to zone renewablePct)
  const energyMixData = useMemo(() => {
    const renewable = zone.renewablePct || 48;
    const solar = Math.round(renewable * 0.65);
    const wind = Math.round(renewable * 0.25);
    const battery = Math.round(renewable * 0.1);
    const gridThermal = Math.max(5, 100 - renewable);

    return [
      { name: "Rooftop & Microgrid Solar", value: solar, color: "#10B981", detail: "Active decentralized photovoltaic arrays" },
      { name: "Urban Wind Turbines", value: wind, color: "#06B6D4", detail: "Harbor and ridge wind intake" },
      { name: "BESS Storage Discharge", value: battery, color: "#8B5CF6", detail: "Lithium-iron phosphate buffer reserve" },
      { name: "Main Grid Base Thermal/Hydro", value: gridThermal, color: "#F59E0B", detail: "Synchronous regional grid supply" },
    ];
  }, [zone]);

  // 2. Water Consumption by Sector
  const waterSectorData = useMemo(() => {
    return [
      { name: "Residential Domestic", value: 45, color: "#38BDF8", detail: "Household potable water and sanitation" },
      { name: "Commercial & Tech Corridors", value: 25, color: "#818CF8", detail: "HVAC cooling & business complexes" },
      { name: "Municipal Parks & Canopy", value: 18, color: "#34D399", detail: "Automated smart drip irrigation" },
      { name: "Emergency & Industrial Reserves", value: 12, color: "#F472B6", detail: "Fire readiness and utility storage" },
    ];
  }, []);

  // 3. Smart Waste Diversion Streams
  const wasteStreamData = useMemo(() => {
    return [
      { name: "Recyclable Polymers & Paper", value: 38, color: "#10B981", detail: "Automated optical sorting centers" },
      { name: "Organic Compost & Biomass", value: 34, color: "#84CC16", detail: "Municipal methane bio-digesters" },
      { name: "Metals & E-Waste Recovery", value: 18, color: "#F59E0B", detail: "High-yield urban circularity" },
      { name: "Residual Landfill Diverted", value: 10, color: "#64748B", detail: "Plasma gasification processing" },
    ];
  }, []);

  // 4. Cross-District Comparative Bar Data
  const districtComparisonData = useMemo(() => {
    return [
      { district: "Tech Corridor", demand: 3200, renewable: 65, waterPct: 92 },
      { district: "Coastal Marina", demand: 2100, renewable: 78, waterPct: 84 },
      { district: "Old Town", demand: 1850, renewable: 35, waterPct: 68 },
      { district: "Lowland Valley", demand: 2450, renewable: 52, waterPct: 79 },
      { district: "Uptown Heights", demand: 2800, renewable: 60, waterPct: 88 },
    ];
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`bg-[#0D1117]/95 border border-white/10 rounded-2xl p-4 sm:p-5 shadow-2xl space-y-4 text-xs min-w-0 ${
        highContrast ? "border-teal-500/60 bg-black" : ""
      }`}
    >
      {/* Header with selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-teal-400" />
            <h3 className="font-extrabold text-white text-xs uppercase tracking-wider">
              RESOURCE & GENERATION MIX DISTRIBUTION
            </h3>
          </div>
          <p className="text-[11px] text-white/50 mt-0.5">
            Breakdown shares for <strong className="text-white">{zone.name}</strong>
          </p>
        </div>

        {/* View Switchers */}
        <div className="flex items-center gap-1 bg-black/50 p-1 rounded-xl border border-white/10 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setDistributionView("energy")}
            className={`px-2.5 py-1.5 rounded-lg font-bold text-[11px] flex items-center gap-1.5 transition-all whitespace-nowrap ${
              distributionView === "energy"
                ? "bg-teal-500 text-black shadow-md"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <Zap className="w-3 h-3" />
            <span>Energy Mix</span>
          </button>

          <button
            onClick={() => setDistributionView("water")}
            className={`px-2.5 py-1.5 rounded-lg font-bold text-[11px] flex items-center gap-1.5 transition-all whitespace-nowrap ${
              distributionView === "water"
                ? "bg-cyan-500 text-black shadow-md"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <Droplets className="w-3 h-3" />
            <span>Water End-Use</span>
          </button>

          <button
            onClick={() => setDistributionView("waste")}
            className={`px-2.5 py-1.5 rounded-lg font-bold text-[11px] flex items-center gap-1.5 transition-all whitespace-nowrap ${
              distributionView === "waste"
                ? "bg-emerald-500 text-black shadow-md"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <Trash2 className="w-3 h-3" />
            <span>Waste Stream</span>
          </button>

          <button
            onClick={() => setDistributionView("comparison")}
            className={`px-2.5 py-1.5 rounded-lg font-bold text-[11px] flex items-center gap-1.5 transition-all whitespace-nowrap ${
              distributionView === "comparison"
                ? "bg-indigo-500 text-white shadow-md"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <BarChart3 className="w-3 h-3" />
            <span>Cross-District</span>
          </button>
        </div>
      </div>

      {/* Chart Canvas Box */}
      <div className="bg-black/40 p-4 rounded-xl border border-white/10">
        <AnimatePresence mode="wait">
          {/* DONUT CHARTS */}
          {distributionView !== "comparison" ? (
            <motion.div
              key={`donut-${distributionView}`}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
            >
              {/* Interactive Pie Chart */}
              <div className="md:col-span-6 h-56 sm:h-64 flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip content={<CustomPieTooltip />} />
                    <Pie
                      data={
                        distributionView === "energy"
                          ? energyMixData
                          : distributionView === "water"
                          ? waterSectorData
                          : wasteStreamData
                      }
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                      onMouseEnter={(_, index) => setActiveIndex(index)}
                      onMouseLeave={() => setActiveIndex(null)}
                    >
                      {(distributionView === "energy"
                        ? energyMixData
                        : distributionView === "water"
                        ? waterSectorData
                        : wasteStreamData
                      ).map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          stroke={activeIndex === index ? "#ffffff" : "transparent"}
                          strokeWidth={activeIndex === index ? 2 : 0}
                          className="transition-all cursor-pointer hover:opacity-80"
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>

                {/* Center Overlay Counter */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[10px] text-white/40 font-mono uppercase font-bold">
                    {distributionView === "energy" ? "CLEAN GRID" : distributionView === "water" ? "SECTORS" : "CIRCULARITY"}
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-white font-display">
                    {distributionView === "energy"
                      ? `${zone.renewablePct}%`
                      : distributionView === "water"
                      ? "4 Nodes"
                      : "90% Recycled"}
                  </span>
                </div>
              </div>

              {/* Interactive Legend & Breakdown List */}
              <div className="md:col-span-6 space-y-2">
                {(distributionView === "energy"
                  ? energyMixData
                  : distributionView === "water"
                  ? waterSectorData
                  : wasteStreamData
                ).map((item, index) => {
                  const isHovered = activeIndex === index;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25, delay: index * 0.05 }}
                      onMouseEnter={() => setActiveIndex(index)}
                      onMouseLeave={() => setActiveIndex(null)}
                      className={`p-2 rounded-xl border transition-all cursor-pointer ${
                        isHovered
                          ? "bg-white/10 border-teal-500/60 shadow-lg scale-[1.02]"
                          : "bg-white/5 border-white/5 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                          <span className="font-bold text-white text-[11px] truncate">{item.name}</span>
                        </div>
                        <span className="font-extrabold font-mono text-white text-xs shrink-0" style={{ color: item.color }}>
                          {item.value}%
                        </span>
                      </div>
                      <p className="text-[10px] text-white/40 mt-0.5 truncate pl-5">{item.detail}</p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            /* COMPARATIVE BAR CHART */
            <motion.div
              key="district-comparison"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="space-y-3"
            >
              <div className="h-60 sm:h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={districtComparisonData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" vertical={false} />
                    <XAxis dataKey="district" stroke="#ffffff50" tick={{ fill: "#ffffff70", fontSize: 10 }} />
                    <YAxis stroke="#ffffff50" tick={{ fill: "#ffffff70", fontSize: 10 }} />
                    <Tooltip content={<CustomBarTooltip />} />
                    <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                    <Bar dataKey="demand" name="Power Demand (kW)" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="renewable" name="Renewable Share (%)" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-[10px] text-white/40 text-center font-mono">
                Comparative benchmark across all 5 municipal grid zones in NovaCity
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
