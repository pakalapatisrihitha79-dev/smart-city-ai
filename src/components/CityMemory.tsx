import React, { useState } from "react";
import { useCity } from "../context/CityContext";
import { History, TrendingUp, Calendar, ArrowRight } from "lucide-react";

export const CityMemory: React.FC = () => {
  const { currentZone } = useCity();
  const [selectedMetric, setSelectedMetric] = useState<"aqi" | "traffic" | "issues">("aqi");

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 text-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <History className="w-4 h-4 text-cyan-400" />
            CITY MEMORY & HISTORICAL TRENDS
          </h2>
          <p className="text-xs text-slate-400">Longitudinal analytics & 30-day area evolution</p>
        </div>
      </div>

      {/* Metric Tabs */}
      <div className="flex gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 font-bold">
        {[
          { id: "aqi", label: "30-Day Air Quality" },
          { id: "traffic", label: "Traffic Congestion" },
          { id: "issues", label: "Civic Resolution Time" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedMetric(tab.id as any)}
            className={`flex-1 py-1.5 rounded-lg text-center transition-colors ${
              selectedMetric === tab.id
                ? "bg-cyan-600 text-white"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Simulated Visual Sparkline Chart Bar Representation */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
        <div className="flex justify-between items-baseline">
          <span className="font-bold text-slate-200">
            {selectedMetric === "aqi"
              ? "Average AQI Trend (Last 30 Days)"
              : selectedMetric === "traffic"
              ? "Peak Hour Traffic Delay (Minutes)"
              : "Average Issue Fix Time (Hours)"}
          </span>
          <span className="text-[10px] text-emerald-400 font-bold">↓ 14% Improvement Year-Over-Year</span>
        </div>

        <div className="flex items-end justify-between h-28 pt-4 gap-1">
          {[42, 48, 55, 60, 52, 45, 38, 40, 46, 50, 42, 36, 34, 38, 40].map((val, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
              <div
                className="w-full bg-cyan-600/80 hover:bg-cyan-400 rounded-t transition-all"
                style={{ height: `${val * 1.5}px` }}
              />
              <span className="text-[8px] text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                {val}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* WHAT HAS CHANGED IN THE LAST 30 DAYS? */}
      <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-2">
        <span className="font-bold text-slate-200 text-xs uppercase tracking-wider block">
          WHAT HAS CHANGED IN {currentZone.name.toUpperCase()} IN THE LAST 30 DAYS?
        </span>

        <ul className="space-y-1.5 text-slate-300 text-[11px] list-disc list-inside leading-relaxed">
          <li>
            <strong className="text-emerald-400">Green Canopy:</strong> 120 saplings planted along main boulevard.
          </li>
          <li>
            <strong className="text-cyan-400">Smart Signals:</strong> AI traffic light timing reduced intersection wait times by 8%.
          </li>
          <li>
            <strong className="text-amber-400">Water Network:</strong> 3 sub-surface sensor nodes upgraded to prevent leakage spikes.
          </li>
        </ul>
      </div>
    </div>
  );
};
