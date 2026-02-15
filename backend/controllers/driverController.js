const Driver = require('../models/Driver');

const createDriver = async (req, res) => {
    try {
        const driver = await Driver.create(req.body);
        res.status(201).json(driver);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getDrivers = async (req, res) => {
    try {
        const drivers = await Driver.find();
        res.json(drivers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const rateDriver = async (req, res) => {
    const { rating, comment } = req.body;
    const driverId = req.params.id;

    try {
        const driver = await Driver.findById(driverId);
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        const review = {
            userId: req.user ? req.user._id : null,
            rating: Number(rating),
            comment,
            createdAt: Date.now()
        };

        driver.reviews.push(review);
        driver.totalRatings = driver.reviews.length;
        driver.rating = driver.reviews.reduce((acc, item) => item.rating + acc, 0) / driver.reviews.length;

        await driver.save();
        res.status(201).json({ message: 'Driver rated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createDriver, getDrivers, rateDriver };
