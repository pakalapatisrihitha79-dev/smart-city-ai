export type CityZoneId =
  | "zone-1"
  | "zone-2"
  | "zone-3"
  | "zone-4"
  | "zone-5"
  | "central"
  | "riverside"
  | "green"
  | "industrial"
  | "university";

export interface CityZone {
  id: CityZoneId;
  name: string;
  type: string;
  healthScore: number; // 0 - 100
  traffic: "Low" | "Moderate" | "High" | "Congested";
  aqi: number; // e.g., 42, 88, 145
  aqiStatus: "Good" | "Moderate" | "Poor" | "Unhealthy" | "Severe";
  pm25: number;
  pm10: number;
  weather: "Sunny" | "Cloudy" | "Overcast" | "Light Rain" | "Heavy Rain" | "Thunderstorm";
  temp: number; // Celsius
  humidity: number; // %
  rainfallMm: number;
  waterStatus: "Normal" | "Elevated Demand" | "Anomaly Leakage" | "Reservoir Low";
  waterConsumptionDiffPct: number; // e.g. +28%
  energyDemandKw: number;
  energyPeakStatus: "Normal" | "Approaching Peak" | "Peak Load";
  renewablePct: number;
  wasteLevel: "Normal" | "Moderate" | "High Overflow";
  safetyRisk: "Low Risk" | "Moderate Risk" | "High Risk" | "Critical";
  floodRiskPct: number;
  lat: number;
  lng: number;
  alertCount: number;
}

export interface MonitoredArea {
  id: string;
  name: string;
  typeIcon: "home" | "college" | "work" | "favorite" | "custom";
  isPrimary: boolean;
  zoneId: CityZoneId;
  customLocationName?: string;
  lat: number;
  lng: number;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone?: string;
  occupation?: string;
  department?: string;
  language: string; // 'en' | 'te' | 'hi' | 'ta' | 'kn' | 'ml' | 'mr' | 'bn'
  city: string; // 'NovaCity'
  district?: string;
  preferredArea: string;
  preferredTransport?: string;
  bio?: string;
  notificationPrefs: {
    traffic: boolean;
    weather: boolean;
    pollution: boolean;
    water: boolean;
    electricity: boolean;
    civic: boolean;
    emergency: boolean;
  };
  greenCitizenScore: number; // e.g. 420 pts
  goals: string[];
  role: "citizen" | "authority";
  isEmailVerified: boolean;
  authorizationLevel?: "Lead Administrator" | "Municipal Authority" | "Urban Planner" | "Verified Resident";
  registeredAt?: string;
}

export interface AuthorizedRegistryUser {
  email: string;
  name: string;
  role: "citizen" | "authority";
  authorizationLevel: "Lead Administrator" | "Municipal Authority" | "Urban Planner" | "Verified Resident";
  department: string;
  preferredArea: string;
  phone?: string;
  occupation?: string;
  status: "Active" | "Restricted" | "Pending Verification";
  registeredAt: string;
}

export interface CivicReport {
  id: string;
  title: string;
  description: string;
  category: "Pothole & Road Damage" | "Overflowing Waste Bin" | "Water Pipe Leak / Supply" | "Broken Streetlight" | "Traffic Signal Failure" | "Illegal Dumping" | "Tree / Obstruction";
  severity: "Low" | "Medium" | "High" | "Critical";
  priority: "Low" | "Medium" | "High" | "Critical";
  status: "SUBMITTED" | "AI ANALYZED" | "VERIFIED" | "ASSIGNED" | "IN PROGRESS" | "RESOLVED";
  assignedDepartment: string;
  areaId: string;
  areaName: string;
  lat: number;
  lng: number;
  imageUrl?: string;
  voiceNoteUrl?: string;
  createdAt: string; // ISO or relative
  updatedAt: string;
  upvotesCount: number;
  stillExistsCount: number;
  fixedCount: number;
  duplicateOfId?: string;
  evidenceAttached: boolean;
}

export interface CityAlert {
  id: string;
  category: "Traffic" | "Weather" | "Pollution" | "Water" | "Electricity" | "Infrastructure" | "Emergency";
  severity: "INFO" | "ADVISORY" | "WARNING" | "CRITICAL";
  title: string;
  message: string;
  areaId?: string;
  areaName?: string;
  timestamp: string;
  isMuted?: boolean;
}

export interface WhatIfParams {
  vehiclesPct: number; // 50 to 150
  publicTransportPct: number; // 50 to 200
  renewablePct: number; // 0 to 100
  waterUsagePct: number; // 50 to 150
  recyclingPct: number; // 0 to 100
  greenCoverPct: number; // 0 to 100
  rainfallMm: number; // 0 to 120
}

export interface WhatIfScenario {
  id: string;
  title: string;
  params: WhatIfParams;
  trafficDiffPct: number;
  emissionsDiffPct: number;
  waterDiffPct: number;
  healthScoreDelta: number;
}

export interface TravelRouteOption {
  mode: "car" | "bus" | "walk" | "bike";
  durationMins: number;
  trafficStatus: "Light" | "Moderate" | "Heavy" | "Congested";
  carbonGrams: number;
  cost: string;
  recommendationNote: string;
}

export type DemoScenarioType =
  | "normal"
  | "heavy_traffic"
  | "high_pollution"
  | "water_anomaly"
  | "power_spike"
  | "waste_overflow"
  | "heavy_rain"
  | "flood_risk"
  | "infra_break"
  | "transit_strike"
  | "heatwave"
  | "emergency";

export type DigitalTwinMode = "LIVE" | "PREDICT" | "SIMULATE" | "HISTORY";

export type TimelineHorizon =
  | "now"
  | "+30m"
  | "+1h"
  | "+3h"
  | "+6h"
  | "+12h"
  | "+24h";

