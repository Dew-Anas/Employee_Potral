import mongoose from "mongoose";

import Booking from "../models/Booking.js";
import Attendance from "../models/Attendance.js";
import ChecklistItem from "../models/ChecklistItem.js";
import JobPhoto from "../models/JobPhoto.js";


// ==========================================
// ADMIN - GET BOOKING FOR INVOICE HANDOFF
// ==========================================

export const getInvoiceHandoff = async (req, res) => {
  try {
    const { bookingId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID.",
      });
    }

    const booking = await Booking.findById(bookingId)
      .populate(
        "customer",
        "firstName lastName email phone"
      )
      .populate("service")
      .populate(
        "employee",
        "firstName lastName email phone"
      )
      .populate("quotation");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    if (booking.status !== "completed") {
      return res.status(400).json({
        success: false,
        message:
          "Invoice handoff is available only after service completion.",
      });
    }

    const attendance = await Attendance.findOne({
      booking: booking._id,
    });

    const checklist = await ChecklistItem.find({
      booking: booking._id,
    });

    const photos = await JobPhoto.find({
      booking: booking._id,
    });

    return res.status(200).json({
      success: true,

      invoiceHandoff: {
        booking,
        attendance,
        checklist,
        photos,

        serviceCompletedAt:
          booking.serviceCompletedAt,

        customerSignedOff:
          booking.customerSignedOff,

        customerSignedOffAt:
          booking.customerSignedOffAt,
      },
    });
  } catch (error) {
    console.error(
      "Invoice handoff error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to retrieve invoice handoff data.",
    });
  }
};