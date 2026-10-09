import express from "express";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";

import {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
  updateBookingStatus,
  assignEmployee,
  customerSignOff,
} from "../controllers/bookingController.js";

const router = express.Router();


// ==========================================
// CUSTOMER ROUTES
// ==========================================

router.post(
  "/",
  protect,
  authorize("customer"),
  createBooking
);

router.get(
  "/my",
  protect,
  authorize("customer"),
  getMyBookings
);

router.get(
  "/:id",
  protect,
  authorize("customer"),
  getBookingById
);

router.patch(
  "/:id/cancel",
  protect,
  authorize("customer"),
  cancelBooking
);

router.patch(
  "/:id/sign-off",
  protect,
  authorize("customer"),
  customerSignOff
);


// ==========================================
// ADMIN ROUTES
// ==========================================

router.get(
  "/",
  protect,
  authorize("admin"),
  getAllBookings
);

router.patch(
  "/:id/status",
  protect,
  authorize("admin"),
  updateBookingStatus
);

router.patch(
  "/:id/assign",
  protect,
  authorize("admin"),
  assignEmployee
);


export default router;