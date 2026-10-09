import express from "express";

import {
  createQuotation,
  getAllQuotations,
  getMyQuotations,
  getQuotationById,
  updateQuotation,
  deleteQuotation,
  acceptQuotation,
  rejectQuotation,
} from "../controllers/quotationController.js";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Customer routes
|--------------------------------------------------------------------------
*/

router.get(
  "/my",
  protect,
  authorize("customer"),
  getMyQuotations
);

router.patch(
  "/:id/accept",
  protect,
  authorize("customer"),
  acceptQuotation
);

router.patch(
  "/:id/reject",
  protect,
  authorize("customer"),
  rejectQuotation
);

/*
|--------------------------------------------------------------------------
| Admin routes
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  protect,
  authorize("admin"),
  createQuotation
);

router.get(
  "/",
  protect,
  authorize("admin"),
  getAllQuotations
);

router.put(
  "/:id",
  protect,
  authorize("admin"),
  updateQuotation
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteQuotation
);

/*
|--------------------------------------------------------------------------
| Customer quotation details
|--------------------------------------------------------------------------
*/

router.get(
  "/:id",
  protect,
  authorize("customer"),
  getQuotationById
);

export default router;