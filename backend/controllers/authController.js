const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        let user = await User.findOne({ email });

        if (user && user.isVerified) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

        if (!user) {
            // Create new unverified user
            user = await User.create({
                name,
                email,
                password,
                role: 'user',
                otp,
                otpExpires,
                isVerified: false
            });
        } else {
            // Update existing unverified user
            user.name = name;
            user.password = password;
            user.otp = otp;
            user.otpExpires = otpExpires;
            await user.save();
        }

        // Send Email
        const message = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2563EB;">Verify Your Account</h2>
                <p>Hello ${name},</p>
                <p>Please use the OTP below to verify your email and complete your registration:</p>
                <div style="background-color: #F3F4F6; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
                    <h1 style="color: #111827; letter-spacing: 5px; margin: 0;">${otp}</h1>
                </div>
                <p>This code is valid for 10 minutes.</p>
            </div>
        `;

        await sendEmail({
            email: user.email,
            subject: 'Verify Your Email',
            html: message
        });

        res.status(200).json({ message: 'OTP sent to email. Please verify to complete registration.' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const sendEmail = require('../utils/emailService');

const sendOtp = async (req, res) => {
    const { email } = req.body;
    try {
        if (!email) return res.status(400).json({ message: "Email is required" });

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

        let user = await User.findOne({ email });

        if (!user) {
            // Create new user
            user = await User.create({
                name: email.split('@')[0], // Default name from email
                email,
                role: 'user',
                otp,
                otpExpires
            });
        } else {
            // Update existing user
            user.otp = otp;
            user.otpExpires = otpExpires;
            await user.save();
        }

        // Send Email
        const message = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2563EB;">Your Login OTP</h2>
                <p>Hello,</p>
                <p>Use the following One-Time Password (OTP) to log in to the Bus Tracking App:</p>
                <div style="background-color: #F3F4F6; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
                    <h1 style="color: #111827; letter-spacing: 5px; margin: 0;">${otp}</h1>
                </div>
                <p>This code is valid for 10 minutes.</p>
                <p style="color: #6B7280; font-size: 12px; margin-top: 30px;">If you did not request this code, please ignore this email.</p>
            </div>
        `;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Your Login OTP',
                html: message
            });
            res.json({ message: 'OTP sent successfully to email' });
        } catch (emailError) {
            console.error("Email send failed:", emailError);
            user.otp = undefined;
            user.otpExpires = undefined;
            await user.save();
            return res.status(500).json({ message: 'Email could not be sent' });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.otp === otp && user.otpExpires > Date.now()) {
            user.isVerified = true;
            user.otp = undefined;
            user.otpExpires = undefined;
            await user.save();

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Invalid or expired OTP' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                token: generateToken(updatedUser._id)
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser, sendOtp, verifyOtp, getUserProfile, updateUserProfile };
