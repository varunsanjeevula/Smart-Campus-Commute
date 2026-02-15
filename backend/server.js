require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const busRoutes = require('./routes/busRoutes');
const deviceRoutes = require('./routes/deviceRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const driverRoutes = require('./routes/driverRoutes');

const { socketHandler } = require('./utils/socketHandler');

connectDB().then(async () => {
    try {
        const Bus = require('./models/Bus');
        const count = await Bus.countDocuments();
        if (count === 0) {
            console.log("No buses found. Seeding...");
            const Driver = require('./models/Driver');
            const buses = [
                { busNumber: 'TN-59-N-0001', route: 'Kalasalingam to Madurai', status: 'active', lastLocation: { lat: 9.9252, lng: 78.1198, speed: 45, timestamp: new Date() } },
                { busNumber: 'TN-59-N-0002', route: 'Periyar to Mattuthavani', status: 'active', lastLocation: { lat: 9.9155, lng: 78.1118, speed: 30, timestamp: new Date() } },
                { busNumber: 'TN-59-N-0003', route: 'Arapalayam to Teppakulam', status: 'active', lastLocation: { lat: 9.9300, lng: 78.1000, speed: 55, timestamp: new Date() } },
                { busNumber: 'TN-59-N-0004', route: 'Anna Nagar to Thirunagar', status: 'active', lastLocation: { lat: 9.9500, lng: 78.1400, speed: 40, timestamp: new Date() } },
                { busNumber: 'TN-59-N-0005', route: 'K.Pudur to Byers Service Road', status: 'maintenance', lastLocation: { lat: 9.9600, lng: 78.1500, speed: 0, timestamp: new Date() } }
            ];

            let driver = await Driver.findOne();
            if (!driver) {
                driver = await Driver.create({ name: 'Mock Driver', licenseNumber: 'DL-MOCK-12345', phone: '9876543210', status: 'active' });
            }
            const busesWithDriver = buses.map(bus => ({ ...bus, driverId: driver._id }));
            await Bus.insertMany(busesWithDriver);
            console.log("Buses Seeded Successfully!");
        } else {
            console.log(`Found ${count} buses.`);
        }

        // Ensure Bus 10 exists
        const bus10 = await Bus.findOne({ busNumber: '10' });
        if (!bus10) {
            console.log("Creating Bus 10 (Madurai to Kalasalingam)...");
            const Driver = require('./models/Driver');
            let driver = await Driver.findOne();
            if (!driver) {
                driver = await Driver.create({ name: 'Mock Driver 10', licenseNumber: 'DL-MOCK-10', phone: '9876543210', status: 'active' });
            }
            await Bus.create({
                busNumber: '10',
                route: 'Madurai to Kalasalingam College',
                status: 'active',
                driverId: driver._id,
                lastLocation: { lat: 9.9252, lng: 78.1198, speed: 60, timestamp: new Date() }
            });
            console.log("Bus 10 Created!");
        }

    } catch (err) {
        console.error("Auto-seed failed:", err);
    }
});

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "https://smart-campus-commute.vercel.app"],
        methods: ["GET", "POST"]
    }
});

app.use(cors({
    origin: ["http://localhost:5173", "https://smart-campus-commute.vercel.app"],
    credentials: true
}));
app.use(express.json());

app.use('/uploads', express.static('uploads'));

// Routes
app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/bus', busRoutes);
app.use('/api/driver', driverRoutes);
app.use('/api/route', require('./routes/routeRoutes'));
app.use('/api/complaint', complaintRoutes);
app.use('/api/device', deviceRoutes);
app.use('/api/analytics', require('./routes/analyticsRoutes'));

// Socket.IO
io.on('connection', (socket) => socketHandler(io, socket));

// Make io accessible globally if needed, or pass it to routes
app.set('io', io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
