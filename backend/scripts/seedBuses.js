const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Bus = require('../models/Bus');
const Driver = require('../models/Driver');

// Load env vars
const path = require('path');
dotenv.config({ path: 'c:/Users/varun/Desktop/Exl_design project/backend/.env' });

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
