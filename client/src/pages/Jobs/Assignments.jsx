// client/src/pages/Assignments/Assignments.jsx
// WHY: List of jobs assigned to this employee (the employee's "inbox").
// DATA: getMyJobs() from services/jobService.js (demo or real API).
// UI: 4 equal stat tabs (fit a 320px phone), cards with a status accent, skeleton loading,
//     retry on error. A job admin assigned that the employee has not answered is highlighted as "New".

import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  LuMapPin,
  LuCalendarClock,
  LuChevronRight,
  LuRefreshCw,
  LuClipboardList,
} from "react-icons/lu";

import { getMyJobs, USING_DEMO_DATA } from "../../services/jobService";

const TABS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "inProgress", label: "In Progress" },
  { key: "completed", label: "Completed" },
];

// Portal "Pending" = Booking "Assigned".
const groupOf = (job) => {
  if (job.status === "In Progress") return "inProgress";
  if (job.status === "Completed") return "completed";
  return "pending";
};

const isNew = (job) => groupOf(job) === "pending" && !job.response;

// Badge text + colours + left accent colour for each card.
function getStyle(job) {
  if (job.status === "In Progress") {
    return { text: "In Progress", badge: "bg-primary/15 text-primary", accent: "bg-primary" };
  }

  if (job.status === "Completed") {
    return { text: "Completed", badge: "bg-teal/15 text-teal", accent: "bg-teal" };
  }

  if (job.response === "Accepted") {
    return { text: "Accepted", badge: "bg-teal/15 text-teal", accent: "bg-teal" };
  }

  if (job.response === "Declined") {
    return { text: "Declined", badge: "bg-amber-500/15 text-amber-400", accent: "bg-amber-500" };
  }

  return { text: "Awaiting response", badge: "bg-primary/15 text-primary", accent: "bg-primary" };
}

const formatWhen = (value) => {
  if (!value) return "Schedule to be confirmed";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Schedule to be confirmed";

  return date.toLocaleString("en-LK", { dateStyle: "medium", timeStyle: "short" });
};

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-line bg-surface p-4">
      <div className="h-5 w-2/3 rounded bg-elevated" />
      <div className="mt-3 h-3.5 w-1/3 rounded bg-elevated" />
      <div className="mt-5 h-3.5 w-1/2 rounded bg-elevated" />
      <div className="mt-2 h-3.5 w-3/4 rounded bg-elevated" />
    </div>
  );
}

function Assignments() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("all");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getMyJobs();
      setJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Assignments load error:", err);
      setError("Unable to load your assignments.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const counts = {
    all: jobs.length,
    pending: jobs.filter((job) => groupOf(job) === "pending").length,
    inProgress: jobs.filter((job) => groupOf(job) === "inProgress").length,
    completed: jobs.filter((job) => groupOf(job) === "completed").length,
  };

  const visibleJobs = tab === "all" ? jobs : jobs.filter((job) => groupOf(job) === tab);
  const newCount = jobs.filter(isNew).length;

  return (
    <main className="min-h-screen bg-page px-4 pb-28 pt-5 text-ink sm:px-6 lg:px-10 lg:pb-10">
      <div className="mx-auto max-w-5xl">
        {/* Heading */}
        <header className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="font-heading text-xl font-bold tracking-tight sm:text-2xl">
              My Assignments
            </h1>
            <p className="mt-1 text-sm text-muted">
              {newCount > 0
                ? `${newCount} new job${newCount > 1 ? "s" : ""} waiting for your response`
                : "Jobs assigned to you by the admin"}
            </p>
          </div>

          {USING_DEMO_DATA && (
            <span className="shrink-0 rounded-full border border-line px-3 py-1 text-xs text-muted">
              Demo data
            </span>
          )}
        </header>

        {/* Tabs: 4 equal boxes, always fully visible */}
        <div
          role="tablist"
          aria-label="Filter assignments"
          className="mt-5 grid grid-cols-4 gap-2 sm:max-w-xl"
        >
          {TABS.map((item) => {
            const active = tab === item.key;

            return (
              <button
                key={item.key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(item.key)}
                className={`flex flex-col items-center justify-center rounded-xl border px-1 py-3 text-center transition ${
                  active
                    ? "border-primary bg-primary text-white"
                    : "border-line bg-surface text-muted hover:text-ink"
                }`}
              >
                <span className="font-mono text-lg font-semibold leading-none tabular-nums">
                  {counts[item.key]}
                </span>
                <span className="mt-1.5 text-[11px] font-medium leading-tight">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-5 grid gap-4 lg:grid-cols-2" role="status" aria-label="Loading assignments">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="mt-5 rounded-2xl border border-line bg-surface p-8 text-center">
            <p className="text-sm font-semibold text-ink">{error}</p>
            <p className="mt-1 text-xs text-muted">Please check your connection and try again.</p>
            <button
              type="button"
              onClick={load}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90"
            >
              <LuRefreshCw size={15} />
              Try again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && visibleJobs.length === 0 && (
          <div className="mt-5 rounded-2xl border border-line bg-surface p-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-elevated text-muted">
              <LuClipboardList size={22} />
            </div>
            <p className="mt-4 text-sm font-semibold text-ink">
              {jobs.length === 0 ? "No assignments yet" : "Nothing in this list"}
            </p>
            <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-muted">
              {jobs.length === 0
                ? "When the admin assigns you a job, it will appear here."
                : "Try another tab to see your other jobs."}
            </p>
          </div>
        )}

        {/* Job cards */}
        {!loading && !error && visibleJobs.length > 0 && (
          <ul className="mt-5 grid gap-4 lg:grid-cols-2">
            {visibleJobs.map((job) => {
              const style = getStyle(job);
              const fresh = isNew(job);

              return (
                <li key={job.id}>
                  <Link
                    to={`/assignments/${job.id}`}
                    className={`group relative block overflow-hidden rounded-2xl border bg-surface p-4 pl-5 transition hover:bg-elevated ${
                      fresh ? "border-primary/50" : "border-line"
                    }`}
                  >
                    <span
                      className={`absolute inset-y-0 left-0 w-1 ${style.accent}`}
                      aria-hidden="true"
                    />

                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h2 className="truncate font-heading text-base font-bold">
                          {job.serviceName}
                        </h2>
                        <p className="mt-0.5 truncate text-sm text-muted">{job.customerName}</p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${style.badge}`}
                      >
                        {style.text}
                      </span>
                    </div>

                    <div className="mt-4 space-y-1.5 text-sm text-muted">
                      <p className="flex items-center gap-2">
                        <LuCalendarClock className="shrink-0" size={16} />
                        <span className="min-w-0 truncate">{formatWhen(job.scheduledAt)}</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <LuMapPin className="mt-0.5 shrink-0" size={16} />
                        <span className="min-w-0 break-words">{job.address || "Address not provided"}</span>
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
                      <span className="font-mono text-xs text-muted">{job.bookingId}</span>

                      {fresh ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                          New · Tap to accept or decline
                          <LuChevronRight size={15} />
                        </span>
                      ) : (
                        <LuChevronRight
                          size={17}
                          className="text-muted transition group-hover:text-ink"
                        />
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}

export default Assignments;