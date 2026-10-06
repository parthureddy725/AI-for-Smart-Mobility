const express = require('express');
const router = express.Router();
const { planRoute, optimizeDispatch } = require('../controllers/route.controller');

router.post('/plan', planRoute);
router.post('/optimize-dispatch', optimizeDispatch);

module.exports = router;
