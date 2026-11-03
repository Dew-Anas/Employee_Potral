const express = require("express");
const { login, getMe,updateProfile,changePassword } = require("../controllers/authController");
const { protect, employeeOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/login", login);
router.get("/me", protect, employeeOnly, getMe); 

router.put("/profile", protect, employeeOnly, updateProfile);

router.put("/change-password", protect, employeeOnly, changePassword);

module.exports = router;