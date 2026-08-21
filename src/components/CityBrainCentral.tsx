import React, { useState } from "react";
import { useCity } from "../context/CityContext";
import { motion, AnimatePresence } from "motion/react";
import {
  Brain,
  Car,
  CloudRain,
  Wind,
  Camera,
  Layers,
  Droplets,
  Calendar,
  Bus,
  ShieldAlert,
  History,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Cpu,
  RefreshCw,
  Zap,
  Radio,
  FileText,
  Eye,
  SlidersHorizontal,
  ChevronRight,
  Activity,
} from "lucide-react";

interface CityBrainCentralProps {
  onNavigateTab?: (tab: any) => void;
  onOpenCivicReport?: () => void;
  onOpenSimulator?: () => void;
}

export const CityBrainCentral: React.FC<CityBrainCentralProps> = ({
  onNavigateTab,
  onOpenCivicReport,
  onOpenSimulator,
}) => {
  const {
    currentZone,
    currentScenario,
    setDemoScenario,
    accessibilitySettings,
    openExplainModal,
    setIsConfidenceModalOpen,
  } = useCity();

  const [activeStream, setActiveStream] = useState<string | null>(null);
  const [selectedCaseIndex, setSelectedCaseIndex] = useState(0);

  const prefersReducedMotion = accessibilitySettings.reduceMotion;

  // 10 Real-time Ingestion Streams combined by City Brain
  const dataStreams = [
    {
      id: "traffic",
      name: "Traffic & Telemetry",
      icon: Car,
      color: "text-blue-400",
      bg: "bg-blue-500/10 border-blue-500/30",
      liveValue: `${currentZone.trafficSpeed} km/h • ${currentZone.traffic}`,
      status: currentZone.traffic === "High" || currentZone.traffic === "Congested" ? "STRESSED" : "OPTIMAL",
      badgeColor: currentZone.traffic === "High" ? "text-amber-400 bg-amber-950/40" : "text-emerald-400 bg-emerald-950/40",
    },
    {
      id: "weather",
      name: "Weather & Rain Radar",
      icon: CloudRain,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10 border-cyan-500/30",
      liveValue: `${currentZone.rainfallMm} mm/h • ${currentZone.weather}`,
      status: currentZone.rainfallMm > 20 ? "ALERT" : "STABLE",
      badgeColor: currentZone.rainfallMm > 20 ? "text-rose-400 bg-rose-950/40" : "text-cyan-400 bg-cyan-950/40",
    },
    {
      id: "aqi",
      name: "Air Quality & PM Sensors",
      icon: Wind,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/30",
      liveValue: `AQI ${currentZone.aqi} • ${currentZone.aqiStatus}`,
      status: currentZone.aqi > 100 ? "POOR" : "HEALTHY",
      badgeColor: currentZone.aqi > 100 ? "text-amber-400 bg-amber-950/40" : "text-emerald-400 bg-emerald-950/40",
    },
    {
      id: "civic",
      name: "Citizen Reports & Photos",
      icon: Camera,
      color: "text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/30",
      liveValue: "37 Live Reports (8 Verified)",
      status: "ACTIVE",
      badgeColor: "text-amber-400 bg-amber-950/40",
    },
    {
      id: "roads",
      name: "Road Health & Pavements",
      icon: Layers,
      color: "text-slate-300",
      bg: "bg-slate-500/10 border-slate-500/30",
      liveValue: `Score: 68/100 • 4 Potholes`,
      status: "WATCH",
      badgeColor: "text-amber-300 bg-amber-950/40",
    },
    {
      id: "flood",
      name: "Flood Risk & Sump Gauges",
      icon: Droplets,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10 border-indigo-500/30",
      liveValue: `${currentZone.floodRiskPct}% Risk • Sump: 64%`,
      status: currentZone.floodRiskPct > 50 ? "ELEVATED" : "NORMAL",
      badgeColor: currentZone.floodRiskPct > 50 ? "text-rose-400 bg-rose-950/40" : "text-emerald-400 bg-emerald-950/40",
    },
    {
      id: "events",
      name: "Urban Events & Crowds",
      icon: Calendar,
      color: "text-purple-400",
      bg: "bg-purple-500/10 border-purple-500/30",
      liveValue: "4 Major Events • Stadium Active",
      status: "MONITORED",
      badgeColor: "text-purple-300 bg-purple-950/40",
    },
    {
      id: "transit",
      name: "Public Transport & Metro",
      icon: Bus,
      color: "text-teal-300",
      bg: "bg-teal-500/10 border-teal-500/30",
      liveValue: "94% On-Time • Metro Line 2 Loaded",
      status: "ON-SCHEDULE",
      badgeColor: "text-teal-300 bg-teal-950/40",
    },
    {
      id: "emergency",
      name: "Emergency Broadcast Alerts",
      icon: ShieldAlert,
      color: "text-rose-400",
      bg: "bg-rose-500/10 border-rose-500/30",
      liveValue: `${currentZone.alertCount} Active Municipal Warnings`,
      status: currentZone.alertCount > 0 ? "WARNING" : "CLEAR",
      badgeColor: currentZone.alertCount > 0 ? "text-rose-400 bg-rose-950/40" : "text-emerald-400 bg-emerald-950/40",
    },
    {
      id: "history",
      name: "Historical Incident Patterns",
      icon: History,
      color: "text-cyan-300",
      bg: "bg-cyan-500/10 border-cyan-500/30",
      liveValue: "12,480 Incidents Correlated",
      status: "LEARNED",
      badgeColor: "text-cyan-300 bg-cyan-950/40",
    },
  ];

  // 4-Stage Cognitive Pipeline Cases synthesized by City Brain
  const cognitiveCases = [
    {
      id: "flood-risk",
      title: "Monsoon Inundation & Sump Overload",
      icon: Droplets,
      themeColor: "indigo",
      stage1Situation: {
        headline: "Heavy Rainfall + Lowland Drainage Chokepoints",
        metrics: [
          "Precipitation: 35mm/h (Spiking)",
          "Drainage Inflow: 88% capacity",
          "Citizen Reports: 37 drainage tickets in Ward 12",
          "Sump Water Level: Rising +14cm/hr",
        ],
      },
      stage2Risk: {
        headline: "High Inundation Risk in Low-Elevation Underpasses",
        level: "HIGH (84% Probability)",
        color: "text-rose-400",
        impact: "Severe road impassability, potential ground-floor water ingress in 120 residential units.",
      },
      stage3Prediction: {
        headline: "Lowland Expressway Waterlogging within 45 Minutes",
        timeframe: "30-60 Minutes Horizon",
        confidence: "89% Confidence (Historical match to July 2024 flood)",
        projection: "Water depth expected to reach 42cm unless auxiliary retention basin gate #3 is opened.",
      },
      stage4Action: {
        headline: "Automated Municipal Protocol & Citizen Notification",
        recommendations: [
          "1. AI auto-triggers Stormwater Auxiliary Pump #4 in Lowland Basin.",
          "2. Reroute Transit Bus Lines 14 & 18 via Upper Ridge Bypass.",
          "3. Dispatch priority SMS flash advisory to Ward 12 residents.",
          "4. Pre-deploy emergency drainage quick-response crew with submersible pumps.",
        ],
        primaryButton: "Execute Flood Protocol",
        onExecute: () => {
          if (onNavigateTab) onNavigateTab("authority");
        },
      },
    },
    {
      id: "gridlock-commute",
      title: "Arterial Corridor Gridlock & Emissions Surge",
      icon: Car,
      themeColor: "amber",
      stage1Situation: {
        headline: "School Closing + Lane Maintenance on 4th Avenue",
        metrics: [
          "Vehicle Speed: Dropped to 16 km/h",
          "Corridor Congestion: 78% Density",
          "Citizen Pothole Complaints: 4 on Main Flyover",
          "PM2.5 Sensor: Spiking to 82 µg/m³",
        ],
      },
      stage2Risk: {
        headline: "Cross-District Cascading Gridlock & Particulate Spike",
        level: "ELEVATED (76% Probability)",
        color: "text-amber-400",
        impact: "Transit delays exceeding 24 mins, commuter frustration, localized smog pocket.",
      },
      stage3Prediction: {
        headline: "Secondary Chokepoint on 7th Link Road in 25 Minutes",
        timeframe: "25-45 Minutes Horizon",
        confidence: "92% Confidence (Daily commute pattern model)",
        projection: "Traffic spillover will cause gridlock on connector roads unless signal timings adjust.",
      },
      stage4Action: {
        headline: "Dynamic Green Wave Traffic Signal Calibration",
        recommendations: [
          "1. Extend Green Signal duration by +18 seconds on East-West Corridor.",
          "2. Send Smart Travel navigation rerouting push to 4,200 active commuters.",
          "3. Dispatch Traffic Police to manual override at 4th Ave junction.",
          "4. Increase frequency on Metro Line 2 by adding 2 extra trains.",
        ],
        primaryButton: "Optimize Traffic Flow",
        onExecute: () => {
          if (onNavigateTab) onNavigateTab("travel");
        },
      },
    },
    {
      id: "power-heatwave",
      title: "Peak Heatwave Transformer Stress & Brownout Risk",
      icon: Zap,
      themeColor: "rose",
      stage1Situation: {
        headline: "Ambient Temp 38°C + High Air Conditioner Demand",
        metrics: [
          "Grid Electricity Demand: 4,820 kW (94% Peak Load)",
          "Substation Temperature: 62°C (Warning threshold)",
          "Solar Output: Declining as sun angle lowers",
          "Battery Reserves: 72% remaining",
        ],
      },
      stage2Risk: {
        headline: "Thermal Overload on Central Substation Transformer B",
        level: "CRITICAL (88% Probability)",
        color: "text-rose-400",
        impact: "Potential localized brownout affecting 8 commercial blocks and 3,500 homes.",
      },
      stage3Prediction: {
        headline: "Substation Trip Expected at 5:15 PM without Load Shedding",
        timeframe: "1-2 Hours Horizon",
        confidence: "86% Confidence (Thermal dissipation model)",
        projection: "Transformer core will exceed 75°C safety limit within 70 minutes.",
      },
      stage4Action: {
        headline: "Industrial Demand Response & Battery Discharge Mandate",
        recommendations: [
          "1. Discharge 850 kW from Municipal Green Battery Storage Buffer.",
          "2. Activate automated demand response for heavy industrial chillers (-15%).",
          "3. Maintain uninterrupted dual-feed power to General Hospital & Care Centers.",
          "4. Dispatch cooling spray trucks to Central Substation radiators.",
        ],
        primaryButton: "Stabilize Power Grid",
        onExecute: () => {
          if (onNavigateTab) onNavigateTab("environment");
        },
      },
    },
  ];

  const currentCase = cognitiveCases[selectedCaseIndex];

  return (
    <div className="space-y-6 text-xs min-w-0">
      {/* Central Brain Banner */}
      <motion.div
        initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0D1117] via-[#111C2B] to-[#0A192F] border border-cyan-500/40 p-5 sm:p-7 shadow-2xl space-y-5"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        {/* Header Ribbon */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-teal-400 text-black flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.5)] shrink-0">
              <Brain className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight font-display">
                  City Brain <span className="text-cyan-400">&bull; Central AI Engine</span>
                </h1>
                <span className="text-[9px] font-mono font-black uppercase tracking-widest text-cyan-300 bg-cyan-950/80 px-2.5 py-0.5 rounded-full border border-cyan-500/40">
                  REAL-TIME COGNITION
                </span>
              </div>
              <p className="text-xs text-white/60 mt-0.5">
                Continuously fusing 10 live telemetry streams into predictive urban intelligence & automated action
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsConfidenceModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white flex items-center gap-1.5 transition-colors font-bold uppercase tracking-wider"
            >
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              <span>AI Confidence (89%)</span>
            </button>
            <button
              onClick={() => openExplainModal("health")}
              className="px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-xs text-cyan-200 flex items-center gap-1.5 transition-colors font-bold uppercase tracking-wider"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Explain Reasoning</span>
            </button>
          </div>
        </div>

        {/* 10 Live Telemetry Streams Ribbon */}
        <div className="relative z-10 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono uppercase font-bold text-white/50">
            <span className="flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
              <span>10 Continuous Data Ingestion Streams (Fused Live)</span>
            </span>
            <span className="text-teal-400 font-extrabold">All 10 Feeds Synchronized</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
            {dataStreams.map((stream) => {
              const IconComp = stream.icon;
              const isSelected = activeStream === stream.id;

              return (
                <div
                  key={stream.id}
                  onClick={() => setActiveStream(isSelected ? null : stream.id)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer ${stream.bg} ${
                    isSelected ? "ring-2 ring-cyan-400 scale-[1.02]" : "hover:border-white/30"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1.5 truncate">
                      <IconComp className={`w-3.5 h-3.5 ${stream.color} shrink-0`} />
                      <span className="font-bold text-white text-[10px] truncate">{stream.name}</span>
                    </div>
                    <span className={`text-[8px] font-mono font-bold px-1 rounded ${stream.badgeColor}`}>
                      {stream.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-white/80 font-mono mt-1 truncate">{stream.liveValue}</p>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* 2. THE 4-STAGE COGNITIVE PIPELINE ENGINE */}
      <div className="bg-[#0D1117]/95 border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-black text-white uppercase tracking-wider font-display">
                Core Cognitive AI Pipeline
              </h2>
            </div>
            <p className="text-xs text-white/50 mt-0.5">
              Current Situation &rarr; Risk Assessment &rarr; AI Prediction &rarr; Recommended Action
            </p>
          </div>

          {/* Scenario / Case Picker */}
          <div className="flex items-center gap-1.5 bg-black/50 p-1 rounded-xl border border-white/10 overflow-x-auto no-scrollbar">
            {cognitiveCases.map((c, idx) => (
              <button
                key={c.id}
                onClick={() => setSelectedCaseIndex(idx)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap uppercase tracking-wider ${
                  selectedCaseIndex === idx
                    ? "bg-cyan-500 text-black font-black shadow-md"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                {c.title}
              </button>
            ))}
          </div>
        </div>

        {/* 4 Connected Stages Visual Pipeline */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {/* STAGE 1: CURRENT SITUATION */}
          <div className="rounded-2xl bg-gradient-to-b from-blue-950/40 to-[#0D1117] border border-blue-500/30 p-4 space-y-3 flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono font-black uppercase tracking-widest text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded-full border border-blue-500/30">
                  STAGE 01 &bull; SITUATION
                </span>
                <Activity className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <h3 className="font-bold text-white text-xs leading-snug">
                {currentCase.stage1Situation.headline}
              </h3>
              <div className="space-y-1.5 pt-1">
                {currentCase.stage1Situation.metrics.map((m, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[10px] text-white/70 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                    <span className="truncate">{m}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-3 border-t border-white/5 text-[10px] text-blue-300 font-mono">
              &bull; 4 Stream Indicators Fused
            </div>
          </div>

          {/* STAGE 2: RISK */}
          <div className="rounded-2xl bg-gradient-to-b from-amber-950/40 to-[#0D1117] border border-amber-500/30 p-4 space-y-3 flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono font-black uppercase tracking-widest text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/30">
                  STAGE 02 &bull; RISK
                </span>
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <h3 className="font-bold text-white text-xs leading-snug">
                {currentCase.stage2Risk.headline}
              </h3>
              <div className="bg-amber-500/10 border border-amber-500/20 p-2 rounded-xl">
                <span className="text-[9px] font-mono uppercase text-white/50 block">Risk Evaluation</span>
                <span className={`text-xs font-black font-mono ${currentCase.stage2Risk.color}`}>
                  {currentCase.stage2Risk.level}
                </span>
              </div>
              <p className="text-[11px] text-white/70 leading-relaxed">
                {currentCase.stage2Risk.impact}
              </p>
            </div>
            <div className="pt-3 border-t border-white/5 text-[10px] text-amber-300 font-mono">
              &bull; Spatial Vulnerability Computed
            </div>
          </div>

          {/* STAGE 3: PREDICTION */}
          <div className="rounded-2xl bg-gradient-to-b from-indigo-950/40 to-[#0D1117] border border-indigo-500/30 p-4 space-y-3 flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono font-black uppercase tracking-widest text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded-full border border-indigo-500/30">
                  STAGE 03 &bull; PREDICTION
                </span>
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <h3 className="font-bold text-white text-xs leading-snug">
                {currentCase.stage3Prediction.headline}
              </h3>
              <div className="bg-indigo-500/10 border border-indigo-500/20 p-2 rounded-xl space-y-0.5">
                <div className="text-[9px] text-indigo-300 font-mono font-bold">
                  {currentCase.stage3Prediction.timeframe}
                </div>
                <div className="text-[9px] text-white/60 font-mono">
                  {currentCase.stage3Prediction.confidence}
                </div>
              </div>
              <p className="text-[11px] text-white/70 leading-relaxed">
                {currentCase.stage3Prediction.projection}
              </p>
            </div>
            <div className="pt-3 border-t border-white/5 text-[10px] text-indigo-300 font-mono">
              &bull; Causal Physics + Machine Learning
            </div>
          </div>

          {/* STAGE 4: RECOMMENDED ACTION */}
          <div className="rounded-2xl bg-gradient-to-b from-teal-950/40 to-[#0D1117] border border-teal-500/40 p-4 space-y-3 flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono font-black uppercase tracking-widest text-teal-300 bg-teal-950/60 px-2 py-0.5 rounded-full border border-teal-500/30">
                  STAGE 04 &bull; ACTION PLAN
                </span>
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
              </div>
              <h3 className="font-bold text-white text-xs leading-snug">
                {currentCase.stage4Action.headline}
              </h3>
              <div className="space-y-1 pt-1">
                {currentCase.stage4Action.recommendations.map((r, i) => (
                  <p key={i} className="text-[10px] text-white/80 leading-relaxed">
                    {r}
                  </p>
                ))}
              </div>
            </div>

            <button
              onClick={currentCase.stage4Action.onExecute}
              className="w-full py-2 bg-teal-500 hover:bg-teal-400 text-black font-black rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors uppercase tracking-wider shadow-lg shadow-teal-500/20 mt-2"
            >
              <span>{currentCase.stage4Action.primaryButton}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. SIMULATE CONDITIONS QUICK LEVER */}
      <div className="bg-[#0D1117]/80 border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-white text-xs uppercase tracking-wider">
              Stress-Test City Brain under Simulated Scenarios
            </h3>
          </div>
          <p className="text-xs text-white/50">
            Inject extreme weather or grid failures to watch the City Brain recompute predictions and dispatch directives in real time
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setDemoScenario("heavy_rain")}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1 transition-all uppercase tracking-wider ${
              currentScenario === "heavy_rain"
                ? "bg-amber-500 text-black border-amber-400 font-extrabold"
                : "bg-white/5 border-white/10 text-white/70 hover:text-white"
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            <span>Heavy Rain (35mm)</span>
          </button>

          <button
            onClick={() => setDemoScenario("heatwave")}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1 transition-all uppercase tracking-wider ${
              currentScenario === "heatwave"
                ? "bg-rose-500 text-black border-rose-400 font-extrabold"
                : "bg-white/5 border-white/10 text-white/70 hover:text-white"
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Heatwave (38°C)</span>
          </button>

          <button
            onClick={() => setDemoScenario("heavy_traffic")}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1 transition-all uppercase tracking-wider ${
              currentScenario === "heavy_traffic"
                ? "bg-blue-500 text-black border-blue-400 font-extrabold"
                : "bg-white/5 border-white/10 text-white/70 hover:text-white"
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>Peak Gridlock</span>
          </button>

          <button
            onClick={() => setDemoScenario("normal")}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold uppercase tracking-wider"
          >
            <span>Reset Normal</span>
          </button>
        </div>
      </div>
    </div>
  );
};
