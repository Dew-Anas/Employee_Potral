import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      unique: true,
    },

    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    clockIn: {
      type: Date,
      default: null,
    },

    clockOut: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: [
        "not_started",
        "clocked_in",
        "clocked_out",
      ],
      default: "not_started",
    },

    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Attendance = mongoose.model(
  "Attendance",
  attendanceSchema
);

export default Attendance;