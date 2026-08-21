import React, { useState } from "react";
import { useCity } from "../context/CityContext";
import { CivicReport } from "../types";
import {
  FileText,
  CheckCircle,
  Clock,
  MapPin,
  ThumbsUp,
  AlertOctagon,
  Wrench,
  ShieldCheck,
  Eye,
  Camera,
  Sparkles,
  Building2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Users,
} from "lucide-react";

export const CivicIssueTracker: React.FC = () => {
  const { civicReports, verifyCivicReport } = useCity();

  const [activeVerificationId, setActiveVerificationId] = useState<string | null>(null);
  const [confirmedReports, setConfirmedReports] = useState<Record<string, number>>({});

  const handleCommunityConfirm = (reportId: string) => {
    setConfirmedReports((prev) => ({
      ...prev,
      [reportId]: (prev[reportId] || 0) + 1,
    }));
  };

  const getStatusBadge = (status: CivicReport["status"]) => {
    switch (status) {
      case "RESOLVED":
        return "bg-emerald-950 text-emerald-300 border-emerald-500/40";
      case "IN PROGRESS":
        return "bg-teal-950 text-teal-300 border-teal-500/40";
      case "ASSIGNED":
        return "bg-blue-950 text-blue-300 border-blue-500/40";
      case "AI ANALYZED":
        return "bg-purple-950 text-purple-300 border-purple-500/40";
      default:
        return "bg-white/5 text-white/70 border-white/10";
    }
  };

  return (
    <div className="bg-[#0D1117]/95 border border-white/10 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5 text-xs">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-black text-white uppercase tracking-wider font-display">
              Civic Issue Tracker & Closed-Loop AI Verification
            </h2>
            <p className="text-xs text-white/50">
              Department routing pipeline, community confirmations & Before/After repair verification
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono bg-teal-950/80 text-teal-300 px-2.5 py-1 rounded-full border border-teal-500/30 font-bold">
            {civicReports.length} Monitored Civic Work Orders
          </span>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {civicReports.map((rep) => {
          const userConfirmCount = confirmedReports[rep.id] || 0;
          const totalCommunityConfirms = (rep.upvotesCount || 12) + userConfirmCount;
          const isVerifying = activeVerificationId === rep.id;

          return (
            <div
              key={rep.id}
              className="bg-black/40 border border-white/10 hover:border-white/20 p-4 sm:p-5 rounded-2xl space-y-4 transition-all"
            >
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-extrabold text-white text-sm">{rep.title}</span>
                    <span className="text-[10px] bg-white/10 text-white/80 px-2 py-0.5 rounded font-mono font-bold">
                      {rep.id}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold border uppercase tracking-wider ${getStatusBadge(rep.status)}`}>
                      {rep.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-white/50 mt-1">
                    <span className="flex items-center gap-1 text-teal-400 font-medium">
                      <MapPin className="w-3 h-3" />
                      {rep.areaName}
                    </span>
                    <span>&bull;</span>
                    <span>Reported: {rep.createdAt}</span>
                    <span>&bull;</span>
                    <span className="text-white/70 font-mono">Category: {rep.category}</span>
                  </div>
                </div>

                {/* Priority & Reliability Badge */}
                <div className="flex items-center gap-2">
                  <div className="bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-xl flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <div className="text-right">
                      <span className="text-[9px] text-white/50 block leading-none font-mono">CONFIDENCE</span>
                      <span className="text-xs font-mono font-bold text-emerald-400">94%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-white/80 text-xs leading-relaxed font-medium">
                {rep.description}
              </p>

              {/* 6-STAGE WORK ORDER PROGRESSION PIPELINE */}
              <div className="bg-[#0D1117] p-3 rounded-xl border border-white/5 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono uppercase font-bold text-white/50">
                  <span>MUNICIPAL RESOLUTION LIFECYCLE</span>
                  <span className="text-teal-400">Department: {rep.assignedDepartment}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-1.5 text-[9px] text-center font-bold">
                  {["SUBMITTED", "AI ANALYZED", "VERIFIED", "ASSIGNED", "IN PROGRESS", "RESOLVED"].map(
                    (step, idx) => {
                      const stages = ["SUBMITTED", "AI ANALYZED", "VERIFIED", "ASSIGNED", "IN PROGRESS", "RESOLVED"];
                      const currentIdx = stages.indexOf(rep.status);
                      const isPassed = idx <= currentIdx;
                      const isCurrent = idx === currentIdx;

                      return (
                        <div
                          key={step}
                          className={`py-1.5 px-1 rounded-lg border transition-all truncate ${
                            isCurrent
                              ? "bg-teal-500 text-black border-teal-400 font-black shadow-md"
                              : isPassed
                              ? "bg-teal-950/60 text-teal-300 border-teal-500/30"
                              : "bg-white/5 text-white/30 border-white/5"
                          }`}
                        >
                          {step}
                        </div>
                      );
                    }
                  )}
                </div>
              </div>

              {/* BEFORE VS AFTER AI VERIFICATION ACCORDION / DRAWER */}
              {isVerifying ? (
                <div className="bg-gradient-to-b from-[#111C2B] to-[#0D1117] border border-teal-500/40 p-4 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                    <span className="font-black text-teal-300 flex items-center gap-1.5 uppercase text-xs tracking-wider">
                      <Sparkles className="w-4 h-4 text-teal-400" />
                      AI Before vs. After Computer Vision Verification
                    </span>
                    <button
                      onClick={() => setActiveVerificationId(null)}
                      className="text-xs text-white/50 hover:text-white"
                    >
                      Close Comparison
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Before Photo */}
                    <div className="bg-black/50 p-3 rounded-xl border border-rose-500/30 space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-mono uppercase font-bold text-rose-400">
                        <span>BEFORE &bull; REPORTED DEFECT</span>
                        <span className="bg-rose-950 px-1.5 py-0.5 rounded">Severity: 8.4/10</span>
                      </div>
                      <div className="h-32 bg-slate-900 rounded-lg flex items-center justify-center border border-white/10 overflow-hidden relative">
                        <div className="text-center p-2 space-y-1">
                          <AlertTriangle className="w-6 h-6 text-amber-400 mx-auto" />
                          <span className="text-[10px] text-white/70 block">
                            Deep Asphalt Depression & 45cm Pothole
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* After Photo */}
                    <div className="bg-black/50 p-3 rounded-xl border border-emerald-500/30 space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-mono uppercase font-bold text-emerald-400">
                        <span>AFTER &bull; MUNICIPAL REPAIR</span>
                        <span className="bg-emerald-950 px-1.5 py-0.5 rounded">Resolved: Today</span>
                      </div>
                      <div className="h-32 bg-emerald-950/20 rounded-lg flex items-center justify-center border border-emerald-500/20 overflow-hidden relative">
                        <div className="text-center p-2 space-y-1">
                          <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
                          <span className="text-[10px] text-emerald-200 block">
                            Cold Asphalt Sealed & Surface Compacted
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI Resolution Verdict */}
                  <div className="bg-emerald-950/40 border border-emerald-500/40 p-3 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-emerald-300 font-bold text-xs">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        <span>🟢 Resolution Verified (Visual Similarity: 94%)</span>
                      </div>
                      <p className="text-[11px] text-white/70">
                        Neural model confirmed structural defect resolved with zero residual crater geometry.
                      </p>
                    </div>
                    <span className="text-[10px] font-mono font-bold bg-emerald-900/80 text-emerald-200 px-3 py-1.5 rounded-lg border border-emerald-500/30 uppercase shrink-0 text-center">
                      Verified Closed-Loop
                    </span>
                  </div>
                </div>
              ) : null}

              {/* ACTIONS: COMMUNITY CONFIRMATION & VERIFICATION TRIGGER */}
              <div className="flex flex-wrap items-center justify-between pt-2 border-t border-white/10 gap-3">
                {/* Community 'I See This Too' Action */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCommunityConfirm(rep.id)}
                    className="px-3 py-1.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 text-teal-300 font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Users className="w-3.5 h-3.5 text-teal-400" />
                    <span>I SEE THIS TOO ({totalCommunityConfirms})</span>
                  </button>

                  <button
                    onClick={() => setActiveVerificationId(isVerifying ? null : rep.id)}
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{isVerifying ? "Hide Comparison" : "Compare Before/After"}</span>
                  </button>
                </div>

                {/* Authority / Community Validation Voting */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => verifyCivicReport(rep.id, true)}
                    className="bg-amber-950/60 hover:bg-amber-900 text-amber-300 border border-amber-500/40 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <AlertOctagon className="w-3.5 h-3.5" />
                    <span>STILL EXISTS ({rep.stillExistsCount})</span>
                  </button>

                  <button
                    onClick={() => verifyCivicReport(rep.id, false)}
                    className="bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>NO, FIXED ({rep.fixedCount})</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
