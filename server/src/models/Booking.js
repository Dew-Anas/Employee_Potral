// server/src/models/Booking.js
// TEMP-DB: Read-only copy of Dev_B's server/models/Booking.js so the employee portal can query bookings.
// REAL: Delete this file when Dev_B's model is merged (two "Booking" models cause OverwriteModelError).
// TODO(confirm): Dev_B Booking model is assumed to be final; lead to confirm (Dev_A has a different schema).
// Used by: employee jobs API (to be written).

const mongoose = require("mongoose");

const bookingTaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    essential: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },
    notes: { type: String, default: "" },
  },
  { _id: true }
);

const bookingPhotoSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Before", "During", "After"],
      required: true,
    },
    url: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const bookingSchema = new mongoose.Schema(
  {
    bookingId: { type: String, required: true, unique: true },
    quotation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quotation",
      required: true,
    },
    scheduledStart: { type: Date, required: true },
    scheduledEnd: { type: Date, required: true },
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    status: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Assigned",
        "In Progress",
        "Completed",
        "Cancelled",
      ],
      default: "Pending",
    },
    tasks: [bookingTaskSchema],
    photos: [bookingPhotoSchema],
    signoff: {
      type: String,
      enum: ["Pending", "Signed Off", "Issue Flagged"],
      default: "Pending",
    },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);