
const express = require("express");

const{uploadRegistrationFiles}=require("../middleware/uploadMiddleware");

const { submitRegistration } = require("../controllers/registrationController");

const router = express.Router();
router.post("/",uploadRegistrationFiles,submitRegistration);

module.exports=router;