const express = require('express');
const { getBuses, getBusById, getBusHistory, createBus, updateBus, deleteBus, seedBuses } = require('../controllers/busController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/seed', seedBuses); // Public seed route for easier testing

router.route('/')
    .get(getBuses)
    .post(protect, admin, createBus); // Only admin can create buses

router.route('/:id')
    .get(getBusById)
    .put(protect, admin, updateBus)
    .delete(protect, admin, deleteBus);

router.route('/:id/history')
    .get(getBusHistory);

module.exports = router;
