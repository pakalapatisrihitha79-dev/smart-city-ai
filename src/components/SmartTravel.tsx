import React, { useState, useMemo, useEffect } from "react";
import { useCity } from "../context/CityContext";
import {
  Navigation,
  Car,
  Bus,
  Footprints,
  Bike,
  Clock,
  Leaf,
  AlertTriangle,
  MapPin,
  ArrowRight,
  ArrowUpDown,
  Sparkles,
  Zap,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronRight,
  ChevronDown,
  Info,
  TrendingDown,
  Timer,
  Fuel,
  Flame,
  Volume2,
  Share2,
  Bookmark,
  Bell,
  Sliders,
  Compass,
  Train,
  CircleDot,
  Radio,
  ExternalLink,
  ShieldCheck,
  Award,
} from "lucide-react";

interface RouteStep {
  instruction: string;
  subText: string;
  distance: string;
  duration: string;
  mode: "walk" | "bus" | "metro" | "bike" | "car";
  lineName?: string;
  lineColor?: string;
  liveStatus?: string;
  stopsCount?: number;
  crowdLevel?: "Low" | "Moderate" | "Crowded";
}

interface DetailedTravelOption {
  id: string;
  mode: "metro_feeder" | "electric_bus" | "car_cab" | "bike_ebike" | "walking" | "multimodal_fast";
  title: string;
  badge?: string;
  badgeColor?: string;
  durationMins: number;
  departureTime: string;
  arrivalTime: string;
  distanceKm: number;
  co2Grams: number;
  co2SavedGrams: number;
  cost: string;
  caloriesBurned?: number;
  reliabilityScore: number; // 0-100%
  trafficCondition: "Smooth" | "Moderate" | "Congested" | "Dedicated Lane";
  recommendedFor: string;
  steps: RouteStep[];
  highlights: string[];
}

