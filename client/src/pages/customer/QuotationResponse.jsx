import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import QuoteActionModal from "../../components/customer/QuoteActionModal";
import { isQuotationExpired } from "../../utils/quotationStatus";
import {
  acceptQuotation,
  getQuotationById,
  rejectQuotation,
} from "../../services/quotationService";
import { formatDate, formatMoney } from "../../utils/format";

const QuotationResponse = () => {
  const { quotationId } = useParams();
  const navigate = useNavigate();
  const [quotation, setQuotation] = useState(null);
  const [action, setAction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getQuotationById(quotationId);
        setQuotation(data.quotation);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load quotation.");
      }
    };

    load();
  }, [quotationId]);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!quotation) return <p>Loading quotation...</p>;

  const expired = isQuotationExpired(quotation.validUntil);

  const handleConfirm = async () => {
    setLoading(true);

    try {
      if (action === "accept") {
        await acceptQuotation(quotation._id);
        toast.success("Quotation accepted.");
        navigate("/customer/bookings/new", { state: { quotation } });
      } else {
        await rejectQuotation(quotation._id);
        toast.success("Quotation rejected.");
        navigate("/customer/quotations");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed.");
    } finally {
      setLoading(false);
      setAction(null);
    }
  };

  return (
    <div className="mx-auto max-w-xl">
      <Link
        to={`/customer/quotations/${quotationId}`}
        className="mb-6 inline-block text-sm font-medium text-blue-600"
      >
        ← Back to Quotation
      </Link>

      <h1 className="text-2xl font-bold text-slate-900">Respond to Quotation</h1>
      <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">{quotation.service?.name}</h2>
        <p className="mt-2 text-2xl font-bold">{formatMoney(quotation.amount)}</p>
        <p className="mt-2 text-sm text-slate-500">
          Valid until {formatDate(quotation.validUntil)}
        </p>

        {!expired && quotation.status === "pending" && (
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => setAction("accept")}
              className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white"
            >
              Accept Quotation
            </button>
            <button
              type="button"
              onClick={() => setAction("reject")}
              className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white"
            >
              Reject Quotation
            </button>
          </div>
        )}
      </div>

      {action && (
        <QuoteActionModal
          action={action}
          onConfirm={handleConfirm}
          onCancel={() => setAction(null)}
          loading={loading}
        />
      )}
    </div>
  );
};

export default QuotationResponse;
