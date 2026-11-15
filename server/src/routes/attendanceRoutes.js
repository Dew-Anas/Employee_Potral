// server/src/routes/attendanceRoutes.js
// WHY: Attendance routes for the logged-in employee.
// MOUNT: /api/attendance (server.js)
// Controller: controllers/attendanceController.js

const express = require("express");

const { protect, employeeOnly } = require("../middleware/authMiddleware");

const {
  clockIn,
  clockOut,
  getToday,
  getHistory,
} = require("../controllers/attendanceController");

const router = express.Router();

// Employee Clock In
router.post("/clock-in", protect, employeeOnly, clockIn);

// Employee Clock Out
router.post("/clock-out", protect, employeeOnly, clockOut);

// Get Today's Attendance
router.get("/today", protect, employeeOnly, getToday);

// Get attendance history (date range)
router.get("/history", protect, employeeOnly, getHistory);

module.exports = router;