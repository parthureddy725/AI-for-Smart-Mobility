// In-Memory Data Store with pre-seeded realistic mobility data
const seedVehicles = [
  {
    id: "VH-101",
    vehicleNumber: "TS-09-EA-4120",
    name: "Tata Ace EV (Urban Cargo)",
    type: "Electric Van",
    capacityKg: 1000,
    currentPayloadKg: 420,
    fuelType: "Electric",
    efficiencyKmPerUnit: 4.8, // km per kWh
    unitCost: 8.5, // INR per kWh
    batteryOrFuelPct: 88,
    status: "Active", // Active, Idle, Maintenance, In-Transit
    driver: {
      name: "Ramesh Kumar",
      phone: "+91 98765 43210",
      rating: 4.9,
      tripsCompleted: 342
    },
    location: {
      city: "Hyderabad",
      zone: "HITEC City / Madhapur",
      lat: 17.4435,
      lng: 78.3772
    },
    currentTrip: "TRIP-8841 (HITEC to Gachibowli Express)"
  },
  {
    id: "VH-102",
    vehicleNumber: "MH-12-QB-8819",
    name: "Ashok Leyland BADA DOST",
    type: "Diesel Light Truck",
    capacityKg: 1850,
    currentPayloadKg: 1200,
    fuelType: "Diesel",
    efficiencyKmPerUnit: 12.5, // km per liter
    unitCost: 92.0, // INR per liter
    batteryOrFuelPct: 64,
    status: "Active",
    driver: {
      name: "Suresh Patil",
      phone: "+91 98220 11982",
      rating: 4.8,
      tripsCompleted: 512
    },
    location: {
      city: "Hyderabad",
      zone: "Kukatpally / Miyapur",
      lat: 17.4947,
      lng: 78.3996
    },
    currentTrip: "TRIP-8842 (Kukatpally Industrial Hub)"
  },
  {
    id: "VH-103",
    vehicleNumber: "KA-01-EV-3301",
    name: "Mahindra Treo Zor",
    type: "Electric 3-Wheeler",
    capacityKg: 550,
    currentPayloadKg: 180,
    fuelType: "Electric",
    efficiencyKmPerUnit: 6.2,
    unitCost: 8.5,
    batteryOrFuelPct: 92,
    status: "Active",
    driver: {
      name: "Arjun Gowda",
      phone: "+91 97412 88390",
      rating: 4.95,
      tripsCompleted: 820
    },
    location: {
      city: "Hyderabad",
      zone: "Banjara Hills Rd 12",
      lat: 17.4156,
      lng: 78.4354
    },
    currentTrip: "TRIP-8843 (Quick Grocery Dispatch)"
  },
  {
    id: "VH-104",
    vehicleNumber: "TS-07-UG-9112",
    name: "Eicher Pro 2049",
    type: "Heavy Cargo Truck",
    capacityKg: 2800,
    currentPayloadKg: 0,
    fuelType: "Diesel",
    efficiencyKmPerUnit: 9.8,
    unitCost: 92.0,
    batteryOrFuelPct: 45,
    status: "Idle",
    driver: {
      name: "Md. Farhan",
      phone: "+91 94401 22345",
      rating: 4.7,
      tripsCompleted: 610
    },
    location: {
      city: "Hyderabad",
      zone: "Secunderabad Depot",
      lat: 17.4399,
      lng: 78.4983
    },
    currentTrip: null
  },
  {
    id: "VH-105",
    vehicleNumber: "TS-08-EV-7721",
    name: "Euler Motors HiLoad EV",
    type: "Electric Van",
    capacityKg: 700,
    currentPayloadKg: 310,
    fuelType: "Electric",
    efficiencyKmPerUnit: 5.1,
    unitCost: 8.5,
    batteryOrFuelPct: 76,
    status: "Active",
    driver: {
      name: "Kiran Varma",
      phone: "+91 99881 33452",
      rating: 4.85,
      tripsCompleted: 290
    },
    location: {
      city: "Hyderabad",
      zone: "Gachibowli Financial District",
      lat: 17.4124,
      lng: 78.3498
    },
    currentTrip: "TRIP-8844 (Corporate Logistics)"
  },
  {
    id: "VH-106",
    vehicleNumber: "MH-14-TR-5050",
    name: "Tata Winger Cargo",
    type: "Diesel Van",
    capacityKg: 1200,
    currentPayloadKg: 0,
    fuelType: "Diesel",
    efficiencyKmPerUnit: 11.2,
    unitCost: 92.0,
    batteryOrFuelPct: 22,
    status: "Maintenance",
    driver: {
      name: "Vijay Shinde",
      phone: "+91 98230 77123",
      rating: 4.65,
      tripsCompleted: 440
    },
    location: {
      city: "Hyderabad",
      zone: "Cherlapally Service Center",
      lat: 17.4719,
      lng: 78.5992
    },
    currentTrip: null
  }
];

// In-Memory store
const store = {
  vehicles: [...seedVehicles],
  users: [
    {
      id: "usr_admin_1",
      name: "Praneeth Sharma",
      email: "admin@moveai.com",
      // default demo password hash for "moveai2026"
      passwordHash: "$2a$10$7Z2j26Wc1XjXQhB/Y9wQme0R9fSgZ3d6Z1U91OQzUjH7iG4mU/1e6",
      role: "Fleet Director",
      company: "MoveAI Urban Logistics"
    }
  ],
  trips: [
    {
      id: "TRIP-8841",
      vehicleId: "VH-101",
      origin: "HITEC City Cyber Towers",
      destination: "Gachibowli Wipro Circle",
      distanceKm: 8.4,
      estimatedTimeMin: 22,
      fuelCostINR: 18.2,
      emissionsKgSaved: 1.6,
      status: "In-Transit",
      priority: "Express",
      startedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString()
    },
    {
      id: "TRIP-8842",
      vehicleId: "VH-102",
      origin: "Kukatpally Y Junction",
      destination: "Balanagar Industrial Zone",
      distanceKm: 14.2,
      estimatedTimeMin: 38,
      fuelCostINR: 104.5,
      emissionsKgSaved: 0.8,
      status: "In-Transit",
      priority: "Standard",
      startedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString()
    }
  ],
  trafficAlerts: [
    {
      id: "ALT-1",
      zone: "Gachibowli Flyover Junction",
      severity: "High",
      delayMin: 18,
      reason: "Metro Rail Phase-2 Construction Lane Restriction",
      speedReductionPct: 45,
      alternativeRoute: "Durgam Cheruvu Cable Bridge route saves 12 mins"
    },
    {
      id: "ALT-2",
      zone: "Begumpet Airport Road",
      severity: "Medium",
      delayMin: 9,
      reason: "Peak Commute Density (Water logging cleared)",
      speedReductionPct: 25,
      alternativeRoute: "Necklace Road via Sanjeevaiah Park"
    },
    {
      id: "ALT-3",
      zone: "Outer Ring Road (Exit 19 - Shamshabad)",
      severity: "Low",
      delayMin: 4,
      reason: "Smooth Flow, optimal EV cruise speed maintained",
      speedReductionPct: 5,
      alternativeRoute: "Direct Expressway"
    }
  ]
};

module.exports = store;
