//read user colection in db

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: String,
    password: String, // bcrypt hash
    role: String, // employee = "EMPLOYEE"
    isActive: Boolean,
  },

  {
    timestamps: false, 
    collection: "users", 
  }
);

module.exports = mongoose.model("User", userSchema);