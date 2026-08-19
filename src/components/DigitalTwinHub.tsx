import React, { useState } from "react";
import { useCity } from "../context/CityContext";
import { CityFutureTimeline } from "./CityFutureTimeline";
import { CityDNAView } from "./CityDNAView";
import { MultiAgentOrchestrator } from "./MultiAgentOrchestrator";
import { InterdependencyMap } from "./InterdependencyMap";
import { LiveCityMap } from "./LiveCityMap";
import { GlobalCitySearch } from "./GlobalCitySearch";
import { DigitalTwinMode } from "../types";
import {
  Layers,
  Sparkles,
  Compass,
  Wrench,
  BookOpen,
  Play,
  HelpCircle,
  TrendingUp,
  ShieldAlert,
  Save,
  Clock,
  History,
  Activity,
  Zap,
  Droplets,
  Wind,
  Car,
  CheckCircle2,
  Trash2,
} from "lucide-react";

export const DigitalTwinHub: React.FC = () => {
  const {
    digitalTwinMode,
    setDigitalTwinMode,
    currentZone,
    cityDNA,
    demoScenario,
    setDemoScenario,
    openExplainModal,
    setIsDecisionModalOpen,
    setIsFixCityOpen,
    setIsStoryModeOpen,
    setIs90sDemoOpen,
    decisionLogs,
    savedScenarios,
    saveScenario,
    deleteScenario,
    resetCity,
    t,
  } = useCity();

  const [activeSection, setActiveSection] = useState<"overview" | "agents" | "interdependency" | "decisions" | "saved">("overview");
  const [scenarioNameInput, setScenarioNameInput] = useState("");
  const [scenarioDescInput, setScenarioDescInput] = useState("");
  const [showSaveForm, setShowSaveForm] = useState(false);

  const twinModes: { id: DigitalTwinMode; label: string; desc: string; icon: any }[] = [
    { id: "LIVE", label: t("live", "LIVE"), desc: "Real-time IoT telemetry sync", icon: Activity },
    { id: "PREDICT", label: t("predictMode", "PREDICT"), desc: "Multi-agent future forecasts", icon: Sparkles },
    { id: "SIMULATE", label: t("simulateMode", "SIMULATE"), desc: "Interactive policy testing", icon: Compass },
    { id: "HISTORY", label: t("historyMode", "HISTORY"), desc: "Historical trend analysis", icon: History },
  ];

  const handleSaveScenario = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scenarioNameInput.trim()) return;

    saveScenario(
      scenarioNameInput.trim(),
      scenarioDescInput.trim() || `Snapshot in ${currentZone.name} under ${demoScenario} conditions.`
    );
    setScenarioNameInput("");
    setScenarioDescInput("");
    setShowSaveForm(false);
  };

  return (
    <div id="digital-twin-hub" className="space-y-5">
      {/* Top Twin Mode Bar & Global Search */}
      <div className="bg-slate-900/95 border border-cyan-500/30 rounded-2xl p-4 shadow-xl backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Mode Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 w-full md:w-auto overflow-x-auto no-scrollbar">
          {twinModes.map((mode) => {
            const IconComp = mode.icon;
            const isSelected = digitalTwinMode === mode.id;

            return (
              <button
                key={mode.id}
                id={`twin-mode-${mode.id}`}
                onClick={() => setDigitalTwinMode(mode.id)}
                className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                  isSelected
                    ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-850"
                }`}
                title={mode.desc}
              >
                <IconComp className="w-3.5 h-3.5" />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>

        {/* Global Intelligence Search */}
        <GlobalCitySearch />
      </div>

      {/* City Future Timeline */}
      <CityFutureTimeline />

      {/* Feature Navigation Bar */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar pb-1">
        <div className="flex items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800 text-xs">
          {[
            { id: "overview", label: "Living Overview", icon: Layers },
            { id: "agents", label: "9 Specialized AI Agents", icon: Sparkles },
            { id: "interdependency", label: "System Interdependency", icon: Compass },
            { id: "decisions", label: `Decision Memory (${decisionLogs.length})`, icon: History },
            { id: "saved", label: `Saved Scenarios (${savedScenarios.length})`, icon: Save },
          ].map((sec) => {
            const IconComp = sec.icon;
            const isSelected = activeSection === sec.id;

            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id as any)}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all whitespace-nowrap uppercase text-[11px] tracking-wider ${
                  isSelected
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent"
                }`}
              >
                <IconComp className="w-3.5 h-3.5" />
                <span>{sec.label}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Playbook Trigger Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            id="open-what-would-you-do-btn"
            onClick={() => setIsDecisionModalOpen(true)}
            className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>What Would You Do?</span>
          </button>

          <button
            id="open-fix-city-btn"
            onClick={() => setIsFixCityOpen(true)}
            className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Wrench className="w-3.5 h-3.5 text-emerald-400" />
            <span>Fix the City</span>
          </button>

          <button
            id="open-city-story-btn"
            onClick={() => setIsStoryModeOpen(true)}
            className="px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <BookOpen className="w-3.5 h-3.5 text-purple-400" />
            <span>Story Mode</span>
          </button>

          <button
            id="open-90s-demo-btn"
            onClick={() => setIs90sDemoOpen(true)}
            className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-lg shadow-cyan-500/20"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>90s Demo</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: Living Overview */}
      {activeSection === "overview" && (
        <div className="space-y-5">
          {/* NovaCity DNA 7-Dimensions View */}
          <CityDNAView />

          {/* Map + Explainable AI Quick Strip */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Live City Map View */}
            <div className="lg:col-span-2">
              <LiveCityMap />
            </div>

            {/* Quick "WHY IS THIS HAPPENING?" Explainable AI Panel */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-black text-white uppercase tracking-wider text-xs">
                      WHY IS THIS HAPPENING?
                    </h3>
                    <p className="text-[10px] text-slate-400">Explainable AI causal insights</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-cyan-950 text-cyan-300 border border-cyan-800/60 rounded text-[9px] font-mono">
                  ISO/IEC 42001
                </span>
              </div>

              <div className="space-y-2">
                {[
                  { key: "traffic" as const, label: "Why is traffic congested?", val: `Traffic: ${currentZone.traffic}`, icon: Car, color: "text-amber-400" },
                  { key: "aqi" as const, label: "Why is air quality at this level?", val: `AQI: ${currentZone.aqi} (${currentZone.aqiStatus})`, icon: Wind, color: "text-emerald-400" },
                  { key: "flood" as const, label: "Why is flood risk elevated?", val: `Rainfall: ${currentZone.rainfallMm}mm`, icon: Droplets, color: "text-blue-400" },
                  { key: "water" as const, label: "Why are water pressures fluctuating?", val: `Status: ${currentZone.waterStatus}`, icon: Droplets, color: "text-cyan-400" },
                  { key: "energy" as const, label: "Why is grid demand at peak?", val: `Demand: ${currentZone.energyDemandKw} kW`, icon: Zap, color: "text-yellow-400" },
                  { key: "health" as const, label: "Why is City Health Score at this value?", val: `Health: ${currentZone.healthScore}/100`, icon: Activity, color: "text-purple-400" },
                ].map((item) => (
                  <button
                    key={item.key}
                    id={`explain-btn-${item.key}`}
                    onClick={() => openExplainModal(item.key)}
                    className="w-full p-3 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800/80 hover:border-cyan-500/40 text-left transition-all flex items-center justify-between group"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
                        <span className="font-bold text-slate-200 text-xs group-hover:text-cyan-300 transition-colors">
                          {item.label}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono pl-5 block">
                        {item.val}
                      </span>
                    </div>

                    <span className="px-2 py-1 bg-slate-900 group-hover:bg-cyan-500/20 text-slate-400 group-hover:text-cyan-300 rounded text-[10px] font-bold uppercase transition-all">
                      Inspect &rarr;
                    </span>
                  </button>
                ))}
              </div>

              {/* Save Current Scenario Trigger */}
              <div className="pt-2 border-t border-slate-800">
                {!showSaveForm ? (
                  <button
                    id="trigger-save-scenario-btn"
                    onClick={() => setShowSaveForm(true)}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
                  >
                    <Save className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Save Current Digital Twin Snapshot</span>
                  </button>
                ) : (
                  <form onSubmit={handleSaveScenario} className="space-y-2 p-3 bg-slate-950 rounded-xl border border-cyan-500/30">
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                      SAVE WHAT-IF SCENARIO SNAPSHOT
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="Scenario name (e.g. Rainstorm Peak Surge)..."
                      value={scenarioNameInput}
                      onChange={(e) => setScenarioNameInput(e.target.value)}
                      className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                    <input
                      type="text"
                      placeholder="Optional notes or hypothesis..."
                      value={scenarioDescInput}
                      onChange={(e) => setScenarioDescInput(e.target.value)}
                      className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowSaveForm(false)}
                        className="px-3 py-1 text-slate-400 hover:text-white text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-xs"
                      >
                        Save Snapshot
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: 9 Specialized AI Agents */}
      {activeSection === "agents" && <MultiAgentOrchestrator />}

      {/* SECTION 3: System Interdependency */}
      {activeSection === "interdependency" && <InterdependencyMap />}

      {/* SECTION 4: Human + AI Decision Memory */}
      {activeSection === "decisions" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                <History className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-black text-white uppercase tracking-wider font-display">
                  HUMAN + AI DECISION AUDIT LOG
                </h2>
                <p className="text-[11px] text-slate-400">
                  Immutable record of municipal policy choices, AI recommendations, and simulated outcomes
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsDecisionModalOpen(true)}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider"
            >
              + New Decision Simulation
            </button>
          </div>

          {decisionLogs.length > 0 ? (
            <div className="space-y-2">
              {decisionLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1.5"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="font-bold text-white text-xs">{log.scenarioTitle}</span>
                    <span className="font-mono text-[10px] text-slate-400">{log.timestamp}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300">
                    <div>
                      <strong className="text-slate-400 text-[10px] uppercase block">Human Selection:</strong>
                      {log.selectedOptionLabel}
                    </div>
                    <div>
                      <strong className="text-cyan-400 text-[10px] uppercase block">AI Recommendation:</strong>
                      {log.aiRecommendationLabel}
                    </div>
                  </div>

                  <div className="p-2 bg-slate-900 rounded-lg border border-slate-800 text-[11px] text-emerald-400 font-mono">
                    Simulated Result: {log.simulatedResult}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-2">
              <Compass className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-slate-400 font-bold">No decisions logged yet.</p>
              <p className="text-[11px] text-slate-500">
                Launch "What Would You Do?" to evaluate an interactive dilemma and commit your choice to memory.
              </p>
              <button
                onClick={() => setIsDecisionModalOpen(true)}
                className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl font-bold text-xs"
              >
                Launch Decision Dilemma Lab
              </button>
            </div>
          )}
        </div>
      )}

      {/* SECTION 5: Saved Scenarios */}
      {activeSection === "saved" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
                <Save className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-black text-white uppercase tracking-wider font-display">
                  SAVED WHAT-IF SCENARIOS &amp; BENCHMARKS
                </h2>
                <p className="text-[11px] text-slate-400">
                  Compare saved digital twin snapshots across time horizons
                </p>
              </div>
            </div>
          </div>

          {savedScenarios.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {savedScenarios.map((sc) => (
                <div
                  key={sc.id}
                  className="p-3.5 bg-slate-950/90 border border-slate-800 rounded-xl space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">{sc.name}</span>
                      <button
                        onClick={() => deleteScenario(sc.id)}
                        className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                        title="Delete snapshot"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400 block">
                      Zone: {sc.zoneName} &bull; Condition: {sc.scenario.toUpperCase()} &bull; Horizon: {sc.timelineHorizon}
                    </span>
                    <p className="text-[11px] text-slate-300">{sc.description}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                      <span>Health: {sc.cityDNA.healthScore}/100</span>
                      <span>Mobility: {sc.cityDNA.mobility}%</span>
                    </div>
                    <button
                      onClick={() => {
                        setDemoScenario(sc.scenario);
                      }}
                      className="px-2.5 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-lg text-[10px] font-bold uppercase"
                    >
                      Load Snapshot
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-2">
              <Save className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-slate-400 font-bold">No saved snapshots yet.</p>
              <p className="text-[11px] text-slate-500">
                Use the "Save Current Snapshot" button in the Living Overview to capture simulation states.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
