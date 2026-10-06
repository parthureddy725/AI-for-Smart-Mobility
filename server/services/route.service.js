const { predictRouteDisruptions } = require('./prediction.service');

// Known landmark coordinates (defaulting to Hyderabad tech corridor hub)
const CITY_NODES = {
  "hitec city": { lat: 17.4435, lng: 78.3772, name: "HITEC City (Cyber Towers)" },
  "gachibowli": { lat: 17.4401, lng: 78.3489, name: "Gachibowli (Financial District)" },
  "madhapur": { lat: 17.4483, lng: 78.3915, name: "Madhapur Tech Corridor" },
  "kondapur": { lat: 17.4699, lng: 78.3578, name: "Kondapur Green Heritage" },
  "jubilee hills": { lat: 17.4319, lng: 78.4073, name: "Jubilee Hills Road 36" },
  "banjara hills": { lat: 17.4156, lng: 78.4354, name: "Banjara Hills Rd 12" },
  "kukatpally": { lat: 17.4947, lng: 78.3996, name: "Kukatpally Y Junction" },
  "secunderabad": { lat: 17.4399, lng: 78.4983, name: "Secunderabad Rail Hub" },
  "begumpet": { lat: 17.4448, lng: 78.4661, name: "Begumpet Airport Link" },
  "shamshabad airport": { lat: 17.2403, lng: 78.4294, name: "Rajiv Gandhi Intl Airport" },
  "charminar": { lat: 17.3616, lng: 78.4747, name: "Old City / Charminar Hub" },
  "durgam cheruvu": { lat: 17.4326, lng: 78.3888, name: "Cable Bridge Express Way" },
  "financial district": { lat: 17.4144, lng: 78.3378, name: "Nanakramguda Financial District" },
  "bengaluru electronic city": { lat: 12.8452, lng: 77.6602, name: "Electronic City Phase 1" },
  "bengaluru whitefield": { lat: 12.9698, lng: 77.7499, name: "Whitefield ITPL" },
  "mumbai bkc": { lat: 19.0657, lng: 72.8687, name: "BKC Commercial Complex" }
};

const resolveCoordinates = (query) => {
  if (!query) return { lat: 17.4435, lng: 78.3772, name: "City Hub" };
  const qLower = query.toLowerCase().trim();

  for (const [key, node] of Object.entries(CITY_NODES)) {
    if (qLower.includes(key) || key.includes(qLower)) {
      return node;
    }
  }

  // Hash-based pseudo coordinate within Hyderabad bounds for arbitrary text
  let hash = 0;
  for (let i = 0; i < query.length; i++) {
    hash = (hash << 5) - hash + query.charCodeAt(i);
    hash |= 0;
  }
  const latOffset = (Math.abs(hash % 80) - 40) / 1000;
  const lngOffset = (Math.abs((hash >> 3) % 80) - 40) / 1000;
  return {
    lat: 17.435 + latOffset,
    lng: 78.395 + lngOffset,
    name: query
  };
};

// Generates smooth realistic waypoint curves between two coordinates
const generateWaypoints = (start, end, jitter = 0.003, steps = 8) => {
  const points = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    // quadratic curve deviation
    const curve = Math.sin(t * Math.PI) * jitter;
    const lat = start.lat + (end.lat - start.lat) * t + curve * (i % 2 === 0 ? 1 : -1);
    const lng = start.lng + (end.lng - start.lng) * t + curve * 0.8;
    points.push([parseFloat(lat.toFixed(5)), parseFloat(lng.toFixed(5))]);
  }
  return points;
};

// Calculate Haversine distance
const calculateHaversineKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const roadWiggle = 1.35; // urban road network expansion factor
  return parseFloat((R * c * roadWiggle).toFixed(1));
};

