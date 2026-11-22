const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    addFaculty,
    getFaculty,
    getFacultyById,
    updateFaculty,
    deleteFaculty
} = require("../controllers/facultyController");

// Protect all faculty routes with JWT
router.post("/", protect, addFaculty);
router.get("/", protect, getFaculty);
router.get("/:id", protect, getFacultyById);
router.put("/:id", protect, updateFaculty);
router.delete("/:id", protect, deleteFaculty);

module.exports = router;
