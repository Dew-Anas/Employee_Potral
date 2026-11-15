// client/src/pages/Attendance/Attendance.jsx
// WHY: Employee attendance: Clock In / Clock Out, today's sessions, and the last 7 days history.
// APIs: services/attendanceService.js (today, clock-in, clock-out, history), services/jobService.js (active job check).
// RULES: many sessions per day (lead); Clock Out is disabled while a job is In Progress (backend also blocks it).

import { useCallback, useEffect, useState } from "react";
import { LuClock, LuLogIn, LuLogOut } from "react-icons/lu";

import {
  getToday,
  clockIn,
  clockOut,
  getHistory,
} from "../../services/attendanceService";
import { getMyJobs } from "../../services/jobService";

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

// Turn "2026-11-14" into "Sat, 14 Nov".
// Noon avoids the date shifting by a day in other time zones.
const formatDay = (dateString) =>
  new Date(`${dateString}T12:00:00`).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

function Attendance() {
  const [sessions, setSessions] = useState([]);
  const [current, setCurrent] = useState(null);
  const [totalMinutes, setTotalMinutes] = useState(0);

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  // History (last 7 days)
  const [historyDays, setHistoryDays] = useState([]);
  const [historyTotal, setHistoryTotal] = useState(0);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState(false);

  // True while one of my jobs is In Progress (Clock Out is blocked then).
  const [hasActiveJob, setHasActiveJob] = useState(false);

  // 1. Load today's attendance
  const loadToday = useCallback(async () => {
    try {
      setError("");

      const data = await getToday();

      setSessions(data.sessions || []);
      setCurrent(data.current || null);
      setTotalMinutes(data.totalMinutes || 0);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not load attendance. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Load the last 7 days
  const loadHistory = useCallback(async () => {
    try {
      setHistoryError(false);

      const data = await getHistory();

      setHistoryDays(data.days || []);
      setHistoryTotal(data.totalMinutes || 0);
    } catch (err) {
      console.error("Failed to load attendance history:", err);
      setHistoryError(true);
      setHistoryDays([]);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  // 3. Check whether I have a job In Progress
  const loadActiveJob = useCallback(async () => {
    try {
      const jobs = await getMyJobs();
      setHasActiveJob(jobs.some((job) => job.status === "In Progress"));
    } catch (err) {
      // If jobs cannot load, leave Clock Out enabled; the backend still blocks it.
      console.error("Failed to check active job:", err);
      setHasActiveJob(false);
    }
  }, []);

  useEffect(() => {
    loadToday();
    loadHistory();
    loadActiveJob();
  }, [loadToday, loadHistory, loadActiveJob]);

  // Clock In
  const handleClockIn = async () => {
    setError("");
    setBusy(true);

    try {
      await clockIn();

      await loadToday();
      await loadHistory();
    } catch (err) {
      setError(
        err.response?.data?.message || "Clock in failed. Please try again."
      );
    } finally {
      setBusy(false);
    }
  };

  // Clock Out
  const handleClockOut = async () => {
    setError("");
    setBusy(true);

    try {
      await clockOut();

      await loadToday();
      await loadHistory();
    } catch (err) {
      setError(
        err.response?.data?.message || "Clock out failed. Please try again."
      );
    } finally {
      setBusy(false);
      setShowConfirm(false);
    }
  };

  // Loading
  if (loading) {
    return <div className="p-4 text-muted">Loading attendance...</div>;
  }

  // Attendance status
  let label = "Not clocked in";

  if (current) {
    label = "Clocked in";
  } else if (sessions.length > 0) {
    label = "Clocked out";
  }

  return (
    <div className="p-4 pb-24">
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
                  {session.clockOut ? formatTime(session.clockOut) : "Now"}
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

      {/* Last 7 days history */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold text-ink">
            Last 7 days
          </h2>

          {!historyLoading && !historyError && (
            <span className="font-mono text-sm text-teal">
              {formatDuration(historyTotal)}
            </span>
          )}
        </div>

        {/* Loading skeleton */}
        {historyLoading && (
          <div className="mt-3 space-y-3">
            <div className="h-20 animate-pulse rounded-xl bg-elevated/60" />
            <div className="h-20 animate-pulse rounded-xl bg-elevated/60" />
          </div>
        )}

        {/* Error */}
        {!historyLoading && historyError && (
          <p className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
            Unable to load attendance history. Please refresh and try again.
          </p>
        )}

        {/* Empty */}
        {!historyLoading && !historyError && historyDays.length === 0 && (
          <p className="mt-3 text-sm text-muted">
            No attendance records in the last 7 days.
          </p>
        )}

        {/* Days */}
        {!historyLoading && !historyError && historyDays.length > 0 && (
          <div className="mt-3 space-y-3">
            {historyDays.map((day) => (
              <section
                key={day.date}
                className="rounded-xl border border-line bg-surface p-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-ink">
                    {formatDay(day.date)}
                  </h3>

                  <span className="font-mono text-sm text-teal">
                    {formatDuration(day.totalMinutes)}
                  </span>
                </div>

                <ul className="mt-2 space-y-1">
                  {day.sessions.map((session) => (
                    <li
                      key={session._id}
                      className="flex items-center justify-between text-xs"
                    >
                      <span className="font-mono text-muted">
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
              </section>
            ))}
          </div>
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