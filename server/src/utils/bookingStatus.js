// server/src/utils/bookingStatus.js
// WHY: Booking.status is saved in different styles by different devs.
//      Customer side (Dev_A): "assigned", "in_progress", "completed" (lowercase, underscore).
//      Admin side (Dev_B model): "Assigned", "In Progress", "Completed".
//      The employee portal READS every style and WRITES in the same style the booking already uses,
//      so the customer screens (labels, cancel, sign-off) keep working.
// TODO(confirm): Remove the extra variants once the lead confirms ONE final set of status values.
// Used by: employeeJobController, jobStatusController (and attendance / assignment checks).

const normalize = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[\s_-]+/g, "");

const CANONICAL = {
  assigned: "Assigned",
  inprogress: "In Progress",
  completed: "Completed",
};

// Any style -> "Assigned" | "In Progress" | "Completed" (other values are returned unchanged)
const canonicalStatus = (raw) => CANONICAL[normalize(raw)] || raw;

const VARIANTS = {
  Assigned: ["Assigned", "assigned", "ASSIGNED"],
  "In Progress": [
    "In Progress",
    "in progress",
    "in_progress",
    "in-progress",
    "inprogress",
    "InProgress",
    "IN_PROGRESS",
  ],
  Completed: ["Completed", "completed", "COMPLETED"],
};

// statusIn("Assigned", "In Progress") -> array to use inside { $in: [...] }
const statusIn = (...names) => names.flatMap((name) => VARIANTS[name] || [name]);

const LOWERCASE_STYLE = {
  Assigned: "assigned",
  "In Progress": "in_progress",
  Completed: "completed",
};

// The value to WRITE: same style as the booking's current status.
// writeStatus("In Progress", "assigned") -> "in_progress"
// writeStatus("In Progress", "Assigned") -> "In Progress"
const writeStatus = (name, currentRaw) =>
  /^[a-z_]+$/.test(String(currentRaw || "")) ? LOWERCASE_STYLE[name] || name : name;

module.exports = { canonicalStatus, statusIn, writeStatus };