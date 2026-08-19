import {
  CityZone,
  DemoScenarioType,
  TimelineHorizon,
  CityDNA,
  CauseEffectDetail,
  MultiAgentOrchestration,
  ConfidenceDetail,
  ImpactRadiusData,
  DecisionScenario,
} from "../types";
import { BASE_NOVACITY_ZONES } from "../data/mockData";

/**
 * Calculates City Health Score and breakdown reasons
 */
export function calculateCityHealthScore(zone: CityZone): {
  score: number;
  breakdown: { label: string; points: number; explanation: string }[];
} {
  let score = 100;
  const breakdown: { label: string; points: number; explanation: string }[] = [];

  // Traffic impact
  if (zone.traffic === "Low") {
    breakdown.push({ label: "Smooth Traffic Flow", points: +3, explanation: "Low vehicle congestion on arterial routes" });
  } else if (zone.traffic === "Moderate") {
    score -= 4;
    breakdown.push({ label: "Moderate Mobility", points: -4, explanation: "Slight delays on primary intersections" });
  } else if (zone.traffic === "High") {
    score -= 10;
    breakdown.push({ label: "Heavy Traffic Congestion", points: -10, explanation: "High vehicle density slowing travel speed" });
  } else if (zone.traffic === "Congested") {
    score -= 18;
    breakdown.push({ label: "Gridlock Traffic Delay", points: -18, explanation: "Critical bottleneck across key corridors" });
  }

  // AQI impact
  if (zone.aqi <= 50) {
    breakdown.push({ label: "Pristine Air Quality", points: +4, explanation: "AQI < 50 with low particulate matter" });
  } else if (zone.aqi <= 100) {
    score -= 3;
    breakdown.push({ label: "Acceptable Air Quality", points: -3, explanation: "Moderate AQI within standard urban limits" });
  } else if (zone.aqi <= 150) {
    score -= 10;
    breakdown.push({ label: "Poor Air Quality", points: -10, explanation: "Elevated PM2.5 concentrations" });
  } else {
    score -= 18;
    breakdown.push({ label: "Severe Pollution Spike", points: -18, explanation: "Hazardous particulate concentration" });
  }

  // Water Status
  if (zone.waterStatus === "Normal") {
    breakdown.push({ label: "Stable Water Supply", points: +2, explanation: "Pressure and purity metrics within baseline" });
  } else if (zone.waterStatus === "Elevated Demand") {
    score -= 4;
    breakdown.push({ label: "High Water Demand", points: -4, explanation: "Consumption spike above 15%" });
  } else if (zone.waterStatus === "Anomaly Leakage") {
    score -= 12;
    breakdown.push({ label: "Grid Leakage Anomaly", points: -12, explanation: "AI flagged unusual +28% pressure drop" });
  } else if (zone.waterStatus === "Reservoir Low") {
    score -= 15;
    breakdown.push({ label: "Reservoir Depletion Alert", points: -15, explanation: "Municipal water reserve below 30%" });
  }

  // Energy & Renewable
  if (zone.renewablePct >= 60) {
    breakdown.push({ label: "High Clean Energy Share", points: +3, explanation: `${zone.renewablePct}% power from renewable grid` });
  }
  if (zone.energyPeakStatus === "Peak Load") {
    score -= 7;
    breakdown.push({ label: "Power Grid Peak Stress", points: -7, explanation: "Electricity demand approaching capacity limit" });
  }

  // Flood Risk
  if (zone.floodRiskPct > 60) {
    score -= 15;
    breakdown.push({ label: "Critical Flood Advisory", points: -15, explanation: `Flood risk at ${zone.floodRiskPct}% due to rainfall` });
  } else if (zone.floodRiskPct > 35) {
    score -= 6;
    breakdown.push({ label: "Elevated Flood Warning", points: -6, explanation: `Drainage capacity under pressure (${zone.floodRiskPct}%)` });
  }

  // Safety Risk
  if (zone.safetyRisk === "Critical") {
    score -= 15;
    breakdown.push({ label: "Critical Incident Active", points: -15, explanation: "Active emergency or major transit breakdown" });
  } else if (zone.safetyRisk === "High Risk") {
    score -= 8;
    breakdown.push({ label: "Safety Hazard Flagged", points: -8, explanation: "Multiple severe road alerts detected" });
  }

  const finalScore = Math.max(18, Math.min(100, score));
  return { score: finalScore, breakdown };
}

/**
 * Computes live state for all city zones based on scenario, timeline horizon, and time of day
 */
