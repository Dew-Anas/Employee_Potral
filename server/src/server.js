
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const registrationRoutes = require("./routes/registrationRoutes");

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

app.use(express.json());

// Authentication Routes
app.use("/api/auth", authRoutes);

//categoryRoutes
app.use("/api/categories",categoryRoutes);

//registration
app.use("/api/registrations", registrationRoutes);


// Server Port
const PORT = process.env.PORT || 5000;

// Connect Database and Start Server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`ServicePro server running on port ${PORT}`);
  });
});
