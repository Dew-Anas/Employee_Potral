import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Service name is required"],
      trim: true,
    },

    category: {
      type: String,
      required: [true, "Service category is required"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Service description is required"],
      trim: true,
    },

    price: {
      type: Number,
      required: [true, "Service price is required"],
      min: [0, "Price cannot be negative"],
    },

    duration: {
      type: String,
      required: [true, "Service duration is required"],
      trim: true,
    },

    image: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Service = mongoose.model("Service", serviceSchema);

export default Service;