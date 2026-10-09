import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import Quotation from "../models/Quotation.js";
import User from "../models/User.js";
import Attendance from "../models/Attendance.js";
import { ensureDefaultChecklist } from "../utils/checklistHelper.js";

// ==========================================
// CUSTOMER - CREATE BOOKING
// ==========================================

export const createBooking = async (req, res) => {
  try {
    const {
      quotationId,
      preferredDate,
      preferredTime,
      address,
      notes,
    } = req.body;

    if (
      !quotationId ||
      !preferredDate ||
      !preferredTime ||
      !address
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Quotation ID, preferred date, preferred time and address are required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(quotationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid quotation ID.",
      });
    }

    const bookingDate = new Date(preferredDate);

    if (Number.isNaN(bookingDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking date.",
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const normalizedBookingDate = new Date(bookingDate);
    normalizedBookingDate.setHours(0, 0, 0, 0);

    if (normalizedBookingDate < today) {
      return res.status(400).json({
        success: false,
        message: "Booking date cannot be in the past.",
      });
    }

    // Find quotation owned by logged-in customer
    const quotation = await Quotation.findOne({
      _id: quotationId,
      customer: req.user._id,
    }).populate("service");

    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: "Quotation not found.",
      });
    }

    // Booking can only be created for accepted quotation
    if (quotation.status !== "accepted") {
      return res.status(400).json({
        success: false,
        message:
          "Booking can only be created after accepting the quotation.",
      });
    }

    // Prevent duplicate booking
    const existingBooking = await Booking.findOne({
      quotation: quotationId,
    });

    if (existingBooking) {
      return res.status(409).json({
        success: false,
        message: "A booking already exists for this quotation.",
        booking: existingBooking,
      });
    }

    const booking = await Booking.create({
      quotation: quotation._id,
      customer: req.user._id,
      service: quotation.service._id,
      preferredDate: bookingDate,
      preferredTime,
      address,
      notes: notes || "",
      status: "confirmed",
      confirmedAt: new Date(),
    });

    // Update quotation/request relationship
    const populatedBooking = await Booking.findById(booking._id)
      .populate("quotation")
      .populate("customer", "firstName lastName email phone")
      .populate("service")
      .populate("employee", "firstName lastName email phone");

    // Update original service request status
    await mongoose.model("ServiceRequest").findByIdAndUpdate(
      quotation.request,
      {
        status: "booking_confirmed",
      }
    );

    return res.status(201).json({
      success: true,
      message: "Booking created successfully.",
      booking: populatedBooking,
    });
  } catch (error) {
    console.error("Create booking error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create booking.",
    });
  }
};


// ==========================================
// CUSTOMER - GET MY BOOKINGS
// ==========================================

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      customer: req.user._id,
    })
      .populate("quotation")
      .populate("service")
      .populate("employee", "firstName lastName email phone")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Get my bookings error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve bookings.",
    });
  }
};


// ==========================================
// CUSTOMER - GET BOOKING BY ID
// ==========================================

export const getBookingById = async (req, res) => {
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
      customer: req.user._id,
    })
      .populate("quotation")
      .populate("service")
      .populate("employee", "firstName lastName email phone");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    return res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error("Get booking error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve booking.",
    });
  }
};


// ==========================================
// CUSTOMER - CANCEL BOOKING
// ==========================================

export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID.",
      });
    }

    const booking = await Booking.findOne({
      _id: id,
      customer: req.user._id,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    if (
      booking.status === "in_progress" ||
      booking.status === "completed"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "This booking cannot be cancelled after service has started or completed.",
      });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Booking is already cancelled.",
      });
    }

    booking.status = "cancelled";
    booking.cancelledAt = new Date();
    booking.cancellationReason = reason || "";

    await booking.save();

    return res.status(200).json({
      success: true,
      message: "Booking cancelled successfully.",
      booking,
    });
  } catch (error) {
    console.error("Cancel booking error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to cancel booking.",
    });
  }
};


// ==========================================
// ADMIN - GET ALL BOOKINGS
// ==========================================

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("customer", "firstName lastName email phone")
      .populate("service")
      .populate("quotation")
      .populate("employee", "firstName lastName email phone")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Get all bookings error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve bookings.",
    });
  }
};


// ==========================================
// ADMIN - UPDATE BOOKING STATUS
// ==========================================

export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "confirmed",
      "assigned",
      "in_progress",
      "completed",
      "cancelled",
    ];

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID.",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking status.",
      });
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    booking.status = status;

    if (status === "completed") {
      booking.completedAt = new Date();
    }

    if (status === "cancelled") {
      booking.cancelledAt = new Date();
    }

    await booking.save();

    const updatedBooking = await Booking.findById(booking._id)
      .populate("customer", "firstName lastName email phone")
      .populate("service")
      .populate("quotation")
      .populate("employee", "firstName lastName email phone");

    return res.status(200).json({
      success: true,
      message: "Booking status updated successfully.",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Update booking status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update booking status.",
    });
  }
};

// ==========================================
// ADMIN - ASSIGN EMPLOYEE TO BOOKING
// ==========================================