export function simulateCityState(
  baseZones: CityZone[] = BASE_NOVACITY_ZONES,
  scenario: DemoScenarioType = "normal",
  currentTime: Date = new Date(),
  horizon: TimelineHorizon = "now"
): CityZone[] {
  // Horizon hours offset
  let hourOffset = 0;
  if (horizon === "+30m") hourOffset = 0.5;
  else if (horizon === "+1h") hourOffset = 1;
  else if (horizon === "+3h") hourOffset = 3;
  else if (horizon === "+6h") hourOffset = 6;
  else if (horizon === "+12h") hourOffset = 12;
  else if (horizon === "+24h") hourOffset = 24;

  const targetDate = new Date(currentTime.getTime() + hourOffset * 3600 * 1000);
  const hours = targetDate.getHours();

  const isMorningPeak = hours >= 7 && hours <= 9;
  const isAfternoonDip = hours >= 12 && hours <= 15;
  const isEveningPeak = hours >= 17 && hours <= 20;

  return baseZones.map((zone) => {
    let updated: CityZone = { ...zone };

    // 1. Time-based baseline traffic adjustments
    if (isMorningPeak || isEveningPeak) {
      if (updated.traffic === "Low") updated.traffic = "Moderate";
      else if (updated.traffic === "Moderate") updated.traffic = "High";
    } else if (isAfternoonDip) {
      if (updated.traffic === "High") updated.traffic = "Moderate";
    }

    // 2. Inter-system physical cascades
    if (updated.rainfallMm > 20) {
      if (updated.traffic === "Moderate") updated.traffic = "High";
      if (updated.traffic === "High") updated.traffic = "Congested";
      updated.floodRiskPct = Math.min(95, updated.floodRiskPct + 30);
    }

    if (updated.traffic === "High" || updated.traffic === "Congested") {
      updated.aqi = Math.min(240, updated.aqi + 15);
      updated.pm25 = Math.min(110, updated.pm25 + 8);
    }

    // 3. Demo Crisis Scenarios with Interdependent Cascades
    switch (scenario) {
      case "heavy_rain":
      case "flood_risk": {
        updated.weather = "Heavy Rain";
        updated.rainfallMm = horizon === "now" ? 65 : horizon === "+30m" ? 82 : horizon === "+1h" ? 95 : horizon === "+3h" ? 110 : 35;
        updated.humidity = 94;
        const isLowland = updated.id === "zone-5" || updated.id === "riverside" || updated.id === "zone-4";
        updated.floodRiskPct = isLowland ? Math.min(96, 70 + (horizon === "+1h" ? 18 : 12)) : 42;
        updated.traffic = isLowland ? "Congested" : "High";
        updated.safetyRisk = isLowland ? "Critical" : "High Risk";
        updated.waterStatus = "Elevated Demand";
        break;
      }

      case "heatwave": {
        updated.weather = "Sunny";
        updated.temp = 41.5;
        updated.humidity = 28;
        updated.rainfallMm = 0;
        updated.energyDemandKw = Math.round(updated.energyDemandKw * 1.6);
        updated.energyPeakStatus = "Peak Load";
        updated.waterConsumptionDiffPct = +34;
        updated.waterStatus = "Elevated Demand";
        updated.safetyRisk = "Moderate Risk";
        break;
      }

      case "heavy_traffic": {
        updated.traffic = "Congested";
        updated.aqi = Math.min(230, updated.aqi + 45);
        updated.pm25 = Math.min(98, updated.pm25 + 24);
        updated.energyPeakStatus = "Peak Load";
        updated.safetyRisk = "Moderate Risk";
        break;
      }

      case "high_pollution": {
        updated.aqi = horizon === "now" ? 188 : horizon === "+1h" ? 215 : 165;
        updated.aqiStatus = "Severe";
        updated.pm25 = 92;
        updated.pm10 = 175;
        updated.safetyRisk = "High Risk";
        break;
      }

      case "water_anomaly": {
        if (updated.id === "zone-5" || updated.id === "central" || updated.id === "riverside") {
          updated.waterStatus = "Anomaly Leakage";
          updated.waterConsumptionDiffPct = +42;
          updated.safetyRisk = "Moderate Risk";
        }
        break;
      }

      case "power_spike": {
        updated.energyPeakStatus = "Peak Load";
        updated.energyDemandKw = Math.round(updated.energyDemandKw * 1.75);
        updated.renewablePct = Math.max(15, updated.renewablePct - 20);
        break;
      }

      case "waste_overflow": {
        updated.wasteLevel = "High Overflow";
        updated.safetyRisk = "Moderate Risk";
        updated.aqi = Math.min(160, updated.aqi + 18);
        break;
      }

      case "transit_strike": {
        // Public transport disruption -> citizens take cars -> traffic spikes + travel delay surges
        updated.traffic = "Congested";
        updated.aqi = Math.min(210, updated.aqi + 35);
        updated.safetyRisk = "High Risk";
        break;
      }

      case "infra_break": {
        // Road infrastructure bridge / signal breakdown
        if (updated.id === "central" || updated.id === "zone-1") {
          updated.traffic = "Congested";
          updated.safetyRisk = "Critical";
          updated.alertCount += 3;
        }
        break;
      }

      case "emergency": {
        updated.safetyRisk = "Critical";
        updated.traffic = "Congested";
        updated.alertCount += 2;
        break;
      }

      case "normal":
      default:
        // Baseline stays stable
        break;
    }

    // Recalculate AQI Status
    if (updated.aqi <= 50) updated.aqiStatus = "Good";
    else if (updated.aqi <= 100) updated.aqiStatus = "Moderate";
    else if (updated.aqi <= 150) updated.aqiStatus = "Poor";
    else if (updated.aqi <= 200) updated.aqiStatus = "Unhealthy";
    else updated.aqiStatus = "Severe";

    // Recalculate City Health Score dynamically
    const { score } = calculateCityHealthScore(updated);
    updated.healthScore = score;

    return updated;
  });
}

