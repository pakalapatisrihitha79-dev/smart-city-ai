import React, { useState } from "react";
import { useCity } from "../context/CityContext";
import { TreePlantingLocation } from "../types";
import {
  Sun,
  Thermometer,
  TreePine,
  Sparkles,
  Layers,
  ArrowRight,
  TrendingDown,
  Wind,
  Droplets,
  ShieldAlert,
  Building,
  CheckCircle2,
  MapPin,
  Flame,
  Info,
  Calendar,
} from "lucide-react";

export const UrbanHeatIntelligence: React.FC = () => {
  const { allZones, currentZone } = useCity();

  const [selectedZoneId, setSelectedZoneId] = useState<string>(currentZone.id);
  const [selectedTreeRank, setSelectedTreeRank] = useState<number | null>(1);
  const [simulatedPlanted, setSimulatedPlanted] = useState<string[]>([]);
  const [coolingSimActive, setCoolingSimActive] = useState<boolean>(false);

  // Top 10 Recommended Tree-Planting Locations based on High Heat + Low Canopy + High Footfall + High PM2.5 + Low Shade
  const top10TreeLocations: TreePlantingLocation[] = [
    {
      id: "tree-1",
      rank: 1,
      name: "Lowland Inter-Modal Transit Bus Terminal Perimeter",
      zoneName: "Zone 4 (Lowland District)",
      zoneId: "zone-4",
      heatAnomalyC: +4.4,
      canopyCoverPct: 7,
      footfallPerDay: 28000,
      pm25Level: 148,
      shadeDeficitPct: 84,
      recommendedSaplingsCount: 180,
      recommendedSpecies: ["Neem (Azadirachta indica)", "Gulmohar", "Peepal"],
      expectedCoolingDeltaC: -2.8,
      annualCo2CaptureKg: 4320,
      costEstimate: "₹2.8 Lakh ($3,400)",
      feasibilityScore: 96,
    },
    {
      id: "tree-2",
      rank: 2,
      name: "Harbor Freight Connector & Industrial Sidewalks",
      zoneName: "Zone 7 (Harbor Link)",
      zoneId: "riverside",
      heatAnomalyC: +4.1,
      canopyCoverPct: 9,
      footfallPerDay: 14000,
      pm25Level: 162,
      shadeDeficitPct: 88,
      recommendedSaplingsCount: 240,
      recommendedSpecies: ["Conocarpus", "Banyan", "Cassia Fistula"],
      expectedCoolingDeltaC: -2.5,
      annualCo2CaptureKg: 5760,
      costEstimate: "₹3.6 Lakh ($4,300)",
      feasibilityScore: 94,
    },
    {
      id: "tree-3",
      rank: 3,
      name: "Downtown Commercial High-Street & Pedestrian Spine",
      zoneName: "Zone 1 (Downtown)",
      zoneId: "zone-1",
      heatAnomalyC: +3.8,
      canopyCoverPct: 12,
      footfallPerDay: 42000,
      pm25Level: 118,
      shadeDeficitPct: 76,
      recommendedSaplingsCount: 120,
      recommendedSpecies: ["Rain Tree (Samanea saman)", "Tabebuia Rosea"],
      expectedCoolingDeltaC: -2.2,
      annualCo2CaptureKg: 2880,
      costEstimate: "₹2.2 Lakh ($2,600)",
      feasibilityScore: 91,
    },
    {
      id: "tree-4",
      rank: 4,
      name: "North Ring Road Underpass Approaches",
      zoneName: "Zone 3 (North Ring)",
      zoneId: "zone-3",
      heatAnomalyC: +3.6,
      canopyCoverPct: 11,
      footfallPerDay: 19000,
      pm25Level: 124,
      shadeDeficitPct: 79,
      recommendedSaplingsCount: 160,
      recommendedSpecies: ["Mahogany", "Pongamia Pinnata"],
      expectedCoolingDeltaC: -2.1,
      annualCo2CaptureKg: 3840,
      costEstimate: "₹2.5 Lakh ($3,000)",
      feasibilityScore: 89,
    },
    {
      id: "tree-5",
      rank: 5,
      name: "Tech Park Boulevard & Commuter Bike Corridor",
      zoneName: "Zone 5 (Silicon Corridor)",
      zoneId: "zone-5",
      heatAnomalyC: +3.3,
      canopyCoverPct: 15,
      footfallPerDay: 31000,
      pm25Level: 98,
      shadeDeficitPct: 71,
      recommendedSaplingsCount: 150,
      recommendedSpecies: ["Jacaranda", "Indian Beech"],
      expectedCoolingDeltaC: -1.9,
      annualCo2CaptureKg: 3600,
      costEstimate: "₹2.4 Lakh ($2,900)",
      feasibilityScore: 93,
    },
    {
      id: "tree-6",
      rank: 6,
      name: "Hospital Care Complex Perimeter & Ambulance Drive",
      zoneName: "Zone 2 (Medical Hub)",
      zoneId: "zone-2",
      heatAnomalyC: +3.1,
      canopyCoverPct: 14,
      footfallPerDay: 22000,
      pm25Level: 104,
      shadeDeficitPct: 69,
      recommendedSaplingsCount: 110,
      recommendedSpecies: ["Arjun Tree (Terminalia arjuna)", "Neem"],
      expectedCoolingDeltaC: -1.8,
      annualCo2CaptureKg: 2640,
      costEstimate: "₹1.9 Lakh ($2,300)",
      feasibilityScore: 95,
    },
    {
      id: "tree-7",
      rank: 7,
      name: "Government Degree College Student Quad & Walkway",
      zoneName: "Zone 10 (University Ward)",
      zoneId: "university",
      heatAnomalyC: +2.9,
      canopyCoverPct: 18,
      footfallPerDay: 26000,
      pm25Level: 88,
      shadeDeficitPct: 64,
      recommendedSaplingsCount: 140,
      recommendedSpecies: ["Gulmohar", "Kadamba"],
      expectedCoolingDeltaC: -1.7,
      annualCo2CaptureKg: 3360,
      costEstimate: "₹2.1 Lakh ($2,500)",
      feasibilityScore: 92,
    },
    {
      id: "tree-8",
      rank: 8,
      name: "East Railway Junction West Gate Plaza",
      zoneName: "Zone 6 (East Railway Hub)",
      zoneId: "riverside",
      heatAnomalyC: +3.7,
      canopyCoverPct: 8,
      footfallPerDay: 38000,
      pm25Level: 136,
      shadeDeficitPct: 82,
      recommendedSaplingsCount: 200,
      recommendedSpecies: ["Peepal", "Neem", "Cassia"],
      expectedCoolingDeltaC: -2.4,
      annualCo2CaptureKg: 4800,
      costEstimate: "₹3.1 Lakh ($3,700)",
      feasibilityScore: 88,
    },
    {
      id: "tree-9",
      rank: 9,
      name: "Municipal Wholesale Vegetable & Grain Market Yard",
      zoneName: "Zone 4 (Lowland Market)",
      zoneId: "zone-4",
      heatAnomalyC: +4.2,
      canopyCoverPct: 6,
      footfallPerDay: 35000,
      pm25Level: 152,
      shadeDeficitPct: 89,
      recommendedSaplingsCount: 175,
      recommendedSpecies: ["Banyan", "Rain Tree", "Tamarind"],
      expectedCoolingDeltaC: -2.6,
      annualCo2CaptureKg: 4200,
      costEstimate: "₹2.7 Lakh ($3,200)",
      feasibilityScore: 87,
    },
    {
      id: "tree-10",
      rank: 10,
      name: "South Metro Feeder Station & Parking Lot",
      zoneName: "Zone 8 (South Sector)",
      zoneId: "green",
      heatAnomalyC: +2.8,
      canopyCoverPct: 19,
      footfallPerDay: 18000,
      pm25Level: 82,
      shadeDeficitPct: 58,
      recommendedSaplingsCount: 95,
      recommendedSpecies: ["Indian Rosewood", "Neem"],
      expectedCoolingDeltaC: -1.5,
      annualCo2CaptureKg: 2280,
      costEstimate: "₹1.6 Lakh ($1,900)",
      feasibilityScore: 94,
    },
  ];

  const activeZoneData = allZones.find((z) => z.id === selectedZoneId) || currentZone;

  // Calculate zone UHI attributes dynamically
  const buildingDensityPct = activeZoneData.type.includes("Commercial")
    ? 86
    : activeZoneData.type.includes("Industrial")
    ? 78
    : 62;
  const vegetationCanopyPct = activeZoneData.type.includes("Green")
    ? 45
    : activeZoneData.type.includes("Riverside")
    ? 32
    : 14;
  const asphaltCoveragePct = 100 - vegetationCanopyPct - (100 - buildingDensityPct) * 0.4;
  const surfaceTempAnomaly = Math.round((buildingDensityPct * 0.04 - vegetationCanopyPct * 0.06 + 2.1) * 10) / 10;
  const heatRiskLevel = surfaceTempAnomaly > 3.5 ? "HIGH" : surfaceTempAnomaly > 2.0 ? "MODERATE" : "LOW";

  const handlePlantTreesAction = (treeId: string) => {
    setCoolingSimActive(true);
    setTimeout(() => {
      setSimulatedPlanted((prev) => [...prev, treeId]);
      setCoolingSimActive(false);
    }, 450);
  };

  return (
    <div className="bg-[#0D1117]/95 border border-amber-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5 text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
            <Thermometer className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black text-white uppercase tracking-wider font-display">
                Urban Heat Island Intelligence <span className="text-amber-400">&bull; Microclimate & Afforestation</span>
              </h2>
              <span className="text-[9px] font-mono font-bold bg-amber-950 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/40">
                AI / GIS THERMAL MESH
              </span>
            </div>
            <p className="text-xs text-white/50">
              Identifies micro-urban heat traps based on density, canopy, asphalt & recommends high-ROI afforestation
            </p>
          </div>
        </div>

        {/* Zone Selector */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-white/50 uppercase font-bold">Zone:</span>
          <select
            value={selectedZoneId}
            onChange={(e) => setSelectedZoneId(e.target.value)}
            className="bg-[#0D1117] border border-white/20 rounded-xl px-3 py-1.5 text-xs font-bold text-white outline-none focus:border-amber-400"
          >
            {allZones.map((z) => (
              <option key={z.id} value={z.id}>
                {z.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 4 CORE UHI THERMAL METRICS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-black/40 p-3.5 rounded-2xl border border-white/10 space-y-0.5">
          <span className="text-[10px] text-white/50 block font-mono uppercase font-bold">Surface Temp Anomaly</span>
          <div className="text-xl font-black text-rose-400 font-mono">
            +{surfaceTempAnomaly}&deg;C
          </div>
          <span className="text-[10px] text-white/60 font-mono">Above baseline rural reference</span>
        </div>

        <div className="bg-black/40 p-3.5 rounded-2xl border border-white/10 space-y-0.5">
          <span className="text-[10px] text-white/50 block font-mono uppercase font-bold">Thermal Heat Risk</span>
          <div className="text-xl font-black text-amber-400 font-mono">
            {heatRiskLevel} RISK
          </div>
          <span className="text-[10px] text-amber-300/80 font-mono">Based on 5-factor AI index</span>
        </div>

        <div className="bg-black/40 p-3.5 rounded-2xl border border-white/10 space-y-0.5">
          <span className="text-[10px] text-white/50 block font-mono uppercase font-bold">Vegetation Canopy</span>
          <div className="text-xl font-black text-emerald-400 font-mono">
            {vegetationCanopyPct}%
          </div>
          <span className="text-[10px] text-rose-400 font-mono">Deficit: {Math.max(0, 35 - vegetationCanopyPct)}% needed</span>
        </div>

        <div className="bg-black/40 p-3.5 rounded-2xl border border-white/10 space-y-0.5">
          <span className="text-[10px] text-white/50 block font-mono uppercase font-bold">Asphalt & Impervious</span>
          <div className="text-xl font-black text-white font-mono">
            {Math.round(asphaltCoveragePct)}%
          </div>
          <span className="text-[10px] text-white/50 font-mono">High thermal retention mass</span>
        </div>
      </div>

      {/* AI URBAN HEAT ISLAND DIAGNOSTIC & RECOMMENDATION */}
      <div className="bg-gradient-to-r from-amber-950/40 via-[#111C2B] to-rose-950/40 border border-amber-500/40 p-4 sm:p-5 rounded-2xl space-y-3 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-rose-400" />
            <span className="font-extrabold text-white text-xs sm:text-sm uppercase tracking-wider">
              Microclimate Heat Assessment &bull; {activeZoneData.name}
            </span>
          </div>
          <span className="text-[10px] font-mono text-amber-300 font-bold">
            Heat Risk Index: {surfaceTempAnomaly > 3.5 ? "🔴 Critical (86/100)" : "🟡 Moderate (54/100)"}
          </span>
        </div>

        <p className="text-xs text-white/90 font-bold leading-relaxed">
          &ldquo;Due to high building canyon density ({buildingDensityPct}%) and low vegetation canopy ({vegetationCanopyPct}%), {activeZoneData.name} exhibits an active Urban Heat Island effect with localized surface temperatures reaching +{surfaceTempAnomaly}&deg;C above normal.&rdquo;
        </p>

        {/* 3 Actionable Cooling Directives */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          <div className="bg-[#0D1117] p-3 rounded-xl border border-white/5 space-y-1">
            <span className="text-[9px] font-mono text-amber-400 uppercase font-bold block">
              1. Shaded Corridor Network
            </span>
            <p className="text-white/80 text-[11px] leading-snug">
              Install lightweight tensile solar canopies along the 1.4 km primary pedestrian transit approach.
            </p>
          </div>

          <div className="bg-[#0D1117] p-3 rounded-xl border border-white/5 space-y-1">
            <span className="text-[9px] font-mono text-emerald-400 uppercase font-bold block">
              2. Afforestation & Pocket Parks
            </span>
            <p className="text-white/80 text-[11px] leading-snug">
              Plant 180 mature shade saplings (Neem & Rain Trees) to create a contiguous vegetative cooling buffer.
            </p>
          </div>

          <div className="bg-[#0D1117] p-3 rounded-xl border border-white/5 space-y-1">
            <span className="text-[9px] font-mono text-cyan-400 uppercase font-bold block">
              3. Cool Pavement & Misting
            </span>
            <p className="text-white/80 text-[11px] leading-snug">
              Apply high-albedo reflective coating on asphalt parking areas and activate automated bus stop misting.
            </p>
          </div>
        </div>
      </div>

      {/* FEATURE 8: "WHERE SHOULD THE CITY PLANT TREES?" TOP 10 RECOMMENDED LOCATIONS */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <TreePine className="w-4 h-4 text-emerald-400" />
              <h3 className="font-extrabold text-white text-xs sm:text-sm uppercase tracking-wider">
                Where Should The City Plant Trees? (AI Multi-Criteria Ranking)
              </h3>
            </div>
            <p className="text-xs text-white/50">
              Evaluates: Heat Anomaly + Low Canopy + Footfall Density + PM2.5 Pollution + Shade Deficit
            </p>
          </div>

          <span className="text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 px-2.5 py-1 rounded-xl border border-emerald-500/30">
            Top 10 High-ROI Urban Sites
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {top10TreeLocations.map((loc) => {
            const isPlanted = simulatedPlanted.includes(loc.id);

            return (
              <div
                key={loc.id}
                className={`p-4 rounded-2xl border transition-all space-y-3 ${
                  isPlanted
                    ? "bg-emerald-950/30 border-emerald-500/50 ring-1 ring-emerald-400/40"
                    : "bg-black/40 border-white/10 hover:border-emerald-500/30"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-black font-mono text-xs shrink-0 mt-0.5">
                      #{loc.rank}
                    </span>
                    <div>
                      <h4 className="font-extrabold text-white text-xs leading-snug">{loc.name}</h4>
                      <span className="text-teal-400 font-mono text-[10px] block">{loc.zoneName}</span>
                    </div>
                  </div>

                  <span className="text-rose-400 font-mono font-bold text-xs shrink-0">
                    +{loc.heatAnomalyC}&deg;C Heat
                  </span>
                </div>

                {/* 4 Key Evaluation Factors */}
                <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
                  <div className="bg-[#0D1117] p-2 rounded-xl border border-white/5">
                    <span className="text-white/40 uppercase block text-[8px]">Daily Footfall</span>
                    <span className="font-bold text-white">{loc.footfallPerDay.toLocaleString()}</span>
                  </div>
                  <div className="bg-[#0D1117] p-2 rounded-xl border border-white/5">
                    <span className="text-white/40 uppercase block text-[8px]">Shade Deficit</span>
                    <span className="font-bold text-amber-400">{loc.shadeDeficitPct}%</span>
                  </div>
                  <div className="bg-[#0D1117] p-2 rounded-xl border border-white/5">
                    <span className="text-white/40 uppercase block text-[8px]">Cooling Delta</span>
                    <span className="font-bold text-emerald-400">{loc.expectedCoolingDeltaC}&deg;C</span>
                  </div>
                </div>

                {/* Recommended Species & Tree Count */}
                <div className="bg-[#0D1117] p-2.5 rounded-xl border border-white/5 space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-white/50">Recommended Batch:</span>
                    <span className="font-bold text-white">
                      {loc.recommendedSaplingsCount} Saplings ({loc.costEstimate})
                    </span>
                  </div>
                  <div className="text-emerald-300 text-[10px] font-mono">
                    Species: {loc.recommendedSpecies.join(", ")}
                  </div>
                </div>

                {/* Action button */}
                <button
                  onClick={() => handlePlantTreesAction(loc.id)}
                  disabled={isPlanted || coolingSimActive}
                  className={`w-full py-2 rounded-xl font-extrabold text-xs transition-all uppercase tracking-wider flex items-center justify-center gap-1.5 ${
                    isPlanted
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                      : "bg-emerald-600 hover:bg-emerald-500 text-black shadow-lg shadow-emerald-600/20 font-black"
                  }`}
                >
                  {isPlanted ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Saplings Allocated &bull; -{Math.abs(loc.expectedCoolingDeltaC)}&deg;C Cooling Projected</span>
                    </>
                  ) : (
                    <>
                      <TreePine className="w-3.5 h-3.5" />
                      <span>Simulate Planting ({loc.recommendedSaplingsCount} Trees)</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
