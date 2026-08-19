import React from "react";
import { CityZone } from "../types";
import { useCity } from "../context/CityContext";
import { getTranslation, buildLocalizedBriefing } from "../utils/translations";
import { Sparkles, AlertTriangle, Lightbulb, Info, Download } from "lucide-react";

interface CityBriefingProps {
  zone: CityZone;
  areaName: string;
}

export const CityBriefing: React.FC<CityBriefingProps> = ({ zone, areaName }) => {
  const { language } = useCity();

  const hour = new Date().getHours();
  const greetingKey =
    hour < 12
      ? "goodMorning"
      : hour < 18
      ? "goodAfternoon"
      : "goodEvening";

  const greetingStr = getTranslation(language, greetingKey);
  const operatingStr = getTranslation(language, operatingWithHealthScoreKey(language));

  const { thingsToKnow, thingToWatch, recommendation } = buildLocalizedBriefing(
    language,
    areaName,
    zone
  );

  function operatingWithHealthScoreKey(lang: string) {
    return "operatingWithHealthScore";
  }

  const handleDownloadSummary = () => {
    const timestamp = new Date().toLocaleString();
    const summaryText = `====================================================
CITYMIND AI - ${getTranslation(language, "yourCityBriefing").toUpperCase()} SUMMARY
====================================================
Generated: ${timestamp}
Selected Area: ${areaName}
Zone ID: ${zone.id}
City Health Score: ${zone.healthScore} / 100
Language: ${language.toUpperCase()}

----------------------------------------------------
1. CORE METRICS OVERVIEW
----------------------------------------------------
- Health Score:  ${zone.healthScore} / 100
- Traffic Level: ${zone.traffic}
- Air Quality:   ${zone.aqi} AQI (${zone.aqiStatus.toUpperCase()})
- Temperature:   ${zone.temp}°C (${zone.weather})
- Humidity:      ${zone.humidity}%
- PM2.5 Level:   ${zone.pm25} µg/m³
- Power Demand:  ${zone.energyDemandKw} kW (Renewable: ${zone.renewablePct}%)
- Water Status:  ${zone.waterStatus}
- Flood Risk:    ${zone.floodRiskPct}%

----------------------------------------------------
2. ${getTranslation(language, "threeThingsToKnow")}
----------------------------------------------------
${thingsToKnow.map((item, idx) => `${idx + 1}. ${item}`).join("\n")}

----------------------------------------------------
3. ${getTranslation(language, "oneThingToWatch")}
----------------------------------------------------
* ${thingToWatch}

----------------------------------------------------
4. ${getTranslation(language, "oneRecommendation")}
----------------------------------------------------
* ${recommendation}

====================================================
CityMind AI Living City Interface - Digital Twin Telemetry
====================================================`;

    const blob = new Blob([summaryText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const sanitizedArea = areaName.replace(/[^a-zA-Z0-9]/g, "_");
    link.download = `CityMind_Briefing_${sanitizedArea}_${language}_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#0D1117]/90 border border-white/10 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
      {/* Decorative Gradient Background subtle glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-teal-400 shrink-0" />
          <h2 className="text-xs font-bold tracking-[0.2em] text-teal-400 uppercase">
            {getTranslation(language, "personalizedBriefing")} &bull; {areaName}
          </h2>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleDownloadSummary}
            className="flex items-center gap-1.5 text-[10px] font-bold bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 px-3 py-1 rounded-full border border-teal-500/30 uppercase tracking-wider transition-colors"
            title="Download formatted city health summary text file"
          >
            <Download className="w-3 h-3 text-teal-400" />
            <span>{getTranslation(language, "downloadSummary")}</span>
          </button>
          <span className="text-[10px] font-bold bg-white/5 text-white/50 px-2.5 py-1 rounded-full border border-white/10 uppercase tracking-widest">
            {getTranslation(language, "liveDigitalTwin")}
          </span>
        </div>
      </div>

      {/* Greeting Summary */}
      <p className="text-sm text-white/90 mb-4 leading-relaxed font-medium">
        {greetingStr}. <span className="text-teal-400 font-extrabold">{areaName}</span> {operatingStr}{" "}
        <span className="text-teal-300 font-black">{zone.healthScore}/100</span>.
      </p>

      <div className="space-y-3 text-xs">
        {/* 3 Things to Know */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
          <div className="flex items-center gap-1.5 font-bold text-teal-400 mb-2 uppercase text-[10px] tracking-wider">
            <Info className="w-3.5 h-3.5 text-teal-400" />
            <span>{getTranslation(language, "threeThingsToKnow")}</span>
          </div>
          <ul className="space-y-2 text-white/80 list-disc list-inside leading-relaxed font-medium">
            {thingsToKnow.map((item, idx) => (
              <li key={idx} className="marker:text-teal-400">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* One Thing to Watch */}
        <div className="bg-amber-500/10 rounded-xl p-4 border border-amber-500/20">
          <div className="flex items-center gap-1.5 font-bold text-amber-400 mb-1 uppercase text-[10px] tracking-wider">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>{getTranslation(language, "oneThingToWatch")}</span>
          </div>
          <p className="text-amber-200/90 leading-relaxed font-medium">{thingToWatch}</p>
        </div>

        {/* One Recommendation */}
        <div className="bg-teal-500/10 rounded-xl p-4 border border-teal-500/20">
          <div className="flex items-center gap-1.5 font-bold text-teal-300 mb-1 uppercase text-[10px] tracking-wider">
            <Lightbulb className="w-3.5 h-3.5 text-teal-400" />
            <span>{getTranslation(language, "oneRecommendation")}</span>
          </div>
          <p className="text-teal-100/90 leading-relaxed font-medium">{recommendation}</p>
        </div>
      </div>
    </div>
  );
};
