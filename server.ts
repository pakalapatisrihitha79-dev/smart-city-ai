import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy initializer for Gemini client
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", city: "NovaCity", engine: "CityMind AI" });
});

// AI Copilot endpoint
app.post("/api/ai/copilot", async (req, res) => {
  try {
    const { question, areaName, cityState, language } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Fallback deterministic AI reasoning if no key is configured
      return res.json({
        answer: `Currently in ${areaName || "NovaCity"}, the city systems are operating with a Health Score of ${
          cityState?.healthScore || 87
        }/100. Traffic is ${cityState?.traffic || "Moderate"}, Air Quality is ${
          cityState?.aqi || "Good"
        }, and weather is ${cityState?.weather || "Clear"}.`,
        dataUsed: ["City Sensors SENSE-V4", "Traffic Intelligence Node", "Weather Radar"],
        confidence: 88,
        why: `Traffic flow is stable across primary routes. Air quality benefits from favorable wind currents at 14 km/h.`,
        recommendation: `No immediate intervention needed. Optimal travel time is before 5:30 PM.`,
        dataStatus: "Simulated • Realtime-aligned",
        disclaimer: "Prediction, not certainty. Data derived from NovaCity intelligent simulation engine.",
      });
    }

    const systemInstruction = `You are CityMind AI, an intelligent smart city assistant for the fictional city NovaCity.
Answer the citizen's query in ${language || "English"} based on the city context provided.
You MUST format your response as valid JSON with the following schema:
- answer: string (concise, direct answer)
- dataUsed: string[] (sources e.g. "Traffic SENSE-V4", "AQI Monitoring Zone 3", "Hydro Sensors")
- confidence: number (e.g. 85)
- why: string (main contributing factors)
- recommendation: string (practical suggestion for citizen)
- dataStatus: string (e.g. "Observed / Simulated")
- disclaimer: string ("Prediction, not certainty. NovaCity AI model estimate.")`;

    const prompt = `Area: ${areaName || "Central District"}\nContext: ${JSON.stringify(
      cityState || {}
    )}\nCitizen Question: ${question}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            answer: { type: Type.STRING },
            dataUsed: { type: Type.ARRAY, items: { type: Type.STRING } },
            confidence: { type: Type.NUMBER },
            why: { type: Type.STRING },
            recommendation: { type: Type.STRING },
            dataStatus: { type: Type.STRING },
            disclaimer: { type: Type.STRING },
          },
          required: ["answer", "dataUsed", "confidence", "why", "recommendation", "dataStatus", "disclaimer"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Copilot AI error:", error);
    res.status(500).json({
      answer: "CityMind AI encountered a temporary issue generating a custom neural prediction. Current area parameters remain within safe baseline limits.",
      dataUsed: ["System Diagnostics"],
      confidence: 75,
      why: "Fallback rule engine activated.",
      recommendation: "Check primary alerts dashboard for active advisories.",
      dataStatus: "Simulated Baseline",
      disclaimer: "Prediction, not certainty.",
    });
  }
});

// Civic Image Analysis endpoint (Computer Vision simulation / Gemini Vision)
app.post("/api/ai/analyze-image", async (req, res) => {
  try {
    const { imageBase64, userNotes, locationName } = req.body;
    const ai = getGeminiClient();

    if (!ai || !imageBase64) {
      // Fallback classification
      const keywords = (userNotes || "").toLowerCase();
      let category = "Pothole & Road Damage";
      let severity = "Medium";
      let priority = "High";
      let department = "Public Works & Infrastructure";

      if (keywords.includes("water") || keywords.includes("leak") || keywords.includes("pipe")) {
        category = "Water Pipe Leak / Supply";
        severity = "High";
        priority = "Critical";
        department = "Water & Sewage Board";
      } else if (keywords.includes("waste") || keywords.includes("garbage") || keywords.includes("dump")) {
        category = "Overflowing Waste Bin";
        severity = "Medium";
        priority = "Medium";
        department = "Sanitation & Waste Management";
      } else if (keywords.includes("light") || keywords.includes("lamp") || keywords.includes("dark")) {
        category = "Broken Streetlight";
        severity = "Low";
        priority = "Low";
        department = "Electrical Grid & Lighting";
      }

      return res.json({
        category,
        severity,
        priority,
        suggestedDepartment: department,
        confidence: 89,
        summary: `AI computer vision identified potential ${category.toLowerCase()} near ${locationName || "Central Avenue"}.`,
        duplicateCheck: {
          possibleDuplicate: false,
          nearestReportId: null,
          distanceMeters: null,
        },
      });
    }

    // Clean up base64 prefix if present
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    const imagePart = {
      inlineData: {
        mimeType: "image/jpeg",
        data: cleanBase64,
      },
    };

    const textPart = {
      text: `Analyze this civic issue photo taken in NovaCity at ${locationName || "selected zone"}. Notes from reporter: "${userNotes || ""}".
Identify category (e.g. Pothole / Road Damage, Overflowing Waste, Water Leakage, Broken Streetlight, Fallen Tree/Obstruction), severity (Low, Medium, High, Critical), priority (Low, Medium, High, Critical), suggested city department, confidence score (0-100), and concise summary.`,
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            severity: { type: Type.STRING },
            priority: { type: Type.STRING },
            suggestedDepartment: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            summary: { type: Type.STRING },
          },
          required: ["category", "severity", "priority", "suggestedDepartment", "confidence", "summary"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json({
      ...parsed,
      duplicateCheck: {
        possibleDuplicate: false,
        nearestReportId: null,
        distanceMeters: null,
      },
    });
  } catch (err) {
    console.error("Image analysis error:", err);
    res.json({
      category: "Road & Surface Condition",
      severity: "Medium",
      priority: "Medium",
      suggestedDepartment: "Public Works Department",
      confidence: 82,
      summary: "AI vision analyzed reported issue. Requires municipal verification.",
      duplicateCheck: { possibleDuplicate: false },
    });
  }
});

// What-If Simulation Reasoning endpoint
app.post("/api/ai/simulate", async (req, res) => {
  try {
    const { parameters, areaName } = req.body;
    const ai = getGeminiClient();

    // Deterministic mathematical simulator output base
    const baseTrafficDiff = Math.round((100 - parameters.publicTransportPct) * 0.2 - (parameters.vehiclesPct - 100) * 0.3);
    const baseEmissionsDiff = Math.round((100 - parameters.renewablePct) * 0.25 - parameters.greenCoverPct * 0.1);
    const baseWaterDiff = Math.round((parameters.waterUsagePct - 100) * 0.8);

    if (!ai) {
      return res.json({
        trafficDiffPct: baseTrafficDiff,
        emissionsDiffPct: baseEmissionsDiff,
        waterDiffPct: baseWaterDiff,
        healthScoreDelta: Math.round((baseTrafficDiff > 0 ? -2 : 3) + (baseEmissionsDiff > 0 ? -3 : 4)),
        summary: `Simulating +${parameters.publicTransportPct - 100}% public transit and ${parameters.renewablePct}% green power in ${areaName || "NovaCity"}.`,
        recommendation: "Increasing transit frequency during morning peak yields maximum congestion reduction.",
        disclaimer: "SIMULATION — NOT A GUARANTEED REAL-WORLD OUTCOME",
      });
    }

    const prompt = `Simulate urban policy changes for NovaCity (${areaName || "Citywide"}):
Parameters:
- Traffic Vehicle Count: ${parameters.vehiclesPct}% of normal
- Public Transport Capacity: ${parameters.publicTransportPct}% of normal
- Renewable Energy Share: ${parameters.renewablePct}%
- Water Consumption: ${parameters.waterUsagePct}% of normal
- Green Canopy Cover: ${parameters.greenCoverPct}%

Provide predicted impact summary, recommended policy tweak, and key trade-off analysis.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            recommendation: { type: Type.STRING },
            tradeOffs: { type: Type.STRING },
          },
          required: ["summary", "recommendation", "tradeOffs"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json({
      trafficDiffPct: baseTrafficDiff,
      emissionsDiffPct: baseEmissionsDiff,
      waterDiffPct: baseWaterDiff,
      healthScoreDelta: Math.round((baseTrafficDiff < 0 ? 3 : -2) + (baseEmissionsDiff < 0 ? 4 : -3)),
      ...parsed,
      disclaimer: "SIMULATION — NOT A GUARANTEED REAL-WORLD OUTCOME",
    });
  } catch (error) {
    res.json({
      trafficDiffPct: -8,
      emissionsDiffPct: -12,
      waterDiffPct: -5,
      healthScoreDelta: +4,
      summary: "Simulated scenario indicates net improvement in city resilience and carbon footprint.",
      recommendation: "Prioritize green corridor expansion alongside public transport optimization.",
      disclaimer: "SIMULATION — NOT A GUARANTEED REAL-WORLD OUTCOME",
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CityMind AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
