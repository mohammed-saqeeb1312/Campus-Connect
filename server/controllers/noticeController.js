
const mongoose = require("mongoose");
const Notice = require("../models/Notice");

// 1. Create a New Notice
const addNotice = async (req, res, next) => {
    try {
        // Save notice in MongoDB
        const notice = await Notice.create(req.body);

        // Send success response
        res.status(201).json({
            message: "Notice published successfully",
            notice
        });

    } catch (error) {
        // Forward error to centralized error middleware
        next(error);
    }
};

// 2. Get All Notices
const getNotices = async (req, res, next) => {
    try {
        // Fetch notices with latest first
        const notices = await Notice.find()
            .sort({ createdAt: -1 });

        // Send all notice records
        res.status(200).json({
            count: notices.length,
            notices
        });

    } catch (error) {
        // Forward error to centralized error middleware
        next(error);
    }
};

// 3. Get Single Notice by ID
const getNoticeById = async (req, res, next) => {
    try {
        // Validate MongoDB ID
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid notice ID"
            });
        }

        // Find notice using MongoDB ID
        const notice = await Notice.findById(req.params.id);

        // Check if notice exists
        if (!notice) {
            return res.status(404).json({
                message: "Notice not found"
            });
        }

        // Send notice details
        res.status(200).json({
            notice
        });

    } catch (error) {
        // Forward error to centralized error middleware
        next(error);
    }
};

// 4. Update Existing Notice
const updateNotice = async (req, res, next) => {
    try {
        // Validate MongoDB ID
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid notice ID"
            });
        }

        // Find notice and update its details
        const notice = await Notice.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        // Check if notice exists
        if (!notice) {
            return res.status(404).json({
                message: "Notice not found"
            });
        }

        // Send updated notice
        res.status(200).json({
            message: "Notice updated successfully",
            notice
        });

    } catch (error) {
        // Forward error to centralized error middleware
        next(error);
    }
};

// 5. Delete Notice
const deleteNotice = async (req, res, next) => {
    try {
        // Validate MongoDB ID
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid notice ID"
            });
        }

        // Find and delete notice
        const notice = await Notice.findByIdAndDelete(
            req.params.id
        );

        // Check if notice exists
        if (!notice) {
            return res.status(404).json({
                message: "Notice not found"
            });
        }

        // Send success response
        res.status(200).json({
            message: "Notice deleted successfully",
            notice
        });

    } catch (error) {
        // Forward error to centralized error middleware
        next(error);
    }
};

// Export all controller functions
module.exports = {
    addNotice,
    getNotices,
    getNoticeById,
    updateNotice,
    deleteNotice
};
