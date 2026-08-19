import React from "react";
import { useCity } from "../context/CityContext";
import { getConfidenceBreakdown } from "../utils/cityEngine";
import {
  Sparkles,
  X,
  ShieldCheck,
  AlertTriangle,
  Database,
  Layers,
  Cpu,
  HelpCircle,
  TrendingDown,
} from "lucide-react";

export const AIConfidenceModal: React.FC = () => {
  const {
    isConfidenceModalOpen,
    setIsConfidenceModalOpen,
    currentZone,
    demoScenario,
    timelineHorizon,
  } = useCity();

  if (!isConfidenceModalOpen) return null;

  const confidenceData = getConfidenceBreakdown(currentZone, demoScenario, timelineHorizon);

  return (
    <div
      id="confidence-explorer-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl space-y-5 p-6 text-slate-100 relative">
        {/* Close Button */}
        <button
          id="close-confidence-modal-btn"
          onClick={() => setIsConfidenceModalOpen(false)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-xl transition-colors"
          title="Close Confidence Explorer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1 pr-8">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              CONFIDENCE EXPLAINER
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/30">
              SIMULATED PROBABILITY
            </span>
          </div>

          <h2 className="text-lg font-black tracking-tight text-white uppercase font-display flex items-center gap-2">
            WHY {confidenceData.totalPct}% AI CONFIDENCE?
          </h2>
          <p className="text-xs text-slate-400">
            Factor weighting and telemetry reliability for <strong className="text-slate-200">{currentZone.name}</strong>
          </p>
        </div>

        {/* Big Score Visual */}
        <div className="p-4 bg-cyan-950/40 border border-cyan-500/30 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-400 block">
              COMPOSITE PREDICTION CONFIDENCE
            </span>
            <span className="text-3xl font-black text-white">{confidenceData.totalPct}%</span>
            <span className="text-xs text-slate-300 ml-2">High Predictability Index</span>
          </div>

          <div className="text-right text-[11px] text-slate-400">
            <span className="block font-mono text-cyan-300">{confidenceData.dataFreshness}</span>
            <span className="text-[10px] text-slate-500">{confidenceData.modelReliability}</span>
          </div>
        </div>

        {/* Factor Breakdown Weights */}
        <div className="space-y-2.5">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            CONFIDENCE FACTOR CONTRIBUTIONS
          </span>

          <div className="space-y-2">
            {confidenceData.factors.map((f, i) => (
              <div key={i} className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200">{f.label}</span>
                  <span className="font-mono text-cyan-400 font-bold">{f.pct}% Weight</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-cyan-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${f.pct * 2.5}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400">{f.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* What Could Reduce Confidence? */}
        <div className="p-3.5 bg-slate-950/90 border border-amber-500/20 rounded-xl space-y-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            WHAT COULD REDUCE CONFIDENCE?
          </span>

          <ul className="text-xs text-slate-300 space-y-1.5">
            {confidenceData.risks.map((r, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <TrendingDown className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-800">
          <span className="flex items-center gap-1 text-[10px]">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            Calibrated on 14,000+ historical urban scenarios
          </span>
          <button
            onClick={() => setIsConfidenceModalOpen(false)}
            className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
