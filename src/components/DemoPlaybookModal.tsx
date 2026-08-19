import React, { useState, useEffect } from "react";
import { useCity } from "../context/CityContext";
import { DemoScenarioType } from "../types";
import {
  Compass,
  X,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  CheckCircle2,
  Sparkles,
  ShieldAlert,
  Clock,
  ArrowRight,
} from "lucide-react";

export const DemoPlaybookModal: React.FC = () => {
  const { is90sDemoOpen, setIs90sDemoOpen, setDemoScenario, resetCity } = useCity();

  const [seconds, setSeconds] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const segments = [
    { start: 0, end: 15, title: "01: Normal City Baseline", scenario: "normal" as DemoScenarioType, note: "Highlighting equilibrium across all 9 life-support systems." },
    { start: 15, end: 30, title: "02: Heavy Rain Trigger", scenario: "heavy_rain" as DemoScenarioType, note: "Doppler radar triggers 85mm convective storm cell." },
    { start: 30, end: 45, title: "03: Lowland Flood & Road Submergence", scenario: "flood_risk" as DemoScenarioType, note: "Zone 5 underpass reaches critical drainage ceiling." },
    { start: 45, end: 60, title: "04: Cascading Congestion Surge", scenario: "heavy_traffic" as DemoScenarioType, note: "Gridlock propagates backward along arterial routes." },
    { start: 60, end: 70, title: "05: Multi-Agent AI Response", scenario: "flood_risk" as DemoScenarioType, note: "Orchestrator synthesizes combined multi-corridor directives." },
    { start: 70, end: 80, title: "06: What Would You Do? Policy Lab", scenario: "flood_risk" as DemoScenarioType, note: "Human authority tests Option E simulation vs Option A." },
    { start: 80, end: 90, title: "07: Resolution & City Recovery", scenario: "normal" as DemoScenarioType, note: "Pumps engage, transit surges, and city health restores to 91/100." },
  ];

  // Active Segment
  const currentSegment = segments.find((s) => seconds >= s.start && seconds < s.end) || segments[segments.length - 1];

  // Sync scenario with timer
  useEffect(() => {
    if (!is90sDemoOpen) return;

    if (currentSegment) {
      setDemoScenario(currentSegment.scenario);
    }
  }, [seconds, is90sDemoOpen]);

  // Timer Tick
  useEffect(() => {
    if (!is90sDemoOpen || !isPlaying) return;

    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev >= 90) {
          setIsPlaying(false);
          return 90;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [is90sDemoOpen, isPlaying]);

  if (!is90sDemoOpen) return null;

  const handleSkipNext = () => {
    const nextSeg = segments.find((s) => s.start > seconds);
    if (nextSeg) {
      setSeconds(nextSeg.start);
    } else {
      setSeconds(90);
    }
  };

  const handleRestart = () => {
    setSeconds(0);
    setIsPlaying(true);
    setDemoScenario("normal");
  };

  const handleClose = () => {
    resetCity();
    setIs90sDemoOpen(false);
  };

  const progressPct = Math.min(100, Math.round((seconds / 90) * 100));

  return (
    <div
      id="demo-playbook-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="bg-slate-900 border border-amber-500/40 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl space-y-5 p-6 text-slate-100 relative">
        {/* Close Button */}
        <button
          id="close-playbook-modal-btn"
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-xl transition-colors"
          title="Exit 90-Second Demo"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1 pr-8">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5" />
              90-SECOND DEMO PLAYBOOK
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
              {seconds}s / 90s ({progressPct}%)
            </span>
          </div>

          <h2 className="text-xl font-black tracking-tight text-white uppercase font-display">
            AUTOMATED HACKATHON PRESENTATION
          </h2>
          <p className="text-xs text-slate-400">
            Self-running demonstration showing real-time multi-system cascade and recovery
          </p>
        </div>

        {/* Global Progress Bar */}
        <div className="space-y-1.5">
          <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
            <div
              className="bg-amber-400 h-full rounded-full transition-all duration-300 shadow-sm shadow-amber-500/40"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>00:00 START</span>
            <span>00:45 MIDPOINT</span>
            <span>01:30 COMPLETE</span>
          </div>
        </div>

        {/* Current Active Segment Card */}
        <div className="p-4 bg-slate-950/90 border border-amber-500/30 rounded-xl space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 font-mono">
              ACTIVE STAGE ({currentSegment.start}s - {currentSegment.end}s)
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-950 text-amber-300 border border-amber-800">
              SCENARIO: {currentSegment.scenario}
            </span>
          </div>

          <h3 className="text-lg font-black text-white">{currentSegment.title}</h3>
          <p className="text-xs text-slate-300">{currentSegment.note}</p>

          <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Background map and all telemetry metrics are synchronized to this stage in real-time.
            </span>
          </div>
        </div>

        {/* Segment Timeline List */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            DEMO AGENDA
          </span>
          <div className="space-y-1 max-h-44 overflow-y-auto pr-1">
            {segments.map((seg, idx) => {
              const isCurrent = currentSegment.start === seg.start;
              const isPast = seconds >= seg.end;

              return (
                <div
                  key={idx}
                  onClick={() => setSeconds(seg.start)}
                  className={`p-2 rounded-lg border flex items-center justify-between text-xs cursor-pointer transition-all ${
                    isCurrent
                      ? "bg-amber-950/40 border-amber-400/80 text-amber-200 font-bold"
                      : isPast
                      ? "bg-slate-950/40 border-slate-800 text-slate-500"
                      : "bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-slate-400">{seg.start}s</span>
                    <span>{seg.title}</span>
                  </div>
                  {isCurrent && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Player Controls Bar */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-lg shadow-amber-500/20"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlaying ? "PAUSE" : "PLAY"}</span>
            </button>

            <button
              onClick={handleSkipNext}
              className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
              title="Skip to next segment"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            <button
              onClick={handleRestart}
              className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
              title="Restart 90s Demo"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleClose}
            className="px-4 py-2 text-slate-400 hover:text-slate-200 text-xs font-bold transition-colors"
          >
            Exit Playbook
          </button>
        </div>
      </div>
    </div>
  );
};
