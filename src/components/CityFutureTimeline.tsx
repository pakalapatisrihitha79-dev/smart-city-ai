import React from "react";
import { useCity } from "../context/CityContext";
import { TimelineHorizon } from "../types";
import { Clock, HelpCircle, Sparkles, RotateCcw, AlertTriangle } from "lucide-react";

export const CityFutureTimeline: React.FC = () => {
  const {
    timelineHorizon,
    setTimelineHorizon,
    setIsConfidenceModalOpen,
    currentScenario,
    resetCity,
  } = useCity();

  const horizons: { id: TimelineHorizon; label: string; offset: string; confidence: number }[] = [
    { id: "now", label: "NOW", offset: "Real-time IoT", confidence: 96 },
    { id: "+30m", label: "+30 MIN", offset: "+30 mins", confidence: 91 },
    { id: "+1h", label: "+1 HOUR", offset: "+60 mins", confidence: 86 },
    { id: "+3h", label: "+3 HOURS", offset: "+3 hours", confidence: 80 },
    { id: "+6h", label: "+6 HOURS", offset: "+6 hours", confidence: 75 },
    { id: "+12h", label: "+12 HOURS", offset: "+12 hours", confidence: 68 },
    { id: "+24h", label: "+24 HOURS", offset: "+24 hours", confidence: 62 },
  ];

  const currentH = horizons.find((h) => h.id === timelineHorizon) || horizons[0];

  return (
    <div
      id="city-future-timeline"
      className="bg-slate-900/95 border border-cyan-500/30 rounded-2xl p-4 shadow-xl backdrop-blur-md space-y-3"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-black tracking-wider uppercase text-slate-100 font-display">
                CITY FUTURE TIMELINE
              </h2>
              <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 tracking-wider uppercase">
                PREDICTION — NOT CERTAIN
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Deterministic predictive forecast across all 9 life-support systems
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* AI Confidence Trigger */}
          <button
            id="timeline-confidence-btn"
            onClick={() => setIsConfidenceModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/40 text-cyan-300 rounded-xl text-xs font-bold transition-colors group"
            title="Explore Why Confidence is at this level"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-12 transition-transform" />
            <span>AI Confidence: {currentH.confidence}%</span>
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400/70 ml-0.5" />
          </button>

          {timelineHorizon !== "now" && (
            <button
              id="reset-timeline-btn"
              onClick={() => setTimelineHorizon("now")}
              className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700 transition-colors"
              title="Return to real-time"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Now</span>
            </button>
          )}
        </div>
      </div>

      {/* Horizontal Horizon Bar */}
      <div className="grid grid-cols-3 sm:grid-cols-7 gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-slate-800">
        {horizons.map((h) => {
          const isActive = timelineHorizon === h.id;
          return (
            <button
              key={h.id}
              id={`timeline-step-${h.id.replace("+", "plus-")}`}
              onClick={() => setTimelineHorizon(h.id)}
              className={`py-2 px-2 rounded-lg text-center transition-all flex flex-col items-center justify-center gap-0.5 ${
                isActive
                  ? "bg-cyan-500 text-slate-950 font-black shadow-lg shadow-cyan-500/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 font-bold"
              }`}
            >
              <span className="text-xs uppercase tracking-wider">{h.label}</span>
              <span className={`text-[9px] ${isActive ? "text-slate-900 font-semibold" : "text-slate-500"}`}>
                {h.offset}
              </span>
            </button>
          );
        })}
      </div>

      {/* Predictive Scenario Impact Note */}
      <div className="flex items-center justify-between text-[11px] px-2 py-1.5 bg-slate-950/60 rounded-lg border border-slate-800/80 text-slate-400">
        <span className="flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>
            {timelineHorizon === "now"
              ? "Displaying live synchronized IoT telemetry data from 428 smart edge sensors."
              : `Predictive model active for ${currentH.label}: City physics and weather cascades simulated dynamically.`}
          </span>
        </span>
        <span className="text-[10px] text-slate-500 font-mono hidden md:inline">
          MODEL: Deterministic Multi-Agent Neural Mesh v4.2
        </span>
      </div>
    </div>
  );
};
