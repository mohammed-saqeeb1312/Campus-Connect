
const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    addStudent,
    getStudents,
    getStudentById,
    updateStudent,
    deleteStudent
} = require("../controllers/studentController");

// POST - Add Student
router.post("/", protect, addStudent);

// GET - Get All Students
router.get("/", protect, getStudents);

// get single student data
router.get("/:id", protect, getStudentById);

// PUT - Update Student
router.put("/:id",protect, updateStudent);

// Del - delete syudent
router.delete("/:id",protect, deleteStudent);




module.exports = router;