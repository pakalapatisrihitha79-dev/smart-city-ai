import React, { useState } from "react";
import { useCity } from "../context/CityContext";
import { CityZone } from "../types";
import { X, Award, Check } from "lucide-react";

interface AreaCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AreaCompareModal: React.FC<AreaCompareModalProps> = ({ isOpen, onClose }) => {
  const { allZones } = useCity();

  // Selected zone IDs for comparison (default central, riverside, zone-4)
  const [selectedZoneIds, setSelectedZoneIds] = useState<string[]>(["central", "riverside", "zone-4"]);

  if (!isOpen) return null;

  const compareZones = allZones.filter((z) => selectedZoneIds.includes(z.id));

  // Determine best area based on Health Score
  const bestZone = compareZones.reduce((prev, current) =>
    current.healthScore > prev.healthScore ? current : prev
  , compareZones[0] || allZones[0]);

  const toggleZoneSelect = (id: string) => {
    if (selectedZoneIds.includes(id)) {
      if (selectedZoneIds.length > 2) {
        setSelectedZoneIds(selectedZoneIds.filter((zId) => zId !== id));
      }
    } else {
      if (selectedZoneIds.length < 4) {
        setSelectedZoneIds([...selectedZoneIds, id]);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-3xl rounded-2xl p-5 shadow-2xl relative flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              COMPARE AREAS — NOVACITY
            </h2>
            <p className="text-xs text-slate-400">Select 2–4 areas for side-by-side smart city intelligence</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-200 bg-slate-800 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Zone Selector Chips */}
        <div className="flex flex-wrap gap-1.5 my-3">
          {allZones.map((z) => {
            const isSelected = selectedZoneIds.includes(z.id);
            return (
              <button
                key={z.id}
                onClick={() => toggleZoneSelect(z.id)}
                className={`text-xs px-2.5 py-1 rounded-lg border flex items-center gap-1 transition-colors ${
                  isSelected
                    ? "bg-cyan-950 border-cyan-500 text-cyan-300 font-bold"
                    : "bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200"
                }`}
              >
                {isSelected && <Check className="w-3 h-3 text-cyan-400" />}
                <span>{z.name}</span>
              </button>
            );
          })}
        </div>

        {/* BEST CURRENT AREA HIGHLIGHT */}
        {bestZone && (
          <div className="bg-gradient-to-r from-emerald-950/60 to-cyan-950/60 border border-emerald-800/60 p-3 rounded-xl my-2 text-xs flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                <Award className="w-4 h-4" />
                <span>BEST CURRENT AREA: {bestZone.name.toUpperCase()}</span>
              </div>
              <p className="text-slate-300 text-[11px] mt-0.5">
                Highest City Health Score ({bestZone.healthScore}/100) with favorable air quality ({bestZone.aqi} AQI) and low congestion.
              </p>
            </div>
            <span className="bg-emerald-500 text-slate-950 font-black px-3 py-1 rounded-lg text-xs shrink-0">
              {bestZone.healthScore} PTS
            </span>
          </div>
        )}

        {/* Comparison Matrix Table */}
        <div className="flex-1 overflow-x-auto my-2 border border-slate-800 rounded-xl">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
              <tr>
                <th className="p-3">Metric</th>
                {compareZones.map((z) => (
                  <th key={z.id} className="p-3">
                    <div className="font-bold text-slate-100">{z.name}</div>
                    <div className="text-[9px] text-slate-400 lowercase">{z.type}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              <tr>
                <td className="p-3 font-semibold text-slate-400">Health Score</td>
                {compareZones.map((z) => (
                  <td key={z.id} className="p-3 font-bold text-emerald-400">
                    {z.healthScore} / 100
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-semibold text-slate-400">Traffic</td>
                {compareZones.map((z) => (
                  <td key={z.id} className="p-3 font-semibold text-blue-400">
                    {z.traffic}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-semibold text-slate-400">Air Quality</td>
                {compareZones.map((z) => (
                  <td key={z.id} className="p-3">
                    <span className="font-bold text-slate-200">{z.aqi} AQI</span>{" "}
                    <span className="text-[10px] text-slate-400">({z.aqiStatus})</span>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-semibold text-slate-400">Weather</td>
                {compareZones.map((z) => (
                  <td key={z.id} className="p-3 text-slate-300">
                    {z.weather}, {z.temp}°C
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-semibold text-slate-400">Water Status</td>
                {compareZones.map((z) => (
                  <td key={z.id} className="p-3 text-cyan-300">
                    {z.waterStatus}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-semibold text-slate-400">Energy Renewable</td>
                {compareZones.map((z) => (
                  <td key={z.id} className="p-3 text-amber-300 font-semibold">
                    {z.renewablePct}%
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-semibold text-slate-400">Safety Risk</td>
                {compareZones.map((z) => (
                  <td key={z.id} className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        z.safetyRisk === "Low Risk"
                          ? "bg-emerald-950 text-emerald-400"
                          : "bg-rose-950 text-rose-400"
                      }`}
                    >
                      {z.safetyRisk}
                    </span>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
