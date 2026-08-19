import React, { useState, useEffect, useRef } from "react";
import { useCity } from "../context/CityContext";
import { CityZone } from "../types";
import L from "leaflet";
import {
  Layers,
  MapPin,
  Search,
  ZoomIn,
  ZoomOut,
  Car,
  Wind,
  Droplets,
  Zap,
  Trash2,
  ShieldAlert,
  CloudRain,
  Plus,
  Compass,
  Check,
  Building,
  Radio,
  Eye,
  EyeOff,
  Flame,
  Activity,
  SlidersHorizontal,
  Play,
  Sun,
  RefreshCw,
  AlertTriangle,
  FastForward,
  X,
} from "lucide-react";

export const LiveCityMap: React.FC = () => {
  const {
    allZones,
    addMonitoredArea,
    setPrimaryAreaId,
    primaryAreaId,
    addCustomZone,
    civicReports,
    currentScenario,
    setScenario,
    setDemoScenario,
    simulatedTime,
    setSimulatedTime,
  } = useCity();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const overlaysLayerRef = useRef<L.LayerGroup | null>(null);
  const heatmapLayerRef = useRef<L.LayerGroup | null>(null);

  // Map Layer Toggles, Heatmap State & Simulation Drawer
  const [showSimDrawer, setShowSimDrawer] = useState(false);
  const [activeLayers, setActiveLayers] = useState({
    traffic: true,
    air: true,
    water: true,
    flood: true,
    waste: true,
    safety: true,
    energy: true,
  });

  const [heatmapMode, setHeatmapMode] = useState<"none" | "traffic" | "aqi" | "combined">("traffic");
  const [heatmapOpacity, setHeatmapOpacity] = useState<number>(0.7);

  const [selectedMapZone, setSelectedMapZone] = useState<CityZone | null>(null);
  const [showLayerPicker, setShowLayerPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingLocation, setIsAddingLocation] = useState(false);
  const [newLocationName, setNewLocationName] = useState("");
  const [clickedLatLng, setClickedLatLng] = useState<{ lat: number; lng: number } | null>(null);

  const toggleLayer = (layerKey: keyof typeof activeLayers) => {
    setActiveLayers((prev) => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  // Initialize Leaflet Map once
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Default center around NovaCity / Hyderabad region (17.40, 78.48)
    const initialLat = allZones[0]?.lat || 17.40;
    const initialLng = allZones[0]?.lng || 78.48;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 12,
      zoomControl: false,
      attributionControl: false,
    });

    // Dark Matter tile layer by CartoDB
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
      subdomains: "abcd",
    }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    overlaysLayerRef.current = L.layerGroup().addTo(map);
    heatmapLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    // Handle map click for adding custom location pin
    map.on("click", (e: L.LeafletMouseEvent) => {
      setClickedLatLng({ lat: e.latlng.lat, lng: e.latlng.lng });
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers, Overlays & Heatmaps whenever allZones, activeLayers, civicReports, currentScenario, or heatmapMode changes
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current || !overlaysLayerRef.current || !heatmapLayerRef.current) return;

    markersLayerRef.current.clearLayers();
    overlaysLayerRef.current.clearLayers();
    heatmapLayerRef.current.clearLayers();

    // 0. Render Heatmap Plumes if Heatmap Mode active
    if (heatmapMode !== "none") {
      allZones.forEach((zone) => {
        let intensity = 0; // 0 to 1

        if (heatmapMode === "traffic") {
          if (zone.traffic === "Congested") intensity = 0.95;
          else if (zone.traffic === "High") intensity = 0.80;
          else if (zone.traffic === "Moderate") intensity = 0.52;
          else intensity = 0.22;

          if (currentScenario === "heavy_traffic") {
            intensity = Math.min(1.0, intensity + 0.2);
          }
        } else if (heatmapMode === "aqi") {
          if (zone.aqi > 150) intensity = 0.98;
          else if (zone.aqi > 110) intensity = 0.82;
          else if (zone.aqi > 75) intensity = 0.58;
          else if (zone.aqi > 50) intensity = 0.38;
          else intensity = 0.20;
        } else if (heatmapMode === "combined") {
          const trafficVal = zone.traffic === "Congested" ? 1.0 : zone.traffic === "High" ? 0.8 : zone.traffic === "Moderate" ? 0.5 : 0.2;
          const aqiVal = Math.min(1.0, zone.aqi / 160);
          const floodVal = Math.min(1.0, zone.floodRiskPct / 100);
          intensity = trafficVal * 0.45 + aqiVal * 0.35 + floodVal * 0.2;
        }

        // Color ramp based on heat intensity
        const heatColor =
          intensity >= 0.75
            ? "#f43f5e" // Rose/Red
            : intensity >= 0.45
            ? "#f59e0b" // Amber/Orange
            : "#10b981"; // Emerald/Teal

        const strokeColor =
          intensity >= 0.75
            ? "#fda4af"
            : intensity >= 0.45
            ? "#fde68a"
            : "#a7f3d0";

        // Concentric heat plumes
        // Outer diffuse halo
        L.circle([zone.lat, zone.lng], {
          radius: 2400,
          color: strokeColor,
          fillColor: heatColor,
          fillOpacity: 0.15 * heatmapOpacity * intensity,
          stroke: false,
        }).addTo(heatmapLayerRef.current);

        // Mid density circle
        L.circle([zone.lat, zone.lng], {
          radius: 1400,
          color: strokeColor,
          fillColor: heatColor,
          fillOpacity: 0.35 * heatmapOpacity * intensity,
          stroke: true,
          weight: 1,
          opacity: 0.25 * heatmapOpacity,
        }).addTo(heatmapLayerRef.current);

        // Core hotspot center
        L.circle([zone.lat, zone.lng], {
          radius: 600,
          color: heatColor,
          fillColor: heatColor,
          fillOpacity: 0.68 * heatmapOpacity * intensity,
          stroke: true,
          weight: 2,
          opacity: 0.6 * heatmapOpacity,
        }).addTo(heatmapLayerRef.current);
      });

      // Interpolate heat corridors between adjacent zones
      for (let i = 0; i < allZones.length - 1; i++) {
        const z1 = allZones[i];
        const z2 = allZones[i + 1];

        const midLat = (z1.lat + z2.lat) / 2;
        const midLng = (z1.lng + z2.lng) / 2;

        let midIntensity = 0;
        if (heatmapMode === "traffic") {
          midIntensity = ((z1.traffic === "High" || z1.traffic === "Congested" ? 0.85 : 0.4) + (z2.traffic === "High" || z2.traffic === "Congested" ? 0.85 : 0.4)) / 2;
        } else if (heatmapMode === "aqi") {
          midIntensity = Math.min(1.0, ((z1.aqi + z2.aqi) / 2) / 140);
        } else {
          midIntensity = 0.5;
        }

        if (midIntensity > 0.35) {
          const midColor = midIntensity >= 0.7 ? "#f43f5e" : "#f59e0b";
          L.circle([midLat, midLng], {
            radius: 1000,
            color: midColor,
            fillColor: midColor,
            fillOpacity: 0.22 * heatmapOpacity * midIntensity,
            stroke: false,
          }).addTo(heatmapLayerRef.current);
        }
      }
    }

    // 1. Render Traffic Connectors if Traffic Layer active
    if (activeLayers.traffic && allZones.length > 1) {
      for (let i = 0; i < allZones.length - 1; i++) {
        const z1 = allZones[i];
        const z2 = allZones[i + 1];

        const isCongested = z1.traffic === "High" || z1.traffic === "Congested" || z2.traffic === "Congested";
        const isHeavyTrafficScenario = currentScenario === "heavy_traffic";
        const strokeColor = isHeavyTrafficScenario || isCongested ? "#ef4444" : z1.traffic === "Moderate" ? "#f59e0b" : "#3b82f6";

        const polyline = L.polyline(
          [
            [z1.lat, z1.lng],
            [z2.lat, z2.lng],
          ],
          {
            color: strokeColor,
            weight: isCongested ? 4 : 2,
            opacity: 0.6,
            dashArray: isCongested ? "6, 6" : undefined,
          }
        );
        polyline.addTo(overlaysLayerRef.current);
      }
    }

    // 2. Render Zone Custom Markers & Overlays
    allZones.forEach((zone) => {
      const isPrimary = zone.id === primaryAreaId;
      const isHighFlood = zone.floodRiskPct > 40 || currentScenario === "heavy_rain" || currentScenario === "flood_risk";
      const isPoorAir = zone.aqi > 80;

      // Air Quality Overlay Circles
      if (activeLayers.air) {
        const aqiColor = zone.aqi > 120 ? "#f43f5e" : zone.aqi > 70 ? "#f59e0b" : "#10b981";
        const airCircle = L.circle([zone.lat, zone.lng], {
          radius: 900,
          color: aqiColor,
          fillColor: aqiColor,
          fillOpacity: 0.18,
          stroke: false,
        });
        airCircle.addTo(overlaysLayerRef.current);
      }

      // Flood Risk Radar Circles
      if (activeLayers.flood && isHighFlood) {
        const floodCircle = L.circle([zone.lat, zone.lng], {
          radius: 1200,
          color: "#6366f1",
          fillColor: "#6366f1",
          fillOpacity: 0.25,
          weight: 2,
        });
        floodCircle.addTo(overlaysLayerRef.current);
      }

      // Custom DivIcon for Zone Nodes
      const healthColor =
        zone.healthScore >= 80 ? "#10b981" : zone.healthScore >= 60 ? "#f59e0b" : "#f43f5e";

      const iconHtml = `
        <div style="
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          transform: translate(-50%, -50%);
        ">
          ${
            isPrimary
              ? `<div style="
                  position: absolute;
                  width: 52px;
                  height: 52px;
                  border-radius: 50%;
                  border: 2px solid #14b8a6;
                  box-shadow: 0 0 15px rgba(20, 184, 166, 0.6);
                  animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
                "></div>`
              : ""
          }
          <div style="
            width: 38px;
            height: 38px;
            background-color: #0f172a;
            border: 3px solid ${healthColor};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            font-weight: 800;
            font-size: 11px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.8);
            font-family: monospace;
          ">
            ${zone.healthScore}
          </div>
          <div style="
            margin-top: 3px;
            background-color: rgba(15, 23, 42, 0.95);
            border: 1px solid rgba(255, 255, 255, 0.15);
            padding: 2px 7px;
            border-radius: 8px;
            color: #e2e8f0;
            font-size: 10px;
            font-weight: 700;
            white-space: nowrap;
            box-shadow: 0 2px 8px rgba(0,0,0,0.6);
          ">
            ${zone.name}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: "custom-zone-node",
        iconSize: [40, 50],
        iconAnchor: [20, 25],
      });

      const marker = L.marker([zone.lat, zone.lng], { icon: customIcon });

      marker.on("click", () => {
        setSelectedMapZone(zone);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([zone.lat, zone.lng], 14, { duration: 1 });
        }
      });

      marker.addTo(markersLayerRef.current);
    });

    // 3. Render Civic Reports Pins if Safety Layer active
    if (activeLayers.safety && civicReports) {
      civicReports.slice(0, 8).forEach((rep) => {
        if (!rep.lat || !rep.lng) return;

        const repHtml = `
          <div style="
            background-color: #be123c;
            border: 2px solid #fda4af;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 11px;
            box-shadow: 0 0 10px rgba(244, 63, 94, 0.8);
          ">
            !
          </div>
        `;

        const repIcon = L.divIcon({
          html: repHtml,
          className: "civic-report-pin",
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        const repMarker = L.marker([rep.lat, rep.lng], { icon: repIcon });
        repMarker.bindPopup(`
          <div style="color: #0f172a; font-size: 11px; font-family: sans-serif; padding: 2px;">
            <strong style="color: #be123c; display: block; font-size: 12px;">${rep.title}</strong>
            <span>${rep.category} &bull; Severity: ${rep.severity}</span>
          </div>
        `);
        repMarker.addTo(overlaysLayerRef.current);
      });
    }
  }, [allZones, activeLayers, primaryAreaId, civicReports, currentScenario, heatmapMode, heatmapOpacity]);

  // Handle Search Flight
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const matchedZone = allZones.find(
      (z) => z.name.toLowerCase().includes(searchQuery.toLowerCase()) || z.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (matchedZone && mapInstanceRef.current) {
      setSelectedMapZone(matchedZone);
      mapInstanceRef.current.flyTo([matchedZone.lat, matchedZone.lng], 14, { duration: 1.2 });
    }
  };

  // Zoom Handlers
  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();

  // Add Custom Location Handler
  const handleAddCustomLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clickedLatLng || !newLocationName.trim()) return;

    addCustomZone({
      name: newLocationName.trim(),
      region: "Custom Map Pin",
      lat: clickedLatLng.lat,
      lng: clickedLatLng.lng,
      healthPreset: "normal",
    });

    setNewLocationName("");
    setClickedLatLng(null);
    setIsAddingLocation(false);
  };

  return (
    <div className="relative w-full h-[580px] bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col font-sans">
      {/* Top Map Toolbar & Search */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Title Badge & Search Bar */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="bg-[#0D1117]/90 backdrop-blur-md border border-slate-800 px-3 py-2 rounded-xl flex items-center gap-2 shadow-xl">
            <Radio className="w-4 h-4 text-teal-400 animate-pulse" />
            <span className="text-xs font-black text-white uppercase tracking-wider hidden sm:inline">
              NOVACITY DIGITAL TWIN
            </span>
          </div>

          <form onSubmit={handleSearch} className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search zone / city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#0D1117]/90 border border-slate-800 text-slate-100 text-xs rounded-xl pl-8 pr-3 py-1.5 w-36 sm:w-56 focus:outline-none focus:border-teal-500 shadow-xl backdrop-blur-md placeholder-slate-500"
            />
          </form>
        </div>

        {/* Layer Toggle & Action Buttons */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => setIsAddingLocation(!isAddingLocation)}
            className="bg-teal-600 hover:bg-teal-500 text-white backdrop-blur-md p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xl transition-colors uppercase tracking-wider"
            title="Click on map to drop a new monitored city pin"
          >
            <Plus className="w-4 h-4 text-teal-200" />
            <span className="hidden sm:inline">Add Pin</span>
          </button>

          <button
            onClick={() => {
              setShowSimDrawer(!showSimDrawer);
              if (showLayerPicker) setShowLayerPicker(false);
            }}
            className={`backdrop-blur-md border p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xl transition-all ${
              showSimDrawer || currentScenario !== "normal"
                ? "bg-amber-500/20 border-amber-500/80 text-amber-300 font-extrabold shadow-amber-500/10"
                : "bg-[#0D1117]/90 hover:bg-slate-800 border-slate-800 text-slate-200"
            }`}
            title="Simulate urban weather, traffic & grid conditions"
          >
            <SlidersHorizontal className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Simulate Conditions</span>
            {currentScenario !== "normal" && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            )}
          </button>

          <button
            onClick={() => {
              setShowLayerPicker(!showLayerPicker);
              if (showSimDrawer) setShowSimDrawer(false);
            }}
            className={`backdrop-blur-md border p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xl transition-colors ${
              showLayerPicker
                ? "bg-teal-500 text-black border-teal-400 font-extrabold"
                : "bg-[#0D1117]/90 hover:bg-slate-800 border-slate-800 text-slate-200"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span className="hidden sm:inline">Map Layers</span>
          </button>
        </div>
      </div>

      {/* Heatmap Mode Selector Pills Bar */}
      <div className="absolute top-14 left-3 z-20 flex items-center gap-1.5 bg-[#0D1117]/95 border border-slate-800/90 p-1 rounded-xl shadow-xl backdrop-blur-md overflow-x-auto max-w-[calc(100vw-2rem)] sm:max-w-none">
        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-2 flex items-center gap-1 shrink-0">
          <Flame className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
          <span className="hidden sm:inline">Heatmap:</span>
        </span>

        {[
          { id: "none", label: "Off", icon: EyeOff },
          { id: "traffic", label: "Traffic Density", icon: Car },
          { id: "aqi", label: "Air Quality (AQI)", icon: Wind },
          { id: "combined", label: "Combined Stress", icon: Activity },
        ].map((mode) => {
          const IconComp = mode.icon;
          const isActive = heatmapMode === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => setHeatmapMode(mode.id as any)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                isActive
                  ? "bg-gradient-to-r from-orange-500 to-rose-600 text-white shadow-md font-black"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <IconComp className="w-3 h-3" />
              <span>{mode.label}</span>
            </button>
          );
        })}
      </div>

      {/* SIMULATE CONDITIONS DRAWER */}
      {showSimDrawer && (
        <div className="absolute top-16 right-3 z-30 bg-[#0D1117]/95 border border-amber-500/40 p-4 rounded-2xl shadow-2xl w-80 text-xs space-y-3 backdrop-blur-md animate-in slide-in-from-top-2 duration-200">
          <div className="font-extrabold text-amber-400 text-xs uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-amber-400" />
              <span>SIMULATE CITY CONDITIONS</span>
            </span>
            <button onClick={() => setShowSimDrawer(false)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Active Scenario Summary Card */}
          <div className="bg-amber-950/40 border border-amber-800/60 p-2.5 rounded-xl text-[11px] space-y-1">
            <div className="flex items-center justify-between font-bold text-amber-300">
              <span className="flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Active Physics Engine State</span>
              </span>
              <span className="uppercase text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono border border-amber-500/40">
                {currentScenario}
              </span>
            </div>
            <p className="text-slate-300 text-[10px] leading-relaxed">
              {currentScenario === "heavy_rain"
                ? "🌧️ Heavy precipitation cascading across lowlands (Zone 5). Flood risk elevated to 82%, traffic congested."
                : currentScenario === "heavy_traffic"
                ? "🚗 Peak commute gridlock simulated across Central & Highway corridors."
                : currentScenario === "high_pollution"
                ? "💨 PM2.5 spike in Industrial District dispersing towards central metro."
                : currentScenario === "water_anomaly"
                ? "💧 Water pressure drop flagged in Zone 5 distribution grid."
                : "☀️ Baseline normal operating conditions across all city districts."}
            </p>
          </div>

          {/* Time Travel Buttons */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Time of Day</span>
              <span className="text-cyan-400 font-mono font-bold">{simulatedTime}</span>
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { label: "Morning Peak (08:30)", value: "08:30 AM" },
                { label: "Afternoon (02:00)", value: "02:00 PM" },
                { label: "Evening Peak (08:00)", value: "08:00 PM" },
                { label: "Night Off-Peak (11:30)", value: "11:30 PM" },
              ].map((t) => (
                <button
                  key={t.value}
                  onClick={() => setSimulatedTime(t.value)}
                  className={`py-1 px-2 rounded-lg text-[10px] font-bold border transition-all ${
                    simulatedTime === t.value
                      ? "bg-cyan-500/20 border-cyan-400 text-cyan-300"
                      : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Scenario Presets */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Simulated Scenario Presets
            </label>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {[
                { id: "normal", name: "Normal Day", desc: "Balanced grid & traffic", icon: Sun, color: "text-amber-400" },
                { id: "heavy_rain", name: "Heavy Rain & Flood", desc: "85mm rainfall, Zone 5 flood risk", icon: CloudRain, color: "text-indigo-400" },
                { id: "heavy_traffic", name: "Peak Traffic Jam", desc: "Gridlock across arterial roads", icon: Car, color: "text-rose-400" },
                { id: "high_pollution", name: "AQI Spike Anomaly", desc: "Industrial PM2.5 spike to 188", icon: Wind, color: "text-emerald-400" },
                { id: "water_anomaly", name: "Water Pipe Leak", desc: "28% consumption surge flagged", icon: Droplets, color: "text-cyan-400" },
                { id: "power_spike", name: "Power Grid Surge", desc: "150% peak load stress", icon: Zap, color: "text-yellow-400" },
              ].map((scen) => {
                const IconComp = scen.icon;
                const isSelected = currentScenario === scen.id;
                return (
                  <button
                    key={scen.id}
                    onClick={() => {
                      if (setScenario) setScenario(scen.id as any);
                      else if (setDemoScenario) setDemoScenario(scen.id as any);
                    }}
                    className={`w-full text-left p-2 rounded-xl border transition-all flex items-center justify-between ${
                      isSelected
                        ? "bg-amber-500/20 border-amber-500/80 text-white font-bold shadow-md"
                        : "bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <IconComp className={`w-3.5 h-3.5 ${scen.color}`} />
                      <div>
                        <div className="text-[11px] font-bold">{scen.name}</div>
                        <div className="text-[9px] text-slate-400">{scen.desc}</div>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="text-[9px] font-extrabold bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded">
                        ACTIVE
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Layer Picker Drawer */}
      {showLayerPicker && (
        <div className="absolute top-16 right-3 z-30 bg-[#0D1117]/95 border border-slate-800 p-3 rounded-2xl shadow-2xl w-52 text-xs space-y-2 backdrop-blur-md animate-in fade-in duration-200">
          <div className="font-extrabold text-teal-400 text-[10px] uppercase tracking-wider border-b border-slate-800 pb-1.5 flex items-center justify-between">
            <span>LIVE TELEMETRY LAYERS</span>
            <button onClick={() => setShowLayerPicker(false)} className="text-slate-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {[
            { key: "traffic", label: "Traffic Arteries", icon: Car, color: "text-blue-400" },
            { key: "air", label: "Air Pollution Heat", icon: Wind, color: "text-emerald-400" },
            { key: "water", label: "Water Pressure Grid", icon: Droplets, color: "text-cyan-400" },
            { key: "flood", label: "Flood Risk Radar", icon: CloudRain, color: "text-indigo-400" },
            { key: "safety", label: "Civic Hazards & Incidents", icon: ShieldAlert, color: "text-rose-400" },
            { key: "energy", label: "Power Load Nodes", icon: Zap, color: "text-yellow-400" },
          ].map((item) => {
            const IconComp = item.icon;
            const isChecked = (activeLayers as any)[item.key];
            return (
              <label
                key={item.key}
                className="flex items-center justify-between p-1.5 hover:bg-slate-800/80 rounded-xl cursor-pointer text-slate-300 font-semibold transition-colors"
              >
                <div className="flex items-center gap-2">
                  <IconComp className={`w-3.5 h-3.5 ${item.color}`} />
                  <span>{item.label}</span>
                </div>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleLayer(item.key as any)}
                  className="rounded bg-slate-800 border-slate-700 text-teal-500 focus:ring-0 cursor-pointer"
                />
              </label>
            );
          })}
        </div>
      )}

      {/* Custom Location Modal Popup (If Add Pin active and location clicked) */}
      {isAddingLocation && clickedLatLng && (
        <div className="absolute top-16 left-3 z-30 bg-[#0D1117]/95 border border-teal-500/40 p-3.5 rounded-2xl shadow-2xl w-64 text-xs backdrop-blur-md">
          <div className="flex items-center justify-between mb-2">
            <span className="font-extrabold text-teal-400 uppercase text-[11px] flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-teal-400" />
              <span>Add Custom District Pin</span>
            </span>
            <button onClick={() => setClickedLatLng(null)} className="text-slate-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <form onSubmit={handleAddCustomLocation} className="space-y-2">
            <div>
              <label className="text-[10px] font-bold text-slate-400 block mb-1">CITY / DISTRICT NAME</label>
              <input
                type="text"
                required
                placeholder="e.g. Kondapur Tech Park"
                value={newLocationName}
                onChange={(e) => setNewLocationName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-teal-500 text-xs"
              />
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              GPS: {clickedLatLng.lat.toFixed(4)}, {clickedLatLng.lng.toFixed(4)}
            </div>
            <button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-1.5 rounded-lg transition-colors text-xs uppercase tracking-wider"
            >
              Add to Digital Twin
            </button>
          </form>
        </div>
      )}

      {/* Leaflet Map Div Container */}
      <div ref={mapContainerRef} className="w-full h-full bg-slate-950 z-10" />

      {/* Floating Heatmap Legend & Opacity Control (Bottom Left) */}
      {heatmapMode !== "none" && !selectedMapZone && (
        <div className="absolute bottom-4 left-4 z-20 bg-[#0D1117]/95 border border-slate-800/90 p-3 rounded-2xl shadow-2xl backdrop-blur-md max-w-xs text-xs space-y-2 animate-in fade-in duration-300">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span className="font-extrabold text-teal-400 text-[10px] uppercase tracking-wider flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span>
                {heatmapMode === "traffic"
                  ? "Traffic Density Heatmap"
                  : heatmapMode === "aqi"
                  ? "Air Quality (AQI) Heatmap"
                  : "Combined City Stress Heatmap"}
              </span>
            </span>
          </div>

          {/* Color Gradient Scale */}
          <div className="space-y-1">
            <div className="h-2.5 w-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-600 shadow-inner" />
            <div className="flex justify-between text-[9px] font-extrabold text-slate-400 uppercase tracking-tight">
              <span className="text-emerald-400">Low / Clean</span>
              <span className="text-amber-400">Moderate</span>
              <span className="text-rose-400">High / Severe</span>
            </div>
          </div>

          {/* Heatmap Opacity Control Slider */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/60">
            <span className="text-[10px] font-bold text-slate-400">Intensity Opacity:</span>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0.2"
                max="1.0"
                step="0.05"
                value={heatmapOpacity}
                onChange={(e) => setHeatmapOpacity(parseFloat(e.target.value))}
                className="w-20 accent-teal-500 cursor-pointer h-1 bg-slate-800 rounded-lg"
              />
              <span className="text-[10px] font-mono text-slate-300 font-bold w-7 text-right">
                {Math.round(heatmapOpacity * 100)}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Map Zoom Controls Bottom Right */}
      <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-1.5">
        <button
          onClick={handleZoomIn}
          className="bg-[#0D1117]/90 border border-slate-800 p-2 rounded-xl text-slate-200 hover:bg-slate-800 shadow-xl backdrop-blur-md transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4 text-teal-400" />
        </button>
        <button
          onClick={handleZoomOut}
          className="bg-[#0D1117]/90 border border-slate-800 p-2 rounded-xl text-slate-200 hover:bg-slate-800 shadow-xl backdrop-blur-md transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4 text-teal-400" />
        </button>
      </div>

      {/* Selected Zone Digital Twin Inspector Drawer */}
      {selectedMapZone && (
        <div className="absolute bottom-3 left-3 right-14 sm:right-3 z-30 bg-[#0D1117]/95 border border-slate-800 rounded-2xl p-3.5 sm:p-4 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-white text-sm">{selectedMapZone.name}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                    selectedMapZone.healthScore >= 80
                      ? "bg-emerald-950/80 text-emerald-400 border-emerald-800"
                      : selectedMapZone.healthScore >= 60
                      ? "bg-amber-950/80 text-amber-400 border-amber-800"
                      : "bg-rose-950/80 text-rose-400 border-rose-800"
                  }`}
                >
                  {selectedMapZone.healthScore}/100 Health Score
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{selectedMapZone.type}</p>
            </div>

            <button
              onClick={() => setSelectedMapZone(null)}
              className="p-1 text-slate-400 hover:text-slate-200 text-xs rounded-lg hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-2.5 text-xs">
            <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-bold">Traffic Flow</span>
              <span className="font-extrabold text-blue-400">{selectedMapZone.traffic}</span>
            </div>

            <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-bold font-mono">Air Quality</span>
              <span className="font-extrabold text-emerald-400">{selectedMapZone.aqi} AQI ({selectedMapZone.aqiStatus})</span>
            </div>

            <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-bold">Flood Hazard</span>
              <span className="font-extrabold text-indigo-400">{selectedMapZone.floodRiskPct}% Risk</span>
            </div>

            <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-bold">Weather / Temp</span>
              <span className="font-extrabold text-cyan-400">{selectedMapZone.temp}°C, {selectedMapZone.weather}</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2 text-xs">
            <button
              onClick={() => {
                setPrimaryAreaId(selectedMapZone.id);
                setSelectedMapZone(null);
              }}
              className="flex-1 bg-teal-600 hover:bg-teal-500 text-white font-bold py-2 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5 uppercase tracking-wider text-[11px]"
            >
              <Check className="w-3.5 h-3.5 text-teal-200" />
              <span>Set as Primary Monitored Zone</span>
            </button>

            <button
              onClick={() => {
                addMonitoredArea({
                  name: selectedMapZone.name,
                  typeIcon: "custom",
                  isPrimary: true,
                  zoneId: selectedMapZone.id,
                  customLocationName: selectedMapZone.name,
                  lat: selectedMapZone.lat,
                  lng: selectedMapZone.lng,
                });
                setSelectedMapZone(null);
              }}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold py-2 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5 uppercase tracking-wider text-[11px]"
            >
              <Plus className="w-3.5 h-3.5 text-teal-400" />
              <span>Add Pin</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
