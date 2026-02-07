const express = require('express');
const { getDashboardStats, getBusPerformance } = require('../controllers/analyticsController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/dashboard', protect, admin, getDashboardStats);
router.get('/performance', protect, admin, getBusPerformance);

module.exports = router;
