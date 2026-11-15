// server/src/controllers/assignmentController.js
// WHY: Employee accepts or declines a job that admin assigned.
// ROUTE: PUT /api/employee/jobs/:id/respond   body: { response: "Accepted" | "Declined", reason? }
// RULES: job is mine + status Assigned + not answered before. Decline reason is optional (user decision).
// TODO(audit): add logAudit once lead confirms the audit module name for assignments.
// TODO(confirm): Declined job stays Assigned in Booking; admin must reassign it (admin side, Dev 2).

const mongoose = require("mongoose");

const Booking = require("../models/Booking");
const AssignmentResponse = require("../models/AssignmentResponse");

const respondToJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { response, reason } = req.body;
    const employeeId = req.user._id;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid job id" });
    }

    if (!["Accepted", "Declined"].includes(response)) {
      return res.status(400).json({ success: false, message: "Invalid response" });
    }

    // Reason is only kept for a decline.
    const declineReason =
      response === "Declined" ? String(reason || "").trim() : "";

    if (declineReason.length > 500) {
      return res.status(400).json({
        success: false,
        message: "Reason must be 500 characters or less",
      });
    }

    // The job must be mine.
    const booking = await Booking.findOne({ _id: id, employee: employeeId });

    if (!booking) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    if (booking.status !== "Assigned") {
      return res.status(400).json({
        success: false,
        message: "Only an assigned job can be answered",
      });
    }

    const saved = await AssignmentResponse.create({
      booking: booking._id,
      employee: employeeId,
      response,
      declineReason,
    });

    return res.status(201).json({
      success: true,
      message: response === "Accepted" ? "Job accepted" : "Job declined",
      response: saved.response,
    });
  } catch (error) {
    // 11000 = unique index: this job was already answered.
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You have already responded to this job",
      });
    }

    console.error("respondToJob error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to save your response",
    });
  }
};

module.exports = { respondToJob };