export const SmartTravel: React.FC = () => {
  const { currentZone, allZones: zones = [], t, translateEntity, demoScenario } = useCity();

  // Route Planning Inputs
  const [originZoneId, setOriginZoneId] = useState<string>(currentZone?.id || "central");
  const [destinationZoneId, setDestinationZoneId] = useState<string>("university");
  const [customDestination, setCustomDestination] = useState<string>("");
  const [isCustomDest, setIsCustomDest] = useState<boolean>(false);
  const [departureTime, setDepartureTime] = useState<string>("08:30");
  const [timeMode, setTimeMode] = useState<"depart" | "arrive">("depart");
  const [travelDate, setTravelDate] = useState<"today" | "tomorrow" | "weekend">("today");
  const [priorityFilter, setPriorityFilter] = useState<"all" | "fastest" | "greenest" | "cheapest" | "accessible">("all");
  
  // Selected Route Details State
  const [selectedRouteId, setSelectedRouteId] = useState<string>("metro_feeder");
  const [isNavigating, setIsNavigating] = useState<boolean>(false);
  const [navProgress, setNavProgress] = useState<number>(0);
  const [alertSaved, setAlertSaved] = useState<boolean>(false);
  const [favoriteSaved, setFavoriteSaved] = useState<boolean>(false);
  const [showDepartureCurve, setShowDepartureCurve] = useState<boolean>(true);

  // Sync origin with current zone when it changes if user hasn't explicitly diverged
  useEffect(() => {
    if (!originZoneId && currentZone?.id) {
      setOriginZoneId(currentZone.id);
    }
  }, [currentZone?.id]);

  const originZone = useMemo(() => {
    return (zones || []).find((z) => z.id === originZoneId) || currentZone || (zones && zones[0]);
  }, [zones, originZoneId, currentZone]);

  const destZone = useMemo(() => {
    if (isCustomDest && customDestination.trim()) {
      return {
        id: "custom_dest",
        name: customDestination,
        type: "Custom City Location",
        traffic: "Moderate" as const,
        aqi: 55,
        lat: (originZone?.lat || 17.44) + 0.035,
        lng: (originZone?.lng || 78.38) + 0.042,
      };
    }
    return (zones || []).find((z) => z.id === destinationZoneId) || (zones || []).find((z) => z.id !== originZone?.id) || zones[0] || originZone;
  }, [zones, destinationZoneId, isCustomDest, customDestination, originZone]);

  // Calculate approximate straight-line and road distance (km)
  const tripDistanceKm = useMemo(() => {
    if (!originZone || !destZone) return 4.2;
    const dLat = ((destZone.lat ?? 17.45) - (originZone.lat ?? 17.44)) * 111;
    const dLng = ((destZone.lng ?? 78.39) - (originZone.lng ?? 78.38)) * 102;
    const straightLine = Math.sqrt(dLat * dLat + dLng * dLng);
    const roadFactor = 1.35; // City street grid detour factor
    return Math.max(1.8, Math.round(straightLine * roadFactor * 10) / 10);
  }, [originZone, destZone]);

  // Check scenario traffic impact
  const isTrafficSpike = originZone?.traffic === "High" || originZone?.traffic === "Congested" || demoScenario === "heavy_traffic";
  const isHeavyRain = originZone?.weather === "Heavy Rain" || originZone?.weather === "Thunderstorm" || demoScenario === "heavy_rain";

  // Parse departure time to helper calculation
  const parseTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return (hours || 8) * 60 + (minutes || 30);
  };

  const formatMinutesToTime = (totalMinutes: number) => {
    const normalized = (totalMinutes % 1440 + 1440) % 1440;
    const h = Math.floor(normalized / 60);
    const m = Math.floor(normalized % 60);
    const period = h >= 12 ? "PM" : "AM";
    const displayH = h % 12 === 0 ? 12 : h % 12;
    return `${displayH.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")} ${period}`;
  };

  // Generate dynamic multi-modal options with exact timing and steps
  const travelOptions: DetailedTravelOption[] = useMemo(() => {
    const depMinutes = parseTime(departureTime);

    // Weather & Traffic multipliers
    const trafficMultiplier = isTrafficSpike ? 1.55 : 1.0;
    const rainCarMultiplier = isHeavyRain ? 1.3 : 1.0;
    const rainTransitMultiplier = isHeavyRain ? 1.08 : 1.0;

    // 1. Metro + Feeder (Fastest & Reliable)
    const metroBaseMins = Math.round(tripDistanceKm * 2.2 + 8);
    const metroDuration = Math.round(metroBaseMins * rainTransitMultiplier);
    const metroArrival = formatMinutesToTime(depMinutes + metroDuration);

    // 2. Rapid Electric Bus (BRT 104X)
    const busBaseMins = Math.round(tripDistanceKm * 3.1 + 6);
    const busDuration = Math.round(busBaseMins * (isTrafficSpike ? 1.15 : 1.0)); // BRT has dedicated lanes
    const busArrival = formatMinutesToTime(depMinutes + busDuration);

    // 3. Private Car / Cab / Taxi
    const carSpeedKmh = isTrafficSpike ? 18 : 38;
    const carBaseMins = Math.round((tripDistanceKm / carSpeedKmh) * 60 + 5);
    const carDuration = Math.round(carBaseMins * trafficMultiplier * rainCarMultiplier);
    const carArrival = formatMinutesToTime(depMinutes + carDuration);

    // 4. Shared Cycle / E-Bike
    const bikeSpeedKmh = 16;
    const bikeBaseMins = Math.round((tripDistanceKm / bikeSpeedKmh) * 60);
    const bikeDuration = Math.max(12, bikeBaseMins);
    const bikeArrival = formatMinutesToTime(depMinutes + bikeDuration);

    // 5. Walking Greenways
    const walkSpeedKmh = 4.6;
    const walkBaseMins = Math.round((tripDistanceKm / walkSpeedKmh) * 60);
    const walkDuration = Math.max(15, walkBaseMins);
    const walkArrival = formatMinutesToTime(depMinutes + walkDuration);

    // 6. Multimodal Eco-Fast (E-Bike to Metro Line)
    const multiDuration = Math.round(metroDuration * 0.85);
    const multiArrival = formatMinutesToTime(depMinutes + multiDuration);

    const carCo2 = Math.round(tripDistanceKm * 145);
    const busCo2 = Math.round(tripDistanceKm * 28);
    const metroCo2 = Math.round(tripDistanceKm * 18);

    const originName = originZone?.name || "Current Location";
    const destName = destZone?.name || "Target Destination";

    return [
      {
        id: "metro_feeder",
        mode: "metro_feeder",
        title: "Metro Blue Line + Eco Shuttle",
        badge: "AI RECOMMENDED • FASTEST",
        badgeColor: "bg-teal-500/20 text-teal-300 border-teal-500/40",
        durationMins: metroDuration,
        departureTime: formatMinutesToTime(depMinutes),
        arrivalTime: metroArrival,
        distanceKm: tripDistanceKm,
        co2Grams: metroCo2,
        co2SavedGrams: carCo2 - metroCo2,
        cost: "₹25 ($0.30)",
        reliabilityScore: 97,
        trafficCondition: "Dedicated Lane",
        recommendedFor: "Predictable ETA, Zero Traffic Delays & Low Emissions",
        highlights: ["100% On-time schedule", "High-frequency (every 4 min)", "Air Conditioned Cabin", "Integrated Contactless Payment"],
        steps: [
          {
            instruction: `Walk from ${originName} to Metro Station Gate 2`,
            subText: "Head towards the North Boulevard pedestrian skywalk",
            distance: "320 m",
            duration: "4 mins",
            mode: "walk",
          },
          {
            instruction: "Board Metro Blue Line (M-2 Express)",
            subText: `Platform 1 towards ${destName} Corridor • Train #204`,
            distance: `${Math.round((tripDistanceKm - 1.2) * 10) / 10} km`,
            duration: `${metroDuration - 10} mins`,
            mode: "metro",
            lineName: "Blue Line M-2",
            lineColor: "bg-blue-500",
            liveStatus: "Next Train in 2 mins • 44% Seating Available",
            stopsCount: Math.max(3, Math.round(tripDistanceKm / 1.8)),
            crowdLevel: "Low",
          },
          {
            instruction: `Alight at ${destName} Central Station`,
            subText: "Follow Exit C towards Ground Transit Hub",
            distance: "80 m",
            duration: "2 mins",
            mode: "walk",
          },
          {
            instruction: "Board Electric Feeder Shuttle EF-4",
            subText: `Direct autonomous link to ${destName} Campus entrance`,
            distance: "800 m",
            duration: "4 mins",
            mode: "bus",
            lineName: "Feeder EF-4",
            lineColor: "bg-emerald-500",
            liveStatus: "Departing in 1 min",
          },
          {
            instruction: `Arrive at destination: ${destName}`,
            subText: "Trip completed on schedule",
            distance: "0 m",
            duration: "0 min",
            mode: "walk",
          },
        ],
      },
      {
        id: "electric_bus",
        mode: "electric_bus",
        title: "Nova BRT Electric Express (Bus 104X)",
        badge: "BUDGET OPTIMAL",
        badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
        durationMins: busDuration,
        departureTime: formatMinutesToTime(depMinutes),
        arrivalTime: busArrival,
        distanceKm: Math.round(tripDistanceKm * 1.05 * 10) / 10,
        co2Grams: busCo2,
        co2SavedGrams: carCo2 - busCo2,
        cost: "₹15 ($0.18)",
        reliabilityScore: 91,
        trafficCondition: "Dedicated Lane",
        recommendedFor: "Direct route without interchange transfers",
        highlights: ["Dedicated BRT Transit Lane", "Low Floor Accessible Bus", "Live GPS Telemetry", "Electric Zero Tailpipe Emission"],
        steps: [
          {
            instruction: `Walk to ${originName} BRT Stop A`,
            subText: "Opposite to the Central Smart Plaza",
            distance: "180 m",
            duration: "2 mins",
            mode: "walk",
          },
          {
            instruction: "Board Bus 104X (Electric BRT Express)",
            subText: `Direct express route towards ${destName}`,
            distance: `${tripDistanceKm} km`,
            duration: `${busDuration - 4} mins`,
            mode: "bus",
            lineName: "Route 104X",
            lineColor: "bg-emerald-500",
            liveStatus: "Approaching stop in 3 mins • 18 Seats Open",
            stopsCount: 6,
            crowdLevel: "Moderate",
          },
          {
            instruction: `Arrive at ${destName} Station`,
            subText: "Final drop point right at destination hub",
            distance: "120 m",
            duration: "2 mins",
            mode: "walk",
          },
        ],
      },
      {
        id: "car_cab",
        mode: "car_cab",
        title: "Car / Smart EV Cab / Taxi",
        badge: isTrafficSpike ? "HIGH CONGESTION DELAY" : "DIRECT DOOR-TO-DOOR",
        badgeColor: isTrafficSpike ? "bg-rose-500/20 text-rose-300 border-rose-500/40" : "bg-blue-500/20 text-blue-300 border-blue-500/40",
        durationMins: carDuration,
        departureTime: formatMinutesToTime(depMinutes),
        arrivalTime: carArrival,
        distanceKm: Math.round(tripDistanceKm * 1.1 * 10) / 10,
        co2Grams: carCo2,
        co2SavedGrams: 0,
        cost: "₹180 - ₹240 ($2.50)",
        reliabilityScore: isTrafficSpike ? 64 : 85,
        trafficCondition: isTrafficSpike ? "Congested" : "Moderate",
        recommendedFor: "Heavy luggage or private group travel",
        highlights: [
          isTrafficSpike ? "⚠️ Heavy bottleneck on Central Arterial Flyover" : "Smooth arterial flow",
          "Estimated toll: ₹0 (No toll corridor)",
          `Destination parking availability: ${isTrafficSpike ? "Low (8 slots left)" : "Ample (42 slots)"}`,
        ],
        steps: [
          {
            instruction: `Depart from ${originName} via North Arterial Road`,
            subText: "Head East on 4-Lane Boulevard",
            distance: "1.8 km",
            duration: `${Math.round(carDuration * 0.3)} mins`,
            mode: "car",
            liveStatus: isTrafficSpike ? "Slow moving traffic (16 km/h)" : "Flowing smoothly (42 km/h)",
          },
          {
            instruction: "Merge onto Central Elevated Expressway",
            subText: "Take Exit 4B toward Tech & Innovation Corridor",
            distance: `${Math.round((tripDistanceKm - 3) * 10) / 10} km`,
            duration: `${Math.round(carDuration * 0.5)} mins`,
            mode: "car",
            liveStatus: isTrafficSpike ? "Bottleneck at Junction 3 (+8 min delay)" : "Normal speed",
          },
          {
            instruction: `Exit at ${destName} Boulevard`,
            subText: "Turn left into Multi-level Smart Parking Structure P2",
            distance: "1.2 km",
            duration: `${Math.round(carDuration * 0.2)} mins`,
            mode: "car",
          },
        ],
      },
      {
        id: "bike_ebike",
        mode: "bike_ebike",
        title: "NovaCycle Smart E-Bike Shared Fleet",
        badge: "ZERO EMISSION • HEALTHY",
        badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
        durationMins: bikeDuration,
        departureTime: formatMinutesToTime(depMinutes),
        arrivalTime: bikeArrival,
        distanceKm: tripDistanceKm,
        co2Grams: 0,
        co2SavedGrams: carCo2,
        cost: "₹10 ($0.12)",
        caloriesBurned: Math.round(tripDistanceKm * 32),
        reliabilityScore: 95,
        trafficCondition: "Smooth",
        recommendedFor: "Active commute with 85% shaded green bicycle track",
        highlights: [
          "12 E-Bikes available at Origin Docking Hub",
          "85% dedicated grade-separated cycle track",
          `Earn +${Math.round(tripDistanceKm * 15)} Green Citizen Points`,
          "Zero carbon footprint",
        ],
        steps: [
          {
            instruction: `Unlock E-Bike at ${originName} Dock #12`,
            subText: "Battery level: 94% (Range ~35 km)",
            distance: "50 m",
            duration: "1 min",
            mode: "bike",
          },
          {
            instruction: "Ride along Nova Green Greenway & Cycle Superhighway C-1",
            subText: "Protected bidirectional cycle lane with solar canopy",
            distance: `${tripDistanceKm - 0.4} km`,
            duration: `${bikeDuration - 2} mins`,
            mode: "bike",
            liveStatus: "Clean air corridor (AQI 32) • Well lit",
          },
          {
            instruction: `Dock E-Bike at ${destName} Station Bay`,
            subText: "14 empty docking slots available",
            distance: "50 m",
            duration: "1 min",
            mode: "bike",
          },
        ],
      },
      {
        id: "multimodal_fast",
        mode: "multimodal_fast",
        title: "Smart Hybrid (E-Bike to Metro Express)",
        badge: "AI OPTIMIZED HYBRID",
        badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/40",
        durationMins: multiDuration,
        departureTime: formatMinutesToTime(depMinutes),
        arrivalTime: multiArrival,
        distanceKm: tripDistanceKm,
        co2Grams: 8,
        co2SavedGrams: carCo2 - 8,
        cost: "₹30 ($0.36)",
        caloriesBurned: 95,
        reliabilityScore: 98,
        trafficCondition: "Dedicated Lane",
        recommendedFor: "Fastest door-to-destination multimodal combo",
        highlights: ["E-Bike eliminates first-mile walking", "Fast Metro trunk route", "Highest carbon efficiency", "Synchronized transfer window"],
        steps: [
          {
            instruction: `Ride E-Bike from ${originName} to Hub Station`,
            subText: "Speed: 20 km/h via Green Connector",
            distance: "1.2 km",
            duration: "4 mins",
            mode: "bike",
          },
          {
            instruction: "Board Metro Blue Line Express",
            subText: "Direct express train (Skipping minor halts)",
            distance: `${tripDistanceKm - 2.0} km`,
            duration: `${multiDuration - 8} mins`,
            mode: "metro",
            lineName: "M-2 Express",
            lineColor: "bg-blue-500",
            liveStatus: "Train ready on Platform 1",
          },
          {
            instruction: `Arrive at ${destName}`,
            subText: "2 min walk from terminal gate to final location",
            distance: "150 m",
            duration: "2 mins",
            mode: "walk",
          },
        ],
      },
      {
        id: "walking",
        mode: "walking",
        title: "Pedestrian Shaded Walk",
        badge: tripDistanceKm > 4.5 ? "LONG DISTANCE" : "CALORIE BURNER",
        badgeColor: tripDistanceKm > 4.5 ? "bg-amber-500/20 text-amber-300 border-amber-500/40" : "bg-teal-500/20 text-teal-300 border-teal-500/40",
        durationMins: walkDuration,
        departureTime: formatMinutesToTime(depMinutes),
        arrivalTime: walkArrival,
        distanceKm: tripDistanceKm,
        co2Grams: 0,
        co2SavedGrams: carCo2,
        cost: "₹0 (Free)",
        caloriesBurned: Math.round(tripDistanceKm * 65),
        reliabilityScore: 100,
        trafficCondition: "Smooth",
        recommendedFor: "Short distances, low-stress cardio workout",
        highlights: ["Tree canopy shade coverage: 78%", "Zero crossing conflicts with pedestrian overpasses", "Water refill stations every 500m"],
        steps: [
          {
            instruction: `Walk along ${originName} Tree Boulevard`,
            subText: "Wide accessible pavement with tactile paving",
            distance: `${tripDistanceKm} km`,
            duration: `${walkDuration} mins`,
            mode: "walk",
            liveStatus: "Clean pedestrian walkway • Shaded",
          },
          {
            instruction: `Arrive at ${destName}`,
            subText: "Destination reached on foot",
            distance: "0 m",
            duration: "0 min",
            mode: "walk",
          },
        ],
      },
    ];
  }, [tripDistanceKm, departureTime, originZone, destZone, isTrafficSpike, isHeavyRain]);

  // Filtered options based on priority
  const filteredOptions = useMemo(() => {
    if (priorityFilter === "fastest") {
      return [...travelOptions].sort((a, b) => a.durationMins - b.durationMins);
    }
    if (priorityFilter === "greenest") {
      return [...travelOptions].sort((a, b) => a.co2Grams - b.co2Grams);
    }
    if (priorityFilter === "cheapest") {
      return [...travelOptions].filter((o) => o.mode !== "car_cab");
    }
    return travelOptions;
  }, [travelOptions, priorityFilter]);

  const activeOption = useMemo(() => {
    return travelOptions.find((o) => o.id === selectedRouteId) || travelOptions[0];
  }, [travelOptions, selectedRouteId]);

  // Departure Time Optimization Curve (-30m to +60m)
  const departureCurveData = useMemo(() => {
    const baseMinutes = parseTime(departureTime);
    const offsets = [-30, -15, 0, 15, 30, 45, 60];

    return offsets.map((offset) => {
      const timeAtOffset = baseMinutes + offset;
      const hour = Math.floor(((timeAtOffset % 1440 + 1440) % 1440) / 60);

      // Morning peak between 8:00 and 9:45, evening peak between 17:30 and 19:30
      let peakFactor = 1.0;
      if (hour >= 8 && hour < 10) {
        peakFactor = 1.45 - Math.abs(hour - 8.5) * 0.2;
      } else if (hour >= 17 && hour < 20) {
        peakFactor = 1.4 - Math.abs(hour - 18.5) * 0.2;
      } else if (hour >= 11 && hour <= 15) {
        peakFactor = 0.85; // midday lull
      }

      const carTime = Math.round(activeOption.durationMins * (activeOption.mode === "car_cab" ? peakFactor : 1 + (peakFactor - 1) * 0.25));
      const isOptimal = offset === -15 && hour >= 8 && hour <= 9;

      return {
        offset,
        timeStr: formatMinutesToTime(timeAtOffset),
        duration: carTime,
        isOptimal,
        isTarget: offset === 0,
      };
    });
  }, [departureTime, activeOption]);

  const optimalDeparture = departureCurveData.find((d) => d.isOptimal) || departureCurveData[1];

  // Swap origin and destination
  const handleSwap = () => {
    if (isCustomDest) {
      setIsCustomDest(false);
      setCustomDestination("");
      setOriginZoneId(destinationZoneId);
      setDestinationZoneId(originZoneId);
    } else {
      const temp = originZoneId;
      setOriginZoneId(destinationZoneId);
      setDestinationZoneId(temp);
    }
  };

  // Simulate turn-by-turn navigation progression
  useEffect(() => {
    let timer: any;
    if (isNavigating) {
      timer = setInterval(() => {
        setNavProgress((prev) => {
          if (prev >= 100) {
            setIsNavigating(false);
            return 100;
          }
          return prev + 10;
        });
      }, 1200);
    }
    return () => clearInterval(timer);
  }, [isNavigating]);

  return (
    <div className="space-y-5 text-xs text-white/90">
      {/* Top Header & Context Card */}
      <div className="bg-[#0D1117] border border-white/10 rounded-2xl p-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-cyan-500/10 via-teal-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                <Navigation className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-black text-white uppercase tracking-wider font-display flex items-center gap-2">
                  <span>{t("smartTravel", "Smart Travel Intelligence")}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold border border-cyan-500/30">
                    LIVE AI ROUTING
                  </span>
                </h1>
                <p className="text-xs text-white/60">
                  Precision multimodal journey planning, dynamic traffic avoidance & departure optimization
                </p>
              </div>
            </div>
          </div>

          {/* Quick status badges */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 text-[11px]">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span className="text-white/60">Telemetry:</span>
              <span className="font-bold text-white">Live Road & Metro Sensors Active</span>
            </div>
            {isTrafficSpike && (
              <div className="px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-1.5 text-rose-300 text-[11px] font-bold">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Peak Corridor Delay Detected</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Interactive Journey Planning Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Origin, Destination & Time Config (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#0D1117] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2 font-mono">
                <Compass className="w-4 h-4 text-teal-400" />
                <span>Trip Origin & Destination</span>
              </h2>
              <button
                onClick={handleSwap}
                title="Swap Origin and Destination"
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white/70 hover:text-white border border-white/10 transition-all flex items-center gap-1 text-[11px]"
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-teal-400" />
                <span>Swap</span>
              </button>
            </div>

            {/* Origin Selection */}
            <div>
              <label className="text-[10px] font-bold text-white/50 block mb-1.5 uppercase font-mono tracking-wider flex items-center justify-between">
                <span>1. Origin / Starting Point</span>
                <span className="text-teal-400 font-sans">Current Zone: {translateEntity(originZone.name)}</span>
              </label>
              <div className="relative">
                <select
                  value={originZoneId}
                  onChange={(e) => setOriginZoneId(e.target.value)}
                  className="w-full bg-[#161B22] border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white font-medium focus:outline-none focus:border-teal-400 transition-colors appearance-none cursor-pointer"
                >
                  {zones.map((zone) => (
                    <option key={zone.id} value={zone.id} className="bg-[#161B22] text-white">
                      📍 {zone.name} — ({zone.type})
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Destination Selection with Preset / Custom Toggle */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-white/50 uppercase font-mono tracking-wider">
                  2. Destination Area
                </label>
                <button
                  onClick={() => setIsCustomDest(!isCustomDest)}
                  className="text-[10px] text-teal-400 hover:text-teal-300 font-bold underline"
                >
                  {isCustomDest ? "Pick from City Zones" : "Enter Custom Destination"}
                </button>
              </div>

              {!isCustomDest ? (
                <div className="relative">
                  <select
                    value={destinationZoneId}
                    onChange={(e) => setDestinationZoneId(e.target.value)}
                    className="w-full bg-[#161B22] border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white font-medium focus:outline-none focus:border-cyan-400 transition-colors appearance-none cursor-pointer"
                  >
                    {zones
                      .filter((z) => z.id !== originZoneId)
                      .map((zone) => (
                        <option key={zone.id} value={zone.id} className="bg-[#161B22] text-white">
                          🎯 {zone.name} — ({zone.type})
                        </option>
                      ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <input
                    type="text"
                    value={customDestination}
                    onChange={(e) => setCustomDestination(e.target.value)}
                    placeholder="e.g. Cyber Towers, Apollo Hospital, Airport Terminal 2, HITEC City..."
                    className="w-full bg-[#161B22] border border-cyan-500/50 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-400"
                  />
                  <MapPin className="w-4 h-4 text-cyan-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              )}

              {/* Quick Destination Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[9px] text-white/40 font-mono self-center">Quick Jump:</span>
                {["University District", "Central District", "Green District", "Riverside Promenade"].map((quickName) => {
                  const match = (zones || []).find((z) => z.name.toLowerCase().includes(quickName.toLowerCase().split(" ")[0]));
                  if (!match || match.id === originZoneId) return null;
                  return (
                    <button
                      key={quickName}
                      onClick={() => {
                        setIsCustomDest(false);
                        setDestinationZoneId(match.id);
                      }}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-medium border transition-colors ${
                        destinationZoneId === match.id && !isCustomDest
                          ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold"
                          : "bg-white/5 hover:bg-white/10 text-white/70 border-white/10"
                      }`}
                    >
                      {translateEntity(match.name)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Departure Time & Date Configuration */}
            <div className="space-y-3 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-white/50 uppercase font-mono tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>3. Travel Time & Schedule</span>
                </label>

                {/* Depart vs Arrive Mode Toggle */}
                <div className="flex bg-[#161B22] p-0.5 rounded-lg border border-white/10">
                  <button
                    onClick={() => setTimeMode("depart")}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all ${
                      timeMode === "depart" ? "bg-teal-500 text-black shadow" : "text-white/50 hover:text-white"
                    }`}
                  >
                    Depart At
                  </button>
                  <button
                    onClick={() => setTimeMode("arrive")}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all ${
                      timeMode === "arrive" ? "bg-teal-500 text-black shadow" : "text-white/50 hover:text-white"
                    }`}
                  >
                    Arrive By
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] text-white/40 block mb-1 font-mono">EXACT TIME</label>
                  <input
                    type="time"
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    className="w-full bg-[#161B22] border border-white/15 rounded-xl px-3 py-2 text-xs text-white font-mono font-bold focus:outline-none focus:border-teal-400"
                  />
                </div>

                <div>
                  <label className="text-[9px] text-white/40 block mb-1 font-mono">DAY OF TRAVEL</label>
                  <select
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value as any)}
                    className="w-full bg-[#161B22] border border-white/15 rounded-xl px-3 py-2 text-xs text-white font-medium focus:outline-none focus:border-teal-400"
                  >
                    <option value="today">Today (Live Telemetry)</option>
                    <option value="tomorrow">Tomorrow (Predictive AI)</option>
                    <option value="weekend">Weekend Schedule</option>
                  </select>
                </div>
              </div>

              {/* Quick Time Shortcuts */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  { label: "Now (08:30)", time: "08:30" },
                  { label: "Morning Peak (08:45)", time: "08:45" },
                  { label: "Midday (13:15)", time: "13:15" },
                  { label: "Evening Rush (18:00)", time: "18:00" },
                  { label: "Night (21:00)", time: "21:00" },
                ].map((slot) => (
                  <button
                    key={slot.label}
                    onClick={() => setDepartureTime(slot.time)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-mono border transition-all ${
                      departureTime === slot.time
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold"
                        : "bg-white/5 hover:bg-white/10 text-white/60 border-white/10"
                    }`}
                  >
                    {slot.label}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Real-time Departure Optimizer Callout */}
            {isTrafficSpike && (
              <div className="bg-amber-950/40 border border-amber-500/40 p-3.5 rounded-xl space-y-1.5 text-amber-200">
                <div className="flex items-center gap-2 font-bold text-xs text-amber-300 font-mono">
                  <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow" />
                  <span>AI DEPARTURE OPTIMIZER</span>
                </div>
                <p className="text-[11px] text-amber-200/90 leading-relaxed">
                  Leaving at <strong className="text-white font-mono">{optimalDeparture.timeStr}</strong> (15 mins earlier) bypasses
                  the <strong className="text-amber-300">Central Flyover</strong> bottleneck and saves approximately{" "}
                  <strong className="text-white font-mono">14 minutes</strong> of travel time.
                </p>
                <button
                  onClick={() => setDepartureTime(optimalDeparture.timeStr.slice(0, 5))}
                  className="mt-1 px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-[10px] uppercase tracking-wider transition-colors"
                >
                  Apply Optimized Time ({optimalDeparture.timeStr})
                </button>
              </div>
            )}

            {/* Travel Priority Filters */}
            <div className="pt-2 border-t border-white/10">
              <label className="text-[10px] font-bold text-white/50 block mb-2 uppercase font-mono tracking-wider">
                Priority Ranking
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: "all", label: "All Modes" },
                  { id: "fastest", label: "Fastest" },
                  { id: "greenest", label: "Zero CO₂" },
                  { id: "cheapest", label: "Budget" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setPriorityFilter(item.id as any)}
                    className={`py-1.5 px-2 rounded-xl text-[10px] font-bold uppercase transition-all text-center border ${
                      priorityFilter === item.id
                        ? "bg-teal-500/20 text-teal-300 border-teal-500/50"
                        : "bg-white/5 hover:bg-white/10 text-white/60 border-white/10"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Departure Optimization Horizon Graph */}
          <div className="bg-[#0D1117] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <Timer className="w-4 h-4 text-cyan-400" />
                <span>Travel Time vs Departure Curve</span>
              </h3>
              <span className="text-[10px] text-white/40 font-mono">Window: -30m to +60m</span>
            </div>

            <div className="grid grid-cols-7 gap-1 pt-1">
              {departureCurveData.map((point) => (
                <button
                  key={point.offset}
                  onClick={() => setDepartureTime(point.timeStr.slice(0, 5))}
                  className={`p-2 rounded-xl border flex flex-col items-center justify-between transition-all ${
                    point.isTarget
                      ? "bg-cyan-500/20 border-cyan-500/60 shadow-lg text-cyan-300"
                      : point.isOptimal
                      ? "bg-emerald-500/20 border-emerald-500/60 text-emerald-300"
                      : "bg-[#161B22] border-white/5 hover:border-white/20 text-white/70"
                  }`}
                >
                  <span className="text-[9px] font-mono text-white/50">{point.offset >= 0 ? `+${point.offset}m` : `${point.offset}m`}</span>
                  <div className="text-xs font-black font-mono my-1">{point.duration}m</div>
                  <span className="text-[8px] font-mono opacity-80">{point.timeStr.split(" ")[0]}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between text-[10px] text-white/50 pt-1 border-t border-white/5">
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <CheckCircle2 className="w-3 h-3" /> Best Window: {optimalDeparture.timeStr}
              </span>
              <span className="text-white/40">Real-time corridor simulator</span>
            </div>
          </div>
        </div>

        {/* Right Column: Computed Exact Result & Multi-Modal Route Breakdown (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Journey Header Card */}
          <div className="bg-gradient-to-r from-teal-950/40 via-[#0D1117] to-cyan-950/30 border border-white/10 rounded-2xl p-4 sm:p-5 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
              <div>
                <div className="text-[10px] font-mono text-teal-400 font-bold uppercase tracking-wider">
                  CONFIRMED TRIP ITINERARY
                </div>
                <div className="text-base sm:text-lg font-black text-white flex items-center gap-2 mt-0.5">
                  <span>{translateEntity(originZone.name)}</span>
                  <ArrowRight className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>{translateEntity(destZone.name)}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-black/40 px-3.5 py-2 rounded-xl border border-white/10">
                <div>
                  <div className="text-[9px] font-mono text-white/40 uppercase">Trip Distance</div>
                  <div className="text-sm font-black text-white font-mono">{tripDistanceKm} km</div>
                </div>
                <div className="w-px h-6 bg-white/10" />
                <div>
                  <div className="text-[9px] font-mono text-white/40 uppercase">Target Departure</div>
                  <div className="text-sm font-black text-amber-300 font-mono">{activeOption.departureTime}</div>
                </div>
              </div>
            </div>

            {/* Quick Mode Switcher Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-3">
              {filteredOptions.map((opt) => {
                const isSelected = selectedRouteId === opt.id;
                const IconComponent =
                  opt.mode === "metro_feeder"
                    ? Train
                    : opt.mode === "electric_bus"
                    ? Bus
                    : opt.mode === "car_cab"
                    ? Car
                    : opt.mode === "bike_ebike"
                    ? Bike
                    : opt.mode === "multimodal_fast"
                    ? Zap
                    : Footprints;

                return (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedRouteId(opt.id)}
                    className={`p-2.5 rounded-xl border flex flex-col justify-between text-left transition-all ${
                      isSelected
                        ? "bg-teal-500/20 border-teal-400 shadow-md ring-1 ring-teal-400"
                        : "bg-[#161B22] border-white/10 hover:border-white/20 text-white/70"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <IconComponent className={`w-4 h-4 ${isSelected ? "text-teal-300" : "text-white/60"}`} />
                      <span className="text-[10px] font-black font-mono text-white">{opt.durationMins} min</span>
                    </div>
                    <div className="mt-2">
                      <div className="text-[10px] font-bold text-white truncate">{opt.title.split(" ")[0]}</div>
                      <div className="text-[9px] text-white/50 font-mono">{opt.cost}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Selected Route Detailed Breakdown Card */}
          <div className="bg-[#0D1117] border border-white/10 rounded-2xl p-5 shadow-xl space-y-5">
            {/* Title & Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-black text-white uppercase tracking-wider font-display">
                    {activeOption.title}
                  </h2>
                  {activeOption.badge && (
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-bold border ${activeOption.badgeColor}`}>
                      {activeOption.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-white/60 mt-0.5">{activeOption.recommendedFor}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setFavoriteSaved(!favoriteSaved)}
                  className={`p-2 rounded-xl border transition-colors ${
                    favoriteSaved
                      ? "bg-teal-500/20 text-teal-300 border-teal-500/40"
                      : "bg-white/5 hover:bg-white/10 text-white/70 border-white/10"
                  }`}
                  title="Save to My Commute"
                >
                  <Bookmark className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setAlertSaved(!alertSaved)}
                  className={`p-2 rounded-xl border transition-colors ${
                    alertSaved
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                      : "bg-white/5 hover:bg-white/10 text-white/70 border-white/10"
                  }`}
                  title="Set Departure Alert"
                >
                  <Bell className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setIsNavigating(true);
                    setNavProgress(0);
                  }}
                  className="bg-teal-500 hover:bg-teal-400 text-black font-extrabold px-3.5 py-2 rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Start Navigation</span>
                </button>
              </div>
            </div>

            {/* Navigation Live Progress (if active) */}
            {isNavigating && (
              <div className="bg-cyan-950/40 border border-cyan-500/40 p-3.5 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-cyan-300 font-mono">
                  <span className="flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-cyan-400 animate-ping" />
                    LIVE TRIP NAVIGATION IN PROGRESS
                  </span>
                  <span>{navProgress}% COMPLETED</span>
                </div>
                <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-teal-400 to-cyan-400 transition-all duration-500"
                    style={{ width: `${navProgress}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-white/60 font-mono">
                  <span>Current: {translateEntity(originZone.name)}</span>
                  <span>ETA: {activeOption.arrivalTime}</span>
                </div>
              </div>
            )}

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#161B22] p-3 rounded-xl border border-white/10">
                <div className="text-[10px] font-mono text-white/40 uppercase">Total Duration</div>
                <div className="text-xl font-black text-white font-mono mt-0.5">{activeOption.durationMins} mins</div>
                <div className="text-[10px] text-teal-400 font-medium">ETA: {activeOption.arrivalTime}</div>
              </div>

              <div className="bg-[#161B22] p-3 rounded-xl border border-white/10">
                <div className="text-[10px] font-mono text-white/40 uppercase">Estimated Fare</div>
                <div className="text-xl font-black text-white font-mono mt-0.5">{activeOption.cost}</div>
                <div className="text-[10px] text-white/50">Contactless / Pass</div>
              </div>

              <div className="bg-[#161B22] p-3 rounded-xl border border-white/10">
                <div className="text-[10px] font-mono text-white/40 uppercase">Carbon Impact</div>
                <div className="text-xl font-black text-emerald-400 font-mono mt-0.5">{activeOption.co2Grams}g CO₂</div>
                <div className="text-[10px] text-emerald-300 font-medium">Saved: {activeOption.co2SavedGrams}g CO₂</div>
              </div>

              <div className="bg-[#161B22] p-3 rounded-xl border border-white/10">
                <div className="text-[10px] font-mono text-white/40 uppercase">AI Reliability</div>
                <div className="text-xl font-black text-cyan-400 font-mono mt-0.5">{activeOption.reliabilityScore}%</div>
                <div className="text-[10px] text-white/50">{activeOption.trafficCondition}</div>
              </div>
            </div>

            {/* Highlights Chips */}
            <div className="flex flex-wrap gap-2">
              {activeOption.highlights.map((h, i) => (
                <div
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] text-white/80 flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span>{h}</span>
                </div>
              ))}
            </div>

            {/* Step-by-Step Exact Turn-by-Turn Navigation Instructions */}
            <div className="space-y-3 pt-3 border-t border-white/10">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2 font-mono">
                  <Layers className="w-4 h-4 text-teal-400" />
                  <span>Exact Step-by-Step Journey Breakdown</span>
                </h3>
                <span className="text-[10px] text-white/40 font-mono">{activeOption.steps.length} Steps</span>
              </div>

              <div className="space-y-2 relative before:absolute before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-white/10">
                {activeOption.steps.map((step, idx) => {
                  const isFirst = idx === 0;
                  const isLast = idx === activeOption.steps.length - 1;

                  return (
                    <div
                      key={idx}
                      className="relative pl-10 group"
                    >
                      {/* Step Indicator Node */}
                      <div
                        className={`absolute left-2.5 top-2 -translate-x-1/2 w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                          isFirst
                            ? "bg-teal-500 border-teal-300 ring-2 ring-teal-500/20"
                            : isLast
                            ? "bg-cyan-500 border-cyan-300 ring-2 ring-cyan-500/20"
                            : "bg-[#0D1117] border-white/40 group-hover:border-teal-400"
                        }`}
                      />

                      {/* Step Card */}
                      <div className="bg-[#161B22] border border-white/10 rounded-xl p-3 space-y-1 hover:border-white/20 transition-all">
                        <div className="flex items-center justify-between gap-2">
                          <div className="font-bold text-white text-xs flex items-center gap-2">
                            <span>{step.instruction}</span>
                            {step.lineName && (
                              <span className={`text-[9px] px-2 py-0.5 rounded text-white font-mono font-bold ${step.lineColor || "bg-blue-600"}`}>
                                {step.lineName}
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] font-mono text-teal-400 font-bold shrink-0">
                            {step.duration} &bull; {step.distance}
                          </div>
                        </div>

                        <div className="text-[11px] text-white/60">{step.subText}</div>

                        {step.liveStatus && (
                          <div className="pt-1 flex items-center gap-2 text-[10px] text-amber-300 font-mono">
                            <CircleDot className="w-3 h-3 text-amber-400 animate-pulse" />
                            <span>{step.liveStatus}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Eco & Calorie Bonus Banner */}
            <div className="bg-gradient-to-r from-emerald-950/40 to-teal-950/30 border border-emerald-500/30 p-3.5 rounded-xl flex items-center justify-between gap-3 text-emerald-200">
              <div className="flex items-center gap-2.5">
                <Award className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <div className="font-bold text-xs text-white">Green Commuter Reward</div>
                  <div className="text-[11px] text-emerald-300/80">
                    Taking this route avoids <strong className="text-white">{activeOption.co2SavedGrams}g of CO₂</strong> emissions compared to private driving.
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-sm font-black text-emerald-300 font-mono">+15 pts</div>
                <div className="text-[9px] text-white/50 uppercase font-mono">Citizen Score</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SmartTravel;
