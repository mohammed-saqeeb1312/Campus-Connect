
const mongoose = require("mongoose");
const Attendance = require("../models/Attendance");
const Student = require("../models/Student");

// Validate date format and actual calendar date
function isValidDate(date) {
    if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return false;
    }

    const parsedDate = new Date(`${date}T00:00:00.000Z`);

    return !Number.isNaN(parsedDate.getTime()) &&
        parsedDate.toISOString().slice(0, 10) === date;
}

// 1. Mark Student Attendance
const markAttendance = async (req, res, next) => {
    try {
        const { student, date, status } = req.body;

        // Check required fields
        if (!student || !date || !status) {
            return res.status(400).json({
                message: "Student, date and status are required"
            });
        }

        // Validate MongoDB student ID
        if (!mongoose.isValidObjectId(student)) {
            return res.status(400).json({
                message: "Invalid student ID"
            });
        }

        // Validate attendance date
        if (!isValidDate(date)) {
            return res.status(400).json({
                message: "Invalid date. Use YYYY-MM-DD format"
            });
        }

        // Validate attendance status
        if (!["Present", "Absent"].includes(status)) {
            return res.status(400).json({
                message: "Status must be Present or Absent"
            });
        }

        // Check whether student exists
        const existingStudent = await Student.findById(student);

        if (!existingStudent) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        // Normalize date to UTC start of the day
        const attendanceDate = new Date(`${date}T00:00:00.000Z`);

        // Create attendance record
        const attendance = await Attendance.create({
            student,
            date: attendanceDate,
            status
        });

        // Send success response
        res.status(201).json({
            message: "Attendance marked successfully",
            attendance
        });

    } catch (error) {
        // Forward error to centralized error middleware
        next(error);
    }
};

// 2. Get Attendance Records by Date
const getAttendanceByDate = async (req, res, next) => {
    try {
        const { date } = req.query;

        // Check required date
        if (!date) {
            return res.status(400).json({
                message: "Please provide a date"
            });
        }

        // Validate date format
        if (!isValidDate(date)) {
            return res.status(400).json({
                message: "Invalid date. Use YYYY-MM-DD format"
            });
        }

        // Calculate selected day's UTC boundaries
        const startDate = new Date(`${date}T00:00:00.000Z`);
        const endDate = new Date(startDate);
        endDate.setUTCDate(endDate.getUTCDate() + 1);

        // Fetch attendance and student details
        const attendance = await Attendance.find({
            date: {
                $gte: startDate,
                $lt: endDate
            }
        }).populate("student", "name email department year");

        // Send attendance records
        res.status(200).json({
            count: attendance.length,
            attendance
        });

    } catch (error) {
        // Forward error to centralized error middleware
        next(error);
    }
};

// 3. Get Student Attendance History
const getStudentAttendance = async (req, res, next) => {
    try {
        const { studentId } = req.params;

        // Validate student ID
        if (!mongoose.isValidObjectId(studentId)) {
            return res.status(400).json({
                message: "Invalid student ID"
            });
        }

        // Check whether student exists
        const student = await Student.findById(studentId);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        // Fetch student's attendance history
        const attendance = await Attendance.find({
            student: studentId
        })
            .sort({ date: -1 })
            .populate("student", "name email department year");

        // Send attendance history
        res.status(200).json({
            count: attendance.length,
            attendance
        });

    } catch (error) {
        // Forward error to centralized error middleware
        next(error);
    }
};

// 4. Update Existing Attendance
const updateAttendance = async (req, res, next) => {
    try {
        const { status } = req.body;

        // Validate attendance ID
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid attendance ID"
            });
        }

        // Validate attendance status
        if (!["Present", "Absent"].includes(status)) {
            return res.status(400).json({
                message: "Status must be Present or Absent"
            });
        }

        // Find and update attendance record
        const attendance = await Attendance.findByIdAndUpdate(
            req.params.id,
            { status },
            {
                new: true,
                runValidators: true
            }
        ).populate("student", "name email department year");

        // Check if attendance exists
        if (!attendance) {
            return res.status(404).json({
                message: "Attendance record not found"
            });
        }

        // Send updated attendance
        res.status(200).json({
            message: "Attendance updated successfully",
            attendance
        });

    } catch (error) {
        // Forward error to centralized error middleware
        next(error);
    }
};

// Export controller functions
module.exports = {
    markAttendance,
    getAttendanceByDate,
    getStudentAttendance,
    updateAttendance
};