export const assignEmployee = async (req, res) => {
    try {
      const { id } = req.params;
      const { employeeId } = req.body;

      if (!employeeId) {
        return res.status(400).json({
          success: false,
          message: "Employee ID is required.",
        });
      }

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid booking ID.",
        });
      }

      if (!mongoose.Types.ObjectId.isValid(employeeId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid employee ID.",
        });
      }

      // Check employee
      const employee = await User.findOne({
        _id: employeeId,
        role: "employee",
        isActive: true,
      });

      if (!employee) {
        return res.status(404).json({
          success: false,
          message: "Active employee not found.",
        });
      }

      // Find booking
      const booking = await Booking.findById(id);

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Booking not found.",
        });
      }

      if (booking.status === "cancelled") {
        return res.status(400).json({
          success: false,
          message:
            "Cannot assign an employee to a cancelled booking.",
        });
      }

      if (booking.status === "completed") {
        return res.status(400).json({
          success: false,
          message:
            "Cannot assign an employee to a completed booking.",
        });
      }

      booking.employee = employee._id;
      booking.status = "assigned";

      await booking.save();
      await ensureDefaultChecklist(booking._id);

      const updatedBooking = await Booking.findById(
        booking._id
      )
        .populate(
          "customer",
          "firstName lastName email phone"
        )
        .populate("service")
        .populate("quotation")
        .populate(
          "employee",
          "firstName lastName email phone"
        );

      return res.status(200).json({
        success: true,
        message: "Employee assigned successfully.",
        booking: updatedBooking,
      });
    } catch (error) {
      console.error("Assign employee error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to assign employee.",
      });
    }
};

// ==========================================
// EMPLOYEE - GET MY ASSIGNED BOOKINGS
// ==========================================

export const getMyAssignedBookings = async (req, res) => {
    try {
      const bookings = await Booking.find({
        employee: req.user._id,
      })
        .populate(
          "customer",
          "firstName lastName email phone"
        )
        .populate("service")
        .populate("quotation")
        .sort({ preferredDate: 1 });

      return res.status(200).json({
        success: true,
        count: bookings.length,
        bookings,
      });
    } catch (error) {
      console.error(
        "Get assigned bookings error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Failed to retrieve assigned bookings.",
      });
    }
};

// ==========================================
// EMPLOYEE - GET ASSIGNED BOOKING BY ID
// ==========================================

export const getAssignedBookingById = async (
    req,
    res
  ) => {
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
      })
        .populate(
          "customer",
          "firstName lastName email phone"
        )
        .populate("service")
        .populate("quotation")
        .populate(
          "employee",
          "firstName lastName email phone"
        );

      if (!booking) {
        return res.status(404).json({
          success: false,
          message:
            "Booking not found or not assigned to you.",
        });
      }

      return res.status(200).json({
        success: true,
        booking,
      });
    } catch (error) {
      console.error(
        "Get assigned booking error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Failed to retrieve booking.",
      });
    }
};

// ==========================================
// EMPLOYEE - START SERVICE
// ==========================================

export const startService = async (req, res) => {
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

      if (booking.status !== "assigned") {
        return res.status(400).json({
          success: false,
          message:
            "Only assigned bookings can be started.",
        });
      }

      booking.status = "in_progress";
      booking.serviceStartedAt = new Date();

      await booking.save();

      return res.status(200).json({
        success: true,
        message: "Service started successfully.",
        booking,
      });
    } catch (error) {
      console.error("Start service error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to start service.",
      });
    }
};

// ==========================================
// EMPLOYEE - CLOCK IN
// ==========================================

export const clockIn = async (req, res) => {
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
            "Service must be started before clocking in.",
        });
      }

      let attendance = await Attendance.findOne({
        booking: booking._id,
      });

      if (attendance?.clockIn) {
        return res.status(400).json({
          success: false,
          message: "Already clocked in.",
        });
      }

      if (!attendance) {
        attendance = new Attendance({
          booking: booking._id,
          employee: req.user._id,
        });
      }

      attendance.clockIn = new Date();
      attendance.status = "clocked_in";

      await attendance.save();

      return res.status(200).json({
        success: true,
        message: "Clocked in successfully.",
        attendance,
      });
    } catch (error) {
      console.error("Clock in error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to clock in.",
      });
    }
};

// ==========================================
// EMPLOYEE - CLOCK OUT
// ==========================================

export const clockOut = async (req, res) => {
    try {
      const { id } = req.params;

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

      const attendance = await Attendance.findOne({
        booking: booking._id,
        employee: req.user._id,
      });

      if (!attendance || !attendance.clockIn) {
        return res.status(400).json({
          success: false,
          message:
            "Employee must clock in before clocking out.",
        });
      }

      if (attendance.clockOut) {
        return res.status(400).json({
          success: false,
          message: "Already clocked out.",
        });
      }

      attendance.clockOut = new Date();
      attendance.status = "clocked_out";

      await attendance.save();

      return res.status(200).json({
        success: true,
        message: "Clocked out successfully.",
        attendance,
      });
    } catch (error) {
      console.error("Clock out error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to clock out.",
      });
    }
};

// ==========================================
// EMPLOYEE - ADD JOB NOTES
// ==========================================

export const updateJobNotes = async (req, res) => {
    try {
      const { id } = req.params;
      const { notes } = req.body;

      if (!notes || !notes.trim()) {
        return res.status(400).json({
          success: false,
          message: "Notes are required.",
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

      booking.employeeNotes = notes.trim();

      await booking.save();

      return res.status(200).json({
        success: true,
        message: "Job notes saved successfully.",
        booking,
      });
    } catch (error) {
      console.error("Update job notes error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to save job notes.",
      });
    }
};

// ==========================================
// CUSTOMER - SIGN OFF COMPLETED SERVICE
// ==========================================

export const customerSignOff = async (req, res) => {
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
        customer: req.user._id,
      });

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
            "Customer can sign off only after service completion.",
        });
      }

      if (booking.customerSignedOff) {
        return res.status(400).json({
          success: false,
          message: "Service is already signed off.",
        });
      }

      booking.customerSignedOff = true;
      booking.customerSignedOffAt = new Date();

      await booking.save();

      return res.status(200).json({
        success: true,
        message: "Service signed off successfully.",
        booking,
      });
    } catch (error) {
      console.error("Customer sign-off error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to sign off service.",
      });
    }
};
