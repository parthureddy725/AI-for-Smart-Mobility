const express = require('express');
const router = express.Router();
const {
  getVehicles,
  getVehicleById,
  updateVehicleStatus,
  addVehicle,
  getTrafficAlerts,
  getTrips
} = require('../controllers/fleet.controller');

router.get('/vehicles', getVehicles);
router.get('/vehicles/:id', getVehicleById);
router.patch('/vehicles/:id/status', updateVehicleStatus);
router.post('/vehicles', addVehicle);
router.get('/traffic-alerts', getTrafficAlerts);
router.get('/trips', getTrips);

module.exports = router;
