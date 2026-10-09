import mongoose from "mongoose";

const quotationSchema = new mongoose.Schema(
  {
    request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceRequest",
      required: true,
    },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    description: {
      type: String,
      trim: true,
      required: true,
    },

    validUntil: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "rejected",
        "expired",
      ],
      default: "pending",
    },

    respondedAt: {
      type: Date,
      default: null,
    },

    rejectionReason: {
      type: String,
      trim: true,
      default: "",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Quotation = mongoose.model(
  "Quotation",
  quotationSchema
);

export default Quotation;