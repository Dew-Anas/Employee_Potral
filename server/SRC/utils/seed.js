import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import connectDB from "../config/db.js";
import User from "../models/User.js";
import Service from "../models/Service.js";

const seedUsers = [
  {
    firstName: "ServicePro",
    lastName: "Admin",
    email: "admin@servicepro.com",
    phone: "+94770000000",
    password: "Admin@12345",
    role: "admin",
  },
  {
    firstName: "ServicePro",
    lastName: "Employee",
    email: "employee@servicepro.com",
    phone: "+94771111111",
    password: "Employee@12345",
    role: "employee",
  },
];

const seedServices = [
  {
    name: "Home Maintenance",
    category: "Maintenance",
    description:
      "Professional maintenance for plumbing fixtures, doors, fittings and general household repairs.",
    price: 15000,
    duration: "2 hours",
  },
  {
    name: "Electrical Services",
    category: "Electrical",
    description:
      "Safe electrical repairs, wiring checks, lighting installation and fault diagnosis.",
    price: 12000,
    duration: "1-2 hours",
  },
  {
    name: "Cleaning Services",
    category: "Cleaning",
    description:
      "Deep cleaning for homes and offices, including kitchens, bathrooms and living areas.",
    price: 8000,
    duration: "2-3 hours",
  },
  {
    name: "Plumbing Services",
    category: "Plumbing",
    description:
      "Leak repairs, pipe fitting, drain clearing and bathroom plumbing support.",
    price: 10000,
    duration: "1-2 hours",
  },
];

const seed = async () => {
  try {
    await connectDB();

    for (const user of seedUsers) {
      const existing = await User.findOne({ email: user.email });

      if (existing) {
        console.log(`${user.role} already exists: ${user.email}`);
        continue;
      }

      const hashedPassword = await bcrypt.hash(user.password, 12);

      await User.create({
        ...user,
        password: hashedPassword,
        isActive: true,
      });

      console.log(`Created ${user.role}: ${user.email}`);
    }

    for (const service of seedServices) {
      const existing = await Service.findOne({ name: service.name });

      if (existing) {
        console.log(`Service already exists: ${service.name}`);
        continue;
      }

      await Service.create(service);
      console.log(`Created service: ${service.name}`);
    }

    await mongoose.connection.close();
    console.log("Seed completed.");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
};

seed();
