import React, { useState } from "react";
import { useCity } from "../context/CityContext";
import {
  Siren,
  ShieldAlert,
  Navigation,
  Sparkles,
  Play,
  CheckCircle2,
  Building2,
  Clock,
  Radio,
  Zap,
  MapPin,
  Flame,
  Activity,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

export const EmergencyResponseOptimizer: React.FC = () => {
  const { allZones, currentZone } = useCity();

  const [selectedIncident, setSelectedIncident] = useState<string>("cardiac_zone4");
  const [simStep, setSimStep] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const incidents = [
    {
      id: "cardiac_zone4",
      title: "Critical Cardiac Trauma Emergency",
      location: "Zone 4 (Lowland Commercial Plaza)",
      severity: "CRITICAL (Priority 1)",
      facility: "City General Trauma Hospital (2.8 km)",
      unit: "Advanced Life Support Unit #7",
      standardRouteTimeMins: 11.4,
      aiOptimizedTimeMins: 4.8,
      intersectionsPreempted: 4,
      congestionSavingsPct: 58,
      details: "Patient experiencing acute cardiac distress. Rapid transit to catheterization lab required.",
    },
    {
      id: "fire_zone6",
      title: "Commercial Warehouse Structural Fire",
      location: "Zone 6 (East Railway & Logistics)",
      severity: "CODE RED (Multi-Unit Dispatch)",
      facility: "Station 4 Heavy Rescue & Hazmat",
      unit: "Engine #4 + Snorkel Tender #2",
      standardRouteTimeMins: 14.2,
      aiOptimizedTimeMins: 6.1,
      intersectionsPreempted: 6,
      congestionSavingsPct: 57,
      details: "Plume detected near railway goods siding. AI automatically isolates adjacent industrial gas valves.",
    },
    {
      id: "accident_harbor",
      title: "Multi-Vehicle Collision on Harbor Expressway",
      location: "Zone 7 (Harbor Freight Corridor)",
      severity: "CRITICAL (Hazardous Spillage)",
      facility: "Harbor Emergency Trauma Hub (3.4 km)",
      unit: "Paramedic Rescue #3 + Hazmat Containment",
      standardRouteTimeMins: 16.0,
      aiOptimizedTimeMins: 7.2,
      intersectionsPreempted: 5,
      congestionSavingsPct: 55,
      details: "Two freight trucks involved. AI activates automated contraflow lane for oncoming emergency vehicles.",
    },
  ];

  const currentInc = incidents.find((i) => i.id === selectedIncident) || incidents[0];

  const startSimulation = () => {
    setIsSimulating(true);
    setSimStep(1);

    const timer1 = setTimeout(() => setSimStep(2), 1000);
    const timer2 = setTimeout(() => setSimStep(3), 2200);
    const timer3 = setTimeout(() => setSimStep(4), 3600);
    const timer4 = setTimeout(() => {
      setSimStep(5);
      setIsSimulating(false);
    }, 5000);
  };

  const resetSimulation = () => {
    setSimStep(0);
    setIsSimulating(false);
  };

  return (
    <div className="bg-[#0D1117]/95 border border-rose-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5 text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
            <Siren className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black text-white uppercase tracking-wider font-display">
                Emergency Response Optimizer <span className="text-rose-400">&bull; Green-Wave Corridor AI</span>
              </h2>
              <span className="text-[9px] font-mono font-bold bg-rose-950 text-rose-300 px-2 py-0.5 rounded-full border border-rose-500/40">
                REAL-TIME TRAFFIC PREEMPTION
              </span>
            </div>
            <p className="text-xs text-white/50">
              Dispatches nearest units, pre-empts traffic signals & opens dynamic contraflow corridors
            </p>
          </div>
        </div>

        {/* Incident Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-white/50 uppercase font-bold">Scenario:</span>
          <select
            value={selectedIncident}
            onChange={(e) => {
              setSelectedIncident(e.target.value);
              resetSimulation();
            }}
            className="bg-[#0D1117] border border-white/20 rounded-xl px-3 py-1.5 text-xs font-bold text-white outline-none focus:border-rose-400"
          >
            {incidents.map((inc) => (
              <option key={inc.id} value={inc.id}>
                {inc.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ACTIVE INCIDENT PROFILE & COMPARATIVE ETA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Incident Summary */}
        <div className="bg-black/40 p-4 rounded-2xl border border-white/10 space-y-2 md:col-span-1">
          <span className="text-[9px] font-mono uppercase font-bold text-rose-400 block">
            Incident Telemetry
          </span>
          <h3 className="font-extrabold text-white text-sm leading-snug">{currentInc.title}</h3>
          <div className="text-white/60 text-xs space-y-1">
            <div className="flex items-center gap-1 text-rose-300 font-mono text-[11px]">
              <MapPin className="w-3 h-3 text-rose-400" />
              <span>{currentInc.location}</span>
            </div>
            <div className="flex items-center gap-1 text-teal-300 font-mono text-[11px]">
              <Building2 className="w-3 h-3 text-teal-400" />
              <span>{currentInc.facility}</span>
            </div>
            <div className="flex items-center gap-1 text-amber-300 font-mono text-[11px]">
              <Radio className="w-3 h-3 text-amber-400" />
              <span>Assigned: {currentInc.unit}</span>
            </div>
          </div>
          <p className="text-white/70 text-[11px] pt-1 leading-relaxed">{currentInc.details}</p>
        </div>

        {/* Route Comparison Side-by-Side */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Standard Route */}
          <div className="bg-[#0D1117] p-4 rounded-2xl border border-white/10 space-y-2">
            <span className="text-[10px] font-mono text-white/50 uppercase font-bold block">
              Standard GPS Navigation
            </span>
            <div className="text-2xl font-black text-white/80 font-mono">
              {currentInc.standardRouteTimeMins} mins
            </div>
            <p className="text-[11px] text-white/50 leading-relaxed">
              Subject to standard traffic congestion, 4 red light stop-cycles, and bottleneck at Central Flyover.
            </p>
            <div className="text-[10px] font-mono text-rose-400 font-bold">
              &bull; Average Speed: 18 km/h
            </div>
          </div>

          {/* AI Green-Wave Route */}
          <div className="bg-gradient-to-br from-rose-950/40 via-[#111C2B] to-emerald-950/40 p-4 rounded-2xl border border-rose-500/50 space-y-2 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-rose-400 uppercase font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                CityMind AI Optimized Route
              </span>
              <span className="text-[9px] font-mono bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/40 font-bold">
                -{currentInc.congestionSavingsPct}% TRANSIT TIME
              </span>
            </div>
            <div className="text-3xl font-black text-emerald-400 font-mono">
              {currentInc.aiOptimizedTimeMins} mins
            </div>
            <p className="text-[11px] text-white/90 leading-relaxed">
              AI pre-empts {currentInc.intersectionsPreempted} traffic signals into continuous green corridor and opens dedicated bus contraflow lane.
            </p>
            <div className="text-[10px] font-mono text-emerald-300 font-bold">
              &bull; Average Speed: 52 km/h (Continuous Wave)
            </div>
          </div>
        </div>
      </div>

      {/* INTERACTIVE MULTI-STAGE SIMULATION ENGINE */}
      <div className="bg-black/50 border border-white/10 p-4 sm:p-5 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div>
            <span className="font-extrabold text-white text-xs sm:text-sm uppercase tracking-wider block">
              Interactive Emergency Dispatch Simulator
            </span>
            <span className="text-white/50 text-[11px]">
              Experience real-time AI signal preemption, corridor clearance, and arrival telemetry
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={startSimulation}
              disabled={isSimulating}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-extrabold rounded-xl text-xs flex items-center gap-2 transition-all shadow-lg shadow-rose-600/20 uppercase tracking-wider disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{isSimulating ? "Simulating Dispatch..." : "Run AI Dispatch Simulation"}</span>
            </button>
            <button
              onClick={resetSimulation}
              className="p-2 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-xl border border-white/10"
              title="Reset Simulation"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 5-Stage Live Timeline */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
          {[
            {
              step: 1,
              title: "1. Incident Ingest",
              desc: "CAD & IoT automated alarm trigger",
              status: simStep >= 1 ? "ACTIVE" : "PENDING",
            },
            {
              step: 2,
              title: "2. Nearest Unit Assign",
              desc: `${currentInc.unit} dispatched`,
              status: simStep >= 2 ? "ACTIVE" : "PENDING",
            },
            {
              step: 3,
              title: "3. Signal Preemption",
              desc: `${currentInc.intersectionsPreempted} signals turned green`,
              status: simStep >= 3 ? "ACTIVE" : "PENDING",
            },
            {
              step: 4,
              title: "4. Transit Contraflow",
              desc: "Dynamic lane clearance",
              status: simStep >= 4 ? "ACTIVE" : "PENDING",
            },
            {
              step: 5,
              title: "5. On-Scene Arrival",
              desc: `ETA ${currentInc.aiOptimizedTimeMins}m achieved`,
              status: simStep >= 5 ? "ACTIVE" : "PENDING",
            },
          ].map((st) => (
            <div
              key={st.step}
              className={`p-3 rounded-xl border transition-all space-y-1 ${
                simStep === st.step
                  ? "bg-rose-950/60 border-rose-400 text-white ring-1 ring-rose-400/40"
                  : simStep > st.step
                  ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-200"
                  : "bg-[#0D1117] border-white/5 text-white/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-[11px] uppercase tracking-wider">{st.title}</span>
                {simStep > st.step && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
              </div>
              <p className="text-[10px] leading-snug">{st.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
