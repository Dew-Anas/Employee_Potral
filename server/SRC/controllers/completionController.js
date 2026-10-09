import mongoose from "mongoose";

import Booking from "../models/Booking.js";
import ChecklistItem from "../models/ChecklistItem.js";
import JobPhoto from "../models/JobPhoto.js";
import Attendance from "../models/Attendance.js";
import ServiceRequest from "../models/ServiceRequest.js";
import Quotation from "../models/Quotation.js";
import { createInvoiceForBooking } from "../utils/invoiceHelper.js";


// ==========================================
// EMPLOYEE - COMPLETE SERVICE
// ==========================================

export const completeService = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID.",
      });
    }

    const booking = await Booking.findOne({
      _id: id,
      employee: req.user._id,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message:
          "Booking not found or not assigned to you.",
      });
    }

    if (booking.status !== "in_progress") {
      return res.status(400).json({
        success: false,
        message:
          "Only an in-progress booking can be completed.",
      });
    }

    // ------------------------------------------
    // CHECKLIST GATE
    // ------------------------------------------

    const requiredChecklist =
      await ChecklistItem.find({
        booking: booking._id,
        isRequired: true,
      });

    const incompleteChecklist =
      requiredChecklist.filter(
        (item) => !item.completed
      );

    if (incompleteChecklist.length > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Complete all required checklist items before finishing the service.",
        incompleteItems: incompleteChecklist.map(
          (item) => ({
            id: item._id,
            title: item.title,
          })
        ),
      });
    }

    // ------------------------------------------
    // PHOTO GATE
    // ------------------------------------------

    const photoCount = await JobPhoto.countDocuments({
      booking: booking._id,
    });

    if (photoCount === 0) {
      return res.status(400).json({
        success: false,
        message:
          "At least one job photo is required before completion.",
      });
    }

    // ------------------------------------------
    // ATTENDANCE GATE
    // ------------------------------------------

    const attendance = await Attendance.findOne({
      booking: booking._id,
      employee: req.user._id,
    });

    if (!attendance || !attendance.clockIn) {
      return res.status(400).json({
        success: false,
        message:
          "Employee must clock in before completing the service.",
      });
    }

    if (!attendance.clockOut) {
      return res.status(400).json({
        success: false,
        message:
          "Employee must clock out before completing the service.",
      });
    }

    // ------------------------------------------
    // COMPLETE BOOKING
    // ------------------------------------------

    booking.status = "completed";
    booking.serviceCompletedAt = new Date();
    booking.completedAt = new Date();

    await booking.save();

    const quotation = await Quotation.findById(booking.quotation);

    if (quotation?.request) {
      await ServiceRequest.findByIdAndUpdate(quotation.request, {
        status: "completed",
      });
    }

    await createInvoiceForBooking(booking._id);

    return res.status(200).json({
      success: true,
      message: "Service completed successfully.",
      booking,
    });
  } catch (error) {
    console.error("Complete service error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to complete service.",
    });
  }
};