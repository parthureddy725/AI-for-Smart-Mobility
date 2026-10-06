// Traffic Prediction & Disruption Engine

const getTrafficMultiplier = (hour, weather = "Clear") => {
  let baseMultiplier = 1.0;

  // Morning rush hour: 8:00 - 11:30
  if (hour >= 8 && hour <= 11) {
    baseMultiplier = 1.65;
  }
  // Evening rush hour: 17:00 - 20:30
  else if (hour >= 17 && hour <= 21) {
    baseMultiplier = 1.8;
  }
  // Afternoon lunch / school pickup: 13:00 - 15:00
  else if (hour >= 13 && hour <= 15) {
    baseMultiplier = 1.25;
  }
  // Night low traffic: 22:00 - 06:00
  else if (hour >= 22 || hour <= 6) {
    baseMultiplier = 0.8;
  }

  // Weather adjustment
  if (weather.toLowerCase().includes("rain") || weather.toLowerCase().includes("storm")) {
    baseMultiplier *= 1.35;
  }

  return baseMultiplier;
};

const predictRouteDisruptions = (origin, destination, departureHour = new Date().getHours()) => {
  const disruptions = [];
  const trafficMultiplier = getTrafficMultiplier(departureHour);

  // Check known bottleneck patterns
  const originStr = (origin || "").toLowerCase();
  const destStr = (destination || "").toLowerCase();

  if (originStr.includes("hitec") || destStr.includes("gachibowli") || originStr.includes("gachibowli")) {
    disruptions.push({
      id: "DIS-01",
      corridor: "Bio-Diversity Junction to IKEA Flyover",
      level: "High",
      delayMin: Math.round(14 * trafficMultiplier),
      cause: "High-density tech corridor bottleneck & arterial traffic merge",
      mitigation: "AI reroute via Knowledge City underpass bypasses 11 minutes"
    });
  }

  if (originStr.includes("kukatpally") || destStr.includes("kukatpally") || destStr.includes("miyapur")) {
    disruptions.push({
      id: "DIS-02",
      corridor: "JNTU - Forum Mall Stretch",
      level: "Medium",
      delayMin: Math.round(8 * trafficMultiplier),
      cause: "Commercial zone loading/unloading spillover",
      mitigation: "Bypass through KPHB 7th Phase arterial lane"
    });
  }

  if (originStr.includes("airport") || destStr.includes("airport") || destStr.includes("shamshabad")) {
    disruptions.push({
      id: "DIS-03",
      corridor: "PVNR Elevated Expressway Ramp",
      level: "Low",
      delayMin: 3,
      cause: "Steady high-speed transit flow with minor toll lane throttle",
      mitigation: "Fastag Dedicated Lane 4"
    });
  }

  // Generic fallback disruption if none matched
  if (disruptions.length === 0) {
    if (trafficMultiplier > 1.5) {
      disruptions.push({
        id: "DIS-GEN-1",
        corridor: "Main Urban Arterial Corridor",
        level: "Moderate",
        delayMin: Math.round(10 * (trafficMultiplier - 1)),
        cause: "Peak hour commute volume accumulation",
        mitigation: "Synchronized Green Wave route active"
      });
    } else {
      disruptions.push({
        id: "DIS-GEN-2",
        corridor: "Urban Corridor",
        level: "Low",
        delayMin: 2,
        cause: "Free flow nominal traffic",
        mitigation: "Standard optimal trajectory maintained"
      });
    }
  }

  return {
    trafficMultiplier,
    congestionLevel: trafficMultiplier > 1.5 ? "Heavy" : trafficMultiplier > 1.15 ? "Moderate" : "Light",
    disruptions,
    confidenceScore: 0.94
  };
};

module.exports = {
  getTrafficMultiplier,
  predictRouteDisruptions
};
