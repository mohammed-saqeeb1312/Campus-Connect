const User = require("../models/User");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

// Admin Login
const loginAdmin = async (req, res) => {

    try {

        const { email, password } = req.body;

        // Find admin
        const admin = await User.findOne({
            email,
            role: "admin"
        });

        if (!admin) {

            return res.status(401).json({
                message: "Invalid email or password"
            });

        }

        // Compare password
        const isMatch = await bcrypt.compare(
            password,
            admin.password
        );

        if (!isMatch) {

            return res.status(401).json({
                message: "Invalid email or password"
            });

        }

        // Generate JWT
        const token = jwt.sign(
            {
                id: admin._id,
                role: admin.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.status(200).json({

            message: "Login successful",

            token,

            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }

        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

module.exports = { loginAdmin };