/**
 * Calculates City DNA metrics across 7 dimensions (0-100)
 */
export function calculateCityDNA(zones: CityZone[]): CityDNA {
  if (!zones || zones.length === 0) {
    return {
      mobility: 80,
      environment: 85,
      water: 88,
      energy: 82,
      safety: 90,
      infrastructure: 86,
      sustainability: 84,
      healthScore: 85,
    };
  }

  // 1. Mobility
  const avgTrafficVal =
    zones.reduce((sum, z) => {
      const val = z.traffic === "Low" ? 95 : z.traffic === "Moderate" ? 80 : z.traffic === "High" ? 55 : 30;
      return sum + val;
    }, 0) / zones.length;

  // 2. Environment
  const avgAqi = zones.reduce((sum, z) => sum + z.aqi, 0) / zones.length;
  const envVal = Math.max(20, Math.min(100, Math.round(100 - avgAqi * 0.4)));

  // 3. Water
  const avgWaterVal =
    zones.reduce((sum, z) => {
      const val = z.waterStatus === "Normal" ? 92 : z.waterStatus === "Elevated Demand" ? 75 : 45;
      return sum + val;
    }, 0) / zones.length;

  // 4. Energy
  const avgRenewable = zones.reduce((sum, z) => sum + z.renewablePct, 0) / zones.length;
  const energyPeakStress = zones.some((z) => z.energyPeakStatus === "Peak Load") ? -15 : 0;
  const energyVal = Math.max(25, Math.min(100, Math.round(avgRenewable * 0.8 + 40 + energyPeakStress)));

  // 5. Safety
  const avgSafety =
    zones.reduce((sum, z) => {
      const val = z.safetyRisk === "Low Risk" ? 95 : z.safetyRisk === "Moderate Risk" ? 75 : z.safetyRisk === "High Risk" ? 50 : 30;
      return sum + val;
    }, 0) / zones.length;

  // 6. Infrastructure
  const floodImpact = zones.reduce((sum, z) => sum + (z.floodRiskPct > 50 ? 25 : 5), 0) / zones.length;
  const infraVal = Math.max(30, Math.min(100, Math.round(92 - floodImpact)));

  // 7. Sustainability
  const sustVal = Math.round((envVal * 0.4 + energyVal * 0.4 + avgWaterVal * 0.2));

  // Overall Health
  const avgHealth = Math.round(zones.reduce((sum, z) => sum + z.healthScore, 0) / zones.length);

  return {
    mobility: Math.round(avgTrafficVal),
    environment: envVal,
    water: Math.round(avgWaterVal),
    energy: energyVal,
    safety: Math.round(avgSafety),
    infrastructure: infraVal,
    sustainability: sustVal,
    healthScore: avgHealth,
  };
}

/**
 * Generates explainable AI details for the "WHY IS THIS HAPPENING?" cause-effect engine
 */
