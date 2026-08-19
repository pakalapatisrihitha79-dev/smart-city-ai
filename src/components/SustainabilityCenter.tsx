import React from "react";
import { useCity } from "../context/CityContext";
import { Leaf, Award, Target, Sparkles } from "lucide-react";

export const SustainabilityCenter: React.FC = () => {
  const { currentZone } = useCity();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 text-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <Leaf className="w-4 h-4 text-emerald-400" />
            SUSTAINABILITY INTELLIGENCE & GREEN NOVACITY
          </h2>
          <p className="text-xs text-slate-400">Carbon footprints, eco goals, and community green progress</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Eco Score */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold block">AREA ECO INDEX</span>
            <div className="text-2xl font-black text-emerald-400 mt-0.5">82 / 100</div>
            <p className="text-[10px] text-slate-400 mt-1">High solar grid adoption & public transit usage</p>
          </div>
          <Award className="w-8 h-8 text-emerald-400 opacity-80" />
        </div>

        {/* Community Goal */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
              <Target className="w-3.5 h-3.5 text-cyan-400" />
              COMMUNITY ECO GOAL
            </span>
            <span className="text-[10px] font-bold text-cyan-400">74% Done</span>
          </div>
          <div className="font-bold text-slate-200">1,000 Green Commutes in {currentZone.name}</div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-cyan-500 h-full w-[74%]" />
          </div>
        </div>
      </div>

      <div className="bg-emerald-950/30 border border-emerald-800/40 p-3 rounded-xl flex items-start gap-2 text-emerald-200">
        <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block">PERSONALIZED ECO TIP FOR {currentZone.name.toUpperCase()}</span>
          <p className="text-[11px] text-emerald-200/90 mt-0.5">
            Switching your evening commute to the Metro Bus line cuts your personal commute emissions by 1.5 kg CO₂ daily.
          </p>
        </div>
      </div>
    </div>
  );
};
