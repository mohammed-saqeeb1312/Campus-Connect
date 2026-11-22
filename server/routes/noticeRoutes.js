
const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    addNotice,
    getNotices,
    getNoticeById,
    updateNotice,
    deleteNotice
} = require("../controllers/noticeController");

// Protect all notice APIs using JWT
router.post("/", protect, addNotice);
router.get("/", protect, getNotices);
router.get("/:id", protect, getNoticeById);
router.put("/:id", protect, updateNotice);
router.delete("/:id", protect, deleteNotice);

module.exports = router;
