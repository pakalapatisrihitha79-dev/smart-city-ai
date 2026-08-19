import React, { useState } from "react";
import { CityZone } from "../types";
import { calculateCityHealthScore } from "../utils/cityEngine";
import { ShieldCheck, ChevronDown, ChevronUp, HelpCircle, Clock } from "lucide-react";

interface CityHealthCardProps {
  zone: CityZone;
}

export const CityHealthCard: React.FC<CityHealthCardProps> = ({ zone }) => {
  const [showExplanation, setShowExplanation] = useState(false);
  const { score, breakdown } = calculateCityHealthScore(zone);

  return (
    <div className="bg-[#0D1117]/90 border border-white/10 rounded-2xl p-4 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-teal-400" />
          <div>
            <h3 className="text-xs font-bold text-teal-400 uppercase tracking-[0.2em]">
              CITY HEALTH SCORE
            </h3>
            <div className="flex items-center gap-1.5 text-[10px] text-white/40 font-mono">
              <Clock className="w-3 h-3 text-white/30" />
              <span>Updated 2 min ago &bull; Live Twin</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white text-xs px-3.5 py-2 rounded-xl border border-white/10 transition-colors"
        >
          <span className="font-black text-base text-teal-400 font-display">{score}</span>
          <span className="text-[10px] text-white/40 font-bold">/ 100</span>
          {showExplanation ? (
            <ChevronUp className="w-3.5 h-3.5 text-white/60" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-white/60" />
          )}
        </button>
      </div>

      {/* WHY THIS SCORE Explainer Expansion */}
      {showExplanation && (
        <div className="mt-4 pt-3 border-t border-white/10 space-y-2 text-xs">
          <div className="flex items-center justify-between font-bold text-white/80 text-[10px] uppercase tracking-wider mb-2">
            <span className="flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-teal-400" />
              EXPLAINABLE SCORE BREAKDOWN
            </span>
            <span className="text-white/40">Base: 100 pts</span>
          </div>

          <div className="space-y-2">
            {breakdown.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 bg-white/5 rounded-xl border border-white/5 text-white/80"
              >
                <div>
                  <div className="font-bold text-white uppercase text-[11px] tracking-wide">{item.label}</div>
                  <div className="text-[10px] text-white/50">{item.explanation}</div>
                </div>
                <span
                  className={`font-black px-2.5 py-1 rounded-lg text-[11px] ${
                    item.points >= 0
                      ? "bg-teal-500/20 text-teal-300 border border-teal-500/30"
                      : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                  }`}
                >
                  {item.points >= 0 ? `+${item.points}` : item.points}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
