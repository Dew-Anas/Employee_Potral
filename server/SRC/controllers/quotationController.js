import mongoose from "mongoose";

import Quotation from "../models/Quotation.js";
import ServiceRequest from "../models/ServiceRequest.js";
import Service from "../models/Service.js";

const checkQuotationExpiry = (quotation) => {
  if (
    quotation.status === "pending" &&
    new Date() > new Date(quotation.validUntil)
  ) {
    quotation.status = "expired";
    return true;
  }

  return false;
};

/*
|--------------------------------------------------------------------------
| ADMIN - Create Quotation
|--------------------------------------------------------------------------
*/

export const createQuotation = async (req, res) => {
  try {
    const {
      requestId,
      amount,
      description,
      validUntil,
    } = req.body;

    if (
      !requestId ||
      amount === undefined ||
      !description ||
      !validUntil
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Request, amount, description and validity date are required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid request ID.",
      });
    }

    if (Number(amount) < 0) {
      return res.status(400).json({
        success: false,
        message: "Quotation amount cannot be negative.",
      });
    }

    const expiryDate = new Date(validUntil);

    if (Number.isNaN(expiryDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid validity date.",
      });
    }

    if (expiryDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message:
          "Quotation validity date must be in the future.",
      });
    }

    const request = await ServiceRequest.findById(
      requestId
    ).populate("service");

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Service request not found.",
      });
    }

    if (request.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message:
          "Cannot create a quotation for a cancelled request.",
      });
    }

    if (request.status === "completed") {
      return res.status(400).json({
        success: false,
        message:
          "Cannot create a quotation for a completed request.",
      });
    }

    const existingQuotation =
      await Quotation.findOne({
        request: requestId,
        status: "pending",
      });

    if (existingQuotation) {
      return res.status(409).json({
        success: false,
        message:
          "A pending quotation already exists for this request.",
      });
    }

    const quotation = await Quotation.create({
      request: request._id,
      customer: request.customer,
      service: request.service._id,
      amount: Number(amount),
      description,
      validUntil: expiryDate,
      status: "pending",
      createdBy: req.user._id,
    });

    request.status = "quotation_sent";
    await request.save();

    const populatedQuotation =
      await Quotation.findById(
        quotation._id
      )
        .populate(
          "customer",
          "firstName lastName email phone"
        )
        .populate(
          "service",
          "name category price duration"
        )
        .populate(
          "request",
          "preferredDate preferredTime address status"
        )
        .populate(
          "createdBy",
          "firstName lastName email"
        );

    return res.status(201).json({
      success: true,
      message: "Quotation created successfully.",
      quotation: populatedQuotation,
    });
  } catch (error) {
    console.error(
      "Create quotation error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to create quotation.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| CUSTOMER - Get My Quotations
|--------------------------------------------------------------------------
*/

export const getMyQuotations = async (
  req,
  res
) => {
  try {
    const quotations = await Quotation.find({
      customer: req.user._id,
    })
      .populate(
        "service",
        "name category price duration"
      )
      .populate(
        "request",
        "preferredDate preferredTime address status"
      )
      .sort({
        createdAt: -1,
      });

    const updatedQuotations = [];

    for (const quotation of quotations) {
      const expired =
        checkQuotationExpiry(quotation);

      if (expired) {
        await quotation.save();
      }

      updatedQuotations.push(quotation);
    }

    return res.status(200).json({
      success: true,
      count: updatedQuotations.length,
      quotations: updatedQuotations,
    });
  } catch (error) {
    console.error(
      "Get customer quotations error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to retrieve quotations.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| CUSTOMER - Get One Quotation
|--------------------------------------------------------------------------
*/

export const getQuotationById = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid quotation ID.",
      });
    }

    const quotation =
      await Quotation.findOne({
        _id: id,
        customer: req.user._id,
      })
        .populate(
          "service",
          "name category price duration"
        )
        .populate(
          "request",
          "preferredDate preferredTime address description status"
        );

    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: "Quotation not found.",
      });
    }

    if (
      checkQuotationExpiry(quotation)
    ) {
      await quotation.save();
    }

    return res.status(200).json({
      success: true,
      quotation,
    });
  } catch (error) {
    console.error(
      "Get quotation error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to retrieve quotation.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| CUSTOMER - Accept Quotation
|--------------------------------------------------------------------------
*/

export const acceptQuotation = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid quotation ID.",
      });
    }

    const quotation =
      await Quotation.findOne({
        _id: id,
        customer: req.user._id,
      });

    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: "Quotation not found.",
      });
    }

    if (
      checkQuotationExpiry(quotation)
    ) {
      await quotation.save();

      return res.status(400).json({
        success: false,
        message:
          "This quotation has expired.",
      });
    }

    if (quotation.status !== "pending") {
      return res.status(400).json({
        success: false,
        message:
          `Quotation cannot be accepted because its status is "${quotation.status}".`,
      });
    }

    quotation.status = "accepted";
    quotation.respondedAt = new Date();

    await quotation.save();

    await ServiceRequest.findByIdAndUpdate(
      quotation.request,
      {
        status: "accepted",
      }
    );

    return res.status(200).json({
      success: true,
      message:
        "Quotation accepted successfully.",
      quotation,
    });
  } catch (error) {
    console.error(
      "Accept quotation error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to accept quotation.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| CUSTOMER - Reject Quotation
|--------------------------------------------------------------------------
*/

export const rejectQuotation = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid quotation ID.",
      });
    }

    const quotation =
      await Quotation.findOne({
        _id: id,
        customer: req.user._id,
      });

    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: "Quotation not found.",
      });
    }

    if (
      checkQuotationExpiry(quotation)
    ) {
      await quotation.save();

      return res.status(400).json({
        success: false,
        message:
          "This quotation has expired.",
      });
    }

    if (quotation.status !== "pending") {
      return res.status(400).json({
        success: false,
        message:
          `Quotation cannot be rejected because its status is "${quotation.status}".`,
      });
    }

    quotation.status = "rejected";
    quotation.respondedAt = new Date();

    quotation.rejectionReason =
      req.body.reason?.trim() || "";

    await quotation.save();

    return res.status(200).json({
      success: true,
      message:
        "Quotation rejected successfully.",
      quotation,
    });
  } catch (error) {
    console.error(
      "Reject quotation error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to reject quotation.",
    });
  }
};


