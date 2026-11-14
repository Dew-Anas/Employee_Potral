// server/src/controllers/employeeJobController.js
// WHY: Gives the logged-in employee ONLY their own assigned jobs (Booking.employee = me).
// ROUTES: GET /api/employee/jobs and GET /api/employee/jobs/:id (routes/employeeJobRoutes.js; protect + employeeOnly)
// DATA CHAIN: Booking -> quotation -> Quotation -> request -> ServiceRequest -> customer (User) + service (Service)
// TODO(confirm): Dev_B Booking model assumed final (lead to confirm; Dev_A schema differs).
// TODO(confirm): requestedTasks = Booking.tasks titles; additionalRequirements = ServiceRequest.description + Booking.notes.
// Employee sees only these statuses: Assigned (= Pending in the portal), In Progress, Completed.

const mongoose = require("mongoose");

const Booking = require("../models/Booking");
// Models below must be loaded so populate() can find them.
require("../models/Quotation");
require("../models/ServiceRequest");
require("../models/Service");
require("../models/User");

const VISIBLE_STATUSES = ["Assigned", "In Progress", "Completed"];

// Populate the full chain once, so both functions use the same query shape.
const chainPopulate = {
  path: "quotation",
  populate: {
    path: "request",
    populate: [
      { path: "customer", select: "firstName lastName phone" },
      { path: "service", select: "name requiredSkills" },
    ],
  },
};

// Convert a populated booking into the shape the React UI expects.
const toJobDTO = (booking) => {
  const request = booking.quotation?.request;
  const customer = request?.customer;
  const service = request?.service;

  const customerName = customer
    ? `${customer.firstName || ""} ${customer.lastName || ""}`.trim()
    : "Customer";

  const additionalRequirements = [request?.description, booking.notes]
    .filter(Boolean)
    .join("\n\n");

  return {
    id: booking._id.toString(),
    bookingId: booking.bookingId,
    serviceName: service?.name || "Service",
    requiredSkills: service?.requiredSkills || [],
    customerName,
    customerPhone: customer?.phone || "",
    address: request?.address || "",
    scheduledAt: booking.scheduledStart,
    scheduledEnd: booking.scheduledEnd,
    status: booking.status,
    requestedTasks: (booking.tasks || []).map((task) => task.title),
    additionalRequirements,
  };
};

// GET /api/employee/jobs
const getMyJobs = async (req, res) => {
  try {
    const bookings = await Booking.find({
      employee: req.user._id,
      status: { $in: VISIBLE_STATUSES },
    })
      .populate(chainPopulate)
      .sort({ scheduledStart: 1 })
      .lean();

    return res.json({
      success: true,
      jobs: bookings.map(toJobDTO),
    });
  } catch (error) {
    console.error("getMyJobs error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to load jobs",
    });
  }
};

// GET /api/employee/jobs/:id
const getMyJobById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job id",
      });
    }

    // employee filter: an employee can never open another employee's job.
    const booking = await Booking.findOne({
      _id: id,
      employee: req.user._id,
      status: { $in: VISIBLE_STATUSES },
    })
      .populate(chainPopulate)
      .lean();

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.json({
      success: true,
      job: toJobDTO(booking),
    });
  } catch (error) {
    console.error("getMyJobById error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to load job",
    });
  }
};

module.exports = {
  getMyJobs,
  getMyJobById,
};