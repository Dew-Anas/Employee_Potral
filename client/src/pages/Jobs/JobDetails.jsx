import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  LuArrowLeft,
  LuCalendarClock,
  LuMapPin,
  LuPhone,
  LuUserRound,
} from "react-icons/lu";
import { getJobById } from "../../services/jobService";

function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getJobById(id)
      .then(setJob)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <main className="min-h-screen bg-page p-6 text-muted">Loading job...</main>;
  }

  if (!job) {
    return (
      <main className="min-h-screen bg-page px-4 pt-6 text-ink">
        <Link to="/assignments" className="text-teal">Back to assignments</Link>
        <p className="mt-6 text-muted">This job was not found.</p>
      </main>
    );
  }

  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(job.address)}`;

  return (
    <main className="min-h-screen bg-page px-4 pb-28 pt-6 text-ink">
      <div className="mx-auto max-w-2xl">
        <Link to="/assignments" className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink">
          <LuArrowLeft /> Assignments
        </Link>

        <div className="mt-4 flex items-start justify-between gap-3">
          <h1 className="font-heading text-2xl font-semibold">{job.serviceName}</h1>
          <span className="rounded-full bg-teal/15 px-3 py-1 text-xs font-medium text-teal">
            {job.status}
          </span>
        </div>

        <section className="mt-6 space-y-4 rounded-2xl border border-line bg-surface p-4">
          <p className="flex items-center gap-3">
            <LuUserRound className="text-muted" />
            {job.customerName}
          </p>
          <a href={`tel:${job.customerPhone}`} className="flex items-center gap-3 text-primary">
            <LuPhone className="text-muted" />
            {job.customerPhone}
          </a>
          <p className="flex items-center gap-3">
            <LuCalendarClock className="text-muted" />
            {new Date(job.scheduledAt).toLocaleString("en-LK", {
              dateStyle: "full",
              timeStyle: "short",
            })}
          </p>
          <div className="flex items-start justify-between gap-3">
            <p className="flex items-start gap-3">
              <LuMapPin className="mt-1 text-muted" />
              {job.address}
            </p>
            <a
              href={mapUrl}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 rounded-lg border border-line px-3 py-1 text-sm text-primary hover:bg-elevated"
            >
              Open map
            </a>
          </div>
        </section>

        <button
          type="button"
          className="mt-6 w-full rounded-xl bg-primary py-3 font-semibold text-white transition hover:opacity-90"
        >
          Start Service
        </button>
      </div>
    </main>
  );
}

export default JobDetails;