const express = require('express');
const { getRoutes, createRoute, updateRoute, deleteRoute } = require('../controllers/routeController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
    .get(protect, admin, getRoutes)
    .post(protect, admin, createRoute);

router.route('/:id')
    .put(protect, admin, updateRoute)
    .delete(protect, admin, deleteRoute);

module.exports = router;
