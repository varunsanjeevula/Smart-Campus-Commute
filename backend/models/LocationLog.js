const mongoose = require('mongoose');

const locationLogSchema = mongoose.Schema({
    busId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    speed: { type: Number },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LocationLog', locationLogSchema);
