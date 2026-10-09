import express from "express";

import {
  getInvoiceHandoff,
} from "../controllers/invoiceHandoffController.js";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/:bookingId",
  protect,
  authorize("admin"),
  getInvoiceHandoff
);

export default router;