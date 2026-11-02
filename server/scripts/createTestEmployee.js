require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../src/models/User");

const run = async () => {
  const [emailArg, password] = process.argv.slice(2);

  if (!emailArg || !password) {
    console.log("Usage: node scripts/createTestEmployee.js <email> <password>");
    process.exit(1);
  }
  const email = emailArg.trim().toLowerCase();

  await mongoose.connect(process.env.MONGO_URI);

  
  const existing = await User.findOne({ email });
  if (existing) {
    console.log("This email already exists. Nothing was changed.");
    await mongoose.disconnect();
    return;
  }

  const hash = await bcrypt.hash(password, 10); 

  await User.collection.insertOne({
    firstName: "Test",
    lastName: "Employee",
    email: email,
    password: hash,
    role: "EMPLOYEE",
    isActive: true,
    creatAT: new Date(),
    updatedAT: new Date(),
  });

  console.log("Test employee created:", email);
  await mongoose.disconnect();
};

run().catch((err) => {
  console.error("Script failed:", err.message);
  process.exit(1);
});