export function getCauseEffectDetail(
  metricKey: "traffic" | "aqi" | "flood" | "water" | "energy" | "health",
  zone: CityZone,
  scenario: DemoScenarioType = "normal"
): CauseEffectDetail {
  switch (metricKey) {
    case "traffic": {
      const isRain = scenario === "heavy_rain" || zone.rainfallMm > 15;
      return {
        metricKey: "traffic",
        title: "WHY IS TRAFFIC INCREASING?",
        whyExplanation: isRain
          ? `Precipitation (${zone.rainfallMm}mm) has reduced vehicular traction and average corridor speed, causing cascading queue formation across ${zone.name}.`
          : `Commute volume concentration on arterial corridors is outpacing intersection discharge capacity.`,
        dataUsed: ["Road loop sensors (12 sec intervals)", "Rainfall Doppler radar", "Bus GPS telemetry", "Signal phase timings"],
        whatCouldChangeIt: ["Weather clearing", "Transit headway increase", "Smart signal adaptive green waves", "Accident clearance"],
        whatCanBeDone: ["Activate peripheral corridor diversion", "Increase metro frequency (+20%)", "Issue citizen transit advisory"],
        dataStatus: isRain ? "Simulated Model" : "Observed (IoT Sensors)",
        chain: [
          `Rainfall ${zone.rainfallMm}mm ↑`,
          "Road speed -35% ↓",
          "Vehicle density +42% ↑",
          "Corridor congestion ↑",
          "Estimated trip delay +14 mins ↑",
        ],
        factors: [
          {
            name: "Rainfall & Road Surface",
            observed: `${zone.rainfallMm} mm`,
            predicted: `${Math.round(zone.rainfallMm * 1.2)} mm (+1h)`,
            contributingFactor: "Reduces tire traction & safe braking distance by 40%",
            possibleIntervention: "Dynamic VMS speed limits & road de-icing/drainage pumps",
            trend: "up",
          },
          {
            name: "Intersection Throughput",
            observed: "1,140 vehicles/hr",
            predicted: "890 vehicles/hr",
            contributingFactor: "Signal cycle saturated on North-South arterial route",
            possibleIntervention: "AI adaptive green wave signal timing extension (+18s)",
            trend: "down",
          },
          {
            name: "Public Transport Modal Share",
            observed: "41% transit share",
            predicted: "48% with diversion",
            contributingFactor: "Commuters shifting to personal vehicles due to weather",
            possibleIntervention: "Deploy 4 feeder shuttle buses to Riverside Metro",
            trend: "down",
          },
        ],
      };
    }

    case "aqi": {
      return {
        metricKey: "aqi",
        title: "WHY IS AIR QUALITY DETERIORATING?",
        whyExplanation: `Concentration of PM2.5 (${zone.pm25} µg/m³) is driven by trapped vehicular idle emissions under low atmospheric wind dispersion.`,
        dataUsed: ["EPA micro-sensor particulate mesh", "Anemometer wind velocity", "Traffic idling detector", "Industrial chimney telemetry"],
        whatCouldChangeIt: ["Wind speed acceleration", "Precipitation washing particulates", "Traffic congestion clearance", "Industrial idle limits"],
        whatCanBeDone: ["Deploy urban misting cannons", "Reroute heavy diesel freight vehicles", "Send clean commute alerts to sensitive groups"],
        dataStatus: zone.aqi > 150 ? "Simulated Model" : "Observed (IoT Sensors)",
        chain: [
          "Traffic idling emissions ↑",
          "Wind velocity < 4 km/h ↓",
          "Boundary layer inversion traps smoke",
          `PM2.5 particulate concentration (${zone.pm25} µg/m³) ↑`,
          `AQI reached ${zone.aqi} (${zone.aqiStatus})`,
        ],
        factors: [
          {
            name: "Vehicular Tailpipe Idling",
            observed: "High idling density",
            predicted: "Rising with congestion",
            contributingFactor: "Accounts for 58% of local PM2.5 in central corridor",
            possibleIntervention: "Implement low-emission transit priority corridors",
            trend: "up",
          },
          {
            name: "Wind Speed & Dispersion",
            observed: "3.2 km/h (Calm)",
            predicted: "5.1 km/h in 3 hours",
            contributingFactor: "Low dispersion traps particulates in street canyons",
            possibleIntervention: "Activate rooftop mist dispensers in high-exposure plazas",
            trend: "down",
          },
          {
            name: "Industrial Background Load",
            observed: "45 µg/m³ base",
            predicted: "Stable",
            contributingFactor: "East Industrial zone stack emissions drifting westward",
            possibleIntervention: "Issue off-peak load shifting directive to factories",
            trend: "neutral",
          },
        ],
      };
    }

    case "flood": {
      return {
        metricKey: "flood",
        title: "WHY IS FLOOD RISK ELEVATED?",
        whyExplanation: `Precipitation rate (${zone.rainfallMm}mm) exceeds stormwater drainage absorption rate in lower topography basins of ${zone.name}.`,
        dataUsed: ["Ultrasonic culvert water level gauges", "Elevation digital elevation model (DEM)", "Soil moisture sensors", "Storm drain telemetry"],
        whatCouldChangeIt: ["Rainfall cessation", "Storm gate automated opening", "Retention basin pump deployment"],
        whatCanBeDone: ["Engage secondary sump pump stations", "Pre-position road barriers at low underpasses", "Notify emergency services"],
        dataStatus: "Predicted (Not Certain)",
        chain: [
          `Precipitation ${zone.rainfallMm} mm/hr ↑`,
          "Storm culvert capacity at 88% ↑",
          "Low elevation runoff pooling ↑",
          `Flood probability calculated at ${zone.floodRiskPct}%`,
          "Underpass road closure alert triggered",
        ],
        factors: [
          {
            name: "Precipitation Inflow",
            observed: `${zone.rainfallMm} mm`,
            predicted: `${Math.round(zone.rainfallMm * 1.3)} mm`,
            contributingFactor: "Sustained convective storm cell over catchment basin",
            possibleIntervention: "Open overflow retention gates to River Nova",
            trend: "up",
          },
          {
            name: "Culvert Discharge Rate",
            observed: "14.2 m³/s",
            predicted: "Capacity ceiling 16 m³/s",
            contributingFactor: "Debris grating partially clogged at Sector 4 outflow",
            possibleIntervention: "Dispatch rapid municipal maintenance team to clear grating",
            trend: "up",
          },
        ],
      };
    }

    case "water": {
      return {
        metricKey: "water",
        title: "WHY IS WATER CONSUMPTION / LEAKAGE FLAGGED?",
        whyExplanation: `Flow acoustic sensors detected a ${zone.waterConsumptionDiffPct > 0 ? "+" + zone.waterConsumptionDiffPct + "%" : "-5%"} variance in pressure vs baseline historical consumption.`,
        dataUsed: ["Smart ultrasonic flow meters", "Acoustic line leak detectors", "Reservoir pressure transponders"],
        whatCouldChangeIt: ["Valve pressure regulation", "Rapid pipe segment repair", "Citizen conservation advisory"],
        whatCanBeDone: ["Throttle secondary distribution pressure by 15%", "Isolate sub-zone valve node 4B", "Dispatch leak detection squad"],
        dataStatus: "Observed (IoT Sensors)",
        chain: [
          "Nighttime flow velocity failed to drop",
          "Pressure drop of 1.4 Bar detected",
          `Flow difference of ${zone.waterConsumptionDiffPct}% calculated`,
          "AI classifies anomaly as sub-surface pipe rupture",
        ],
        factors: [
          {
            name: "Line Pressure Gradient",
            observed: "3.2 Bar (Expected 4.6 Bar)",
            predicted: "Continued drop without isolation",
            contributingFactor: "Subsurface fissure in 250mm cast iron main line",
            possibleIntervention: "Close smart isolation valve 4B via SCADA",
            trend: "down",
          },
        ],
      };
    }

    case "energy": {
      return {
        metricKey: "energy",
        title: "WHY IS ENERGY DEMAND PEAKING?",
        whyExplanation: `Current demand (${zone.energyDemandKw} kW) is elevated due to concurrent HVAC cooling and industrial shift overlaps.`,
        dataUsed: ["Substation smart meters", "Solar rooftop inverters", "Commercial chiller telemetries"],
        whatCouldChangeIt: ["Temperature drop", "Industrial load shedding", "Battery storage discharge"],
        whatCanBeDone: ["Discharge 120 kWh community battery storage", "Trigger smart thermostat peak shaving", "Increase solar grid priority"],
        dataStatus: "Observed (IoT Sensors)",
        chain: [
          `Ambient temperature at ${zone.temp}°C ↑`,
          "Cooling appliance demand surge +35% ↑",
          `Substation load at ${zone.energyDemandKw} kW`,
          "Grid stability status: " + zone.energyPeakStatus,
        ],
        factors: [
          {
            name: "HVAC Cooling Load",
            observed: "62% of district draw",
            predicted: "Peaking at 15:30",
            contributingFactor: "High solar heat gain on commercial glass facades",
            possibleIntervention: "Automate dynamic setpoint adjustment (+1.5°C)",
            trend: "up",
          },
        ],
      };
    }

    case "health":
    default: {
      return {
        metricKey: "health",
        title: "WHY IS CITY HEALTH SCORE AT " + zone.healthScore + "/100?",
        whyExplanation: `The composite health score synthesizes mobility flow, air purity, drainage readiness, grid reliability, and safety across ${zone.name}.`,
        dataUsed: ["All 9 multi-agent telemetry streams", "Historical baseline model", "Active civic reports"],
        whatCouldChangeIt: ["Targeted interventions in lowest scoring sub-systems", "Weather transition", "Traffic diversion"],
        whatCanBeDone: ["Execute combined response playbook", "Resolve highest priority civic issues"],
        dataStatus: "Simulated Model",
        chain: [
          `Traffic: ${zone.traffic}`,
          `AQI: ${zone.aqi} (${zone.aqiStatus})`,
          `Water: ${zone.waterStatus}`,
          `Energy: ${zone.energyPeakStatus}`,
          `Overall Score: ${zone.healthScore}/100`,
        ],
        factors: [
          {
            name: "Mobility Contribution",
            observed: zone.traffic,
            predicted: zone.traffic === "Congested" ? "Improving in 45m" : "Stable",
            contributingFactor: "Directly impacts citizen travel time and tailpipe emissions",
            possibleIntervention: "Adaptive traffic routing",
            trend: zone.traffic === "Low" ? "up" : "down",
          },
          {
            name: "Environment Contribution",
            observed: `AQI ${zone.aqi}`,
            predicted: "PM2.5 tracking weather",
            contributingFactor: "Impacts respiratory health and outdoor safety",
            possibleIntervention: "Green zone buffers & misting",
            trend: zone.aqi < 75 ? "up" : "down",
          },
        ],
      };
    }
  }
}

