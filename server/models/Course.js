
const mongoose = require("mongoose");

// Define the structure of course documents
const courseSchema = new mongoose.Schema({

    courseName: {
        type: String,
        required: true,
        trim: true
    },

    courseCode: {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },

    department: {
        type: String,
        required: true
    },

    duration: {
        type: String,
        required: true
    },

    semester: {
        type: Number,
        required: true,
        min: 1,
        max: 8
    }

}, { timestamps: true });

// Create Course model
const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
