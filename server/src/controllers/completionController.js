
const mongoose = require("mongoose");

const ChecklistItem = require("../models/ChecklistItem");
const JobPhoto = require("../models/JobPhoto");

// Required photo stages for completing a job
const REQUIRED_STAGES = ["Before", "In Progress", "After"];

// GET /api/completion/:bookingId/gate
const getCompletionGate = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const employeeId = req.user._id;

    // Validate booking ID before querying MongoDB
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
    }

     const missing = [];

     const essentialItems = await ChecklistItem.find({
      booking: bookingId,
      employee: employeeId,
      essential: true,
    }).select("title status");

    // An empty essential checklist must not pass the gate
    if (essentialItems.length === 0) {
      missing.push("Essential checklist items are not configured");
    } else {
      // Find essential items that are not completed
      const pendingItems = essentialItems.filter(
        (item) => item.status !== "Completed"
      );

      pendingItems.forEach((item) => {
        missing.push(`Complete checklist item: ${item.title}`);
      });
    }

   //  Get uploaded photo stages for this employee and booking
    const uploadedPhotos = await JobPhoto.find({
      booking: bookingId,
      employee: employeeId,
    }).select("stage -_id");

    // Convert uploaded stages into a Set to avoid duplicate stages
    const uploadedStages = new Set(
      uploadedPhotos.map((photo) => photo.stage)
    );

    // Check whether all required photo stages exist
    REQUIRED_STAGES.forEach((stage) => {
      if (!uploadedStages.has(stage)) {
        missing.push(`Upload ${stage} photo`);
      }
    });

    // Allow completion only when nothing is missing
    const allowed = missing.length === 0;

    return res.status(200).json({
      success: true,
      allowed,
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
};