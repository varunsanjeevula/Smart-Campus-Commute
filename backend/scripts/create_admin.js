const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const connectDB = require('../config/db');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const createAdmin = async () => {
    try {
        await connectDB();

        const email = 'admin@gmail.com';
        const password = 'admin';

        let user = await User.findOne({ email });

        if (user) {
            console.log('Admin user exists. Updating password...');
            user.password = password; // Pre-save hook will hash this
            user.role = 'admin';
            user.name = 'Admin';
            await user.save();
            console.log('Admin account updated successfully.');
        } else {
            console.log('Creating new admin user...');
            user = await User.create({
                name: 'Admin',
                email,
                password,
                role: 'admin'
            });
            console.log('Admin account created successfully.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

createAdmin();
