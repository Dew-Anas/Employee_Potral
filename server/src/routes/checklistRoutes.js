
const express = require("express");

//Import authentication middleware.

const { protect, employeeOnly } = require("../middleware/authMiddleware");

//Import checklist controller functions.

const {
  getChecklist,
  updateChecklistItem,
} = require("../controllers/checklistController");

//create an express router

const router = express.Router();

// GET - Load checklist items for a booking.

router.get("/:bookingId",protect,employeeOnly,getChecklist);

// PUT - Update one checklist item's status.
router.put("/item/:itemId", protect, employeeOnly, updateChecklistItem);

// Export router so server.js can use it.
module.exports = router;

