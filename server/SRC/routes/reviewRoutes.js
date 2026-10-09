import express from "express";
import {
  submitReview,
  getMyReviews,
  getApprovedReviews,
  getAllReviews,
  updateReviewStatus,
} from "../controllers/reviewController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/approved", getApprovedReviews);
router.post("/", protect, authorize("customer"), submitReview);
router.get("/my", protect, authorize("customer"), getMyReviews);
router.get("/", protect, authorize("admin"), getAllReviews);
router.patch("/:id/status", protect, authorize("admin"), updateReviewStatus);

export default router;
