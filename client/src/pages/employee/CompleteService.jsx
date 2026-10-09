import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import CustomerSignoff from "../../components/employee/CustomerSignoff";

const CompleteService = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [signed, setSigned] = useState(false);
  const [completing, setCompleting] = useState(false);

  const job = {
    id: jobId,
    service: "Home Maintenance",
    customer: "Customer One",
    status: "in_progress",
  };

  const handleSignoff = () => {
    setSigned(true);
  };

  const handleComplete = async () => {
    if (!signed) {
      alert("Customer sign-off is required.");
      return;
    }

    setCompleting(true);

    await new Promise((resolve) =>
      setTimeout(resolve, 1000)
    );

    alert("Service completed successfully.");

    navigate(`/employee/jobs/${job.id}`);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <Link
          to={`/employee/jobs/${job.id}`}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          ← Back to Job Details
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Complete Service
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Review the service and obtain customer confirmation
          before completing the job.
        </p>
      </div>

      {/* Job Summary */}
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Service Summary
        </h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
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
              Status
            </p>

            <span className="mt-1 inline-block rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
              In Progress
            </span>
          </div>
        </div>
      </div>

      {/* Completion Checklist */}
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Completion Requirements
        </h2>

        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-700">
              Required checklist completed
            </span>

            <span className="text-sm font-semibold text-green-600">
              ✓ Complete
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-700">
              Service attendance recorded
            </span>

            <span className="text-sm font-semibold text-green-600">
              ✓ Complete
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-700">
              Service evidence uploaded
            </span>

            <span className="text-sm font-semibold text-green-600">
              ✓ Complete
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-700">
              Customer sign-off
            </span>

            <span
              className={`text-sm font-semibold ${
                signed
                  ? "text-green-600"
                  : "text-yellow-600"
              }`}
            >
              {signed ? "✓ Complete" : "Pending"}
            </span>
          </div>
        </div>
      </div>

      {/* Customer Signature */}
      {!signed ? (
        <div className="mt-6">
          <CustomerSignoff onSign={handleSignoff} />
        </div>
      ) : (
        <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-6">
          <p className="font-semibold text-green-800">
            Customer sign-off completed
          </p>

          <p className="mt-1 text-sm text-green-700">
            The customer has confirmed the service completion.
          </p>
        </div>
      )}

      {/* Complete Button */}
      <div className="mt-6">
        <button
          type="button"
          onClick={handleComplete}
          disabled={!signed || completing}
          className="w-full rounded-lg bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {completing
            ? "Completing Service..."
            : "Complete Service"}
        </button>
      </div>
    </div>
  );
};

export default CompleteService;