import React from "react";
import { motion } from "motion/react";
import { CityZone } from "../types";
import { Activity, Wind, Droplets, Zap, Shield, Car } from "lucide-react";

interface LivingCityPulseProps {
  zone: CityZone;
  onTapScore?: () => void;
}

export const LivingCityPulse: React.FC<LivingCityPulseProps> = ({ zone, onTapScore }) => {
  const isHealthy = zone.healthScore >= 80;
  const isWarning = zone.healthScore >= 60 && zone.healthScore < 80;

  // Colors based on status
  const primaryRingColor = isHealthy
    ? "stroke-emerald-500/60 fill-emerald-500/5"
    : isWarning
    ? "stroke-amber-500/60 fill-amber-500/5"
    : "stroke-rose-500/60 fill-rose-500/5";

  const glowColor = isHealthy
    ? "rgba(16, 185, 129, 0.25)"
    : isWarning
    ? "rgba(245, 158, 11, 0.3)"
    : "rgba(244, 63, 94, 0.35)";

  return (
    <div className="relative flex flex-col items-center justify-center p-6 bg-[#0D1117]/90 border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md">
      {/* Background Living Node Grid */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_2px_2px,rgba(255,255,255,0.1)_1px,transparent_0)] [background-size:24px_24px] pointer-events-none" />

      {/* Title Header */}
      <div className="flex items-center gap-2 mb-4 text-[10px] font-bold tracking-[0.2em] text-teal-400 uppercase">
        <Activity className="w-4 h-4 text-teal-400 animate-pulse" />
        <span>CITY PULSE &bull; {zone.name}</span>
      </div>

      {/* SVG Interactive Living Pulse */}
      <div
        onClick={onTapScore}
        className="relative w-56 h-56 flex items-center justify-center cursor-pointer group"
      >
        <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
          {/* Outer Pulsing Aura Ring */}
          <motion.circle
            cx="100"
            cy="100"
            r="82"
            fill="none"
            stroke={isHealthy ? "#2dd4bf" : isWarning ? "#fbbf24" : "#f43f5e"}
            strokeWidth="1.5"
            strokeDasharray="4 6"
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: isHealthy ? 4 : 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Secondary Inter-system Nodes Ring */}
          <circle cx="100" cy="100" r="68" className={primaryRingColor} strokeWidth="2.5" />

          {/* Metric Arc Indicators */}
          {/* Traffic Arc */}
          <circle
            cx="100"
            cy="100"
            r="54"
            fill="none"
            stroke="#202020"
            strokeWidth="4"
          />
          <circle
            cx="100"
            cy="100"
            r="54"
            fill="none"
            stroke="#2dd4bf"
            strokeWidth="4"
            strokeDasharray="60 280"
            strokeLinecap="round"
          />
          {/* AQI Arc */}
          <circle
            cx="100"
            cy="100"
            r="54"
            fill="none"
            stroke="#4ade80"
            strokeWidth="4"
            strokeDasharray="50 280"
            strokeDashoffset="-80"
            strokeLinecap="round"
          />
          {/* Water Arc */}
          <circle
            cx="100"
            cy="100"
            r="54"
            fill="none"
            stroke="#22d3ee"
            strokeWidth="4"
            strokeDasharray="45 280"
            strokeDashoffset="-150"
            strokeLinecap="round"
          />
          {/* Energy Arc */}
          <circle
            cx="100"
            cy="100"
            r="54"
            fill="none"
            stroke="#fbbf24"
            strokeWidth="4"
            strokeDasharray="40 280"
            strokeDashoffset="-210"
            strokeLinecap="round"
          />
        </svg>

        {/* Center Score Core */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="flex flex-col items-center"
          >
            <span
              className={`text-6xl font-black block leading-none font-display ${
                isHealthy ? "text-teal-400" : isWarning ? "text-amber-400" : "text-rose-400"
              }`}
            >
              {zone.healthScore}
            </span>
            <span className="text-[10px] uppercase tracking-widest text-white/40 mt-1 font-bold">
              Health Score
            </span>
          </motion.div>
          <span className="text-[11px] font-bold text-white/80 mt-1 uppercase tracking-wider">
            {isHealthy ? "Operating Normally" : isWarning ? "Moderate Attention" : "High Risk Advisory"}
          </span>
          <span className="text-[9px] font-bold text-teal-400/80 mt-1 uppercase tracking-widest group-hover:text-teal-300 transition-colors">
            Tap to Explain →
          </span>
        </div>
      </div>

      {/* Peripheral Living Node Badges */}
      <div className="grid grid-cols-3 gap-2 w-full mt-5 text-xs">
        <div className="flex items-center gap-2 p-2.5 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
          <Car className="w-3.5 h-3.5 text-teal-400 shrink-0" />
          <div className="overflow-hidden">
            <div className="text-[9px] font-bold uppercase text-white/40 tracking-wider">Traffic</div>
            <div className="font-extrabold text-white truncate text-xs">{zone.traffic}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2.5 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
          <Wind className="w-3.5 h-3.5 text-green-400 shrink-0" />
          <div className="overflow-hidden">
            <div className="text-[9px] font-bold uppercase text-white/40 tracking-wider">AQI</div>
            <div className="font-extrabold text-white truncate text-xs">{zone.aqi} AQI</div>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2.5 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
          <Droplets className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <div className="overflow-hidden">
            <div className="text-[9px] font-bold uppercase text-white/40 tracking-wider">Water</div>
            <div className="font-extrabold text-white truncate text-xs">{zone.waterStatus}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
