// server/src/models/Booking.js
// TEMP-DB: Read copy of the shared `bookings` collection for the employee portal.
//          It merges Dev_B's fields (scheduledStart, employee, tasks...) with the fields
//          Dev_A's customer flow really saves (customer, service, address, preferredDate...).
// REAL: Delete this file when the final Booking model is merged
//       (two "Booking" models cause OverwriteModelError).
// TODO(confirm): lead to confirm the final Booking model and status values.
// NOTE: status has NO enum here on purpose (values differ between devs, see utils/bookingStatus.js).
// Used by: employeeJobController, jobStatusController, attendance and completion checks.

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
    quotation: { type: mongoose.Schema.Types.ObjectId, ref: "Quotation" },

    // Fields saved by the customer flow (Dev_A)
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    service: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
    address: { type: String, default: "" },
    preferredDate: { type: Date },
    preferredTime: { type: String },
    confirmedAt: { type: Date },
    completedAt: { type: Date },
    cancelledAt: { type: Date },
    cancellationReason: { type: String, default: "" },
    serviceStartedAt: { type: Date },
    serviceCompletedAt: { type: Date },
    customerSignedOff: { type: Boolean, default: false },
    customerSignedOffAt: { type: Date },

    // Fields used by the admin scheduling / assign flow (Dev_B)
    scheduledStart: { type: Date },
    scheduledEnd: { type: Date },
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    status: { type: String, default: "Pending" },
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

module.exports = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);