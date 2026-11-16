// Dashboard: welcome header with the employee's photo, a real notification bell
// (new jobs assigned by admin) and the assignment / attendance overview.
// Bell is DERIVED from GET /employee/jobs: status "Assigned" with no Accept/Decline yet.
// No notifications collection (lead decision). Refreshes every 60 seconds.

import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import {
  LuArrowRight,
  LuRefreshCw,
  LuSun,
  LuMoon,
  LuBell,
  LuX,
  LuClipboardList,
} from "react-icons/lu";

import JobSummary from "../../components/common/JobSummary";
import AttendanceStatus from "../../components/common/AttendanceStatus";
import UserAvatar from "../../components/common/UserAvatar";

import { getMyJobs } from "../../services/jobService";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

const REFRESH_MS = 60 * 1000;
const SEEN_KEY = "servicepro_seen_job_alerts";

// Seen alerts are only a per-device convenience, so storage errors are ignored.
const readSeen = () => {
  try {
    const raw = localStorage.getItem(SEEN_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeSeen = (ids) => {
  try {
    localStorage.setItem(SEEN_KEY, JSON.stringify(ids));
  } catch {
    // ignore
  }
};

const jobId = (job) => String(job.id ?? job._id ?? job.bookingId ?? "");

// A "new assignment" = Assigned by admin and the employee has not answered yet.
const isNewAssignment = (job) =>
  (job.status === "Assigned" || job.status === "Pending") && !job.response;

const formatWhen = (value) => {
  if (!value) return "Schedule to be confirmed";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "Schedule to be confirmed";
  return d.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

function Dashboard() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [seenIds, setSeenIds] = useState(readSeen);

  const bellRef = useRef(null);

  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() || "Employee";

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  // silent = background refresh (no spinner, keeps the current list on failure)
  const loadJobs = useCallback(async (silent = false) => {
    if (!silent) {
      setLoading(true);
      setError(false);
    }

    try {
      const data = await getMyJobs();
      setJobs(Array.isArray(data) ? data : []);
      if (silent) setError(false);
    } catch (err) {
      console.error("Dashboard jobs error:", err);
      if (!silent) setError(true);
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadJobs();
    const timer = setInterval(() => loadJobs(true), REFRESH_MS);
    return () => clearInterval(timer);
  }, [loadJobs]);

  // Close the bell when clicking outside it
  useEffect(() => {
    if (!notificationsOpen) return undefined;

    const onPointerDown = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [notificationsOpen]);

  const newJobs = jobs.filter(isNewAssignment);
  const unseenCount = newJobs.filter((j) => !seenIds.includes(jobId(j))).length;

  // Opening the bell marks the current alerts as seen (badge clears)
  const toggleBell = () => {
    const opening = !notificationsOpen;
    setNotificationsOpen(opening);

    if (opening && unseenCount > 0) {
      const merged = Array.from(new Set([...seenIds, ...newJobs.map(jobId)]));
      setSeenIds(merged);
      writeSeen(merged);
    }
  };

  return (
    <main className="min-h-screen bg-page px-4 pb-28 pt-4 text-ink sm:px-6 sm:pt-6 lg:px-10 lg:pb-8">
      <div className="mx-auto max-w-7xl">
        {/* Top header */}
        <header className="flex min-h-14 items-center justify-between border-b border-line pb-4">
          {/* Mobile logo: desktop logo is in the sidebar */}
          <Link to="/" aria-label="ServicePro Dashboard" className="flex items-center lg:hidden">
            <img
              src={
                theme === "dark"
                  ? "/images/servicepro-logo-dark.png"
                  : "/images/servicepro-logo-light.png"
              }
              alt="ServicePro"
              className="h-7 w-auto max-w-[120px] object-contain"
            />
          </Link>

          <div className="hidden lg:block">
            <p className="text-sm font-semibold text-ink">Employee Workspace</p>
            <p className="mt-0.5 text-xs text-muted">Field Operations</p>
          </div>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            {/* Theme switcher */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-surface text-muted transition hover:border-primary hover:text-primary"
            >
              {theme === "dark" ? <LuSun size={19} /> : <LuMoon size={19} />}
            </button>

            {/* Notification bell */}
            <div className="relative" ref={bellRef}>
              <button
                type="button"
                onClick={toggleBell}
                aria-label={
                  unseenCount > 0
                    ? `Open notifications, ${unseenCount} new`
                    : "Open notifications"
                }
                aria-expanded={notificationsOpen}
                className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-surface text-muted transition hover:border-primary hover:text-primary"
              >
                <LuBell size={19} />
                {unseenCount > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-page">
                    {unseenCount > 9 ? "9+" : unseenCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 top-12 z-50 w-[min(340px,calc(100vw-32px))] overflow-hidden rounded-2xl border border-line bg-surface shadow-xl">
                  <div className="flex items-center justify-between border-b border-line px-4 py-3">
                    <div>
                      <h2 className="text-sm font-semibold text-ink">Notifications</h2>
                      <p className="mt-0.5 text-xs text-muted">
                        {newJobs.length > 0
                          ? `${newJobs.length} job${newJobs.length > 1 ? "s" : ""} waiting for your response`
                          : "Work updates"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNotificationsOpen(false)}
                      aria-label="Close notifications"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-elevated hover:text-ink"
                    >
                      <LuX size={17} />
                    </button>
                  </div>

                  {newJobs.length === 0 ? (
                    <div className="px-5 py-8 text-center">
                      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-elevated text-muted">
                        <LuBell size={20} />
                      </div>
                      <p className="mt-3 text-sm font-semibold text-ink">You are all caught up</p>
                      <p className="mx-auto mt-1 max-w-[230px] text-xs leading-5 text-muted">
                        When Admin assigns you a new job, it will appear here.
                      </p>
                    </div>
                  ) : (
                    <ul className="max-h-80 divide-y divide-line overflow-y-auto">
                      {newJobs.map((job) => (
                        <li key={jobId(job)}>
                          <Link
                            to={`/assignments/${jobId(job)}`}
                            onClick={() => setNotificationsOpen(false)}
                            className="flex items-start gap-3 px-4 py-3 transition hover:bg-elevated"
                          >
                            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                              <LuClipboardList size={17} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-ink">New job assigned</p>
                              <p className="mt-0.5 truncate text-xs text-ink">
                                {job.serviceName || "Service"}
                                {job.customerName ? ` · ${job.customerName}` : ""}
                              </p>
                              <p className="mt-0.5 text-[11px] text-muted">
                                {formatWhen(job.scheduledAt)} · Tap to accept or decline
                              </p>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            {/* Employee profile link */}
            <Link
              to="/profile"
              aria-label={`Open ${displayName}'s profile`}
              className="flex min-w-0 items-center gap-2 border-l border-line pl-3"
            >
              <UserAvatar size={36} />
              <div className="hidden min-w-0 sm:block">
                <p className="max-w-32 truncate text-sm font-semibold text-ink">{displayName}</p>
                <p className="text-[11px] text-muted">View profile</p>
              </div>
            </Link>
          </div>
        </header>

        {/* Welcome */}
        <section className="mb-7 mt-6 sm:mt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            {greeting}
          </p>
          <h1 className="mt-2 font-heading text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Welcome, {displayName}
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
            Review your assignments and keep track of your daily activities.
          </p>
        </section>

        {/* Main content */}
        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.85fr)] lg:gap-8">
          {/* Assignment overview */}
          <section className="min-w-0 rounded-2xl border border-line bg-surface p-5 sm:p-7">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="font-heading text-lg font-bold text-ink">Assignment overview</h2>
                <p className="mt-1 text-xs text-muted">Your current service workload</p>
              </div>

              <Link
                to="/assignments"
                className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80"
              >
                View all
                <LuArrowRight size={15} />
              </Link>
            </div>

            {loading ? (
              <div className="flex min-h-40 items-center justify-center" role="status">
                <div className="text-center">
                  <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-line border-t-primary" />
                  <p className="mt-4 text-sm text-muted">Loading your assignments...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex min-h-40 flex-col items-center justify-center text-center">
                <p className="text-sm font-semibold text-ink">Unable to load assignments</p>
                <p className="mt-2 text-xs text-muted">
                  Please check your connection and try again.
                </p>
                <button
                  type="button"
                  onClick={() => loadJobs()}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90"
                >
                  <LuRefreshCw size={15} />
                  Try again
                </button>
              </div>
            ) : (
              <JobSummary jobs={jobs} />
            )}
          </section>

          {/* Attendance */}
          <section className="min-w-0 rounded-2xl border border-line bg-surface p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-heading text-lg font-bold text-ink">Attendance</h2>
                <p className="mt-1 text-xs text-muted">Your current workday status</p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal/10 text-teal">
                <span className="h-2 w-2 rounded-full bg-teal" />
              </div>
            </div>

            <AttendanceStatus />

            <Link
              to="/attendance"
              className="mt-5 flex items-center justify-between border-t border-line pt-4 text-sm font-semibold text-primary transition hover:text-primary/80"
            >
              Open attendance
              <LuArrowRight size={17} />
            </Link>
          </section>
        </div>

        {/* Desktop footer */}
        <footer className="mt-12 hidden border-t border-line pt-5 lg:block">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs text-muted">© {new Date().getFullYear()} ServicePro</p>
            <p className="text-xs text-muted">Employee Workspace · Field Operations</p>
          </div>
        </footer>
      </div>
    </main>
  );
}

export default Dashboard;