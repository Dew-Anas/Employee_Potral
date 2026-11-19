// Small attendance status card shown on the Dashboard. UI polish only; same API call as before.

import { useEffect, useState } from "react";
import api from "../../services/api";

// Format time using Sri Lanka timezone
const formatTime = (iso) =>
  new Date(iso).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Colombo",
  });

function AttendanceStatus() {
  const [current, setCurrent] = useState(null);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  // Load today's attendance
  useEffect(() => {
    const loadToday = async () => {
      try {
        const res = await api.get("/attendance/today");

        setCurrent(res.data.current || null);
        setCount((res.data.sessions || []).length);
      } catch (error) {
        console.error("Attendance status error:", error);
        setFailed(true);
      } finally {
        setLoading(false);
      }
    };

    loadToday();
  }, []);

  // Default attendance status
  let label = "Not clocked in";
  let detail = "Clock in to start your day";
  let dot = "bg-muted";

  if (loading) {
    label = "Checking attendance...";
    detail = "";
  } else if (failed) {
    label = "Attendance unavailable";
    detail = "Please check the attendance page";
    dot = "bg-red-400";
  } else if (current) {
    label = "Clocked in";
    detail = `Since ${formatTime(current.clockIn)}`;
    dot = "bg-teal";
  } else if (count > 0) {
    label = "Clocked out";
    detail = "You can clock in again anytime";
    dot = "bg-primary";
  }

  const live = !loading && !failed && Boolean(current);

  return (
    <div className="mt-4 flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3.5">
      <span className="relative flex h-2.5 w-2.5 shrink-0">
        {live && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal opacity-60" />
        )}
        <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${dot}`} />
      </span>

      <div className="min-w-0">
        <p className="text-sm font-semibold text-ink">{label}</p>

        {detail && (
          <p className="mt-0.5 truncate font-mono text-xs text-muted">{detail}</p>
        )}
      </div>
    </div>
  );
}

export default AttendanceStatus;