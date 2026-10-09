import express from "express";

import {
  getMyAssignedBookings,
  getAssignedBookingById,
  startService,
  clockIn,
  clockOut,
  updateJobNotes,
} from "../controllers/bookingController.js";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";



const router = express.Router();


// Employee - My assigned jobs
router.get(
  "/my",
  protect,
  authorize("employee"),
  getMyAssignedBookings
);


// Employee - Job details
router.get(
  "/:id",
  protect,
  authorize("employee"),
  getAssignedBookingById
);

router.patch(
  "/:id/start",
  protect,
  authorize("employee"),
  startService
);

router.patch(
  "/:id/clock-in",
  protect,
  authorize("employee"),
  clockIn
);

router.patch(
  "/:id/clock-out",
  protect,
  authorize("employee"),
  clockOut
);

router.patch(
  "/:id/notes",
  protect,
  authorize("employee"),
  updateJobNotes
);

export default router;