
const express = require("express");

const { protect, employeeOnly } = require("../middleware/authMiddleware");

const {
  clockIn,
  clockOut,
  getToday,
} = require("../controllers/attendanceController");

const router = express.Router();

// Employee Clock In
router.post("/clock-in", protect, employeeOnly, clockIn);

// Employee Clock Out
router.post("/clock-out", protect, employeeOnly, clockOut);

// Get Today's Attendance
router.get("/today", protect, employeeOnly, getToday);

module.exports = router;
