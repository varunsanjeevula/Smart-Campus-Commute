const mongoose = require('mongoose');

const busSchema = mongoose.Schema({
    busNumber: { type: String, required: true, unique: true },
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
    route: { type: String, required: true }, // Simple string for now, could be Route model
    status: { type: String, enum: ['active', 'inactive', 'maintenance'], default: 'active' },
    lastLocation: {
        lat: Number,
        lng: Number,
        speed: Number,
        timestamp: Date
    }
}, { timestamps: true });

module.exports = mongoose.model('Bus', busSchema);
