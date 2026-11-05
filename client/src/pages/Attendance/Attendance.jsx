
import { useEffect, useState } from "react";
import { LuClock, LuLogIn, LuLogOut } from "react-icons/lu";
import api from "../../services/api";

// Format time: 09:30
const formatTime = (iso) =>
  new Date(iso).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Colombo",
  });

// Format worked minutes: 8h 30m
const formatDuration = (mins = 0) =>
  `${Math.floor(mins / 60)}h ${mins % 60}m`;

function Attendance() {
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  // 1. Load today's attendance
  useEffect(() => {
    const loadToday = async () => {
      try {
        const res = await api.get("/attendance/today");
        setAttendance(res.data.attendance);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Could not load attendance. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    loadToday();
  }, []);

  // 2. Clock In
  const handleClockIn = async () => {
    setError("");
    setBusy(true);

    try {
      const res = await api.post("/attendance/clock-in");
      setAttendance(res.data.attendance);
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
      const res = await api.post("/attendance/clock-out");
      setAttendance(res.data.attendance);
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

  // 4. Loading screen
  if (loading) {
    return (
      <div className="p-4 text-muted">
        Loading attendance...
      </div>
    );
  }

  // 5. Attendance status
  const completed = Boolean(
    attendance && attendance.clockOut
  );

  const clockedIn = Boolean(
    attendance && !attendance.clockOut
  );

  return (
    <div className="p-4">
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

      {error && (
        <p className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      {/* Attendance Card */}
      <div className="mt-4 rounded-2xl border border-line bg-surface p-4">
        <div className="flex items-center gap-2 text-sm text-muted">
          <LuClock />
          Today's status
        </div>

        <p className="mt-2 font-heading text-xl font-semibold text-ink">
          {completed
            ? "Day completed"
            : clockedIn
              ? "Clocked in"
              : "Not clocked in"}
        </p>

        {attendance && (
          <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-muted">Clock in</dt>
              <dd className="font-mono text-ink">
                {formatTime(attendance.clockIn)}
              </dd>
            </div>

            <div>
              <dt className="text-muted">Clock out</dt>
              <dd className="font-mono text-ink">
                {completed
                  ? formatTime(attendance.clockOut)
                  : "--:--"}
              </dd>
            </div>

            {completed && (
              <div className="col-span-2">
                <dt className="text-muted">Time worked</dt>
                <dd className="font-mono text-teal">
                  {formatDuration(attendance.workedMinutes)}
                </dd>
              </div>
            )}
          </dl>
        )}
      </div>

      {/* Clock In Button */}
      {!attendance && (
        <button
          onClick={handleClockIn}
          disabled={busy}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-medium text-white disabled:opacity-60"
        >
          <LuLogIn />
          {busy ? "Clocking in..." : "Clock in"}
        </button>
      )}

      {/* Clock Out Button */}
      {clockedIn && (
        <button
          onClick={() => setShowConfirm(true)}
          disabled={busy}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-line bg-elevated py-3 font-medium text-ink disabled:opacity-60"
        >
          <LuLogOut />
          Clock out
        </button>
      )}

      {/* Completed Message */}
      {completed && (
        <p className="mt-4 text-sm text-muted">
          Attendance for today is complete.
          You can clock in again tomorrow.
        </p>
      )}

      {/* Clock Out Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-sm rounded-2xl border border-line bg-surface p-5">
            <h2 className="font-heading text-lg font-semibold text-ink">
              Clock out?
            </h2>

            <p className="mt-1 text-sm text-muted">
              You cannot clock in again today after clocking out.
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
