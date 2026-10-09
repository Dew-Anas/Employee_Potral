import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Booking from "../models/Booking.js";


// ==========================================
// ADMIN - GET ALL EMPLOYEES
// ==========================================

export const getEmployees = async (req, res) => {
  try {
    const employees = await User.find({
      role: "employee",
      isActive: true,
    }).select(
      "firstName lastName email phone role isActive createdAt"
    );

    return res.status(200).json({
      success: true,
      count: employees.length,
      employees,
    });
  } catch (error) {
    console.error("Get employees error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve employees.",
    });
  }
};


// ==========================================
// ADMIN - GET EMPLOYEE BY ID
// ==========================================

export const createEmployee = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "First name, last name, email and password are required.",
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const employee = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
      role: "employee",
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      message: "Employee created successfully.",
      employee: {
        id: employee._id,
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        phone: employee.phone,
        role: employee.role,
      },
    });
  } catch (error) {
    console.error("Create employee error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create employee.",
    });
  }
};

export const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await User.findOne({
      _id: id,
      role: "employee",
      isActive: true,
    }).select(
      "firstName lastName email phone role isActive createdAt"
    );

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found.",
      });
    }

    return res.status(200).json({
      success: true,
      employee,
    });
  } catch (error) {
    console.error("Get employee error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve employee.",
    });
  }
};