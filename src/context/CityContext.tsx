import React, { createContext, useContext, useState, useEffect } from "react";
import {
  CityZone,
  MonitoredArea,
  UserAccount,
  CivicReport,
  CityAlert,
  DemoScenarioType,
  CityZoneId,
  TimelineHorizon,
  DigitalTwinMode,
  CityDNA,
  DecisionLogEntry,
  SavedWhatIfScenario,
} from "../types";
import {
  BASE_NOVACITY_ZONES,
  INITIAL_MONITORED_AREAS,
  INITIAL_CIVIC_REPORTS,
  INITIAL_ALERTS,
} from "../data/mockData";
import { simulateCityState, calculateCityDNA } from "../utils/cityEngine";
import { SupportedLanguage, getTranslation } from "../utils/translations";

export interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  voiceEnabled: boolean;
  voiceAnnouncements: boolean;
  reducedMotion: boolean;
  reduceMotion: boolean;
}

export interface AlertRule {
  id: string;
  areaId: string;
  areaName: string;
  metric: string;
  operator: string;
  threshold: number;
  enabled: boolean;
}

interface CityContextType {
  // Auth & Profile
  user: UserAccount | null;
  currentUser: UserAccount | null;
  login: (email: string, pass?: string) => boolean;
  register: (nameOrData: string | Partial<UserAccount>, email?: string, areaId?: string) => boolean;
  logout: () => void;
  updateProfile: (data: Partial<UserAccount>) => void;

  // Monitored Areas
  monitoredAreas: MonitoredArea[];
  primaryAreaId: string;
  setPrimaryAreaId: (id: string) => void;
  addMonitoredArea: (area: Omit<MonitoredArea, "id">) => void;
  removeMonitoredArea: (id: string) => void;

  // City State & Scenario Engine
  allZones: CityZone[];
  customZones?: CityZone[];
  addCustomZone: (data: {
    name: string;
    region?: string;
    type?: string;
    healthPreset?: string;
    lat?: number;
    lng?: number;
  }) => CityZone;
  currentZone: CityZone;
  demoScenario: DemoScenarioType;
  currentScenario: DemoScenarioType;
  setDemoScenario: (scen: DemoScenarioType) => void;
  setScenario: (scen: DemoScenarioType) => void;
  simulatedTime: string;
  setSimulatedTime: (time: string) => void;
  resetCity: () => void;

  // Timeline & Digital Twin Modes
  timelineHorizon: TimelineHorizon;
  setTimelineHorizon: (h: TimelineHorizon) => void;
  digitalTwinMode: DigitalTwinMode;
  setDigitalTwinMode: (m: DigitalTwinMode) => void;
  cityDNA: CityDNA;

  // Explainable AI & Confidence Modals
  explainableMetric: "traffic" | "aqi" | "flood" | "water" | "energy" | "health" | null;
  openExplainModal: (metric: "traffic" | "aqi" | "flood" | "water" | "energy" | "health") => void;
  closeExplainModal: () => void;
  isConfidenceModalOpen: boolean;
  setIsConfidenceModalOpen: (open: boolean) => void;

  // Interactive Labs & Game Modes
  isDecisionModalOpen: boolean;
  setIsDecisionModalOpen: (open: boolean) => void;
  isFixCityOpen: boolean;
  setIsFixCityOpen: (open: boolean) => void;
  isStoryModeOpen: boolean;
  setIsStoryModeOpen: (open: boolean) => void;
  is90sDemoOpen: boolean;
  setIs90sDemoOpen: (open: boolean) => void;

  // Decision Memory Logs
  decisionLogs: DecisionLogEntry[];
  addDecisionLog: (entry: Omit<DecisionLogEntry, "id" | "timestamp">) => void;

  // Saved What-If Scenarios
  savedScenarios: SavedWhatIfScenario[];
  saveScenario: (scen: Omit<SavedWhatIfScenario, "id" | "date">) => void;
  deleteScenario: (id: string) => void;

