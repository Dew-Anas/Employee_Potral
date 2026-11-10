


const mongoose = require("mongoose");

const jobPhotoSchema = new mongoose.Schema(
  {
    // TODO(booking): ref "Booking" model is not available yet; only the ObjectId is stored.
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

    // Photo stage
    stage: {
      type: String,
      enum: ["Before", "In Progress", "After"],
      required: true,
    },

    // Image binary data stored in MongoDB
    data: {
      type: Buffer,
      required: true,
      select: false,
    },

    // Supported image formats
    contentType: {
      type: String,
      enum: ["image/jpeg", "image/png"],
      required: true,
    },

    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for retrieving photos by booking and stage
jobPhotoSchema.index({ booking: 1, stage: 1 });

module.exports = mongoose.model("JobPhoto", jobPhotoSchema);
