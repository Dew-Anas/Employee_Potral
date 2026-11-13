
const express = require("express");

const { protect, employeeOnly } = require("../middleware/authMiddleware");

const {
  getCompletionGate,
} = require("../controllers/completionController");

const router = express.Router();

// GET - Check whether an employee can complete a booking
router.get(
  "/:bookingId/gate",
  protect,
  employeeOnly,
  getCompletionGate
);

module.exports = router;