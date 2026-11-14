// server/src/models/ServiceRequest.js
// TEMP-DB: Read-only copy of Dev_B's server/models/ServiceRequest.js.
// REAL: Delete this file when Dev_B's model is merged (duplicate model names cause OverwriteModelError).
// Used by: employee jobs API (customer, service, address, description for the job card).

const mongoose = require("mongoose");

const serviceRequestSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    preferredDate: { type: Date, required: true },
    preferredTime: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    images: [{ type: String }],
    status: {
      type: String,
      enum: [
        "submitted",
        "under_review",
        "quotation_sent",
        "accepted",
        "booking_confirmed",
        "in_progress",
        "completed",
        "cancelled",
      ],
      default: "submitted",
    },
    cancellationReason: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ServiceRequest", serviceRequestSchema);