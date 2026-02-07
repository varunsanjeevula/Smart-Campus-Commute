const Complaint = require('../models/Complaint');

const createComplaint = async (req, res) => {
    const { busId, type, description } = req.body;
    let media = [];

    if (req.files) {
        media = req.files.map(file => `/uploads/${file.filename}`);
    }

    try {
        const complaint = await Complaint.create({
            userId: req.user ? req.user._id : null,
            busId,
            type,
            description,
            media
        });
        res.status(201).json(complaint);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find()
            .populate('busId', 'busNumber')
            .populate('userId', 'name email');
        res.json(complaints);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const resolveComplaint = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);
        if (complaint) {
            complaint.status = 'resolved';
            await complaint.save();
            res.json(complaint);
        } else {
            res.status(404).json({ message: 'Complaint not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getComplaintById = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id)
            .populate('busId', 'busNumber');
        if (complaint) {
            res.json(complaint);
        } else {
            res.status(404).json({ message: 'Complaint not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find({ userId: req.user._id })
            .populate('busId', 'busNumber')
            .sort({ createdAt: -1 });
        res.json(complaints);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createComplaint, getComplaints, resolveComplaint, getComplaintById, getUserComplaints };
