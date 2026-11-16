// server/src/middleware/authMiddleware.js
// WHY: protect = must be logged in; employeeOnly = must be an employee.
// ROLE CASE: our users have "EMPLOYEE", Dev_B's User model says "employee". Both are accepted until lead decides.
// TODO(confirm): lead to confirm the final role value (then remove the extra case handling).
// Used by: every employee route (attendance, photos, notes, completion, employee jobs).

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
  // Compare in lower case so "EMPLOYEE" and "employee" both work.
  const role = String(req.user.role || "").toLowerCase();

  if (role !== "employee") {
    return res.status(403).json({ success: false, message: "Access denied" });
  }
  next();
};

module.exports = { protect, employeeOnly };