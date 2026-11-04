
const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  { data: Buffer, contentType: String },
  { _id: false }
);


const employeeProfileSchema = new mongoose.Schema(

    {
    // Employee personal details
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

     lastName: {
      type: String,
      required: true,
      trim: true,
    },

     email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

     phone: {
      type: String,
      required: true,
      trim: true,
    },

     address: {
      type: String,
      required: true,
      trim: true,
    },

    nicNumber: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    // Selected skill category
    skillCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    // Required employee images
    nicFrontImage: {
      type: imageSchema,
      required: true,
      select: false,
    },

     nicBackImage: {
      type: imageSchema,
      required: true,
      select: false,
    },

    profilePhoto: {
      type: imageSchema,
      required: true,
      select: false,
    },

    // Admin approval status
    registrationStatus: {
      type: String,
      enum: ["Pending Approval", "Approved", "Rejected"],
      default: "Pending Approval",
    },

     rejectionReason: {
      type: String,
      trim: true,
    },

     reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    reviewedAt: {
      type: Date,
    },

    // Generated only after admin approval
    employeeId: {
      type: String,
      unique: true,
      sparse: true,
    },
    
     // Linked User account after approval
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
   {
    collection: "employeeprofiles",
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "EmployeeProfile",
  employeeProfileSchema
);

module.exports = mongoose.model("EmployeeProfile", employeeProfileSchema);

