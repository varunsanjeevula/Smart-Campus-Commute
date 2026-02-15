const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Bus = require('../models/Bus');
const Driver = require('../models/Driver');

// Load env vars
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

console.log('Mongo URI:', process.env.MONGO_URI ? 'Defined' : 'Undefined');

const seedData = async () => {
    try {
        console.log('Connecting to DB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Clear existing buses? Maybe not, just insert if not exists.
        // For this task, let's clear to avoid dupes or handle errors gratefully.
        await Bus.deleteMany({});
        console.log('Cleared existing buses');

        // Create a mock driver if none exists
        let driver = await Driver.findOne();
        if (!driver) {
            driver = await Driver.create({
                name: 'Mock Driver',
                licenseNumber: 'DL-MOCK-12345',
                phone: '9876543210',
                status: 'active'
            });
            console.log('Created mock driver');
        }
        const buses = [
            {
                busNumber: 'TN-59-N-0001',
                route: 'Kalasalingam to Madurai',
                status: 'active',
                lastLocation: { lat: 9.9252, lng: 78.1198, speed: 45, timestamp: new Date() }
            },
            {
                busNumber: 'TN-59-N-0002',
                route: 'Periyar to Mattuthavani',
                status: 'active',
                lastLocation: { lat: 9.9155, lng: 78.1118, speed: 30, timestamp: new Date() }
            },
            {
                busNumber: 'TN-59-N-0003',
                route: 'Arapalayam to Teppakulam',
                status: 'active',
                lastLocation: { lat: 9.9300, lng: 78.1000, speed: 55, timestamp: new Date() }
            },
            {
                busNumber: 'TN-59-N-0004',
                route: 'Anna Nagar to Thirunagar',
                status: 'active',
                lastLocation: { lat: 9.9500, lng: 78.1400, speed: 40, timestamp: new Date() }
            },
            {
                busNumber: 'TN-59-N-0005',
                route: 'K.Pudur to Byers Service Road',
                status: 'maintenance',
                lastLocation: { lat: 9.9600, lng: 78.1500, speed: 0, timestamp: new Date() }
            }
        ];
        const busesWithDriver = buses.map(bus => ({ ...bus, driverId: driver._id }));

        await Bus.insertMany(busesWithDriver);
        console.log('Buses Seeded!');

        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
