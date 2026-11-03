
const EmployeeProfile = require("../models/EmployeeProfile");
const Category = require("../models/Category");
const User = require("../models/User");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const nicRegex = /^(\d{9}[VvXx]|\d{12})$/;
const phoneRegex = /^\+?\d{9,15}$/;

// Multer file → { data, contentType }
const toImage = (file) => ({
  data: file.buffer,
  contentType: file.mimetype,
});

const submitRegistration = async (req, res) => {
  try {
    const b = req.body || {};
    const files = req.files || {};

    const clean = (v) =>
      typeof v === "string" ? v.trim() : "";

    const firstName = clean(b.firstName);
    const lastName = clean(b.lastName);
    const email = clean(b.email).toLowerCase();
    const phone = clean(b.phone).replace(/\s/g, "");
    const address = clean(b.address);
    const nicNumber = clean(b.nicNumber).toUpperCase();
    const skillCategory = clean(b.skillCategory);

    // 1. Required field validation
    if (!firstName || !lastName || !address) {
      return res.status(400).json({
        success: false,
        message: "First name, last name and address are required",
      });
    }

    // 2. Email validation
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "A valid email is required",
      });
    }

    // 3. Phone validation
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "A valid phone number is required",
      });
    }

    // 4. NIC validation
    if (!nicRegex.test(nicNumber)) {
      return res.status(400).json({
        success: false,
        message: "A valid NIC number is required",
      });
    }

    // 5. All three images are required
    if (
      !files.nicFrontImage?.[0] ||
      !files.nicBackImage?.[0] ||
      !files.profilePhoto?.[0]
    ) {
      return res.status(400).json({
        success: false,
        message: "NIC front, NIC back and profile photo are required",
      });
    }

    // 6. Active category validation
    const categoryOk = await Category.exists({
      _id: skillCategory,
      status: "Active",
    });

    if (!categoryOk) {
      return res.status(400).json({
        success: false,
        message: "Please select a valid skill",
      });
    }

    // 7. Duplicate email / NIC validation
    const userExists = await User.exists({ email });

    const requestExists = await EmployeeProfile.exists({
      $or: [{ email }, { nicNumber }],
      registrationStatus: {
        $in: ["Pending Approval", "Approved"],
      },
    });

    if (userExists || requestExists) {
      return res.status(409).json({
        success: false,
        message: "A registration with this email or NIC already exists",
      });
    }

    // 8. Save registration as Pending Approval
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
    });

    return res.status(201).json({
      success: true,
      message:
        "Registration submitted. You will be able to log in after admin approval.",
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