  // Guided Demo Walkthrough
  walkthroughStep: number | null;
  startWalkthrough: () => void;
  nextWalkthroughStep: () => void;
  cancelWalkthrough: () => void;

  // Language & Accessibility
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  isLanguageModalOpen: boolean;
  setIsLanguageModalOpen: (open: boolean) => void;
  openLanguageModal: () => void;
  t: (key: string, fallback?: string) => string;
  accessibility: AccessibilitySettings;
  accessibilitySettings: AccessibilitySettings;
  updateAccessibility: (settings: Partial<AccessibilitySettings>) => void;

  // Civic Reporting
  civicReports: CivicReport[];
  addCivicReport: (report: Omit<CivicReport, "id" | "createdAt" | "updatedAt" | "upvotesCount" | "stillExistsCount" | "fixedCount">) => CivicReport;
  verifyCivicReport: (id: string, isStillPresent: boolean) => void;

  // Alerts & Rules
  alerts: CityAlert[];
  cityAlerts: CityAlert[];
  muteAlert: (id: string) => void;
  alertRules: AlertRule[];
  addAlertRule: (rule: Omit<AlertRule, "id">) => void;

  // Role & Authority Mode
  userRole: "citizen" | "authority";
  setUserRole: (role: "citizen" | "authority") => void;
  isAuthorityMode: boolean;
  toggleAuthorityMode: () => void;
}

const CityContext = createContext<CityContextType | undefined>(undefined);

