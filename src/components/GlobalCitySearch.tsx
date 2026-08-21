import React, { useState, useEffect, useRef } from "react";
import { useCity } from "../context/CityContext";
import {
  Search,
  MapPin,
  Sparkles,
  Layers,
  Compass,
  Building2,
  Coins,
  RefreshCw,
  Droplets,
  Flame,
  Trash2,
  Siren,
  Activity,
  Bot,
  Sliders,
  Camera,
  Navigation,
  Wind,
  ShieldAlert,
  History,
  Bell,
  Award,
  SlidersHorizontal,
  Globe,
  User,
  ArrowRight,
  X,
  Zap,
  CornerDownLeft,
  CheckCircle2,
  Command,
} from "lucide-react";

interface GlobalCitySearchProps {
  onSelectTab?: (tab: string) => void;
  onOpenAreaCompare?: () => void;
  onOpenDemoControl?: () => void;
  onOpenAuth?: () => void;
  onOpenAccessibility?: () => void;
  onOpenCivicReport?: () => void;
  onOpenAreaPicker?: () => void;
  className?: string;
}

interface SearchItem {
  id: string;
  title: string;
  category: "district" | "tool" | "action";
  description: string;
  keywords: string[];
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
  action: () => void;
}

export const GlobalCitySearch: React.FC<GlobalCitySearchProps> = ({
  onSelectTab,
  onOpenAreaCompare,
  onOpenDemoControl,
  onOpenAuth,
  onOpenAccessibility,
  onOpenCivicReport,
  onOpenAreaPicker,
  className = "",
}) => {
  const {
    allZones,
    setPrimaryAreaId,
    openLanguageModal,
    isAuthorityMode,
  } = useCity();

  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Global Keyboard Shortcut: Cmd+K / Ctrl+K or '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      } else if (e.key === "/" && document.activeElement !== inputRef.current && !(document.activeElement instanceof HTMLInputElement || document.activeElement instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Build Comprehensive Search Index
  const allSearchItems: SearchItem[] = [
    // 1. City Districts / Zones
    ...allZones.map((zone) => ({
      id: `zone-${zone.id}`,
      title: zone.name,
      category: "district" as const,
      description: `${zone.type} • Health: ${zone.healthScore}/100 • AQI: ${zone.aqi} • Traffic: ${zone.traffic}`,
      keywords: [
        zone.name.toLowerCase(),
        zone.type.toLowerCase(),
        zone.aqiStatus.toLowerCase(),
        "district",
        "zone",
        "neighborhood",
        "area",
        "health",
        "aqi",
        "traffic",
      ],
      icon: MapPin,
      badge: `${zone.healthScore}% Health`,
      badgeColor:
        zone.healthScore > 80
          ? "bg-emerald-950 text-emerald-300 border-emerald-500/40"
          : zone.healthScore > 60
          ? "bg-amber-950 text-amber-300 border-amber-500/40"
          : "bg-rose-950 text-rose-300 border-rose-500/40",
      action: () => {
        setPrimaryAreaId(zone.id);
        onSelectTab?.("map");
      },
    })),

    // 2. Intelligence Tools & AI Simulators
    {
      id: "tool-brain",
      title: "🧠 City Brain Central",
      category: "tool" as const,
      description: "Central AI Cognition Hub with real-time multi-agent orchestration & neural diagnostics",
      keywords: ["city brain", "brain", "ai", "neural", "orchestrator", "multi-agent", "cognition", "central"],
      icon: Sparkles,
      badge: "AI Core",
      badgeColor: "bg-purple-950 text-purple-300 border-purple-500/40",
      action: () => onSelectTab?.("brain"),
    },
    {
      id: "tool-twin",
      title: "🏙️ Digital Twin 3D Hub",
      category: "tool" as const,
      description: "Interactive 3D spatial twin with building-level IoT telemetry and structural stress metrics",
      keywords: ["digital twin", "twin", "3d", "spatial", "iot", "infrastructure", "telemetry"],
      icon: Layers,
      badge: "3D Spatial",
      badgeColor: "bg-cyan-950 text-cyan-300 border-cyan-500/40",
      action: () => onSelectTab?.("twin"),
    },
    {
      id: "tool-futurecity",
      title: "🔮 Future City 2035",
      category: "tool" as const,
      description: "Long-horizon urban projections: climate adaptation, demographic shifts, and autonomous transit",
      keywords: ["future city", "2035", "projections", "climate", "future", "demographics", "vision"],
      icon: Compass,
      badge: "Projection",
      badgeColor: "bg-indigo-950 text-indigo-300 border-indigo-500/40",
      action: () => onSelectTab?.("futurecity"),
    },
    {
      id: "tool-planning",
      title: "🏗️ Urban Planning Simulator",
      category: "tool" as const,
      description: "Simulate zoning laws, high-density residential towers, green corridors, and environmental impact",
      keywords: ["urban planning", "planning", "zoning", "development", "construction", "simulator", "architecture"],
      icon: Building2,
      badge: "Planning",
      badgeColor: "bg-amber-950 text-amber-300 border-amber-500/40",
      action: () => onSelectTab?.("planning"),
    },
    {
      id: "tool-budget",
      title: "💰 Budget Allocation AI",
      category: "tool" as const,
      description: "Municipal fiscal simulation: optimize budget distribution across green energy, safety, and transit",
      keywords: ["budget", "finance", "fiscal", "allocation", "money", "roi", "satisfaction", "simulator"],
      icon: Coins,
      badge: "Fiscal AI",
      badgeColor: "bg-emerald-950 text-emerald-300 border-emerald-500/40",
      action: () => onSelectTab?.("budget"),
    },
    {
      id: "tool-closedloop",
      title: "🔄 Closed-Loop Urban Lifecycle",
      category: "tool" as const,
      description: "Autonomous sense-predict-act-learn cycle with automated work order dispatch & verification",
      keywords: ["closed loop", "lifecycle", "automated", "dispatch", "work orders", "feedback", "autonomous"],
      icon: RefreshCw,
      badge: "Automation",
      badgeColor: "bg-teal-950 text-teal-300 border-teal-500/40",
      action: () => onSelectTab?.("closedloop"),
    },
    {
      id: "tool-water",
      title: "🚰 WaterMind Intelligence",
      category: "tool" as const,
      description: "Hydraulic grid monitoring: pipe pressure, aquifer reserves, water quality index, and leak detection",
      keywords: ["water", "watermind", "hydraulics", "aquifer", "leak", "plumbing", "drainage", "reservoir"],
      icon: Droplets,
      badge: "Hydraulics",
      badgeColor: "bg-blue-950 text-blue-300 border-blue-500/40",
      action: () => onSelectTab?.("water"),
    },
    {
      id: "tool-heat",
      title: "🌡️ Urban Heat Island Intelligence",
      category: "tool" as const,
      description: "Thermal satellite mapping, microclimate heat traps, cool roof index, and shade recommendations",
      keywords: ["heat", "urban heat island", "temperature", "thermal", "climate", "shade", "cooling"],
      icon: Flame,
      badge: "Thermal",
      badgeColor: "bg-rose-950 text-rose-300 border-rose-500/40",
      action: () => onSelectTab?.("heat"),
    },
    {
      id: "tool-waste",
      title: "♻️ Smart Waste Intelligence",
      category: "tool" as const,
      description: "IoT bin fill sensors, automated robotic sorting efficiency, and dynamic collection route dispatch",
      keywords: ["waste", "smart waste", "recycling", "garbage", "trash", "sanitation", "collection"],
      icon: Trash2,
      badge: "Sanitation",
      badgeColor: "bg-teal-950 text-teal-300 border-teal-500/40",
      action: () => onSelectTab?.("waste"),
    },
    {
      id: "tool-emergency",
      title: "🚨 Emergency Response Optimizer",
      category: "tool" as const,
      description: "Real-time emergency unit routing, dynamic evacuation corridors, and hospital load balancing",
      keywords: ["emergency", "police", "ambulance", "fire", "siren", "response", "evacuation", "hospital"],
      icon: Siren,
      badge: "Emergency",
      badgeColor: "bg-rose-950 text-rose-300 border-rose-500/40",
      action: () => onSelectTab?.("emergency"),
    },
    {
      id: "tool-copilot",
      title: "🤖 CityCopilot AI",
      category: "tool" as const,
      description: "Conversational urban assistant for natural language queries, multi-modal diagnostics, and insights",
      keywords: ["copilot", "chat", "assistant", "ai", "ask", "queries", "help"],
      icon: Bot,
      badge: "Assistant",
      badgeColor: "bg-teal-950 text-teal-300 border-teal-500/40",
      action: () => onSelectTab?.("copilot"),
    },
    {
      id: "tool-simulator",
      title: "🎛️ What-If Scenario Simulator",
      category: "tool" as const,
      description: "Simulate extreme scenarios: Heavy Rain 35mm, Extreme Heatwave 42°C, Grid Power Outage",
      keywords: ["what if", "scenario", "simulator", "rain", "flood", "heatwave", "blackout", "simulation"],
      icon: Sliders,
      badge: "Simulation",
      badgeColor: "bg-amber-950 text-amber-300 border-amber-500/40",
      action: () => onSelectTab?.("simulator"),
    },
    {
      id: "tool-map",
      title: "🗺️ Live City Map",
      category: "tool" as const,
      description: "Interactive GIS map with live traffic flow, camera feeds, environmental sensors, and incident pins",
      keywords: ["map", "gis", "live map", "navigation", "sensors", "traffic", "cameras"],
      icon: MapPin,
      badge: "GIS Map",
      badgeColor: "bg-cyan-950 text-cyan-300 border-cyan-500/40",
      action: () => onSelectTab?.("map"),
    },
    {
      id: "tool-briefing",
      title: "📊 City Briefing & Pulse",
      category: "tool" as const,
      description: "Daily executive summary, civic vitality index, and 24-hour predictive weather & pollution pulse",
      keywords: ["briefing", "pulse", "vitality", "health", "summary", "daily", "overview"],
      icon: Activity,
      badge: "Pulse",
      badgeColor: "bg-emerald-950 text-emerald-300 border-emerald-500/40",
      action: () => onSelectTab?.("briefing"),
    },
    {
      id: "tool-travel",
      title: "🧭 Smart Travel & Commute",
      category: "tool" as const,
      description: "Multimodal route navigation, real-time bus/metro congestion, and low-carbon travel incentives",
      keywords: ["travel", "commute", "transit", "metro", "bus", "navigation", "routes", "traffic"],
      icon: Navigation,
      badge: "Mobility",
      badgeColor: "bg-teal-950 text-teal-300 border-teal-500/40",
      action: () => onSelectTab?.("travel"),
    },
    {
      id: "tool-environment",
      title: "🍃 Environment & Grid Dashboard",
      category: "tool" as const,
      description: "Air quality index, particulate matter (PM2.5), power grid load distribution, and solar output",
      keywords: ["environment", "air quality", "aqi", "pollution", "grid", "energy", "solar", "electricity"],
      icon: Wind,
      badge: "Grid",
      badgeColor: "bg-green-950 text-green-300 border-green-500/40",
      action: () => onSelectTab?.("environment"),
    },
    {
      id: "tool-risk",
      title: "🛡️ City Risk Radar",
      category: "tool" as const,
      description: "Predictive vulnerability scoring, cascading infrastructure risk models, and hazard warnings",
      keywords: ["risk", "radar", "vulnerability", "hazard", "threat", "safety", "warning"],
      icon: ShieldAlert,
      badge: "Risk",
      badgeColor: "bg-rose-950 text-rose-300 border-rose-500/40",
      action: () => onSelectTab?.("risk"),
    },
    {
      id: "tool-memory",
      title: "🏛️ City Memory & Decision Playbooks",
      category: "tool" as const,
      description: "Historical resolution logs, AI decision rationale explainability, and civic governance archive",
      keywords: ["memory", "history", "playbooks", "archive", "decisions", "logs", "explainable ai"],
      icon: History,
      badge: "Archive",
      badgeColor: "bg-amber-950 text-amber-300 border-amber-500/40",
      action: () => onSelectTab?.("memory"),
    },
    {
      id: "tool-alerts",
      title: "🔔 City Alerts Center",
      category: "tool" as const,
      description: "Real-time municipal bulletins, infrastructure maintenance notices, and emergency advisories",
      keywords: ["alerts", "notifications", "bulletins", "notices", "broadcasts", "warnings"],
      icon: Bell,
      badge: "Alerts",
      badgeColor: "bg-rose-950 text-rose-300 border-rose-500/40",
      action: () => onSelectTab?.("alerts"),
    },
    ...(isAuthorityMode
      ? [
          {
            id: "tool-authority",
            title: "🏢 Authority Operations Command",
            category: "tool" as const,
            description: "High-level municipal command: emergency overrides, agency coordination, and field unit dispatch",
            keywords: ["authority", "command", "operations", "municipal", "override", "dispatch", "admin"],
            icon: Building2,
            badge: "Command",
            badgeColor: "bg-amber-950 text-amber-300 border-amber-500/40",
            action: () => onSelectTab?.("authority"),
          },
        ]
      : []),

    // 3. Quick Actions & Modals
    {
      id: "action-civic-report",
      title: "📸 Report a Civic Issue",
      category: "action" as const,
      description: "Submit a geotagged citizen report (potholes, streetlight outages, water leaks, illegal dumping)",
      keywords: ["report", "civic report", "pothole", "streetlight", "leak", "garbage", "complaint", "photo"],
      icon: Camera,
      badge: "Citizen Action",
      badgeColor: "bg-teal-950 text-teal-300 border-teal-500/40",
      action: () => onOpenCivicReport?.(),
    },
    {
      id: "action-compare",
      title: "⚖️ Compare City Districts",
      category: "action" as const,
      description: "Side-by-side comparative analysis of health scores, air quality, traffic, and municipal resources",
      keywords: ["compare", "comparison", "benchmark", "districts", "areas", "side by side"],
      icon: Award,
      badge: "Analytics",
      badgeColor: "bg-amber-950 text-amber-300 border-amber-500/40",
      action: () => onOpenAreaCompare?.(),
    },
    {
      id: "action-time-travel",
      title: "🧭 Demo Control & Scenario Simulator",
      category: "action" as const,
      description: "Trigger live simulation events: Heavy Rain Spike, Rush Hour Surge, Power Outage, or Time Travel",
      keywords: ["demo", "time travel", "simulate", "scenario", "rush hour", "rain spike", "control center"],
      icon: Compass,
      badge: "Scenario",
      badgeColor: "bg-amber-950 text-amber-300 border-amber-500/40",
      action: () => onOpenDemoControl?.(),
    },
    {
      id: "action-language",
      title: "🌐 Change Language (12 Indian & Global Languages)",
      category: "action" as const,
      description: "Switch language instantly: English, Telugu, Hindi, Tamil, Kannada, Malayalam, Marathi, Bengali...",
      keywords: ["language", "translate", "telugu", "hindi", "tamil", "kannada", "malayalam", "marathi", "bengali", "english"],
      icon: Globe,
      badge: "Language",
      badgeColor: "bg-teal-950 text-teal-300 border-teal-500/40",
      action: () => openLanguageModal(),
    },
    {
      id: "action-accessibility",
      title: "♿ Accessibility & Contrast Controls",
      category: "action" as const,
      description: "Customize display settings: High-contrast mode, enlarged typography, and screen reader layout",
      keywords: ["accessibility", "contrast", "font size", "large text", "vision", "settings"],
      icon: SlidersHorizontal,
      badge: "Accessibility",
      badgeColor: "bg-slate-900 text-slate-300 border-slate-700",
      action: () => onOpenAccessibility?.(),
    },
    {
      id: "action-auth",
      title: "👤 Account, Permissions & Authorized Directory",
      category: "action" as const,
      description: "Manage verified email credentials, role authorizations, notification preferences, or sign out",
      keywords: ["account", "profile", "auth", "login", "register", "permissions", "user", "directory"],
      icon: User,
      badge: "Account",
      badgeColor: "bg-teal-950 text-teal-300 border-teal-500/40",
      action: () => onOpenAuth?.(),
    },
  ];

  // Filtering Logic
  const trimmed = query.trim().toLowerCase();
  const filteredItems = trimmed
    ? allSearchItems.filter(
        (item) =>
          item.title.toLowerCase().includes(trimmed) ||
          item.description.toLowerCase().includes(trimmed) ||
          item.keywords.some((k) => k.includes(trimmed))
      )
    : [];

  // Grouped Results
  const districtResults = filteredItems.filter((i) => i.category === "district");
  const toolResults = filteredItems.filter((i) => i.category === "tool");
  const actionResults = filteredItems.filter((i) => i.category === "action");

  // Flattened for index navigation
  const flatDisplayItems = [...districtResults, ...toolResults, ...actionResults];

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation within dropdown
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (flatDisplayItems.length || 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + flatDisplayItems.length) % (flatDisplayItems.length || 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (flatDisplayItems[selectedIndex]) {
        executeItem(flatDisplayItems[selectedIndex]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const executeItem = (item: SearchItem) => {
    item.action();
    setQuery("");
    setIsOpen(false);
    inputRef.current?.blur();
  };

  return (
    <div id="global-city-search" className={`relative ${className}`}>
      {/* Search Input Bar */}
      <div className="relative flex items-center">
        <Search className="w-4 h-4 text-teal-400 absolute left-3.5 pointer-events-none transition-transform group-focus-within:scale-110" />
        
        <input
          ref={inputRef}
          type="text"
          id="global-search-input"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search districts, tools, or AI simulations..."
          className="w-full bg-black/70 hover:bg-black/90 focus:bg-black border border-white/20 hover:border-teal-500/50 focus:border-teal-400 text-xs text-white placeholder-white/40 rounded-xl pl-9.5 pr-20 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400/20 transition-all shadow-inner font-medium"
        />

        {/* Right shortcut pill / clear button */}
        <div className="absolute right-2 flex items-center gap-1">
          {query ? (
            <button
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="p-1 text-white/40 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-white/10 border border-white/10 text-[10px] font-mono text-white/50 pointer-events-none">
              <span className="text-[9px]">⌘</span>K
            </div>
          )}
        </div>
      </div>

      {/* Autocomplete Dropdown Popover */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-[#0D1117]/98 border border-teal-500/30 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-2.5 z-50 space-y-3 max-h-[75vh] overflow-y-auto backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Header helper when typing */}
          {query.trim().length > 0 ? (
            <div className="flex items-center justify-between px-2 py-1 text-[11px] font-mono text-white/50 border-b border-white/10 pb-2">
              <span>
                Found <strong className="text-teal-300 font-bold">{flatDisplayItems.length}</strong> matching results for "{query}"
              </span>
              <div className="flex items-center gap-1 text-[10px]">
                <span className="px-1 bg-white/10 rounded">↑↓</span> to navigate •{" "}
                <span className="px-1 bg-white/10 rounded">↵</span> to select
              </div>
            </div>
          ) : (
            /* Quick suggestions when query is empty */
            <div className="space-y-3 p-1">
              <div className="flex items-center justify-between text-[11px] font-mono text-teal-400 font-bold px-1 uppercase tracking-wider">
                <span>⚡ Quick Jump Suggestions</span>
                <span className="text-white/40 font-normal">Press ⌘K anytime</span>
              </div>

              {/* Quick Jump Badges */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: "🧠 City Brain", tab: "brain" },
                  { label: "🏙️ Digital Twin", tab: "twin" },
                  { label: "🔮 Future City 2035", tab: "futurecity" },
                  { label: "🏗️ Urban Planner", tab: "planning" },
                  { label: "💰 Budget AI", tab: "budget" },
                  { label: "🚰 WaterMind", tab: "water" },
                  { label: "🌡️ Heat Island", tab: "heat" },
                  { label: "🚨 Emergency AI", tab: "emergency" },
                  { label: "🗺️ Live Map", tab: "map" },
                ].map((item) => (
                  <button
                    key={item.tab}
                    onClick={() => {
                      onSelectTab?.(item.tab);
                      setIsOpen(false);
                    }}
                    className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-teal-950/60 hover:text-teal-300 border border-white/10 hover:border-teal-500/40 text-xs font-bold text-white/80 transition-all flex items-center gap-1"
                  >
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>

              {/* Popular Districts */}
              <div className="pt-2 border-t border-white/10 space-y-1.5">
                <span className="text-[10px] font-mono text-white/40 uppercase block px-1">
                  Popular Districts:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {allZones.slice(0, 4).map((zone) => (
                    <button
                      key={zone.id}
                      onClick={() => {
                        setPrimaryAreaId(zone.id);
                        onSelectTab?.("map");
                        setIsOpen(false);
                      }}
                      className="p-2 bg-black/40 hover:bg-teal-950/40 border border-white/10 hover:border-teal-500/40 rounded-xl text-left transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                        <div>
                          <div className="text-xs font-bold text-white group-hover:text-teal-300">
                            {zone.name}
                          </div>
                          <div className="text-[10px] text-white/50">
                            {zone.type} • {zone.healthScore}% Health
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-white/30 group-hover:text-teal-300 group-hover:translate-x-0.5 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 1: DISTRICTS */}
          {districtResults.length > 0 && (
            <div className="space-y-1">
              <div className="px-2 py-1 text-[10px] font-mono font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>City Districts & Zones ({districtResults.length})</span>
              </div>

              {districtResults.map((item) => {
                const itemIndex = flatDisplayItems.indexOf(item);
                const isSelected = itemIndex === selectedIndex;
                const IconComp = item.icon;

                return (
                  <div
                    key={item.id}
                    onClick={() => executeItem(item)}
                    onMouseEnter={() => setSelectedIndex(itemIndex)}
                    className={`p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-between text-xs border ${
                      isSelected
                        ? "bg-teal-950/70 border-teal-500/60 text-white shadow-lg"
                        : "bg-black/40 hover:bg-black/60 border-white/5 text-white/80"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center justify-center shrink-0">
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">
                            {item.title}
                          </span>
                          {item.badge && (
                            <span
                              className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold border ${item.badgeColor}`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-white/50 leading-tight mt-0.5">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-teal-400/80 bg-teal-950/50 px-2 py-1 rounded-lg border border-teal-500/30">
                        <span>Select District</span>
                        <CornerDownLeft className="w-3 h-3" />
                      </span>
                      <ArrowRight className="w-4 h-4 text-white/40" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* SECTION 2: INTELLIGENCE TOOLS & SIMULATORS */}
          {toolResults.length > 0 && (
            <div className="space-y-1">
              <div className="px-2 py-1 text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Intelligence Tools & Simulators ({toolResults.length})</span>
              </div>

              {toolResults.map((item) => {
                const itemIndex = flatDisplayItems.indexOf(item);
                const isSelected = itemIndex === selectedIndex;
                const IconComp = item.icon;

                return (
                  <div
                    key={item.id}
                    onClick={() => executeItem(item)}
                    onMouseEnter={() => setSelectedIndex(itemIndex)}
                    className={`p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-between text-xs border ${
                      isSelected
                        ? "bg-cyan-950/70 border-cyan-500/60 text-white shadow-lg"
                        : "bg-black/40 hover:bg-black/60 border-white/5 text-white/80"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center justify-center shrink-0">
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">
                            {item.title}
                          </span>
                          {item.badge && (
                            <span
                              className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold border ${item.badgeColor}`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-white/50 leading-tight mt-0.5">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-cyan-400/80 bg-cyan-950/50 px-2 py-1 rounded-lg border border-cyan-500/30">
                        <span>Launch Tool</span>
                        <CornerDownLeft className="w-3 h-3" />
                      </span>
                      <ArrowRight className="w-4 h-4 text-white/40" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* SECTION 3: QUICK ACTIONS */}
          {actionResults.length > 0 && (
            <div className="space-y-1">
              <div className="px-2 py-1 text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                <span>Quick Actions & Controls ({actionResults.length})</span>
              </div>

              {actionResults.map((item) => {
                const itemIndex = flatDisplayItems.indexOf(item);
                const isSelected = itemIndex === selectedIndex;
                const IconComp = item.icon;

                return (
                  <div
                    key={item.id}
                    onClick={() => executeItem(item)}
                    onMouseEnter={() => setSelectedIndex(itemIndex)}
                    className={`p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-between text-xs border ${
                      isSelected
                        ? "bg-amber-950/70 border-amber-500/60 text-white shadow-lg"
                        : "bg-black/40 hover:bg-black/60 border-white/5 text-white/80"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center shrink-0">
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">
                            {item.title}
                          </span>
                          {item.badge && (
                            <span
                              className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold border ${item.badgeColor}`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-white/50 leading-tight mt-0.5">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-amber-400/80 bg-amber-950/50 px-2 py-1 rounded-lg border border-amber-500/30">
                        <span>Open</span>
                        <CornerDownLeft className="w-3 h-3" />
                      </span>
                      <ArrowRight className="w-4 h-4 text-white/40" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* No results found */}
          {query.trim().length > 0 && flatDisplayItems.length === 0 && (
            <div className="p-6 text-center space-y-2">
              <Search className="w-8 h-8 text-white/20 mx-auto" />
              <p className="text-sm font-bold text-white">
                No matching districts or tools found for "{query}"
              </p>
              <p className="text-xs text-white/50">
                Try searching for "Central District", "Riverside", "WaterMind", "Budget", "Heat", "Emergency", or "Closed Loop".
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
