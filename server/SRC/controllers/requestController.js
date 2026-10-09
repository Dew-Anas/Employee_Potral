import mongoose from "mongoose";

import ServiceRequest from "../models/ServiceRequest.js";
import Service from "../models/Service.js";

export const createRequest = async (req, res) => {
  try {
    const {
      serviceId,
      preferredDate,
      preferredTime,
      address,
      description,
      images,
    } = req.body;

    if (
      !serviceId ||
      !preferredDate ||
      !preferredTime ||
      !address ||
      !description
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Service, preferred date, preferred time, address and description are required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid service ID.",
      });
    }

    const service = await Service.findOne({
      _id: serviceId,
      isActive: true,
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found or unavailable.",
      });
    }

    const requestDate = new Date(preferredDate);

    if (Number.isNaN(requestDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid preferred date.",
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    requestDate.setHours(0, 0, 0, 0);

    if (requestDate < today) {
      return res.status(400).json({
        success: false,
        message: "Preferred date cannot be in the past.",
      });
    }

    const serviceRequest = await ServiceRequest.create({
      customer: req.user._id,
      service: serviceId,
      preferredDate: requestDate,
      preferredTime,
      address,
      description,
      images: Array.isArray(images) ? images : [],
    });

    const populatedRequest =
      await ServiceRequest.findById(
        serviceRequest._id
      )
        .populate(
          "service",
          "name category price duration image"
        )
        .populate(
          "customer",
          "firstName lastName email phone"
        );

    return res.status(201).json({
      success: true,
      message: "Service request created successfully.",
      request: populatedRequest,
    });
  } catch (error) {
    console.error("Create request error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create service request.",
    });
  }
};

export const getMyRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find({
      customer: req.user._id,
    })
      .populate(
        "service",
        "name category price duration image"
      )
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error("Get customer requests error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve service requests.",
    });
  }
};

export const getRequestById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid request ID.",
      });
    }

    const request = await ServiceRequest.findOne({
      _id: id,
      customer: req.user._id,
    })
      .populate(
        "service",
        "name category price duration image"
      )
      .populate(
        "customer",
        "firstName lastName email phone"
      );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Service request not found.",
      });
    }

    return res.status(200).json({
      success: true,
      request,
    });
  } catch (error) {
    console.error("Get request error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve service request.",
    });
  }
};

export const getAllRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find()
      .populate("service", "name category price duration image")
      .populate("customer", "firstName lastName email phone")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error("Get all requests error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve service requests.",
    });
  }
};

export const getAdminRequestById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid request ID.",
      });
    }

    const request = await ServiceRequest.findById(id)
      .populate("service", "name category price duration image")
      .populate("customer", "firstName lastName email phone");

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Service request not found.",
      });
    }

    return res.status(200).json({
      success: true,
      request,
    });
  } catch (error) {
    console.error("Get admin request error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve service request.",
    });
  }
};

export const updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = [
      "submitted",
      "under_review",
      "quotation_sent",
      "accepted",
      "booking_confirmed",
      "in_progress",
      "completed",
      "cancelled",
    ];

    if (!allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid request status.",
      });
    }

    const request = await ServiceRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
      .populate("service", "name category price duration image")
      .populate("customer", "firstName lastName email phone");

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Service request not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Request status updated.",
      request,
    });
  } catch (error) {
    console.error("Update request status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update request status.",
    });
  }
};

export const cancelRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid request ID.",
      });
    }

    const request = await ServiceRequest.findOne({
      _id: id,
      customer: req.user._id,
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Service request not found.",
      });
    }

    const nonCancellableStatuses = [
      "in_progress",
      "completed",
      "cancelled",
    ];

    if (
      nonCancellableStatuses.includes(
        request.status
      )
    ) {
      return res.status(400).json({
        success: false,
        message: `Request cannot be cancelled when status is "${request.status}".`,
      });
    }

    request.status = "cancelled";
    request.cancellationReason =
      reason?.trim() || "";

    await request.save();

    return res.status(200).json({
      success: true,
      message: "Service request cancelled successfully.",
      request,
    });
  } catch (error) {
    console.error("Cancel request error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to cancel service request.",
    });
  }
};