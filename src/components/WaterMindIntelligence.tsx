import React, { useState } from "react";
import { useCity } from "../context/CityContext";
import { WaterSensorNode } from "../types";
import {
  Droplets,
  Activity,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Sliders,
  Send,
  RefreshCw,
  Sparkles,
  Layers,
  Gauge,
  Waves,
  Wrench,
  ArrowRight,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

export const WaterMindIntelligence: React.FC = () => {
  const { allZones, currentZone } = useCity();

  // Simulated IoT Water Network state
  const [sensorNodes, setSensorNodes] = useState<WaterSensorNode[]>([
    {
      id: "node-tank-a",
      type: "tank",
      name: "Main Elevated Storage Reservoir A",
      zoneName: "Zone 1 (North Heights)",
      status: "NORMAL",
      metricLabel: "Storage Level",
      metricValue: "82% Capacity (4.2M Liters)",
      numericLevelPct: 82,
      pressurePsi: 62,
    },
    {
      id: "node-tank-b",
      type: "tank",
      name: "Secondary Gravity Tank B",
      zoneName: "Zone 3 (Central Ridge)",
      status: "NORMAL",
      metricLabel: "Storage Level",
      metricValue: "64% Capacity (2.1M Liters)",
      numericLevelPct: 64,
      pressurePsi: 54,
    },
    {
      id: "node-pipe-17",
      type: "pipeline",
      name: "Trunk Main Pipeline #17",
      zoneName: "Zone 4 (Lowland District)",
      status: "CRITICAL",
      metricLabel: "Pressure Anomaly",
      metricValue: "44 PSI (Drop: -14 PSI)",
      numericLevelPct: 44,
      pressurePsi: 44,
      flowRateLps: 340,
      anomalyDetected: "Acoustic micro-sensor detects subsurface pipe fracture with 280 L/min non-revenue water loss.",
    },
    {
      id: "node-pipe-04",
      type: "pipeline",
      name: "Express Feeder Pipeline #04",
      zoneName: "Zone 2 (Uptown)",
      status: "NORMAL",
      metricLabel: "Operational Pressure",
      metricValue: "58 PSI (Nominal)",
      numericLevelPct: 88,
      pressurePsi: 58,
      flowRateLps: 210,
    },
    {
      id: "node-pipe-29",
      type: "pipeline",
      name: "Commercial Loop Pipeline #29",
      zoneName: "Zone 5 (Tech Corridor)",
      status: "WARNING",
      metricLabel: "Abnormal Consumption",
      metricValue: "+34% Anomaly Draw",
      numericLevelPct: 76,
      pressurePsi: 72,
      flowRateLps: 410,
      anomalyDetected: "Unusual midnight consumption spike detected in commercial zone after 01:00 AM.",
    },
    {
      id: "node-sump-4",
      type: "sump",
      name: "Lowland Stormwater Sump Basin #4",
      zoneName: "Zone 4 (Lowland Underpass)",
      status: "CRITICAL",
      metricLabel: "Sump Saturation",
      metricValue: "88% Sump Saturation",
      numericLevelPct: 88,
      flowRateLps: 680,
      anomalyDetected: "Stormwater inflow approaching overflow threshold. Inundation risk for road underpass.",
    },
  ]);

  const [dispatchedActions, setDispatchedActions] = useState<string[]>([]);
  const [waterActionLog, setWaterActionLog] = useState<string[]>([
    "08:10 AM: Acoustic sensor #17-B flagged -14 PSI pressure gradient drop in Zone 4.",
    "07:30 AM: Automated chlorine dosing calibrated at Water Treatment Plant 2.",
  ]);

  const handleFixLeak = (nodeId: string, nodeName: string) => {
    setDispatchedActions((prev) => [...prev, nodeId]);
    setSensorNodes((prev) =>
      prev.map((n) =>
        n.id === nodeId
          ? {
              ...n,
              status: "NORMAL",
              metricValue: "56 PSI (Stabilized)",
              pressurePsi: 56,
              anomalyDetected: undefined,
            }
          : n
      )
    );
    setWaterActionLog([
      `${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}: Isolated automated Valve #17-B and dispatched Rapid Acoustic Leak Patching crew.`,
      ...waterActionLog,
    ]);
  };

  const handleActivatePump = (nodeId: string) => {
    setDispatchedActions((prev) => [...prev, nodeId]);
    setSensorNodes((prev) =>
      prev.map((n) =>
        n.id === nodeId
          ? {
              ...n,
              status: "NORMAL",
              metricValue: "42% Sump Level (Draining at 850 L/s)",
              numericLevelPct: 42,
              anomalyDetected: undefined,
            }
          : n
      )
    );
    setWaterActionLog([
      `${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}: Activated Auxiliary Submersible Pump Station #4. Stormwater drawdown initiated.`,
      ...waterActionLog,
    ]);
  };

  return (
    <div className="bg-[#0D1117]/95 border border-cyan-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5 text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black text-white uppercase tracking-wider font-display">
                WaterMind Intelligence <span className="text-cyan-400">&bull; Smart Hydro-Network</span>
              </h2>
              <span className="text-[9px] font-mono font-bold bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/40">
                ACOUSTIC & PRESSURE IOT MESH
              </span>
            </div>
            <p className="text-xs text-white/50">
              Real-time water network monitoring, acoustic leakage detection, consumption anomalies & flood sumps
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-cyan-400 font-mono font-bold text-xs uppercase">
            32 IoT Flow Nodes Online
          </span>
        </div>
      </div>

      {/* 4 HIGH-LEVEL WATER NETWORK TELEMETRY CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-black/40 p-3.5 rounded-2xl border border-white/10 space-y-0.5">
          <span className="text-[10px] text-white/50 block font-mono uppercase font-bold">Total Storage Buffer</span>
          <div className="text-xl font-black text-cyan-400 font-mono">73% Full</div>
          <span className="text-[10px] text-emerald-400 font-mono">6.3M Liters Available</span>
        </div>

        <div className="bg-black/40 p-3.5 rounded-2xl border border-white/10 space-y-0.5">
          <span className="text-[10px] text-white/50 block font-mono uppercase font-bold">Leakage Loss Risk</span>
          <div className="text-xl font-black text-rose-400 font-mono">1 Critical Leak</div>
          <span className="text-[10px] text-rose-300 font-mono">Pipeline #17 (-14 PSI drop)</span>
        </div>

        <div className="bg-black/40 p-3.5 rounded-2xl border border-white/10 space-y-0.5">
          <span className="text-[10px] text-white/50 block font-mono uppercase font-bold">Consumption Anomaly</span>
          <div className="text-xl font-black text-amber-400 font-mono">+34% Surge</div>
          <span className="text-[10px] text-amber-300 font-mono">Commercial Sector Loop</span>
        </div>

        <div className="bg-black/40 p-3.5 rounded-2xl border border-white/10 space-y-0.5">
          <span className="text-[10px] text-white/50 block font-mono uppercase font-bold">Drainage Sump Load</span>
          <div className="text-xl font-black text-rose-400 font-mono">88% Capacity</div>
          <span className="text-[10px] text-rose-300 font-mono">Zone 4 Sump #4</span>
        </div>
      </div>

      {/* SIMULATED WATER SENSOR NETWORK GRID */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
            <Gauge className="w-4 h-4 text-cyan-400" />
            Live Simulated Water Sensor Network (Tanks &bull; Pipelines &bull; Sumps)
          </span>
          <span className="text-[9px] font-mono text-white/50">Frequency: 5-Second Telemetry</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {sensorNodes.map((node) => {
            const isCritical = node.status === "CRITICAL";
            const isWarning = node.status === "WARNING";
            const isFixed = dispatchedActions.includes(node.id);

            return (
              <div
                key={node.id}
                className={`p-4 rounded-2xl border transition-all space-y-3 ${
                  isCritical && !isFixed
                    ? "bg-rose-950/25 border-rose-500/40 shadow-lg shadow-rose-950/20"
                    : isWarning && !isFixed
                    ? "bg-amber-950/25 border-amber-500/40 shadow-lg shadow-amber-950/20"
                    : "bg-black/40 border-white/10"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded border ${
                          isCritical && !isFixed
                            ? "bg-rose-950 text-rose-300 border-rose-500/50"
                            : isWarning && !isFixed
                            ? "bg-amber-950 text-amber-300 border-amber-500/50"
                            : "bg-emerald-950 text-emerald-300 border-emerald-500/40"
                        }`}
                      >
                        {isFixed ? "RESOLVED" : node.status}
                      </span>
                      <span className="text-cyan-400 font-mono text-[10px] font-bold">
                        {node.zoneName}
                      </span>
                    </div>
                    <h4 className="font-extrabold text-white text-xs sm:text-sm mt-1">{node.name}</h4>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-black font-mono text-white">{node.metricValue}</span>
                    <span className="text-[8px] font-mono text-white/40 block uppercase">{node.metricLabel}</span>
                  </div>
                </div>

                {/* Visual Level Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-white/50">
                    <span>Operating Level</span>
                    <span>{node.numericLevelPct}%</span>
                  </div>
                  <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden border border-white/10">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isCritical && !isFixed
                          ? "bg-rose-500"
                          : isWarning && !isFixed
                          ? "bg-amber-500"
                          : "bg-cyan-500"
                      }`}
                      style={{ width: `${node.numericLevelPct}%` }}
                    />
                  </div>
                </div>

                {/* Anomaly Description & AI Diagnostic */}
                {node.anomalyDetected && !isFixed && (
                  <div className="bg-rose-950/40 p-2.5 rounded-xl border border-rose-500/30 text-[11px] text-rose-200 space-y-1">
                    <div className="flex items-center gap-1 font-bold text-rose-300">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span>AI Hydro-Diagnostic</span>
                    </div>
                    <p className="leading-snug">{node.anomalyDetected}</p>
                  </div>
                )}

                {/* Interactive Fix / Dispatch Button */}
                {node.id === "node-pipe-17" && !isFixed && (
                  <button
                    onClick={() => handleFixLeak(node.id, node.name)}
                    className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-rose-600/30 transition-all"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Isolate Valve & Dispatch Acoustic Leak Team</span>
                  </button>
                )}

                {node.id === "node-sump-4" && !isFixed && (
                  <button
                    onClick={() => handleActivatePump(node.id)}
                    className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-600/30 transition-all"
                  >
                    <Waves className="w-3.5 h-3.5" />
                    <span>Activate Auxiliary Stormwater Sump Pump #4</span>
                  </button>
                )}

                {isFixed && (
                  <div className="flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-emerald-950/40 text-emerald-300 border border-emerald-500/30 font-bold text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Action Executed & Verified Nominal</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* WATER OPERATIONS AUDIT LOG */}
      <div className="space-y-2 pt-2 border-t border-white/10">
        <span className="font-mono font-bold text-white/50 text-[10px] uppercase tracking-wider block">
          HYDRO-OPERATIONAL AUDIT TRAIL
        </span>
        <div className="bg-black/50 p-3.5 rounded-2xl border border-white/10 space-y-1.5 font-mono text-[10px] text-white/70 max-h-28 overflow-y-auto no-scrollbar">
          {waterActionLog.map((log, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>{log}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
