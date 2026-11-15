// client/src/services/attendanceService.js
// WHY: All attendance API calls in one place, so the page never calls axios directly.
// APIs: /api/attendance/today, /clock-in, /clock-out, /history (server: attendanceController.js)
// Used by: pages/Attendance/Attendance.jsx

import api from "./api";

// Today's sessions, current open session, and total minutes.
export async function getToday() {
  const res = await api.get("/attendance/today");
  return res.data;
}

export async function clockIn() {
  const res = await api.post("/attendance/clock-in");
  return res.data;
}

export async function clockOut() {
  const res = await api.post("/attendance/clock-out");
  return res.data;
}

// History grouped by date. Default = last 7 days.
export async function getHistory() {
  const res = await api.get("/attendance/history");
  return res.data;
}