
import { useCallback, useEffect, useState } from "react";
import {
  LuClock,
  LuLogIn,
  LuLogOut,
} from "react-icons/lu";
import api from "../../services/api";

// Format time using Sri Lanka timezone
const formatTime = (iso) =>
  new Date(iso).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Colombo",
  });

// Convert minutes into hours and minutes
const formatDuration = (mins = 0) =>
  `${Math.floor(mins / 60)}h ${mins % 60}m`;

function Attendance() {
  const [sessions, setSessions] = useState([]);
  const [current, setCurrent] = useState(null);
  const [totalMinutes, setTotalMinutes] = useState(0);

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  // TODO: Connect booking API when Booking schema is ready.
  const hasActiveJob = false;

  // 1. Load today's attendance
  const loadToday = useCallback(async () => {
    try {
      setError("");

      const res = await api.get("/attendance/today");

      setSessions(res.data.sessions || []);
      setCurrent(res.data.current || null);
      setTotalMinutes(res.data.totalMinutes || 0);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not load attendance. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadToday();
  }, [loadToday]);

  // 2. Clock In
  const handleClockIn = async () => {
    setError("");
    setBusy(true);

    try {
      await api.post("/attendance/clock-in");

      await loadToday();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Clock in failed. Please try again."
      );
    } finally {
      setBusy(false);
    }
  };

  // 3. Clock Out
  const handleClockOut = async () => {
    setError("");
    setBusy(true);

    try {
      await api.post("/attendance/clock-out");

      await loadToday();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Clock out failed. Please try again."
      );
    } finally {
      setBusy(false);
      setShowConfirm(false);
    }
  };

  // 4. Loading
  if (loading) {
    return (
      <div className="p-4 text-muted">
        Loading attendance...
      </div>
    );
  }

  // 5. Attendance status
  let label = "Not clocked in";

  if (current) {
    label = "Clocked in";
  } else if (sessions.length > 0) {
    label = "Clocked out";
  }

  return (
    <div className="p-4">
      {/* Page heading */}
      <h1 className="font-heading text-2xl font-semibold text-ink">
        Attendance
      </h1>

      <p className="mt-1 text-sm text-muted">
        {new Date().toLocaleDateString("en-GB", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
          timeZone: "Asia/Colombo",
        })}
      </p>

      {/* Error message */}
      {error && (
        <p className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      {/* Today's attendance summary */}
      <div className="mt-4 rounded-2xl border border-line bg-surface p-4">
        <div className="flex items-center gap-2 text-sm text-muted">
          <LuClock />
          Today's status
        </div>

        <p className="mt-2 font-heading text-xl font-semibold text-ink">
          {label}
        </p>

        {current && (
          <p className="mt-1 font-mono text-sm text-muted">
            Since {formatTime(current.clockIn)}
          </p>
        )}

        <p className="mt-3 text-sm text-muted">
          Worked today (completed sessions):{" "}
          <span className="font-mono text-teal">
            {formatDuration(totalMinutes)}
          </span>
        </p>
      </div>

      {/* Clock In / Clock Out buttons */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          onClick={handleClockIn}
          disabled={busy || Boolean(current)}
          className="flex items-center justify-center gap-2 rounded-xl bg-primary py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          <LuLogIn />
          {busy ? "Please wait..." : "Clock in"}
        </button>

        <button
          onClick={() => setShowConfirm(true)}
          disabled={busy || !current || hasActiveJob}
          className="flex items-center justify-center gap-2 rounded-xl border border-line bg-elevated py-3 font-medium text-ink disabled:cursor-not-allowed disabled:opacity-40"
        >
          <LuLogOut />
          Clock out
        </button>
      </div>

      {hasActiveJob && (
        <p className="mt-2 text-xs text-muted">
          Complete your current job before clocking out.
        </p>
      )}

      {/* Today's sessions */}
      <div className="mt-6">
        <h2 className="font-heading text-lg font-semibold text-ink">
          Today's sessions
        </h2>

        {sessions.length === 0 ? (
          <p className="mt-2 text-sm text-muted">
            No sessions yet. Clock in to start.
          </p>
        ) : (
          <ul className="mt-2 flex flex-col gap-2">
            {sessions.map((session) => (
              <li
                key={session._id}
                className="flex items-center justify-between rounded-xl border border-line bg-surface px-4 py-3 text-sm"
              >
                <span className="font-mono text-ink">
                  {formatTime(session.clockIn)} -{" "}
                  {session.clockOut
                    ? formatTime(session.clockOut)
                    : "Now"}
                </span>

                <span className="font-mono text-muted">
                  {session.clockOut
                    ? formatDuration(session.workedMinutes)
                    : "In progress"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Clock Out confirmation modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-sm rounded-2xl border border-line bg-surface p-5">
            <h2 className="font-heading text-lg font-semibold text-ink">
              Clock out?
            </h2>

            <p className="mt-1 text-sm text-muted">
              You will not receive new jobs until you clock in again.
            </p>

            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={busy}
                className="flex-1 rounded-xl border border-line py-2.5 text-ink disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                onClick={handleClockOut}
                disabled={busy}
                className="flex-1 rounded-xl bg-primary py-2.5 font-medium text-white disabled:opacity-60"
              >
                {busy ? "Clocking out..." : "Clock out"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Attendance;
