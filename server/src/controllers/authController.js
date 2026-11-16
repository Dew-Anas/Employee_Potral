// TEMP-DB: Uses the shared `users` collection (owner: Dev_B / admin) and our
// `employeeprofiles` collection (address, NIC, profile photo).
// TODO(merge): Reconcile with Dev_B authController (they register customers only).
// Employee self-registration lives in registrationController (inactive until admin activates).

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const EmployeeProfile = require("../models/EmployeeProfile");

const isEmployeeRole = (role) => String(role || "").toLowerCase() === "employee";
const phoneRegex = /^\+?\d{9,15}$/;

// Show only the last 4 characters of the NIC
const maskNic = (nic) => {
  if (!nic) return null;
  const s = String(nic);
  return s.length <= 4 ? s : `${"•".repeat(s.length - 4)}${s.slice(-4)}`;
};

const profileFilter = (user) => ({ $or: [{ user: user._id }, { email: user.email }] });

// Our profile record for a user. Photos are not selected by default,
// so we check separately whether a photo really exists.
const findProfile = async (user) => {
  const profile = await EmployeeProfile.findOne(profileFilter(user)).lean();
  if (!profile) return null;

  const photoExists = await EmployeeProfile.exists({
    _id: profile._id,
    "profilePhoto.data": { $exists: true },
  });

  return { ...profile, hasPhoto: Boolean(photoExists) };
};

// One response shape for login, /me, /profile and photo changes
const buildUserDto = (user, profile) => ({
  id: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  phone: user.phone || profile?.phone || "",
  role: user.role,
  skills: user.skills || [],
  isActive: user.isActive,
  joinedAt: user.createdAt || profile?.createdAt || null,
  address: profile?.address || "",
  nicMasked: maskNic(profile?.nicNumber),
  hasPhoto: Boolean(profile?.hasPhoto),
});

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    if (!isEmployeeRole(user.role)) {
      return res.status(403).json({ success: false, message: "This portal is for employees only" });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account is not active yet. Please wait for admin approval.",
      });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const profile = await findProfile(user);

    return res.status(200).json({
      success: true,
      token,
      user: buildUserDto(user, profile),
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong. Please try again." });
  }
};

const getMe = async (req, res) => {
  try {
    const profile = await findProfile(req.user);
    return res.status(200).json({ success: true, user: buildUserDto(req.user, profile) });
  } catch (error) {
    console.error("Get me error:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Serves the profile photo to the logged-in employee only
const getMyPhoto = async (req, res) => {
  try {
    const profile = await EmployeeProfile.findOne(profileFilter(req.user)).select("+profilePhoto");

    if (!profile?.profilePhoto?.data) {
      return res.status(404).json({ success: false, message: "No profile photo" });
    }

    res.set("Content-Type", profile.profilePhoto.contentType || "image/jpeg");
    res.set("Cache-Control", "no-store");
    return res.send(profile.profilePhoto.data);
  } catch (error) {
    console.error("Get photo error:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Replace the profile photo (multipart field name: "photo")
const uploadMyPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Please choose an image" });
    }

    const result = await EmployeeProfile.updateOne(profileFilter(req.user), {
      profilePhoto: { data: req.file.buffer, contentType: req.file.mimetype },
    });

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Employee profile record not found. Please contact the administrator.",
      });
    }

    const profile = await findProfile(req.user);
    return res.status(200).json({
      success: true,
      message: "Profile photo updated",
      user: buildUserDto(req.user, profile),
    });
  } catch (error) {
    console.error("Upload photo error:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Remove the profile photo
const removeMyPhoto = async (req, res) => {
  try {
    const result = await EmployeeProfile.updateOne(profileFilter(req.user), {
      $unset: { profilePhoto: "" },
    });

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Employee profile record not found. Please contact the administrator.",
      });
    }

    const profile = await findProfile(req.user);
    return res.status(200).json({
      success: true,
      message: "Profile photo removed",
      user: buildUserDto(req.user, profile),
    });
  } catch (error) {
    console.error("Remove photo error:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, address } = req.body || {};

    if (
      typeof firstName !== "string" ||
      typeof lastName !== "string" ||
      firstName.trim() === "" ||
      lastName.trim() === ""
    ) {
      return res.status(400).json({ message: "First name and last name are required" });
    }

    const changes = { firstName: firstName.trim(), lastName: lastName.trim() };
    const profileChanges = { firstName: changes.firstName, lastName: changes.lastName };

    if (phone !== undefined) {
      const cleanPhone = String(phone).replace(/\s/g, "");
      if (!phoneRegex.test(cleanPhone)) {
        return res.status(400).json({ message: "Enter a valid phone number (9-15 digits)" });
      }
      changes.phone = cleanPhone;
      profileChanges.phone = cleanPhone;
    }

    if (address !== undefined) {
      const cleanAddress = String(address).trim();
      if (!cleanAddress) {
        return res.status(400).json({ message: "Address cannot be empty" });
      }
      profileChanges.address = cleanAddress;
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, changes, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    await EmployeeProfile.updateOne(profileFilter(updatedUser), profileChanges);

    const profile = await findProfile(updatedUser);

    return res.status(200).json({
      message: "Profile updated successfully",
      user: buildUserDto(updatedUser, profile),
    });
  } catch (err) {
    console.error("Update profile error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body || {};

    if (
      typeof currentPassword !== "string" ||
      typeof newPassword !== "string" ||
      !currentPassword ||
      newPassword.length < 8
    ) {
      return res.status(400).json({
        message: "Current password and new password (at least 8 characters) are required",
      });
    }

    if (newPassword === currentPassword) {
      return res.status(400).json({
        message: "New password cannot be the same as current password",
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  login,
  getMe,
  getMyPhoto,
  uploadMyPhoto,
  removeMyPhoto,
  updateProfile,
  changePassword,
};