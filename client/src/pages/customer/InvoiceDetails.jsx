import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

const InvoiceDetails = () => {
  const { invoiceId } = useParams();

  const invoice = {
    id: invoiceId,
    bookingId: "BK-001",
    service: "Home Maintenance",
    date: "2026-09-29",
    customer: "Customer One",
    items: [
      {
        name: "Home Maintenance Service",
        quantity: 1,
        price: 12000,
      },
      {
        name: "Additional Materials",
        quantity: 1,
        price: 2000,
      },
    ],
    subtotal: 14000,
    tax: 1000,
    total: 15000,
    paid: 15000,
    status: "paid",
  };

  const balance =
    invoice.total - invoice.paid;

  const isPaid = invoice.status === "paid";

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        to="/customer/invoices"
        className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
      >
        <ArrowLeft size={16} />
        Back to Invoices
      </Link>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Header */}
        <div className="border-b border-slate-200 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Invoice
              </p>

              <h1 className="mt-1 text-2xl font-bold text-slate-900">
                {invoice.id}
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Booking: {invoice.bookingId}
              </p>
            </div>

            <div>
              {isPaid ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                  <CheckCircle2 size={16} />
                  Paid
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-700">
                  <Clock3 size={16} />
                  Payment Pending
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Customer / Service */}
        <div className="grid gap-6 border-b border-slate-200 p-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase text-slate-500">
              Customer
            </p>

            <p className="mt-2 font-semibold text-slate-900">
              {invoice.customer}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase text-slate-500">
              Service
            </p>

            <p className="mt-2 font-semibold text-slate-900">
              {invoice.service}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              {invoice.date}
            </p>
          </div>
        </div>

        {/* Items */}
        <div className="p-6">
          <h2 className="font-semibold text-slate-900">
            Invoice Items
          </h2>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs uppercase text-slate-500">
                  <th className="pb-3">
                    Description
                  </th>

                  <th className="pb-3 text-center">
                    Qty
                  </th>

                  <th className="pb-3 text-right">
                    Price
                  </th>

                  <th className="pb-3 text-right">
                    Total
                  </th>
                </tr>
              </thead>

              <tbody>
                {invoice.items.map((item) => (
                  <tr
                    key={item.name}
                    className="border-b border-slate-100"
                  >
                    <td className="py-4 text-sm text-slate-700">
                      {item.name}
                    </td>

                    <td className="py-4 text-center text-sm text-slate-700">
                      {item.quantity}
                    </td>

                    <td className="py-4 text-right text-sm text-slate-700">
                      LKR{" "}
                      {item.price.toLocaleString()}
                    </td>

                    <td className="py-4 text-right text-sm font-medium text-slate-900">
                      LKR{" "}
                      {(
                        item.quantity * item.price
                      ).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="mt-6 ml-auto max-w-sm space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">
                Subtotal
              </span>

              <span className="font-medium text-slate-900">
                LKR{" "}
                {invoice.subtotal.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-slate-500">
                Tax
              </span>

              <span className="font-medium text-slate-900">
                LKR{" "}
                {invoice.tax.toLocaleString()}
              </span>
            </div>

            <div className="border-t border-slate-200 pt-3">
              <div className="flex justify-between">
                <span className="font-semibold text-slate-900">
                  Total
                </span>

                <span className="text-lg font-bold text-slate-900">
                  LKR{" "}
                  {invoice.total.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-slate-500">
                Paid
              </span>

              <span className="font-medium text-green-600">
                LKR{" "}
                {invoice.paid.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="font-semibold text-slate-700">
                Balance
              </span>

              <span className="font-bold text-slate-900">
                LKR{" "}
                {balance.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetails;