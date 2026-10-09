import express from "express";

import {
  createChecklistItem,
  getBookingChecklist,
  completeChecklistItem,
} from "../controllers/checklistController.js";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";

const router = express.Router();


// Admin creates checklist
router.post(
  "/",
  protect,
  authorize("admin"),
  createChecklistItem
);


// Employee gets checklist
router.get(
  "/booking/:bookingId",
  protect,
  authorize("employee"),
  getBookingChecklist
);


// Employee completes checklist item
router.patch(
  "/:itemId/complete",
  protect,
  authorize("employee"),
  completeChecklistItem
);

export default router;