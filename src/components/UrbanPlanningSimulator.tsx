import React, { useState } from "react";
import { useCity } from "../context/CityContext";
import { UrbanPlanProposal } from "../types";
import {
  Building,
  GraduationCap,
  Hospital,
  Train,
  Waves,
  Sun,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  MapPin,
  ShieldCheck,
  Zap,
  Sliders,
  DollarSign,
} from "lucide-react";

export const UrbanPlanningSimulator: React.FC = () => {
  const { allZones, currentZone } = useCity();

  const [facilityType, setFacilityType] = useState<UrbanPlanProposal["facilityType"]>("Hospital");
  const [targetZoneId, setTargetZoneId] = useState<string>("zone-4");
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

  const [savedProposals, setSavedProposals] = useState<UrbanPlanProposal[]>([
    {
      id: "prop-1",
      facilityType: "Hospital",
      title: "NovaCity South Trauma & Maternity Specialty Hospital",
      targetZoneId: "zone-4",
      targetZoneName: "Zone 4 (Lowland District)",
      populationServed: 54000,
      trafficImpactPct: +7.2,
      environmentalScore: 84,
      emergencyAccessibilityDeltaMins: -4.2,
      nearestSimilarDistanceKm: 6.4,
      aiFeasibilityScore: 91,
      verdict: "Strongly Recommended",
      keyBenefits: [
        "Eliminates 6.4 km critical emergency trauma transit deficit for 54,000 residents.",
        "Reduces average ambulance response time from 14 mins to 5.2 mins.",
        "Includes LEED-Platinum rooftop solar microgrid & rainwater harvesting basement.",
      ],
      mitigationsRequired: [
        "Widen South Approach Road by 1 lane to absorb +7.2% peak vehicle ingress.",
        "Install automated signal preemption at 4th Avenue junction.",
      ],
    },
    {
      id: "prop-2",
      facilityType: "StormwaterPark",
      title: "Lowland Bio-Retention Wetland & Ecological Sponge Basin",
      targetZoneId: "zone-4",
      targetZoneName: "Zone 4 (Lowland Basin)",
      populationServed: 38000,
      trafficImpactPct: 0.0,
      environmentalScore: 96,
      emergencyAccessibilityDeltaMins: 0.0,
      nearestSimilarDistanceKm: 8.1,
      aiFeasibilityScore: 95,
      verdict: "Strongly Recommended",
      keyBenefits: [
        "Captures 12M Liters of stormwater runoff during peak monsoon deluges.",
        "Prevents flooding across 3 major road underpasses and saves ₹4.2 Cr in flood damages.",
        "Adds 18 acres of public green canopy with native biodiversity.",
      ],
      mitigationsRequired: [
        "Construct subsurface silt filtration traps before water enters natural wetland.",
      ],
    },
  ]);

  const targetZoneObj = allZones.find((z) => z.id === targetZoneId) || currentZone;

  // Generate dynamic AI assessment based on selected facility and zone
  const computeProposal = (): UrbanPlanProposal => {
    let popServed = 42000;
    let traffic = +5.0;
    let envScore = 80;
    let emergencyDelta = -2.0;
    let distKm = 4.5;
    let score = 88;
    let verdict: UrbanPlanProposal["verdict"] = "Strongly Recommended";
    let title = `New ${facilityType} Facility in ${targetZoneObj.name}`;
    let benefits = [
      `Expands civic infrastructure coverage to over ${popServed.toLocaleString()} citizens.`,
      `Addresses current spatial accessibility deficit in ${targetZoneObj.name}.`,
    ];
    let mitigations = [
      "Coordinate traffic signal timing with CityMind Adaptive Signal Grid.",
    ];

    if (facilityType === "Hospital") {
      popServed = 58000;
      traffic = +7.5;
      distKm = targetZoneId === "zone-4" ? 6.2 : 3.8;
      emergencyDelta = -4.5;
      score = 92;
      verdict = "Strongly Recommended";
      title = `NovaCity Tertiary Healthcare & Emergency Trauma Center`;
      benefits = [
        `Directly serves ${popServed.toLocaleString()} residents currently residing >${distKm}km from emergency care.`,
        `Cuts average emergency ambulance response time by ${Math.abs(emergencyDelta)} minutes.`,
        `Creates 450 skilled healthcare & municipal service jobs.`,
      ];
      mitigations = [
        "Dedicated ambulance access corridor from North Radial Bypass.",
        "Acoustic noise buffers for adjacent residential blocks.",
      ];
    } else if (facilityType === "TransitHub") {
      popServed = 72000;
      traffic = -14.2; // Removes cars!
      distKm = 5.1;
      envScore = 94;
      emergencyDelta = -1.2;
      score = 96;
      verdict = "Strongly Recommended";
      title = `Multi-Modal Rapid Metro & Electric Bus Interchange`;
      benefits = [
        `Connects ${popServed.toLocaleString()} daily commuters, reducing car usage by 14.2%.`,
        `Lowers citywide carbon emissions by ~3,400 tons CO2 annually.`,
        `Integrates bike-share bays and micro-mobility charging lockers.`,
      ];
      mitigations = [
        "Multi-tier pedestrian skywalk to avoid surface street crossing conflicts.",
      ];
    } else if (facilityType === "School") {
      popServed = 24000;
      traffic = +6.0;
      distKm = 2.8;
      score = 86;
      verdict = "Recommended with Mitigation";
      title = `NovaCity STEM & Environmental Public Academy`;
      benefits = [
        `Serves 2,400 students within safe 15-minute walking/cycling distance.`,
        `Equipped with rooftop solar array and community indoor sports hall.`,
      ];
      mitigations = [
        "Designate off-street school bus turnaround loop to prevent morning street blockage.",
        "Implement 30 km/h automated School Zone speed calming.",
      ];
    } else if (facilityType === "StormwaterPark") {
      popServed = 36000;
      traffic = 0;
      envScore = 98;
      distKm = 7.0;
      score = 94;
      verdict = "Strongly Recommended";
      title = `Urban Bio-Retention Wetland & Sponge Park`;
      benefits = [
        `Absorbs 8.5M Liters of storm surge, virtually eliminating underpass waterlogging.`,
        `Lowers localized surface temperature by -2.4°C via evaporative cooling.`,
      ];
      mitigations = ["Seasonal mosquito biological control and silt dredging plan."];
    } else if (facilityType === "SolarMicrogrid") {
      popServed = 18000;
      traffic = 0;
      envScore = 99;
      distKm = 9.0;
      score = 93;
      verdict = "Strongly Recommended";
      title = `Distributed Community Solar & Battery Storage Microgrid`;
      benefits = [
        `Generates 4.2 MW clean energy, powering 100% of municipal streetlights & water pumps.`,
        `Provides 6 hours of autonomous battery resilience during grid brownouts.`,
      ];
      mitigations = ["Annual PV panel automated dry-cleaning brush maintenance."];
    }

    return {
      id: `prop-${Date.now()}`,
      facilityType,
      title,
      targetZoneId: targetZoneObj.id,
      targetZoneName: targetZoneObj.name,
      populationServed: popServed,
      trafficImpactPct: traffic,
      environmentalScore: envScore,
      emergencyAccessibilityDeltaMins: emergencyDelta,
      nearestSimilarDistanceKm: distKm,
      aiFeasibilityScore: score,
      verdict,
      keyBenefits: benefits,
      mitigationsRequired: mitigations,
    };
  };

  const currentEvaluation = computeProposal();

  const handleSaveProposal = () => {
    setIsEvaluating(true);
    setTimeout(() => {
      setSavedProposals([currentEvaluation, ...savedProposals]);
      setIsEvaluating(false);
    }, 400);
  };

  return (
    <div className="bg-[#0D1117]/95 border border-indigo-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5 text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black text-white uppercase tracking-wider font-display">
                AI Urban Planning Simulator <span className="text-indigo-400">&bull; Facility Impact Analysis</span>
              </h2>
              <span className="text-[9px] font-mono font-bold bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/40">
                MULTI-CRITERIA DECISION MATRIX
              </span>
            </div>
            <p className="text-xs text-white/50">
              Simulate proposing new hospitals, transit hubs, schools & sponge parks with AI feasibility scoring
            </p>
          </div>
        </div>

        <button
          onClick={handleSaveProposal}
          disabled={isEvaluating}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-xl text-xs flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20 uppercase tracking-wider self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isEvaluating ? "Evaluating..." : "Adopt Proposal & Save to Plan"}</span>
        </button>
      </div>

      {/* PROPOSAL BUILDER CONTROLS */}
      <div className="bg-black/40 border border-white/10 p-4 rounded-2xl space-y-3">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-400 block">
          Configure Proposed Civic Facility & Location
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-mono font-bold uppercase text-white/50 block mb-1">
              Select Proposed Facility Type
            </label>
            <div className="grid grid-cols-3 gap-1.5 font-bold">
              {[
                { type: "Hospital", label: "Hospital", icon: Hospital },
                { type: "TransitHub", label: "Transit Hub", icon: Train },
                { type: "School", label: "School", icon: GraduationCap },
                { type: "StormwaterPark", label: "Sponge Park", icon: Waves },
                { type: "SolarMicrogrid", label: "Solar Microgrid", icon: Sun },
                { type: "Clinic", label: "Health Clinic", icon: Building },
              ].map((item) => {
                const IconComp = item.icon;
                const isSelected = facilityType === item.type;

                return (
                  <button
                    key={item.type}
                    onClick={() => setFacilityType(item.type as any)}
                    className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                      isSelected
                        ? "bg-indigo-600 text-white border-indigo-400 font-black shadow-md shadow-indigo-600/30"
                        : "bg-[#0D1117] text-white/70 border-white/10 hover:text-white"
                    }`}
                  >
                    <IconComp className="w-4 h-4" />
                    <span className="text-[10px]">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-mono font-bold uppercase text-white/50 block mb-1">
              Select Target Proposed Zone / Ward
            </label>
            <select
              value={targetZoneId}
              onChange={(e) => setTargetZoneId(e.target.value)}
              className="w-full bg-[#0D1117] border border-white/20 rounded-xl px-3 py-2.5 text-xs font-bold text-white outline-none focus:border-indigo-400"
            >
              {allZones.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.name} &bull; {z.type}
                </option>
              ))}
            </select>
            <span className="text-[10px] text-white/40 font-mono block mt-1.5">
              Current Zone Deficit: 6.2 km to nearest tertiary emergency facility
            </span>
          </div>
        </div>
      </div>

      {/* LIVE AI FEASIBILITY & IMPACT EVALUATION CARD */}
      <div className="bg-gradient-to-r from-indigo-950/50 via-[#111C2B] to-teal-950/50 border border-indigo-500/40 p-4 sm:p-5 rounded-2xl space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-mono font-black text-[10px] uppercase">
                {currentEvaluation.verdict}
              </span>
              <h3 className="font-extrabold text-white text-sm sm:text-base">{currentEvaluation.title}</h3>
            </div>
            <span className="text-white/50 text-[11px] block mt-0.5">{currentEvaluation.targetZoneName}</span>
          </div>

          <div className="text-right shrink-0">
            <div className="text-2xl font-black font-mono text-emerald-400">
              {currentEvaluation.aiFeasibilityScore} / 100
            </div>
            <span className="text-[9px] font-mono text-white/40 uppercase">AI Feasibility Score</span>
          </div>
        </div>

        {/* 4 Vector Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-[#0D1117] p-3 rounded-xl border border-white/5">
            <span className="text-[9px] font-mono text-white/40 uppercase block">Population Served</span>
            <span className="text-base font-black text-white font-mono">
              +{currentEvaluation.populationServed.toLocaleString()}
            </span>
          </div>

          <div className="bg-[#0D1117] p-3 rounded-xl border border-white/5">
            <span className="text-[9px] font-mono text-white/40 uppercase block">Traffic Net Impact</span>
            <span
              className={`text-base font-black font-mono ${
                currentEvaluation.trafficImpactPct < 0 ? "text-emerald-400" : "text-amber-400"
              }`}
            >
              {currentEvaluation.trafficImpactPct > 0 ? `+${currentEvaluation.trafficImpactPct}%` : `${currentEvaluation.trafficImpactPct}%`}
            </span>
          </div>

          <div className="bg-[#0D1117] p-3 rounded-xl border border-white/5">
            <span className="text-[9px] font-mono text-white/40 uppercase block">Emergency Access</span>
            <span className="text-base font-black text-emerald-400 font-mono">
              {currentEvaluation.emergencyAccessibilityDeltaMins} mins
            </span>
          </div>

          <div className="bg-[#0D1117] p-3 rounded-xl border border-white/5">
            <span className="text-[9px] font-mono text-white/40 uppercase block">Current Facility Distance</span>
            <span className="text-base font-black text-rose-400 font-mono">
              {currentEvaluation.nearestSimilarDistanceKm} km
            </span>
          </div>
        </div>

        {/* Key Benefits vs Mitigations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs">
          <div className="bg-emerald-950/30 p-3 rounded-xl border border-emerald-500/30 space-y-1">
            <span className="text-[9px] font-mono text-emerald-300 uppercase font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Primary AI Justification & Benefits
            </span>
            <ul className="space-y-1 text-emerald-100 text-[11px] list-disc list-inside">
              {currentEvaluation.keyBenefits.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>

          <div className="bg-amber-950/30 p-3 rounded-xl border border-amber-500/30 space-y-1">
            <span className="text-[9px] font-mono text-amber-300 uppercase font-bold flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              Mandatory Mitigation Directives
            </span>
            <ul className="space-y-1 text-amber-100 text-[11px] list-disc list-inside">
              {currentEvaluation.mitigationsRequired.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* SAVED URBAN MASTERPLAN PROPOSALS */}
      <div className="space-y-3 pt-2">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-white/50 block">
          Adopted Urban Planning Pipeline ({savedProposals.length} Proposals Active)
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {savedProposals.map((prop) => (
            <div
              key={prop.id}
              className="bg-black/40 border border-white/10 hover:border-indigo-500/40 p-4 rounded-2xl space-y-2.5 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/40">
                    {prop.facilityType}
                  </span>
                  <h4 className="font-extrabold text-white text-xs sm:text-sm mt-1">{prop.title}</h4>
                  <span className="text-teal-400 font-mono text-[10px] block">{prop.targetZoneName}</span>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-black font-mono text-emerald-400">{prop.aiFeasibilityScore}/100</span>
                  <span className="text-[8px] font-mono text-white/40 block uppercase">Feasibility</span>
                </div>
              </div>

              <div className="bg-[#0D1117] p-2.5 rounded-xl border border-white/5 text-[11px] text-white/80 space-y-1">
                <div className="text-white/60">
                  <strong className="text-white">Pop Served:</strong> {prop.populationServed.toLocaleString()} residents
                </div>
                <div className="text-emerald-300 text-[10px]">
                  &bull; {prop.keyBenefits[0]}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
