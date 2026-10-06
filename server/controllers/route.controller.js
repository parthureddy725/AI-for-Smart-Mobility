const { planRoutes } = require('../services/route.service');
const { optimizeFleetDispatch } = require('../services/fleetOptimizer.service');
const store = require('../models/dataStore');

const planRoute = (req, res) => {
  try {
    const { origin, destination, vehicleType, departureTime, priority } = req.body;
    if (!origin || !destination) {
      return res.status(400).json({ success: false, message: 'Origin and destination are required' });
    }

    const result = planRoutes({
      origin,
      destination,
      vehicleType: vehicleType || "Electric Van",
      departureTime: departureTime || "Now",
      priority: priority || "Balanced"
    });

    return res.json({
      success: true,
      ...result
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const optimizeDispatch = (req, res) => {
  try {
    const { deliveries, vehicles } = req.body;

    // If vehicles aren't provided in the payload, use the active vehicles in the store
    const vehiclePool = (vehicles && vehicles.length > 0) ? vehicles : store.vehicles.filter(v => v.status !== "Maintenance").slice(0, 3);

    // If deliveries aren't passed, use default showcase deliveries
    const deliveryPool = (deliveries && deliveries.length > 0) ? deliveries : [
      { id: "DEL-A", label: "Delivery A (Kondapur Pharma Hub)", destination: "Kondapur", weightKg: 180, deadlineMin: 90, priority: "Urgent" },
      { id: "DEL-B", label: "Delivery B (Madhapur E-Commerce)", destination: "Madhapur", weightKg: 120, deadlineMin: 120, priority: "High" },
      { id: "DEL-C", label: "Delivery C (Gachibowli Tech Park)", destination: "Gachibowli", weightKg: 240, deadlineMin: 150, priority: "Standard" },
      { id: "DEL-D", label: "Delivery D (Jubilee Hills Retails)", destination: "Jubilee Hills", weightKg: 95, deadlineMin: 180, priority: "Standard" },
      { id: "DEL-E", label: "Delivery E (Banjara Hills Medical)", destination: "Banjara Hills", weightKg: 140, deadlineMin: 110, priority: "High" }
    ];

    const result = optimizeFleetDispatch(deliveryPool, vehiclePool);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  planRoute,
  optimizeDispatch
};
