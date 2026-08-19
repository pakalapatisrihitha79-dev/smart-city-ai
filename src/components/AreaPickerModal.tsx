import React, { useState } from "react";
import { useCity } from "../context/CityContext";
import { CityZoneId } from "../types";
import { getTranslation } from "../utils/translations";
import {
  Navigation,
  Search,
  MapPin,
  Building2,
  X,
  CheckCircle2,
  Home,
  GraduationCap,
  Briefcase,
  Star,
  Compass,
  PlusCircle,
  Globe2,
} from "lucide-react";

interface AreaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AreaPickerModal: React.FC<AreaPickerModalProps> = ({ isOpen, onClose }) => {
  const { allZones, addMonitoredArea, addCustomZone, language } = useCity();

  const [activeTab, setActiveTab] = useState<"zones" | "search" | "add_custom" | "gps">("add_custom");

  // Custom City/District Form State
  const [customCityName, setCustomCityName] = useState("");
  const [customRegion, setCustomRegion] = useState("");
  const [customType, setCustomType] = useState("Residential & Business District");
  const [customPreset, setCustomPreset] = useState("normal");
  const [customSuccessMessage, setCustomSuccessMessage] = useState(false);

  // GPS State
  const [gpsLoading, setGpsLoading] = useState(false);
  const [detectedLocation, setDetectedLocation] = useState<{
    country: string;
    state: string;
    city: string;
    area: string;
    zoneId: CityZoneId;
    lat: number;
    lng: number;
  } | null>(null);

  // Search State
  const [searchQuery, setSearchQuery] = useState("");

  // Area Tag Selection
  const [selectedTag, setSelectedTag] = useState<"home" | "college" | "work" | "favorite" | "custom">("custom");
  const [isPrimaryCheck, setIsPrimaryCheck] = useState(true);

  if (!isOpen) return null;

