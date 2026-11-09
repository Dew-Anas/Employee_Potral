const mongoose = require("mongoose");

const ChecklistTemplate = require("../models/ChecklistTemplate");

const ChecklistItem = require("../models/ChecklistItem");

const createItemsFromTemplate = async (bookingId, employeeId, categoryId) => {
     const existing = await ChecklistItem.find({ booking: bookingId }).sort({
    order: 1,
  });


  if (existing.length > 0) return existing;

  const template = await ChecklistTemplate.findOne({
    category: categoryId,
  });

  if (!template) {
    throw new Error("No checklist template found for this category");
  }

   const docs = template.tasks.map((t) => ({
    booking: bookingId,
    employee: employeeId,
    title: t.title,
    essential: t.essential,
    order: t.order,
  }));

  return await ChecklistItem.insertMany(docs);
};



const getChecklist = async (req, res) => {
  try {
    const { bookingId } = req.params;

    if (!mongoose.isValidObjectId(bookingId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking id",
      });
    }

    // Ownership check: Logged-in employee only
    const items = await ChecklistItem.find({
      booking: bookingId,
      employee: req.user._id,
    }).sort({ order: 1 });

    const completed = items.filter(
      (i) => i.status === "Completed"
    ).length;

    return res.json({
      success: true,
      items,
      summary: {
        total: items.length,
        completed,
      },
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Failed to load checklist",
    });
  }
};

// ==========================================
// PART 3: Complete Checklist Item
// ==========================================

const completeItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    if (!mongoose.isValidObjectId(itemId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid item id",
      });
    }

    // Ownership check: Item ID + Employee ID
    const item = await ChecklistItem.findOne({
      _id: itemId,
      employee: req.user._id,
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Checklist item not found",
      });
    }

    // Already completed: return existing item
    if (item.status === "Completed") {
      return res.json({
        success: true,
        item,
      });
    }

    // Mark item as completed
    item.status = "Completed";

    // Save completion time
    item.completedAt = new Date();

    // Save changes to MongoDB
    await item.save();

    return res.json({
      success: true,
      item,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Failed to update item",
    });
  }
};
module.exports = { createItemsFromTemplate,
getChecklist,
completeItem,
};