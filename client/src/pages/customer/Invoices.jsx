import {
  CheckCircle2,
  Clock3,
  FileText,
} from "lucide-react";
import { Link } from "react-router-dom";

const Invoices = () => {
  const invoices = [
    {
      id: "INV-2026-001",
      bookingId: "BK-001",
      service: "Home Maintenance",
      date: "2026-09-29",
      total: 15000,
      paid: 15000,
      status: "paid",
    },
    {
      id: "INV-2026-002",
      bookingId: "BK-002",
      service: "Electrical Repair",
      date: "2026-09-30",
      total: 8500,
      paid: 4000,
      status: "partially_paid",
    },
    {
      id: "INV-2026-003",
      bookingId: "BK-003",
      service: "Plumbing Service",
      date: "2026-09-30",
      total: 12000,
      paid: 0,
      status: "unpaid",
    },
  ];

  const getStatus = (status) => {
    switch (status) {
      case "paid":
        return {
          label: "Paid",
          className:
            "bg-green-100 text-green-700",
          icon: CheckCircle2,
        };

      case "partially_paid":
        return {
          label: "Partially Paid",
          className:
            "bg-yellow-100 text-yellow-700",
          icon: Clock3,
        };

      default:
        return {
          label: "Unpaid",
          className:
            "bg-red-100 text-red-700",
          icon: Clock3,
        };
    }
  };

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          My Invoices
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          View your service invoices and payment history.
        </p>
      </div>

      <div className="mt-6 space-y-4">
        {invoices.map((invoice) => {
          const status = getStatus(invoice.status);
          const StatusIcon = status.icon;

          const balance =
            invoice.total - invoice.paid;

          return (
            <div
              key={invoice.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-blue-50 p-3">
                    <FileText
                      size={22}
                      className="text-blue-600"
                    />
                  </div>

                  <div>
                    <h2 className="font-semibold text-slate-900">
                      {invoice.id}
                    </h2>

                    <p className="mt-1 text-sm text-slate-600">
                      {invoice.service}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Booking: {invoice.bookingId}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Date: {invoice.date}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-xs text-slate-500">
                      Total
                    </p>

                    <p className="font-semibold text-slate-900">
                      LKR{" "}
                      {invoice.total.toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Balance
                    </p>

                    <p className="font-semibold text-slate-900">
                      LKR{" "}
                      {balance.toLocaleString()}
                    </p>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${status.className}`}
                  >
                    <StatusIcon size={14} />
                    {status.label}
                  </span>

                  <Link
                    to={`/customer/invoices/${invoice.id}`}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    View Invoice
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Invoices;