// client/src/pages/Attendance/Attendance.jsx
// WHY: Employee attendance: Clock In / Clock Out, today's sessions, and the last 7 days history.
// APIs: services/attendanceService.js (today, clock-in, clock-out, history), services/jobService.js (active job check).
// RULES: many sessions per day (lead); Clock Out is disabled while a job is In Progress (backend also blocks it).
// UI ONLY changes in this version: layout, skeletons, live elapsed time. Logic and API calls are unchanged.

import { useCallback, useEffect, useState } from "react";
import { LuClock, LuLogIn, LuLogOut, LuRefreshCw, LuTriangleAlert } from "react-icons/lu";

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

// Today's date as "YYYY-MM-DD" in Sri Lanka time (used to tag "Today" in history)
const todayKey = () =>
  new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Colombo" });

// Minutes since an ISO time (never negative)
const minutesSince = (iso, now) =>
  Math.max(0, Math.floor((now - new Date(iso).getTime()) / 60000));

function SessionRow({ session, compact = false }) {
  const open = !session.clockOut;

  return (
    <li
      className={`flex items-center justify-between ${
        compact ? "py-1.5 text-xs" : "rounded-xl border border-line bg-surface px-4 py-3 text-sm"
      }`}
    >
      <span className="flex items-center gap-2 font-mono text-ink">
        {open && <span className="h-2 w-2 rounded-full bg-teal" aria-hidden="true" />}
        {formatTime(session.clockIn)} – {open ? "Now" : formatTime(session.clockOut)}
      </span>

      <span className={`font-mono ${open ? "text-teal" : "text-muted"}`}>
        {open ? "In progress" : formatDuration(session.workedMinutes)}
      </span>
    </li>
  );
}

