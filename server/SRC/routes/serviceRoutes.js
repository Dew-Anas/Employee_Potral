import express from "express";

import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from "../controllers/serviceController.js";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";

const router = express.Router();

/*
 * Public routes
 */

router.get("/", (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith("Bearer ")) {
    return protect(req, res, () => getServices(req, res, next));
  }

  return getServices(req, res, next);
});

router.get("/:id", getServiceById);

/*
 * Admin routes
 */

router.post(
  "/",
  protect,
  authorize("admin"),
  createService
);

router.put(
  "/:id",
  protect,
  authorize("admin"),
  updateService
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteService
);

export default router;