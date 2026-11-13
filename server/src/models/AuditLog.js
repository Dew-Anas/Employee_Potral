
const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
    {
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            default:null,
        },

        module:{type:String, required:true},
        recordId: { type: String, required: true },
        action: { type: String, required: true },
        oldValue: { type: String, default: "" },
        newValue: { type: String, default: "" },
        timestamp: { type: Date, default: Date.now },
    },
     { timestamps: false },
);

module.exports = mongoose.model("AuditLog", auditLogSchema);