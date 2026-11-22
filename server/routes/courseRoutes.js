
const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    addCourse,
    getCourses,
    getCourseById,
    updateCourse,
    deleteCourse
} = require("../controllers/courseController");

// Protect all course APIs using JWT
router.post("/", protect, addCourse);
router.get("/", protect, getCourses);
router.get("/:id", protect, getCourseById);
router.put("/:id", protect, updateCourse);
router.delete("/:id", protect, deleteCourse);

module.exports = router;
