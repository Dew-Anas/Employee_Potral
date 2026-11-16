
import {
  LuClock,
  LuPlay,
  LuCheck,
  LuArrowRight,
} from "react-icons/lu";

import { Link } from "react-router-dom";

const CARDS = [
  {
    key: "pending",
    label: "Pending",
    icon: LuClock,
    color: "text-muted",
  },
  {
    key: "inProgress",
    label: "In Progress",
    icon: LuPlay,
    color: "text-primary",
  },
  {
    key: "completed",
    label: "Completed",
    icon: LuCheck,
    color: "text-teal",
  },
];

function JobSummary({ jobs = [] }) {

  // Count jobs based on their current status.
  const counts = {
    pending: jobs.filter(
      (job) =>
        job.status === "Assigned" ||
        job.status === "Pending"
    ).length,

    inProgress: jobs.filter(
      (job) => job.status === "In Progress"
    ).length,

    completed: jobs.filter(
      (job) => job.status === "Completed"
    ).length,
  };

  // Calculate overall job completion percentage.
  const total = jobs.length;

  const percent =
    total === 0
      ? 0
      : Math.round((counts.completed / total) * 100);

  return (
    <section aria-labelledby="job-summary-heading">

      {/* Section heading */}
      <div className="flex items-center justify-between gap-3">

        <div>
          <h2
            id="job-summary-heading"
            className="font-heading text-lg font-bold text-ink"
          >
            Assignment overview
          </h2>

          <p className="mt-1 text-xs text-muted">
            Your current job activity
          </p>
        </div>

        <Link
          to="/assignments"
          className="flex shrink-0 items-center gap-1 text-xs font-semibold text-primary transition hover:text-primary/80"
        >
          View all
          <LuArrowRight size={15} />
        </Link>

      </div>

      {/* Job statistics */}
      <div className="mt-7 grid grid-cols-3 divide-x divide-line">

        {CARDS.map(({ key, label, icon: Icon, color }) => (

          <div
            key={key}
            className="min-w-0 px-2 first:pl-0 last:pr-0 sm:px-4"
          >

            <Icon
              size={19}
              className={color}
              strokeWidth={1.8}
            />

            <p className="mt-3 font-mono text-2xl font-semibold tabular-nums text-ink sm:text-3xl">
              {counts[key]}
            </p>

            <p className="mt-1 text-[11px] font-medium text-muted sm:text-xs">
              {label}
            </p>

          </div>

        ))}

      </div>

      {/* Completion progress */}
      <div className="mt-7 border-t border-line pt-5">

        <div className="flex items-center justify-between gap-3">

          <div>
            <p className="text-sm font-semibold text-ink">
              Overall progress
            </p>

            <p className="mt-1 text-xs text-muted">
              {counts.completed} of {total} jobs completed
            </p>
          </div>

          <p className="font-mono text-lg font-semibold tabular-nums text-teal">
            {percent}%
          </p>

        </div>

        <div
          className="mt-4 h-1.5 overflow-hidden rounded-full bg-elevated"
          role="progressbar"
          aria-label="Completed jobs"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
        >

          <div
            className="h-full rounded-full bg-teal transition-all duration-500"
            style={{ width: `${percent}%` }}
          />

        </div>

        {total === 0 && (
          <p className="mt-4 text-xs text-muted">
            No assignments available yet.
          </p>
        )}

      </div>

    </section>
  );
}

export default JobSummary;
