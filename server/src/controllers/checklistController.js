
const mongoose = require("mongoose");

const ChecklistItem = require("../models/ChecklistItem");

const logAudit = require("../utils/logAudit");

// Get all checklist items for a specific booking.

const getChecklist = async(req,res)=>{
    try{
        // Get booking ID from the URL.
    const { bookingId } = req.params;

     // Check whether the booking ID is valid.

     if(!mongoose.isValidObjectId(bookingId)) {
        return res.status(400).json({
            success:false,
            message:"Invalid booking id",
        });
     }

     // Find checklist items for this booking and employee.
     const checklist = await ChecklistItem.find({
        booking:bookingId,
        employee:req.user._id,
     }).sort({order:1});

     // Send checklist items to the frontend.
     return res.json({
        success:true,
        checklist,
     });

    }catch(err){
        // Print the error in the server terminal.

        console.error("getChecklist error:", err.message);

        // Send an error response to the frontend.

        return res.status(500).json({
            success:false,
            message:"Failed to load checklist",
        });
    }
};

            // Update the status of one checklist item.
const updateChecklistItem = async (req, res) => {
  try {
    // Get checklist item ID from the URL.
    const { itemId } = req.params;

    // Get the new status from the request body.
    const { status } = req.body;

    // Check whether the item ID is valid.
    if (!mongoose.isValidObjectId(itemId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid checklist item id",
      });
    }

    // Only allow these two checklist statuses.
    if (!["Pending", "Completed"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid checklist status",
      });
    }

    // Find the item belonging to this employee and update it.
    
    // Find the item first so we know its old status.
    const existingItem = await ChecklistItem.findOne({
      _id: itemId,
      employee: req.user._id,
    });

    // Check whether the item belongs to this employee.
    if (!existingItem) {
      return res.status(404).json({
        success: false,
        message: "Checklist item not found",
      });
    }

    // Avoid duplicate updates and audit logs.
    if (existingItem.status === status) {
      return res.json({
        success: true,
        message: "Checklist already up to date",
        checklistItem: existingItem,
      });
    }

    // Store the old status before updating.
    const oldStatus = existingItem.status;

    // Update the item.
    existingItem.status = status;
    existingItem.completedAt =
      status === "Completed" ? new Date() : null;

    const updatedItem = await existingItem.save();

    // Create audit record.
    await logAudit({
      user: req.user._id,
      module: "Checklist",
      recordId: updatedItem._id,
      action: status === "Completed" ? "Completed" : "Reopened",
      oldValue: oldStatus,
      newValue: status,
    });


    // Send the updated checklist item to the frontend.
    return res.json({
      success: true,
      message: "Checklist updated successfully",
      checklistItem: updatedItem,
    });
  } catch (err) {
    // Print the error in the server terminal.
    console.error("updateChecklistItem error:", err.message);

    // Send an error response to the frontend.
    return res.status(500).json({
      success: false,
      message: "Failed to update checklist",
    });
  }
};

            // Export controller functions so routes can use them.
            module.exports = {
            getChecklist,
            updateChecklistItem,
            };
