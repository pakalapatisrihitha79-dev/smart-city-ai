import React, { useState } from "react";
import { useCity } from "../context/CityContext";
import { DemoScenarioType } from "../types";
import { Play, FastForward, CloudRain, Sun, Car, Wind, Droplets, X, Compass, AlertTriangle } from "lucide-react";

interface DemoControlCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoControlCenterModal: React.FC<DemoControlCenterModalProps> = ({ isOpen, onClose }) => {
  const { currentScenario, setScenario, simulatedTime, setSimulatedTime } = useCity();

  if (!isOpen) return null;

  const scenarios: { id: DemoScenarioType; name: string; desc: string; icon: any }[] = [
    {
      id: "normal",
      name: "Normal City Operating Day",
      desc: "Balanced traffic, normal AQI, stable water and energy grids.",
      icon: Sun,
    },
    {
      id: "heavy_rain",
      name: "Heavy Rain & Flood Warning",
      desc: "Precipitation triggers drainage load, low-lying flood risk increases.",
      icon: CloudRain,
    },
    {
      id: "heavy_traffic",
      name: "Peak Evening Traffic Jam",
      desc: "Corridor volume spikes, transit bus lanes prioritized.",
      icon: Car,
    },
    {
      id: "high_pollution",
      name: "Industrial Air Quality Anomaly",
      desc: "PM2.5 spike in Industrial District dispersing towards Central.",
      icon: Wind,
    },
    {
      id: "water_anomaly",
      name: "Municipal Water Pipe Leak",
      desc: "Water Watch sensors detect pressure drop & 28% consumption surge.",
      icon: Droplets,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-5 shadow-2xl relative flex flex-col max-h-[90vh] text-xs">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Compass className="w-5 h-5 text-amber-400" />
              DEMO CONTROL CENTER & TIME TRAVEL
            </h2>
            <p className="text-xs text-slate-400">Trigger simulated city conditions for presentation & testing</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-200 bg-slate-800 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto my-4 space-y-4 pr-1">
          {/* GUIDED DEMO SCENARIO BANNER */}
          <div className="bg-amber-950/40 border border-amber-800/60 p-3.5 rounded-xl space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-amber-300">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>RECOMMENDED GUIDED DEMO STORY</span>
            </div>
            <p className="text-amber-200/90 text-[11px] leading-relaxed">
              Select <strong>"Heavy Rain & Flood Warning"</strong> to demonstrate how rain cascading physics automatically increase traffic congestion risk, alert flood radar, and generate Copilot advisories!
            </p>
          </div>

          {/* Time Machine Fast-Forward */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <FastForward className="w-4 h-4 text-cyan-400" />
                SIMULATED TIME OF DAY
              </span>
              <span className="font-bold text-cyan-400 font-mono">
                {typeof simulatedTime === "string"
                  ? simulatedTime
                  : (simulatedTime as any)?.toLocaleTimeString
                  ? (simulatedTime as any).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                  : String(simulatedTime || "08:30 AM")}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "08:30 AM (Morning Peak)", value: "08:30 AM" },
                { label: "02:00 PM (Afternoon)", value: "02:00 PM" },
                { label: "08:00 PM (Evening Peak)", value: "08:00 PM" },
              ].map((t) => (
                <button
                  key={t.value}
                  onClick={() => setSimulatedTime(t.value)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-1.5 rounded-lg border border-slate-700 text-[10px]"
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Presets Grid */}
          <div className="space-y-2">
            <span className="font-bold text-slate-300 uppercase tracking-wider text-[10px] block">
              CHOOSE DEMO SCENARIO PRESET
            </span>
            <div className="space-y-2">
              {scenarios.map((scen) => {
                const IconComp = scen.icon;
                const isSelected = currentScenario === scen.id;

                return (
                  <div
                    key={scen.id}
                    onClick={() => setScenario(scen.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      isSelected
                        ? "bg-amber-950/40 border-amber-500 text-amber-200 shadow-md"
                        : "bg-slate-800/60 hover:bg-slate-800 border-slate-700/60 text-slate-300"
                    }`}
                  >
                    <IconComp className={`w-5 h-5 mt-0.5 shrink-0 ${isSelected ? "text-amber-400" : "text-slate-400"}`} />
                    <div className="flex-1">
                      <div className="font-bold text-slate-100 flex items-center justify-between">
                        <span>{scen.name}</span>
                        {isSelected && (
                          <span className="text-[9px] bg-amber-500 text-slate-950 font-bold px-2 py-0.5 rounded">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{scen.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <button
          onClick={onClose}
          className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2.5 rounded-xl transition-colors"
        >
          APPLY SCENARIO & RETURN TO CITY INTERFACE
        </button>
      </div>
    </div>
  );
};
