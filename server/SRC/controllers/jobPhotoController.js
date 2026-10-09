import mongoose from "mongoose";

import JobPhoto from "../models/JobPhoto.js";
import Booking from "../models/Booking.js";


// ==========================================
// EMPLOYEE - UPLOAD JOB PHOTO
// ==========================================

export const uploadJobPhoto = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { caption, type } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Photo is required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID.",
      });
    }

    const booking = await Booking.findOne({
      _id: bookingId,
      employee: req.user._id,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message:
          "Booking not found or not assigned to you.",
      });
    }

    if (booking.status !== "in_progress") {
      return res.status(400).json({
        success: false,
        message:
          "Photos can only be uploaded while service is in progress.",
      });
    }

    const photo = await JobPhoto.create({
      booking: bookingId,
      employee: req.user._id,
      imageUrl: `/uploads/job-photos/${req.file.filename}`,
      caption: caption?.trim() || "",
      type: type || "during",
    });

    return res.status(201).json({
      success: true,
      message: "Job photo uploaded successfully.",
      photo,
    });
  } catch (error) {
    console.error("Upload job photo error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to upload job photo.",
    });
  }
};


// ==========================================
// EMPLOYEE - GET JOB PHOTOS
// ==========================================

export const getJobPhotos = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findOne({
      _id: bookingId,
      employee: req.user._id,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message:
          "Booking not found or not assigned to you.",
      });
    }

    const photos = await JobPhoto.find({
      booking: bookingId,
    }).sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      count: photos.length,
      photos,
    });
  } catch (error) {
    console.error("Get job photos error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve job photos.",
    });
  }
};