export const CityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Auth State
  const [user, setUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem("citymind_user");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      id: "usr-demo",
      name: "Alex Rivera",
      email: "alex.rivera@novacity.org",
      language: "en",
      city: "NovaCity",
      preferredArea: "Central District",
      notificationPrefs: {
        traffic: true,
        weather: true,
        pollution: true,
        water: true,
        electricity: false,
        civic: true,
        emergency: true,
      },
      greenCitizenScore: 420,
      goals: ["Reduce travel time", "Use public transport", "Report civic issues"],
      role: "citizen",
      isEmailVerified: true,
    };
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("citymind_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("citymind_user");
    }
  }, [user]);

  // 2. Monitored Areas
  const [monitoredAreas, setMonitoredAreas] = useState<MonitoredArea[]>(() => {
    const saved = localStorage.getItem("citymind_areas");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_MONITORED_AREAS;
  });

  const [primaryAreaId, setPrimaryAreaIdState] = useState<string>(() => {
    return monitoredAreas.find((a) => a.isPrimary)?.id || monitoredAreas[0]?.id || "area-home";
  });

  const setPrimaryAreaId = (id: string) => {
    setPrimaryAreaIdState(id);
    setMonitoredAreas((prev) =>
      prev.map((a) => ({
        ...a,
        isPrimary: a.id === id,
      }))
    );
  };

  const addMonitoredArea = (areaData: Omit<MonitoredArea, "id">) => {
    const newId = "area-" + Date.now();
    const newArea: MonitoredArea = {
      ...areaData,
      id: newId,
    };
    setMonitoredAreas((prev) => [...prev, newArea]);
    if (newArea.isPrimary) {
      setPrimaryAreaId(newId);
    }
  };

  const removeMonitoredArea = (id: string) => {
    setMonitoredAreas((prev) => prev.filter((a) => a.id !== id));
    if (primaryAreaId === id) {
      const remaining = monitoredAreas.filter((a) => a.id !== id);
      if (remaining.length > 0) {
        setPrimaryAreaId(remaining[0].id);
      }
    }
  };

  // 3. City State & Scenario Engine
  const [customZones, setCustomZones] = useState<CityZone[]>(() => {
    const saved = localStorage.getItem("citymind_custom_zones");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("citymind_custom_zones", JSON.stringify(customZones));
  }, [customZones]);

  const [demoScenario, setDemoScenario] = useState<DemoScenarioType>("normal");
  const [timelineHorizon, setTimelineHorizon] = useState<TimelineHorizon>("now");
  const [digitalTwinMode, setDigitalTwinMode] = useState<DigitalTwinMode>("LIVE");
  const [simulatedTime, setSimulatedTime] = useState<string>("08:30 AM");

  const [allZones, setAllZones] = useState<CityZone[]>(() =>
    simulateCityState([...BASE_NOVACITY_ZONES, ...customZones], "normal", new Date(), "now")
  );

  useEffect(() => {
    const update = () => {
      setAllZones(
        simulateCityState([...BASE_NOVACITY_ZONES, ...customZones], demoScenario, new Date(), timelineHorizon)
      );
    };
    update();
    const interval = setInterval(update, 10000);
    return () => clearInterval(interval);
  }, [demoScenario, customZones, timelineHorizon]);

  // Derived City DNA
  const cityDNA = calculateCityDNA(allZones);

  const resetCity = () => {
    setDemoScenario("normal");
    setTimelineHorizon("now");
    setDigitalTwinMode("LIVE");
    setSimulatedTime("08:30 AM");
    setAllZones(simulateCityState([...BASE_NOVACITY_ZONES, ...customZones], "normal", new Date(), "now"));
  };

  const addCustomZone = (data: {
    name: string;
    region?: string;
    type?: string;
    healthPreset?: string;
    lat?: number;
    lng?: number;
  }): CityZone => {
    const customId = `custom-zone-${Date.now()}`;
    const name = data.name.trim();
    const fullType = data.region
      ? `${data.type || "Custom District"} • ${data.region}`
      : data.type || "Custom District / City";

    let healthScore = 82;
    let traffic: any = "Moderate";
    let aqi = 65;
    let aqiStatus = "Moderate";
    let temp = 28;

    if (data.healthPreset === "busy") {
      healthScore = 65;
      traffic = "High";
      aqi = 110;
      aqiStatus = "Poor";
    } else if (data.healthPreset === "eco") {
      healthScore = 92;
      traffic = "Low";
      aqi = 35;
      aqiStatus = "Good";
    } else if (data.healthPreset === "industrial") {
      healthScore = 58;
      traffic = "High";
      aqi = 145;
      aqiStatus = "Unhealthy";
    }

    const newZone: CityZone = {
      id: customId as CityZoneId,
      name: name,
      type: fullType,
      healthScore,
      traffic: traffic,
      aqi,
      aqiStatus: aqiStatus as "Good" | "Moderate" | "Poor" | "Unhealthy" | "Severe",
      pm25: Math.round(aqi * 0.4),
      pm10: Math.round(aqi * 0.8),
      temp,
      humidity: 62,
      weather: "Cloudy",
      rainfallMm: 0,
      floodRiskPct: 15,
      energyDemandKw: 3400,
      renewablePct: 45,
      energyPeakStatus: "Normal",
      waterConsumptionDiffPct: 0,
      waterStatus: "Normal",
      safetyRisk: "Low Risk",
      wasteLevel: "Normal",
      alertCount: 0,
      lat: data.lat || 17.385 + (Math.random() - 0.5) * 0.15,
      lng: data.lng || 78.486 + (Math.random() - 0.5) * 0.15,
    };

    setCustomZones((prev) => [...prev, newZone]);

    addMonitoredArea({
      name: name,
      typeIcon: "custom",
      isPrimary: true,
      zoneId: customId as CityZoneId,
      customLocationName: data.region ? `${name}, ${data.region}` : name,
      lat: newZone.lat,
      lng: newZone.lng,
    });

    return newZone;
  };

  const activeAreaObj = monitoredAreas.find((a) => a.id === primaryAreaId) || monitoredAreas[0];
  const currentZone =
    allZones.find((z) => z.id === activeAreaObj?.zoneId) ||
    allZones.find((z) => z.id === "central") ||
    allZones[0];

  // 4. Explainable AI & Confidence Modals
  const [explainableMetric, setExplainableMetric] = useState<
    "traffic" | "aqi" | "flood" | "water" | "energy" | "health" | null
  >(null);

  const openExplainModal = (metric: "traffic" | "aqi" | "flood" | "water" | "energy" | "health") => {
    setExplainableMetric(metric);
  };
  const closeExplainModal = () => setExplainableMetric(null);

  const [isConfidenceModalOpen, setIsConfidenceModalOpen] = useState(false);
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);
  const [isFixCityOpen, setIsFixCityOpen] = useState(false);
  const [isStoryModeOpen, setIsStoryModeOpen] = useState(false);
  const [is90sDemoOpen, setIs90sDemoOpen] = useState(false);

  // 5. Decision Memory Logs
  const [decisionLogs, setDecisionLogs] = useState<DecisionLogEntry[]>(() => {
    const saved = localStorage.getItem("citymind_decision_logs");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        id: "dec-init-1",
        timestamp: "Yesterday, 05:40 PM",
        scenarioTitle: "Lowland Flood Threat in Sector 4",
        selectedOptionLabel: "OPTION E: Combined Response Playbook",
        aiRecommendationLabel: "OPTION E: Combined Response Playbook",
        humanChoice: "Aligned with AI",
        simulatedResult: "Congestion -18%, Safety Risk -36%, Commuter Delay -14 mins",
        impactSummary: "Averted gridlock across 12,400 affected trips.",
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem("citymind_decision_logs", JSON.stringify(decisionLogs));
  }, [decisionLogs]);

  const addDecisionLog = (entry: Omit<DecisionLogEntry, "id" | "timestamp">) => {
    const newLog: DecisionLogEntry = {
      ...entry,
      id: "dec-" + Date.now(),
      timestamp: "Just now (" + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + ")",
    };
    setDecisionLogs((prev) => [newLog, ...prev]);
  };

  // 6. Saved What-If Scenarios
  const [savedScenarios, setSavedScenarios] = useState<SavedWhatIfScenario[]>(() => {
    const saved = localStorage.getItem("citymind_saved_scenarios");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        id: "scen-preset-1",
        name: "Scenario A: Transit Expansion Priority",
        date: "2 days ago",
        params: {
          vehiclesPct: 80,
          publicTransportPct: 160,
          renewablePct: 65,
          waterUsagePct: 90,
          recyclingPct: 60,
          greenCoverPct: 45,
          rainfallMm: 5,
        },
        trafficDiffPct: -18,
        aqiDiffPct: -24,
        energyDiffPct: +12,
        waterDiffPct: -8,
        carbonDiffPct: -22,
        costEstimate: "Medium CapEx",
        sustainabilityScore: 88,
        citizenImpactScore: 92,
        cityHealthDelta: +11,
        summary: "Optimal balance of transit headway reduction and clean power generation.",
        isBest: true,
      },
      {
        id: "scen-preset-2",
        name: "Scenario B: Heavy Renewable Microgrids",
        date: "5 days ago",
        params: {
          vehiclesPct: 100,
          publicTransportPct: 110,
          renewablePct: 95,
          waterUsagePct: 100,
          recyclingPct: 75,
          greenCoverPct: 50,
          rainfallMm: 0,
        },
        trafficDiffPct: -4,
        aqiDiffPct: -16,
        energyDiffPct: +38,
        waterDiffPct: 0,
        carbonDiffPct: -30,
        costEstimate: "High CapEx",
        sustainabilityScore: 94,
        citizenImpactScore: 78,
        cityHealthDelta: +8,
        summary: "Maximizes zero-carbon footprint across industrial and commercial districts.",
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem("citymind_saved_scenarios", JSON.stringify(savedScenarios));
  }, [savedScenarios]);

  const saveScenario = (scenData: Omit<SavedWhatIfScenario, "id" | "date">) => {
    const newScen: SavedWhatIfScenario = {
      ...scenData,
      id: "scen-" + Date.now(),
      date: "Just now",
    };
    setSavedScenarios((prev) => [newScen, ...prev]);
  };

  const deleteScenario = (id: string) => {
    setSavedScenarios((prev) => prev.filter((s) => s.id !== id));
  };

  // 7. Guided Walkthrough
  const [walkthroughStep, setWalkthroughStep] = useState<number | null>(null);

  const startWalkthrough = () => {
    setDemoScenario("heavy_rain");
    setWalkthroughStep(1);
  };

  const nextWalkthroughStep = () => {
    if (walkthroughStep !== null && walkthroughStep < 9) {
      setWalkthroughStep(walkthroughStep + 1);
    } else {
      setWalkthroughStep(null);
    }
  };

  const cancelWalkthrough = () => {
    setWalkthroughStep(null);
    setDemoScenario("normal");
  };

  // 8. Language & Accessibility
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    const saved = localStorage.getItem("citymind_language");
    if (saved) return saved as SupportedLanguage;
    return (user?.language as SupportedLanguage) || "en";
  });

  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const openLanguageModal = () => setIsLanguageModalOpen(true);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    localStorage.setItem("citymind_language", lang);
    if (user) {
      setUser({ ...user, language: lang });
    }
  };

  const t = (key: string, fallback?: string): string => {
    const translated = getTranslation(language, key);
    if (translated && translated !== key) return translated;
    return fallback || translated || key;
  };

  const [accessibility, setAccessibility] = useState<AccessibilitySettings>({
    highContrast: false,
    largeText: false,
    voiceEnabled: true,
    voiceAnnouncements: true,
    reducedMotion: false,
    reduceMotion: false,
  });

  const updateAccessibility = (settings: Partial<AccessibilitySettings>) => {
    setAccessibility((prev) => {
      const next = { ...prev, ...settings };
      if (settings.reduceMotion !== undefined) next.reducedMotion = settings.reduceMotion;
      if (settings.reducedMotion !== undefined) next.reduceMotion = settings.reducedMotion;
      if (settings.voiceAnnouncements !== undefined) next.voiceEnabled = settings.voiceAnnouncements;
      if (settings.voiceEnabled !== undefined) next.voiceAnnouncements = settings.voiceEnabled;
      return next;
    });
  };

  // 9. Alert Rules
  const [alertRules, setAlertRules] = useState<AlertRule[]>([
    {
      id: "rule-1",
      areaId: "central",
      areaName: "Central District",
      metric: "AQI",
      operator: ">",
      threshold: 120,
      enabled: true,
    },
  ]);

  const addAlertRule = (ruleData: Omit<AlertRule, "id">) => {
    const newRule: AlertRule = {
      ...ruleData,
      id: "rule-" + Date.now(),
    };
    setAlertRules((prev) => [...prev, newRule]);
  };

  // 10. Civic Reports
  const [civicReports, setCivicReports] = useState<CivicReport[]>(INITIAL_CIVIC_REPORTS);

  const addCivicReport = (
    reportData: Omit<
      CivicReport,
      "id" | "createdAt" | "updatedAt" | "upvotesCount" | "stillExistsCount" | "fixedCount"
    >
  ) => {
    const newReport: CivicReport = {
      ...reportData,
      id: "REP-" + Math.floor(1000 + Math.random() * 9000),
      createdAt: "Just now",
      updatedAt: "Just now",
      upvotesCount: 1,
      stillExistsCount: 1,
      fixedCount: 0,
    };
    setCivicReports((prev) => [newReport, ...prev]);

    if (user) {
      setUser({ ...user, greenCitizenScore: user.greenCitizenScore + 25 });
    }
    return newReport;
  };

  const verifyCivicReport = (id: string, isStillPresent: boolean) => {
    setCivicReports((prev) =>
      prev.map((rep) => {
        if (rep.id === id) {
          return {
            ...rep,
            stillExistsCount: isStillPresent ? rep.stillExistsCount + 1 : rep.stillExistsCount,
            fixedCount: !isStillPresent ? rep.fixedCount + 1 : rep.fixedCount,
          };
        }
        return rep;
      })
    );
    if (user) {
      setUser({ ...user, greenCitizenScore: user.greenCitizenScore + 10 });
    }
  };

  // 11. Alerts
  const [alerts, setAlerts] = useState<CityAlert[]>(INITIAL_ALERTS);
  const muteAlert = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, isMuted: true } : a)));
  };

  // 12. User Role
  const [userRole, setUserRole] = useState<"citizen" | "authority">("citizen");
  const isAuthorityMode = userRole === "authority";
  const toggleAuthorityMode = () => {
    setUserRole((prev) => (prev === "authority" ? "citizen" : "authority"));
  };

  // Auth Methods
  const login = (email: string) => {
    const nameFromEmail = email.split("@")[0] || "Citizen";
    const formattedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
    setUser({
      id: "usr-" + Date.now(),
      name: formattedName,
      email,
      language: language,
      city: "NovaCity",
      preferredArea: "Central District",
      notificationPrefs: {
        traffic: true,
        weather: true,
        pollution: true,
        water: true,
        electricity: false,
        civic: true,
        emergency: true,
      },
      greenCitizenScore: 100,
      goals: ["Monitor air quality", "Report civic issues"],
      role: "citizen",
      isEmailVerified: true,
    });
    return true;
  };

  const register = (
    nameOrData: string | Partial<UserAccount>,
    email?: string,
    areaId?: string
  ) => {
    let data: Partial<UserAccount> = {};
    if (typeof nameOrData === "string") {
      data = { name: nameOrData, email: email || "", preferredArea: areaId };
    } else {
      data = nameOrData;
    }
    setUser({
      id: "usr-" + Date.now(),
      name: data.name || "New Citizen",
      email: data.email || "citizen@novacity.org",
      language: (data.language as SupportedLanguage) || language,
      city: "NovaCity",
      preferredArea: data.preferredArea || "Central District",
      notificationPrefs: data.notificationPrefs || {
        traffic: true,
        weather: true,
        pollution: true,
        water: true,
        electricity: true,
        civic: true,
        emergency: true,
      },
      greenCitizenScore: 150,
      goals: ["Reduce travel time", "Monitor air quality"],
      role: "citizen",
      isEmailVerified: true,
    });
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (data: Partial<UserAccount>) => {
    if (user) {
      setUser({ ...user, ...data });
    }
  };

  return (
    <CityContext.Provider
      value={{
        user,
        currentUser: user,
        login,
        register,
        logout,
        updateProfile,
        monitoredAreas,
        primaryAreaId,
        setPrimaryAreaId,
        addMonitoredArea,
        removeMonitoredArea,
        allZones,
        customZones,
        addCustomZone,
        currentZone,
        demoScenario,
        currentScenario: demoScenario,
        setDemoScenario,
        setScenario: setDemoScenario,
        simulatedTime,
        setSimulatedTime,
        resetCity,
        timelineHorizon,
        setTimelineHorizon,
        digitalTwinMode,
        setDigitalTwinMode,
        cityDNA,
        explainableMetric,
        openExplainModal,
        closeExplainModal,
        isConfidenceModalOpen,
        setIsConfidenceModalOpen,
        isDecisionModalOpen,
        setIsDecisionModalOpen,
        isFixCityOpen,
        setIsFixCityOpen,
        isStoryModeOpen,
        setIsStoryModeOpen,
        is90sDemoOpen,
        setIs90sDemoOpen,
        decisionLogs,
        addDecisionLog,
        savedScenarios,
        saveScenario,
        deleteScenario,
        walkthroughStep,
        startWalkthrough,
        nextWalkthroughStep,
        cancelWalkthrough,
        language,
        setLanguage,
        isLanguageModalOpen,
        setIsLanguageModalOpen,
        openLanguageModal,
        t,
        accessibility,
        accessibilitySettings: accessibility,
        updateAccessibility,
        civicReports,
        addCivicReport,
        verifyCivicReport,
        alerts,
        cityAlerts: alerts,
        muteAlert,
        alertRules,
        addAlertRule,
        userRole,
        setUserRole,
        isAuthorityMode,
        toggleAuthorityMode,
      }}
    >
      {children}
    </CityContext.Provider>
  );
};

export function useCity() {
  const ctx = useContext(CityContext);
  if (!ctx) throw new Error("useCity must be used within CityProvider");
  return ctx;
}

