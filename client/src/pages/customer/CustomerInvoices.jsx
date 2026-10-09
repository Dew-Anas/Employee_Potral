import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getMyInvoices,
} from "../../services/invoiceService";

const CustomerInvoices = () => {
  const navigate = useNavigate();

  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadInvoices = async () => {
      try {
        const data = await getMyInvoices();

        setInvoices(data.invoices || []);
      } catch (err) {
        console.error(err);

        setError(
          err.response?.data?.message ||
            "Failed to load invoices."
        );
      } finally {
        setLoading(false);
      }
    };

    loadInvoices();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        Loading invoices...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">

        <h1 className="text-2xl font-bold">
          My Invoices
        </h1>

        <p className="mt-1 text-gray-500">
          View your service invoices and payment status.
        </p>

        {error && (
          <div className="mt-5 rounded-lg bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

        {invoices.length === 0 ? (
          <div className="mt-6 rounded-xl bg-white p-10 text-center shadow-sm">
            <h2 className="font-semibold">
              No invoices available
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Your invoices will appear here after
              completed services.
            </p>
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm">

            <div className="divide-y">
              {invoices.map((invoice) => (
                <div
                  key={invoice._id}
                  className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold">
                      {invoice.invoiceNumber}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      {invoice.issueDate
                        ? new Date(
                            invoice.issueDate
                          ).toLocaleDateString()
                        : "Date unavailable"}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold">
                        {invoice.totalAmount}
                      </p>

                      <p className="text-sm text-gray-500">
                        {invoice.paymentStatus}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        navigate(
                          `/customer/invoices/${invoice._id}`
                        )
                      }
                      className="rounded-lg bg-black px-4 py-2 text-sm text-white"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerInvoices;