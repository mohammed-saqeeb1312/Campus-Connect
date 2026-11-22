
const mongoose = require("mongoose");

// Define the structure of notice documents
const noticeSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        required: true,
        trim: true
    },

    category: {
        type: String,
        enum: ["General", "Academic", "Examination", "Event", "Holiday", "Admission"],
        default: "General"
    },

    publishDate: {
        type: Date,
        default: Date.now
    },

    expiryDate: {
        type: Date
    },

    status: {
        type: String,
        enum: ["Published", "Draft"],
        default: "Published"
    }

}, { timestamps: true });

// Create Notice model
const Notice = mongoose.model("Notice", noticeSchema);

module.exports = Notice;
