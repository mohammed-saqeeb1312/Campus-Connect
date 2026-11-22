
const mongoose = require("mongoose");
const Student = require("../models/Student");

// Escape special characters in search input
const escapeRegex = (value) => {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// Add Student
const addStudent = async (req, res, next) => {
    try {
        // Save new student in MongoDB
        const student = await Student.create(req.body);

        // Send success response
        res.status(201).json({
            message: "Student added successfully",
            student
        });

    } catch (error) {
        // Forward error to centralized error middleware
        next(error);
    }
};

// Get All Students with Search, Filter and Pagination
const getStudents = async (req, res, next) => {
    try {
        // Read query parameters
        const {
            search = "",
            department = "",
            year = "",
            page = 1,
            limit = 5
        } = req.query;

        // Validate pagination values
        const pageNumber = Number(page);
        const limitNumber = Number(limit);

        if (
            !Number.isInteger(pageNumber) ||
            pageNumber < 1 ||
            !Number.isInteger(limitNumber) ||
            limitNumber < 1
        ) {
            return res.status(400).json({
                message: "Invalid page or limit value"
            });
        }

        // Build MongoDB filter conditions
        const filter = {};

        // Search by student name or email
        if (search.trim()) {
            const searchValue = escapeRegex(search.trim());

            filter.$or = [
                {
                    name: {
                        $regex: searchValue,
                        $options: "i"
                    }
                },
                {
                    email: {
                        $regex: searchValue,
                        $options: "i"
                    }
                }
            ];
        }

        // Filter by department
        if (department.trim()) {
            filter.department = department.trim();
        }

        // Filter by academic year
        if (year.trim()) {
            filter.year = year.trim();
        }

        // Set pagination values
        const currentPage = pageNumber;
        const recordsPerPage = Math.min(100, limitNumber);
        const skip = (currentPage - 1) * recordsPerPage;

        // Count matching students
        const totalStudents = await Student.countDocuments(filter);

        // Fetch students for the selected page
        const students = await Student.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(recordsPerPage);

        // Calculate total pages
        const totalPages = Math.ceil(
            totalStudents / recordsPerPage
        );

        // Send student records and pagination details
        res.status(200).json({
            count: students.length,
            totalStudents,
            totalPages,
            currentPage,
            students
        });

    } catch (error) {
        // Forward error to centralized error middleware
        next(error);
    }
};

// Get Single Student
const getStudentById = async (req, res, next) => {
    try {
        // Check MongoDB ID format
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid student ID"
            });
        }

        // Find student by MongoDB ID
        const student = await Student.findById(req.params.id);

        // Check if student exists
        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        // Send student details
        res.status(200).json({
            student
        });

    } catch (error) {
        // Forward error to centralized error middleware
        next(error);
    }
};

// Update Student
const updateStudent = async (req, res, next) => {
    try {
        // Validate MongoDB ID
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid student ID"
            });
        }

        // Update student and validate updated fields
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        // Check if student exists
        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        // Send updated student
        res.status(200).json({
            message: "Student updated successfully",
            student
        });

    } catch (error) {
        // Forward error to centralized error middleware
        next(error);
    }
};

// Delete Student
const deleteStudent = async (req, res, next) => {
    try {
        // Validate MongoDB ID
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid student ID"
            });
        }

        // Find and delete student
        const student = await Student.findByIdAndDelete(
            req.params.id
        );

        // Check if student exists
        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        // Send success response
        res.status(200).json({
            message: "Student deleted successfully",
            student
        });

    } catch (error) {
        // Forward error to centralized error middleware
        next(error);
    }
};

// Export all controller functions
module.exports = {
    addStudent,
    getStudents,
    getStudentById,
    updateStudent,
    deleteStudent
};
