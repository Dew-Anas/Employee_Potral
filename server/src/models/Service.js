// server/src/models/Service.js
// TEMP-DB: Read-only copy of Dev_B's server/models/Service.js.
// REAL: Delete this file when Dev_B's model is merged (duplicate model names cause OverwriteModelError).
// Used by: employee jobs API (service name on the job card).

const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    coverImage: { type: String, default: "" },
    basePrice: { type: Number, required: true, min: 0 },
    discountable: { type: Boolean, default: false },
    maxDiscountPercent: { type: Number, default: 0, min: 0, max: 100 },
    durationHrs: { type: Number, required: true, min: 0 },
    requiredSkills: [{ type: String }],
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);
