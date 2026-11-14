// server/src/controllers/jobStatusController.js
// WHY: Start and Complete a job = change Booking.status (Assigned -> In Progress -> Completed).
// ROUTES: PUT /api/employee/jobs/:id/start and /complete (routes/employeeJobRoutes.js)
// START RULES: job is mine + status Assigned + I am clocked in + no other job In Progress + Before photo uploaded.
// COMPLETE RULES: job is mine + status In Progress + Completion Gate passes (3 photos + a note).
// TODO(confirm): Dev_B Booking has no startedAt/completedAt. Times are recorded in auditlogs (logAudit) for now.
// TODO(booking): ask Dev B to add startedAt/completedAt to Booking (work-time calculation needs them).
// TODO(confirm): In Progress photo = 50% (lead). 2-Pending limit is enforced by the admin assign API (Dev 2), not here.

const mongoose = require("mongoose");

const Booking = require("../models/Booking");
const Attendance = require("../models/Attendance");
const JobPhoto = require("../models/JobPhoto");
const logAudit = require("../utils/logAudit");
const { checkCompletion } = require("./completionController");

// PUT /api/employee/jobs/:id/start
const startJob = async (req, res) => {
  try {
    const { id } = req.params;
    const employeeId = req.user._id;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid job id" });
    }

    // The job must be mine.
    const booking = await Booking.findOne({ _id: id, employee: employeeId });

    if (!booking) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    if (booking.status !== "Assigned") {
      return res.status(400).json({
        success: false,
        message: "Only an assigned job can be started",
      });
    }

    // Rule: must be clocked in (an open attendance session has no clockOut).
    const openSession = await Attendance.findOne({
      employee: employeeId,
      clockOut: null,
    });

    if (!openSession) {
      return res.status(400).json({
        success: false,
        message: "Please clock in before starting work",
      });
    }

    // Rule: only one In Progress job at a time.
    const activeJob = await Booking.findOne({
      employee: employeeId,
      status: "In Progress",
    });

    if (activeJob) {
      return res.status(400).json({
        success: false,
        message: "Finish your current job before starting another",
      });
    }

    // Rule: Before photo is mandatory to start.
    const beforePhoto = await JobPhoto.findOne({
      booking: booking._id,
      employee: employeeId,
      stage: "Before",
    }).select("_id");

    if (!beforePhoto) {
      return res.status(400).json({
        success: false,
        message: "Upload a Before photo to start work",
      });
    }

    // Change status only if it is still Assigned (prevents a double start).
    const updated = await Booking.findOneAndUpdate(
      { _id: booking._id, employee: employeeId, status: "Assigned" },
      { status: "In Progress" },
      { new: true }
    );

    if (!updated) {
      return res.status(409).json({
        success: false,
        message: "Job status changed. Please refresh.",
      });
    }

    await logAudit({
      user: employeeId,
      module: "Completion",
      recordId: updated._id,
      action: "Started",
      oldValue: "Assigned",
      newValue: "In Progress",
    });

    return res.json({
      success: true,
      message: "Work started",
      status: updated.status,
    });
  } catch (error) {
    console.error("startJob error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to start work",
    });
  }
};

// PUT /api/employee/jobs/:id/complete
const completeJob = async (req, res) => {
  try {
    const { id } = req.params;
    const employeeId = req.user._id;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid job id" });
    }

    const booking = await Booking.findOne({ _id: id, employee: employeeId });

    if (!booking) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    if (booking.status !== "In Progress") {
      return res.status(400).json({
        success: false,
        message: "Only a job in progress can be completed",
      });
    }

    // Completion Gate: the backend decides, never the UI.
    const missing = await checkCompletion(booking._id, employeeId);

    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Completion requirements are not met",
        missing,
      });
    }

    const updated = await Booking.findOneAndUpdate(
      { _id: booking._id, employee: employeeId, status: "In Progress" },
      { status: "Completed" },
      { new: true }
    );

    if (!updated) {
      return res.status(409).json({
        success: false,
        message: "Job status changed. Please refresh.",
      });
    }

    await logAudit({
      user: employeeId,
      module: "Completion",
      recordId: updated._id,
      action: "Completed",
      oldValue: "In Progress",
      newValue: "Completed",
    });

    return res.json({
      success: true,
      message: "Work completed",
      status: updated.status,
    });
  } catch (error) {
    console.error("completeJob error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to complete work",
    });
  }
};

module.exports = {
  startJob,
  completeJob,
};