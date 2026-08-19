import React, { useState, useEffect } from "react";
import { useCity } from "../context/CityContext";
import {
  Bot,
  Mic,
  MicOff,
  Send,
  Volume2,
  Sparkles,
  ShieldAlert,
  Database,
  HelpCircle,
  Lightbulb,
} from "lucide-react";

interface CopilotMessage {
  id: string;
  sender: "user" | "copilot";
  text?: string;
  structuredResponse?: {
    answer: string;
    dataUsed: string[];
    confidence: number;
    why: string;
    recommendation: string;
    dataStatus: string;
    disclaimer: string;
  };
}

export const CityCopilot: React.FC = () => {
  const { currentZone, language } = useCity();

  const [inputQuery, setInputQuery] = useState("");
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: "msg-1",
      sender: "copilot",
      structuredResponse: {
        answer: `Hello! I am CityMind Copilot. I am currently monitoring ${currentZone.name}. How can I assist your commute, environment, or city intelligence today?`,
        dataUsed: ["City Sensor Grid SENSE-V4", "Traffic Intelligence Node", "Weather Radar"],
        confidence: 94,
        why: `All NovaCity monitoring sub-systems operating normally for ${currentZone.name}.`,
        recommendation: `Ask about current air quality, traffic predictions, water watch, or travel optimization.`,
        dataStatus: "Simulated • Realtime-aligned",
        disclaimer: "Prediction, not certainty.",
      },
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Sample Query Suggestions
  const samplePrompts = [
    "What is happening near me?",
    "Will rain affect my travel?",
    "Which area has better air quality?",
    "Why is traffic increasing?",
    "Are there water problems nearby?",
    "What happens if public transport increases?",
  ];

  // Speech Recognition setup (Web Speech API)
  const handleToggleVoice = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = language === "te" ? "te-IN" : language === "hi" ? "hi-IN" : "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    setIsListening(true);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputQuery(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  // Text to Speech output
  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg: CopilotMessage = {
      id: "msg-" + Date.now(),
      sender: "user",
      text: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: query,
          areaName: currentZone.name,
          cityState: currentZone,
          language,
        }),
      });

      const data = await res.json();
      setIsLoading(false);

      const aiMsg: CopilotMessage = {
        id: "msg-" + Date.now(),
        sender: "copilot",
        structuredResponse: data,
      };

      setMessages((prev) => [...prev, aiMsg]);

      if (data.answer) {
        speakText(data.answer);
      }
    } catch (e) {
      setIsLoading(false);
      const fallbackMsg: CopilotMessage = {
        id: "msg-" + Date.now(),
        sender: "copilot",
        structuredResponse: {
          answer: `In ${currentZone.name}, current conditions indicate ${currentZone.traffic} traffic and ${currentZone.aqi} AQI (${currentZone.aqiStatus}).`,
          dataUsed: ["City Sensor Grid"],
          confidence: 85,
          why: "Baseline sensor snapshot.",
          recommendation: "Check alerts feed for real-time advisories.",
          dataStatus: "Simulated",
          disclaimer: "Prediction, not certainty.",
        },
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col h-[520px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-cyan-400" />
          <div>
            <h2 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
              CITYMIND COPILOT & VOICE AI
            </h2>
            <span className="text-[10px] text-slate-400">Context: {currentZone.name}</span>
          </div>
        </div>

        <button
          onClick={handleToggleVoice}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
            isListening
              ? "bg-rose-600 text-white animate-pulse"
              : "bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700"
          }`}
        >
          {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
          <span>{isListening ? "Listening..." : "TALK TO CITYMIND"}</span>
        </button>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="py-2 flex gap-1.5 overflow-x-auto no-scrollbar border-b border-slate-800/60">
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(p)}
            className="text-[10px] font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg border border-slate-700/60 whitespace-nowrap shrink-0 transition-colors"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto my-3 space-y-3 pr-1 text-xs">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
          >
            {m.sender === "user" ? (
              <div className="bg-cyan-600 text-white p-3 rounded-2xl rounded-tr-none max-w-[85%] font-medium shadow-md">
                {m.text}
              </div>
            ) : (
              <div className="bg-slate-800/90 border border-slate-700/80 p-3.5 rounded-2xl rounded-tl-none max-w-[95%] space-y-2.5 text-slate-200 shadow-md">
                {/* Structured AI Response Box */}
                {m.structuredResponse && (
                  <>
                    <div className="flex items-center justify-between border-b border-slate-700/60 pb-2">
                      <span className="font-bold text-cyan-400 flex items-center gap-1 text-[11px]">
                        <Sparkles className="w-3.5 h-3.5" />
                        AI RESPONSE
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-slate-900 text-emerald-400 px-2 py-0.5 rounded font-bold border border-slate-700">
                          CONFIDENCE: {m.structuredResponse.confidence}%
                        </span>
                        <button
                          onClick={() => speakText(m.structuredResponse?.answer || "")}
                          className="text-slate-400 hover:text-cyan-400"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Answer */}
                    <p className="text-xs text-slate-100 font-semibold leading-relaxed">
                      {m.structuredResponse.answer}
                    </p>

                    {/* Data Used */}
                    <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800 text-[10px] space-y-1">
                      <span className="font-bold text-slate-400 flex items-center gap-1">
                        <Database className="w-3 h-3 text-cyan-400" />
                        DATA SOURCES USED:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {m.structuredResponse.dataUsed.map((src, idx) => (
                          <span key={idx} className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                            {src}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Why? */}
                    <div className="text-[11px] text-slate-300">
                      <span className="font-bold text-cyan-400 flex items-center gap-1 mb-0.5">
                        <HelpCircle className="w-3 h-3" />
                        WHY?
                      </span>
                      {m.structuredResponse.why}
                    </div>

                    {/* Recommendation */}
                    <div className="bg-emerald-950/30 p-2 rounded-lg border border-emerald-800/50 text-[11px] text-emerald-200">
                      <span className="font-bold text-emerald-400 flex items-center gap-1 mb-0.5">
                        <Lightbulb className="w-3 h-3" />
                        RECOMMENDATION:
                      </span>
                      {m.structuredResponse.recommendation}
                    </div>

                    {/* Status & Disclaimer */}
                    <div className="flex items-center justify-between text-[9px] text-slate-500 pt-1 border-t border-slate-700/40">
                      <span>STATUS: {m.structuredResponse.dataStatus}</span>
                      <span className="flex items-center gap-1 italic text-slate-400">
                        <ShieldAlert className="w-2.5 h-2.5 text-amber-500" />
                        {m.structuredResponse.disclaimer}
                      </span>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700 max-w-xs text-slate-400 text-xs flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
            <span>Analyzing NovaCity sensor telemetry...</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="pt-2 border-t border-slate-800 flex gap-2"
      >
        <input
          type="text"
          placeholder="Ask CityMind Copilot about your area..."
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
        />
        <button
          type="submit"
          className="bg-cyan-600 hover:bg-cyan-500 text-white p-2.5 rounded-xl transition-colors shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
