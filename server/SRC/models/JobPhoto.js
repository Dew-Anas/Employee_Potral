import mongoose from "mongoose";

const jobPhotoSchema = new mongoose.Schema(
  {
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

    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },

    caption: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    type: {
      type: String,
      enum: [
        "before",
        "during",
        "after",
      ],
      default: "during",
    },
  },
  {
    timestamps: true,
  }
);

const JobPhoto = mongoose.model(
  "JobPhoto",
  jobPhotoSchema
);

export default JobPhoto;