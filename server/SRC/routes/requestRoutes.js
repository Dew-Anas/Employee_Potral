import express from "express";

import {
  createRequest,
  getMyRequests,
  getRequestById,
  cancelRequest,
  getAllRequests,
  getAdminRequestById,
  updateRequestStatus,
} from "../controllers/requestController.js";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("customer"),
  createRequest
);

router.get(
  "/my",
  protect,
  authorize("customer"),
  getMyRequests
);

router.get(
  "/",
  protect,
  authorize("admin"),
  getAllRequests
);

router.get(
  "/admin/:id",
  protect,
  authorize("admin"),
  getAdminRequestById
);

router.patch(
  "/:id/status",
  protect,
  authorize("admin"),
  updateRequestStatus
);

router.get(
  "/:id",
  protect,
  authorize("customer"),
  getRequestById
);

router.patch(
  "/:id/cancel",
  protect,
  authorize("customer"),
  cancelRequest
);

export default router;