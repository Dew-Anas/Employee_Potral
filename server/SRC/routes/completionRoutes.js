import express from "express";

import {
  completeService,
} from "../controllers/completionController.js";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.patch(
  "/booking/:id",
  protect,
  authorize("employee"),
  completeService
);

export default router;