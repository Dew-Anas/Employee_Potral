import express from "express";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/customer",
  protect,
  authorize("customer"),
  (req, res) => {
    res.json({
      success: true,
      message: "Customer access granted.",
      user: req.user.email,
    });
  }
);

router.get(
  "/employee",
  protect,
  authorize("employee"),
  (req, res) => {
    res.json({
      success: true,
      message: "Employee access granted.",
      user: req.user.email,
    });
  }
);

router.get(
  "/admin",
  protect,
  authorize("admin"),
  (req, res) => {
    res.json({
      success: true,
      message: "Admin access granted.",
      user: req.user.email,
    });
  }
);

export default router;