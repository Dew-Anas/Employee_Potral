import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import QuotationStatusBadge from "../../components/customer/QuotationStatusBadge";
import { isQuotationExpired } from "../../utils/quotationStatus";
import { getMyQuotations } from "../../services/quotationService";
import { formatDate, formatMoney } from "../../utils/format";

const Quotations = () => {
  const navigate = useNavigate();
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMyQuotations();
        setQuotations(data.quotations || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load quotations.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Quotations</h1>
      <p className="mt-1 text-slate-500">
        Review quotations received for your requests.
      </p>

      {loading && <p className="mt-6 text-sm text-slate-500">Loading...</p>}
      {error && (
        <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && quotations.length === 0 && (
        <div className="mt-6 rounded-xl border bg-white p-10 text-center text-slate-500">
          No quotations yet.
        </div>
      )}

      <div className="mt-6 space-y-4">
        {quotations.map((quote) => {
          const expired = isQuotationExpired(quote.validUntil);

          return (
            <div
              key={quote._id}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                <div>
                  <div className="flex items-center gap-3">
                    <p className="text-sm text-slate-500">{quote._id}</p>
                    <QuotationStatusBadge
                      status={quote.status}
                      validUntil={quote.validUntil}
                    />
                  </div>
                  <h2 className="mt-2 text-lg font-semibold text-slate-900">
                    {quote.service?.name}
                  </h2>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-2xl font-bold text-slate-900">
                    {formatMoney(quote.amount)}
                  </p>
                  <p className={`mt-1 text-xs ${expired ? "text-red-600" : "text-slate-500"}`}>
                    {expired
                      ? `Expired on ${formatDate(quote.validUntil)}`
                      : `Valid until ${formatDate(quote.validUntil)}`}
                  </p>
                </div>
              </div>
              <div className="mt-5 border-t border-slate-100 pt-5">
                <button
                  onClick={() =>
                    navigate(`/customer/quotations/${quote._id}`)
                  }
                  className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white"
                >
                  View Quotation
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Quotations;