/**
 * Computes Multi-Agent Signals from the 9 specialized simulated AI modules
 */
export function getMultiAgentOrchestration(
  zone: CityZone,
  scenario: DemoScenarioType = "normal",
  horizon: TimelineHorizon = "now"
): MultiAgentOrchestration {
  const isRain = scenario === "heavy_rain" || zone.rainfallMm > 20;
  const isTraffic = scenario === "heavy_traffic" || zone.traffic === "Congested";
  const isPollution = scenario === "high_pollution" || zone.aqi > 140;

  return {
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    orchestratorHeadline: isRain
      ? "Coordinated Severe Weather & Lowland Flood Response Active"
      : isTraffic
      ? "Multi-Corridor Congestion Relief Directive Recommended"
      : isPollution
      ? "Industrial Particulate Containment Protocol Recommended"
      : "City Systems Synchronized in Equilibrium State",
    orchestratorRecommendation: isRain
      ? "Deploy drainage pumps in Zone 5, reroute arterial buses to high ground, and alert low-lying residents."
      : isTraffic
      ? "Extend green light phases by 22s on East Boulevard and increase Metro frequency to 4-min intervals."
      : "Maintain baseline monitoring; all 9 urban life-support systems operating within safety margins.",
    consensusScore: isRain ? 94 : isTraffic ? 89 : 96,
    agents: [
      {
        id: "mobility-ai",
        name: "MOBILITY AI",
        role: "Traffic Flow & Corridors",
        status: isTraffic || isRain ? "ALERT" : zone.traffic === "High" ? "ELEVATED" : "NORMAL",
        keyMetric: `Density: ${zone.traffic}`,
        confidence: 91,
        finding: isTraffic ? "Corridor congestion index reached 84% capacity." : "Traffic velocity stable across arteries.",
        recommendation: "Increase public transit headway and activate diversion route 4.",
        iconName: "Car",
      },
      {
        id: "weather-ai",
        name: "WEATHER AI",
        role: "Atmospheric & Radar",
        status: isRain ? "ALERT" : "NORMAL",
        keyMetric: `Rain: ${zone.rainfallMm} mm`,
        confidence: 88,
        finding: isRain ? `Storm cell generating ${zone.rainfallMm}mm precipitation.` : "Atmospheric pressure steady at 1014 hPa.",
        recommendation: "Maintain storm tracking; predict peak intensity within 45 mins.",
        iconName: "CloudRain",
      },
      {
        id: "environment-ai",
        name: "ENVIRONMENT AI",
        role: "Air Quality & Particulates",
        status: isPollution ? "ALERT" : zone.aqi > 100 ? "ELEVATED" : "NORMAL",
        keyMetric: `AQI: ${zone.aqi}`,
        confidence: 86,
        finding: `PM2.5 recorded at ${zone.pm25} µg/m³ (${zone.aqiStatus}).`,
        recommendation: "Activate plaza mist dispensers and encourage N95 mask usage for seniors.",
        iconName: "Wind",
      },
      {
        id: "water-ai",
        name: "WATER AI",
        role: "Aqueduct & Drainage Grid",
        status: zone.waterStatus === "Anomaly Leakage" ? "ALERT" : isRain ? "ELEVATED" : "NORMAL",
        keyMetric: `Status: ${zone.waterStatus}`,
        confidence: 94,
        finding: zone.waterStatus === "Anomaly Leakage" ? "Acoustic leak detected: +38% flow variance." : "Reservoir pressure 4.2 Bar normal.",
        recommendation: "Isolate sub-zone valve node 4B to halt municipal loss.",
        iconName: "Droplets",
      },
      {
        id: "energy-ai",
        name: "ENERGY AI",
        role: "Power Grid & Renewables",
        status: zone.energyPeakStatus === "Peak Load" ? "ELEVATED" : "NORMAL",
        keyMetric: `Draw: ${zone.energyDemandKw} kW`,
        confidence: 92,
        finding: `${zone.renewablePct}% clean energy supply with load status at ${zone.energyPeakStatus}.`,
        recommendation: "Discharge 120 kWh community battery storage during peak 18:00 window.",
        iconName: "Zap",
      },
      {
        id: "waste-ai",
        name: "WASTE AI",
        role: "Sanitation & Circularity",
        status: zone.wasteLevel === "High Overflow" ? "ALERT" : "NORMAL",
        keyMetric: `Fill: ${zone.wasteLevel}`,
        confidence: 89,
        finding: "Smart bin sensor fill levels at 42% average across monitored sectors.",
        recommendation: "Dispatch dynamic route waste truck to commercial sector bins.",
        iconName: "Trash2",
      },
      {
        id: "safety-ai",
        name: "SAFETY AI",
        role: "Emergency & Hazard Response",
        status: zone.safetyRisk === "Critical" ? "ALERT" : zone.safetyRisk === "High Risk" ? "ELEVATED" : "NORMAL",
        keyMetric: `Risk: ${zone.safetyRisk}`,
        confidence: 95,
        finding: `Civic incidents active: ${zone.alertCount}. Response readiness index: 96%.`,
        recommendation: "Pre-position rapid response unit near Central underpass.",
        iconName: "ShieldAlert",
      },
      {
        id: "infra-ai",
        name: "INFRASTRUCTURE AI",
        role: "Roads, Bridges & Structures",
        status: zone.floodRiskPct > 50 ? "ELEVATED" : "NORMAL",
        keyMetric: `Flood Risk: ${zone.floodRiskPct}%`,
        confidence: 87,
        finding: "Bridge strain and road surface integrity sensors reading nominal.",
        recommendation: "Inspect culvert drainage grates in low-lying sector.",
        iconName: "Building2",
      },
      {
        id: "sustainability-ai",
        name: "SUSTAINABILITY AI",
        role: "Carbon & Green Metrics",
        status: "NORMAL",
        keyMetric: "Green: 88/100",
        confidence: 90,
        finding: "Citywide carbon footprint on target for -8% weekly emissions reduction.",
        recommendation: "Encourage EV charging during maximum midday solar peak.",
        iconName: "Leaf",
      },
    ],
  };
}

