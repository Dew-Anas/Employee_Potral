
const mongoose = require("mongoose");

const attendanceSchema =new mongoose.Schema(
    {
        employee:{type:mongoose.Schema.Types.ObjectId, ref:"User", required:true},

        date:{type:String, required:true},

        clockIn:
        {type:Date,
        required:true},

        clockOut:{
            type:Date,
            default:null,
        },

        workedMinutes:{
            type:Number,
            default:0},

            status:{
                type:String,
                enum:["Clocked In","Clocked Out"],
                default:"Clocked In",
        },
    },
    {collection:"attendances",timestamps:true}
   
);

attendanceSchema.index(
  { employee: 1, date: 1 },
  { unique: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);

