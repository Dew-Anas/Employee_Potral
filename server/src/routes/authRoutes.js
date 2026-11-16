const express = require("express");
const {
  login,
  getMe,
  getMyPhoto,
  uploadMyPhoto,
  removeMyPhoto,
  updateProfile,
  changePassword,
} = require("../controllers/authController");
const { protect, employeeOnly } = require("../middleware/authMiddleware");
// Shared single-image upload (field "photo", JPG/PNG, 2MB)
const { uploadJobPhoto: uploadSingleImage } = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/login", login);
router.get("/me", protect, employeeOnly, getMe);

router.get("/me/photo", protect, employeeOnly, getMyPhoto);
router.put("/me/photo", protect, employeeOnly, uploadSingleImage, uploadMyPhoto);
router.delete("/me/photo", protect, employeeOnly, removeMyPhoto);

router.put("/profile", protect, employeeOnly, updateProfile);

router.put("/change-password", protect, employeeOnly, changePassword);

module.exports = router;