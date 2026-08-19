import React, { useState } from "react";
import { useCity } from "../context/CityContext";
import {
  BookOpen,
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  CloudRain,
  ShieldAlert,
  Cpu,
  UserCheck,
  CheckCircle2,
  Play,
  RotateCcw,
} from "lucide-react";

export const CityStoryModal: React.FC = () => {
  const { isStoryModeOpen, setIsStoryModeOpen, setDemoScenario, resetCity } = useCity();

  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  if (!isStoryModeOpen) return null;

  const storySteps = [
    {
      time: "05:10 PM",
      title: "ACT 1: The Equilibrium City",
      subtitle: "NovaCity operating in baseline harmony",
      scenario: "normal" as const,
      icon: CheckCircle2,
      color: "text-emerald-400",
      description:
        "Traffic velocity across Central District and Riverside is smooth. Air quality reads a pristine AQI 42. Renewable solar rooftop power meets 68% of district demand, and all 9 multi-agent neural monitors report optimal status.",
      keyMetric: "City Health: 92/100 • Traffic: Low • Flood Risk: 8%",
      learningNote: "Baseline IoT sensor synchronization across 428 edge micro-nodes.",
    },
    {
      time: "05:15 PM",
      title: "ACT 2: Sudden Convective Downpour",
      subtitle: "Heavy rainfall cell forms over northern catchment basin",
      scenario: "heavy_rain" as const,
      icon: CloudRain,
      color: "text-blue-400",
      description:
        "Weather AI detects a localized cloudburst generating 85mm/hr precipitation. Road loop detectors register sudden tire-traction deceleration, and stormwater runoff begins filling lower elevation culverts.",
      keyMetric: "Precipitation: 85mm • Road Friction: -40% • Storm Runoff: Rising",
      learningNote: "Weather AI fuses Doppler radar telemetry with physical drainage models.",
    },
    {
      time: "05:30 PM",
      title: "ACT 3: The Cascading Bottleneck",
      subtitle: "Lowland flood threat creates commuter gridlock",
      scenario: "flood_risk" as const,
      icon: ShieldAlert,
      color: "text-rose-400",
      description:
        "Zone 5 underpass drainage reaches 88% capacity ceiling. Vehicles decelerate sharply to avoid standing water, creating a 3.8 km queue propagating back onto Central Boulevard. 12,400 evening commuters face 24-minute delays.",
      keyMetric: "Flood Risk: 82% • Traffic: Congested • Commuters Impacted: 12,400",
      learningNote: "Inter-system physics: Weather impacts drainage, drainage chokes roads, roads stall transit.",
    },
    {
      time: "05:40 PM",
      title: "ACT 4: Multi-Agent Orchestration",
      subtitle: "AI response chain synthesizes combined playbook",
      scenario: "flood_risk" as const,
      icon: Cpu,
      color: "text-cyan-400",
      description:
        "CityMind Orchestrator harmonizes recommendations from Mobility AI, Water AI, and Safety AI: Divert non-essential private cars, surge elevated Metro frequency by +4 trains, activate auxiliary storm pumps, and push civic mobile advisories.",
      keyMetric: "Consensus Score: 94% • Confidence: 86% • Target Delay Reduction: -14 mins",
      learningNote: "Autonomous multi-agent consensus balances mobility, safety, and energy constraints.",
    },
    {
      time: "05:50 PM",
      title: "ACT 5: Human in the Loop & Recovery",
      subtitle: "Municipal command authorizes combined directives",
      scenario: "normal" as const,
      icon: UserCheck,
      color: "text-amber-400",
      description:
        "City operations authority approves Option E. Dynamic VMS signs redirect traffic, pumps drain the underpass in 18 minutes, and diverted commuters utilize express metro lines smoothly. City health score recovers to 89/100.",
      keyMetric: "Averted Delay: 14 mins saved per trip • Gridlock Dissipated • Zero Casualties",
      learningNote: "Explainable AI empowers human authorities with transparent, confident decision-making.",
    },
  ];

  const currentStep = storySteps[currentStepIdx];

  const handleStepChange = (idx: number) => {
    setCurrentStepIdx(idx);
    setDemoScenario(storySteps[idx].scenario);
  };

  const handleClose = () => {
    resetCity();
    setIsStoryModeOpen(false);
  };

  return (
    <div
      id="city-story-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="bg-slate-900 border border-purple-500/40 rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl space-y-5 p-6 text-slate-100 relative">
        {/* Close Button */}
        <button
          id="close-story-modal-btn"
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-xl transition-colors"
          title="Exit Story Mode"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1 pr-8">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              CITY STORY MODE
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
              ACT {currentStepIdx + 1} OF 5
            </span>
          </div>

          <h2 className="text-xl font-black tracking-tight text-white uppercase font-display">
            A DAY IN THE LIFE OF NOVACITY
          </h2>
          <p className="text-xs text-slate-400">
            Interactive narrative walkthrough of multi-system causality and AI response
          </p>
        </div>

        {/* Step Indicator Progress Bar */}
        <div className="grid grid-cols-5 gap-1.5 p-1.5 bg-slate-950/80 rounded-xl border border-slate-800">
          {storySteps.map((step, idx) => (
            <button
              key={idx}
              onClick={() => handleStepChange(idx)}
              className={`p-2 rounded-lg text-center transition-all ${
                currentStepIdx === idx
                  ? "bg-purple-600 text-white font-black shadow-md shadow-purple-600/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 font-bold"
              }`}
            >
              <span className="text-[10px] block uppercase font-mono">{step.time}</span>
              <span className="text-[11px] block truncate">Act {idx + 1}</span>
            </button>
          ))}
        </div>

        {/* Main Narrative Card */}
        <div className="p-5 bg-slate-950/90 border border-purple-500/30 rounded-2xl space-y-4 shadow-xl">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center shrink-0">
                <currentStep.icon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-mono text-purple-400 font-bold">
                  {currentStep.time} &bull; {currentStep.subtitle}
                </span>
                <h3 className="text-lg font-black text-white">{currentStep.title}</h3>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300">
              Scenario: {currentStep.scenario.toUpperCase()}
            </span>
          </div>

          <p className="text-xs text-slate-200 leading-relaxed">{currentStep.description}</p>

          {/* Metric Bar */}
          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center justify-between text-xs flex-wrap gap-2">
            <span className="font-mono text-cyan-300 font-bold">{currentStep.keyMetric}</span>
            <span className="text-[10px] text-slate-400 font-mono">Status Verified</span>
          </div>

          {/* Architectural Note */}
          <div className="p-3 bg-purple-950/30 rounded-xl border border-purple-500/20 text-[11px] text-purple-200/90 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
            <span>
              <strong>Engineering Insight:</strong> {currentStep.learningNote}
            </span>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <button
            disabled={currentStepIdx === 0}
            onClick={() => handleStepChange(currentStepIdx - 1)}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
              currentStepIdx === 0
                ? "text-slate-600 cursor-not-allowed"
                : "text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Act</span>
          </button>

          {currentStepIdx < storySteps.length - 1 ? (
            <button
              onClick={() => handleStepChange(currentStepIdx + 1)}
              className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-black text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-lg shadow-purple-600/20"
            >
              <span>Next Act</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleClose}
              className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-lg shadow-emerald-500/20"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Complete Story Experience</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
