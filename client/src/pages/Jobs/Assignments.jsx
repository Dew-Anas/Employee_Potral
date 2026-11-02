import { useEffect, useState } from "react";
import { LuMapPin, LuCalendarClock } from "react-icons/lu";
import { getMyJobs, USING_DEMO_DATA } from "../../services/jobService";
import { Link } from "react-router-dom";

function Assignments() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyJobs()
      .then(setJobs)
      .catch(() => setError("Unable to load your assignments."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-page px-4 pb-24 pt-6 text-ink">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-2xl font-semibold">My Assignments</h1>
          {USING_DEMO_DATA && (
            <span className="rounded-full border border-line px-3 py-1 text-xs text-muted">
              Demo data
            </span>
          )}
        </div>

        {loading && <p className="mt-6 text-muted">Loading assignments...</p>}
        {error && <p className="mt-6 text-red-400">{error}</p>}

        {!loading && !error && jobs.length === 0 && (
          <div className="mt-6 rounded-2xl border border-line bg-surface p-6 text-center text-muted">
            No assignments yet.
          </div>
        )}

        <div className="mt-6 space-y-4">
          {jobs.map((job) => (
            <Link
              key={job.id}
              to={`/assignments/${job.id}`}
              className=" block rounded-2xl border border-line bg-surface p-4 transition hover:bg-elevated"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-heading text-lg font-semibold">{job.serviceName}</h2>
                <span className="rounded-full bg-teal/15 px-3 py-1 text-xs font-medium text-teal">
                  {job.status}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted">{job.customerName}</p>
              <p className="mt-3 flex items-center gap-2 text-sm text-muted">
                <LuCalendarClock />
                {new Date(job.scheduledAt).toLocaleString("en-LK", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
              <p className="mt-1 flex items-center gap-2 text-sm text-muted">
                <LuMapPin />
                {job.address}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

export default Assignments;