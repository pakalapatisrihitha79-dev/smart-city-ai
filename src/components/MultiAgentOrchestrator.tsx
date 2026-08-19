import React from "react";
import { useCity } from "../context/CityContext";
import { getMultiAgentOrchestration } from "../utils/cityEngine";
import {
  Cpu,
  Car,
  CloudRain,
  Wind,
  Droplets,
  Zap,
  Trash2,
  ShieldAlert,
  Building2,
  Leaf,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
} from "lucide-react";

export const MultiAgentOrchestrator: React.FC = () => {
  const { currentZone, demoScenario, timelineHorizon, openExplainModal } = useCity();

  const orchestration = getMultiAgentOrchestration(currentZone, demoScenario, timelineHorizon);

  const getAgentIcon = (iconName: string) => {
    switch (iconName) {
      case "Car":
        return Car;
      case "CloudRain":
        return CloudRain;
      case "Wind":
        return Wind;
      case "Droplets":
        return Droplets;
      case "Zap":
        return Zap;
      case "Trash2":
        return Trash2;
      case "ShieldAlert":
        return ShieldAlert;
      case "Building2":
        return Building2;
      case "Leaf":
        return Leaf;
      default:
        return Cpu;
    }
  };

  return (
    <div
      id="multi-agent-citymind"
      className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 text-xs"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-800 gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black text-white uppercase tracking-wider font-display">
                MULTI-AGENT CITYMIND ORCHESTRATOR
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                9 ACTIVE SPECIALIZED AGENTS
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Distributed intelligence modules continuously synthesizing telemetry
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400 font-mono">
            CONSENSUS: <strong className="text-emerald-400">{orchestration.consensusScore}%</strong>
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </div>
      </div>

      {/* Orchestrator Master Directives */}
      <div className="p-3.5 bg-cyan-950/40 border border-cyan-500/30 rounded-xl space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            SYNTHESIZED ORCHESTRATOR DIRECTIVE
          </span>
          <span className="text-[10px] text-slate-400 font-mono">{orchestration.timestamp}</span>
        </div>
        <p className="text-xs font-bold text-white">{orchestration.orchestratorHeadline}</p>
        <p className="text-[11px] text-slate-300">{orchestration.orchestratorRecommendation}</p>
      </div>

      {/* 9 Specialized Agents Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {orchestration.agents.map((agent) => {
          const IconComp = getAgentIcon(agent.iconName);
          const isAlert = agent.status === "ALERT";
          const isElevated = agent.status === "ELEVATED";

          return (
            <div
              key={agent.id}
              id={`agent-card-${agent.id}`}
              className={`p-3 rounded-xl border transition-all space-y-1.5 ${
                isAlert
                  ? "bg-rose-950/30 border-rose-500/40"
                  : isElevated
                  ? "bg-amber-950/30 border-amber-500/40"
                  : "bg-slate-950/80 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <IconComp
                    className={`w-3.5 h-3.5 ${
                      isAlert ? "text-rose-400" : isElevated ? "text-amber-400" : "text-cyan-400"
                    }`}
                  />
                  <span className="font-bold text-slate-200 text-xs">{agent.name}</span>
                </div>

                <span
                  className={`px-1.5 py-0.5 rounded text-[9px] font-black tracking-wider uppercase ${
                    isAlert
                      ? "bg-rose-950 text-rose-400 border border-rose-800"
                      : isElevated
                      ? "bg-amber-950 text-amber-400 border border-amber-800"
                      : "bg-emerald-950 text-emerald-400 border border-emerald-800"
                  }`}
                >
                  {agent.status}
                </span>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>{agent.keyMetric}</span>
                <span>Conf: {agent.confidence}%</span>
              </div>

              <p className="text-[11px] text-slate-300 line-clamp-2">{agent.finding}</p>

              <div className="pt-1 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] text-cyan-400/90 font-medium line-clamp-1">
                  &bull; {agent.recommendation}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
