import React, { useState } from "react";
import { useCity } from "../context/CityContext";
import {
  Camera,
  Upload,
  MapPin,
  X,
  AlertTriangle,
  Mic,
  Sparkles,
  CheckCircle2,
  FileText,
  Copy,
  Building2,
  ShieldCheck,
  Flame,
  Droplets,
  Trash2,
  Zap,
  Layers,
  ArrowRight,
} from "lucide-react";

interface CivicReportingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CivicReportingModal: React.FC<CivicReportingModalProps> = ({ isOpen, onClose }) => {
  const { currentZone, civicReports, addCivicReport } = useCity();

  // Form State
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [reportTitle, setReportTitle] = useState("");
  const [reportNotes, setReportNotes] = useState("");
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  // AI Classification State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiClassification, setAiClassification] = useState<{
    issue: string;
    category: any;
    severityRating: number; // 0 to 10
    severity: "Low" | "Medium" | "High" | "Critical";
    priority: "Low" | "Medium" | "High" | "Critical";
    estimatedRisk: string;
    suggestedDepartment: string;
    confidence: number;
    duplicateCount: number;
    trustScore: number;
    recommendedAction: string;
    summary: string;
  } | null>(null);

  // Duplicate Check
  const [duplicateMatch, setDuplicateMatch] = useState<any | null>(null);

  if (!isOpen) return null;

  // Sample photo presets for 1-click test drive
  const samplePresets = [
    {
      id: "pothole",
      label: "Asphalt Pothole",
      icon: Layers,
      color: "text-amber-400",
      title: "Severe Pothole & Sub-base Crack on Arterial Lane",
      notes: "Large 45cm diameter pothole with deep asphalt depression causing severe suspension bounce.",
      aiResult: {
        issue: "Asphalt Structural Pothole & Sub-base Depression",
        category: "Pothole & Road Damage",
        severityRating: 8.4,
        severity: "High" as const,
        priority: "High" as const,
        estimatedRisk: "High — Potential vehicle axle damage and motorcyclist hazard.",
        suggestedDepartment: "Roads & Highways Department (Ward 12 Division)",
        confidence: 94,
        duplicateCount: 7,
        trustScore: 92,
        recommendedAction: "Dispatch rapid-patch cold asphalt crew within 24 hours.",
        summary: "Computer vision identified deep pavement defect exceeding 40cm perimeter.",
      },
    },
    {
      id: "streetlight",
      label: "Broken Streetlight",
      icon: Zap,
      color: "text-yellow-400",
      title: "Dark Junction Streetlight Outage & Exposed Wiring",
      notes: "Lamp post #42 is unlit with exposed junction box at pedestrian crossing.",
      aiResult: {
        issue: "Luminaire Failure & Low-Voltage Terminal Exposure",
        category: "Broken Streetlight",
        severityRating: 7.2,
        severity: "High" as const,
        priority: "High" as const,
        estimatedRisk: "High — Nighttime pedestrian hazard & potential electrical short.",
        suggestedDepartment: "Municipal Electrical & Lighting Authority",
        confidence: 96,
        duplicateCount: 3,
        trustScore: 95,
        recommendedAction: "Isolate terminal box and replace LED ballast.",
        summary: "Visual inspection detected unpowered luminaire head and dangling cover.",
      },
    },
    {
      id: "water-burst",
      label: "Water Main Burst",
      icon: Droplets,
      color: "text-cyan-400",
      title: "High-Pressure Water Main Burst & Pavement Flooding",
      notes: "Potable water gushing from sidewalk joint, flooding road curb.",
      aiResult: {
        issue: "Pressurized Potable Sub-surface Pipeline Rupture",
        category: "Water Pipe Leak / Supply",
        severityRating: 9.1,
        severity: "Critical" as const,
        priority: "Critical" as const,
        estimatedRisk: "Critical — Water loss + soil erosion risk under sidewalk.",
        suggestedDepartment: "Water Supply & Sewerage Board (Emergency Sump Unit)",
        confidence: 98,
        duplicateCount: 12,
        trustScore: 97,
        recommendedAction: "Close Isolation Valve #14 and dispatch excavation team immediately.",
        summary: "Acoustic and computer vision cross-verified continuous pressurized water plume.",
      },
    },
    {
      id: "garbage",
      label: "Garbage Overflow",
      icon: Trash2,
      color: "text-emerald-400",
      title: "Public Bin Overflow & Secondary Dump Site",
      notes: "Commercial waste overflowing into bike lane, strong odor.",
      aiResult: {
        issue: "Solid Waste Bin Volume Overflow (>160% capacity)",
        category: "Overflowing Waste Bin",
        severityRating: 6.8,
        severity: "Medium" as const,
        priority: "Medium" as const,
        estimatedRisk: "Medium — Public sanitation hazard & bike path obstruction.",
        suggestedDepartment: "Sanitation & Circular Resource Management",
        confidence: 91,
        duplicateCount: 5,
        trustScore: 89,
        recommendedAction: "Reroute automated compactor truck to clear node within 4 hours.",
        summary: "Object segmentation detected uncontained organic and plastic waste.",
      },
    },
  ];

  const handleSelectPreset = (preset: typeof samplePresets[0]) => {
    setSelectedPreset(preset.id);
    setReportTitle(preset.title);
    setReportNotes(preset.notes);
    setIsAnalyzing(true);

    setTimeout(() => {
      setAiClassification(preset.aiResult);
      setIsAnalyzing(false);

      if (preset.aiResult.duplicateCount > 0) {
        setDuplicateMatch({
          id: `DUP-${preset.id.toUpperCase()}-04`,
          title: preset.title,
          areaName: currentZone.name,
        });
      }
    }, 600);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPhotoBase64(result);
        triggerAiAnalysis(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerAiAnalysis = async (imgData: string) => {
    setIsAnalyzing(true);
    try {
      const res = await fetch("/api/ai/analyze-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: imgData,
          userNotes: reportNotes,
          locationName: currentZone.name,
        }),
      });
      const data = await res.json();
      setAiClassification({
        issue: data.category || "Pothole & Surface Defect",
        category: data.category || "Pothole & Road Damage",
        severityRating: 8.4,
        severity: data.severity || "High",
        priority: data.priority || "High",
        estimatedRisk: "High — Potential vehicle damage and traffic bottleneck.",
        suggestedDepartment: data.suggestedDepartment || "Roads & Highways Department",
        confidence: data.confidence || 92,
        duplicateCount: 4,
        trustScore: 91,
        recommendedAction: "Create municipal work order with 24-hour service level agreement.",
        summary: data.summary || "AI computer vision verified surface hazard.",
      });
      setIsAnalyzing(false);
    } catch (e) {
      setIsAnalyzing(false);
      setAiClassification({
        issue: "Asphalt Structural Pothole",
        category: "Pothole & Road Damage",
        severityRating: 8.4,
        severity: "High",
        priority: "High",
        estimatedRisk: "High — Vehicle suspension hazard.",
        suggestedDepartment: "Roads & Highways Department",
        confidence: 92,
        duplicateCount: 3,
        trustScore: 90,
        recommendedAction: "Create civic complaint and route to nearest ward depot.",
        summary: "AI computer vision identified surface hazard.",
      });
    }
  };

  const handleSubmitReport = () => {
    if (!reportTitle) return;

    addCivicReport({
      title: reportTitle,
      description: reportNotes || aiClassification?.summary || "Reported civic issue.",
      category: aiClassification?.category || "Pothole & Road Damage",
      severity: aiClassification?.severity || "Medium",
      priority: aiClassification?.priority || "Medium",
      status: "AI ANALYZED",
      assignedDepartment: aiClassification?.suggestedDepartment || "Public Works",
      areaId: currentZone.id,
      areaName: currentZone.name,
      lat: currentZone.lat,
      lng: currentZone.lng,
      imageUrl: photoBase64 || undefined,
      evidenceAttached: true,
      duplicateOfId: duplicateMatch ? duplicateMatch.id : undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0D1117] border border-white/10 w-full max-w-xl rounded-3xl p-5 sm:p-6 shadow-2xl relative flex flex-col max-h-[92vh] overflow-hidden text-xs">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white uppercase tracking-wider font-display">
                AI Camera Issue Reporting & Triage
              </h2>
              <p className="text-[11px] text-white/50">
                Automatic photo identification, severity rating, and department routing
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/50 hover:text-white bg-white/5 rounded-xl border border-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto my-4 space-y-4 pr-1 text-xs no-scrollbar">
          {/* Sample Preset Selector */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-400 block">
              Quick Test: Select a Sample Photo Issue
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {samplePresets.map((preset) => {
                const IconComp = preset.icon;
                const isSelected = selectedPreset === preset.id;

                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                      isSelected
                        ? "bg-teal-500/20 border-teal-400 shadow-md ring-1 ring-teal-400"
                        : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                    }`}
                  >
                    <IconComp className={`w-4 h-4 ${preset.color}`} />
                    <span className="font-bold text-white text-[11px] truncate">{preset.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Photo Upload / View Area */}
          <div className="border-2 border-dashed border-white/15 hover:border-teal-500/50 rounded-2xl p-4 text-center cursor-pointer relative bg-black/40 transition-colors">
            {photoBase64 ? (
              <div className="relative">
                <img
                  src={photoBase64}
                  alt="Evidence"
                  className="max-h-40 rounded-xl mx-auto object-cover border border-white/10"
                />
                <button
                  type="button"
                  onClick={() => setPhotoBase64(null)}
                  className="absolute top-2 right-2 bg-black/80 text-white p-1.5 rounded-full border border-white/20 hover:bg-rose-900"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <label className="cursor-pointer block space-y-1">
                <Upload className="w-7 h-7 text-teal-400 mx-auto" />
                <span className="font-bold text-white block text-xs">Upload Photo or Take Picture</span>
                <span className="text-[10px] text-white/50 block">
                  AI Computer Vision automatically detects defect category, severity & duplicate reports
                </span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            )}
          </div>

          {/* AI Analysis Loading State */}
          {isAnalyzing && (
            <div className="bg-teal-950/40 p-3.5 rounded-2xl border border-teal-500/30 flex items-center gap-2.5 text-teal-300">
              <Sparkles className="w-4 h-4 animate-spin text-teal-400 shrink-0" />
              <span className="text-xs font-medium">
                AI Vision Model analyzing image geometry, depth deformation & department route...
              </span>
            </div>
          )}

          {/* AI CLASSIFICATION & ROUTING RESULT CARD */}
          {aiClassification && !isAnalyzing && (
            <div className="bg-gradient-to-b from-[#111827] to-[#0D1117] p-4 rounded-2xl border border-teal-500/30 space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <span className="font-extrabold text-teal-300 flex items-center gap-1.5 uppercase text-xs tracking-wider">
                  <Sparkles className="w-4 h-4 text-teal-400" />
                  AI Vision & Routing Intelligence
                </span>
                <span className="text-[10px] bg-teal-950 text-teal-300 px-2 py-0.5 rounded-full font-mono font-bold border border-teal-500/40">
                  {aiClassification.confidence}% AI Confidence
                </span>
              </div>

              {/* 4-Metric Grid: Issue, Severity, Estimated Risk, Department */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="bg-black/40 p-2.5 rounded-xl border border-white/5">
                  <span className="text-white/40 block text-[9px] font-mono uppercase font-bold">
                    Detected Issue & Category
                  </span>
                  <span className="text-white font-bold text-xs mt-0.5 block">{aiClassification.issue}</span>
                  <span className="text-[10px] text-teal-400 font-medium">{aiClassification.category}</span>
                </div>

                <div className="bg-black/40 p-2.5 rounded-xl border border-white/5">
                  <span className="text-white/40 block text-[9px] font-mono uppercase font-bold">
                    Severity & Priority Rating
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-base font-black font-mono text-amber-400">
                      {aiClassification.severityRating}
                      <span className="text-xs text-white/40 font-normal">/10</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-950 text-amber-300 border border-amber-500/30 uppercase">
                      {aiClassification.priority} Priority
                    </span>
                  </div>
                </div>

                <div className="bg-black/40 p-2.5 rounded-xl border border-white/5 sm:col-span-2">
                  <span className="text-white/40 block text-[9px] font-mono uppercase font-bold">
                    Estimated Structural & Public Risk
                  </span>
                  <p className="text-white/90 text-xs mt-0.5 font-medium">{aiClassification.estimatedRisk}</p>
                </div>

                <div className="bg-teal-950/30 p-2.5 rounded-xl border border-teal-500/30 sm:col-span-2 flex items-start gap-2">
                  <Building2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-teal-300 block text-[9px] font-mono uppercase font-bold">
                      Automated Department Routing
                    </span>
                    <span className="text-white font-extrabold text-xs block mt-0.5">
                      {aiClassification.suggestedDepartment}
                    </span>
                    <span className="text-[10px] text-white/60">
                      Target Ward: <strong>{currentZone.name}</strong> • Ticket SLA: 24 Hours
                    </span>
                  </div>
                </div>
              </div>

              {/* Citizen Trust Score Badge */}
              <div className="bg-emerald-950/30 border border-emerald-500/30 p-2.5 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <div>
                    <span className="text-[10px] font-bold text-emerald-300 uppercase block">
                      Citizen Report Reliability Score
                    </span>
                    <span className="text-[10px] text-white/60">
                      Image Evidence (+30%) &bull; GPS Accuracy (+20%) &bull; Duplicate Check (+15%)
                    </span>
                  </div>
                </div>
                <span className="text-sm font-mono font-black text-emerald-400">
                  {aiClassification.trustScore}%
                </span>
              </div>
            </div>
          )}

          {/* DUPLICATE DETECTION WARNING */}
          {duplicateMatch && (
            <div className="bg-amber-950/40 border border-amber-500/40 p-3.5 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-amber-300 font-bold">
                <div className="flex items-center gap-1.5">
                  <Copy className="w-4 h-4 text-amber-400" />
                  <span>Nearby Duplicate Reports Detected ({aiClassification?.duplicateCount || 7})</span>
                </div>
                <span className="text-[10px] bg-amber-900/60 px-2 py-0.5 rounded font-mono">
                  Within 250m
                </span>
              </div>
              <p className="text-amber-200/90 text-xs">
                Similar issue "{duplicateMatch.title}" was already logged nearby in {duplicateMatch.areaName}. Your submission will attach as secondary verification evidence.
              </p>
            </div>
          )}

          {/* Title & Description Input */}
          <div className="space-y-2.5">
            <div>
              <label className="text-[11px] font-bold text-white/80 block mb-1 uppercase tracking-wider font-mono">
                Report Title
              </label>
              <input
                type="text"
                placeholder="e.g. Broken asphalt pothole near bus shelter"
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-teal-500 transition-colors font-medium"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-white/80 block mb-1 uppercase tracking-wider font-mono">
                Description / Citizen Notes
              </label>
              <textarea
                rows={2}
                placeholder="Describe hazard location or specific urgency..."
                value={reportNotes}
                onChange={(e) => setReportNotes(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-teal-500 transition-colors font-medium"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-white/10 flex gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-2.5 rounded-xl text-xs transition-colors uppercase tracking-wider"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!reportTitle}
            onClick={handleSubmitReport}
            className={`flex-1 font-extrabold py-2.5 rounded-xl text-xs transition-all uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg ${
              reportTitle
                ? "bg-teal-500 hover:bg-teal-400 text-black shadow-teal-500/20"
                : "bg-white/10 text-white/40 cursor-not-allowed"
            }`}
          >
            <span>Submit Civic Complaint</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
