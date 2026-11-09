
const mongoose = require("mongoose");

const checklistItemSchema = new mongoose.Schema(
  {
    // Which booking this checklist belongs to
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },

    // Employee responsible for this checklist
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Copied from checklist template
    title: {
      type: String,
      required: true,
      trim: true,
    },

    essential: {
      type: Boolean,
      default: false,
    },

    order: {
      type: Number,
      default: 0,
    },

    // Checklist task status
    status: {
      type: String,
      enum: ["Pending", "Completed"],
      default: "Pending",
    },

    // Task completion timestamp
    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Prevent duplicate order numbers within the same booking
checklistItemSchema.index(
  { booking: 1, order: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "ChecklistItem",
  checklistItemSchema
);
