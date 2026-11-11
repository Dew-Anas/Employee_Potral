
 

const mongoose = require("mongoose");
const JobNote = require("../models/JobNote");

// POST /api/notes   body: { bookingId, type, text }
const createNote = async (req, res) => {
  try {
    const { bookingId, type, text } = req.body;

    // Reject a malformed booking id before touching the database.
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({
        message: "Invalid booking id",
      });
    }

    // Accept only Note or Incident.
    if (!["Note", "Incident"].includes(type)) {
      return res.status(400).json({
        message: "Type must be Note or Incident",
      });
    }

    // Ensure text is a string, not empty, and within 1000 characters.
    if (
      typeof text !== "string" ||
      text.trim().length === 0 ||
      text.trim().length > 1000
    ) {
      return res.status(400).json({
        message: "Text must contain 1 to 1000 characters",
      });
    }

    
    const note = await JobNote.create({
      booking: bookingId,
      employee: req.user._id,
      type,
      text: text.trim(),
    });

    // Return the created note.
    return res.status(201).json({ note });
  } catch (error) {
    console.error("createNote error:", error);

    return res.status(500).json({
      message: "Unable to save note",
    });
  }
};

// GET /api/notes/:bookingId
// Return only the logged-in employee's own notes, newest first.
const getNotes = async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Reject a malformed booking id.
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({
        message: "Invalid booking id",
      });
    }

    // Find notes belonging to this booking and employee.
    const notes = await JobNote.find({
      booking: bookingId,
      employee: req.user._id,
    }).sort({ createdAt: -1 });

    // Return the notes.
    return res.json({ notes });
  } catch (error) {
    console.error("getNotes error:", error);

    return res.status(500).json({
      message: "Unable to load notes",
    });
  }
};

// Export controller functions for the routes.
module.exports = {
  createNote,
  getNotes,
};
