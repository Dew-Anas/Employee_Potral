import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import RequestStatusBadge from "../../components/customer/RequestStatusBadge";
import { cancelRequest, getRequestById } from "../../services/requestService";
import { formatDate } from "../../utils/format";

const RequestDetails = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getRequestById(requestId);
        setRequest(data.request);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load request.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [requestId]);

  const handleCancel = async () => {
    try {
      await cancelRequest(requestId, "Cancelled by customer");
      toast.success("Request cancelled.");
      const data = await getRequestById(requestId);
      setRequest(data.request);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel request.");
    }
  };

  if (loading) return <p>Loading request...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!request) return <p>Request not found.</p>;

  const cancellable = ![
    "in_progress",
    "completed",
    "cancelled",
  ].includes(request.status);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <button
            onClick={() => navigate("/customer/requests")}
            className="mb-3 text-sm text-blue-600 hover:underline"
          >
            ← Back to Requests
          </button>
          <h1 className="text-2xl font-bold text-slate-900">Request Details</h1>
          <p className="mt-1 text-sm text-slate-500">{request._id}</p>
        </div>
        <RequestStatusBadge status={request.status} />
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Service Information
        </h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <p className="text-sm text-slate-500">Service</p>
            <p className="mt-1 font-medium text-slate-800">
              {request.service?.name}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Preferred Date</p>
            <p className="mt-1 font-medium text-slate-800">
              {formatDate(request.preferredDate)}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Preferred Time</p>
            <p className="mt-1 font-medium text-slate-800">
              {request.preferredTime}
            </p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-sm text-slate-500">Address</p>
            <p className="mt-1 font-medium text-slate-800">{request.address}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-sm text-slate-500">Description</p>
            <p className="mt-1 text-slate-700">{request.description}</p>
          </div>
        </div>
      </section>

      {cancellable && (
        <button
          onClick={handleCancel}
          className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white"
        >
          Cancel Request
        </button>
      )}
    </div>
  );
};

export default RequestDetails;
