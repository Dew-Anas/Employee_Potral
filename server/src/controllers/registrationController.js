// TEMP-DB: Writes to the shared `users` collection (owner: Dev_B / admin) so the
// admin Users page shows the registration, plus our own `employeeprofiles` collection
// (NIC, photos, address). Employee stays inactive until admin activates the account.
// TODO(merge): Dev_B should add address / nicNumber / profile fields to their User schema
// if admin needs to see them.

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const EmployeeProfile = require("../models/EmployeeProfile");
const Category = require("../models/Category");
const User = require("../models/User");
const { isValidEmail } = require("../utils/validators");

const nicRegex = /^(\d{9}[VvXx]|\d{12})$/;
const phoneRegex = /^\+?\d{9,15}$/;

// Multer file -> { data, contentType }
const toImage = (file) => ({
  data: file.buffer,
  contentType: file.mimetype,
});

const submitRegistration = async (req, res) => {
  try {
    const b = req.body || {};
    const files = req.files || {};

    const clean = (v) => (typeof v === "string" ? v.trim() : "");

    const firstName = clean(b.firstName);
    const lastName = clean(b.lastName);
    const email = clean(b.email).toLowerCase();
    const phone = clean(b.phone).replace(/\s/g, "");
    const address = clean(b.address);
    const nicNumber = clean(b.nicNumber).toUpperCase();
    const skillCategory = clean(b.skillCategory);
    const password = typeof b.password === "string" ? b.password : "";

    // 1. Required fields
    if (!firstName || !lastName || !address) {
      return res.status(400).json({
        success: false,
        message: "First name, last name and address are required",
      });
    }

    // 2. Email
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid email address, e.g. name@example.com",
      });
    }

    // 3. Phone
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ success: false, message: "A valid phone number is required" });
    }

    // 4. NIC
    if (!nicRegex.test(nicNumber)) {
      return res.status(400).json({ success: false, message: "A valid NIC number is required" });
    }

    // 5. Password
    if (password.length < 8) {
      return res
        .status(400)
        .json({ success: false, message: "Password must be at least 8 characters" });
    }

    // 6. Images
    if (!files.nicFrontImage?.[0] || !files.nicBackImage?.[0] || !files.profilePhoto?.[0]) {
      return res.status(400).json({
        success: false,
        message: "NIC front, NIC back and profile photo are required",
      });
    }

    // 7. Active category (its name becomes the employee's skill, same as admin skills)
    if (!mongoose.isValidObjectId(skillCategory)) {
      return res.status(400).json({ success: false, message: "Please select a valid skill" });
    }

    const category = await Category.findOne({ _id: skillCategory, status: "Active" });
    if (!category) {
      return res.status(400).json({ success: false, message: "Please select a valid skill" });
    }

    // 8. Duplicates
    const userExists = await User.exists({ email });
    const requestExists = await EmployeeProfile.exists({
      $or: [{ email }, { nicNumber }],
      registrationStatus: { $in: ["Pending Approval", "Approved"] },
    });

    if (userExists || requestExists) {
      return res.status(409).json({
        success: false,
        message: "A registration with this email or NIC already exists",
      });
    }

    // 9. Create the shared user (inactive until admin activates)
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      role: "employee",
      skills: [category.name],
      isActive: false,
    });

    // 10. Create our profile record; roll back the user if this fails
    try {
      await EmployeeProfile.create({
        firstName,
        lastName,
        email,
        phone,
        address,
        nicNumber,
        skillCategory,
        nicFrontImage: toImage(files.nicFrontImage[0]),
        nicBackImage: toImage(files.nicBackImage[0]),
        profilePhoto: toImage(files.profilePhoto[0]),
        registrationStatus: "Pending Approval",
        user: user._id,
      });
    } catch (profileErr) {
      await User.deleteOne({ _id: user._id });
      throw profileErr;
    }

    return res.status(201).json({
      success: true,
      message: "Registration submitted. You will be able to log in after admin approval.",
    });
  } catch (err) {
    console.error("Registration error:", err.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
};

module.exports = { submitRegistration };