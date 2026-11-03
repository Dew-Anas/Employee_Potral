const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: String,
    status: String
  },
  {
    collection: "categories",
    timestamps: true
  }
);

module.exports = mongoose.model("Category", categorySchema);