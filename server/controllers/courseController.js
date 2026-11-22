
const mongoose = require("mongoose");
const Course = require("../models/Course");

// 1. Add New Course
const addCourse = async (req, res, next) => {
    try {
        // Save new course in MongoDB
        const course = await Course.create(req.body);

        // Send success response
        res.status(201).json({
            message: "Course added successfully",
            course
        });

    } catch (error) {
        // Forward error to centralized error middleware
        next(error);
    }
};

// 2. Get All Courses
const getCourses = async (req, res, next) => {
    try {
        // Fetch all courses, newest first
        const courses = await Course.find()
            .sort({ createdAt: -1 });

        // Send course records
        res.status(200).json({
            count: courses.length,
            courses
        });

    } catch (error) {
        // Forward error to centralized error middleware
        next(error);
    }
};

// 3. Get Single Course
const getCourseById = async (req, res, next) => {
    try {
        // Validate MongoDB ID
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid course ID"
            });
        }

        // Find course using MongoDB ID
        const course = await Course.findById(req.params.id);

        // Check if course exists
        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        // Send course details
        res.status(200).json({
            course
        });

    } catch (error) {
        // Forward error to centralized error middleware
        next(error);
    }
};

// 4. Update Course
const updateCourse = async (req, res, next) => {
    try {
        // Validate MongoDB ID
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid course ID"
            });
        }

        // Find course and update its details
        const course = await Course.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        // Check if course exists
        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        // Send updated course
        res.status(200).json({
            message: "Course updated successfully",
            course
        });

    } catch (error) {
        // Forward error to centralized error middleware
        next(error);
    }
};

// 5. Delete Course
const deleteCourse = async (req, res, next) => {
    try {
        // Validate MongoDB ID
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid course ID"
            });
        }

        // Find and delete course
        const course = await Course.findByIdAndDelete(
            req.params.id
        );

        // Check if course exists
        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        // Send success response
        res.status(200).json({
            message: "Course deleted successfully",
            course
        });

    } catch (error) {
        // Forward error to centralized error middleware
        next(error);
    }
};

// Export controller functions
module.exports = {
    addCourse,
    getCourses,
    getCourseById,
    updateCourse,
    deleteCourse
};
