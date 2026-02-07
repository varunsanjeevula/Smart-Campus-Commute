const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Bus = require('../models/Bus');
const Driver = require('../models/Driver');

// Load env vars
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

const addBus10 = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Check if Bus 10 exists
        let bus = await Bus.findOne({ busNumber: '10' });
        if (bus) {
            console.log('Bus 10 already exists. Updating...');
            bus.route = 'Madurai to Kalasalingam College';
            bus.lastLocation = { lat: 9.9252, lng: 78.1198, speed: 60, timestamp: new Date() };
            bus.status = 'active';
            await bus.save();
        } else {
            console.log('Creating Bus 10...');
            let driver = await Driver.findOne();
            if (!driver) {
                driver = await Driver.create({
                    name: 'Mock Driver',
                    licenseNumber: 'DL-MOCK-12345',
                    phone: '9876543210',
                    status: 'active'
                });
            }

            bus = await Bus.create({
                busNumber: '10',
                route: 'Madurai to Kalasalingam College',
                status: 'active',
                driverId: driver._id,
                lastLocation: { lat: 9.9252, lng: 78.1198, speed: 60, timestamp: new Date() }
            });
        }

        console.log('Bus 10 is ready!');
        process.exit();
    } catch (error) {
        console.error('Error adding Bus 10:', error);
        process.exit(1);
    }
};

addBus10();
