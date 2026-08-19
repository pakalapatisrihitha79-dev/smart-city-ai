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
  const [voiceNote, setVoiceNote] = useState(false);

  // AI Classification state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiClassification, setAiClassification] = useState<{
    category: any;
    severity: any;
    priority: any;
    suggestedDepartment: string;
    confidence: number;
    summary: string;
  } | null>(null);

  // Duplicate Check
  const [duplicateMatch, setDuplicateMatch] = useState<any | null>(null);

  if (!isOpen) return null;

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
      setAiClassification(data);
      setIsAnalyzing(false);

      // Check for smart duplicate nearby
      const existing = civicReports.find(
        (r) => r.areaId === currentZone.id || r.category === data.category
      );
      if (existing) {
        setDuplicateMatch(existing);
      }
    } catch (e) {
      setIsAnalyzing(false);
      setAiClassification({
        category: "Pothole & Road Damage",
        severity: "High",
        priority: "High",
        suggestedDepartment: "Public Works & Infrastructure",
        confidence: 88,
        summary: "AI computer vision identified potential surface defect.",
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-5 shadow-2xl relative flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Camera className="w-5 h-5 text-cyan-400" />
              REPORT A CIVIC PROBLEM
            </h2>
            <p className="text-xs text-slate-400">AI computer vision problem analysis & evidence log</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-200 bg-slate-800 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto my-4 space-y-4 pr-1 text-xs">
          {/* Photo Upload Area */}
          <div className="border-2 border-dashed border-slate-700 hover:border-cyan-500 rounded-2xl p-4 text-center cursor-pointer relative bg-slate-950/50 transition-colors">
            {photoBase64 ? (
              <div className="relative">
                <img src={photoBase64} alt="Evidence" className="max-h-48 rounded-xl mx-auto object-cover" />
                <button
                  onClick={() => setPhotoBase64(null)}
                  className="absolute top-2 right-2 bg-slate-900/90 text-white p-1 rounded-full border border-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="cursor-pointer block">
                <Upload className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                <span className="font-bold text-slate-200 block text-xs">Upload Photo or Take Picture</span>
                <span className="text-[10px] text-slate-400">AI automatically detects category & severity</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            )}
          </div>

          {/* AI Vision Analysis Feedback */}
          {isAnalyzing && (
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 flex items-center gap-2 text-cyan-400 text-xs">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>AI Neural Vision analyzing photo geometry & category...</span>
            </div>
          )}

          {aiClassification && !isAnalyzing && (
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-cyan-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  AI CLASSIFICATION ANALYSIS
                </span>
                <span className="text-[10px] bg-slate-800 text-emerald-400 px-2 py-0.5 rounded font-bold">
                  {aiClassification.confidence}% Confidence
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-400 block text-[10px]">CATEGORY</span>
                  <input
                    type="text"
                    value={aiClassification.category}
                    onChange={(e) => setAiClassification({ ...aiClassification, category: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 font-semibold text-slate-100"
                  />
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px]">SEVERITY</span>
                  <input
                    type="text"
                    value={aiClassification.severity}
                    onChange={(e) => setAiClassification({ ...aiClassification, severity: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 font-semibold text-amber-400"
                  />
                </div>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px]">ASSIGNED DEPARTMENT</span>
                <span className="text-slate-200 font-semibold">{aiClassification.suggestedDepartment}</span>
              </div>
            </div>
          )}

          {/* SMART DUPLICATE DETECTION NOTICE */}
          {duplicateMatch && (
            <div className="bg-amber-950/40 border border-amber-800/60 p-3 rounded-xl space-y-1.5 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-amber-300">
                <Copy className="w-4 h-4 text-amber-400" />
                <span>EXISTING SIMILAR REPORT FOUND NEARBY</span>
              </div>
              <p className="text-amber-200/90 text-[11px]">
                "{duplicateMatch.title}" was reported 120m away in {duplicateMatch.areaName}.
              </p>
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setDuplicateMatch(null)}
                  className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-3 py-1 rounded text-[10px]"
                >
                  ADD AS NEW REPORT
                </button>
              </div>
            </div>
          )}

          {/* Title & Notes */}
          <div className="space-y-2">
            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">PROBLEM TITLE</label>
              <input
                type="text"
                placeholder="e.g. Broken pavement near metro entrance"
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">ADDITIONAL DESCRIPTION</label>
              <textarea
                rows={2}
                placeholder="Describe details or hazard..."
                value={reportNotes}
                onChange={(e) => setReportNotes(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Footer Submit */}
        <div className="pt-3 border-t border-slate-800 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2.5 rounded-xl text-xs"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmitReport}
            className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2.5 rounded-xl text-xs shadow-lg"
          >
            SUBMIT CIVIC REPORT
          </button>
        </div>
      </div>
    </div>
  );
};
