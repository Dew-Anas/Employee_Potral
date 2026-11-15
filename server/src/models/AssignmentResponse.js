// server/src/models/AssignmentResponse.js
// WHY: Stores the employee's Accept / Decline answer for an assigned job (collection: assignmentresponses).
// OWNER: Employee portal (Dev 3). Admin screen (Dev 2) only READS declined answers + reason.
// RULE: one answer per employee per booking (unique index).
// Used by: controllers/assignmentController.js, employeeJobController.js, jobStatusController.js

const mongoose = require("mongoose");

const assignmentResponseSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true,
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  response: {
    type: String,
    enum: ["Accepted", "Declined"],
    required: true,
  },
  // Optional message for the admin when declining.
  declineReason: { type: String, trim: true, maxlength: 500, default: "" },
  respondedAt: { type: Date, default: Date.now },
});

// One answer per employee per booking.
assignmentResponseSchema.index({ booking: 1, employee: 1 }, { unique: true });

module.exports = mongoose.model("AssignmentResponse", assignmentResponseSchema);