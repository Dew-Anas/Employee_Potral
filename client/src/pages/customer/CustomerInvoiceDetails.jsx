import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  getInvoiceDetails,
} from "../../services/invoiceService";

const CustomerInvoiceDetails = () => {
  const { id } = useParams();

  const [invoice, setInvoice] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadInvoice = async () => {
      try {
        const data =
          await getInvoiceDetails(id);

        setInvoice(data.invoice);
      } catch (err) {
        console.error(err);

        setError(
          err.response?.data?.message ||
            "Failed to load invoice."
        );
      } finally {
        setLoading(false);
      }
    };

    loadInvoice();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6">
        Loading invoice...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-600">
        {error}
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="p-6">
        Invoice not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl">

        <div className="rounded-xl bg-white p-6 shadow-sm">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

            <div>
              <h1 className="text-2xl font-bold">
                Invoice
              </h1>

              <p className="mt-1 text-gray-500">
                {invoice.invoiceNumber}
              </p>
            </div>

            <span className="rounded-full bg-gray-100 px-4 py-2 text-sm">
              {invoice.paymentStatus}
            </span>

          </div>

          {/* Customer */}

          <div className="mt-8 grid gap-6 sm:grid-cols-2">

            <div>
              <h3 className="font-semibold">
                Customer
              </h3>

              <p className="mt-1 text-gray-600">
                {invoice.customer?.firstName}{" "}
                {invoice.customer?.lastName}
              </p>

              <p className="text-sm text-gray-500">
                {invoice.customer?.email}
              </p>
            </div>

            <div>
              <h3 className="font-semibold">
                Invoice Date
              </h3>

              <p className="mt-1 text-gray-600">
                {invoice.issueDate
                  ? new Date(
                      invoice.issueDate
                    ).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>

          </div>

          {/* Items */}

          <div className="mt-8">
            <h3 className="font-semibold">
              Invoice Items
            </h3>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">

                <thead className="border-b">
                  <tr>
                    <th className="py-3">
                      Description
                    </th>

                    <th className="py-3 text-right">
                      Amount
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {(invoice.items || []).map(
                    (item, index) => (
                      <tr
                        key={
                          item._id || index
                        }
                        className="border-b"
                      >
                        <td className="py-3">
                          {item.description}
                        </td>

                        <td className="py-3 text-right">
                          {item.amount}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>

              </table>
            </div>
          </div>

          {/* Totals */}

          <div className="mt-8 ml-auto max-w-sm space-y-3">

            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>
                {invoice.subtotal}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Tax</span>
              <span>
                {invoice.taxAmount}
              </span>
            </div>

            <div className="flex justify-between border-t pt-3 text-lg font-bold">
              <span>Total</span>

              <span>
                {invoice.totalAmount}
              </span>
            </div>

            <div className="flex justify-between text-sm text-gray-500">
              <span>Balance Due</span>

              <span>
                {invoice.balanceDue}
              </span>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default CustomerInvoiceDetails;