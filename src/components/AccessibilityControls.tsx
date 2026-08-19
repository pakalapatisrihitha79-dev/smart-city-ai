import React from "react";
import { useCity } from "../context/CityContext";
import { SupportedLanguage, LANGUAGES } from "../utils/translations";
import { Eye, Type, Volume2, X, SlidersHorizontal, Globe, Check } from "lucide-react";

interface AccessibilityControlsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccessibilityControls: React.FC<AccessibilityControlsProps> = ({ isOpen, onClose }) => {
  const { accessibilitySettings, updateAccessibility, language, setLanguage, t } = useCity();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm text-xs animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-5 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <span className="font-bold text-slate-100 text-sm flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
            {t("accessibilityPreferences", "ACCESSIBILITY & PREFERENCES")}
          </span>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Language Selection Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              {t("preferredLanguage", "Preferred Language / భాష")}
            </span>
            <span className="text-[10px] text-white/40 font-mono">12 Options</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 bg-slate-950 p-2 rounded-xl border border-slate-800">
            {LANGUAGES.map((lang) => {
              const isSelected = language === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`p-2 rounded-lg border text-left flex items-center justify-between transition-all ${
                    isSelected
                      ? "bg-teal-500/20 border-teal-500 text-teal-300 font-bold"
                      : "bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  <div className="truncate">
                    <span className="block text-[11px] truncate">{lang.nativeName}</span>
                    <span className="text-[9px] text-white/40 font-mono uppercase">{lang.code}</span>
                  </div>
                  {isSelected && <Check className="w-3 h-3 text-teal-400 shrink-0 ml-1" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2 pt-2 border-t border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Visual & Audio Settings
          </span>

          {/* High Contrast */}
          <label className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer text-slate-200 hover:border-slate-700 transition-colors">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-cyan-400" />
              <span>{t("highContrastCanvas", "High Contrast Canvas")}</span>
            </div>
            <input
              type="checkbox"
              checked={accessibilitySettings.highContrast}
              onChange={(e) => updateAccessibility({ highContrast: e.target.checked })}
              className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0 cursor-pointer"
            />
          </label>

          {/* Large Text */}
          <label className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer text-slate-200 hover:border-slate-700 transition-colors">
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4 text-emerald-400" />
              <span>{t("largeTextScale", "Large Text Scale")}</span>
            </div>
            <input
              type="checkbox"
              checked={accessibilitySettings.largeText}
              onChange={(e) => updateAccessibility({ largeText: e.target.checked })}
              className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0 cursor-pointer"
            />
          </label>

          {/* Reduced Motion */}
          <label className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer text-slate-200 hover:border-slate-700 transition-colors">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-amber-400" />
              <span>{t("reduceMotion", "Reduce Motion & Pulse Animations")}</span>
            </div>
            <input
              type="checkbox"
              checked={accessibilitySettings.reduceMotion}
              onChange={(e) => updateAccessibility({ reduceMotion: e.target.checked })}
              className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0 cursor-pointer"
            />
          </label>

          {/* Voice Announcements */}
          <label className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer text-slate-200 hover:border-slate-700 transition-colors">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-rose-400" />
              <span>{t("voiceAnnouncements", "Screen Reader Voice Alerts")}</span>
            </div>
            <input
              type="checkbox"
              checked={accessibilitySettings.voiceAnnouncements}
              onChange={(e) => updateAccessibility({ voiceAnnouncements: e.target.checked })}
              className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0 cursor-pointer"
            />
          </label>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-teal-500 hover:bg-teal-400 text-black font-bold rounded-xl transition-colors text-xs"
          >
            {t("save", "Done")}
          </button>
        </div>
      </div>
    </div>
  );
};
