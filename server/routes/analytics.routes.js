const express = require('express');
const router = express.Router();
const { getFleetAnalytics } = require('../controllers/analytics.controller');

router.get('/metrics', getFleetAnalytics);

module.exports = router;
