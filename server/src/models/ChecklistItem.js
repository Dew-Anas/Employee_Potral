
const mongoose = require("mongoose");

const checklistItemSchema = new mongoose.Schema(
    {
        //qhich booking this checklist belongs to

        booking:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Booking",
            required:true,
        },
        //Employee responsible for this checklist

        employee:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
        },

        essantial :{
            type: Boolean,
            default:false,
        },

        order :{
            type : Number,
            default:0,
        },

        //checkList task status

        status :{
            type : String,
            enum: ["Pending", "Completed"],
            default:"Pending",
        },

        //Task  completion timestamp

        completedAt:{
            type:Date,
            default:null,
        },
    },
    {timestamps: true}
);


module.exports = mongoose.model("ChecklistItem", checklistItemSchema);