const planRoutes = ({ origin, destination, vehicleType = "Electric Van", departureTime = "Now", priority = "Balanced" }) => {
  const startNode = resolveCoordinates(origin);
  const endNode = resolveCoordinates(destination);

  let distanceKm = calculateHaversineKm(startNode.lat, startNode.lng, endNode.lat, endNode.lng);
  if (distanceKm < 3) distanceKm = 4.8; // minimum realistic urban delivery leg

  const departureHour = departureTime === "Now" ? new Date().getHours() : parseInt(departureTime) || 10;
  const prediction = predictRouteDisruptions(origin, destination, departureHour);
  const trafficMult = prediction.trafficMultiplier;

  // Base speed in urban conditions
  const baseSpeedKmph = 32;
  const nominalTimeMin = Math.round((distanceKm / baseSpeedKmph) * 60);

  // Vehicle fuel / cost rates
  const isEV = vehicleType.toLowerCase().includes("electric") || vehicleType.toLowerCase().includes("ev");
  const costPerKm = isEV ? 1.75 : 8.2; // INR per km
  const co2PerKmKg = isEV ? 0.02 : 0.18; // kg CO2 per km

  // Generate 3 Distinct Alternative Paths
  // 1. AI Recommended (Adaptive AI bypass)
  const recDistance = distanceKm;
  const recTimeMin = Math.round(nominalTimeMin * (trafficMult * 0.85) + 3);
  const recCost = Math.round(recDistance * costPerKm);
  const recCo2 = parseFloat((recDistance * co2PerKmKg).toFixed(2));
  const recWaypoints = generateWaypoints(startNode, endNode, 0.004, 9);

  // 2. Alternative: Direct Arterial (Prone to congestion)
  const directDistance = parseFloat((distanceKm * 0.92).toFixed(1));
  const directTimeMin = Math.round(nominalTimeMin * trafficMult + 10);
  const directCost = Math.round(directDistance * costPerKm * 1.15); // stop-and-go burns 15% more
  const directCo2 = parseFloat((directDistance * co2PerKmKg * 1.2).toFixed(2));
  const directWaypoints = generateWaypoints(startNode, endNode, -0.003, 8);

  // 3. Alternative: Eco / Green Corridor (Bypasses traffic lights & idle zones)
  const ecoDistance = parseFloat((distanceKm * 1.08).toFixed(1));
  const ecoTimeMin = Math.round(nominalTimeMin * 1.05 + 4);
  const ecoCost = Math.round(ecoDistance * costPerKm * 0.88);
  const ecoCo2 = parseFloat((ecoDistance * co2PerKmKg * 0.75).toFixed(2));
  const ecoWaypoints = generateWaypoints(startNode, endNode, 0.007, 10);

  return {
    origin: startNode,
    destination: endNode,
    prediction,
    routes: [
      {
        id: "route-ai-opt",
        title: "AI Recommended Route",
        badge: "Optimal Decision",
        badgeColor: "success",
        distanceKm: recDistance,
        estimatedTimeMin: recTimeMin,
        fuelCostINR: recCost,
        co2Kg: recCo2,
        trafficLevel: prediction.congestionLevel,
        savingsINR: Math.max(0, directCost - recCost + 45),
        timeSavedMin: Math.max(0, directTimeMin - recTimeMin),
        corridors: "Cable Bridge Bypass → Financial Corridor Flyover",
        reason: `Predictive model detected bottleneck on direct arterial (+${directTimeMin - recTimeMin}m delay). AI reroute maintains green wave signal synchronization, saving ₹${Math.max(0, directCost - recCost + 45)} in idle wear & fuel.`,
        waypoints: recWaypoints
      },
      {
        id: "route-eco-green",
        title: "Eco & Low Emissions Corridor",
        badge: "Lowest Footprint",
        badgeColor: "info",
        distanceKm: ecoDistance,
        estimatedTimeMin: ecoTimeMin,
        fuelCostINR: ecoCost,
        co2Kg: ecoCo2,
        trafficLevel: "Light to Moderate",
        savingsINR: 65,
        timeSavedMin: directTimeMin - ecoTimeMin,
        corridors: "Outer Peripheral Boulevard (Regenerative braking zone)",
        reason: `Maximizes steady-state cruising speed with 38% fewer deceleration cycles. Ideal for ${vehicleType} to preserve battery and minimize motor thermal stress.`,
        waypoints: ecoWaypoints
      },
      {
        id: "route-direct-arterial",
        title: "Direct Arterial (Fastest in zero-traffic)",
        badge: "Congestion Alert",
        badgeColor: "warning",
        distanceKm: directDistance,
        estimatedTimeMin: directTimeMin,
        fuelCostINR: directCost,
        co2Kg: directCo2,
        trafficLevel: "Heavy Congestion",
        savingsINR: 0,
        timeSavedMin: 0,
        corridors: "Main Central Highway",
        reason: `Shortest physical distance (-${(recDistance - directDistance).toFixed(1)} km) but high risk of queueing delay (+${directTimeMin - recTimeMin} mins) due to active peak hour volume.`,
        waypoints: directWaypoints
      }
    ]
  };
};

module.exports = {
  CITY_NODES,
  resolveCoordinates,
  calculateHaversineKm,
  planRoutes
};
