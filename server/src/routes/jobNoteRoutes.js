
const express = require("express");
const router = express.Router();

// Protect routes and allow only employees.
const { protect, employeeOnly } = require("../middleware/authMiddleware");

// Import note controller functions.
const {
  createNote,
  getNotes,
} = require("../controllers/jobNoteController");

// POST /api/notes - Create a new note.
router.post("/", protect, employeeOnly, createNote);

// GET /api/notes/:bookingId - Get notes for a booking.
router.get("/:bookingId", protect, employeeOnly, getNotes);

module.exports = router;
