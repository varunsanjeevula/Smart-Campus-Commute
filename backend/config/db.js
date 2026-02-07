const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        console.error("---------------------------------------------------");
        console.error("CRITICAL: MongoDB is not running or not accessible.");
        console.error("Please ensure you have MongoDB installed and running.");
        console.error("You can download it from: https://www.mongodb.com/try/download/community");
        console.error("Or update your .env file with a cloud MongoDB URI.");
        console.error("---------------------------------------------------");
        process.exit(1);
    }
};

module.exports = connectDB;
