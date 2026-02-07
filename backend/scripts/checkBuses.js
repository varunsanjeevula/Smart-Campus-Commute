const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Bus = require('../models/Bus');

dotenv.config({ path: __dirname + '/../../.env' });

const checkBuses = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');
        const buses = await Bus.find({});
        console.log(`Found ${buses.length} buses.`);
        console.log(JSON.stringify(buses, null, 2));
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkBuses();
