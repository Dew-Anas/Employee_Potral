// server/src/controllers/employeeJobController.js
// WHY: Gives the logged-in employee ONLY their own assigned jobs (Booking.employee = me).
// ROUTES: GET /api/employee/jobs and GET /api/employee/jobs/:id (routes/employeeJobRoutes.js; protect + employeeOnly)
// DATA: customer / service / address are read straight from the booking (customer flow);
//       if missing, from the chain Booking -> quotation -> ServiceRequest.
// TIME: scheduledStart (admin) or, if not scheduled yet, preferredDate + preferredTime (customer).
// EXTRA: each job carries `response` ("Accepted" | "Declined" | null) from assignmentresponses.
// TODO(confirm): final Booking model + status values (lead). Status is normalised for the UI.
// TODO(confirm): preferredTime is combined with preferredDate in the SERVER's local time zone.
// TODO(confirm): requestedTasks = Booking.tasks titles; additionalRequirements = ServiceRequest.description + Booking.notes.
// Employee sees only these statuses: Assigned (= Pending in the portal), In Progress, Completed.

const mongoose = require("mongoose");

const Booking = require("../models/Booking");
const AssignmentResponse = require("../models/AssignmentResponse");
const { canonicalStatus, statusIn } = require("../utils/bookingStatus");
// Models below must be loaded so populate() can find them.
require("../models/Quotation");
require("../models/ServiceRequest");
require("../models/Service");
require("../models/User");

const VISIBLE_STATUSES = statusIn("Assigned", "In Progress", "Completed");

// Populate everything once, so both functions use the same query shape.
// strictPopulate:false = do not crash if a copy of a model lacks a path.
const populateSpec = [
  { path: "customer", select: "firstName lastName phone", strictPopulate: false },
  { path: "service", select: "name requiredSkills", strictPopulate: false },
  {
    path: "quotation",
    strictPopulate: false,
    populate: {
      path: "request",
      strictPopulate: false,
      populate: [
        { path: "customer", select: "firstName lastName phone", strictPopulate: false },
        { path: "service", select: "name requiredSkills", strictPopulate: false },
      ],
    },
  },
];

// Admin's scheduledStart, else the customer's preferred date + time.
const toScheduledAt = (booking) => {
  if (booking.scheduledStart) return booking.scheduledStart;
  if (!booking.preferredDate) return null;

  const day = new Date(booking.preferredDate);
  if (Number.isNaN(day.getTime())) return null;

  const [hours, minutes] = String(booking.preferredTime || "00:00")
    .split(":")
    .map(Number);

  return new Date(
    day.getUTCFullYear(),
    day.getUTCMonth(),
    day.getUTCDate(),
    hours || 0,
    minutes || 0
  );
};

// Convert a populated booking into the shape the React UI expects.
const toJobDTO = (booking, response) => {
  const request = booking.quotation?.request;
  const customer = booking.customer?.firstName ? booking.customer : request?.customer;
  const service = booking.service?.name ? booking.service : request?.service;

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
    address: booking.address || request?.address || "",
    scheduledAt: toScheduledAt(booking),
    scheduledEnd: booking.scheduledEnd || null,
    status: canonicalStatus(booking.status),
    response: response || null,
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
      .populate(populateSpec)
      .lean();

    // One query for all answers, then match by booking id.
    const responses = await AssignmentResponse.find({
      employee: req.user._id,
      booking: { $in: bookings.map((booking) => booking._id) },
    }).lean();

    const responseByBooking = new Map(
      responses.map((item) => [item.booking.toString(), item.response])
    );

    const jobs = bookings
      .map((booking) => toJobDTO(booking, responseByBooking.get(booking._id.toString())))
      .sort((a, b) => {
        const timeA = a.scheduledAt ? new Date(a.scheduledAt).getTime() : Infinity;
        const timeB = b.scheduledAt ? new Date(b.scheduledAt).getTime() : Infinity;
        return timeA - timeB;
      });

    return res.json({ success: true, jobs });
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
      .populate(populateSpec)
      .lean();

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const answer = await AssignmentResponse.findOne({
      booking: booking._id,
      employee: req.user._id,
    }).lean();

    return res.json({
      success: true,
      job: toJobDTO(booking, answer?.response),
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