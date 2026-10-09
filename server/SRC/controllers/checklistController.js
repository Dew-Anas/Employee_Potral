import mongoose from "mongoose";
import ChecklistItem from "../models/ChecklistItem.js";
import Booking from "../models/Booking.js";


// ==========================================
// ADMIN - CREATE CHECKLIST ITEM
// ==========================================

export const createChecklistItem = async (req, res) => {
  try {
    const { bookingId, title, description, isRequired } = req.body;

    if (!bookingId || !title) {
      return res.status(400).json({
        success: false,
        message: "Booking ID and title are required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID.",
      });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    const item = await ChecklistItem.create({
      booking: bookingId,
      title: title.trim(),
      description: description?.trim() || "",
      isRequired: isRequired !== false,
    });

    return res.status(201).json({
      success: true,
      message: "Checklist item created successfully.",
      item,
    });
  } catch (error) {
    console.error("Create checklist error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create checklist item.",
    });
  }
};


// ==========================================
// EMPLOYEE - GET BOOKING CHECKLIST
// ==========================================

export const getBookingChecklist = async (req, res) => {
  try {
    const { bookingId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID.",
      });
    }

    const booking = await Booking.findOne({
      _id: bookingId,
      employee: req.user._id,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message:
          "Booking not found or not assigned to you.",
      });
    }

    const items = await ChecklistItem.find({
      booking: bookingId,
    }).sort({ createdAt: 1 });

    const total = items.length;
    const completed = items.filter(
      (item) => item.completed
    ).length;

    return res.status(200).json({
      success: true,
      total,
      completed,
      remaining: total - completed,
      items,
    });
  } catch (error) {
    console.error("Get checklist error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve checklist.",
    });
  }
};


// ==========================================
// EMPLOYEE - COMPLETE CHECKLIST ITEM
// ==========================================

export const completeChecklistItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid checklist item ID.",
      });
    }

    const item = await ChecklistItem.findById(itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Checklist item not found.",
      });
    }

    const booking = await Booking.findOne({
      _id: item.booking,
      employee: req.user._id,
    });

    if (!booking) {
      return res.status(403).json({
        success: false,
        message:
          "You are not assigned to this booking.",
      });
    }

    if (booking.status !== "in_progress") {
      return res.status(400).json({
        success: false,
        message:
          "Checklist can only be completed while service is in progress.",
      });
    }

    if (item.completed) {
      return res.status(400).json({
        success: false,
        message: "Checklist item is already completed.",
      });
    }

    item.completed = true;
    item.completedAt = new Date();
    item.completedBy = req.user._id;

    await item.save();

    return res.status(200).json({
      success: true,
      message: "Checklist item completed.",
      item,
    });
  } catch (error) {
    console.error(
      "Complete checklist item error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to complete checklist item.",
    });
  }
};