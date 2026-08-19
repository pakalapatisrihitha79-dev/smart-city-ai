import React, { useState } from "react";
import { useCity } from "../context/CityContext";
import { Bell, AlertTriangle, Plus, ShieldAlert, Check, X } from "lucide-react";

export const CityAlertsCenter: React.FC = () => {
  const { cityAlerts, alertRules, addAlertRule, currentZone } = useCity();

  const [filterCategory, setFilterCategory] = useState<string>("ALL");
  const [showRuleModal, setShowRuleModal] = useState(false);

  // New Rule Form
  const [ruleMetric, setRuleMetric] = useState<"AQI" | "Rainfall" | "Traffic" | "Water">("AQI");
  const [ruleThreshold, setRuleThreshold] = useState<number>(100);

  const filteredAlerts = cityAlerts.filter((a) => {
    if (filterCategory === "ALL") return true;
    return a.category.toUpperCase() === filterCategory;
  });

  const handleCreateRule = () => {
    addAlertRule({
      areaId: currentZone.id,
      areaName: currentZone.name,
      metric: ruleMetric,
      operator: ">",
      threshold: ruleThreshold,
      enabled: true,
    });
    setShowRuleModal(false);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 text-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-400" />
            CITY ALERTS & CUSTOM RULE ENGINE
          </h2>
          <p className="text-xs text-slate-400">Real-time emergency & sensor threshold notifications</p>
        </div>

        <button
          onClick={() => setShowRuleModal(true)}
          className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 shadow transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Alert Rule</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 overflow-x-auto no-scrollbar font-bold">
        {["ALL", "EMERGENCY", "WEATHER", "TRAFFIC", "WATER", "AIR"].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap border transition-colors ${
              filterCategory === cat
                ? "bg-amber-950 border-amber-500 text-amber-300 font-extrabold"
                : "bg-slate-800/80 border-slate-700/60 text-slate-400 hover:text-slate-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Alerts Feed */}
      <div className="space-y-2.5">
        {filteredAlerts.map((alert) => {
          const isEmergency = alert.severity === "Emergency";
          const isHigh = alert.severity === "High";

          return (
            <div
              key={alert.id}
              className={`p-3.5 rounded-xl border space-y-1 ${
                isEmergency
                  ? "bg-rose-950/40 border-rose-800/80 text-rose-200"
                  : isHigh
                  ? "bg-amber-950/30 border-amber-800/60 text-amber-200"
                  : "bg-slate-950/80 border-slate-800 text-slate-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-100 flex items-center gap-1.5 text-xs">
                  <AlertTriangle
                    className={`w-3.5 h-3.5 ${
                      isEmergency ? "text-rose-400" : isHigh ? "text-amber-400" : "text-blue-400"
                    }`}
                  />
                  {alert.title}
                </span>

                <span className="text-[10px] opacity-70">{alert.timestamp}</span>
              </div>

              <p className="text-[11px] leading-relaxed opacity-90">{alert.message}</p>

              <div className="flex items-center gap-2 text-[10px] opacity-75 pt-1">
                <span>Area: {alert.areaName}</span>
                <span>•</span>
                <span>Category: {alert.category}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* CUSTOM RULES LIST */}
      <div className="pt-3 border-t border-slate-800 space-y-2">
        <span className="font-bold text-slate-300 text-xs block uppercase tracking-wider">
          ACTIVE CUSTOM ALERT RULES
        </span>
        <div className="space-y-1.5">
          {alertRules.map((rule) => (
            <div
              key={rule.id}
              className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-slate-300"
            >
              <div>
                <span className="font-bold text-cyan-400">
                  IF {rule.metric} {rule.operator} {rule.threshold}
                </span>
                <span className="text-slate-400 text-[10px] block">Area: {rule.areaName}</span>
              </div>
              <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded font-bold border border-emerald-800">
                ACTIVE
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* CREATE ALERT RULE MODAL */}
      {showRuleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-5 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-bold text-slate-100 text-sm">CREATE CUSTOM ALERT RULE</span>
              <button onClick={() => setShowRuleModal(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">SELECT SENSOR METRIC</label>
                <select
                  value={ruleMetric}
                  onChange={(e) => setRuleMetric(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                >
                  <option value="AQI">Air Quality Index (AQI)</option>
                  <option value="Rainfall">Rainfall Intensity (mm)</option>
                  <option value="Traffic">Traffic Congestion Index</option>
                  <option value="Water">Water Consumption Anomaly</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">THRESHOLD VALUE</label>
                <input
                  type="number"
                  value={ruleThreshold}
                  onChange={(e) => setRuleThreshold(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <p className="text-[10px] text-slate-400">
                Rule target area: <strong className="text-cyan-400">{currentZone.name}</strong>
              </p>
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowRuleModal(false)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRule}
                className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 rounded-xl"
              >
                CREATE RULE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
