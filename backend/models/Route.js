const mongoose = require('mongoose');

const routeSchema = mongoose.Schema({
    name: { type: String, required: true, unique: true },
    startPoint: { type: String, required: true },
    endPoint: { type: String, required: true },
    stops: [{
        name: String,
        lat: Number,
        lng: Number,
        estimatedTime: Number // Minutes from start
    }],
    totalDistance: { type: Number, required: true }, // in km
    estimatedDuration: { type: Number, required: true } // in mins
}, { timestamps: true });

module.exports = mongoose.model('Route', routeSchema);
