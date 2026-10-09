import express from "express";

import {
  getEmployees,
  getEmployeeById,
  createEmployee,
} from "../controllers/employeeController.js";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";

const router = express.Router();


router.get(
  "/",
  protect,
  authorize("admin"),
  getEmployees
);

router.post(
  "/",
  protect,
  authorize("admin"),
  createEmployee
);


// Admin - Get employee by ID
router.get(
  "/:id",
  protect,
  authorize("admin"),
  getEmployeeById
);

export default router;