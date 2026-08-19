import React, { useState } from "react";
import { useCity } from "../context/CityContext";
import {
  Share2,
  Users,
  Car,
  CloudRain,
  Wind,
  Droplets,
  Zap,
  Trash2,
  Building2,
  Bus,
  Cpu,
  ArrowRight,
  ArrowDown,
  Sparkles,
  HelpCircle,
} from "lucide-react";

export const InterdependencyMap: React.FC = () => {
  const { currentZone, demoScenario } = useCity();

  const [selectedNodeId, setSelectedNodeId] = useState<string>("weather");

  const nodes = [
    {
      id: "weather",
      label: "WEATHER",
      icon: CloudRain,
      color: "text-blue-400 border-blue-500/40 bg-blue-950/40",
      status: currentZone.rainfallMm > 20 ? `Heavy Rain (${currentZone.rainfallMm}mm)` : "Stable / Clear",
      affects: ["Road friction & braking distance", "Lowland flood probability", "Commuter modal preference", "Plaza PM2.5 dispersion"],
      affectedBy: ["Convective atmospheric pressure cells", "Regional monsoon wind patterns", "Urban heat island temperature"],
      insight: "Precipitation directly cascades into flood risk, reducing road speeds and shifting citizens toward transit.",
    },
    {
      id: "roads",
      label: "ROADS & BRIDGES",
      icon: Building2,
      color: "text-slate-300 border-slate-600 bg-slate-900/60",
      status: "Surface intact • Signal cycle 60s",
      affects: ["Traffic flow velocity", "Transit bus headway adherence", "Emergency vehicle response time"],
      affectedBy: ["Weather (water accumulation)", "Vehicle load density", "Pothole / construction lane closures"],
      insight: "Road saturation creates exponential bottleneck delay curves across intersections.",
    },
    {
      id: "traffic",
      label: "TRAFFIC DENSITY",
      icon: Car,
      color: "text-amber-400 border-amber-500/40 bg-amber-950/40",
      status: `Density: ${currentZone.traffic}`,
      affects: ["Citizen travel time", "Tailpipe PM2.5 emissions", "Public transit delays", "Substation corridor lighting load"],
      affectedBy: ["Weather precipitation", "Citizen trip scheduling", "Road bottlenecks", "Public transport fares & reliability"],
      insight: "Congestion idles engines, multiplying local air pollution and citizen commuter delay.",
    },
    {
      id: "transport",
      label: "PUBLIC TRANSPORT",
      icon: Bus,
      color: "text-emerald-400 border-emerald-500/40 bg-emerald-950/40",
      status: "Metro Line 1: Active • Bus Fleet: 94%",
      affects: ["Road vehicular load reduction", "Carbon footprint mitigation", "Citizen mobility equity"],
      affectedBy: ["Road traffic along bus lanes", "Weather flooding at ground stations", "Power grid stability"],
      insight: "Surging metro capacity absorbs private car demand, directly relieving road congestion.",
    },
    {
      id: "citizens",
      label: "CITIZENS & COMMUTERS",
      icon: Users,
      color: "text-purple-400 border-purple-500/40 bg-purple-950/40",
      status: "12,400 active commute trips",
      affects: ["Traffic demand volume", "Water consumption draw", "Peak electricity demand", "Civic issue reporting"],
      affectedBy: ["Travel delays", "Air quality health index", "Weather advisories", "Public transport availability"],
      insight: "Citizen behavioral decisions react directly to AI advisories, weather warnings, and transit convenience.",
    },
    {
      id: "air",
      label: "AIR QUALITY",
      icon: Wind,
      color: "text-teal-400 border-teal-500/40 bg-teal-950/40",
      status: `AQI ${currentZone.aqi} (${currentZone.aqiStatus})`,
      affects: ["Citizen respiratory safety", "Outdoor recreation advisories", "City health vitality index"],
      affectedBy: ["Traffic vehicle idling", "Industrial factory stack emissions", "Wind speed & dispersion"],
      insight: "Air quality reflects the synchronized equilibrium of transport emissions and weather dispersion.",
    },
    {
      id: "water",
      label: "WATER & DRAINAGE",
      icon: Droplets,
      color: "text-cyan-400 border-cyan-500/40 bg-cyan-950/40",
      status: `Status: ${currentZone.waterStatus}`,
      affects: ["Flood mitigation readiness", "Residential water supply", "Commercial sanitation"],
      affectedBy: ["Weather storm runoff volume", "Sub-surface pipe pressure integrity", "Citizen consumption habits"],
      insight: "Smart acoustic valves detect sub-surface fissures before pressure collapse reaches citizens.",
    },
    {
      id: "energy",
      label: "ENERGY GRID",
      icon: Zap,
      color: "text-yellow-400 border-yellow-500/40 bg-yellow-950/40",
      status: `Demand: ${currentZone.energyDemandKw} kW (${currentZone.energyPeakStatus})`,
      affects: ["Water pumping stations", "Electric metro train traction", "Traffic signal controllers", "Hospital resilience"],
      affectedBy: ["HVAC cooling ambient temperature draw", "Renewable solar generation", "Industrial shift cycles"],
      insight: "Grid stability provides the foundational power for water pumps, traffic signals, and electric transit.",
    },
    {
      id: "waste",
      label: "WASTE & SANITATION",
      icon: Trash2,
      color: "text-orange-400 border-orange-500/40 bg-orange-950/40",
      status: `Fill: ${currentZone.wasteLevel}`,
      affects: ["Drainage grate blockage risk", "Urban aesthetics & hygiene", "Methane emissions"],
      affectedBy: ["Citizen disposal rates", "Dynamic routing collection trucks", "Commercial sector activity"],
      insight: "Uncollected street waste clogs drainage culverts during sudden downpours, worsening flood risk.",
    },
    {
      id: "ai",
      label: "CITYMIND AI ORCHESTRATOR",
      icon: Cpu,
      color: "text-cyan-300 border-cyan-400 bg-cyan-950/80",
      status: "Synthesizing 428 edge streams",
      affects: ["Dynamic signal timings", "Emergency pump dispatch", "Transit frequency surge", "Citizen push advisories"],
      affectedBy: ["All 9 life-support system IoT sensor telemetry feeds"],
      insight: "CityMind balances multi-system trade-offs in real time, delivering explainable decision support.",
    },
  ];

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  return (
    <div
      id="interdependency-map"
      className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 text-xs"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
            <Share2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black text-white uppercase tracking-wider font-display">
                HOW THE CITY CONNECTS — INTERDEPENDENCY MAP
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                10 LINKED SYSTEMS
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Living causal graph showing how weather, utilities, roads, transit, and AI interact
            </p>
          </div>
        </div>

        <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
          Tap any system node to inspect relationships
        </span>
      </div>

      {/* Node Grid Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {nodes.map((node) => {
          const IconComp = node.icon;
          const isSelected = selectedNodeId === node.id;

          return (
            <button
              key={node.id}
              id={`interdep-node-${node.id}`}
              onClick={() => setSelectedNodeId(node.id)}
              className={`p-2.5 rounded-xl border text-left transition-all space-y-1 ${
                isSelected
                  ? `${node.color} ring-2 ring-cyan-400/50 shadow-lg`
                  : "bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <IconComp className="w-4 h-4 shrink-0" />
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />}
              </div>
              <span className="text-[11px] font-black block uppercase tracking-wider truncate">
                {node.label}
              </span>
              <span className="text-[9px] text-slate-400 block truncate font-mono">
                {node.status}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Node Relationship Detail Card */}
      <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <selectedNode.icon className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              {selectedNode.label} RELATIONSHIP PROFILE
            </h3>
          </div>
          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300">
            Live Status: {selectedNode.status}
          </span>
        </div>

        {/* Insight Note */}
        <p className="text-xs text-slate-200 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
          <strong className="text-cyan-300">System Dynamic: </strong>
          {selectedNode.insight}
        </p>

        {/* Two Columns: What it Affects vs What Affects It */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* What It Affects */}
          <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800 space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1">
              <ArrowRight className="w-3.5 h-3.5" />
              WHAT IT AFFECTS (DOWNSTREAM CASCADE)
            </span>
            <ul className="text-[11px] text-slate-300 space-y-1">
              {selectedNode.affects.map((item, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-emerald-400">&bull;</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* What Affects It */}
          <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800 space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              WHAT AFFECTS IT (UPSTREAM DRIVERS)
            </span>
            <ul className="text-[11px] text-slate-300 space-y-1">
              {selectedNode.affectedBy.map((item, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-cyan-400">&bull;</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
