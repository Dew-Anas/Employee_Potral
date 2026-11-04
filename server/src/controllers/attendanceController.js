
const Attendance = require("../models/Attendance");

const todayString = () =>
  new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Colombo" });

const clockIn = async(req,res)=>{
    try{
        const date = todayString();

        const existing = await Attendance.findOne({employee:req.user._id,date});

        if(existing){
            return res.status(409).json({
                success:false,
                message:existing.clockOut ? "Today's attendance is already completed": "Your are already clocked in",
            });
        }

        const record = await Attendance.create({employee:req.user._id,date,clockIn:new Date()});

        return res.status(201).json({
            success:true,
            message:"Clocked in successfullly",
            attendance:record,

        });

    } catch(err){
        if(err.code === 11000){
            return res.status(409).json({
                success:false,
                message:"Your are already clocked in"
            });
        }

        console.error("Clock in error:",err.message);

        return res.status(500).json({
            success:false,
            message:"Server error",
        });
    }
};

const clockOut = async(req,res)=>{
    try{
        const record = await Attendance.findOne({employee: req.user._id, date: todayString() });

        if (!record) {
      return res.status(400).json({ success: false, message: "You have not clocked in today" });
        }

        if (record.clockOut) {
      return res.status(409).json({ success: false, message: "You have already clocked out today" });
    }

    const now = new Date();
      const workedMinutes = Math.round(
        (now-record.clockIn)/60000
      );

      record.clockOut = now;
      record.workedMinutes = workedMinutes;
      record.status = "Clocked Out";

      await record.save();

      return res.status(200).json({
      success: true,
      message: "Clocked out successfully",
      attendance: record,
    });

    }catch(err){
        console.error("Clock out error:", err.message);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });

    }
};

        const getToday = async (req, res) => {
  try {
    
    const record = await Attendance.findOne({
      employee: req.user._id,
      date: todayString(),
    });

    return res.status(200).json({
      success: true,
      attendance: record,
    });

     } catch (err) {
    console.error("Get today attendance error:", err.message);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


module.exports ={clockIn,clockOut,getToday};