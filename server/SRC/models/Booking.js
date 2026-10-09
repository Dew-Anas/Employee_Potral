import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    quotation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quotation",
      required: true,
      unique: true,
    },

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

    preferredDate: {
      type: Date,
      required: true,
    },

    preferredTime: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },

    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "assigned",
        "in_progress",
        "completed",
        "cancelled",
      ],
      default: "confirmed",
    },

    confirmedAt: {
      type: Date,
      default: Date.now,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    cancelledAt: {
      type: Date,
      default: null,
    },

    cancellationReason: {
      type: String,
      trim: true,
      default: "",
    },

    serviceStartedAt: {
    type: Date,
    default: null,
    },

    serviceCompletedAt: {
      type: Date,
      default: null,
    },

    customerSignedOff: {
      type: Boolean,
      default: false,
    },

    customerSignedOffAt: {
      type: Date,
      default: null,
    },

    employeeNotes: {
      type: String,
      trim: true,
      maxlength: 3000,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;