import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RequestStatusBadge from "../../components/customer/RequestStatusBadge";
import { getMyRequests } from "../../services/requestService";
import { formatDate } from "../../utils/format";

const Requests = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMyRequests();
        setRequests(data.requests || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load requests.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Requests</h1>
          <p className="mt-1 text-slate-500">
            Track and manage your service requests.
          </p>
        </div>
        <button
          onClick={() => navigate("/customer/requests/new")}
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          + New Request
        </button>
      </div>

      {loading && <p className="mt-6 text-sm text-slate-500">Loading...</p>}
      {error && (
        <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && requests.length === 0 && (
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-10 text-center">
          <p className="font-medium text-slate-800">No requests yet</p>
          <p className="mt-2 text-sm text-slate-500">
            Submit a request to get a quotation from the team.
          </p>
        </div>
      )}

      <div className="mt-6 space-y-4">
        {requests.map((request) => (
          <div
            key={request._id}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm text-slate-500">{request._id}</p>
                <h2 className="mt-1 text-lg font-semibold text-slate-900">
                  {request.service?.name || "Service"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Preferred date: {formatDate(request.preferredDate)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <RequestStatusBadge status={request.status} />
                <button
                  onClick={() => navigate(`/customer/requests/${request._id}`)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Requests;
