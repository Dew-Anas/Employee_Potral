
import { useEffect, useState } from "react";
import api from "../../services/api";

const formatTime = (iso) =>
  new Date(iso).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Colombo",
  });

function AttendanceStatus() {
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const loadToday = async () => {
      try {
        const res = await api.get("/attendance/today");
        setAttendance(res.data.attendance);
      } catch (error) {
        setFailed(true);
      } finally {
        setLoading(false);
      }
    };

    loadToday();
  }, []);

  let label = "Not clocked in";
  let detail = "Clock in to start your day";

  if (loading) {
    label = "Checking attendance...";
    detail = "";
  } else if (failed) {
    label = "Attendance unavailable";
    detail = "Please check attendance page";
  } else if (attendance && !attendance.clockOut) {
    label = "Clocked in";
    detail = `Since ${formatTime(attendance.clockIn)}`;
  } else if (attendance && attendance.clockOut) {
    label = "Day completed";
    detail = `${formatTime(attendance.clockIn)} - ${formatTime(attendance.clockOut)}`;
  }

  let dot = "bg-muted";

  if (!loading && !failed && attendance && !attendance.clockOut) {
    dot = "bg-teal";
  }

  if (!loading && !failed && attendance && attendance.clockOut) {
    dot = "bg-primary";
  }

  return (
    <div className="mt-4 flex items-center gap-3 rounded-xl border border-line bg-elevated/50 px-4 py-3">
      <span
        className={`h-2.5 w-2.5 shrink-0 rounded-full ${dot}`}
      />

      <div>
        <p className="text-sm font-semibold text-ink">
          {label}
        </p>

        {detail && (
          <p className="mt-0.5 font-mono text-xs text-muted">
            {detail}
          </p>
        )}
      </div>
    </div>
  );
}

export default AttendanceStatus;
