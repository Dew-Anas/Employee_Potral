import mongoose from "mongoose";
import Service from "../models/Service.js";

export const getServices = async (req, res) => {
  try {
    const filter = req.user?.role === "admin" ? {} : { isActive: true };

    const services = await Service.find(filter).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: services.length,
      services,
    });
  } catch (error) {
    console.error("Get services error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve services.",
    });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid service ID.",
      });
    }

    const service = await Service.findOne({
      _id: id,
      isActive: true,
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found.",
      });
    }

    return res.status(200).json({
      success: true,
      service,
    });
  } catch (error) {
    console.error("Get service error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve service.",
    });
  }
};

export const createService = async (req, res) => {
  try {
    const {
      name,
      category,
      description,
      price,
      duration,
      image,
    } = req.body;

    if (
      !name ||
      !category ||
      !description ||
      price === undefined ||
      !duration
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, category, description, price and duration are required.",
      });
    }

    if (Number(price) < 0) {
      return res.status(400).json({
        success: false,
        message: "Price cannot be negative.",
      });
    }

    const service = await Service.create({
      name,
      category,
      description,
      price: Number(price),
      duration,
      image: image || "",
    });

    return res.status(201).json({
      success: true,
      message: "Service created successfully.",
      service,
    });
  } catch (error) {
    console.error("Create service error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create service.",
    });
  }
};

export const updateService = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid service ID.",
      });
    }

    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found.",
      });
    }

    const {
      name,
      category,
      description,
      price,
      duration,
      image,
      isActive,
    } = req.body;

    if (name !== undefined) {
      service.name = name;
    }

    if (category !== undefined) {
      service.category = category;
    }

    if (description !== undefined) {
      service.description = description;
    }

    if (price !== undefined) {
      if (Number(price) < 0) {
        return res.status(400).json({
          success: false,
          message: "Price cannot be negative.",
        });
      }

      service.price = Number(price);
    }

    if (duration !== undefined) {
      service.duration = duration;
    }

    if (image !== undefined) {
      service.image = image;
    }

    if (isActive !== undefined) {
      service.isActive = isActive;
    }

    await service.save();

    return res.status(200).json({
      success: true,
      message: "Service updated successfully.",
      service,
    });
  } catch (error) {
    console.error("Update service error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update service.",
    });
  }
};

export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid service ID.",
      });
    }

    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found.",
      });
    }

    service.isActive = false;

    await service.save();

    return res.status(200).json({
      success: true,
      message: "Service removed successfully.",
    });
  } catch (error) {
    console.error("Delete service error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to remove service.",
    });
  }
};