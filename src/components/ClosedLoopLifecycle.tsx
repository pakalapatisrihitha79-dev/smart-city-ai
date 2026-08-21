import React, { useState } from "react";
import { useCity } from "../context/CityContext";
import {
  RefreshCw,
  Radio,
  Brain,
  Sparkles,
  Zap,
  CheckCircle2,
  Send,
  Camera,
  History,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Sliders,
  Play,
  RotateCcw,
} from "lucide-react";

export const ClosedLoopLifecycle: React.FC = () => {
  const { currentZone } = useCity();

  const [activeStep, setActiveStep] = useState<number>(1);
  const [selectedLifecycleCase, setSelectedLifecycleCase] = useState<string>("pothole_case");

  const cases = [
    {
      id: "pothole_case",
      title: "Severe Pothole & Road Base Fracture",
      location: "Zone 1 Central Boulevard & 4th Cross",
      steps: [
        {
          step: 1,
          name: "1. Detect",
          tag: "SENSE",
          desc: "Citizen uploaded geocoded photo + IoT accelerometer sensor on Municipal Bus #14 registered a 3.8G road vibration spike at (17.412, 78.472).",
          evidence: "Photo verified: 45cm diameter crater, 12cm depth in active lane.",
          icon: Camera,
          status: "Complete",
        },
        {
          step: 2,
          name: "2. Analyze",
          tag: "UNDERSTAND",
          desc: "Computer Vision model classifies hazard as 'High Severity Road Base Failure' (99.1% confidence). Triangulates duplicate reports from 4 citizens into single master ticket.",
          evidence: "Risk Score: 88/100 (Immediate vehicle suspension damage hazard).",
          icon: Brain,
          status: "Complete",
        },
        {
          step: 3,
          name: "3. Predict",
          tag: "PREDICT",
          desc: "CityMind predicts that during evening peak rush (17:30 PM), this pothole will cause an 18-minute corridor transit delay and 28% increased collision risk.",
          evidence: "Impact Horizon: +4 hours before total gridlock cascade.",
          icon: Sparkles,
          status: "Complete",
        },
        {
          step: 4,
          name: "4. Recommend",
          tag: "RECOMMEND",
          desc: "AI synthesizes multi-agency work order: Dispatch Quick-Cure Infrared Hot-Mix Asphalt Unit #4 with a 45-minute rapid deployment window before 16:30 PM.",
          evidence: "Estimated Repair Time: 25 mins &bull; Cost: ₹14,500.",
          icon: Zap,
          status: "Complete",
        },
        {
          step: 5,
          name: "5. Act",
          tag: "DISPATCH",
          desc: "Automated work order routed to Municipal Pavement Crew #2. Dynamic detour signs updated on digital overhead VMS boards.",
          evidence: "Crew on-scene at 15:40 PM &bull; Cold-milling and hot-mix compaction completed.",
          icon: Send,
          status: "Complete",
        },
        {
          step: 6,
          name: "6. Verify",
          tag: "VERIFY",
          desc: "Post-repair photo analyzed by Computer Vision to confirm smooth grade compliance. Accelerometers on Bus #14 confirm vibration level returned to 0.4G (Nominal).",
          evidence: "Before & After AI image match score: 98.4% Quality Approved.",
          icon: CheckCircle2,
          status: "Complete",
        },
        {
          step: 7,
          name: "7. Learn",
          tag: "LEARN",
          desc: "Resolution time, asphalt mix durability, and traffic impact logged into the City Memory Engine to refine predictive maintenance intervals on Central Boulevard.",
          evidence: "City Memory model weights updated (+0.4% training precision).",
          icon: History,
          status: "Complete",
        },
      ],
    },
    {
      id: "drainage_case",
      title: "Stormwater Culvert Silt Inflow & Underpass Waterlogging",
      location: "Zone 4 Lowland Basin",
      steps: [
        {
          step: 1,
          name: "1. Detect",
          tag: "SENSE",
          desc: "Ultrasonic water level transducer in Lowland Sump registers water level rising at 4.2 cm/min during early drizzle.",
          evidence: "Telemetry: Sump Level at 76% (Normal < 40%).",
          icon: Radio,
          status: "Complete",
        },
        {
          step: 2,
          name: "2. Analyze",
          tag: "UNDERSTAND",
          desc: "Hydro-model correlates Doppler rain radar with drainage telemetry, identifying upstream grate silt blockage.",
          evidence: "Drainage throughput restricted by 64%.",
          icon: Brain,
          status: "Complete",
        },
        {
          step: 3,
          name: "3. Predict",
          tag: "PREDICT",
          desc: "Predicts underpass waterlogging exceeding 30cm within 45 minutes, stranding 400+ vehicles.",
          evidence: "Underpass flood probability: 94%.",
          icon: Sparkles,
          status: "Complete",
        },
        {
          step: 4,
          name: "4. Recommend",
          tag: "RECOMMEND",
          desc: "Pre-emptively trigger Submersible Pump Station #4 and dispatch Hydro-Jetting Desilt Truck #3.",
          evidence: "Recommended execution lead time: 15 mins.",
          icon: Zap,
          status: "Complete",
        },
        {
          step: 5,
          name: "5. Act",
          tag: "DISPATCH",
          desc: "Automated pump start signal transmitted; road barrier raised to divert heavy vehicles to Ridge Road.",
          evidence: "Pumps active at 850 L/s drawdown rate.",
          icon: Send,
          status: "Complete",
        },
        {
          step: 6,
          name: "6. Verify",
          tag: "VERIFY",
          desc: "IoT water level sensor confirms sump level stabilized at 34%. CCTV visual feed verifies underpass dry.",
          evidence: "Zero commuter vehicles stranded.",
          icon: CheckCircle2,
          status: "Complete",
        },
        {
          step: 7,
          name: "7. Learn",
          tag: "LEARN",
          desc: "Precipitation-to-runoff coefficient calibrated in City Memory Engine for future monsoon cloudbursts.",
          evidence: "City Memory flood prediction accuracy improved to 96.8%.",
          icon: History,
          status: "Complete",
        },
      ],
    },
  ];

  const currentCase = cases.find((c) => c.id === selectedLifecycleCase) || cases[0];
  const currentStepData = currentCase.steps.find((s) => s.step === activeStep) || currentCase.steps[0];

  const handleNextStep = () => {
    setActiveStep((prev) => (prev < 7 ? prev + 1 : 1));
  };

  return (
    <div className="bg-[#0D1117]/95 border border-cyan-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5 text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black text-white uppercase tracking-wider font-display">
                Closed-Loop City Resolution Engine
              </h2>
              <span className="text-[9px] font-mono font-bold bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/40">
                7-STAGE DIGITAL FEEDBACK LOOP
              </span>
            </div>
            <p className="text-xs text-white/50">
              Sense &rarr; Understand &rarr; Predict &rarr; Recommend &rarr; Act &rarr; Verify &rarr; Learn
            </p>
          </div>
        </div>

        {/* Case Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-white/50 uppercase font-bold">Case Study:</span>
          <select
            value={selectedLifecycleCase}
            onChange={(e) => {
              setSelectedLifecycleCase(e.target.value);
              setActiveStep(1);
            }}
            className="bg-[#0D1117] border border-white/20 rounded-xl px-3 py-1.5 text-xs font-bold text-white outline-none focus:border-cyan-400"
          >
            {cases.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 7-STAGE INTERACTIVE PROGRESS BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5 font-mono text-[10px]">
        {currentCase.steps.map((st) => {
          const isSelected = activeStep === st.step;
          const isPast = activeStep > st.step;
          const IconComp = st.icon;

          return (
            <button
              key={st.step}
              onClick={() => setActiveStep(st.step)}
              className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                isSelected
                  ? "bg-cyan-500 text-black border-cyan-400 font-black shadow-lg shadow-cyan-500/30 scale-[1.02]"
                  : isPast
                  ? "bg-teal-950/40 text-teal-300 border-teal-500/40"
                  : "bg-black/40 text-white/50 border-white/10 hover:text-white"
              }`}
            >
              <IconComp className="w-4 h-4" />
              <span className="font-extrabold uppercase text-[9px] truncate w-full text-center">
                {st.name.split(". ")[1]}
              </span>
            </button>
          );
        })}
      </div>

      {/* ACTIVE STAGE DEEP-DIVE SPOTLIGHT */}
      <div className="bg-gradient-to-r from-cyan-950/40 via-[#111C2B] to-teal-950/40 border border-cyan-500/40 p-4 sm:p-6 rounded-2xl space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-mono font-black text-[10px] uppercase">
              STAGE {currentStepData.step} OF 7 &bull; {currentStepData.tag}
            </span>
            <h3 className="font-extrabold text-white text-sm sm:text-base">{currentStepData.name}</h3>
          </div>

          <span className="text-[11px] font-mono text-teal-300 font-bold">
            Case: {currentCase.location}
          </span>
        </div>

        <p className="text-white/90 text-xs sm:text-sm font-medium leading-relaxed">
          {currentStepData.desc}
        </p>

        {/* Evidence & Verification Box */}
        <div className="bg-black/60 p-3.5 rounded-xl border border-white/10 space-y-1">
          <span className="text-[9px] font-mono text-cyan-400 uppercase font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            AI Autonomous Evidence & Telemetry Signature
          </span>
          <p className="text-white/80 font-mono text-[11px] leading-snug">
            {currentStepData.evidence}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => setActiveStep((prev) => Math.max(1, prev - 1))}
            disabled={activeStep === 1}
            className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl text-xs uppercase disabled:opacity-30 transition-all border border-white/10"
          >
            Previous Stage
          </button>

          <button
            onClick={handleNextStep}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-cyan-600/20 transition-all"
          >
            <span>{activeStep === 7 ? "Restart Feedback Cycle" : "Advance to Next Stage"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
