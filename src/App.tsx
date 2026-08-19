import React, { useState } from "react";
import { useCity } from "./context/CityContext";
import { HeaderNav } from "./components/HeaderNav";
import { CityHomePage } from "./components/CityHomePage";
import { DigitalTwinHub } from "./components/DigitalTwinHub";
import { LivingCityPulse } from "./components/LivingCityPulse";
import { CityBriefing } from "./components/CityBriefing";
import { CityHealthCard } from "./components/CityHealthCard";
import { AreaPickerModal } from "./components/AreaPickerModal";
import { AreaCompareModal } from "./components/AreaCompareModal";
import { LiveCityMap } from "./components/LiveCityMap";
import { CityCopilot } from "./components/CityCopilot";
import { WhatIfSimulator } from "./components/WhatIfSimulator";
import { CivicReportingModal } from "./components/CivicReportingModal";
import { CivicIssueTracker } from "./components/CivicIssueTracker";
import { SmartTravel } from "./components/SmartTravel";
import { EnvironmentGridDashboard } from "./components/EnvironmentGridDashboard";
import { CityRiskRadar } from "./components/CityRiskRadar";
import { CityMemory } from "./components/CityMemory";
import { SustainabilityCenter } from "./components/SustainabilityCenter";
import { CityAlertsCenter } from "./components/CityAlertsCenter";
import { DemoControlCenterModal } from "./components/DemoControlCenterModal";
import { AuthorityOperationsView } from "./components/AuthorityOperationsView";
import { AuthModal } from "./components/AuthModal";
import { AccessibilityControls } from "./components/AccessibilityControls";
import { LanguageSelectorModal } from "./components/LanguageSelectorModal";
import { ExplainableAIModal } from "./components/ExplainableAIModal";
import { AIConfidenceModal } from "./components/AIConfidenceModal";
import { WhatWouldYouDoModal } from "./components/WhatWouldYouDoModal";
import { FixCityModal } from "./components/FixCityModal";
import { CityStoryModal } from "./components/CityStoryModal";
import { DemoPlaybookModal } from "./components/DemoPlaybookModal";

import {
  Home,
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
  AlertTriangle,
  Compass,
  Layers,
  Sparkles,
} from "lucide-react";

