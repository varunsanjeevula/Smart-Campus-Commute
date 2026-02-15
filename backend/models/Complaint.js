const mongoose = require('mongoose');

const complaintSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional (anonymous)
    busId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true },
    type: { type: String, required: true },
    description: { type: String, required: true },
    media: [String], // Array of URLs/paths
    status: { type: String, enum: ['open', 'resolved'], default: 'open' }
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);
