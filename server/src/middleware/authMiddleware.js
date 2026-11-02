
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    if (!header.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Not authorized. Please log in." });
    }
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: "Not authorized. Please log in." });
    }

    req.user = user; 
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Session expired. Please log in again." });
  }
};

const employeeOnly = (req, res, next) => {
  if (req.user.role !== "EMPLOYEE") {
    return res.status(403).json({ success: false, message: "Access denied" });
  }
  next();
};

module.exports = { protect, employeeOnly };