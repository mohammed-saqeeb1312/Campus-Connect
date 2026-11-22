
const mongoose = require("mongoose");
const Faculty = require("../models/Faculty");

// 1. Add new Faculty
const addFaculty = async (req, res, next) => {
    try {
        // Create faculty record in MongoDB
        const faculty = await Faculty.create(req.body);

        // Send success response
        res.status(201).json({
            message: "Faculty added successfully",
            faculty
        });

    } catch (error) {
        // Forward error to centralized error middleware
        next(error);
    }
};

// 2. Get all Faculty
const getFaculty = async (req, res, next) => {
    try {
        // Fetch all faculty records
        const faculty = await Faculty.find()
            .sort({ createdAt: -1 });

        // Send faculty records
        res.status(200).json({
            count: faculty.length,
            faculty
        });

    } catch (error) {
        // Forward error to centralized error middleware
        next(error);
    }
};

// 3. Get single Faculty by ID
const getFacultyById = async (req, res, next) => {
    try {
        // Validate MongoDB ID
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid faculty ID"
            });
        }

        // Find faculty using MongoDB ID
        const faculty = await Faculty.findById(req.params.id);

        // Check if faculty exists
        if (!faculty) {
            return res.status(404).json({
                message: "Faculty not found"
            });
        }

        // Send faculty details
        res.status(200).json({
            faculty
        });

    } catch (error) {
        // Forward error to centralized error middleware
        next(error);
    }
};

// 4. Update Faculty
const updateFaculty = async (req, res, next) => {
    try {
        // Validate MongoDB ID
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid faculty ID"
            });
        }

        // Find faculty and update details
        const faculty = await Faculty.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        // Check if faculty exists
        if (!faculty) {
            return res.status(404).json({
                message: "Faculty not found"
            });
        }

        // Send updated faculty
        res.status(200).json({
            message: "Faculty updated successfully",
            faculty
        });

    } catch (error) {
        // Forward error to centralized error middleware
        next(error);
    }
};

// 5. Delete Faculty
const deleteFaculty = async (req, res, next) => {
    try {
        // Validate MongoDB ID
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid faculty ID"
            });
        }

        // Find and delete faculty
        const faculty = await Faculty.findByIdAndDelete(
            req.params.id
        );

        // Check if faculty exists
        if (!faculty) {
            return res.status(404).json({
                message: "Faculty not found"
            });
        }

        // Send success response
        res.status(200).json({
            message: "Faculty deleted successfully",
            faculty
        });

    } catch (error) {
        // Forward error to centralized error middleware
        next(error);
    }
};

// Export all controller functions
module.exports = {
    addFaculty,
    getFaculty,
    getFacultyById,
    updateFaculty,
    deleteFaculty
};