function Attendance() {
  const [sessions, setSessions] = useState([]);
  const [current, setCurrent] = useState(null);
  const [totalMinutes, setTotalMinutes] = useState(0);

  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
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

  // Ticks every 30s so the running session time stays fresh
  const [now, setNow] = useState(() => Date.now());

  // 1. Load today's attendance
  const loadToday = useCallback(async () => {
    try {
      setError("");
      setLoadFailed(false);

      const data = await getToday();

      setSessions(data.sessions || []);
      setCurrent(data.current || null);
      setTotalMinutes(data.totalMinutes || 0);
    } catch (err) {
      setLoadFailed(true);
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

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(id);
  }, []);

  const retryAll = () => {
    setLoading(true);
    setHistoryLoading(true);
    loadToday();
    loadHistory();
    loadActiveJob();
  };

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

  const heading = (
    <header>
      <h1 className="font-heading text-2xl font-semibold text-ink">Attendance</h1>
      <p className="mt-1 text-sm text-muted">
        {new Date().toLocaleDateString("en-GB", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
          timeZone: "Asia/Colombo",
        })}
      </p>
    </header>
  );

  // Loading skeleton
  if (loading) {
    return (
      <div className="mx-auto max-w-2xl p-4 pb-24">
        {heading}
        <div className="mt-5 h-40 animate-pulse rounded-2xl bg-elevated/60" />
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="h-12 animate-pulse rounded-xl bg-elevated/60" />
          <div className="h-12 animate-pulse rounded-xl bg-elevated/60" />
        </div>
        <div className="mt-6 h-16 animate-pulse rounded-xl bg-elevated/60" />
      </div>
    );
  }

  // Could not load at all: show a retry card instead of a half-empty page
  if (loadFailed && sessions.length === 0 && !current) {
    return (
      <div className="mx-auto max-w-2xl p-4 pb-24">
        {heading}
        <div className="mt-5 rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-center">
          <LuTriangleAlert className="mx-auto text-red-300" size={26} />
          <p className="mt-3 text-sm text-red-200">{error}</p>
          <button
            onClick={retryAll}
            className="mt-4 inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-4 py-2 text-sm font-medium text-ink transition hover:bg-elevated"
          >
            <LuRefreshCw size={16} />
            Try again
          </button>
        </div>
      </div>
    );
  }

  // Attendance status
  let label = "Not clocked in";
  let hint = "Clock in to start your day.";
  let dot = "bg-muted";

  if (current) {
    label = "Clocked in";
    hint = `Since ${formatTime(current.clockIn)}`;
    dot = "bg-teal";
  } else if (sessions.length > 0) {
    label = "Clocked out";
    hint = "You can clock in again anytime.";
    dot = "bg-primary";
  }

  const runningMinutes = current ? minutesSince(current.clockIn, now) : 0;
  const today = todayKey();

  return (
    <div className="mx-auto max-w-2xl p-4 pb-24">
      {heading}

      {/* Error message */}
      {error && (
        <p
          role="alert"
          className="mt-4 rounded-xl border border-red-500/40 bg-red-500/10 px-3.5 py-3 text-sm text-red-300"
        >
          {error}
        </p>
      )}

      {/* Today's status */}
      <section className="mt-5 overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="p-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted">
            <LuClock size={14} />
            Today's status
          </div>

          <div className="mt-3 flex items-center gap-3">
            <span className="relative flex h-3 w-3 shrink-0">
              {current && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal opacity-60" />
              )}
              <span className={`relative inline-flex h-3 w-3 rounded-full ${dot}`} />
            </span>

            <div>
              <p className="font-heading text-xl font-semibold text-ink">{label}</p>
              <p className="mt-0.5 font-mono text-xs text-muted">{hint}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 divide-x divide-line border-t border-line bg-elevated/40">
          <div className="px-5 py-3">
            <p className="text-xs text-muted">Completed today</p>
            <p className="mt-0.5 font-mono text-base font-semibold text-teal">
              {formatDuration(totalMinutes)}
            </p>
          </div>

          <div className="px-5 py-3">
            <p className="text-xs text-muted">Current session</p>
            <p className="mt-0.5 font-mono text-base font-semibold text-ink">
              {current ? formatDuration(runningMinutes) : "—"}
            </p>
          </div>
        </div>
      </section>

      {/* Clock In / Clock Out buttons */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          onClick={handleClockIn}
          disabled={busy || Boolean(current)}
          className="flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <LuLogIn size={18} />
          {busy && !showConfirm ? "Please wait..." : "Clock in"}
        </button>

        <button
          onClick={() => setShowConfirm(true)}
          disabled={busy || !current || hasActiveJob}
          className="flex items-center justify-center gap-2 rounded-xl border border-line bg-elevated py-3 text-sm font-semibold text-ink transition hover:bg-elevated/70 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <LuLogOut size={18} />
          Clock out
        </button>
      </div>

      {hasActiveJob && (
        <p className="mt-2 rounded-lg bg-elevated/60 px-3 py-2 text-xs text-muted">
          You have a job in progress. Complete it before clocking out.
        </p>
      )}

      {/* Today's sessions */}
      <section className="mt-7">
        <h2 className="font-heading text-base font-semibold text-ink">
          Today's sessions
        </h2>

        {sessions.length === 0 ? (
          <p className="mt-2 rounded-xl border border-dashed border-line px-4 py-5 text-center text-sm text-muted">
            No sessions yet. Clock in to start.
          </p>
        ) : (
          <ul className="mt-2 flex flex-col gap-2">
            {sessions.map((session) => (
              <SessionRow key={session._id} session={session} />
            ))}
          </ul>
        )}
      </section>

      {/* Last 7 days history */}
      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-base font-semibold text-ink">
            Last 7 days
          </h2>

          {!historyLoading && !historyError && (
            <span className="rounded-full bg-teal/10 px-2.5 py-1 font-mono text-xs font-semibold text-teal">
              {formatDuration(historyTotal)} total
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
          <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
            <span>Unable to load attendance history.</span>
            <button
              onClick={() => {
                setHistoryLoading(true);
                loadHistory();
              }}
              className="shrink-0 rounded-lg border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink hover:bg-elevated"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty */}
        {!historyLoading && !historyError && historyDays.length === 0 && (
          <p className="mt-3 rounded-xl border border-dashed border-line px-4 py-5 text-center text-sm text-muted">
            No attendance records in the last 7 days.
          </p>
        )}

        {/* Days */}
        {!historyLoading && !historyError && historyDays.length > 0 && (
          <div className="mt-3 space-y-3">
            {historyDays.map((day) => (
              <article
                key={day.date}
                className="rounded-2xl border border-line bg-surface p-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-ink">
                    {formatDay(day.date)}
                    {day.date === today && (
                      <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                        Today
                      </span>
                    )}
                  </h3>

                  <span className="font-mono text-sm font-semibold text-teal">
                    {formatDuration(day.totalMinutes)}
                  </span>
                </div>

                <ul className="mt-2 divide-y divide-line/60 border-t border-line/60">
                  {day.sessions.map((session) => (
                    <SessionRow key={session._id} session={session} compact />
                  ))}
                </ul>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Clock Out confirmation modal */}
      {showConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="clockout-title"
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 px-4 pb-6 sm:items-center sm:pb-0"
        >
          <div className="w-full max-w-sm rounded-2xl border border-line bg-surface p-5 shadow-xl">
            <h2
              id="clockout-title"
              className="font-heading text-lg font-semibold text-ink"
            >
              Clock out?
            </h2>

            <p className="mt-1 text-sm text-muted">
              You will not receive new jobs until you clock in again.
            </p>

            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={busy}
                className="flex-1 rounded-xl border border-line py-2.5 text-sm font-medium text-ink hover:bg-elevated disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                onClick={handleClockOut}
                disabled={busy}
                className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-60"
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