
// Mongoose package ko import kar rahe hain
const mongoose = require("mongoose");

// MongoDB database connect karne ke liye async function
async function connectDB() {

    try {

        // .env file se MongoDB connection string lekar database connect karna
        await mongoose.connect(process.env.MONGO_URI);

        // Agar database successfully connect ho gaya
        console.log("MongoDB Connected Successfully");

    } catch (error) {

        // Agar database connection mein koi error aata hai
        console.log("MongoDB Connection Failed:", error.message);

        // Application ko error code 1 ke saath stop karna
        process.exit(1);
    }
}

// Function ko export kar rahe hain
// Taaki server.js mein ise import karke use kar sakein
module.exports = connectDB;
