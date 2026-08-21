import React, { useState } from "react";
import { useCity } from "../context/CityContext";
import { CityHistoricalPattern } from "../types";
import {
  Brain,
  History,
  TrendingUp,
  Calendar,
  Clock,
  Sparkles,
  AlertTriangle,
  Layers,
  Car,
  CloudRain,
  Trash2,
  Zap,
  CheckCircle2,
  Filter,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Database,
} from "lucide-react";

export const CityMemory: React.FC = () => {
  const { currentZone, allZones } = useCity();

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [simDay, setSimDay] = useState<string>("Friday");
  const [simTime, setSimTime] = useState<string>("18:00");
  const [simLoading, setSimLoading] = useState<boolean>(false);
  const [simulatedRecurrence, setSimulatedRecurrence] = useState<{
    zone: string;
    risk: string;
    description: string;
    causes: string[];
    action: string;
    confidence: number;
  } | null>({
    zone: "Zone 4 (Lowland District)",
    risk: "CRITICAL RECURRING CONGESTION",
    description: "Every Friday between 5–7 PM, Zone 4 experiences heavy gridlock due to evening office egress combined with the central flyover bottleneck.",
    causes: [
      "52-Week Traffic Corpus: Friday 17:30-19:00 average delay is +38 minutes",
      "Historical Citizen Complaints: 142 reports of blocked intersections",
      "Transit Telemetry: Bus line 14 & 22 experience 40% headway stretching",
    ],
    action: "Pre-emptively extend dynamic green light timing on Central Radial by +22 seconds at 16:45 PM and alert 3,800 commuters to take North Bypass.",
    confidence: 94,
  });

  const historicalPatterns: CityHistoricalPattern[] = [
    {
      id: "pat-1",
      title: "Friday Evening Commute Bottleneck",
      dayOfWeek: "Friday",
      timeWindow: "17:00 – 19:30",
      zoneId: "zone-4",
      zoneName: "Zone 4 (Lowland District)",
      recurrenceRatePct: 92,
      confidenceScore: 95,
      category: "Traffic",
      triggerSources: [
        "Historical 52-week traffic sensor logs",
        "Weekend office egress peaks",
        "Commercial district exit queues",
      ],
      predictedImpact: "Corridor vehicle speeds drop to 11 km/h; average delay increases by +34 minutes.",
      proactivePlaybook: "Trigger automated Green-Wave Signal Phase #4 at 16:45 PM; deploy municipal traffic wardens to 4th Cross.",
    },
    {
      id: "pat-2",
      title: "Monsoon Underpass Waterlogging Cascade",
      dayOfWeek: "Monsoon Season (Any Day)",
      timeWindow: "Rainfall > 25 mm/h",
      zoneId: "zone-4",
      zoneName: "Zone 4 (Lowland Basin)",
      recurrenceRatePct: 96,
      confidenceScore: 98,
      category: "Drainage",
      triggerSources: [
        "IoT Drainage Sump Level Transducers",
        "Doppler Weather Radar Precipitation data",
        "Historical Municipal Inundation Registry",
      ],
      predictedImpact: "Culvert saturation reaches 95% within 30 minutes; standing water reaches 35cm in Underpass Lane 1.",
      proactivePlaybook: "Pre-activate Automated Submersible Sump Pump #2 and #4; raise warning barrier at lower ramp.",
    },
    {
      id: "pat-3",
      title: "Monday School Re-opening Morning Rush",
      dayOfWeek: "Monday",
      timeWindow: "07:45 – 09:15",
      zoneId: "zone-1",
      zoneName: "Zone 1 (Downtown)",
      recurrenceRatePct: 86,
      confidenceScore: 91,
      category: "Traffic",
      triggerSources: [
        "Municipal Academic Calendar API",
        "School Bus GPS Fleets",
        "Historical Monday Morning Traffic telemetry",
      ],
      predictedImpact: "North Radial Connector queue length extends by +480m during drop-off window.",
      proactivePlaybook: "Designate dedicated temporary bus drop-off contraflow corridor along 3rd Boulevard.",
    },
    {
      id: "pat-4",
      title: "Weekend Commercial Solid Waste Surge",
      dayOfWeek: "Saturday & Sunday",
      timeWindow: "20:00 – 23:30",
      zoneId: "zone-2",
      zoneName: "Zone 2 (Arts District)",
      recurrenceRatePct: 82,
      confidenceScore: 89,
      category: "Waste",
      triggerSources: [
        "Optical Smart Bin Fill-Level Sensors",
        "Restaurant & Food Court Footfall analytics",
        "Citizen Littering Reports history",
      ],
      predictedImpact: "Commercial bin fill levels surge from 45% to 96% within 3 hours, causing sidewalk overflow.",
      proactivePlaybook: "Schedule automated secondary compactor vehicle collection loop at 19:30 PM.",
    },
    {
      id: "pat-5",
      title: "Summer Afternoon Substation Heat & Grid Peak",
      dayOfWeek: "Peak Summer Days",
      timeWindow: "14:00 – 17:00 (Temp > 38°C)",
      zoneId: "industrial",
      zoneName: "Zone 9 (Industrial Corridor)",
      recurrenceRatePct: 88,
      confidenceScore: 93,
      category: "Energy",
      triggerSources: [
        "Smart Grid Substation Thermal Sensors",
        "Commercial HVAC draw telemetry",
        "Rooftop Solar inverters",
      ],
      predictedImpact: "Transformer core temperature reaches 78°C; risk of localized brownout increases to 62%.",
      proactivePlaybook: "Switch industrial cold-storage units to automated battery buffer and trigger cooling mist fans.",
    },
    {
      id: "pat-6",
      title: "Post-Rain Air Stagnation & PM2.5 Spike",
      dayOfWeek: "Winter Mornings",
      timeWindow: "05:30 – 08:30",
      zoneId: "industrial",
      zoneName: "Zone 9 (Industrial Valley)",
      recurrenceRatePct: 79,
      confidenceScore: 87,
      category: "Pollution",
      triggerSources: [
        "Laser Optical PM2.5 Micro-Sensors",
        "Atmospheric Temperature Inversion models",
        "Wind Anemometer telemetry",
      ],
      predictedImpact: "Thermal inversion traps particulates near ground level; AQI spikes to 165 (Unhealthy).",
      proactivePlaybook: "Dispatch municipal smog-gun misting trucks along Industrial Ring Road at 05:00 AM.",
    },
  ];

  const filteredPatterns = historicalPatterns.filter(
    (p) => selectedCategory === "ALL" || p.category.toUpperCase() === selectedCategory.toUpperCase()
  );

  const handleRunDayTimePrediction = () => {
    setSimLoading(true);
    setTimeout(() => {
      if (simDay === "Friday") {
        setSimulatedRecurrence({
          zone: "Zone 4 (Lowland Basin)",
          risk: "CRITICAL RECURRING CONGESTION",
          description: "Every Friday between 5–7 PM, Zone 4 experiences heavy congestion (confidence: 94%).",
          causes: [
            "Previous Traffic: 52 Friday logs show 3.4x congestion spike",
            "Weekend Outflow: 18,000 vehicles traversing Central Connector",
            "Citizen Complaints: 42 recurring reports of signal bottleneck",
          ],
          action: "Pre-emptively trigger Signal Phase #7 (+22s green wave) at 16:45 PM and divert transit to Ridge Bypass.",
          confidence: 94,
        });
      } else if (simDay === "Monday") {
        setSimulatedRecurrence({
          zone: "Zone 1 (Downtown)",
          risk: "MORNING SCHOOL & TRANSIT SURGE",
          description: "Every Monday 07:45-09:15 AM, downtown school zone experiences heavy corridor queueing.",
          causes: [
            "Academic Calendar: 6 primary & secondary schools opening simultaneously",
            "Bus Fleet GPS: 45 school buses entering 2nd Avenue corridor",
          ],
          action: "Enact temporary school drop-off contraflow lane and dispatch transit marshals.",
          confidence: 91,
        });
      } else if (simDay === "Saturday" || simDay === "Sunday") {
        setSimulatedRecurrence({
          zone: "Zone 2 (Uptown & Arts)",
          risk: "COMMERCIAL FOOTFALL & SOLID WASTE SPIKE",
          description: "Weekend evening commercial activity triggers rapid waste container saturation.",
          causes: [
            "Smart Bin Fill Rate: +14% per hour after 19:00",
            "Pedestrian Footfall: 32,000 visitors in Arts District",
          ],
          action: "Schedule automated secondary collection truck loop at 19:30 PM.",
          confidence: 89,
        });
      } else {
        setSimulatedRecurrence({
          zone: "Zone 3 (Central Business)",
          risk: "MIDWEEK COMMUTER NOMINAL FLOW",
          description: "Midweek flow is stable with minor queueing at 3rd Avenue intersection.",
          causes: ["Traffic Sensor Logs: 8% below Friday peaks", "Weather: Mild ambient condition"],
          action: "Maintain standard adaptive AI signal coordination.",
          confidence: 96,
        });
      }
      setSimLoading(false);
    }, 400);
  };

  return (
    <div className="bg-[#0D1117]/95 border border-cyan-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5 text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black text-white uppercase tracking-wider font-display">
                City Memory Engine <span className="text-cyan-400">&bull; Historical AI Patterns</span>
              </h2>
              <span className="text-[9px] font-mono font-bold bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/40">
                52-WEEK MULTI-MODAL LEARNING
              </span>
            </div>
            <p className="text-xs text-white/50">
              CityMind continuously learns from past traffic, weather, complaints, events, closures & seasonal cycles
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-teal-400" />
          <span className="text-teal-400 font-mono font-bold text-xs uppercase">
            1.42M Historical Data Points
          </span>
        </div>
      </div>

      {/* 6 LEARNING DATA SOURCES CALLOUT */}
      <div className="bg-black/40 border border-white/10 rounded-2xl p-4 space-y-2">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 block">
          How City Memory Learns & Predicts (6 Autonomous Cognitive Streams)
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {[
            { label: "Previous Traffic", stat: "52 Weeks Logged", color: "text-blue-400", icon: Car },
            { label: "Weather Radar", stat: "5-Yr Rain Corpus", color: "text-cyan-400", icon: CloudRain },
            { label: "Citizen Complaints", stat: "14,800 Reports", color: "text-rose-400", icon: AlertTriangle },
            { label: "Major Events", stat: "Concerts & Matches", color: "text-purple-400", icon: Calendar },
            { label: "Road Closures", stat: "Audit Trail Sync", color: "text-amber-400", icon: Layers },
            { label: "Seasonal Patterns", stat: "Monsoon & Summer", color: "text-emerald-400", icon: Sparkles },
          ].map((src, idx) => {
            const IconComp = src.icon;
            return (
              <div key={idx} className="bg-[#0D1117] p-2.5 rounded-xl border border-white/5 space-y-1">
                <div className="flex items-center gap-1.5">
                  <IconComp className={`w-3.5 h-3.5 ${src.color}`} />
                  <span className="font-bold text-white text-[11px] truncate">{src.label}</span>
                </div>
                <span className="text-[9px] font-mono text-white/50 block truncate">{src.stat}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* INTERACTIVE "PREDICT RECURRING PROBLEMS" ENGINE */}
      <div className="bg-gradient-to-r from-cyan-950/50 via-[#111C2B] to-teal-950/50 border border-cyan-500/40 p-4 sm:p-5 rounded-2xl space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="font-extrabold text-white text-xs sm:text-sm uppercase tracking-wider">
              Simulate Recurring Problem Predictor
            </span>
          </div>
          <span className="text-[10px] font-mono text-cyan-300">
            Select Day & Time to Query City Memory
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[10px] font-mono font-bold uppercase text-white/50 block mb-1">
              Select Day of Week
            </label>
            <select
              value={simDay}
              onChange={(e) => setSimDay(e.target.value)}
              className="w-full bg-[#0D1117] border border-white/20 rounded-xl px-3 py-2 text-xs font-bold text-white focus:border-cyan-400 outline-none"
            >
              <option value="Monday">Monday (School Re-opening Rush)</option>
              <option value="Tuesday">Tuesday (Regular Midweek)</option>
              <option value="Wednesday">Wednesday (Market Day)</option>
              <option value="Thursday">Thursday (Peak Commercial)</option>
              <option value="Friday">Friday (Evening Weekend Egress)</option>
              <option value="Saturday">Saturday (Arts & Nightlife)</option>
              <option value="Sunday">Sunday (Civic Maintenance)</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-mono font-bold uppercase text-white/50 block mb-1">
              Select Time Window
            </label>
            <select
              value={simTime}
              onChange={(e) => setSimTime(e.target.value)}
              className="w-full bg-[#0D1117] border border-white/20 rounded-xl px-3 py-2 text-xs font-bold text-white focus:border-cyan-400 outline-none"
            >
              <option value="08:00">08:00 AM (Morning Peak)</option>
              <option value="12:00">12:00 PM (Noon Ingress)</option>
              <option value="15:00">03:00 PM (Afternoon Heat)</option>
              <option value="18:00">06:00 PM (Evening Rush Hour)</option>
              <option value="21:00">09:00 PM (Night Commercial)</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleRunDayTimePrediction}
              disabled={simLoading}
              className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/20 uppercase tracking-wider"
            >
              <Brain className="w-4 h-4" />
              <span>{simLoading ? "Querying City Memory..." : "Query Historical Memory"}</span>
            </button>
          </div>
        </div>

        {/* Prediction Output Spotlight */}
        {simulatedRecurrence && (
          <div className="bg-black/60 border border-cyan-500/40 p-4 rounded-xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/40 font-mono font-black text-[10px] uppercase">
                  {simulatedRecurrence.risk}
                </span>
                <span className="font-extrabold text-white text-xs sm:text-sm">
                  {simulatedRecurrence.zone}
                </span>
              </div>
              <div className="flex items-center gap-1 text-cyan-300 font-mono font-bold text-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Historical Confidence: {simulatedRecurrence.confidence}%</span>
              </div>
            </div>

            <p className="text-white/90 text-xs font-bold leading-relaxed">
              &ldquo;{simulatedRecurrence.description}&rdquo;
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              <div className="bg-[#0D1117] p-3 rounded-xl border border-white/5 space-y-1">
                <span className="text-[9px] font-mono text-white/50 uppercase font-bold block">
                  Learned from City Memory Corpus
                </span>
                <ul className="space-y-1 text-white/70 text-[11px] list-disc list-inside">
                  {simulatedRecurrence.causes.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-teal-950/30 p-3 rounded-xl border border-teal-500/30 space-y-1">
                <span className="text-[9px] font-mono text-teal-300 uppercase font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-teal-400" />
                  Pre-emptive AI Mitigation Playbook
                </span>
                <p className="text-teal-100 text-[11px] leading-relaxed font-medium">
                  {simulatedRecurrence.action}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* HISTORICAL PATTERNS CATALOG */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-white/50 block">
              Discovered City Memory Recurrence Rules ({filteredPatterns.length} Patterns Active)
            </span>
          </div>

          {/* Category Filter Chips */}
          <div className="flex gap-1 overflow-x-auto no-scrollbar font-mono text-[10px] font-bold">
            {["ALL", "TRAFFIC", "DRAINAGE", "WASTE", "ENERGY", "POLLUTION"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg border transition-all ${
                  selectedCategory === cat
                    ? "bg-cyan-500 text-black border-cyan-400 font-black"
                    : "bg-white/5 text-white/60 border-white/10 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredPatterns.map((pat) => (
            <div
              key={pat.id}
              className="bg-black/40 border border-white/10 hover:border-cyan-500/40 p-4 rounded-2xl space-y-3 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-white/10 text-cyan-300 border border-white/10">
                      {pat.category}
                    </span>
                    <span className="text-teal-400 font-mono text-[10px] font-bold">
                      {pat.dayOfWeek} &bull; {pat.timeWindow}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-white text-xs sm:text-sm mt-1">{pat.title}</h3>
                  <span className="text-white/50 text-[11px] block">{pat.zoneName}</span>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-black font-mono text-cyan-400">{pat.recurrenceRatePct}%</div>
                  <span className="text-[8px] font-mono text-white/40 uppercase">Recurrence</span>
                </div>
              </div>

              {/* Data Sources used to detect pattern */}
              <div className="bg-[#0D1117] p-2.5 rounded-xl border border-white/5 space-y-1">
                <span className="text-[9px] font-mono text-white/40 uppercase font-bold block">
                  Sensor & Data Correlation Feeds
                </span>
                <div className="flex flex-wrap gap-1">
                  {pat.triggerSources.map((src, i) => (
                    <span
                      key={i}
                      className="text-[9px] font-mono bg-white/5 text-white/70 px-2 py-0.5 rounded border border-white/5"
                    >
                      {src}
                    </span>
                  ))}
                </div>
              </div>

              {/* Predicted Impact & Playbook */}
              <div className="bg-cyan-950/20 p-2.5 rounded-xl border border-cyan-500/20 space-y-1 text-xs">
                <div className="text-white/80 text-[11px]">
                  <strong className="text-amber-400">Impact:</strong> {pat.predictedImpact}
                </div>
                <div className="text-teal-200 text-[11px] pt-0.5">
                  <strong className="text-teal-400">Automated Response:</strong> {pat.proactivePlaybook}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
