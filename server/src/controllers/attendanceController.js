
const Attendance = require("../models/Attendance");

// Sri Lanka local date (YYYY-MM-DD)
const todayString = () =>
  new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Colombo",
  });

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

    // TODO: Check whether employee has an In Progress booking
    // before allowing Clock Out.

    const now = new Date();

    // Calculate worked time in minutes
    const workedMinutes = Math.round(
      (now - record.clockIn) / 60000
    );

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

module.exports = {
  clockIn,
  clockOut,
  getToday,
};
