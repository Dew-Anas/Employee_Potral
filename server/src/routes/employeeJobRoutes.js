// server/src/routes/employeeJobRoutes.js
// WHY: Routes for the employee's own assigned jobs.
// MOUNT: /api/employee (server.js)
// Controllers: employeeJobController (read), jobStatusController (start / complete)

const express = require("express");

const { protect, employeeOnly } = require("../middleware/authMiddleware");
const {
  getMyJobs,
  getMyJobById,
} = require("../controllers/employeeJobController");
const {
  startJob,
  completeJob,
} = require("../controllers/jobStatusController");

const router = express.Router();

// Every route here needs a logged-in employee.
router.use(protect, employeeOnly);

router.get("/jobs", getMyJobs);
router.get("/jobs/:id", getMyJobById);
router.put("/jobs/:id/start", startJob);
router.put("/jobs/:id/complete", completeJob);

module.exports = router;