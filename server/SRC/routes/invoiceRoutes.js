import express from "express";
import {
  getMyInvoices,
  getInvoiceById,
  getAllInvoices,
  createInvoiceFromBooking,
  payInvoice,
} from "../controllers/invoiceController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, authorize("admin", "customer"), (req, res, next) => {
  if (req.user.role === "admin") {
    return getAllInvoices(req, res, next);
  }

  return getMyInvoices(req, res, next);
});

router.get("/my", protect, authorize("customer"), getMyInvoices);
router.post("/", protect, authorize("admin"), createInvoiceFromBooking);
router.patch("/:id/pay", protect, authorize("customer"), payInvoice);
router.get("/:id", protect, authorize("customer", "admin"), getInvoiceById);

export default router;
