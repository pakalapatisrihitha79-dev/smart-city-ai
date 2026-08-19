import React, { useState } from "react";
import { useCity } from "../context/CityContext";
import { motion, AnimatePresence } from "motion/react";
import {
  Layers,
  Activity,
  MapPin,
  Bot,
  Sliders,
  Camera,
  Navigation,
  Wind,
  ShieldAlert,
  History,
  Bell,
  Building2,
  HelpCircle,
  Wrench,
  BookOpen,
  Play,
  Scale,
  Compass,
  ArrowRight,
  Sparkles,
  Zap,
  Droplets,
  Search,
  CheckCircle2,
  Users,
  Briefcase,
  AlertOctagon,
  Gamepad2,
  Globe,
  SlidersHorizontal,
  Flame,
  CloudRain,
  Eye,
  Volume2,
} from "lucide-react";

interface CityHomePageProps {
  onNavigateTab: (
    tab:
      | "twin"
      | "briefing"
      | "map"
      | "copilot"
      | "simulator"
      | "civic"
      | "travel"
      | "environment"
      | "risk"
      | "memory"
      | "alerts"
      | "authority"
  ) => void;
  onOpenCivicReport: () => void;
  onOpenAreaPicker: () => void;
  onOpenAreaCompare: () => void;
  onOpenDemoControl: () => void;
  onOpenAccessibility: () => void;
}

type PersonaFilter = "all" | "citizen" | "planner" | "emergency" | "interactive";

interface FeatureCardData {
  id: string;
  title: string;
  category: "citizen" | "planner" | "emergency" | "interactive";
  categoryLabel: string;
  badge?: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  description: string;
  bestFor: string;
  actionText: string;
  onClick: () => void;
  highlight?: boolean;
  liveStats?: string;
}

