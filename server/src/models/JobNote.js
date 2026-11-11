

const mongoose = require("mongoose");

const jobNoteSchema = new mongoose.Schema({

    booking:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
        required: true,
    },

    employee:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    type:{
        type:String,
        required:true,
        enum:["Note","Incident"],
    },

    text:{
        type:String,
        required: true,
        trim: true,
        maxlength: 1000,
    },

},
{
    timestamps:true
},

);

jobNoteSchema.index({ booking: 1, createdAt: -1 });

module.exports = mongoose.model("JobNote", jobNoteSchema);