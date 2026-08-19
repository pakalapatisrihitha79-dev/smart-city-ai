import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import { CityZone } from "../types";
import { Zap, Droplets, Wind, Thermometer, Clock, TrendingUp, Sparkles, AlertCircle } from "lucide-react";

interface ResourceTrendChartsProps {
  zone: CityZone;
  timeRange: "6h" | "24h" | "7d";
  highContrast?: boolean;
}

// Custom Tooltip component with dark cybernetic aesthetic
const CustomTrendTooltip = ({ active, payload, label, unitMap }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0B0F17]/95 border border-teal-500/40 p-3 rounded-xl shadow-2xl backdrop-blur-md text-xs font-mono">
        <div className="flex items-center justify-between gap-4 pb-1.5 mb-1.5 border-b border-white/10">
          <span className="text-white/60 text-[10px] uppercase font-bold flex items-center gap-1">
            <Clock className="w-3 h-3 text-teal-400" />
            {label}
          </span>
          <span className="text-[10px] text-teal-400 font-extrabold px-1.5 py-0.5 bg-teal-500/10 rounded border border-teal-500/30">
            TELEMETRY
          </span>
        </div>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => {
            const unit = unitMap?.[entry.dataKey] || "";
            return (
              <div key={`item-${index}`} className="flex items-center justify-between gap-3 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-white/80">{entry.name}:</span>
                </div>
                <span className="font-bold font-mono text-white">
                  {typeof entry.value === "number" ? entry.value.toLocaleString() : entry.value}{" "}
                  <span className="text-white/40 text-[9px]">{unit}</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
};

export const ResourceTrendCharts: React.FC<ResourceTrendChartsProps> = ({ zone, timeRange, highContrast }) => {
  const [activeChart, setActiveChart] = useState<"energy" | "water" | "air" | "weather">("energy");
  const [showThresholds, setShowThresholds] = useState(true);

  // Generate dynamic realistic time-series data based on the selected zone's baseline metrics
  const chartData = useMemo(() => {
    const baseEnergy = zone.energyDemandKw || 2450;
    const baseRenewable = zone.renewablePct || 48;
    const baseAqi = zone.aqi || 55;
    const basePm25 = zone.pm25 || 18;
    const basePm10 = zone.pm10 || 32;
    const isAnomaly = zone.waterStatus === "Anomaly Leakage";
    const baseTemp = zone.temp || 24;
    const baseHumidity = zone.humidity || 58;

    if (timeRange === "6h") {
      const times = ["12:00", "13:00", "14:00", "15:00", "16:00", "17:00 (Now)"];
      return times.map((time, i) => {
        const factor = 0.9 + i * 0.05 + Math.sin(i * 1.2) * 0.08;
        const solarFactor = Math.max(0.2, Math.sin((i / 5) * Math.PI));
        return {
          time,
          gridDemandKw: Math.round(baseEnergy * factor),
          solarGenerationKw: Math.round(baseEnergy * (baseRenewable / 100) * solarFactor * 1.3),
          cleanGridPct: Math.min(95, Math.round(baseRenewable * (0.8 + solarFactor * 0.4))),
          waterFlowM3h: Math.round((isAnomaly ? 580 : 380) * (0.95 + Math.random() * 0.1)),
          waterPressureBar: Number(((isAnomaly ? 3.4 : 4.2) + Math.sin(i) * 0.15).toFixed(2)),
          reservoirCapacityPct: Math.max(40, Math.round(84 - i * 0.8)),
          aqi: Math.round(baseAqi * (0.85 + i * 0.06)),
          pm25: Math.round(basePm25 * (0.85 + i * 0.06)),
          pm10: Math.round(basePm10 * (0.9 + i * 0.05)),
          temp: Number((baseTemp + i * 0.4).toFixed(1)),
          humidity: Math.round(baseHumidity - i * 1.5),
        };
      });
    }

    if (timeRange === "7d") {
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun (Today)"];
      return days.map((day, i) => {
        const weekendFactor = i >= 5 ? 0.78 : 1.05;
        return {
          time: day,
          gridDemandKw: Math.round(baseEnergy * weekendFactor * (0.92 + Math.random() * 0.15)),
          solarGenerationKw: Math.round(baseEnergy * (baseRenewable / 100) * (0.9 + Math.random() * 0.2)),
          cleanGridPct: Math.min(98, Math.round(baseRenewable * (0.9 + Math.random() * 0.2))),
          waterFlowM3h: Math.round((isAnomaly ? 610 : 400) * (0.9 + Math.random() * 0.2)),
          waterPressureBar: Number(((isAnomaly ? 3.3 : 4.2) + (Math.random() - 0.5) * 0.3).toFixed(2)),
          reservoirCapacityPct: Math.round(82 + Math.sin(i * 0.8) * 6),
          aqi: Math.round(baseAqi * (i >= 5 ? 0.75 : 1.05) * (0.9 + Math.random() * 0.15)),
          pm25: Math.round(basePm25 * (i >= 5 ? 0.7 : 1.1)),
          pm10: Math.round(basePm10 * (i >= 5 ? 0.8 : 1.05)),
          temp: Number((baseTemp + Math.sin(i) * 2.5).toFixed(1)),
          humidity: Math.round(baseHumidity + Math.cos(i) * 8),
        };
      });
    }

    // Default 24h
    const hours = [
      "00:00", "02:00", "04:00", "06:00", "08:00", "10:00",
      "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"
    ];

    return hours.map((hour, idx) => {
      // Diurnal curve calculations
      const hr = idx * 2;
      // Solar peaks midday (10-16)
      const solarStrength = hr >= 6 && hr <= 18 ? Math.sin(((hr - 6) / 12) * Math.PI) : 0;
      // Energy demand peaks 8-10am and 18-21pm
      const morningPeak = Math.exp(-Math.pow((hr - 9) / 2.5, 2)) * 0.35;
      const eveningPeak = Math.exp(-Math.pow((hr - 19) / 3, 2)) * 0.55;
      const baseLoad = 0.55 + morningPeak + eveningPeak;

      const demandKw = Math.round(baseEnergy * baseLoad);
      const solarKw = Math.round(baseEnergy * 0.65 * solarStrength);

      // Water consumption peaks morning & evening
      const waterFactor = 0.6 + morningPeak * 0.8 + eveningPeak * 0.7;
      const waterM3 = Math.round((isAnomaly ? 620 : 420) * waterFactor);
      const waterPressure = Number(((isAnomaly ? 3.3 : 4.3) - (morningPeak + eveningPeak) * 0.4).toFixed(2));

      // AQI worsens with traffic peaks (morning & evening commute)
      const aqiFactor = 0.75 + (morningPeak + eveningPeak) * 0.6;

      return {
        time: hour,
        gridDemandKw: demandKw,
        solarGenerationKw: solarKw,
        cleanGridPct: Math.min(100, Math.round((solarKw / (demandKw || 1)) * 100 + (baseRenewable * 0.4))),
        waterFlowM3h: waterM3,
        waterPressureBar: Math.max(2.5, waterPressure),
        reservoirCapacityPct: Math.round(86 - (hr / 24) * 5),
        aqi: Math.round(baseAqi * aqiFactor),
        pm25: Math.round(basePm25 * aqiFactor),
        pm10: Math.round(basePm10 * aqiFactor),
        temp: Number((baseTemp - 3 + Math.sin(((hr - 6) / 18) * Math.PI) * 6).toFixed(1)),
        humidity: Math.round(baseHumidity + 15 - Math.sin(((hr - 6) / 18) * Math.PI) * 20),
      };
    });
  }, [zone, timeRange]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`bg-[#0D1117]/95 border border-white/10 rounded-2xl p-4 sm:p-5 shadow-2xl space-y-4 text-xs min-w-0 ${
        highContrast ? "border-teal-500/60 bg-black" : ""
      }`}
    >
      {/* Header with metric tab selection */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-teal-400" />
            <h3 className="font-extrabold text-white text-xs uppercase tracking-wider">
              REAL-TIME RESOURCE USAGE TRENDS
            </h3>
            <span className="text-[9px] bg-teal-500/20 text-teal-300 font-mono font-bold px-2 py-0.5 rounded-full border border-teal-500/30">
              RECHARTS TELEMETRY
            </span>
          </div>
          <p className="text-[11px] text-white/50 mt-0.5">
            Continuous IoT sensor ingestion across <strong className="text-white">{zone.name}</strong>
          </p>
        </div>

        {/* Sub-Metric Switchers */}
        <div className="flex items-center gap-1 bg-black/50 p-1 rounded-xl border border-white/10 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveChart("energy")}
            className={`px-3 py-1.5 rounded-lg font-bold text-[11px] flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeChart === "energy"
                ? "bg-amber-500 text-black shadow-md"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Power & Grid</span>
          </button>

          <button
            onClick={() => setActiveChart("water")}
            className={`px-3 py-1.5 rounded-lg font-bold text-[11px] flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeChart === "water"
                ? "bg-cyan-500 text-black shadow-md"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            <span>Water Flow</span>
          </button>

          <button
            onClick={() => setActiveChart("air")}
            className={`px-3 py-1.5 rounded-lg font-bold text-[11px] flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeChart === "air"
                ? "bg-emerald-500 text-black shadow-md"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>Air & PM</span>
          </button>

          <button
            onClick={() => setActiveChart("weather")}
            className={`px-3 py-1.5 rounded-lg font-bold text-[11px] flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeChart === "weather"
                ? "bg-indigo-500 text-white shadow-md"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" />
            <span>Climate</span>
          </button>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="bg-black/40 p-3 sm:p-4 rounded-xl border border-white/10 space-y-3">
        {/* Dynamic Context Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
            <span className="font-mono text-white/70">
              Active Sensor Stream: <strong className="text-white uppercase">{activeChart} Monitor</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 cursor-pointer text-white/60 hover:text-white text-[10px] font-mono">
              <input
                type="checkbox"
                checked={showThresholds}
                onChange={(e) => setShowThresholds(e.target.checked)}
                className="rounded bg-slate-800 border-slate-700 text-teal-500 focus:ring-0 w-3 h-3"
              />
              <span>Show Safe Thresholds</span>
            </label>
            <span className="text-[10px] text-white/40 font-mono">Range: {timeRange.toUpperCase()}</span>
          </div>
        </div>

        {/* Animate Sub-chart changes */}
        <AnimatePresence mode="wait">
          {/* 1. ENERGY CHART */}
          {activeChart === "energy" && (
            <motion.div
              key="chart-energy"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="space-y-3"
            >
              <div className="h-64 sm:h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <defs>
                      <linearGradient id="energyDemandGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.6} />
                        <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="solarGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.7} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" vertical={false} />
                    <XAxis dataKey="time" stroke="#ffffff50" tick={{ fill: "#ffffff70", fontSize: 10 }} />
                    <YAxis stroke="#ffffff50" tick={{ fill: "#ffffff70", fontSize: 10 }} />
                    <Tooltip
                      content={
                        <CustomTrendTooltip
                          unitMap={{
                            gridDemandKw: "kW",
                            solarGenerationKw: "kW",
                            cleanGridPct: "%",
                          }}
                        />
                      }
                    />
                    <Legend
                      wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
                      iconType="circle"
                    />
                    {showThresholds && (
                      <ReferenceLine
                        y={zone.energyDemandKw * 1.15}
                        stroke="#EF4444"
                        strokeDasharray="4 4"
                        label={{
                          value: "Substation Peak Limit",
                          fill: "#EF4444",
                          fontSize: 9,
                          position: "top",
                        }}
                      />
                    )}
                    <Area
                      type="monotone"
                      dataKey="gridDemandKw"
                      name="Grid Load Demand"
                      stroke="#F59E0B"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#energyDemandGrad)"
                    />
                    <Area
                      type="monotone"
                      dataKey="solarGenerationKw"
                      name="Renewable Generation"
                      stroke="#10B981"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#solarGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Quick Insights pill bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/5 text-[11px] font-mono">
                <div className="bg-white/5 p-2 rounded-lg">
                  <span className="text-white/40 block text-[9px]">LIVE PEAK LOAD</span>
                  <span className="text-amber-400 font-bold text-xs">{zone.energyDemandKw} kW</span>
                </div>
                <div className="bg-white/5 p-2 rounded-lg">
                  <span className="text-white/40 block text-[9px]">RENEWABLE PENETRATION</span>
                  <span className="text-emerald-400 font-bold text-xs">{zone.renewablePct}%</span>
                </div>
                <div className="bg-white/5 p-2 rounded-lg">
                  <span className="text-white/40 block text-[9px]">GRID STATUS</span>
                  <span className="text-white font-bold text-xs">{zone.energyPeakStatus}</span>
                </div>
                <div className="bg-white/5 p-2 rounded-lg">
                  <span className="text-white/40 block text-[9px]">BATTERY BUFFER</span>
                  <span className="text-teal-400 font-bold text-xs">88.4 MWh Ready</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* 2. WATER FLOW & PRESSURE CHART */}
          {activeChart === "water" && (
            <motion.div
              key="chart-water"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="space-y-3"
            >
              <div className="h-64 sm:h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <defs>
                      <linearGradient id="waterFlowGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.6} />
                        <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" vertical={false} />
                    <XAxis dataKey="time" stroke="#ffffff50" tick={{ fill: "#ffffff70", fontSize: 10 }} />
                    <YAxis yAxisId="left" stroke="#06B6D4" tick={{ fill: "#06B6D4", fontSize: 10 }} />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      domain={[2, 6]}
                      stroke="#A855F7"
                      tick={{ fill: "#A855F7", fontSize: 10 }}
                    />
                    <Tooltip
                      content={
                        <CustomTrendTooltip
                          unitMap={{
                            waterFlowM3h: "m³/h",
                            waterPressureBar: "Bar",
                            reservoirCapacityPct: "%",
                          }}
                        />
                      }
                    />
                    <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                    {showThresholds && (
                      <ReferenceLine
                        yAxisId="right"
                        y={3.0}
                        stroke="#EF4444"
                        strokeDasharray="3 3"
                        label={{ value: "Min Safe Pressure (3.0 Bar)", fill: "#EF4444", fontSize: 9 }}
                      />
                    )}
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="waterFlowM3h"
                      name="Flow Rate (m³/h)"
                      stroke="#06B6D4"
                      strokeWidth={2}
                      fill="url(#waterFlowGrad)"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="waterPressureBar"
                      name="Grid Pressure (Bar)"
                      stroke="#C084FC"
                      strokeWidth={2.5}
                      dot={{ r: 3, fill: "#C084FC" }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {zone.waterStatus === "Anomaly Leakage" && (
                <div className="bg-rose-500/10 border border-rose-500/30 p-2.5 rounded-xl flex items-center gap-2 text-rose-300">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>
                    <strong>Acoustic Pressure Anomaly:</strong> Sustained pressure drop detected at 3.3 Bar with elevated flow rate (+28%). Auto-dispatching leak repair crew.
                  </span>
                </div>
              )}
            </motion.div>
          )}

          {/* 3. AIR QUALITY & PARTICULATES CHART */}
          {activeChart === "air" && (
            <motion.div
              key="chart-air"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="space-y-3"
            >
              <div className="h-64 sm:h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <defs>
                      <linearGradient id="aqiGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.6} />
                        <stop offset="95%" stopColor="#14B8A6" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" vertical={false} />
                    <XAxis dataKey="time" stroke="#ffffff50" tick={{ fill: "#ffffff70", fontSize: 10 }} />
                    <YAxis stroke="#ffffff50" tick={{ fill: "#ffffff70", fontSize: 10 }} />
                    <Tooltip
                      content={
                        <CustomTrendTooltip
                          unitMap={{
                            aqi: "AQI",
                            pm25: "µg/m³",
                            pm10: "µg/m³",
                          }}
                        />
                      }
                    />
                    <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                    {showThresholds && (
                      <ReferenceLine
                        y={50}
                        stroke="#10B981"
                        strokeDasharray="3 3"
                        label={{ value: "Good (<50)", fill: "#10B981", fontSize: 9, position: "insideTopLeft" }}
                      />
                    )}
                    {showThresholds && (
                      <ReferenceLine
                        y={100}
                        stroke="#F59E0B"
                        strokeDasharray="3 3"
                        label={{ value: "Moderate Threshold (100)", fill: "#F59E0B", fontSize: 9, position: "insideTopLeft" }}
                      />
                    )}
                    <Area
                      type="monotone"
                      dataKey="aqi"
                      name="Composite AQI"
                      stroke="#14B8A6"
                      strokeWidth={2.5}
                      fill="url(#aqiGrad)"
                    />
                    <Line
                      type="monotone"
                      dataKey="pm25"
                      name="PM2.5 (Fine Dust)"
                      stroke="#F43F5E"
                      strokeWidth={2}
                      dot={{ r: 2 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="pm10"
                      name="PM10 (Coarse Particulates)"
                      stroke="#FBBF24"
                      strokeWidth={1.5}
                      strokeDasharray="4 4"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="p-2.5 bg-teal-500/10 border border-teal-500/20 rounded-xl flex items-center justify-between text-[11px]">
                <span className="text-teal-300 font-medium">
                  Continuous optical laser sensor validation active in {zone.name}
                </span>
                <span className="font-bold text-teal-400 font-mono">
                  Current AQI: {zone.aqi} ({zone.aqiStatus})
                </span>
              </div>
            </motion.div>
          )}

          {/* 4. CLIMATE & WEATHER CHART */}
          {activeChart === "weather" && (
            <motion.div
              key="chart-weather"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="space-y-3"
            >
              <div className="h-64 sm:h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" vertical={false} />
                    <XAxis dataKey="time" stroke="#ffffff50" tick={{ fill: "#ffffff70", fontSize: 10 }} />
                    <YAxis yAxisId="temp" stroke="#FB923C" tick={{ fill: "#FB923C", fontSize: 10 }} />
                    <YAxis
                      yAxisId="humidity"
                      orientation="right"
                      domain={[0, 100]}
                      stroke="#60A5FA"
                      tick={{ fill: "#60A5FA", fontSize: 10 }}
                    />
                    <Tooltip
                      content={
                        <CustomTrendTooltip
                          unitMap={{
                            temp: "°C",
                            humidity: "%",
                          }}
                        />
                      }
                    />
                    <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                    <Line
                      yAxisId="temp"
                      type="monotone"
                      dataKey="temp"
                      name="Ambient Temperature (°C)"
                      stroke="#FB923C"
                      strokeWidth={2.5}
                      dot={{ r: 3, fill: "#FB923C" }}
                    />
                    <Line
                      yAxisId="humidity"
                      type="monotone"
                      dataKey="humidity"
                      name="Relative Humidity (%)"
                      stroke="#60A5FA"
                      strokeWidth={2}
                      dot={{ r: 3, fill: "#60A5FA" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] font-mono">
                <div className="bg-white/5 p-2 rounded-lg">
                  <span className="text-white/40 block text-[9px]">TEMP NOW</span>
                  <span className="text-orange-400 font-bold text-xs">{zone.temp}°C</span>
                </div>
                <div className="bg-white/5 p-2 rounded-lg">
                  <span className="text-white/40 block text-[9px]">HUMIDITY</span>
                  <span className="text-blue-400 font-bold text-xs">{zone.humidity}%</span>
                </div>
                <div className="bg-white/5 p-2 rounded-lg col-span-2 sm:col-span-1">
                  <span className="text-white/40 block text-[9px]">PRECIPITATION</span>
                  <span className="text-teal-400 font-bold text-xs">{zone.rainfallMm} mm/h</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
