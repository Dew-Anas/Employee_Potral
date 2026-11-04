const express = require("express");

const { uploadRegistrationFiles } = require("../middleware/uploadMiddleware");
const { submitRegistration } = require("../controllers/registrationController");

const router = express.Router();

// Debug
console.log("uploadRegistrationFiles:", typeof uploadRegistrationFiles);
console.log("submitRegistration:", typeof submitRegistration);

// Route
router.post("/", uploadRegistrationFiles, submitRegistration);

module.exports = router;