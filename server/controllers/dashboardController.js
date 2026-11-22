
const Student = require("../models/Student");
const Faculty = require("../models/Faculty");
const Course = require("../models/Course");
const Attendance = require("../models/Attendance");
const Notice = require("../models/Notice");

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
    try {
        const { date } = req.query;

        // Validate date
        if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return res.status(400).json({
                message: "A valid date is required (YYYY-MM-DD)"
            });
        }

        const startDate = new Date(`${date}T00:00:00.000Z`);

        if (
            Number.isNaN(startDate.getTime()) ||
            startDate.toISOString().slice(0, 10) !== date
        ) {
            return res.status(400).json({
                message: "Invalid calendar date"
            });
        }

        const endDate = new Date(startDate);
        endDate.setUTCDate(endDate.getUTCDate() + 1);

        // Get total records
        const totalStudents = await Student.countDocuments();
        const totalFaculty = await Faculty.countDocuments();
        const totalCourses = await Course.countDocuments();

        // Get unique attendance per student
        const attendanceSummary = await Attendance.aggregate([
            {
                $match: {
                    date: {
                        $gte: startDate,
                        $lt: endDate
                    }
                }
            },
            {
                $sort: {
                    _id: 1
                }
            },
            {
                $group: {
                    _id: "$student",
                    status: {
                        $last: "$status"
                    }
                }
            }
        ]);

        // Calculate unique attendance
        const presentToday = attendanceSummary.filter(
            record => record.status === "Present"
        ).length;

        const absentToday = attendanceSummary.filter(
            record => record.status === "Absent"
        ).length;

        const todayAttendance = attendanceSummary.length;

        const notMarkedToday = Math.max(
            0,
            totalStudents - todayAttendance
        );

        // Count published notices
        const totalNotices = await Notice.countDocuments({
            status: "Published"
        });

        // Send dashboard statistics
        res.status(200).json({
            totalStudents,
            totalFaculty,
            totalCourses,
            totalNotices,
            todayAttendance,
            presentToday,
            absentToday,
            notMarkedToday
        });

    } catch (error) {
        console.error("Dashboard Error:", error);

        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = { getDashboardStats };