export default function App() {
  const {
    currentZone,
    currentScenario,
    isAuthorityMode,
    accessibilitySettings,
    isLanguageModalOpen,
    setIsLanguageModalOpen,
    t,
  } = useCity();

  // Navigation State - Home is default on initial opening
  const [activeTab, setActiveTab] = useState<
    | "home"
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
  >("home");

  // Modals
  const [isAreaPickerOpen, setIsAreaPickerOpen] = useState(false);
  const [isAreaCompareOpen, setIsAreaCompareOpen] = useState(false);
  const [isCivicReportOpen, setIsCivicReportOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const [isDemoControlOpen, setIsDemoControlOpen] = useState(false);

  return (
    <div
      className={`min-h-screen bg-[#0A0C10] text-[#E0E6ED] flex flex-col font-sans selection:bg-teal-500 selection:text-black ${
        accessibilitySettings.highContrast ? "contrast-125 saturate-150" : ""
      } ${accessibilitySettings.largeText ? "text-sm" : ""}`}
    >
      {/* Top Fixed Header Navigation */}
      <HeaderNav
        onNavigateHome={() => setActiveTab("home")}
        onOpenAreaPicker={() => setIsAreaPickerOpen(true)}
        onOpenAreaCompare={() => setIsAreaCompareOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenAccessibility={() => setIsAccessibilityOpen(true)}
        onOpenDemoControl={() => setIsDemoControlOpen(true)}
      />

      {/* Guided Heavy Rain / Scenario Alert Banner */}
      {currentScenario === "heavy_rain" && (
        <div className="bg-gradient-to-r from-amber-950/80 via-[#0D1117] to-amber-950/80 border-b border-amber-500/30 px-4 py-2.5 text-xs text-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-2 max-w-4xl mx-auto font-mono">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 animate-bounce" />
            <span>
              <strong className="text-amber-400 uppercase tracking-widest">
                {t("heavyRainAlert", "HEAVY RAIN APPROACHING NOVACITY")}:
              </strong>{" "}
              Precipitation spiking to 35mm. Drainage load increased in Lowland underpass. Copilot & Risk Radar active.
            </span>
          </div>
          <button
            onClick={() => setIsDemoControlOpen(true)}
            className="hidden sm:inline bg-amber-500 text-black font-extrabold px-3 py-1 rounded-lg text-[10px] uppercase tracking-wider hover:bg-amber-400 transition-colors"
          >
            {t("changeScenario", "Change Scenario")}
          </button>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 space-y-5">
        {/* Living City Pipeline Indicator */}
        <div className="bg-[#0D1117]/80 border border-white/10 rounded-xl p-2.5 flex items-center justify-between text-[10px] font-mono text-white/50 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 shrink-0 tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span className="font-bold text-white">{t("sense", "SENSE")}</span>
            <span className="text-white/20">&rarr;</span>
            <span className="text-teal-400 font-bold">{t("understand", "UNDERSTAND")}</span>
            <span className="text-white/20">&rarr;</span>
            <span className="text-cyan-400 font-bold">{t("predictStep", "PREDICT")}</span>
            <span className="text-white/20">&rarr;</span>
            <span className="text-indigo-400 font-bold">{t("simulateStep", "SIMULATE")}</span>
            <span className="text-white/20">&rarr;</span>
            <span className="text-amber-400 font-bold">{t("recommendStep", "RECOMMEND")}</span>
            <span className="text-white/20">&rarr;</span>
            <span className="text-rose-400 font-bold">{t("actStep", "ACT")}</span>
            <span className="text-white/20">&rarr;</span>
            <span className="text-emerald-400 font-bold">{t("learnStep", "LEARN")}</span>
          </div>
          <button
            onClick={() => setIsDemoControlOpen(true)}
            className="text-teal-400 hover:text-teal-300 flex items-center gap-1 shrink-0 font-sans font-extrabold text-[11px] uppercase tracking-wider ml-3"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>{t("simulateConditions", "Simulate Conditions")}</span>
          </button>
        </div>

        {/* Primary Tab Bar Navigation */}
        <nav className="flex gap-1.5 overflow-x-auto no-scrollbar bg-[#0D1117]/90 p-1.5 rounded-2xl border border-white/10 text-xs font-bold">
          {[
            { id: "home", label: t("homeHub", "Home Hub"), icon: Home, highlight: true },
            { id: "twin", label: t("digitalTwin", "Digital Twin"), icon: Layers },
            { id: "briefing", label: t("briefingPulse", "Briefing & Pulse"), icon: Activity },
            { id: "map", label: t("liveCityMap", "Live City Map"), icon: MapPin },
            { id: "copilot", label: t("cityCopilot", "CityCopilot AI"), icon: Bot },
            { id: "simulator", label: t("whatIfSimulator", "What-If Simulator"), icon: Sliders },
            { id: "civic", label: t("civicReporting", "Civic Reporting"), icon: Camera },
            { id: "travel", label: t("smartTravelTab", "Smart Travel"), icon: Navigation },
            { id: "environment", label: t("environmentGrid", "Environment & Grid"), icon: Wind },
            { id: "risk", label: t("riskRadarTab", "Risk Radar"), icon: ShieldAlert },
            { id: "memory", label: t("cityMemoryTab", "City Memory"), icon: History },
            { id: "alerts", label: t("alertsCenter", "Alerts Center"), icon: Bell },
            ...(isAuthorityMode ? [{ id: "authority", label: t("commandCenter", "Command Center"), icon: Building2 }] : []),
          ].map((tab) => {
            const IconComp = tab.icon;
            const isSelected = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all uppercase text-[11px] font-extrabold tracking-wider ${
                  isSelected
                    ? "bg-teal-500 text-black shadow-[0_0_15px_rgba(20,184,166,0.4)]"
                    : tab.highlight
                    ? "text-teal-300 bg-teal-950/40 border border-teal-500/30 hover:bg-teal-900/60"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <IconComp className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Tab -1: NovaCity Home Page (Feature Hub & Welcome Directory) */}
        {activeTab === "home" && (
          <CityHomePage
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenCivicReport={() => setIsCivicReportOpen(true)}
            onOpenAreaPicker={() => setIsAreaPickerOpen(true)}
            onOpenAreaCompare={() => setIsAreaCompareOpen(true)}
            onOpenDemoControl={() => setIsDemoControlOpen(true)}
            onOpenAccessibility={() => setIsAccessibilityOpen(true)}
          />
        )}

        {/* Tab 0: NovaCity Digital Twin */}
        {activeTab === "twin" && <DigitalTwinHub />}

        {/* Tab 1: Briefing & Pulse */}
        {activeTab === "briefing" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="space-y-5">
              <LivingCityPulse zone={currentZone} onTapScore={() => setActiveTab("risk")} />
              <CityHealthCard zone={currentZone} />
            </div>

            <div className="md:col-span-2 space-y-5">
              <CityBriefing zone={currentZone} areaName={currentZone.name} />

              {/* Action Shortcuts Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <button
                  onClick={() => setIsCivicReportOpen(true)}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 p-3.5 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all group hover:border-teal-500/40"
                >
                  <Camera className="w-5 h-5 text-teal-400 group-hover:scale-110 transition-transform" />
                  <span className="font-extrabold text-white uppercase text-[11px] tracking-wider">Report Problem</span>
                </button>

                <button
                  onClick={() => setActiveTab("copilot")}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 p-3.5 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all group hover:border-teal-500/40"
                >
                  <Bot className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span className="font-extrabold text-white uppercase text-[11px] tracking-wider">Talk to Copilot</span>
                </button>

                <button
                  onClick={() => setActiveTab("travel")}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 p-3.5 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all group hover:border-teal-500/40"
                >
                  <Navigation className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <span className="font-extrabold text-white uppercase text-[11px] tracking-wider">Smart Travel</span>
                </button>

                <button
                  onClick={() => setActiveTab("simulator")}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 p-3.5 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all group hover:border-teal-500/40"
                >
                  <Sliders className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
                  <span className="font-extrabold text-white uppercase text-[11px] tracking-wider">What-If Engine</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Live City Map */}
        {activeTab === "map" && <LiveCityMap />}

        {/* Tab 3: CityCopilot AI */}
        {activeTab === "copilot" && <CityCopilot />}

        {/* Tab 4: What-If Simulator */}
        {activeTab === "simulator" && <WhatIfSimulator />}

        {/* Tab 5: Civic Reporting */}
        {activeTab === "civic" && (
          <div className="space-y-5 min-w-0">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-[#0D1117]/90 p-4 sm:p-5 rounded-2xl border border-white/10">
              <div>
                <h3 className="font-bold text-teal-400 text-xs uppercase tracking-[0.15em]">HAVE A CIVIC HAZARD OR POTHOLE TO REPORT?</h3>
                <p className="text-xs text-white/60 mt-0.5">AI auto-detects problem category, severity, and nearby duplicates</p>
              </div>
              <button
                onClick={() => setIsCivicReportOpen(true)}
                className="bg-teal-500 hover:bg-teal-400 text-black font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-lg uppercase tracking-wider shrink-0 transition-colors"
              >
                <Camera className="w-4 h-4" />
                <span>Report Problem</span>
              </button>
            </div>
            <CivicIssueTracker />
          </div>
        )}

        {/* Tab 6: Smart Travel */}
        {activeTab === "travel" && <SmartTravel />}

        {/* Tab 7: Environment & Utilities */}
        {activeTab === "environment" && <EnvironmentGridDashboard />}

        {/* Tab 8: Risk Radar */}
        {activeTab === "risk" && <CityRiskRadar />}

        {/* Tab 9: City Memory & Sustainability */}
        {activeTab === "memory" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 min-w-0">
            <CityMemory />
            <SustainabilityCenter />
          </div>
        )}

        {/* Tab 10: City Alerts */}
        {activeTab === "alerts" && <CityAlertsCenter />}

        {/* Tab 11: Command Center */}
        {activeTab === "authority" && <AuthorityOperationsView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#0D1117]/80 py-5 px-4 text-center text-white/40 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-mono text-[11px] text-teal-400/80 uppercase tracking-wider font-bold">CITYMIND AI &bull; Living City Interface &bull; NovaCity Digital Twin</span>
          <span className="text-[10px] text-white/30 uppercase tracking-widest font-mono">Simulated Predictive Intelligence &bull; Privacy Secure</span>
        </div>
      </footer>

      {/* Modals */}
      <AreaPickerModal isOpen={isAreaPickerOpen} onClose={() => setIsAreaPickerOpen(false)} />
      <AreaCompareModal isOpen={isAreaCompareOpen} onClose={() => setIsAreaCompareOpen(false)} />
      <CivicReportingModal isOpen={isCivicReportOpen} onClose={() => setIsCivicReportOpen(false)} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <AccessibilityControls isOpen={isAccessibilityOpen} onClose={() => setIsAccessibilityOpen(false)} />
      <LanguageSelectorModal isOpen={isLanguageModalOpen} onClose={() => setIsLanguageModalOpen(false)} />
      <DemoControlCenterModal isOpen={isDemoControlOpen} onClose={() => setIsDemoControlOpen(false)} />

      {/* Digital Twin Specialized Modals */}
      <ExplainableAIModal />
      <AIConfidenceModal />
      <WhatWouldYouDoModal />
      <FixCityModal />
      <CityStoryModal />
      <DemoPlaybookModal />
    </div>
  );
}
