const express = require("express");
const { login, getMe } = require("../controllers/authController");
const { protect, employeeOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/login", login);
router.get("/me", protect, employeeOnly, getMe); 
module.exports = router;