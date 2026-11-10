
const express = require("express");
const { protect, employeeOnly } = require("../middleware/authMiddleware");
const { uploadJobPhoto } = require("../middleware/uploadMiddleware");

const {
  uploadPhoto,
  getPhotos,
  getPhotoImage,
} = require("../controllers/jobPhotoController");

const router = express.Router();

// POST - Upload job photo
router.post(
  "/:bookingId",
  protect,
  employeeOnly,
  uploadJobPhoto,
  uploadPhoto
);

// GET - Get individual photo image
router.get(
  "/image/:photoId",
  protect,
  employeeOnly,
  getPhotoImage
);

// GET - Get all photos for a booking
router.get(
  "/:bookingId",
  protect,
  employeeOnly,
  getPhotos
);

module.exports = router;
