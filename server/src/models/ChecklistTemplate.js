
const mongoose = require("mongoose");



const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
    },

    essential: {
      type: Boolean,
      default: false,
    },

    order: {
      type: Number,
      default: 0,
    },
  },
  {
    _id: false,
  }
);

const checklistTemplateSchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },

    tasks: {
      type: [taskSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Shared collection: checklisttemplates
module.exports = mongoose.model("ChecklistTemplate", checklistTemplateSchema);