/**
 * Computes AI Confidence Factor Breakdown for "WHY 84%?"
 */
export function getConfidenceBreakdown(
  zone: CityZone,
  scenario: DemoScenarioType = "normal",
  horizon: TimelineHorizon = "now"
): ConfidenceDetail {
  let totalPct = 86;
  if (scenario === "heavy_rain" || scenario === "flood_risk") totalPct = 81;
  else if (scenario === "heavy_traffic") totalPct = 84;
  else if (scenario === "high_pollution") totalPct = 88;

  if (horizon === "+3h") totalPct -= 6;
  if (horizon === "+6h") totalPct -= 11;
  if (horizon === "+12h") totalPct -= 18;
  if (horizon === "+24h") totalPct -= 24;

  return {
    totalPct: Math.max(52, totalPct),
    factors: [
      {
        label: "Historical Patterns & Seasonal Trends",
        pct: 32,
        description: "5 years of synchronized hourly telemetry matching current calendar parameters.",
      },
      {
        label: "Live IoT Sensor Observations",
        pct: 25,
        description: "High-density road, AQI, and flow sensors actively transmitting with <100ms latency.",
      },
      {
        label: "Traffic & Transit Telemetry",
        pct: 18,
        description: "Automated vehicle locator (AVL) GPS pings from municipal buses and probe vehicles.",
      },
      {
        label: "Weather Radar & Doppler Accuracy",
        pct: 9,
        description: "National Meteorological Doppler feed with 1 km² resolution grid.",
      },
    ],
    risks: [
      "Limited private vehicle crowd-sourced telemetry in peripheral residential zones.",
      "Sudden micro-climate convective cloud burst variations not fully captured by satellite.",
      "Unreported ad-hoc construction lane closures.",
    ],
    dataFreshness: "Refreshed 12 seconds ago across 428 edge nodes",
    modelReliability: "Calibrated deterministic multi-agent physics engine v4.2",
  };
}