/*
|--------------------------------------------------------------------------
| ADMIN - Get All Quotations
|--------------------------------------------------------------------------
*/

export const getAllQuotations = async (
  req,
  res
) => {
  try {
    const quotations =
      await Quotation.find()
        .populate(
          "customer",
          "firstName lastName email phone"
        )
        .populate(
          "service",
          "name category price"
        )
        .populate(
          "request",
          "preferredDate preferredTime address status"
        )
        .populate(
          "createdBy",
          "firstName lastName email"
        )
        .sort({
          createdAt: -1,
        });

    for (const quotation of quotations) {
      if (
        checkQuotationExpiry(quotation)
      ) {
        await quotation.save();
      }
    }

    return res.status(200).json({
      success: true,
      count: quotations.length,
      quotations,
    });
  } catch (error) {
    console.error(
      "Get all quotations error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to retrieve quotations.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| ADMIN - Update Quotation
|--------------------------------------------------------------------------
*/

export const updateQuotation = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid quotation ID.",
      });
    }

    const quotation =
      await Quotation.findById(id);

    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: "Quotation not found.",
      });
    }

    if (
      quotation.status !== "pending"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Only pending quotations can be updated.",
      });
    }

    const {
      amount,
      description,
      validUntil,
    } = req.body;

    if (amount !== undefined) {
      if (Number(amount) < 0) {
        return res.status(400).json({
          success: false,
          message:
            "Quotation amount cannot be negative.",
        });
      }

      quotation.amount = Number(amount);
    }

    if (description !== undefined) {
      quotation.description =
        description.trim();
    }

    if (validUntil !== undefined) {
      const expiryDate =
        new Date(validUntil);

      if (
        Number.isNaN(
          expiryDate.getTime()
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid validity date.",
        });
      }

      if (
        expiryDate <= new Date()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Validity date must be in the future.",
        });
      }

      quotation.validUntil =
        expiryDate;
    }

    await quotation.save();

    return res.status(200).json({
      success: true,
      message:
        "Quotation updated successfully.",
      quotation,
    });
  } catch (error) {
    console.error(
      "Update quotation error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update quotation.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| ADMIN - Delete Quotation
|--------------------------------------------------------------------------
*/

export const deleteQuotation = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid quotation ID.",
      });
    }

    const quotation =
      await Quotation.findById(id);

    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: "Quotation not found.",
      });
    }

    if (
      quotation.status === "accepted"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Accepted quotations cannot be deleted.",
      });
    }

    await quotation.deleteOne();

    return res.status(200).json({
      success: true,
      message:
        "Quotation deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete quotation error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete quotation.",
    });
  }
};