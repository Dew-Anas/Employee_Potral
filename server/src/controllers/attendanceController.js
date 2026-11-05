
const Attendance = require("../models/Attendance");

const todayString = () =>
  new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Colombo",
  });

// R2: Clock In - Multiple sessions allowed
const clockIn = async (req, res) => {
  try {
    // Check whether an open session already exists
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
    // Duplicate open session protection
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


// R3: Clock Out - Close current open session
const clockOut = async (req, res) => {
  try {
    // Find the current open session
    const record = await Attendance.findOne({
      employee: req.user._id,
      status: "Clocked In",
    });

    // No open session found
    if (!record) {
      return res.status(400).json({
        success: false,
        message: "You are not clocked in",
      });
    }

    // TODO: Check In Progress booking before allowing clock out

    const now = new Date();

    // Calculate worked minutes for this session
    const workedMinutes = Math.round(
      (now - record.clockIn) / 60000
    );

    // Update attendance record
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


// R3: Get Today - All sessions and total worked minutes
const getToday = async (req, res) => {
  try {
    const employee = req.user._id;

    // Get all today's attendance sessions
    const sessions = await Attendance.find({
      employee,
      date: todayString(),
    }).sort("clockIn");

    // Find current open session (including previous days)
    const current = await Attendance.findOne({
      employee,
      status: "Clocked In",
    });

    // Calculate total completed minutes for today
    const totalMinutes = sessions.reduce(
      (sum, s) => sum + (s.workedMinutes || 0),
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
