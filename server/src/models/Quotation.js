// server/src/models/Quotation.js
// TEMP-DB: Read-only copy of Dev_B's server/models/Quotation.js.
// REAL: Delete this file when Dev_B's model is merged (duplicate model names cause OverwriteModelError).
// Used by: employee jobs API (Booking -> Quotation -> ServiceRequest chain).

const mongoose = require("mongoose");

const quoteItemSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["Service", "Add-on"], required: true },
    description: { type: String, required: true },
    qty: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const quotationSchema = new mongoose.Schema(
  {
    quoteId: { type: String, required: true, unique: true },
    request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceRequest",
      required: true,
    },
    items: [quoteItemSchema],
    discountPercent: { type: Number, default: 0, min: 0, max: 100 },
    taxPercent: { type: Number, default: 0, min: 0 },
    validUntil: { type: Date, required: true },
    terms: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Draft", "Sent", "Accepted", "Rejected", "Expired"],
      default: "Draft",
    },
  },
  { timestamps: true }
);

quotationSchema.virtual("subtotal").get(function () {
  return this.items.reduce((sum, item) => sum + item.qty * item.unitPrice, 0);
});
quotationSchema.virtual("discountAmount").get(function () {
  return (this.subtotal * this.discountPercent) / 100;
});
quotationSchema.virtual("taxAmount").get(function () {
  return ((this.subtotal - this.discountAmount) * this.taxPercent) / 100;
});
quotationSchema.virtual("total").get(function () {
  return this.subtotal - this.discountAmount + this.taxAmount;
});
quotationSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Quotation", quotationSchema);