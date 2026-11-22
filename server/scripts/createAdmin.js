require("dotenv").config();

const bcrypt = require("bcryptjs");

const connectDB = require("../config/db");
const User = require("../models/User");

async function createAdmin() {

    try {

        await connectDB();

        const existingAdmin = await User.findOne({
            email: process.env.ADMIN_EMAIL
        });

        if (existingAdmin) {

            console.log("Admin already exists");
            process.exit(0);

        }

        // Hash password
        const hashedPassword = await bcrypt.hash(
            process.env.ADMIN_PASSWORD,
            10
        );

        // Create admin
        await User.create({

            name: process.env.ADMIN_NAME,
            email: process.env.ADMIN_EMAIL,
            password: hashedPassword,
            role: "admin"

        });

        console.log("Admin created successfully");

        process.exit(0);

    } catch (error) {

        console.log("Admin creation failed:", error.message);
        process.exit(1);

    }
}

createAdmin();