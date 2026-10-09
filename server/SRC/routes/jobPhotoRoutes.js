import express from "express";

import {
  uploadJobPhoto,
  getJobPhotos,
} from "../controllers/jobPhotoController.js";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";

import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();


// Upload photo
router.post(
  "/booking/:bookingId",
  protect,
  authorize("employee"),
  upload.single("photo"),
  uploadJobPhoto
);


// Get booking photos
router.get(
  "/booking/:bookingId",
  protect,
  authorize("employee"),
  getJobPhotos
);

export default router;