/**
 * Computes Impact Radius and Affected Citizens estimation
 */
export function getImpactRadius(scenario: DemoScenarioType, zone: CityZone): ImpactRadiusData {
  if (scenario === "heavy_rain" || scenario === "flood_risk") {
    return {
      centerName: "Zone 5 / Riverside Lowlands",
      lat: zone.lat,
      lng: zone.lng,
      primaryRadiusMeters: 650,
      transitDelayRadiusMeters: 1400,
      congestionRadiusMeters: 2600,
      estimatedAffectedAreaKm2: 4.8,
      estimatedSimulatedCitizens: 24500,
      affectedTrips: 12400,
      description: "Severe stormwater accumulation impacting low-elevation corridors, underpasses, and Riverside transit hub.",
    };
  }

  if (scenario === "heavy_traffic") {
    return {
      centerName: "Central Arterial Interchange",
      lat: zone.lat,
      lng: zone.lng,
      primaryRadiusMeters: 500,
      transitDelayRadiusMeters: 1200,
      congestionRadiusMeters: 2200,
      estimatedAffectedAreaKm2: 3.2,
      estimatedSimulatedCitizens: 18200,
      affectedTrips: 9600,
      description: "Gridlock bottleneck propagating backward along North-South expressway corridors.",
    };
  }

  // Default / Baseline incident
  return {
    centerName: `${zone.name} Core`,
    lat: zone.lat,
    lng: zone.lng,
    primaryRadiusMeters: 400,
    transitDelayRadiusMeters: 900,
    congestionRadiusMeters: 1600,
    estimatedAffectedAreaKm2: 1.8,
    estimatedSimulatedCitizens: 8400,
    affectedTrips: 4200,
    description: "Standard operational radius for routine mobility and environmental monitoring.",
  };
}

/**
 * Pre-defined Decision Scenarios for "WHAT WOULD YOU DO?"
 */
