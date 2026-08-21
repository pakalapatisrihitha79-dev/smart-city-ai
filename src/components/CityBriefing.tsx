import React from "react";
import { CityZone } from "../types";
import { useCity } from "../context/CityContext";
import { getTranslation, buildLocalizedBriefing } from "../utils/translations";
import {
  Sparkles,
  AlertTriangle,
  Lightbulb,
  Info,
  Download,
  Car,
  CloudRain,
  Wind,
  Construction,
  Droplets,
  Calendar,
  Sun,
  Clock,
  ArrowRight,
} from "lucide-react";

interface CityBriefingProps {
  zone: CityZone;
  areaName: string;
}

export const CityBriefing: React.FC<CityBriefingProps> = ({ zone, areaName }) => {
  const { language } = useCity();

  const hour = new Date().getHours();
  const greetingKey =
    hour < 12 ? "goodMorning" : hour < 18 ? "goodAfternoon" : "goodEvening";

  const greetingStr = getTranslation(language, greetingKey);

  const { thingsToKnow, thingToWatch, recommendation } = buildLocalizedBriefing(
    language,
    areaName,
    zone
  );

  // 6 Quick-Access Telemetry Highlights specified in Briefing format
  const briefingKpis = [
    {
      label: "Traffic",
      value: zone.traffic,
      icon: Car,
      color: "text-blue-400",
      bg: "bg-blue-950/40 border-blue-500/20",
    },
    {
      label: "Rain Probability",
      value: `${zone.rainfallMm > 0 ? "72%" : "25%"} (${zone.weather})`,
      icon: CloudRain,
      color: "text-cyan-400",
      bg: "bg-cyan-950/40 border-cyan-500/20",
    },
    {
      label: "Air Quality",
      value: `AQI ${zone.aqi} • ${zone.aqiStatus}`,
      icon: Wind,
      color: "text-emerald-400",
      bg: "bg-emerald-950/40 border-emerald-500/20",
    },
    {
      label: "Road Issues",
      value: "23 New Reports",
      icon: Construction,
      color: "text-amber-400",
      bg: "bg-amber-950/40 border-amber-500/20",
    },
    {
      label: "Flood Risk",
      value: `${zone.floodRiskPct}% (2 Zones Elevated)`,
      icon: Droplets,
      color: "text-indigo-400",
      bg: "bg-indigo-950/40 border-indigo-500/20",
    },
    {
      label: "Urban Events",
      value: "4 Major Gatherings",
      icon: Calendar,
      color: "text-purple-400",
      bg: "bg-purple-950/40 border-purple-500/20",
    },
  ];

  const handleDownloadSummary = () => {
    const timestamp = new Date().toLocaleString();
    const summaryText = `====================================================
CITYMIND AI - DAILY CITY INTELLIGENCE BRIEF
====================================================
Generated: ${timestamp}
Selected District: ${areaName} (ID: ${zone.id})
City Health Score: ${zone.healthScore} / 100

1. TODAY'S CITY INTELLIGENCE
- Traffic:          ${zone.traffic} (${zone.trafficSpeed} km/h)
- Rain Probability: ${zone.rainfallMm > 0 ? "72%" : "25%"}
- Air Quality:      AQI ${zone.aqi} (${zone.aqiStatus})
- Road Issues:      23 New Reports
- Flood Risk:       ${zone.floodRiskPct}%
- Events:           4 Major Gatherings

2. AI PROACTIVE RECOMMENDATION
${recommendation}

3. KEY CITY HIGHLIGHTS
${thingsToKnow.map((item, idx) => `${idx + 1}. ${item}`).join("\n")}

====================================================
CityMind AI Living City Intelligence Platform
====================================================`;

    const blob = new Blob([summaryText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const sanitizedArea = areaName.replace(/[^a-zA-Z0-9]/g, "_");
    link.download = `CityMind_Daily_Briefing_${sanitizedArea}_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#0D1117]/95 border border-white/10 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5 text-xs">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
            <Sun className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black text-white uppercase tracking-wider font-display">
                {greetingStr} &bull; CityMind Daily Brief
              </h2>
              <span className="text-[9px] font-mono font-bold bg-white/10 text-teal-300 px-2 py-0.5 rounded-full border border-white/10">
                {areaName}
              </span>
            </div>
            <p className="text-xs text-white/50">
              Personalized morning intelligence synthesis & recommended commute window
            </p>
          </div>
        </div>

        <button
          onClick={handleDownloadSummary}
          className="flex items-center gap-1.5 text-[11px] font-bold bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 px-3.5 py-1.5 rounded-xl border border-teal-500/30 uppercase tracking-wider transition-colors self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-teal-400" />
          <span>{getTranslation(language, "downloadSummary")}</span>
        </button>
      </div>

      {/* TODAY'S CITY INTELLIGENCE 6-CARD GRID */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-400 block">
          Today's Live City Intelligence
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
          {briefingKpis.map((kpi, idx) => {
            const IconComp = kpi.icon;
            return (
              <div
                key={idx}
                className={`p-3 rounded-2xl border ${kpi.bg} space-y-1`}
              >
                <div className="flex items-center gap-1.5">
                  <IconComp className={`w-3.5 h-3.5 ${kpi.color}`} />
                  <span className="text-[10px] font-bold text-white/50 uppercase font-mono truncate">
                    {kpi.label}
                  </span>
                </div>
                <div className="text-xs font-bold text-white truncate">{kpi.value}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI RECOMMENDATION SPOTLIGHT */}
      <div className="bg-gradient-to-r from-teal-950/60 via-[#111C2B] to-cyan-950/60 border border-teal-500/40 p-4 rounded-2xl space-y-1.5 shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-300 flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4 text-teal-400" />
            AI Travel & Activity Recommendation
          </span>
          <span className="text-[9px] font-mono text-white/50">Personalized to {areaName}</span>
        </div>
        <p className="text-xs sm:text-sm font-extrabold text-white leading-relaxed">
          &ldquo;Allow extra travel time between 8:00–10:00 AM because congestion is expected around the central zone.&rdquo;
        </p>
      </div>

      {/* 3 Things to Know & 1 Thing to Watch */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-black/40 rounded-2xl p-4 border border-white/5 space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-teal-400 uppercase text-[10px] tracking-wider font-mono">
            <Info className="w-3.5 h-3.5 text-teal-400" />
            <span>3 Things To Know In Your Area</span>
          </div>
          <ul className="space-y-1.5 text-white/80 list-disc list-inside leading-relaxed font-medium">
            {thingsToKnow.map((item, idx) => (
              <li key={idx} className="marker:text-teal-400">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-amber-950/20 rounded-2xl p-4 border border-amber-500/20 space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-amber-400 uppercase text-[10px] tracking-wider font-mono">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>One Thing To Watch Out For</span>
          </div>
          <p className="text-amber-200/90 leading-relaxed font-medium">{thingToWatch}</p>
        </div>
      </div>
    </div>
  );
};
