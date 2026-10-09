import mongoose from "mongoose";
import Invoice from "../models/Invoice.js";
import {
  createInvoiceForBooking,
  populateInvoice,
} from "../utils/invoiceHelper.js";

export const getMyInvoices = async (req, res) => {
  try {
    const invoices = await populateInvoice(
      Invoice.find({ customer: req.user._id }).sort({ createdAt: -1 })
    );

    return res.status(200).json({
      success: true,
      count: invoices.length,
      invoices,
    });
  } catch (error) {
    console.error("Get my invoices error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve invoices.",
    });
  }
};

export const getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid invoice ID.",
      });
    }

    const filter = { _id: id };

    if (req.user.role === "customer") {
      filter.customer = req.user._id;
    }

    const invoice = await populateInvoice(Invoice.findOne(filter));

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found.",
      });
    }

    return res.status(200).json({
      success: true,
      invoice,
    });
  } catch (error) {
    console.error("Get invoice error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve invoice.",
    });
  }
};

export const getAllInvoices = async (req, res) => {
  try {
    const invoices = await populateInvoice(
      Invoice.find().sort({ createdAt: -1 })
    );

    return res.status(200).json({
      success: true,
      count: invoices.length,
      invoices,
    });
  } catch (error) {
    console.error("Get all invoices error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve invoices.",
    });
  }
};

export const createInvoiceFromBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId || !mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({
        success: false,
        message: "A valid booking ID is required.",
      });
    }

    const invoice = await createInvoiceForBooking(bookingId);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    const populated = await populateInvoice(Invoice.findById(invoice._id));

    return res.status(201).json({
      success: true,
      message: "Invoice created successfully.",
      invoice: populated,
    });
  } catch (error) {
    console.error("Create invoice error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create invoice.",
    });
  }
};

export const payInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const { method } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid invoice ID.",
      });
    }

    const invoice = await Invoice.findOne({
      _id: id,
      customer: req.user._id,
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found.",
      });
    }

    if (invoice.paymentStatus === "paid") {
      return res.status(400).json({
        success: false,
        message: "This invoice is already paid.",
      });
    }

    invoice.amountPaid = invoice.totalAmount;
    invoice.balanceDue = 0;
    invoice.paymentStatus = "paid";
    invoice.paymentMethod = method?.trim() || "online";
    invoice.paidAt = new Date();

    await invoice.save();

    const populated = await populateInvoice(Invoice.findById(invoice._id));

    return res.status(200).json({
      success: true,
      message: "Payment recorded successfully.",
      invoice: populated,
    });
  } catch (error) {
    console.error("Pay invoice error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to process payment.",
    });
  }
};
