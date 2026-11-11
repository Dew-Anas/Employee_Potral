
const mongoose = require("mongoose");

const checklistItemSchema = new mongoose.Schema(
    {
        booking:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Booking",
            required:true,
        },

        employee:{
            type: mongoose.Schema.Types.ObjectId,
             ref: "User",
             required: true,
        },

        title:{
            type: String,
            required: true,
            trim: true,
        },

        essential:{
            type: Boolean,
            required: true,
            default: false,
        },

        order:{
            type:Number,
            required:true,
        },

        status:{
            type:String,
            enum:["Pending","Completed"],
            default:"Pending",
        },

        completedAt:{
            type: Date,
             default: null,
        },

    },

    {
        collection:"checklistitems",
        timestamps:true,
    }

);

module.exports = mongoose.model(
  "ChecklistItem",
  checklistItemSchema
);