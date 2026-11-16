// TEMP-DB: Copy of the shared `users` collection (owner: Dev_B / admin).
// TODO(merge): Delete this file and import Dev_B's server/models/User.js instead.
// Keep fields aligned with Dev_B's schema so the admin Users page reads our records.

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    email: { type: String, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    password: { type: String }, // bcrypt hash
    role: { type: String }, // admin uses lowercase "employee"; old test data may be "EMPLOYEE"
    skills: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    collection: "users",
  }
);

module.exports = mongoose.models.User || mongoose.model("User", userSchema);