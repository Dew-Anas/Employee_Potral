
const mongoose = require("mongoose");
const JobPhoto = require("../models/JobPhoto");

const STAGES = ["Before", "In Progress", "After"];

// POST /api/photos/:bookingId
const uploadPhoto = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { stage } = req.body;

    if (!mongoose.isValidObjectId(bookingId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking id",
      });
    }

    if (!STAGES.includes(stage)) {
      return res.status(400).json({
        success: false,
        message: "Stage must be Before, In Progress or After",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please choose a photo",
      });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const photo = await JobPhoto.create({
      booking: bookingId,
      employee: req.user._id,
      stage,
      data: req.file.buffer,
      contentType: req.file.mimetype,
    });

    return res.status(201).json({
      success: true,
      message: "Photo uploaded successfully",
      photo: {
        _id: photo._id,
        booking: photo.booking,
        employee: photo.employee,
        stage: photo.stage,
        contentType: photo.contentType,
        uploadedAt: photo.uploadedAt,
      },
    });
  } catch (err) {
    console.error("uploadPhoto error:", err.message);

    return res.status(500).json({
      success: false,
      message: "Failed to upload photo",
    });
  }
};

// GET /api/photos/:bookingId
// Returns photo details without image binary
const getPhotos = async (req, res) => {
  try {
    const { bookingId } = req.params;

    if (!mongoose.isValidObjectId(bookingId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking id",
      });
    }

    const photos = await JobPhoto.find({
      booking: bookingId,
      employee: req.user._id,
    }).sort({ uploadedAt: 1 });

    return res.json({
      success: true,
      photos,
    });
  } catch (err) {
    console.error("getPhotos error:", err.message);

    return res.status(500).json({
      success: false,
      message: "Failed to load photos",
    });
  }
};

// GET /api/photos/image/:photoId
// Returns image binary
const getPhotoImage = async (req, res) => {
  try {
    const { photoId } = req.params;

    if (!mongoose.isValidObjectId(photoId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid photo id",
      });
    }

    const photo = await JobPhoto.findOne({
      _id: photoId,
      employee: req.user._id,
    }).select("+data");

    if (!photo) {
      return res.status(404).json({
        success: false,
        message: "Photo not found",
      });
    }

    res.set("Content-Type", photo.contentType);

    return res.send(photo.data);
  } catch (err) {
    console.error("getPhotoImage error:", err.message);

    return res.status(500).json({
      success: false,
      message: "Failed to load photo",
    });
  }
};

module.exports = {
  uploadPhoto,
  getPhotos,
  getPhotoImage,
};
