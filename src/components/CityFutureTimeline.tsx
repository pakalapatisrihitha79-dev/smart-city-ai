import React from "react";
import { useCity } from "../context/CityContext";
import { TimelineHorizon } from "../types";
import {
  Clock,
  HelpCircle,
  Sparkles,
  RotateCcw,
  AlertTriangle,
  TrendingUp,
  Car,
  CloudRain,
  Calendar,
  Construction,
  CheckCircle2,
  ArrowRight,
  Zap,
  Wind,
  Droplets,
} from "lucide-react";

export const CityFutureTimeline: React.FC = () => {
  const {
    currentZone,
    timelineHorizon,
    setTimelineHorizon,
    setIsConfidenceModalOpen,
    openExplainModal,
  } = useCity();

  const horizons: {
    id: TimelineHorizon;
    label: string;
    offset: string;
    confidence: number;
    predictionTitle: string;
    currentStatus: string;
    expectedStatus: string;
    riskTrend: "HIGH" | "ELEVATED" | "MODERATE" | "LOW";
    factors: { label: string; icon: any }[];
    proactiveRecommendation: string;
  }[] = [
    {
      id: "now",
      label: "NOW",
      offset: "Live Real-Time",
      confidence: 98,
      predictionTitle: "Live Synchronized Baseline",
      currentStatus: `${currentZone.trafficSpeed} km/h • ${currentZone.traffic}`,
      expectedStatus: `${currentZone.traffic} Traffic • AQI ${currentZone.aqi}`,
      riskTrend: "MODERATE",
      factors: [
        { label: `${currentZone.weather} Conditions`, icon: CloudRain },
        { label: `AQI ${currentZone.aqi} Sensor Reading`, icon: Wind },
        { label: `37 Citizen Reports Monitored`, icon: Car },
      ],
      proactiveRecommendation: "Maintain active edge sensor telemetry loop across all 5 municipal wards.",
    },
    {
      id: "+30m",
      label: "+30 MIN",
      offset: "30-Minute AI Projection",
      confidence: 87,
      predictionTitle: "30-Minute Commute & Signal Load Prediction",
      currentStatus: "Congestion: Moderate (42 km/h)",
      expectedStatus: "Congestion: HIGH (18 km/h)",
      riskTrend: "HIGH",
      factors: [
        { label: "Incoming Rain Front (+25mm)", icon: CloudRain },
        { label: "School Closing Surge (3:30 PM)", icon: Calendar },
        { label: "4th Avenue Lane Resurfacing", icon: Construction },
        { label: "Stadium Game Inflow (18k tickets)", icon: Calendar },
      ],
      proactiveRecommendation: "Auto-extend East-West green signal duration by +18 seconds and push rerouting alerts to 4,200 commuters.",
    },
    {
      id: "+1h",
      label: "+1 HOUR",
      offset: "1-Hour Forecast",
      confidence: 83,
      predictionTitle: "1-Hour Drainage & Grid Sump Saturation",
      currentStatus: "Sump Level: 58% Capacity",
      expectedStatus: "Sump Level: 88% (Approaching Spillway)",
      riskTrend: "HIGH",
      factors: [
        { label: "Cumulative Runoff in Lowland", icon: Droplets },
        { label: "Stormwater Inflow Velocity 14m³/s", icon: CloudRain },
        { label: "Drain Grate Debris Bottlenecks", icon: Construction },
      ],
      proactiveRecommendation: "Pre-activate Stormwater Pump #4 and issue SMS flash flood advisories for Lowland Underpass.",
    },
    {
      id: "+3h",
      label: "+3 HOURS",
      offset: "Peak Rush Hour AI",
      confidence: 79,
      predictionTitle: "Peak Rush Hour Particulate & Energy Load",
      currentStatus: "Power Demand: 3,840 kW",
      expectedStatus: "Power Demand: 4,920 kW (96% Peak)",
      riskTrend: "ELEVATED",
      factors: [
        { label: "HVAC Cooling Surge (36°C Ambient)", icon: Zap },
        { label: "Diesel Vehicle Exhaust Inversion", icon: Wind },
        { label: "Solar Declining at Twilight", icon: Zap },
      ],
      proactiveRecommendation: "Discharge 850 kW from Municipal Battery Storage and ramp up clean hydro-electric feed.",
    },
    {
      id: "+6h",
      label: "+6 HOURS",
      offset: "Evening Transition",
      confidence: 74,
      predictionTitle: "Nighttime Air Quality Inversion",
      currentStatus: "AQI: 72 (Moderate)",
      expectedStatus: "AQI: 118 (Poor / Smog Trap)",
      riskTrend: "ELEVATED",
      factors: [
        { label: "Atmospheric Boundary Layer Drop", icon: Wind },
        { label: "Freight Corridor Truck Inflow", icon: Car },
      ],
      proactiveRecommendation: "Enforce low-emission zone freight routing and activate roadside misting scrubbers.",
    },
    {
      id: "+12h",
      label: "+12 HOURS",
      offset: "Tomorrow Morning",
      confidence: 68,
      predictionTitle: "Tomorrow Morning Rush Hour Brief",
      currentStatus: "Rain Probability: 35%",
      expectedStatus: "Rain Probability: 72% with Heavy Fog",
      riskTrend: "MODERATE",
      factors: [
        { label: "Early Morning Coastal Fog", icon: CloudRain },
        { label: "Major Downtown Marathon Event", icon: Calendar },
      ],
      proactiveRecommendation: "Pre-schedule additional Metro train frequency and alert school bus networks by 6:00 AM.",
    },
    {
      id: "+24h",
      label: "+7 DAYS",
      offset: "7-Day Resilience Trend",
      confidence: 62,
      predictionTitle: "7-Day Multi-System Climate Resilience Curve",
      currentStatus: "Health Score: 78/100",
      expectedStatus: "Projected Health Score: 84/100 (+6.2%)",
      riskTrend: "LOW",
      factors: [
        { label: "Post-Storm Drainage Stabilization", icon: Droplets },
        { label: "Road Pothole Fix Completions (18)", icon: Construction },
        { label: "Expanded Solar Grid Feeder", icon: Zap },
      ],
      proactiveRecommendation: "Execute scheduled preventive culvert desilting before next weekend weather front.",
    },
  ];

  const currentH = horizons.find((h) => h.id === timelineHorizon) || horizons[1];

  return (
    <div
      id="city-future-timeline"
      className="bg-[#0D1117]/95 border border-cyan-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5 text-xs"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black tracking-wider uppercase text-white font-display">
                "What Will Happen Next?" <span className="text-cyan-400">&bull; Predictive AI Engine</span>
              </h2>
              <span className="text-[9px] font-mono font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/40 tracking-wider uppercase">
                PREDICTIVE &bull; NOT REACTIVE
              </span>
            </div>
            <p className="text-xs text-white/50">
              Transforming raw historical & real-time telemetry into high-confidence future forecasts
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="timeline-confidence-btn"
            onClick={() => setIsConfidenceModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/40 text-cyan-300 rounded-xl text-xs font-bold transition-colors uppercase tracking-wider"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Confidence: {currentH.confidence}%</span>
          </button>

          {timelineHorizon !== "now" && (
            <button
              id="reset-timeline-btn"
              onClick={() => setTimelineHorizon("now")}
              className="flex items-center gap-1 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold border border-white/10 transition-colors uppercase tracking-wider"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Now</span>
            </button>
          )}
        </div>
      </div>

      {/* Horizon Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-1.5 p-1.5 bg-black/60 rounded-2xl border border-white/10">
        {horizons.map((h) => {
          const isActive = timelineHorizon === h.id;
          return (
            <button
              key={h.id}
              onClick={() => setTimelineHorizon(h.id)}
              className={`py-2 px-2 rounded-xl text-center transition-all flex flex-col items-center justify-center gap-0.5 ${
                isActive
                  ? "bg-cyan-500 text-black font-black shadow-lg shadow-cyan-500/20"
                  : "text-white/60 hover:text-white hover:bg-white/5 font-bold"
              }`}
            >
              <span className="text-xs uppercase tracking-wider font-display">{h.label}</span>
              <span className={`text-[9px] font-mono ${isActive ? "text-slate-950 font-bold" : "text-white/40"}`}>
                {h.offset}
              </span>
            </button>
          );
        })}
      </div>

      {/* SIGNATURE "WHAT WILL HAPPEN NEXT" PREDICTIVE SHOWCASE CARD */}
      <div className="bg-gradient-to-br from-[#111C2B] via-[#0D1117] to-[#0A192F] border border-cyan-500/30 rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400 block">
              PREDICTIVE INTELLIGENCE &bull; {currentH.label} HORIZON
            </span>
            <h3 className="text-sm sm:text-base font-extrabold text-white mt-0.5">
              {currentH.predictionTitle}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-white/50 font-mono">FORECAST CONFIDENCE:</span>
            <span className="text-sm font-mono font-black text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded-lg border border-cyan-500/40">
              {currentH.confidence}%
            </span>
          </div>
        </div>

        {/* Instead of Reactive vs Predictive Transformation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Traditional Reactive View */}
          <div className="bg-black/40 border border-white/10 p-3.5 rounded-xl space-y-1.5">
            <span className="text-[9px] font-mono uppercase font-bold text-white/40 block">
              Traditional Reactive View (Current State)
            </span>
            <p className="text-xs font-semibold text-white/80">
              &ldquo;There is moderate traffic and standard weather.&rdquo;
            </p>
            <div className="text-[10px] text-white/50 font-mono pt-1">
              Current: <strong className="text-white/80">{currentH.currentStatus}</strong>
            </div>
          </div>

          {/* CityMind Predictive View */}
          <div className="bg-gradient-to-r from-cyan-950/50 to-teal-950/40 border border-cyan-500/40 p-3.5 rounded-xl space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono uppercase font-bold text-cyan-300 block">
                CityMind Predictive AI (Expected State)
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/30 uppercase font-mono">
                Risk: {currentH.riskTrend}
              </span>
            </div>
            <p className="text-xs font-black text-white">
              {currentH.expectedStatus}
            </p>
            <div className="text-[10px] text-cyan-200 font-mono pt-1">
              Confidence: <strong className="text-cyan-300">{currentH.confidence}%</strong> &bull; Causally Modeled
            </div>
          </div>
        </div>

        {/* Contributing Factors Tags */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-white/50 block">
            Key Contributing Causality Factors
          </span>
          <div className="flex flex-wrap gap-2">
            {currentH.factors.map((factor, i) => {
              const IconComp = factor.icon;
              return (
                <div
                  key={i}
                  className="bg-white/5 border border-white/10 hover:border-cyan-500/40 px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-white/90 text-xs font-medium transition-colors"
                >
                  <IconComp className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{factor.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Proactive Recommendation */}
        <div className="bg-teal-950/40 border border-teal-500/40 p-3.5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-teal-300 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4 text-teal-400" />
              <span>Proactive AI Recommended Intervention</span>
            </div>
            <p className="text-[11px] text-white/80 leading-relaxed">
              {currentH.proactiveRecommendation}
            </p>
          </div>

          <button
            onClick={() => openExplainModal("traffic")}
            className="px-3.5 py-2 bg-teal-500 hover:bg-teal-400 text-black font-black rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors uppercase tracking-wider shrink-0"
          >
            <span>Explain Model</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
