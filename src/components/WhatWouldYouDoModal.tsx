import React, { useState } from "react";
import { useCity } from "../context/CityContext";
import { getDecisionScenario } from "../utils/cityEngine";
import { DecisionOption } from "../types";
import {
  Sparkles,
  X,
  Compass,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Award,
  ArrowRight,
  ShieldAlert,
  Save,
  Check,
} from "lucide-react";

export const WhatWouldYouDoModal: React.FC = () => {
  const {
    isDecisionModalOpen,
    setIsDecisionModalOpen,
    currentZone,
    demoScenario,
    addDecisionLog,
  } = useCity();

  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isDecisionModalOpen) return null;

  const scenario = getDecisionScenario(demoScenario, currentZone);
  const activeOption = scenario.options.find((o) => o.id === selectedOptionId) || null;
  const aiOption = scenario.options.find((o) => o.id === scenario.aiRecommendationId) || scenario.options[scenario.options.length - 1];

  const handleConfirmDecision = () => {
    if (!activeOption) return;

    addDecisionLog({
      scenarioTitle: scenario.title,
      selectedOptionLabel: activeOption.label,
      aiRecommendationLabel: aiOption.label,
      humanChoice: activeOption.id === aiOption.id ? "Aligned with AI Recommendation" : "Custom Human Discretion",
      simulatedResult: `Traffic ${activeOption.simulatedOutcome.trafficDiffPct > 0 ? "+" : ""}${activeOption.simulatedOutcome.trafficDiffPct}%, Delay ${activeOption.simulatedOutcome.delayDiffPct > 0 ? "+" : ""}${activeOption.simulatedOutcome.delayDiffPct}%, Safety ${activeOption.simulatedOutcome.safetyRiskDiffPct > 0 ? "+" : ""}${activeOption.simulatedOutcome.safetyRiskDiffPct}%`,
      impactSummary: activeOption.description,
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsDecisionModalOpen(false);
    }, 1800);
  };

  return (
    <div
      id="what-would-you-do-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="bg-slate-900 border border-amber-500/40 rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl space-y-5 p-6 text-slate-100 relative">
        {/* Close Button */}
        <button
          id="close-decision-modal-btn"
          onClick={() => setIsDecisionModalOpen(false)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-xl transition-colors"
          title="Close Decision Lab"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1.5 pr-8">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5" />
              INTERACTIVE CIVIC DILEMMA
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
              SIMULATED POLICY LAB
            </span>
          </div>

          <h2 className="text-xl font-black tracking-tight text-white uppercase font-display">
            {scenario.title}
          </h2>
          <p className="text-xs text-slate-400">
            Location: <strong className="text-slate-200">{scenario.location}</strong> &bull; Citizen Impact: 12,400+ commuters
          </p>
        </div>

        {/* Situation Briefing */}
        <div className="p-4 bg-amber-950/30 border border-amber-500/30 rounded-xl space-y-1.5">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5" />
            CURRENT SITUATION BRIEFING
          </span>
          <p className="text-xs text-slate-200 leading-relaxed">{scenario.situation}</p>
        </div>

        {/* Selectable Decision Options */}
        <div className="space-y-2.5">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
            CHOOSE YOUR INTERVENTION STRATEGY
          </span>

          <div className="space-y-2">
            {scenario.options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              const isAi = opt.id === scenario.aiRecommendationId;

              return (
                <div
                  key={opt.id}
                  id={`decision-option-${opt.id}`}
                  onClick={() => setSelectedOptionId(opt.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-cyan-950/80 border-cyan-400 shadow-lg shadow-cyan-500/10"
                      : "bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected
                            ? "border-cyan-400 bg-cyan-400"
                            : "border-slate-600 bg-transparent"
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                      </div>
                      <span className="font-bold text-xs text-slate-100">{opt.label}</span>
                    </div>

                    {isAi && (
                      <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded-full text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        AI RECOMMENDED
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-300 pl-6 mt-1">{opt.description}</p>

                  {/* Micro metric pill previews */}
                  <div className="flex items-center gap-2 pl-6 mt-2 flex-wrap text-[10px] font-mono">
                    <span
                      className={`px-2 py-0.5 rounded ${
                        opt.simulatedOutcome.trafficDiffPct <= 0
                          ? "bg-emerald-950 text-emerald-300 border border-emerald-800/60"
                          : "bg-rose-950 text-rose-300 border border-rose-800/60"
                      }`}
                    >
                      Traffic: {opt.simulatedOutcome.trafficDiffPct > 0 ? "+" : ""}
                      {opt.simulatedOutcome.trafficDiffPct}%
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded ${
                        opt.simulatedOutcome.delayDiffPct <= 0
                          ? "bg-emerald-950 text-emerald-300 border border-emerald-800/60"
                          : "bg-rose-950 text-rose-300 border border-rose-800/60"
                      }`}
                    >
                      Delay: {opt.simulatedOutcome.delayDiffPct > 0 ? "+" : ""}
                      {opt.simulatedOutcome.delayDiffPct}%
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded ${
                        opt.simulatedOutcome.citizenImpactDiffPct <= 0
                          ? "bg-emerald-950 text-emerald-300 border border-emerald-800/60"
                          : "bg-rose-950 text-rose-300 border border-rose-800/60"
                      }`}
                    >
                      Citizens Impact: {opt.simulatedOutcome.citizenImpactDiffPct > 0 ? "+" : ""}
                      {opt.simulatedOutcome.citizenImpactDiffPct}%
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded ${
                        opt.simulatedOutcome.safetyRiskDiffPct <= 0
                          ? "bg-emerald-950 text-emerald-300 border border-emerald-800/60"
                          : "bg-rose-950 text-rose-300 border border-rose-800/60"
                      }`}
                    >
                      Safety Risk: {opt.simulatedOutcome.safetyRiskDiffPct > 0 ? "+" : ""}
                      {opt.simulatedOutcome.safetyRiskDiffPct}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Recommendation vs Human Decision Comparison */}
        {activeOption && (
          <div className="p-4 bg-slate-950 rounded-xl border border-cyan-500/30 space-y-3">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" />
              SIMULATION COMPARISON MATRIX
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-slate-400 block">
                  YOUR SELECTED DECISION
                </span>
                <span className="font-bold text-slate-100">{activeOption.label}</span>
                <p className="text-[11px] text-slate-300">{activeOption.description}</p>
              </div>

              <div className="p-3 bg-cyan-950/40 rounded-lg border border-cyan-500/30 space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-cyan-400 block flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  AI RECOMMENDATION &amp; RATIONALE
                </span>
                <span className="font-bold text-cyan-200">{aiOption.label}</span>
                <p className="text-[11px] text-slate-300">{scenario.aiRationale}</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <button
            onClick={() => setIsDecisionModalOpen(false)}
            className="px-4 py-2 text-slate-400 hover:text-slate-200 text-xs font-bold transition-colors"
          >
            Cancel
          </button>

          <button
            id="commit-decision-btn"
            disabled={!activeOption || savedSuccess}
            onClick={handleConfirmDecision}
            className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all ${
              savedSuccess
                ? "bg-emerald-500 text-slate-950"
                : activeOption
                ? "bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-lg shadow-amber-500/20 cursor-pointer"
                : "bg-slate-800 text-slate-500 cursor-not-allowed"
            }`}
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>SAVED TO CITY MEMORY</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>EXECUTE &amp; SAVE DECISION</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
