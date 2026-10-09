import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const StartService = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [starting, setStarting] = useState(false);

  const job = {
    id: jobId,
    service: "Home Maintenance",
    customer: "Customer One",
    date: "2026-10-02",
    time: "10:00",
    address: "Jaffna",
    status: "confirmed",
  };

  const handleStartService = async () => {
    setStarting(true);

    // Temporary mock delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    alert("Service started successfully.");

    navigate(`/employee/jobs/${job.id}`);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <Link
          to={`/employee/jobs/${job.id}`}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          ← Back to Job Details
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">
          Start Service
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Confirm that you are ready to start this service.
        </p>

        <div className="mt-6 space-y-4 rounded-xl bg-slate-50 p-5">
          <div>
            <p className="text-xs font-medium uppercase text-slate-500">
              Service
            </p>
            <p className="mt-1 font-semibold text-slate-900">
              {job.service}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase text-slate-500">
              Customer
            </p>
            <p className="mt-1 font-semibold text-slate-900">
              {job.customer}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase text-slate-500">
              Schedule
            </p>
            <p className="mt-1 font-semibold text-slate-900">
              {job.date} at {job.time}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase text-slate-500">
              Location
            </p>
            <p className="mt-1 font-semibold text-slate-900">
              {job.address}
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-4">
          <p className="text-sm text-blue-800">
            Once you start the service, the job status will change to{" "}
            <strong>In Progress</strong>.
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            to={`/employee/jobs/${job.id}`}
            className="flex-1 rounded-lg border border-slate-300 bg-white px-5 py-3 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Link>

          <button
            type="button"
            onClick={handleStartService}
            disabled={starting}
            className="flex-1 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {starting ? "Starting Service..." : "Confirm & Start Service"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartService;