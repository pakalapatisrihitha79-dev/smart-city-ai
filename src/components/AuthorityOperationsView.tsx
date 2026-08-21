import React, { useState } from "react";
import { useCity } from "../context/CityContext";
import {
  Building2,
  ShieldAlert,
  Wrench,
  Send,
  Activity,
  CheckCircle,
  AlertTriangle,
  Radio,
  ArrowRight,
  Flame,
  Droplets,
  Car,
  Trash2,
  Zap,
  Sparkles,
  Layers,
  PhoneCall,
  CheckCircle2,
} from "lucide-react";

export const AuthorityOperationsView: React.FC = () => {
  const { allZones, civicReports, currentZone } = useCity();

  const [dispatchLog, setDispatchLog] = useState<string[]>([
    "08:15 AM: Automated drainage clearance dispatch sent to Lowland Basin.",
    "08:00 AM: Dynamic traffic signal phase extended along Central Corridor (+18s green wave).",
    "07:45 AM: High-pressure water main isolation team dispatched to Harbor District.",
  ]);

  const [dispatchedItems, setDispatchedItems] = useState<string[]>([]);

  const handleDispatchAction = (id: string, actionMsg: string) => {
    setDispatchedItems((prev) => [...prev, id]);
    setDispatchLog([
      `${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}: ${actionMsg}`,
      ...dispatchLog,
    ]);
  };

  // AI Priority Queue items as specified in Specification
  const priorityQueue = [
    {
      id: "inc-1",
      priority: "CRITICAL",
      badgeColor: "bg-rose-950 text-rose-300 border-rose-500/40",
      indicatorColor: "bg-rose-500",
      problem: "Severe Arterial Flooding & Sump Overflow",
      location: "Zone 4 (Lowland Basin Underpass)",
      aiReason: "Water level rising +14cm/hr; risk of 40cm road waterlogging and transit bus strandings within 35 mins.",
      targetDept: "Water & Drainage Board",
      recommendedAction: "Deploy high-capacity submersible pump unit & close Underpass Lane 1.",
    },
    {
      id: "inc-2",
      priority: "HIGH",
      badgeColor: "bg-rose-950 text-rose-300 border-rose-500/40",
      indicatorColor: "bg-rose-500",
      problem: "Deep Asphalt Pothole & Exposed Rebar",
      location: "Zone 7 (Harbor Link Expressway)",
      aiReason: "High accident potential for two-wheelers and heavy vehicle axle fatigue on 70 km/h corridor.",
      targetDept: "Highways & Public Works",
      recommendedAction: "Dispatch rapid-patch cold asphalt truck with safety cone perimeter.",
    },
    {
      id: "inc-3",
      priority: "MEDIUM",
      badgeColor: "bg-amber-950 text-amber-300 border-amber-500/40",
      indicatorColor: "bg-amber-500",
      problem: "Solid Waste Overflow in Commercial Sector",
      location: "Zone 2 (Uptown Arts District)",
      aiReason: "5 repeated citizen reports with photos; biological vector risk and bike path obstruction.",
      targetDept: "Sanitation & Waste Mgmt",
      recommendedAction: "Reroute automated compacting truck #8 to clear bin within 2 hours.",
    },
    {
      id: "inc-4",
      priority: "LOW",
      badgeColor: "bg-emerald-950 text-emerald-300 border-emerald-500/40",
      indicatorColor: "bg-emerald-500",
      problem: "Broken Streetlight Luminaire Head",
      location: "Zone 8 (Green Valley Boulevard)",
      aiReason: "Low pedestrian traffic corridor; natural ambient moonlight sufficient until next scheduled patrol.",
      targetDept: "Municipal Electrical Authority",
      recommendedAction: "Queue for routine evening luminaire replacement batch.",
    },
  ];

  return (
    <div className="bg-[#0D1117]/95 border border-cyan-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5 text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black text-white uppercase tracking-wider font-display">
                City Command Center <span className="text-cyan-400">&bull; Authority Operations</span>
              </h2>
              <span className="text-[9px] font-mono font-bold bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/40">
                OFFICIAL OPERATIONS DESK
              </span>
            </div>
            <p className="text-xs text-white/50">
              Real-time incident dispatch, multi-agency coordination & AI-prioritized triage queue
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-emerald-400 font-mono font-bold text-xs uppercase">
            All 5 Agency Feeds Active
          </span>
        </div>
      </div>

      {/* 4 TOP INCIDENT KPI METRICS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-black/40 p-3.5 rounded-2xl border border-white/10">
          <span className="text-[10px] text-white/50 block font-mono uppercase font-bold">
            Live Incidents Tracked
          </span>
          <div className="text-xl font-black text-white font-mono mt-0.5">148</div>
          <span className="text-[10px] text-teal-400 font-mono">Across All 10 Wards</span>
        </div>

        <div className="bg-rose-950/30 p-3.5 rounded-2xl border border-rose-500/30">
          <span className="text-[10px] text-rose-300 block font-mono uppercase font-bold">
            Critical Urgent
          </span>
          <div className="text-xl font-black text-rose-400 font-mono mt-0.5">7</div>
          <span className="text-[10px] text-rose-300/80 font-mono">&lt; 30 Min Response SLA</span>
        </div>

        <div className="bg-amber-950/30 p-3.5 rounded-2xl border border-amber-500/30">
          <span className="text-[10px] text-amber-300 block font-mono uppercase font-bold">
            Pending Dispatch
          </span>
          <div className="text-xl font-black text-amber-400 font-mono mt-0.5">38</div>
          <span className="text-[10px] text-amber-300/80 font-mono">Assigned to Crews</span>
        </div>

        <div className="bg-emerald-950/30 p-3.5 rounded-2xl border border-emerald-500/30">
          <span className="text-[10px] text-emerald-300 block font-mono uppercase font-bold">
            Resolved Today
          </span>
          <div className="text-xl font-black text-emerald-400 font-mono mt-0.5">103</div>
          <span className="text-[10px] text-emerald-300/80 font-mono">AI Verified Closed</span>
        </div>
      </div>

      {/* AI PRIORITY DIRECTIVE CALLOUT */}
      <div className="bg-gradient-to-r from-cyan-950/60 via-[#111C2B] to-teal-950/60 border border-cyan-500/40 p-4 rounded-2xl space-y-1.5 shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            AI Operations Recommendation & Queue Optimizer
          </span>
          <span className="text-[9px] font-mono text-white/50">Algorithm: Risk &times; Urgency Mesh</span>
        </div>
        <p className="text-xs font-bold text-white leading-relaxed">
          &ldquo;Resolve these 5 critical and high-priority issues first to prevent cascading gridlock on arterial bridges and increase City Health by +8.4 points.&rdquo;
        </p>
      </div>

      {/* AI PRIORITY QUEUE TABLE / CARDS */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase text-white/50">
          <span>AI PRIORITY TRIAGE QUEUE</span>
          <span>SLA COUNTDOWN</span>
        </div>

        <div className="space-y-2">
          {priorityQueue.map((item) => {
            const isDispatched = dispatchedItems.includes(item.id);

            return (
              <div
                key={item.id}
                className="bg-black/40 border border-white/10 hover:border-white/20 p-4 rounded-2xl space-y-3 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-black border uppercase tracking-wider ${item.badgeColor}`}
                    >
                      {item.priority}
                    </span>
                    <span className="font-extrabold text-white text-xs sm:text-sm">{item.problem}</span>
                  </div>

                  <span className="text-teal-400 font-mono text-xs font-bold flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" />
                    {item.location}
                  </span>
                </div>

                {/* AI Reason & Recommended Action */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  <div className="bg-[#0D1117] p-2.5 rounded-xl border border-white/5 space-y-0.5">
                    <span className="text-[9px] font-mono text-white/40 uppercase font-bold block">
                      AI Diagnostic Reason
                    </span>
                    <p className="text-white/80 text-[11px] leading-snug">{item.aiReason}</p>
                  </div>

                  <div className="bg-teal-950/30 p-2.5 rounded-xl border border-teal-500/20 space-y-0.5">
                    <span className="text-[9px] font-mono text-teal-300 uppercase font-bold block">
                      Department Protocol: {item.targetDept}
                    </span>
                    <p className="text-teal-100 text-[11px] leading-snug">{item.recommendedAction}</p>
                  </div>
                </div>

                {/* Action Row */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-white/50 font-mono">
                    Responsible Agency: <strong className="text-white/80">{item.targetDept}</strong>
                  </span>

                  <button
                    onClick={() =>
                      handleDispatchAction(
                        item.id,
                        `Dispatched ${item.targetDept} quick-response team to ${item.location}.`
                      )
                    }
                    disabled={isDispatched}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all uppercase tracking-wider flex items-center gap-1.5 ${
                      isDispatched
                        ? "bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-mono"
                        : "bg-teal-500 hover:bg-teal-400 text-black shadow-md shadow-teal-500/20 font-black"
                    }`}
                  >
                    {isDispatched ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Crew Dispatched &bull; En Route</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Dispatch Emergency Crew</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DISPATCH AUDIT LOG */}
      <div className="space-y-2 pt-2 border-t border-white/10">
        <span className="font-mono font-bold text-white/50 text-[10px] uppercase tracking-wider block">
          OPERATIONAL DISPATCH AUDIT TRAIL
        </span>
        <div className="bg-black/50 p-3.5 rounded-2xl border border-white/10 space-y-1.5 font-mono text-[10px] text-white/70 max-h-32 overflow-y-auto no-scrollbar">
          {dispatchLog.map((log, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{log}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
