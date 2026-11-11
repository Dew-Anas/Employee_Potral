
const mongoose = require("mongoose");

const ChecklistItem = require("../models/ChecklistItem");

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
    const updatedItem = await ChecklistItem.findOneAndUpdate(
      {
        _id: itemId,
        employee: req.user._id,
      },
      {
        $set: {
          status,
          // Save completion time, or clear it when set back to Pending.
          completedAt: status === "Completed" ? new Date() : null,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    // Check whether the item exists for this employee.
    if (!updatedItem) {
      return res.status(404).json({
        success: false,
        message: "Checklist item not found",
      });
    }

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
