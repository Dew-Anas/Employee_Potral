
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

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

    if (user.role !== "EMPLOYEE") {
      return res.status(403).json({ success: false, message: "This portal is for employees only" });
    }

  
    if (!user.isActive) {
      return res.status(403).json({ success: false, message: "Your account is not active" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message); 
    return res.status(500).json({ success: false, message: "Something went wrong. Please try again." });
  }
};


const getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email,
      role: req.user.role,
    },
  });
};  

const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName } = req.body || {};

    
    if (
      typeof firstName !== "string" ||
      typeof lastName !== "string" ||
      firstName.trim() === "" ||
      lastName.trim() === ""
    ) {
      return res.status(400).json({
        message: "First name and last name are required"
      });
    }


    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        firstName: firstName.trim(),
        lastName: lastName.trim()
      },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser
    });
    

  } catch (err) {
    res.status(500).json({
      message: "Server error"
    });
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

    
   const user = await User.findById(req.user._id)
   if(!user){
    return res.status(404).json({message:"User not found"});
   }

   const isMatch = await bcrypt.compare(currentPassword, user.password);
   if (!isMatch) {
    return res.status(401).json({ message: "Current password is incorrect" });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  return res.status(200).json({
    message: "Password changed successfully",
  });
  } catch (err) {
    res.status(500).json({
      message: "Server error"
    });
  }
};


module.exports = { login, getMe, updateProfile , changePassword};