export interface CityDNA {
  mobility: number;
  environment: number;
  water: number;
  energy: number;
  safety: number;
  infrastructure: number;
  sustainability: number;
  healthScore: number;
}

export interface ConfidenceFactor {
  label: string;
  pct: number;
  description: string;
}

export interface ConfidenceDetail {
  totalPct: number;
  factors: ConfidenceFactor[];
  risks: string[];
  dataFreshness: string;
  modelReliability: string;
}

export interface CauseEffectFactor {
  name: string;
  observed: string;
  predicted: string;
  contributingFactor: string;
  possibleIntervention: string;
  trend: "up" | "down" | "neutral";
}

export interface CauseEffectDetail {
  metricKey: "traffic" | "aqi" | "flood" | "water" | "energy" | "health";
  title: string;
  whyExplanation: string;
  dataUsed: string[];
  whatCouldChangeIt: string[];
  whatCanBeDone: string[];
  dataStatus: "Observed (IoT Sensors)" | "Simulated Model" | "Predicted (Not Certain)";
  factors: CauseEffectFactor[];
  chain: string[];
}

export interface AgentSignal {
  id: string;
  name: string;
  role: string;
  status: "NORMAL" | "WATCH" | "ELEVATED" | "ALERT";
  keyMetric: string;
  confidence: number;
  finding: string;
  recommendation: string;
  iconName: string;
}

export interface MultiAgentOrchestration {
  timestamp: string;
  orchestratorHeadline: string;
  orchestratorRecommendation: string;
  consensusScore: number;
  agents: AgentSignal[];
}

export interface DecisionOption {
  id: string;
  label: string;
  description: string;
  simulatedOutcome: {
    trafficDiffPct: number;
    delayDiffPct: number;
    citizenImpactDiffPct: number;
    safetyRiskDiffPct: number;
  };
  isAiRecommended?: boolean;
}

export interface DecisionScenario {
  id: string;
  title: string;
  location: string;
  situation: string;
  aiRecommendationId: string;
  aiRationale: string;
  options: DecisionOption[];
}

export interface DecisionLogEntry {
  id: string;
  timestamp: string;
  scenarioTitle: string;
  selectedOptionLabel: string;
  aiRecommendationLabel: string;
  humanChoice: string;
  simulatedResult: string;
  impactSummary: string;
}

export interface SavedWhatIfScenario {
  id: string;
  name: string;
  date: string;
  params: WhatIfParams;
  trafficDiffPct: number;
  aqiDiffPct: number;
  energyDiffPct: number;
  waterDiffPct: number;
  carbonDiffPct: number;
  costEstimate: string;
  sustainabilityScore: number;
  citizenImpactScore: number;
  cityHealthDelta: number;
  summary: string;
  isBest?: boolean;
}

export interface ImpactRadiusData {
  centerName: string;
  lat: number;
  lng: number;
  primaryRadiusMeters: number;
  transitDelayRadiusMeters: number;
  congestionRadiusMeters: number;
  estimatedAffectedAreaKm2: number;
  estimatedSimulatedCitizens: number;
  affectedTrips: number;
  description: string;
}

export interface CityHistoricalPattern {
  id: string;
  title: string;
  dayOfWeek: string;
  timeWindow: string;
  zoneId: CityZoneId;
  zoneName: string;
  recurrenceRatePct: number;
  confidenceScore: number;
  category: "Traffic" | "Drainage" | "Pollution" | "Waste" | "Energy" | "Civic";
  triggerSources: string[]; // ["Historical 52-week traffic", "Weather Radar", "Complaint Clusters", "School Calendar"]
  predictedImpact: string;
  proactivePlaybook: string;
}

export interface TreePlantingLocation {
  id: string;
  rank: number;
  name: string;
  zoneName: string;
  zoneId: CityZoneId;
  heatAnomalyC: number;
  canopyCoverPct: number;
  footfallPerDay: number;
  pm25Level: number;
  shadeDeficitPct: number;
  recommendedSaplingsCount: number;
  recommendedSpecies: string[];
  expectedCoolingDeltaC: number;
  annualCo2CaptureKg: number;
  costEstimate: string;
  feasibilityScore: number;
}

export interface UrbanPlanProposal {
  id: string;
  facilityType: "Hospital" | "School" | "TransitHub" | "Clinic" | "StormwaterPark" | "SolarMicrogrid";
  title: string;
  targetZoneId: CityZoneId;
  targetZoneName: string;
  populationServed: number;
  trafficImpactPct: number;
  environmentalScore: number;
  emergencyAccessibilityDeltaMins: number;
  nearestSimilarDistanceKm: number;
  aiFeasibilityScore: number;
  verdict: "Strongly Recommended" | "Recommended with Mitigation" | "Not Recommended";
  keyBenefits: string[];
  mitigationsRequired: string[];
}

export interface WaterSensorNode {
  id: string;
  type: "tank" | "pipeline" | "sump" | "pump" | "quality";
  name: string;
  zoneName: string;
  status: "NORMAL" | "WARNING" | "CRITICAL" | "STANDBY";
  metricLabel: string;
  metricValue: string;
  numericLevelPct: number;
  anomalyDetected?: string;
  pressurePsi?: number;
  flowRateLps?: number;
  turbidityNtu?: number;
}

export interface WasteBinSensor {
  id: string;
  code: string;
  locationName: string;
  zoneName: string;
  fillPct: number;
  hoursUntilFull: number;
  wasteType: "Dry Recyclable" | "Organic / Wet" | "Mixed Municipal" | "E-Waste";
  priorityLevel: "NORMAL" | "ELEVATED" | "CRITICAL";
  lastEmptiedHoursAgo: number;
}

