import React from "react";
import { useCity } from "../context/CityContext";
import { getCauseEffectDetail } from "../utils/cityEngine";
import {
  HelpCircle,
  X,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Database,
  ArrowRight,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

export const ExplainableAIModal: React.FC = () => {
  const { explainableMetric, closeExplainModal, currentZone, demoScenario } = useCity();

  if (!explainableMetric) return null;

  const detail = getCauseEffectDetail(explainableMetric, currentZone, demoScenario);

  return (
    <div
      id="explainable-ai-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl space-y-5 p-6 text-slate-100 relative">
        {/* Close Button */}
        <button
          id="close-explain-modal-btn"
          onClick={closeExplainModal}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-xl transition-colors"
          title="Close Explainable AI"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1.5 pr-8">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              EXPLAINABLE AI ENGINE
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
              STATUS: {detail.dataStatus}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/30">
              PREDICTION, NOT CERTAINTY
            </span>
          </div>

          <h2 className="text-lg font-black tracking-tight text-white uppercase font-display flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-cyan-400 shrink-0" />
            {detail.title}
          </h2>
          <p className="text-xs text-slate-400">
            AI reasoning breakdown and causal path for <strong className="text-slate-200">{currentZone.name}</strong>
          </p>
        </div>

        {/* Plain Language Summary */}
        <div className="p-4 bg-cyan-950/40 border border-cyan-500/30 rounded-xl space-y-1.5">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5" />
            PRIMARY EXPLANATION
          </span>
          <p className="text-xs text-slate-200 leading-relaxed">{detail.whyExplanation}</p>
        </div>

        {/* Causal Chain Graph */}
        <div className="space-y-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
            CITY CAUSE &rarr; EFFECT CHAIN
          </span>
          <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-950/80 rounded-xl border border-slate-800">
            {detail.chain.map((step, idx) => (
              <React.Fragment key={idx}>
                <div className="px-3 py-1.5 bg-slate-800/90 text-slate-200 font-bold text-xs rounded-lg border border-slate-700/80 shadow-sm">
                  {step}
                </div>
                {idx < detail.chain.length - 1 && (
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Contributing Factors Breakdown Table */}
        <div className="space-y-2.5">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
            CONTRIBUTING FACTORS &amp; INTERVENTIONS
          </span>
          <div className="space-y-2">
            {detail.factors.map((factor, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-slate-950/90 border border-slate-800 rounded-xl space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-100 flex items-center gap-1.5">
                    {factor.trend === "up" ? (
                      <TrendingUp className="w-4 h-4 text-rose-400" />
                    ) : factor.trend === "down" ? (
                      <TrendingDown className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Minus className="w-4 h-4 text-slate-400" />
                    )}
                    {factor.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-300">
                      Observed: {factor.observed}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-cyan-950 text-[10px] font-mono text-cyan-300 border border-cyan-800/60">
                      Predicted: {factor.predicted}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-800/80">
                  <div className="text-slate-400">
                    <strong className="text-slate-300 block text-[10px] uppercase tracking-wider">
                      Contributing Factor:
                    </strong>
                    {factor.contributingFactor}
                  </div>
                  <div className="text-emerald-400/90">
                    <strong className="text-emerald-300 block text-[10px] uppercase tracking-wider">
                      Possible Intervention:
                    </strong>
                    {factor.possibleIntervention}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Inputs & Governance Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* Data Used */}
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Database className="w-3 h-3 text-cyan-400" />
              DATA USED
            </span>
            <ul className="text-[11px] text-slate-300 space-y-1">
              {detail.dataUsed.map((d, i) => (
                <li key={i} className="flex items-start gap-1">
                  <span className="text-cyan-400">&bull;</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* What Could Change It */}
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-amber-400" />
              WHAT COULD CHANGE IT
            </span>
            <ul className="text-[11px] text-slate-300 space-y-1">
              {detail.whatCouldChangeIt.map((w, i) => (
                <li key={i} className="flex items-start gap-1">
                  <span className="text-amber-400">&bull;</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* What Can Be Done */}
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              RECOMMENDED ACTIONS
            </span>
            <ul className="text-[11px] text-slate-300 space-y-1">
              {detail.whatCanBeDone.map((a, i) => (
                <li key={i} className="flex items-start gap-1">
                  <span className="text-emerald-400">&bull;</span>
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Disclaimer */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-800">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            Explainable AI transparency compliance standard ISO/IEC 42001
          </span>
          <button
            onClick={closeExplainModal}
            className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
