const store = require('../models/dataStore');

const getVehicles = (req, res) => {
  res.json({
    success: true,
    count: store.vehicles.length,
    vehicles: store.vehicles
  });
};

const getVehicleById = (req, res) => {
  const vehicle = store.vehicles.find(v => v.id === req.params.id);
  if (!vehicle) {
    return res.status(404).json({ success: false, message: 'Vehicle not found' });
  }
  res.json({ success: true, vehicle });
};

const updateVehicleStatus = (req, res) => {
  const { id } = req.params;
  const { status, currentPayloadKg } = req.body;
  const vehicle = store.vehicles.find(v => v.id === id);

  if (!vehicle) {
    return res.status(404).json({ success: false, message: 'Vehicle not found' });
  }

  if (status) vehicle.status = status;
  if (currentPayloadKg !== undefined) vehicle.currentPayloadKg = Number(currentPayloadKg);

  res.json({ success: true, message: 'Vehicle updated', vehicle });
};

const addVehicle = (req, res) => {
  const { vehicleNumber, name, type, capacityKg, fuelType, driverName, city, zone } = req.body;
  if (!vehicleNumber || !name || !capacityKg) {
    return res.status(400).json({ success: false, message: 'Registration number, name, and capacity are required.' });
  }

  const isEV = (fuelType || type || "").toLowerCase().includes("electric") || (fuelType || type || "").toLowerCase().includes("ev");

  const newVehicle = {
    id: `VH-${100 + store.vehicles.length + 1}`,
    vehicleNumber,
    name,
    type: type || (isEV ? "Electric Van" : "Diesel Light Truck"),
    capacityKg: Number(capacityKg),
    currentPayloadKg: 0,
    fuelType: isEV ? "Electric" : "Diesel",
    efficiencyKmPerUnit: isEV ? 5.0 : 11.5,
    unitCost: isEV ? 8.5 : 92.0,
    batteryOrFuelPct: 100,
    status: "Active",
    driver: {
      name: driverName || "Assigned Driver",
      phone: "+91 90000 00000",
      rating: 5.0,
      tripsCompleted: 0
    },
    location: {
      city: city || "Hyderabad",
      zone: zone || "Central Depot",
      lat: 17.4435 + (Math.random() - 0.5) * 0.05,
      lng: 78.3772 + (Math.random() - 0.5) * 0.05
    },
    currentTrip: null
  };

  store.vehicles.push(newVehicle);
  res.status(201).json({ success: true, message: 'Vehicle added to fleet', vehicle: newVehicle });
};

const getTrafficAlerts = (req, res) => {
  res.json({
    success: true,
    alerts: store.trafficAlerts
  });
};

const getTrips = (req, res) => {
  res.json({
    success: true,
    count: store.trips.length,
    trips: store.trips
  });
};

module.exports = {
  getVehicles,
  getVehicleById,
  updateVehicleStatus,
  addVehicle,
  getTrafficAlerts,
  getTrips
};
