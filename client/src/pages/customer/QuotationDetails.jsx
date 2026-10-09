import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import QuotationStatusBadge from "../../components/customer/QuotationStatusBadge";
import { isQuotationExpired } from "../../utils/quotationStatus";
import { getQuotationById } from "../../services/quotationService";
import { formatDate, formatMoney } from "../../utils/format";

const QuotationDetails = () => {
  const { quotationId } = useParams();
  const [quotation, setQuotation] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getQuotationById(quotationId);
        setQuotation(data.quotation);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load quotation.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [quotationId]);

  if (loading) return <p>Loading quotation...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!quotation) return <p>Quotation not found.</p>;

  const expired = isQuotationExpired(quotation.validUntil);
  const canRespond = quotation.status === "pending" && !expired;

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        to="/customer/quotations"
        className="mb-6 inline-block text-sm font-medium text-blue-600"
      >
        ← Back to Quotations
      </Link>

      <h1 className="text-2xl font-bold text-slate-900">Quotation Details</h1>
      <p className="mt-1 text-sm text-slate-500">{quotation._id}</p>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">{quotation.service?.name}</h2>
        <p className="mt-4 text-slate-700">{quotation.description}</p>
        <p className="mt-6 text-2xl font-bold">{formatMoney(quotation.amount)}</p>
        <p className="mt-2 text-sm text-slate-500">
          Valid until {formatDate(quotation.validUntil)}
        </p>
        <div className="mt-4">
          <QuotationStatusBadge
            status={quotation.status}
            validUntil={quotation.validUntil}
          />
        </div>

        {canRespond && (
          <Link
            to={`/customer/quotations/${quotation._id}/respond`}
            className="mt-6 inline-flex rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white"
          >
            Respond to Quotation
          </Link>
        )}

        {quotation.status === "accepted" && (
          <Link
            to="/customer/bookings/new"
            state={{ quotation }}
            className="mt-6 inline-flex rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white"
          >
            Create Booking
          </Link>
        )}
      </div>
    </div>
  );
};

export default QuotationDetails;
