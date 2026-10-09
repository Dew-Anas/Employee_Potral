import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import connectDB from "../config/db.js";
import User from "../models/User.js";

const createAdmin = async () => {
  try {
    await connectDB();

    const existingAdmin = await User.findOne({
      email: "admin@servicepro.com",
    });

    if (existingAdmin) {
      console.log("Admin already exists.");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(
      "Admin@12345",
      12
    );

    await User.create({
      firstName: "ServicePro",
      lastName: "Admin",
      email: "admin@servicepro.com",
      phone: "+94770000000",
      password: hashedPassword,
      role: "admin",
      isActive: true,
    });

    console.log("Admin created successfully.");

    await mongoose.connection.close();

    process.exit(0);
  } catch (error) {
    console.error(
      "Admin creation failed:",
      error.message
    );

    process.exit(1);
  }
};

createAdmin();