export function getDecisionScenario(scenario: DemoScenarioType, zone: CityZone): DecisionScenario {
  if (scenario === "heavy_rain" || scenario === "flood_risk") {
    return {
      id: "dec-flood",
      title: "FLOOD RISK PREDICTED IN RIVERSIDE & LOWLANDS",
      location: `${zone.name} & Zone 5 Drainage Basin`,
      situation: "Heavy downpour (85mm) is threatening to submerge the main underpass in 35 minutes, impacting 12,400 evening commuters.",
      aiRecommendationId: "opt-combined",
      aiRationale: "Combining traffic diversion with transit fare waiver and emergency pump dispatch minimizes citizen delay and safety risk simultaneously.",
      options: [
        {
          id: "opt-nothing",
          label: "OPTION A: Do Nothing",
          description: "Allow natural vehicle flow; let drivers navigate standing water individually.",
          simulatedOutcome: {
            trafficDiffPct: +24,
            delayDiffPct: +38,
            citizenImpactDiffPct: +45,
            safetyRiskDiffPct: +50,
          },
        },
        {
          id: "opt-divert",
          label: "OPTION B: Traffic Diversion Only",
          description: "Reroute private cars away from underpass onto North Boulevard.",
          simulatedOutcome: {
            trafficDiffPct: -6,
            delayDiffPct: +12,
            citizenImpactDiffPct: -8,
            safetyRiskDiffPct: -18,
          },
        },
        {
          id: "opt-transit",
          label: "OPTION C: Increase Public Transport",
          description: "Deploy 8 express electric shuttle buses connecting to elevated Metro Line 1.",
          simulatedOutcome: {
            trafficDiffPct: -9,
            delayDiffPct: -5,
            citizenImpactDiffPct: -14,
            safetyRiskDiffPct: -10,
          },
        },
        {
          id: "opt-advisory",
          label: "OPTION D: Issue Citizen Advisory",
          description: "Send push alerts advising citizens to postpone non-essential travel by 60 minutes.",
          simulatedOutcome: {
            trafficDiffPct: -11,
            delayDiffPct: -6,
            citizenImpactDiffPct: -16,
            safetyRiskDiffPct: -22,
          },
        },
        {
          id: "opt-combined",
          label: "OPTION E: Combined Response Playbook (AI Recommended)",
          description: "Simultaneously divert underpass traffic, surge Metro frequency, engage storm pumps, and push civic advisories.",
          simulatedOutcome: {
            trafficDiffPct: -18,
            delayDiffPct: -14,
            citizenImpactDiffPct: -28,
            safetyRiskDiffPct: -36,
          },
          isAiRecommended: true,
        },
      ],
    };
  }

  // Default Heavy Traffic Scenario
  return {
    id: "dec-traffic",
    title: "CORRIDOR CONGESTION SURGE PREDICTED",
    location: `${zone.name} Arterial Intersection`,
    situation: "Evening peak commute volume is exceeding road capacity by 34%, creating a 22-minute travel delay across 18,000 trips.",
    aiRecommendationId: "opt-combined",
    aiRationale: "Adaptive signal green-wave extensions coupled with park-and-ride shuttle subsidies yield the most rapid congestion dissipation.",
    options: [
      {
        id: "opt-nothing",
        label: "OPTION A: Maintain Standard Signal Timings",
        description: "Allow fixed 60-second cycle timers to operate without modification.",
        simulatedOutcome: {
          trafficDiffPct: +18,
          delayDiffPct: +26,
          citizenImpactDiffPct: +22,
          safetyRiskDiffPct: +8,
        },
      },
      {
        id: "opt-signals",
        label: "OPTION B: Extend Green-Wave Signals (+20s)",
        description: "Dynamically prioritize heavy flow direction along Central Avenue.",
        simulatedOutcome: {
          trafficDiffPct: -10,
          delayDiffPct: -12,
          citizenImpactDiffPct: -9,
          safetyRiskDiffPct: -4,
        },
      },
      {
        id: "opt-transit",
        label: "OPTION C: Metro Frequency Surge",
        description: "Decrease train headway from 7 mins to 3.5 mins to absorb corridor demand.",
        simulatedOutcome: {
          trafficDiffPct: -14,
          delayDiffPct: -11,
          citizenImpactDiffPct: -18,
          safetyRiskDiffPct: -6,
        },
      },
      {
        id: "opt-advisory",
        label: "OPTION D: Micro-Navigation Diversion",
        description: "Push recommended bypass route alerts through mobile navigation apps.",
        simulatedOutcome: {
          trafficDiffPct: -8,
          delayDiffPct: -5,
          citizenImpactDiffPct: -7,
          safetyRiskDiffPct: -2,
        },
      },
      {
        id: "opt-combined",
        label: "OPTION E: Smart Adaptive Orchestration (AI Recommended)",
        description: "Synchronize adaptive green signals, surge metro trains, and deploy parking shuttle incentives.",
        simulatedOutcome: {
          trafficDiffPct: -22,
          delayDiffPct: -19,
          citizenImpactDiffPct: -26,
          safetyRiskDiffPct: -12,
        },
        isAiRecommended: true,
      },
    ],
  };
}
