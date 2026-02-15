const Bus = require('../models/Bus');
const Driver = require('../models/Driver');
const Complaint = require('../models/Complaint');
const Route = require('../models/Route');

const getDashboardStats = async (req, res) => {
    try {
        const totalBuses = await Bus.countDocuments();
        const activeBuses = await Bus.countDocuments({ status: 'active' });
        const inactiveBuses = totalBuses - activeBuses;

        const totalDrivers = await Driver.countDocuments();
        const openComplaints = await Complaint.countDocuments({ status: 'open' });

        res.json({
            totalBuses,
            activeBuses,
            inactiveBuses,
            totalDrivers,
            openComplaints
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getBusPerformance = async (req, res) => {
    try {
        // Mocking average speed calculation from lastLocation or future history collection
        const buses = await Bus.find().select('busNumber lastLocation');
        const performance = buses.map(bus => ({
            busNumber: bus.busNumber,
            avgSpeed: bus.lastLocation?.speed || 0,
            status: bus.status
        }));
        res.json(performance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getDashboardStats, getBusPerformance };
