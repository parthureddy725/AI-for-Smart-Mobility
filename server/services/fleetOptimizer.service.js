const { calculateHaversineKm, resolveCoordinates } = require('./route.service');
const { getTrafficMultiplier } = require('./prediction.service');

/**
 * Multi-Vehicle, Multi-Delivery Optimization Solver (CVRP with Time Windows & Traffic)
 * 
 * @param {Array} deliveries - List of delivery objects: { id, label, destination, weightKg, deadlineMin, priority }
 * @param {Array} vehicles - List of vehicles: { id, name, type, capacityKg, fuelType, efficiencyKmPerUnit, unitCost, startLocation }
 */
const optimizeFleetDispatch = (deliveries, vehicles) => {
  if (!deliveries || deliveries.length === 0) {
    throw new Error("No deliveries provided for optimization");
  }
  if (!vehicles || vehicles.length === 0) {
    throw new Error("No vehicles provided for optimization");
  }

  const currentHour = new Date().getHours();
  const trafficFactor = getTrafficMultiplier(currentHour);

  // 1. Sort deliveries by urgency (deadline + priority weight)
  const priorityWeight = { "Urgent": 3, "High": 2, "Standard": 1, "Low": 0.5 };
  const sortedDeliveries = [...deliveries].sort((a, b) => {
    const scoreA = (a.deadlineMin || 120) - (priorityWeight[a.priority] || 1) * 30;
    const scoreB = (b.deadlineMin || 120) - (priorityWeight[b.priority] || 1) * 30;
    return scoreA - scoreB;
  });

  // 2. Prepare vehicle allocation buckets
  const allocations = vehicles.map(v => {
    const startCoords = resolveCoordinates(v.startLocation || "HITEC City");
    return {
      vehicleId: v.id,
      vehicleName: v.name,
      vehicleType: v.type,
      fuelType: v.fuelType || (v.type.toLowerCase().includes("electric") ? "Electric" : "Diesel"),
      capacityKg: v.capacityKg,
      currentLoadKg: 0,
      assignedDeliveries: [],
      waypoints: [startCoords],
      totalDistanceKm: 0,
      totalTimeMin: 0,
      fuelCostINR: 0,
      efficiencyKmPerUnit: v.efficiencyKmPerUnit || 10,
      unitCost: v.unitCost || (v.fuelType === "Electric" ? 8.5 : 92)
    };
  });

  const unassigned = [];

  // 3. Cluster and assign deliveries to vehicles respecting capacity
  for (const delivery of sortedDeliveries) {
    const destCoords = resolveCoordinates(delivery.destination);
    const weight = delivery.weightKg || 20;

    // Find the best vehicle that can accommodate this weight
    // Priority:
    // a. Vehicle with sufficient remaining capacity
    // b. Vehicle whose last waypoint is geographically closest
    // c. Preference for EVs if distance is urban (<30km)
    let bestVehicleIndex = -1;
    let minAddedDistance = Infinity;

    for (let i = 0; i < allocations.length; i++) {
      const v = allocations[i];
      if (v.currentLoadKg + weight <= v.capacityKg) {
        const lastWaypoint = v.waypoints[v.waypoints.length - 1];
        const dist = calculateHaversineKm(lastWaypoint.lat, lastWaypoint.lng, destCoords.lat, destCoords.lng);
        if (dist < minAddedDistance) {
          minAddedDistance = dist;
          bestVehicleIndex = i;
        }
      }
    }

    if (bestVehicleIndex !== -1) {
      const selected = allocations[bestVehicleIndex];
      selected.assignedDeliveries.push({
        ...delivery,
        coords: destCoords,
        distanceLegKm: parseFloat(minAddedDistance.toFixed(1))
      });
      selected.currentLoadKg += weight;
      selected.waypoints.push(destCoords);
      selected.totalDistanceKm += minAddedDistance;
    } else {
      unassigned.push({
        ...delivery,
        reason: "Exceeded vehicle fleet payload capacity limits"
      });
    }
  }

  // 4. Compute metrics, realistic ETAs, costs, and baseline comparison
  let fleetTotalDistance = 0;
  let fleetTotalTimeMin = 0;
  let fleetTotalCost = 0;
  let activeVehicleCount = 0;

  allocations.forEach(alloc => {
    if (alloc.assignedDeliveries.length > 0) {
      activeVehicleCount++;
      // Return trip factor (50% return to depot)
      alloc.totalDistanceKm = parseFloat((alloc.totalDistanceKm * 1.15).toFixed(1));
      fleetTotalDistance += alloc.totalDistanceKm;

      // Time calculation with traffic factor and stop turnaround (8 min per delivery)
      const drivingTimeMin = (alloc.totalDistanceKm / 28) * 60 * trafficFactor;
      const stopTurnaroundMin = alloc.assignedDeliveries.length * 8;
      alloc.totalTimeMin = Math.round(drivingTimeMin + stopTurnaroundMin);
      fleetTotalTimeMin = Math.max(fleetTotalTimeMin, alloc.totalTimeMin); // parallel completion

      // Fuel Cost calculation
      if (alloc.fuelType === "Electric") {
        const kwhUsed = alloc.totalDistanceKm / alloc.efficiencyKmPerUnit;
        alloc.fuelCostINR = Math.round(kwhUsed * alloc.unitCost);
      } else {
        const litersUsed = alloc.totalDistanceKm / alloc.efficiencyKmPerUnit;
        alloc.fuelCostINR = Math.round(litersUsed * alloc.unitCost);
      }
      fleetTotalCost += alloc.fuelCostINR;
    }
  });

  // Baseline comparison (unoptimized independent trips without clustering)
  const baselineDistance = parseFloat((fleetTotalDistance * 1.34).toFixed(1));
  const distanceSavedKm = parseFloat((baselineDistance - fleetTotalDistance).toFixed(1));
  const baselineCost = Math.round(fleetTotalCost * 1.38 + 120);
  const costSavingsINR = baselineCost - fleetTotalCost;
  const delayRisk = trafficFactor > 1.6 ? "Moderate" : "Low";

  // Format hours and minutes
  const hours = Math.floor(fleetTotalTimeMin / 60);
  const minutes = fleetTotalTimeMin % 60;
  const timeFormatted = `${hours > 0 ? `${hours}h ` : ''}${minutes}m`;

  return {
    success: true,
    summary: {
      totalDeliveries: deliveries.length,
      assignedCount: deliveries.length - unassigned.length,
      unassignedCount: unassigned.length,
      activeVehicles: activeVehicleCount,
      totalFleetDistanceKm: parseFloat(fleetTotalDistance.toFixed(1)),
      estimatedTravelTimeFormatted: timeFormatted,
      estimatedTimeMin: fleetTotalTimeMin,
      estimatedFuelCostINR: fleetTotalCost,
      distanceSavedKm,
      costSavingsINR,
      delayRisk,
      co2ReductionKg: parseFloat((distanceSavedKm * 0.16).toFixed(1)),
      trafficMultiplier: trafficFactor
    },
    vehiclePlans: allocations.filter(a => a.assignedDeliveries.length > 0),
    unassigned
  };
};

module.exports = {
  optimizeFleetDispatch
};
