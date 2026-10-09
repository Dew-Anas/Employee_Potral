import dotenv from "dotenv";

dotenv.config();

import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import connectDB from "../config/db.js";
import User from "../models/User.js";


const createEmployee = async () => {
  try {
    await connectDB();

    const existingEmployee = await User.findOne({
      email: "employee@servicepro.com",
    });

    if (existingEmployee) {
      console.log("Employee already exists.");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(
      "Employee@12345",
      12
    );

    await User.create({
      firstName: "ServicePro",
      lastName: "Employee",
      email: "employee@servicepro.com",
      phone: "+94771111111",
      password: hashedPassword,
      role: "employee",
      isActive: true,
    });

    console.log("Employee created successfully.");

    await mongoose.connection.close();

    process.exit(0);
  } catch (error) {
    console.error(
      "Employee creation failed:",
      error.message
    );

    process.exit(1);
  }
};

createEmployee();