export const CityHomePage: React.FC<CityHomePageProps> = ({
  onNavigateTab,
  onOpenCivicReport,
  onOpenAreaPicker,
  onOpenAreaCompare,
  onOpenDemoControl,
  onOpenAccessibility,
}) => {
  const {
    currentZone,
    allZones,
    setPrimaryAreaId,
    setIsDecisionModalOpen,
    setIsFixCityOpen,
    setIsStoryModeOpen,
    setIs90sDemoOpen,
    openExplainModal,
    setIsConfidenceModalOpen,
    openLanguageModal,
    setDemoScenario,
    accessibilitySettings,
    t,
  } = useCity();

  const [activePersona, setActivePersona] = useState<PersonaFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const prefersReducedMotion = accessibilitySettings.reduceMotion;

  // Comprehensive Catalog of all NovaCity Features
  const featuresList: FeatureCardData[] = [
    {
      id: "twin",
      title: "Digital Twin & City DNA",
      category: "planner",
      categoryLabel: "Core Intelligence",
      badge: "4 Operational Modes",
      icon: Layers,
      iconColor: "text-cyan-400",
      iconBg: "bg-cyan-500/10 border-cyan-500/30",
      description:
        "Full cognitive city model syncing Live IoT feeds, 7-dimension City DNA, 9 autonomous multi-agent consensus engines, and causal network graphs.",
      bestFor: "Viewing macro city health, causal dependencies, and autonomous agent directives.",
      actionText: "Open Digital Twin",
      onClick: () => onNavigateTab("twin"),
      highlight: true,
      liveStats: `${currentZone.healthScore}/100 Health • 9 Agents Active`,
    },
    {
      id: "copilot",
      title: "CityCopilot AI (Voice & Text)",
      category: "citizen",
      categoryLabel: "Generative AI",
      badge: "Gemini 2.5 Flash",
      icon: Bot,
      iconColor: "text-teal-400",
      iconBg: "bg-teal-500/10 border-teal-500/30",
      description:
        "Multimodal voice and text conversational assistant. Provides transparent AI reasoning, data sources, confidence levels, and instant municipal guidance.",
      bestFor: "Asking anything about traffic, power, water, air quality, or city rules.",
      actionText: "Talk to Copilot",
      onClick: () => onNavigateTab("copilot"),
      highlight: true,
      liveStats: "Voice In/Out Ready • Transparent AI",
    },
    {
      id: "map",
      title: "Live Geospatial City Map",
      category: "citizen",
      categoryLabel: "Real-Time Map",
      badge: "Multi-Layer GIS",
      icon: MapPin,
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-500/10 border-emerald-500/30",
      description:
        "Interactive geospatial canvas with toggleable overlays: live traffic corridors, AQI monitors, water pressure valves, flood heatmaps, and smart waste bins.",
      bestFor: "Visualizing district geography, localized hazards, and municipal assets.",
      actionText: "Explore Live Map",
      onClick: () => onNavigateTab("map"),
      liveStats: "5 Districts • Real-time Sensors",
    },
    {
      id: "travel",
      title: "Smart Multimodal Travel",
      category: "citizen",
      categoryLabel: "Mobility & Transit",
      badge: "Carbon Optimizer",
      icon: Navigation,
      iconColor: "text-blue-400",
      iconBg: "bg-blue-500/10 border-blue-500/30",
      description:
        "Side-by-side commute router comparing Private Car, Metro Bus, Cycling, and Walking routes with carbon footprint tracking and departure optimizers.",
      bestFor: "Finding the fastest, cheapest, and lowest-carbon journey across town.",
      actionText: "Plan Clean Route",
      onClick: () => onNavigateTab("travel"),
      liveStats: `Average Speed: ${currentZone.trafficSpeed} km/h`,
    },
    {
      id: "civic",
      title: "Civic Hazard Reporting",
      category: "citizen",
      categoryLabel: "Community Voice",
      badge: "AI Vision Triage",
      icon: Camera,
      iconColor: "text-amber-400",
      iconBg: "bg-amber-500/10 border-amber-500/30",
      description:
        "Citizen issue reporting with camera photo analysis. Automatically detects hazard category, severity score, duplicate nearby reports, and community voting.",
      bestFor: "Reporting potholes, streetlight outages, illegal dumping, or broken water mains.",
      actionText: "Report an Issue",
      onClick: () => {
        onNavigateTab("civic");
        onOpenCivicReport();
      },
      liveStats: "AI Duplicate Guard Active",
    },
    {
      id: "environment",
      title: "Environment & Energy Grid",
      category: "planner",
      categoryLabel: "Utilities & ESG",
      badge: "Interactive Recharts",
      icon: Wind,
      iconColor: "text-teal-300",
      iconBg: "bg-teal-500/10 border-teal-500/30",
      description:
        "Animated 24-hour diurnal trend lines and donut charts for electricity demand, renewable solar mix, water pipeline pressure, AQI (PM2.5/PM10), and waste circularity.",
      bestFor: "Tracking grid resilience, acoustic water leaks, air pollution curves, and resource mix.",
      actionText: "View Grid Analytics",
      onClick: () => onNavigateTab("environment"),
      liveStats: `AQI ${currentZone.aqi} • ${currentZone.renewablePct}% Clean Energy`,
    },
    {
      id: "simulator",
      title: "What-If Policy Simulator",
      category: "planner",
      categoryLabel: "Urban Sandboxing",
      badge: "Zero Risk Sandbox",
      icon: Sliders,
      iconColor: "text-indigo-400",
      iconBg: "bg-indigo-500/10 border-indigo-500/30",
      description:
        "Interactive policy sandboxing engine. Adjust levers for public transit subsidy, private vehicle caps, renewable solar mandates, and urban tree canopy to forecast outcomes.",
      bestFor: "Testing urban policy changes and forecasting environmental impact before spending budget.",
      actionText: "Launch Simulator",
      onClick: () => onNavigateTab("simulator"),
      liveStats: "Instant Multi-Impact Projections",
    },
    {
      id: "briefing",
      title: "Living Pulse & Briefings",
      category: "citizen",
      categoryLabel: "Daily Intelligence",
      badge: "Actionable Insights",
      icon: Activity,
      iconColor: "text-rose-400",
      iconBg: "bg-rose-500/10 border-rose-500/30",
      description:
        "Daily city intelligence briefing: 3 top things to know today, 1 critical trend to watch, recommended personal actions, and comprehensive 7-domain health scores.",
      bestFor: "Quick morning catch-up on city health, weather alerts, and safety advice.",
      actionText: "Read Daily Briefing",
      onClick: () => onNavigateTab("briefing"),
      liveStats: `Status: ${currentZone.healthStatus}`,
    },
    {
      id: "risk",
      title: "Cascading Risk Radar",
      category: "emergency",
      categoryLabel: "Crisis Prevention",
      badge: "Cross-System Predictor",
      icon: ShieldAlert,
      iconColor: "text-amber-500",
      iconBg: "bg-amber-500/10 border-amber-500/30",
      description:
        "Cascading risk heatmap tracking multi-system vulnerabilities: flood drainage chokepoints, transformer overloads, and traffic bottlenecks before incidents occur.",
      bestFor: "Preventing cascading system failures and reviewing AI proactive mitigations.",
      actionText: "Inspect Risk Radar",
      onClick: () => onNavigateTab("risk"),
      liveStats: "Cascading Impact Predictor Active",
    },
    {
      id: "alerts",
      title: "City Alerts & Custom Rules",
      category: "emergency",
      categoryLabel: "Emergency Broadcasting",
      badge: "Real-Time Triggers",
      icon: Bell,
      iconColor: "text-rose-400",
      iconBg: "bg-rose-500/10 border-rose-500/30",
      description:
        "Municipal alert center with live severity badges, acoustic water leak warnings, and a custom rule builder (e.g. notify when AQI > 100 or rain > 25mm).",
      bestFor: "Monitoring active emergency alerts and setting personal automated warning thresholds.",
      actionText: "Open Alerts Center",
      onClick: () => onNavigateTab("alerts"),
      liveStats: "Custom Trigger Engine Ready",
    },
    {
      id: "authority",
      title: "Authority Operations Command",
      category: "emergency",
      categoryLabel: "First Responders",
      badge: "Incident Dispatch",
      icon: Building2,
      iconColor: "text-purple-400",
      iconBg: "bg-purple-500/10 border-purple-500/30",
      description:
        "Command interface for municipal operators to trigger emergency sirens, dispatch drainage and fire crews, override signal timings, and maintain audit logs.",
      bestFor: "City management teams executing real-time crisis response and emergency dispatch.",
      actionText: "Enter Command Center",
      onClick: () => onNavigateTab("authority"),
      liveStats: "Agency Coordination Dispatch Active",
    },
    {
      id: "memory",
      title: "City Memory & Learnings",
      category: "planner",
      categoryLabel: "Institutional Memory",
      badge: "ESG & Retrospectives",
      icon: History,
      iconColor: "text-slate-300",
      iconBg: "bg-slate-500/10 border-slate-500/30",
      description:
        "Historical database of municipal incidents, post-event retrospectives, AI causal learnings, and comprehensive ESG sustainability milestones.",
      bestFor: "Reviewing how past city crises were resolved and tracking long-term sustainability goals.",
      actionText: "Explore City Memory",
      onClick: () => onNavigateTab("memory"),
      liveStats: "Historical Retrospective Archives",
    },
    {
      id: "dilemma",
      title: "What Would You Do? Dilemma Lab",
      category: "interactive",
      categoryLabel: "Interactive Dilemma",
      badge: "AI vs Human",
      icon: HelpCircle,
      iconColor: "text-fuchsia-400",
      iconBg: "bg-fuchsia-500/10 border-fuchsia-500/30",
      description:
        "Engage in complex urban dilemmas (e.g. Heatwave Load Shedding vs Hospital Power) and compare your human decision against the AI's causal rationale.",
      bestFor: "Experiencing real-world trade-offs faced by urban decision makers.",
      actionText: "Play Dilemma Lab",
      onClick: () => setIsDecisionModalOpen(true),
      liveStats: "Interactive Decision Simulation",
    },
    {
      id: "fixcity",
      title: "Fix The City Intervention Lab",
      category: "interactive",
      categoryLabel: "Game Sandbox",
      badge: "Interactive Mission",
      icon: Wrench,
      iconColor: "text-lime-400",
      iconBg: "bg-lime-500/10 border-lime-500/30",
      description:
        "Hands-on crisis management scenario. Allocate emergency municipal budgets across transit rerouting, drainage pumps, and green energy to restore city health.",
      bestFor: "Gamified learning of urban systems balancing and rapid crisis mitigation.",
      actionText: "Launch Fix The City",
      onClick: () => setIsFixCityOpen(true),
      liveStats: "Live Crisis Mitigation Sandbox",
    },
    {
      id: "story",
      title: "5-Act Interactive City Story",
      category: "interactive",
      categoryLabel: "Guided Story Mode",
      badge: "Narrative Tour",
      icon: BookOpen,
      iconColor: "text-amber-300",
      iconBg: "bg-amber-500/10 border-amber-500/30",
      description:
        "A guided 5-act narrative walkthrough of NovaCity's cognitive transition: from reactive chaos to proactive, multi-agent AI city management.",
      bestFor: "New users wanting an inspiring, easy-to-follow narrative tour of the system.",
      actionText: "Start Story Tour",
      onClick: () => setIsStoryModeOpen(true),
      liveStats: "5 Story Chapters with Audio",
    },
    {
      id: "playbook",
      title: "90-Second Demo Presentation",
      category: "interactive",
      categoryLabel: "Live Presentation",
      badge: "Auto-Guided Tour",
      icon: Play,
      iconColor: "text-red-400",
      iconBg: "bg-red-500/10 border-red-500/30",
      description:
        "Automated self-running demonstration playbook designed for stakeholders, hackathons, and classroom showcases in exactly 90 seconds.",
      bestFor: "Quick demonstration of all platform features to colleagues, judges, or friends.",
      actionText: "Start 90s Presentation",
      onClick: () => setIs90sDemoOpen(true),
      liveStats: "Auto-Advancing Stage Tour",
    },
    {
      id: "compare",
      title: "Multi-District Comparison Tool",
      category: "planner",
      categoryLabel: "Comparative Analytics",
      badge: "Side-by-Side",
      icon: Scale,
      iconColor: "text-cyan-300",
      iconBg: "bg-cyan-500/10 border-cyan-500/30",
      description:
        "Compare any two districts in NovaCity side-by-side across Air Quality, Traffic Congestion, Water Pressure, Energy Mix, and Citizen Complaints.",
      bestFor: "Evaluating spatial inequalities and comparing district infrastructures.",
      actionText: "Compare Districts",
      onClick: onOpenAreaCompare,
      liveStats: "Side-by-Side Metric Radar",
    },
    {
      id: "scenario",
      title: "Extreme Scenario Simulator",
      category: "interactive",
      categoryLabel: "Weather & Crisis",
      badge: "Instant Trigger",
      icon: Compass,
      iconColor: "text-orange-400",
      iconBg: "bg-orange-500/10 border-orange-500/30",
      description:
        "Instantly inject real-time stress test scenarios into the city: Heavy Monsoon Rain, Extreme Heatwave, Peak Morning Gridlock, or Power Substation Outage.",
      bestFor: "Watching how all 9 AI agents and city systems react in real time under extreme crisis conditions.",
      actionText: "Inject Scenario",
      onClick: onOpenDemoControl,
      liveStats: "4 Extreme Crisis Modes Ready",
    },
  ];

  // Filtering based on persona and search query
  const filteredFeatures = featuresList.filter((item) => {
    const matchesPersona = activePersona === "all" || item.category === activePersona;
    const matchesSearch =
      searchQuery === "" ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.bestFor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPersona && matchesSearch;
  });

  return (
    <div className="space-y-6 sm:space-y-8 min-w-0">
      {/* 1. HERO WELCOME BANNER */}
      <motion.div
        initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0D1117] via-[#111827] to-[#0A192F] border border-teal-500/30 p-6 sm:p-8 shadow-2xl"
      >
        {/* Subtle background ambient glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
              <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-teal-300 bg-teal-950/60 px-3 py-1 rounded-full border border-teal-500/40">
                Cognitive Urban Digital Twin &bull; CityMind AI
              </span>
            </div>

            {/* Quick Language & District Switcher in Hero */}
            <div className="flex items-center gap-2">
              <button
                onClick={openLanguageModal}
                className="px-3 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/80 flex items-center gap-1.5 transition-colors font-medium"
              >
                <Globe className="w-3.5 h-3.5 text-teal-400" />
                <span>Languages</span>
              </button>
              <button
                onClick={onOpenAreaPicker}
                className="px-3 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/80 flex items-center gap-1.5 transition-colors font-medium"
              >
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>Zone: <strong className="text-white">{currentZone.name}</strong></span>
              </button>
            </div>
          </div>

          <div className="max-w-3xl space-y-2">
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase font-display leading-tight">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-300 to-blue-400">NovaCity</span>
            </h1>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed">
              Your real-time cognitive urban interface. Powered by multi-agent AI, predictive simulation, and live IoT telemetry. Discover all tools below or launch features tailored to your needs.
            </p>
          </div>

          {/* Quick Vital Telemetry Snapshot */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div
              onClick={() => onNavigateTab("briefing")}
              className="bg-black/40 hover:bg-black/60 border border-white/10 hover:border-teal-500/40 p-3 rounded-2xl cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between text-white/50 text-[10px] uppercase font-bold tracking-wider">
                <span>City Health Score</span>
                <Activity className="w-3.5 h-3.5 text-teal-400 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-white font-mono mt-0.5">
                {currentZone.healthScore}<span className="text-xs text-white/40 font-normal">/100</span>
              </div>
              <span className="text-[10px] text-teal-400 font-medium">{currentZone.healthStatus}</span>
            </div>

            <div
              onClick={() => onNavigateTab("environment")}
              className="bg-black/40 hover:bg-black/60 border border-white/10 hover:border-teal-500/40 p-3 rounded-2xl cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between text-white/50 text-[10px] uppercase font-bold tracking-wider">
                <span>Air Quality (AQI)</span>
                <Wind className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-white font-mono mt-0.5">
                {currentZone.aqi}
              </div>
              <span className={`text-[10px] font-medium ${currentZone.aqi > 100 ? "text-amber-400" : "text-emerald-400"}`}>
                {currentZone.aqiStatus}
              </span>
            </div>

            <div
              onClick={() => onNavigateTab("travel")}
              className="bg-black/40 hover:bg-black/60 border border-white/10 hover:border-teal-500/40 p-3 rounded-2xl cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between text-white/50 text-[10px] uppercase font-bold tracking-wider">
                <span>Traffic Flow</span>
                <Navigation className="w-3.5 h-3.5 text-blue-400 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-white font-mono mt-0.5">
                {currentZone.trafficSpeed} <span className="text-xs text-white/40 font-normal">km/h</span>
              </div>
              <span className="text-[10px] text-cyan-400 font-medium">{currentZone.trafficCongestion} Congestion</span>
            </div>

            <div
              onClick={() => onNavigateTab("environment")}
              className="bg-black/40 hover:bg-black/60 border border-white/10 hover:border-teal-500/40 p-3 rounded-2xl cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between text-white/50 text-[10px] uppercase font-bold tracking-wider">
                <span>Clean Energy Mix</span>
                <Zap className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-white font-mono mt-0.5">
                {currentZone.renewablePct}%
              </div>
              <span className="text-[10px] text-amber-300 font-medium">Solar & Wind Active</span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10">
            <span className="text-[11px] font-mono uppercase font-bold text-white/40 mr-1">
              Popular Actions:
            </span>
            <button
              onClick={() => onNavigateTab("copilot")}
              className="px-3.5 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-teal-500/20 transition-all uppercase tracking-wider"
            >
              <Bot className="w-4 h-4" />
              <span>Talk to Copilot</span>
            </button>

            <button
              onClick={() => {
                onNavigateTab("civic");
                onOpenCivicReport();
              }}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-extrabold text-xs flex items-center gap-1.5 transition-all uppercase tracking-wider"
            >
              <Camera className="w-4 h-4 text-amber-400" />
              <span>Report Issue</span>
            </button>

            <button
              onClick={() => onNavigateTab("twin")}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-extrabold text-xs flex items-center gap-1.5 transition-all uppercase tracking-wider"
            >
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Digital Twin</span>
            </button>

            <button
              onClick={() => setIsStoryModeOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 font-extrabold text-xs flex items-center gap-1.5 transition-all uppercase tracking-wider"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Interactive Story</span>
            </button>

            <button
              onClick={onOpenDemoControl}
              className="px-3.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-200 font-extrabold text-xs flex items-center gap-1.5 transition-all uppercase tracking-wider"
            >
              <Flame className="w-4 h-4 text-rose-400" />
              <span>Simulate Storm/Heatwave</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* 2. PERSONA USAGE FILTER & SEARCH BAR */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight flex items-center gap-2 font-display">
              <Sparkles className="w-5 h-5 text-teal-400" />
              <span>Explore Features by Your Usage</span>
            </h2>
            <p className="text-xs text-white/50">
              Select your role or search by feature name to open the exact tool you need
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search features (e.g., bus, map, solar, AI)..."
              className="w-full bg-[#0D1117] border border-white/10 rounded-xl pl-9.5 pr-4 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-teal-500/60 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs"
              >
                &times;
              </button>
            )}
          </div>
        </div>

        {/* Persona Tabs */}
        <div className="flex flex-wrap gap-2 text-xs">
          {[
            { id: "all", label: "All Features (18)", icon: Sparkles, color: "teal" },
            { id: "citizen", label: "Citizens & Commuters", icon: Users, color: "emerald" },
            { id: "planner", label: "Planners & Analysts", icon: SlidersHorizontal, color: "cyan" },
            { id: "emergency", label: "Emergency & Operators", icon: AlertOctagon, color: "rose" },
            { id: "interactive", label: "Interactive Labs & Stories", icon: Gamepad2, color: "amber" },
          ].map((persona) => {
            const IconComp = persona.icon;
            const isSelected = activePersona === persona.id;

            return (
              <button
                key={persona.id}
                onClick={() => setActivePersona(persona.id as PersonaFilter)}
                className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 font-bold transition-all text-xs uppercase tracking-wider ${
                  isSelected
                    ? "bg-teal-500 text-black shadow-lg shadow-teal-500/30 font-black"
                    : "bg-[#0D1117] border border-white/10 text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                <IconComp className="w-3.5 h-3.5" />
                <span>{persona.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. FEATURE CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 min-w-0">
        <AnimatePresence mode="popLayout">
          {filteredFeatures.map((feature, idx) => {
            const IconComp = feature.icon;

            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, delay: prefersReducedMotion ? 0 : idx * 0.03 }}
                className={`group rounded-2xl bg-[#0D1117]/95 border p-5 flex flex-col justify-between transition-all hover:shadow-2xl ${
                  feature.highlight
                    ? "border-teal-500/40 hover:border-teal-400 bg-gradient-to-b from-[#0D1117] to-[#0D1924]"
                    : "border-white/10 hover:border-white/20 hover:bg-[#111622]"
                }`}
              >
                <div className="space-y-3.5">
                  {/* Card Header: Icon + Category Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center border ${feature.iconBg} ${feature.iconColor} group-hover:scale-105 transition-transform shrink-0`}
                    >
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[9px] font-mono uppercase font-bold tracking-widest text-white/40 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                        {feature.categoryLabel}
                      </span>
                      {feature.badge && (
                        <span className="text-[9px] font-mono uppercase font-bold text-teal-300 bg-teal-950/40 px-2 py-0.5 rounded-full border border-teal-500/30">
                          {feature.badge}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-white/60 leading-relaxed mt-1.5">
                      {feature.description}
                    </p>
                  </div>

                  {/* Best For Tag */}
                  <div className="bg-white/5 border border-white/5 rounded-xl p-2.5 space-y-1">
                    <span className="text-[9px] uppercase font-mono font-bold text-white/40 block">
                      Best When:
                    </span>
                    <p className="text-[11px] text-white/80 leading-tight font-medium">
                      {feature.bestFor}
                    </p>
                  </div>
                </div>

                {/* Card Footer: Live Mini Status + Primary Action */}
                <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono text-teal-400 font-bold truncate">
                    {feature.liveStats || "Operational"}
                  </span>
                  <button
                    onClick={feature.onClick}
                    className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shrink-0 uppercase tracking-wider ${
                      feature.highlight
                        ? "bg-teal-500 hover:bg-teal-400 text-black shadow-md font-extrabold"
                        : "bg-white/10 hover:bg-white/20 text-white hover:text-teal-300 border border-white/10"
                    }`}
                  >
                    <span>{feature.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredFeatures.length === 0 && (
        <div className="text-center py-12 bg-[#0D1117] rounded-2xl border border-white/10 p-6 space-y-3">
          <Search className="w-8 h-8 text-white/30 mx-auto" />
          <h3 className="text-white font-bold text-sm">No matching features found</h3>
          <p className="text-xs text-white/50">Try a different search term or select "All Features".</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setActivePersona("all");
            }}
            className="px-4 py-2 bg-teal-500 text-black font-bold text-xs rounded-xl uppercase tracking-wider"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* 4. DISTRICT SELECTOR SECTION */}
      <div className="bg-[#0D1117]/90 border border-white/10 rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span>Connect to NovaCity Districts</span>
            </h3>
            <p className="text-xs text-white/50">
              Click any district to switch active live telemetry, air quality monitors, and local AI advice
            </p>
          </div>
          <button
            onClick={onOpenAreaCompare}
            className="text-cyan-400 hover:text-cyan-300 text-xs font-bold flex items-center gap-1 uppercase tracking-wider self-start sm:self-auto"
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Compare 2 Districts &rarr;</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {allZones.map((zone) => {
            const isSelected = zone.id === currentZone.id;

            return (
              <button
                key={zone.id}
                onClick={() => setPrimaryAreaId(zone.id)}
                className={`p-3.5 rounded-xl border text-left transition-all relative ${
                  isSelected
                    ? "bg-teal-500/15 border-teal-500 shadow-[0_0_15px_rgba(20,184,166,0.3)] ring-1 ring-teal-500"
                    : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-white text-xs truncate">{zone.name}</span>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />}
                </div>
                <div className="mt-2 space-y-1 text-[10px] font-mono">
                  <div className="flex justify-between text-white/60">
                    <span>Health:</span>
                    <span className="font-bold text-teal-300">{zone.healthScore}/100</span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>AQI:</span>
                    <span className="font-bold text-emerald-400">{zone.aqi}</span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>Traffic:</span>
                    <span className="font-bold text-blue-400">{zone.trafficSpeed} km/h</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. HOW IT WORKS / ARCHITECTURE INFO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#0D1117]/80 border border-white/10 p-4 rounded-2xl space-y-2">
          <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold text-xs font-mono">
            01
          </div>
          <h4 className="font-bold text-white text-xs uppercase tracking-wider">
            Sense & Understand
          </h4>
          <p className="text-xs text-white/60 leading-relaxed">
            Real-time IoT sensors monitor air particulates, acoustic water pressure, smart traffic density, and solar battery reserves.
          </p>
        </div>

        <div className="bg-[#0D1117]/80 border border-white/10 p-4 rounded-2xl space-y-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-xs font-mono">
            02
          </div>
          <h4 className="font-bold text-white text-xs uppercase tracking-wider">
            Predict & Simulate
          </h4>
          <p className="text-xs text-white/60 leading-relaxed">
            9 specialized autonomous agents simulate cascading risks, flood bottlenecks, and policy interventions with zero real-world damage.
          </p>
        </div>

        <div className="bg-[#0D1117]/80 border border-white/10 p-4 rounded-2xl space-y-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-xs font-mono">
            03
          </div>
          <h4 className="font-bold text-white text-xs uppercase tracking-wider">
            Recommend & Act
          </h4>
          <p className="text-xs text-white/60 leading-relaxed">
            CityCopilot AI delivers transparent recommendations to citizens and automated dispatch tools to municipal first responders.
          </p>
        </div>
      </div>
    </div>
  );
};
