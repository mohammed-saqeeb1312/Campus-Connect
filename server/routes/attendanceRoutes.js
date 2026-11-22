
const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    markAttendance,
    getAttendanceByDate,
    getStudentAttendance,
    updateAttendance
} = require("../controllers/attendanceController");

// Protect attendance APIs using JWT
router.post("/", protect, markAttendance);
router.get("/", protect, getAttendanceByDate);
router.get("/student/:studentId", protect, getStudentAttendance);
router.put("/:id", protect, updateAttendance);
module.exports = router;
