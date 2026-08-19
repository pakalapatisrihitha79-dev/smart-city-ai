import React from "react";
import { useCity } from "../context/CityContext";
import { CivicReport } from "../types";
import { FileText, CheckCircle, Clock, MapPin, ThumbsUp, AlertOctagon, Wrench } from "lucide-react";

export const CivicIssueTracker: React.FC = () => {
  const { civicReports, verifyCivicReport } = useCity();

  const getStatusColor = (status: CivicReport["status"]) => {
    switch (status) {
      case "RESOLVED":
        return "bg-emerald-950 text-emerald-400 border-emerald-800";
      case "IN PROGRESS":
        return "bg-cyan-950 text-cyan-300 border-cyan-800";
      case "ASSIGNED":
        return "bg-blue-950 text-blue-300 border-blue-800";
      default:
        return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            CIVIC ISSUE TRACKING & COMMUNITY VERIFICATION
          </h2>
          <p className="text-xs text-slate-400">Track status and verify reported civic problems</p>
        </div>
      </div>

      <div className="space-y-3">
        {civicReports.map((rep) => (
          <div
            key={rep.id}
            className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-3 text-xs"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-100 text-xs">{rep.title}</span>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">
                    {rep.id}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-cyan-400" />
                    {rep.areaName}
                  </span>
                  <span>•</span>
                  <span>{rep.createdAt}</span>
                </div>
              </div>

              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusColor(rep.status)}`}>
                {rep.status}
              </span>
            </div>

            <p className="text-slate-300 text-xs leading-relaxed">{rep.description}</p>

            {/* PIPELINE PROGRESS BAR */}
            <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                CIVIC STATUS PIPELINE
              </span>
              <div className="grid grid-cols-6 gap-1 text-[9px] text-center font-bold">
                {["SUBMITTED", "AI ANALYZED", "VERIFIED", "ASSIGNED", "IN PROGRESS", "RESOLVED"].map(
                  (step, idx) => {
                    const currentIdx = [
                      "SUBMITTED",
                      "AI ANALYZED",
                      "VERIFIED",
                      "ASSIGNED",
                      "IN PROGRESS",
                      "RESOLVED",
                    ].indexOf(rep.status);
                    const isPassed = idx <= currentIdx;

                    return (
                      <div
                        key={step}
                        className={`py-1 rounded border ${
                          isPassed
                            ? "bg-cyan-950 text-cyan-300 border-cyan-800"
                            : "bg-slate-950 text-slate-600 border-slate-800"
                        }`}
                      >
                        {step}
                      </div>
                    );
                  }
                )}
              </div>
            </div>

            {/* COMMUNITY VERIFICATION ACTIONS */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
              <span className="text-[10px] text-slate-400">
                Department: <span className="text-slate-200 font-semibold">{rep.assignedDepartment}</span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => verifyCivicReport(rep.id, true)}
                  className="bg-amber-950/60 hover:bg-amber-900 text-amber-300 border border-amber-800/60 px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1"
                >
                  <AlertOctagon className="w-3 h-3" />
                  <span>STILL EXISTS ({rep.stillExistsCount})</span>
                </button>

                <button
                  onClick={() => verifyCivicReport(rep.id, false)}
                  className="bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/60 px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1"
                >
                  <CheckCircle className="w-3 h-3" />
                  <span>NO, FIXED ({rep.fixedCount})</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
