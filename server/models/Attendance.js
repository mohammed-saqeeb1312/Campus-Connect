
const mongoose = require("mongoose");

// Define the structure of attendance records
const attendanceSchema = new mongoose.Schema({

    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true
    },

    date: {
        type: Date,
        required: true
    },

    status: {
        type: String,
        enum: ["Present", "Absent"],
        required: true
    }

}, { timestamps: true });

// Prevent duplicate attendance for the same student on the same day
attendanceSchema.index(
    { student: 1, date: 1 },
    { unique: true }
);

// Create Attendance model
const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;
