const mongoose = require('mongoose');

const driverSchema = mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    licenseNumber: { type: String, required: true },
    rating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
    reviews: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        rating: { type: Number, required: true },
        comment: String,
        createdAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Driver', driverSchema);