  // Handle Adding Custom City or District
  const handleCreateCustomCity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCityName.trim()) return;

    addCustomZone({
      name: customCityName.trim(),
      region: customRegion.trim(),
      type: customType,
      healthPreset: customPreset,
    });

    setCustomSuccessMessage(true);
    setTimeout(() => {
      setCustomSuccessMessage(false);
      onClose();
    }, 800);
  };

  // Handle GPS Detection
  const handleDetectLocation = () => {
    setGpsLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGpsLoading(false);
          setDetectedLocation({
            country: "India",
            state: "Telangana",
            city: "NovaCity",
            area: "Central Avenue Neighborhood",
            zoneId: "central",
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        () => {
          setGpsLoading(false);
          // Fallback detected simulated GPS
          setDetectedLocation({
            country: "India",
            state: "Telangana",
            city: "NovaCity",
            area: "Central District — Tech Corridor",
            zoneId: "central",
            lat: 17.385,
            lng: 78.4867,
          });
        }
      );
    } else {
      setGpsLoading(false);
      setDetectedLocation({
        country: "India",
        state: "Telangana",
        city: "NovaCity",
        area: "Central District",
        zoneId: "central",
        lat: 17.385,
        lng: 78.4867,
      });
    }
  };

  // Filter zones for search autocomplete
  const filteredZones = allZones.filter(
    (z) =>
      z.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      z.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Confirm selection
  const handleConfirmArea = (
    name: string,
    zoneId: CityZoneId,
    customLocationName?: string,
    lat: number = 17.385,
    lng: number = 78.4867
  ) => {
    addMonitoredArea({
      name:
        selectedTag === "home"
          ? "Home"
          : selectedTag === "college"
          ? "College"
          : selectedTag === "work"
          ? "Work"
          : selectedTag === "favorite"
          ? "Favorite"
          : name,
      typeIcon: selectedTag,
      isPrimary: isPrimaryCheck,
      zoneId,
      customLocationName: customLocationName || name,
      lat,
      lng,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-5 shadow-2xl relative flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Compass className="w-5 h-5 text-cyan-400" />
              WHERE DO YOU WANT CITYMIND TO MONITOR?
            </h2>
            <p className="text-xs text-slate-400">Select an area to start intelligent monitoring</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 bg-slate-800 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Option Tabs */}
        <div className="grid grid-cols-4 gap-1 bg-slate-800/60 p-1 rounded-xl my-4 text-[11px] font-semibold">
          <button
            onClick={() => setActiveTab("add_custom")}
            className={`py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === "add_custom"
                ? "bg-teal-600 text-white shadow font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5 text-teal-300" />
            <span>Add City/District</span>
          </button>

          <button
            onClick={() => setActiveTab("zones")}
            className={`py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === "zones" ? "bg-cyan-600 text-white shadow" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>City Zones</span>
          </button>

          <button
            onClick={() => setActiveTab("search")}
            className={`py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === "search" ? "bg-cyan-600 text-white shadow" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search</span>
          </button>

          <button
            onClick={() => setActiveTab("gps")}
            className={`py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === "gps" ? "bg-cyan-600 text-white shadow" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>GPS Location</span>
          </button>
        </div>

        {/* Tag Picker */}
        <div className="mb-4 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            ASSIGN SHORTCUT ICON
          </label>
          <div className="flex gap-2 text-xs">
            {[
              { id: "home", label: "Home", icon: Home },
              { id: "college", label: "College", icon: GraduationCap },
              { id: "work", label: "Work", icon: Briefcase },
              { id: "favorite", label: "Favorite", icon: Star },
              { id: "custom", label: "Custom", icon: MapPin },
            ].map((tag) => {
              const IconComp = tag.icon;
              return (
                <button
                  key={tag.id}
                  onClick={() => setSelectedTag(tag.id as any)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs transition-colors ${
                    selectedTag === tag.id
                      ? "bg-cyan-950 border-cyan-500 text-cyan-300 font-bold"
                      : "bg-slate-800 border-slate-700 text-slate-400"
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span>{tag.label}</span>
                </button>
              );
            })}
          </div>

          <label className="flex items-center gap-2 mt-3 text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={isPrimaryCheck}
              onChange={(e) => setIsPrimaryCheck(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0"
            />
            <span>Set as primary monitored area</span>
          </label>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {activeTab === "add_custom" && (
            <form onSubmit={handleCreateCustomCity} className="space-y-3 bg-slate-950/80 p-4 rounded-xl border border-teal-500/30">
              <div className="flex items-center gap-2 text-xs font-bold text-teal-400 mb-1">
                <Globe2 className="w-4 h-4 text-teal-400" />
                <span>{getTranslation(language, "customCityTitle")}</span>
              </div>

              {customSuccessMessage && (
                <div className="p-2.5 bg-teal-500/20 border border-teal-500/50 rounded-lg text-teal-300 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400" />
                  <span>{getTranslation(language, "customAreaAddedSuccess")}</span>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  {getTranslation(language, "cityNameLabel")} *
                </label>
                <input
                  type="text"
                  required
                  placeholder={getTranslation(language, "cityNamePlaceholder")}
                  value={customCityName}
                  onChange={(e) => setCustomCityName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  {getTranslation(language, "regionLabel")}
                </label>
                <input
                  type="text"
                  placeholder={getTranslation(language, "regionPlaceholder")}
                  value={customRegion}
                  onChange={(e) => setCustomRegion(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    {getTranslation(language, "areaCategoryLabel")}
                  </label>
                  <select
                    value={customType}
                    onChange={(e) => setCustomType(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-teal-500"
                  >
                    <option value="Residential & Business District">Residential & Commercial</option>
                    <option value="IT & Tech Corridor">IT & Tech Park Corridor</option>
                    <option value="Industrial Manufacturing Zone">Industrial & Logistics</option>
                    <option value="Historic & Heritage District">Historic & Cultural Center</option>
                    <option value="Suburban Residential Area">Suburban Residential Area</option>
                    <option value="Central Metro Transit Hub">Transit & Transport Hub</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    {getTranslation(language, "presetHealthLabel")}
                  </label>
                  <select
                    value={customPreset}
                    onChange={(e) => setCustomPreset(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-teal-500"
                  >
                    <option value="normal">Normal Baseline (Score: ~82)</option>
                    <option value="busy">High Congestion (Score: ~65)</option>
                    <option value="eco">Eco Green Corridor (Score: ~92)</option>
                    <option value="industrial">Heavy Industry Grid (Score: ~58)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs py-2.5 rounded-xl shadow-lg transition-colors flex items-center justify-center gap-1.5 uppercase tracking-wider"
              >
                <PlusCircle className="w-4 h-4 text-teal-200" />
                <span>{getTranslation(language, "addAndMonitor")}</span>
              </button>
            </form>
          )}
          {activeTab === "zones" && (
            <div className="space-y-2">
              <p className="text-xs text-slate-400">Select from NovaCity zones:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {allZones.map((z) => (
                  <div
                    key={z.id}
                    onClick={() => handleConfirmArea(z.name, z.id, z.name, z.lat, z.lng)}
                    className="p-3 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-cyan-500 rounded-xl cursor-pointer transition-all group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-100 text-xs group-hover:text-cyan-300">
                        {z.name}
                      </span>
                      <span className="text-[10px] bg-emerald-950 text-emerald-400 px-1.5 py-0.5 rounded font-bold border border-emerald-800">
                        {z.healthScore} Health
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 truncate">{z.type}</p>
                    <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-300">
                      <span>Traffic: {z.traffic}</span>
                      <span>•</span>
                      <span>AQI: {z.aqi}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "search" && (
            <div className="space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search city, area or locality (e.g. Central Avenue, Zone 4)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-2">
                {filteredZones.map((z) => (
                  <div
                    key={z.id}
                    onClick={() => handleConfirmArea(z.name, z.id, z.name, z.lat, z.lng)}
                    className="flex items-center justify-between p-3 bg-slate-800/60 hover:bg-slate-800 border border-slate-700 rounded-xl cursor-pointer"
                  >
                    <div>
                      <div className="font-bold text-slate-200 text-xs">{z.name}</div>
                      <div className="text-[10px] text-slate-400">{z.type}</div>
                    </div>
                    <span className="text-xs text-cyan-400 font-semibold">Monitor →</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "gps" && (
            <div className="text-center py-6 space-y-4">
              <Navigation className="w-10 h-10 text-cyan-400 mx-auto animate-bounce" />
              <p className="text-xs text-slate-300 max-w-xs mx-auto">
                Request current device geolocation to detect Country → State → City → Area
              </p>

              <button
                onClick={handleDetectLocation}
                disabled={gpsLoading}
                className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors inline-flex items-center gap-2"
              >
                {gpsLoading ? "Detecting Satellite Grid..." : "Detect Current Location"}
              </button>

              {detectedLocation && (
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-left space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>LOCATION DETECTED</span>
                  </div>
                  <div className="text-slate-200 font-semibold">{detectedLocation.area}</div>
                  <div className="text-slate-400 text-[11px]">
                    {detectedLocation.city}, {detectedLocation.state}, {detectedLocation.country}
                  </div>

                  <button
                    onClick={() =>
                      handleConfirmArea(
                        detectedLocation.area,
                        detectedLocation.zoneId,
                        detectedLocation.area,
                        detectedLocation.lat,
                        detectedLocation.lng
                      )
                    }
                    className="w-full mt-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-lg text-xs"
                  >
                    MONITOR THIS AREA
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
