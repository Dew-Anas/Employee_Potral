const express = require("express");

const {
  protect,
  employeeOnly,
} = require("../middleware/authMiddleware");

const {
  getChecklist,
  completeItem,
} = require("../controllers/checklistController");

const router = express.Router();

// GET: Employee-ன் booking checklist
router.get(
  "/:bookingId",
  protect,
  employeeOnly,
  getChecklist
);

// PUT: Complete a checklist item
router.put(
  "/item/:itemId/complete",
  protect,
  employeeOnly,
  completeItem
);

module.exports = router;