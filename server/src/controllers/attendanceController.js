// server/src/controllers/attendanceController.js
// WHY: Attendance for the logged-in employee: Clock In, Clock Out, today's sessions, and date-range history.
// ROUTES: POST /clock-in, POST /clock-out, GET /today, GET /history (routes/attendanceRoutes.js; protect + employeeOnly)
// MODELS: Attendance (many sessions per day, one open session), Booking (to block Clock Out during a job)
// RULES: Clock Out is blocked while a job is In Progress (lead, 5 Nov). "In Progress" is matched in
//        any style ("in_progress" / "In Progress") via utils/bookingStatus.js.
// HANDOFF: GET /history is the employee's own report. Admin / reports read the same attendances data.
// TODO(confirm): admin report endpoint waits for the admin role value (Dev_B enum says "admin", our users say "EMPLOYEE").

const Attendance = require("../models/Attendance");
const Booking = require("../models/Booking");
const { statusIn } = require("../utils/bookingStatus");

// Convert a Date to Sri Lanka local date (YYYY-MM-DD)
const toLocalDate = (date) =>
  date.toLocaleDateString("en-CA", {
    timeZone: "Asia/Colombo",
  });

// Sri Lanka local date for today
const todayString = () => toLocalDate(new Date());

// Check the text looks like YYYY-MM-DD and is a real calendar date.
const isValidDateString = (value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
};

// R2: Clock In
const clockIn = async (req, res) => {
  try {
    // Check whether employee already has an open session
    const open = await Attendance.findOne({
      employee: req.user._id,
      status: "Clocked In",
    });

    if (open) {
      return res.status(409).json({
        success: false,
        message: "You are already clocked in",
      });
    }

    // Create a new attendance session
    const record = await Attendance.create({
      employee: req.user._id,
      date: todayString(),
      clockIn: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: "Clocked in successfully",
      attendance: record,
    });
  } catch (err) {
    // Handle duplicate open session
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You are already clocked in",
      });
    }

    console.error("Clock in error:", err.message);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// R3: Clock Out
const clockOut = async (req, res) => {
  try {
    // Find current open attendance session
    const record = await Attendance.findOne({
      employee: req.user._id,
      status: "Clocked In",
    });

    if (!record) {
      return res.status(400).json({
        success: false,
        message: "You are not clocked in",
      });
    }

    // Rule: no Clock Out while a job is In Progress.
    const activeJob = await Booking.findOne({
      employee: req.user._id,
      status: { $in: statusIn("In Progress") },
    }).select("_id");

    if (activeJob) {
      return res.status(400).json({
        success: false,
        message: "Finish your current job before clocking out",
      });
    }

    const now = new Date();

    // Calculate worked time in minutes
    const workedMinutes = Math.round((now - record.clockIn) / 60000);

    // Update attendance session
    record.clockOut = now;
    record.workedMinutes = workedMinutes;
    record.status = "Clocked Out";

    await record.save();

    return res.status(200).json({
      success: true,
      message: "Clocked out successfully",
      attendance: record,
    });
  } catch (err) {
    console.error("Clock out error:", err.message);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// R3: Get Today's Attendance
const getToday = async (req, res) => {
  try {
    const employee = req.user._id;

    // Get all attendance sessions for today
    const sessions = await Attendance.find({
      employee,
      date: todayString(),
    }).sort("clockIn");

    // Get current open session
    const current = await Attendance.findOne({
      employee,
      status: "Clocked In",
    });

    // Calculate total completed working minutes
    const totalMinutes = sessions.reduce(
      (sum, session) => sum + (session.workedMinutes || 0),
      0
    );

    return res.status(200).json({
      success: true,
      sessions,
      current,
      totalMinutes,
    });
  } catch (err) {
    console.error("Get today attendance error:", err.message);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// GET /api/attendance/history?from=YYYY-MM-DD&to=YYYY-MM-DD
// Default: last 7 days including today. Maximum range: 31 days.
const getHistory = async (req, res) => {
  try {
    const today = todayString();

    // Default range = today and the 6 days before it.
    const defaultFrom = toLocalDate(
      new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
    );

    const from = req.query.from || defaultFrom;
    const to = req.query.to || today;

    if (!isValidDateString(from) || !isValidDateString(to)) {
      return res.status(400).json({
        success: false,
        message: "Dates must be in YYYY-MM-DD format",
      });
    }

    if (from > to) {
      return res.status(400).json({
        success: false,
        message: "'from' date must not be after 'to' date",
      });
    }

    const dayCount =
      (Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) /
        86400000 +
      1;

    if (dayCount > 31) {
      return res.status(400).json({
        success: false,
        message: "Date range must be 31 days or less",
      });
    }

    // The date field is a YYYY-MM-DD string, so string comparison works.
    const sessions = await Attendance.find({
      employee: req.user._id,
      date: { $gte: from, $lte: to },
    })
      .sort({ date: -1, clockIn: 1 })
      .select("date clockIn clockOut workedMinutes status")
      .lean();

    // Group sessions by date.
    const dayMap = new Map();

    sessions.forEach((session) => {
      if (!dayMap.has(session.date)) {
        dayMap.set(session.date, {
          date: session.date,
          totalMinutes: 0,
          sessions: [],
        });
      }

      const day = dayMap.get(session.date);
      day.sessions.push(session);
      // An open session has workedMinutes 0, so it adds nothing until Clock Out.
      day.totalMinutes += session.workedMinutes || 0;
    });

    const days = Array.from(dayMap.values());

    const totalMinutes = days.reduce((sum, day) => sum + day.totalMinutes, 0);

    return res.status(200).json({
      success: true,
      from,
      to,
      days,
      totalMinutes,
    });
  } catch (err) {
    console.error("Get attendance history error:", err.message);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  clockIn,
  clockOut,
  getToday,
  getHistory,
};