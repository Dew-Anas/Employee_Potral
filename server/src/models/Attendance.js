
const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    date: {
      type: String,
      required: true,
    },

    clockIn: {
      type: Date,
      required: true,
    },

    clockOut: {
      type: Date,
      default: null,
    },

    workedMinutes: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["Clocked In", "Clocked Out"],
      default: "Clocked In",
    },
  },
  {
    collection: "attendances",
    timestamps: true,
  }
);

// Allow multiple attendance sessions per employee per day
attendanceSchema.index({ employee: 1, date: 1 });

// Only one open attendance session per employee
attendanceSchema.index(
  { employee: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: "Clocked In",
    },
  }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
