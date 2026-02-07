const Bus = require('../models/Bus');
const LocationLog = require('../models/LocationLog');

const getBuses = async (req, res) => {
    try {
        const buses = await Bus.find().populate('driverId');
        res.json(buses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getBusById = async (req, res) => {
    try {
        const bus = await Bus.findOne({ busNumber: req.params.id }).populate('driverId'); // params.id can be busNumber or _id. Let's support busNumber for logic
        // If not found by busNumber, try _id
        if (bus) return res.json(bus);

        const busById = await Bus.findById(req.params.id).populate('driverId');
        if (busById) return res.json(busById);

        res.status(404).json({ message: 'Bus not found' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createBus = async (req, res) => {
    try {
        const bus = await Bus.create(req.body);
        res.status(201).json(bus);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getBusHistory = async (req, res) => {
    try {
        // Find bus first to get _id
        const bus = await Bus.findOne({ busNumber: req.params.id });
        if (!bus) return res.status(404).json({ message: 'Bus not found' });

        const history = await LocationLog.find({ busId: bus._id }).sort({ timestamp: -1 }).limit(100);
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const seedBuses = async (req, res) => {
    try {
        const Driver = require('../models/Driver');

        // Define mock buses
        const buses = [
            {
                busNumber: 'DL-1PC-0001',
                route: 'Route 101',
                status: 'active',
                lastLocation: { lat: 28.6139, lng: 77.2090, speed: 45, timestamp: new Date() } // Connaught Place
            },
            {
                busNumber: 'DL-1PC-0002',
                route: 'Route 202',
                status: 'active',
                lastLocation: { lat: 28.5355, lng: 77.3910, speed: 30, timestamp: new Date() } // Noida
            },
            {
                busNumber: 'DL-1PC-0003',
                route: 'Route 303',
                status: 'active',
                lastLocation: { lat: 28.4595, lng: 77.0266, speed: 55, timestamp: new Date() } // Gurgaon
            },
            {
                busNumber: 'DL-1PC-0004',
                route: 'Route 404',
                status: 'active',
                lastLocation: { lat: 28.7041, lng: 77.1025, speed: 40, timestamp: new Date() } // Pitampura
            },
            {
                busNumber: 'DL-1PC-0005',
                route: 'Route 505',
                status: 'maintenance',
                lastLocation: { lat: 28.6692, lng: 77.4538, speed: 0, timestamp: new Date() } // Ghaziabad
            }
        ];

        // Clear existing buses
        await Bus.deleteMany({});

        // Create mock driver if needed
        let driver = await Driver.findOne();
        if (!driver) {
            driver = await Driver.create({
                name: 'Mock Driver',
                licenseNumber: 'DL-MOCK-12345',
                phone: '9876543210',
                status: 'active'
            });
        }

        const busesWithDriver = buses.map(bus => ({ ...bus, driverId: driver._id }));

        await Bus.insertMany(busesWithDriver);

        res.json({ message: 'Buses seeded successfully', count: buses.length });
    } catch (error) {
        console.error("SEED_ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};

const updateBus = async (req, res) => {
    try {
        const bus = await Bus.findById(req.params.id);
        if (bus) {
            bus.busNumber = req.body.busNumber || bus.busNumber;
            bus.route = req.body.route || bus.route;
            bus.status = req.body.status || bus.status;
            if (req.body.driverId) bus.driverId = req.body.driverId;

            const updatedBus = await bus.save();
            res.json(updatedBus);
        } else {
            res.status(404).json({ message: 'Bus not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteBus = async (req, res) => {
    try {
        const bus = await Bus.findById(req.params.id);
        if (bus) {
            await bus.deleteOne();
            res.json({ message: 'Bus removed' });
        } else {
            res.status(404).json({ message: 'Bus not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getBuses, getBusById, getBusHistory, createBus, seedBuses, updateBus, deleteBus };
