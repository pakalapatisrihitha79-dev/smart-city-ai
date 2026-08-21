import React, { useState, useEffect } from "react";
import {
  Wifi,
  WifiOff,
  RefreshCw,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Server,
  Radio,
  ChevronDown,
} from "lucide-react";

export const IntelligenceGridStatus: React.FC = () => {
  const [status, setStatus] = useState<"connected" | "reconnecting" | "interrupted">("connected");
  const [latency, setLatency] = useState<number>(14);
  const [eventsPerSec, setEventsPerSec] = useState<number>(1240);
  const [lastSync, setLastSync] = useState<string>("Just now");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(0);
  const [activeNodes, setActiveNodes] = useState<number>(64);

  // Subtle live fluctuation of latency & event stream
  useEffect(() => {
    if (status !== "connected") return;

    const interval = setInterval(() => {
      setLatency(Math.floor(11 + Math.random() * 8)); // 11-18ms
      setEventsPerSec(Math.floor(1200 + Math.random() * 80));
      setLastSync("Just now");
    }, 4000);

    return () => clearInterval(interval);
  }, [status]);

  // Handle auto-reconnect countdown when interrupted
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (status === "interrupted" && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (status === "interrupted" && countdown === 0) {
      triggerReconnect();
    }
    return () => clearTimeout(timer);
  }, [status, countdown]);

  const triggerReconnect = () => {
    setStatus("reconnecting");
    setCountdown(0);

    setTimeout(() => {
      setStatus("connected");
      setLatency(12);
      setActiveNodes(64);
    }, 1800);
  };

  const simulateInterruption = () => {
    setStatus("interrupted");
    setCountdown(4); // 4-second auto-reconnect countdown
    setActiveNodes(42);
  };

  return (
    <div className="relative inline-block text-xs">
      {/* Subtle Status Pill */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`px-2.5 py-1.5 rounded-xl border flex items-center gap-1.5 font-mono text-[11px] font-bold transition-all shadow-sm ${
          status === "connected"
            ? "bg-emerald-950/40 hover:bg-emerald-950/70 border-emerald-500/30 text-emerald-300"
            : status === "reconnecting"
            ? "bg-amber-950/50 border-amber-500/40 text-amber-300 animate-pulse"
            : "bg-rose-950/60 border-rose-500/50 text-rose-300 animate-pulse"
        }`}
        title="NovaCity Intelligence Grid Stream Status"
      >
        {/* Pulsing Status Dot / Icon */}
        {status === "connected" && (
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
        )}

        {status === "reconnecting" && (
          <RefreshCw className="w-3 h-3 text-amber-400 animate-spin" />
        )}

        {status === "interrupted" && (
          <WifiOff className="w-3 h-3 text-rose-400" />
        )}

        {/* Text description */}
        <span className="hidden sm:inline font-black tracking-wider uppercase text-[10px]">
          {status === "connected"
            ? "NovaGrid Live"
            : status === "reconnecting"
            ? "Reconnecting..."
            : "Stream Stalled"}
        </span>

        {status === "connected" && (
          <span className="text-[10px] text-emerald-400/80 font-mono hidden md:inline">
            {latency}ms
          </span>
        )}

        {status === "interrupted" && (
          <span className="text-[10px] text-rose-300 font-mono">
            ({countdown}s)
          </span>
        )}

        <ChevronDown
          className={`w-3 h-3 text-white/50 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Popover Card */}
      {isOpen && (
        <>
          {/* Backdrop click dismiss */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-[#0D1117]/95 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl p-4 z-50 space-y-3.5 text-xs text-white animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center">
                  <Radio className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="font-black text-white uppercase tracking-wider text-xs font-display">
                    NovaCity Intelligence Grid
                  </h4>
                  <p className="text-[10px] text-white/50 font-mono">
                    Edge IoT Gateway Protocol v4.2
                  </p>
                </div>
              </div>

              <span
                className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider ${
                  status === "connected"
                    ? "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                    : status === "reconnecting"
                    ? "bg-amber-950 text-amber-300 border border-amber-500/40"
                    : "bg-rose-950 text-rose-300 border border-rose-500/40"
                }`}
              >
                {status === "connected"
                  ? "Synchronized"
                  : status === "reconnecting"
                  ? "Handshake"
                  : "Disconnected"}
              </span>
            </div>

            {/* Live Metrics Grid */}
            <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
              <div className="bg-black/50 p-2.5 rounded-xl border border-white/5 space-y-0.5">
                <span className="text-[9px] text-white/40 uppercase block">
                  Latency Ping
                </span>
                <span
                  className={`font-black text-sm ${
                    status === "connected"
                      ? "text-emerald-400"
                      : "text-rose-400"
                  }`}
                >
                  {status === "connected" ? `${latency} ms` : "Timeout"}
                </span>
              </div>

              <div className="bg-black/50 p-2.5 rounded-xl border border-white/5 space-y-0.5">
                <span className="text-[9px] text-white/40 uppercase block">
                  IoT Gateways
                </span>
                <span className="font-black text-sm text-cyan-400">
                  {activeNodes} / 64 Active
                </span>
              </div>

              <div className="bg-black/50 p-2.5 rounded-xl border border-white/5 space-y-0.5">
                <span className="text-[9px] text-white/40 uppercase block">
                  Packet Stream
                </span>
                <span className="font-black text-sm text-teal-400">
                  {status === "connected" ? `${eventsPerSec} evt/s` : "0 evt/s"}
                </span>
              </div>

              <div className="bg-black/50 p-2.5 rounded-xl border border-white/5 space-y-0.5">
                <span className="text-[9px] text-white/40 uppercase block">
                  Last Telemetry
                </span>
                <span className="font-black text-sm text-purple-400">
                  {status === "connected" ? lastSync : "Stalled"}
                </span>
              </div>
            </div>

            {/* Interruption Notification & Auto-reconnect banner */}
            {status === "interrupted" && (
              <div className="bg-rose-950/40 border border-rose-500/40 p-2.5 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-rose-300 font-bold text-[11px]">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>Telemetry stream interrupted</span>
                </div>
                <p className="text-[10px] text-white/70">
                  Automatic failover reconnect scheduled in{" "}
                  <span className="font-bold text-rose-400 font-mono">
                    {countdown}s
                  </span>
                  ...
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-1 flex items-center gap-2">
              {status !== "connected" ? (
                <button
                  onClick={triggerReconnect}
                  disabled={status === "reconnecting"}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-black font-extrabold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/20 transition-all"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${
                      status === "reconnecting" ? "animate-spin" : ""
                    }`}
                  />
                  <span>
                    {status === "reconnecting"
                      ? "Reconnecting..."
                      : "Reconnect Now"}
                  </span>
                </button>
              ) : (
                <div className="w-full flex gap-1.5">
                  <button
                    onClick={triggerReconnect}
                    className="flex-1 py-1.5 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 font-bold rounded-xl text-[11px] uppercase tracking-wider flex items-center justify-center gap-1 transition-all"
                  >
                    <RefreshCw className="w-3 h-3 text-teal-400" />
                    <span>Ping Grid</span>
                  </button>

                  <button
                    onClick={simulateInterruption}
                    className="py-1.5 px-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold rounded-xl text-[10px] uppercase tracking-wider transition-all"
                    title="Simulate data interruption to test auto-recovery"
                  >
                    Simulate Cut
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
