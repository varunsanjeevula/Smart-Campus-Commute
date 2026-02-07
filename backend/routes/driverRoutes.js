const express = require('express');
const { createDriver, getDrivers, rateDriver } = require('../controllers/driverController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
    .get(protect, admin, getDrivers)
    .post(protect, admin, createDriver);

router.route('/:id/rate').post(rateDriver);

module.exports = router;
