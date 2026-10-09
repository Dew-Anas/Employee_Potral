import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyBookings } from "../../services/employeeService";
import { formatDate, fullName } from "../../utils/format";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMyBookings();
        setJobs(data.bookings || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load jobs.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const statusStyles = {
    confirmed: "bg-blue-100 text-blue-700",
    assigned: "bg-purple-100 text-purple-700",
    in_progress: "bg-orange-100 text-orange-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-slate-100 text-slate-600",
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">My Jobs</h1>
      <p className="mt-1 text-sm text-slate-500">
        View all service jobs assigned to you.
      </p>

      {loading && <p className="mt-6 text-sm text-slate-500">Loading jobs...</p>}
      {error && (
        <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && jobs.length === 0 && (
        <div className="mt-6 rounded-xl border bg-white p-10 text-center text-slate-500">
          No jobs assigned yet.
        </div>
      )}

      <div className="mt-6 space-y-4">
        {jobs.map((job) => (
          <div
            key={job._id}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-lg font-semibold text-slate-900">
                    {job.service?.name || "Service"}
                  </h2>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                      statusStyles[job.status] || "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {String(job.status || "").replace("_", " ")}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-500">
                  Customer: {fullName(job.customer)}
                </p>
                <div className="mt-3 space-y-1 text-sm text-slate-600">
                  <p>Date: {formatDate(job.preferredDate)}</p>
                  <p>Time: {job.preferredTime || "N/A"}</p>
                  <p>Location: {job.address || "N/A"}</p>
                </div>
              </div>
              <Link
                to={`/employee/jobs/${job._id}`}
                className="rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700"
              >
                View Job
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Jobs;
