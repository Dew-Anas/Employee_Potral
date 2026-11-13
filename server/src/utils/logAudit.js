// WHY: One reusable function to record "who changed what and when" in auditlogs.
// USED BY: checklistController, attendanceController, photo/note controllers, completion gate.
// MODEL: models/AuditLog.js (schema is shared with Dev 2's admin audit screen).
// RULE: this must NEVER break the main action. If writing the log fails, only log to console.

const AuditLog = require("../models/AuditLog");

const toText = (value) => {
  if (value === undefined || value === null) return "";
  if (typeof value === "string") return value;

  try{
     return JSON.stringify(value);
  }catch (error) {
    return String(value);
     }
};

const logAudit = async ({
  user,
  module,
  recordId,
  action,
  oldValue,
  newValue,
}) => {

    try {
    await AuditLog.create({
      user: user || null,
      module,
      recordId: String(recordId),
      action,
      oldValue: toText(oldValue),
      newValue: toText(newValue),
    });

    } catch (error) {
    console.error("logAudit error:", error.message);
  }
};

module.exports = logAudit;