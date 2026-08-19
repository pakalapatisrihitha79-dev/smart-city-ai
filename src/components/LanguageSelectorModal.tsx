import React, { useState } from "react";
import { useCity } from "../context/CityContext";
import { SupportedLanguage, LANGUAGES, LanguageOption } from "../utils/translations";
import { Globe, Check, Search, X, Sparkles, Languages } from "lucide-react";

interface LanguageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({ isOpen, onClose }) => {
  const { language, setLanguage, t } = useCity();
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  const filteredLanguages = LANGUAGES.filter(
    (lang) =>
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (code: SupportedLanguage) => {
    setLanguage(code);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  const getLanguageRegion = (code: SupportedLanguage) => {
    switch (code) {
      case "en":
        return "Global / International";
      case "te":
        return "Andhra Pradesh & Telangana, India";
      case "hi":
        return "National / North India";
      case "ta":
        return "Tamil Nadu & Singapore";
      case "kn":
        return "Karnataka, India";
      case "ml":
        return "Kerala, India";
      case "mr":
        return "Maharashtra, India";
      case "bn":
        return "Bengal & Bangladesh";
      case "es":
        return "Spain & Latin America";
      case "fr":
        return "France & Francophone";
      case "ar":
        return "Middle East & North Africa";
      case "zh":
        return "East Asia & Global";
      default:
        return "Global";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md text-xs animate-in fade-in duration-150">
      <div className="bg-[#0D1117] border border-white/15 w-full max-w-xl rounded-2xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300 shadow-[0_0_15px_rgba(20,184,166,0.3)]">
              <Languages className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-sm uppercase tracking-wider flex items-center gap-2">
                <span>{t("selectLanguage", "Select Application Language")}</span>
                <span className="text-[10px] bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full border border-teal-500/40 font-mono">
                  12 LANGUAGES
                </span>
              </h3>
              <p className="text-[11px] text-white/50">
                Instantly switch city telemetry, briefings, AI explanations, and alerts to your preferred dialect
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/40 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="py-3 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-white/40" />
            <input
              type="text"
              placeholder="Search language by name or script (e.g. Telugu, हिन्दी, Español)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-white placeholder-white/40 text-xs focus:outline-none focus:border-teal-500 transition-colors"
              autoFocus
            />
          </div>
        </div>

        {/* Language Grid */}
        <div className="overflow-y-auto pr-1 space-y-2 max-h-[60vh]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {filteredLanguages.map((lang: LanguageOption) => {
              const isSelected = language === lang.code;

              return (
                <button
                  key={lang.code}
                  onClick={() => handleSelect(lang.code)}
                  className={`p-3.5 rounded-xl border text-left transition-all relative flex items-center justify-between group ${
                    isSelected
                      ? "bg-teal-500/15 border-teal-500 shadow-[0_0_15px_rgba(20,184,166,0.2)]"
                      : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs uppercase shrink-0 transition-colors ${
                        isSelected
                          ? "bg-teal-500 text-black shadow-md font-mono"
                          : "bg-white/10 text-white/70 group-hover:bg-white/20 group-hover:text-white font-mono"
                      }`}
                    >
                      {lang.code}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-white text-xs tracking-wide">
                          {lang.nativeName}
                        </span>
                        <span className="text-[10px] text-white/40 font-medium">({lang.name})</span>
                      </div>
                      <span className="text-[10px] text-white/40 block mt-0.5 font-mono">
                        {getLanguageRegion(lang.code)}
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-teal-500 text-black flex items-center justify-center shrink-0 shadow-md">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {filteredLanguages.length === 0 && (
            <div className="p-8 text-center text-white/40 space-y-2">
              <Globe className="w-8 h-8 mx-auto text-white/20" />
              <p className="text-xs">No matching languages found for "{searchQuery}"</p>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="pt-3 border-t border-white/10 mt-3 shrink-0 flex items-center justify-between text-[11px] text-white/40">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>AI models translate all dynamic city telemetry in real-time</span>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition-colors"
          >
            {t("close", "Close")}
          </button>
        </div>
      </div>
    </div>
  );
};
