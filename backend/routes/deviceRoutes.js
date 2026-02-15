const express = require('express');
const { updateLocation } = require('../controllers/deviceController');
const router = express.Router();

router.post('/location', updateLocation);

module.exports = router;
