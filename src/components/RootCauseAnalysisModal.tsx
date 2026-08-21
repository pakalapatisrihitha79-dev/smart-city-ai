import React, { useState } from "react";
import { useCity } from "../context/CityContext";
import {
  GitBranch,
  Layers,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  PieChart,
  Sliders,
  HelpCircle,
  X,
  Target,
  Wrench,
} from "lucide-react";

export const RootCauseAnalysisModal: React.FC = () => {
  const { isRootCauseModalOpen, closeRootCauseModal } = useCity();

  const [activeIssue, setActiveIssue] = useState<string>("traffic_gridlock");

  const issues = [
    {
      id: "traffic_gridlock",
      title: "Zone 4 Severe Evening Gridlock (92% Saturation)",
      location: "Zone 4 (Lowland Flyover Junction)",
      primaryFactor: "Heavy Rainfall (35mm) & Flyover Lane Maintenance",
      factors: [
        { name: "Heavy Rainfall (35mm) & Surface Puddling", weightPct: 38, icon: "🌧️", desc: "Drivers reducing speed by 45% due to reduced visibility and hydroplaning risk." },
        { name: "Flyover Lane 1 Closed for Expansion Joint Repair", weightPct: 26, icon: "🚧", desc: "Corridor vehicle capacity reduced from 3 lanes to 2 lanes." },
        { name: "Simultaneous School & Office Dismissal (17:30)", weightPct: 21, icon: "🏫", desc: "Peak vehicular surge of 8,400 vehicles in 45 minutes." },
        { name: "Stadium Cricket Match Ingress Traffic", weightPct: 15, icon: "🏟️", desc: "Additional 3,200 private cars heading to South Gate." },
      ],
      aiRootAction: "Temporarily pause lane repair until 20:00 PM, enact automated Green-Wave Signal Phase #4 on Central Radial (+24s green), and divert stadium traffic to North Bypass.",
    },
    {
      id: "water_pressure_drop",
      title: "Zone 7 Abrupt Water Pressure Drop (-14 PSI)",
      location: "Zone 7 (Harbor Freight Corridor)",
      primaryFactor: "Acoustic Subsurface Pipe Fracture at Node 17-C",
      factors: [
        { name: "Subsurface Main Pipeline Fracture (Node 17-C)", weightPct: 52, icon: "🚰", desc: "Acoustic sensor detected -14 PSI pressure gradient drop with 280 L/min flow loss." },
        { name: "Old Cast-Iron Pipe Calcification & Corrosion", weightPct: 32, icon: "⚙️", desc: "Internal diameter narrowed by 24%, increasing friction loss." },
        { name: "Unauthorized Industrial Hydrant Midnight Draw", weightPct: 16, icon: "🏭", desc: "Unmetered 40 L/s surge detected between 01:00 and 03:00 AM." },
      ],
      aiRootAction: "Isolate automated sector valve #17-B to stop non-revenue water loss and dispatch the Acoustic Leak Patching crew with targeted dig coordinates.",
    },
    {
      id: "waste_overflow",
      title: "Zone 2 Commercial Solid Waste Saturation",
      location: "Zone 2 (Arts District Food Court)",
      primaryFactor: "Weekend Street Food Festival Footfall Surge",
      factors: [
        { name: "Weekend Street Food Festival Visitor Footfall", weightPct: 48, icon: "🍔", desc: "32,000 visitors generating 4.2x average Saturday single-use packaging waste." },
        { name: "Regular Collection Compactor Delayed in Traffic", weightPct: 32, icon: "🚛", desc: "Scheduled 17:00 PM truck delayed by 52 minutes due to flyover congestion." },
        { name: "Bulk Commercial Packaging Dumping", weightPct: 20, icon: "📦", desc: "Commercial restaurants using municipal public bins instead of private contracts." },
      ],
      aiRootAction: "Deploy mobile compaction trailer to Central Quad and mandate commercial food court QR waste tagging.",
    },
  ];

  if (!isRootCauseModalOpen) return null;

  const current = issues.find((i) => i.id === activeIssue) || issues[0];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-5">
      <div className="bg-[#0D1117] border border-cyan-500/40 rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl space-y-5 text-xs relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={closeRootCauseModal}
          className="absolute top-4 right-4 p-2 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2.5 pb-3 border-b border-white/10">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
            <GitBranch className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-white uppercase tracking-wider font-display">
                AI Root-Cause Analysis Engine
              </h3>
              <span className="text-[9px] font-mono font-bold bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/40">
                EXPLAINABLE CAUSAL GRAPH
              </span>
            </div>
            <p className="text-xs text-white/50">
              Deconstructs surface symptoms into weighted root causal factors rather than just reporting the outcome
            </p>
          </div>
        </div>

        {/* Issue Selector Tabs */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar font-bold">
          {issues.map((iss) => (
            <button
              key={iss.id}
              onClick={() => setActiveIssue(iss.id)}
              className={`px-3 py-1.5 rounded-xl border text-xs whitespace-nowrap transition-all ${
                activeIssue === iss.id
                  ? "bg-cyan-600 text-white border-cyan-400 font-extrabold"
                  : "bg-white/5 text-white/60 border-white/10 hover:text-white"
              }`}
            >
              {iss.title.split(" (")[0]}
            </button>
          ))}
        </div>

        {/* Selected Incident Overview */}
        <div className="bg-black/50 p-4 rounded-2xl border border-white/10 space-y-1.5">
          <span className="text-[9px] font-mono font-bold uppercase text-cyan-400 block">
            Observed Symptom
          </span>
          <h4 className="font-extrabold text-white text-sm">{current.title}</h4>
          <span className="text-white/50 text-[11px] block">{current.location}</span>
        </div>

        {/* Causal Breakdown Factor Tree */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-white/60 block">
            Systemic Causal Contributors (Multi-Factor Weighting)
          </span>

          <div className="space-y-2">
            {current.factors.map((f, idx) => (
              <div key={idx} className="bg-[#111C2B] p-3.5 rounded-2xl border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{f.icon}</span>
                    <span className="font-extrabold text-white text-xs">{f.name}</span>
                  </div>
                  <span className="text-xs font-black font-mono text-cyan-400">{f.weightPct}% Impact</span>
                </div>

                <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 rounded-full"
                    style={{ width: `${f.weightPct}%` }}
                  />
                </div>

                <p className="text-white/70 text-[11px] leading-snug">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pinpoint Root-Cause Intervention */}
        <div className="bg-gradient-to-r from-teal-950/40 via-[#111C2B] to-cyan-950/40 border border-teal-500/40 p-4 rounded-2xl space-y-1.5">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-teal-400" />
            <span className="font-extrabold text-white text-xs uppercase tracking-wider">
              Pinpoint AI Root-Cause Intervention
            </span>
          </div>
          <p className="text-teal-100 text-xs leading-relaxed font-medium">
            {current.aiRootAction}
          </p>
        </div>

        <button
          onClick={closeRootCauseModal}
          className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider transition-colors shadow-lg shadow-cyan-600/20"
        >
          Acknowledge & Close Analysis
        </button>
      </div>
    </div>
  );
};
