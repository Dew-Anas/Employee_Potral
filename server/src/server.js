
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const registrationRoutes = require("./routes/registrationRoutes");

const Attendance = require("./models/Attendance");

const attendanceRoutes = require("./routes/attendanceRoutes"); 

const jobPhotoRoutes = require("./routes/jobPhotoRoutes");

const checklistRoutes = require("./routes/checklistRoutes");

// Import employee job notes routes.
const jobNoteRoutes = require("./routes/jobNoteRoutes");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health Check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ServicePro API is running",
  });
});



// Authentication Routes
app.use("/api/auth", authRoutes);

//categoryRoutes
app.use("/api/categories",categoryRoutes);

//registration
app.use("/api/registrations", registrationRoutes);

//Attendance clock in
app.use("/api/attendance", attendanceRoutes); 



// Job Photo Upload
app.use("/api/photos", jobPhotoRoutes);


// Checklist routes for employee tasks.
app.use("/api/checklists", checklistRoutes);

// Mount employee job notes API.
app.use("/api/notes", jobNoteRoutes);

// Server Port
const PORT = process.env.PORT || 5000;

// Connect Database and Start Server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`ServicePro server running on port ${PORT}`);
  });
});
