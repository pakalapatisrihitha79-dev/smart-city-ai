import React from "react";
import { useCity } from "../context/CityContext";
import { SupportedLanguage, LANGUAGES } from "../utils/translations";
import { IntelligenceGridStatus } from "./IntelligenceGridStatus";
import { GlobalCitySearch } from "./GlobalCitySearch";
import {
  Activity,
  Globe,
  User,
  Building2,
  SlidersHorizontal,
  Compass,
  Plus,
  Home,
  GraduationCap,
  Briefcase,
  Star,
  MapPin,
  Award,
  Languages,
} from "lucide-react";

interface HeaderNavProps {
  onNavigateHome?: () => void;
  onOpenAreaPicker: () => void;
  onOpenAreaCompare: () => void;
  onOpenAuth: () => void;
  onOpenAccessibility: () => void;
  onOpenDemoControl: () => void;
  onSelectTab?: (tab: string) => void;
  onOpenCivicReport?: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  onNavigateHome,
  onOpenAreaPicker,
  onOpenAreaCompare,
  onOpenAuth,
  onOpenAccessibility,
  onOpenDemoControl,
  onSelectTab,
  onOpenCivicReport,
}) => {
  const {
    monitoredAreas,
    primaryAreaId,
    setPrimaryAreaId,
    language,
    setLanguage,
    openLanguageModal,
    t,
    isAuthorityMode,
    toggleAuthorityMode,
    currentUser,
  } = useCity();

  const getTagIcon = (tag: string) => {
    switch (tag) {
      case "home":
        return Home;
      case "college":
        return GraduationCap;
      case "work":
        return Briefcase;
      case "favorite":
        return Star;
      default:
        return MapPin;
    }
  };

  const currentLangObj = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  return (
    <header className="bg-[#0D1117]/95 border-b border-white/10 sticky top-0 z-40 backdrop-blur-md px-4 py-2.5 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
        {/* Brand & Mobile Controls Row */}
        <div className="flex items-center justify-between gap-3">
          <div
            onClick={onNavigateHome}
            className={`flex items-center gap-2.5 ${onNavigateHome ? "cursor-pointer group" : ""}`}
            title="Go to CityMind AI Home Hub"
          >
            <div className="w-8 h-8 bg-teal-500 rounded-xl flex items-center justify-center text-black font-black text-xs shadow-[0_0_12px_rgba(20,184,166,0.5)] shrink-0 group-hover:scale-105 transition-transform">
              CM
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tighter text-white uppercase font-display group-hover:text-teal-300 transition-colors">
                  CityMind <span className="text-teal-400">AI</span>
                </h1>
                <span className="text-[9px] bg-white/5 text-teal-300 font-extrabold px-1.5 py-0.5 rounded-full border border-teal-500/30 uppercase tracking-widest font-mono">
                  OS
                </span>
              </div>
              <p className="text-[9px] font-bold text-white/50 tracking-[0.15em] uppercase hidden sm:block">
                {t("tagline", "Predict • Understand • Act — Living City")}
              </p>
            </div>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex md:hidden items-center gap-1.5">
            <IntelligenceGridStatus />

            <button
              onClick={openLanguageModal}
              className="px-2 py-1.5 bg-teal-500/15 hover:bg-teal-500/25 border border-teal-500/40 rounded-xl text-teal-300 font-bold text-xs flex items-center gap-1 shrink-0"
              title="Change Language / భాష మార్చండి"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="font-mono text-[10px] font-black uppercase">{language}</span>
            </button>

            <button
              onClick={onOpenDemoControl}
              className="p-2 text-amber-400 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-xs"
              title="Demo Control Center"
            >
              <Compass className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenAuth}
              className="p-2 text-slate-200 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-xs"
            >
              <User className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center: Global Quick Search Bar */}
        <div className="w-full lg:max-w-md xl:max-w-lg">
          <GlobalCitySearch
            onSelectTab={onSelectTab}
            onOpenAreaCompare={onOpenAreaCompare}
            onOpenDemoControl={onOpenDemoControl}
            onOpenAuth={onOpenAuth}
            onOpenAccessibility={onOpenAccessibility}
            onOpenCivicReport={onOpenCivicReport}
            onOpenAreaPicker={onOpenAreaPicker}
          />
        </div>

        {/* Monitored Areas Bar & Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Monitored Areas Chips */}
          <div className="flex items-center gap-1 bg-black/50 p-1 rounded-xl border border-white/10 max-w-full overflow-x-auto no-scrollbar">
            {monitoredAreas.map((area) => {
              const IconComp = getTagIcon(area.typeIcon);
              const isSelected = area.zoneId === primaryAreaId;

              return (
                <button
                  key={area.id}
                  onClick={() => setPrimaryAreaId(area.zoneId)}
                  className={`px-3 py-1 rounded-lg flex items-center gap-1.5 font-bold transition-all whitespace-nowrap uppercase text-[11px] tracking-wider ${
                    isSelected
                      ? "bg-teal-500 text-black shadow-lg font-black"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span>{area.name}</span>
                </button>
              );
            })}

            <button
              onClick={onOpenAreaPicker}
              className="px-2 py-1 text-white/50 hover:text-teal-400 hover:bg-white/5 rounded-lg flex items-center gap-1 font-bold whitespace-nowrap text-[11px] uppercase tracking-wider"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t("addArea", "Add")}</span>
            </button>
          </div>

          {/* Area Compare Button */}
          <button
            onClick={onOpenAreaCompare}
            className="px-2.5 py-1.5 text-amber-300 bg-white/5 hover:bg-white/10 border border-amber-500/30 rounded-xl font-bold flex items-center gap-1 shrink-0 uppercase text-[11px] tracking-wider"
            title="Compare Areas"
          >
            <Award className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t("compareAreas", "Compare")}</span>
          </button>

          {/* Desktop Language Selector Pill + Modal Trigger */}
          <div className="hidden sm:flex items-center bg-white/5 hover:bg-white/10 border border-white/10 hover:border-teal-500/30 rounded-xl px-2 py-1 shrink-0 transition-colors">
            <button
              onClick={openLanguageModal}
              className="flex items-center gap-1.5 text-teal-400 hover:text-teal-300 mr-1.5 pr-1.5 border-r border-white/10"
              title="Open Full Language Grid"
            >
              <Globe className="w-3.5 h-3.5 shrink-0" />
              <span className="font-extrabold text-[11px] uppercase tracking-wider text-slate-200">
                {currentLangObj.nativeName}
              </span>
            </button>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
              className="bg-transparent text-teal-300 font-mono font-bold text-[11px] focus:outline-none cursor-pointer uppercase"
              title="Switch Language"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-[#0D1117] text-slate-200">
                  {lang.nativeName} ({lang.code.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          {/* Authority Mode Switch */}
          <button
            onClick={toggleAuthorityMode}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 border transition-all shrink-0 uppercase tracking-wider ${
              isAuthorityMode
                ? "bg-amber-500/20 border-amber-500/60 text-amber-300"
                : "bg-white/5 border-white/10 text-white/70 hover:text-white hover:bg-white/10"
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">{isAuthorityMode ? "Authority Operations" : "Citizen View"}</span>
          </button>

          {/* Desktop Real-time Intelligence Grid Status Indicator */}
          <div className="hidden md:flex items-center shrink-0">
            <IntelligenceGridStatus />
          </div>

          {/* Desktop Right Controls */}
          <div className="hidden md:flex items-center gap-1.5 shrink-0">
            <button
              onClick={openLanguageModal}
              className="p-2 text-teal-300 bg-teal-500/10 hover:bg-teal-500/20 rounded-xl border border-teal-500/30 transition-colors"
              title="Change Language (12 Languages Available)"
            >
              <Languages className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenDemoControl}
              className="p-2 text-amber-400 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors"
              title="Demo Control Center & Time Travel"
            >
              <Compass className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenAccessibility}
              className="p-2 text-white/60 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors"
              title="Accessibility"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenAuth}
              className={`px-3 py-1.5 rounded-xl border font-bold flex items-center gap-1.5 uppercase text-xs tracking-wider transition-all ${
                currentUser
                  ? "bg-teal-500/10 border-teal-500/40 text-teal-300 hover:bg-teal-500/20"
                  : "bg-white/5 hover:bg-white/10 text-white border-white/10"
              }`}
              title={currentUser ? `Logged in as ${currentUser.email}` : "Sign In or Register"}
            >
              <User className="w-3.5 h-3.5 text-teal-400" />
              <span>{currentUser ? currentUser.name : t("login", "Sign In")}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
