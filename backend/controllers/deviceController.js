const Bus = require('../models/Bus');
const LocationLog = require('../models/LocationLog');

const updateLocation = async (req, res) => {
    // API Key Validation
    const apiKey = req.headers['x-api-key'];
    if (apiKey !== process.env.DEVICE_API_KEY) {
        return res.status(401).json({ message: 'Invalid API Key' });
    }

    const { busNumber, lat, lng, speed } = req.body;

    try {
        const bus = await Bus.findOne({ busNumber });
        if (!bus) {
            // Option: Auto-create bus or error? Error is safer.
            return res.status(404).json({ message: 'Bus not found' });
        }

        // Update Bus
        bus.lastLocation = { lat, lng, speed, timestamp: new Date() };
        await bus.save();

        // Create Log
        await LocationLog.create({
            busId: bus._id,
            lat,
            lng,
            speed
        });

        // Emit Socket Event
        const io = req.app.get('io');
        io.to(bus._id.toString()).emit('location_update', {
            busNumber,
            lat,
            lng,
            speed,
            timestamp: new Date()
        });

        res.json({ message: 'Location updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server caught error' });
    }
};

module.exports = { updateLocation };
