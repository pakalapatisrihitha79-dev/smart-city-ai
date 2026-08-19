import React, { useState } from "react";
import { useCity } from "../context/CityContext";
import { Building2, ShieldAlert, Wrench, Send, Activity, CheckCircle } from "lucide-react";

export const AuthorityOperationsView: React.FC = () => {
  const { allZones, civicReports } = useCity();

  const [dispatchLog, setDispatchLog] = useState<string[]>([
    "08:15 AM: Automated drainage clearance dispatch sent to Lowland Underpass.",
    "08:00 AM: Traffic signal offset synchronized along Central Avenue Corridor.",
  ]);

  const handleDispatch = (msg: string) => {
    setDispatchLog([`${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}: ${msg}`, ...dispatchLog]);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5 text-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <Building2 className="w-4 h-4 text-cyan-400" />
            NOVACITY OPERATIONS COMMAND CENTER (AUTHORITY MODE)
          </h2>
          <p className="text-xs text-slate-400">Municipal agency triage, resource dispatch & live telemetry</p>
        </div>
        <span className="bg-cyan-950 text-cyan-300 font-bold px-2.5 py-1 rounded-lg border border-cyan-800 text-[10px]">
          AUTHORITY ACCESS
        </span>
      </div>

      {/* Grid Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 block font-bold">TOTAL MONITORED ZONES</span>
          <div className="text-xl font-bold text-slate-100 mt-0.5">{allZones.length} Zones Active</div>
        </div>

        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 block font-bold">OPEN CIVIC REPORTS</span>
          <div className="text-xl font-bold text-amber-400 mt-0.5">{civicReports.length} Reports Pending</div>
        </div>

        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 block font-bold">RESPONSE TEAM STATUS</span>
          <div className="text-xl font-bold text-emerald-400 mt-0.5">14 Crews On Field</div>
        </div>
      </div>

      {/* QUICK DISPATCH ACTION CONTROLS */}
      <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-2">
        <span className="font-bold text-slate-200 uppercase tracking-wider text-[10px] block">
          INSTANT MUNICIPAL DISPATCH CONTROLS
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            onClick={() => handleDispatch("Drainage Crew dispatched to Zone 1 Lowland Corridor.")}
            className="bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold p-2.5 rounded-xl border border-slate-700 text-[11px] flex items-center justify-center gap-1.5 transition-colors"
          >
            <Wrench className="w-3.5 h-3.5 text-cyan-400" />
            <span>Dispatch Drainage Crew</span>
          </button>

          <button
            onClick={() => handleDispatch("Prioritized Metro Signal Sync enabled for Central District.")}
            className="bg-slate-800 hover:bg-slate-700 text-blue-300 font-bold p-2.5 rounded-xl border border-slate-700 text-[11px] flex items-center justify-center gap-1.5 transition-colors"
          >
            <Activity className="w-3.5 h-3.5 text-blue-400" />
            <span>Prioritize Signal Sync</span>
          </button>

          <button
            onClick={() => handleDispatch("Public Safety Weather Advisory broadcasted to citizens.")}
            className="bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold p-2.5 rounded-xl border border-slate-700 text-[11px] flex items-center justify-center gap-1.5 transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Issue Public Advisory</span>
          </button>
        </div>
      </div>

      {/* DISPATCH AUDIT LOG */}
      <div className="space-y-2">
        <span className="font-bold text-slate-300 text-[10px] uppercase tracking-wider block">
          OPERATIONAL DISPATCH AUDIT TRAIL
        </span>
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5 font-mono text-[10px] text-slate-300 max-h-36 overflow-y-auto">
          {dispatchLog.map((log, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3 text-emerald-400 shrink-0" />
              <span>{log}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
