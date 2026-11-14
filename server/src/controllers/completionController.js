// server/src/controllers/completionController.js
// WHY: Completion Gate. Tells the employee app whether a booking can be completed.
// ROUTE: GET /api/completion/:bookingId/gate (routes/completionRoutes.js; protect + employeeOnly)
// RULES (lead, 13 Nov): Before + In Progress + After photos AND at least one work note.
//        Checklist is read-only for employees, so it is NOT checked. Signature is optional.
// REUSE: checkCompletion() is also called by jobStatusController.completeJob.
// MODELS: JobPhoto, JobNote
// RETURNS: { success, allowed, missing[] }

const mongoose = require("mongoose");

const JobPhoto = require("../models/JobPhoto");
const JobNote = require("../models/JobNote");

// Required photo stages for completing a job
const REQUIRED_STAGES = ["Before", "In Progress", "After"];

// Returns the list of missing requirements (empty list = can complete).
const checkCompletion = async (bookingId, employeeId) => {
  const missing = [];

  // At least one work note is mandatory.
  const noteCount = await JobNote.countDocuments({
    booking: bookingId,
    employee: employeeId,
  });

  if (noteCount === 0) {
    missing.push("Add a work note");
  }

  // Uploaded photo stages for this employee and booking.
  const uploadedPhotos = await JobPhoto.find({
    booking: bookingId,
    employee: employeeId,
  }).select("stage -_id");

  const uploadedStages = new Set(uploadedPhotos.map((photo) => photo.stage));

  REQUIRED_STAGES.forEach((stage) => {
    if (!uploadedStages.has(stage)) {
      missing.push(`Upload ${stage} photo`);
    }
  });

  return missing;
};

// GET /api/completion/:bookingId/gate
const getCompletionGate = async (req, res) => {
  try {
    const { bookingId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
    }

    const missing = await checkCompletion(bookingId, req.user._id);

    return res.status(200).json({
      success: true,
      allowed: missing.length === 0,
      missing,
    });
  } catch (error) {
    console.error("getCompletionGate error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to check completion requirements",
    });
  }
};

module.exports = {
  getCompletionGate,
  checkCompletion,
};