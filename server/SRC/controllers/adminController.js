import ServiceRequest from "../models/ServiceRequest.js";
import Quotation from "../models/Quotation.js";
import Booking from "../models/Booking.js";
import Invoice from "../models/Invoice.js";
import Review from "../models/Review.js";
import User from "../models/User.js";
import Service from "../models/Service.js";

export const getAdminDashboard = async (req, res) => {
  try {
    const [
      customers,
      employees,
      services,
      requests,
      pendingQuotes,
      bookings,
      completedBookings,
      unpaidInvoices,
      pendingReviews,
    ] = await Promise.all([
      User.countDocuments({ role: "customer" }),
      User.countDocuments({ role: "employee", isActive: true }),
      Service.countDocuments({ isActive: true }),
      ServiceRequest.countDocuments(),
      Quotation.countDocuments({ status: "pending" }),
      Booking.countDocuments(),
      Booking.countDocuments({ status: "completed" }),
      Invoice.countDocuments({ paymentStatus: { $ne: "paid" } }),
      Review.countDocuments({ status: "pending" }),
    ]);

    const recentRequests = await ServiceRequest.find()
      .populate("customer", "firstName lastName email")
      .populate("service", "name")
      .sort({ createdAt: -1 })
      .limit(6);

    const recentBookings = await Booking.find()
      .populate("customer", "firstName lastName")
      .populate("service", "name")
      .populate("employee", "firstName lastName")
      .sort({ createdAt: -1 })
      .limit(6);

    return res.status(200).json({
      success: true,
      stats: {
        customers,
        employees,
        services,
        requests,
        pendingQuotes,
        bookings,
        completedBookings,
        unpaidInvoices,
        pendingReviews,
      },
      recentRequests,
      recentBookings,
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load dashboard.",
    });
  }
};
