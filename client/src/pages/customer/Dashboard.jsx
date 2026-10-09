import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyRequests } from "../../services/requestService";
import { getMyQuotations } from "../../services/quotationService";
import { getMyBookings } from "../../services/bookingService";
import { getMyInvoices } from "../../services/invoiceService";
import { useAuth } from "../../context/AuthContext";
import { formatMoney } from "../../utils/format";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    requests: 0,
    quotations: 0,
    bookings: 0,
    unpaid: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [requests, quotations, bookings, invoices] = await Promise.all([
          getMyRequests(),
          getMyQuotations(),
          getMyBookings(),
          getMyInvoices(),
        ]);

        const unpaid = (invoices.invoices || []).filter(
          (invoice) => invoice.paymentStatus !== "paid"
        ).length;

        setStats({
          requests: requests.count || requests.requests?.length || 0,
          quotations: quotations.count || quotations.quotations?.length || 0,
          bookings: bookings.count || bookings.bookings?.length || 0,
          unpaid,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const cards = [
    { label: "Requests", value: stats.requests, to: "/customer/requests" },
    { label: "Quotations", value: stats.quotations, to: "/customer/quotations" },
    { label: "Bookings", value: stats.bookings, to: "/customer/bookings" },
    { label: "Unpaid invoices", value: stats.unpaid, to: "/customer/invoices" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">
        Welcome{user?.firstName ? `, ${user.firstName}` : ""}
      </h1>
      <p className="mt-2 text-slate-600">
        Track requests, quotations, bookings, invoices and reviews in one place.
      </p>

      {loading ? (
        <p className="mt-6 text-sm text-slate-500">Loading dashboard...</p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <Link
              key={card.label}
              to={card.to}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-blue-200"
            >
              <p className="text-sm text-slate-500">{card.label}</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {card.value}
              </p>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50 p-5">
        <p className="font-medium text-blue-900">Need a new service?</p>
        <p className="mt-1 text-sm text-blue-800">
          Browse the catalog and submit a request to receive a quotation.
        </p>
        <Link
          to="/services"
          className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
        >
          Browse Services
        </Link>
        <p className="mt-3 text-xs text-blue-700">
          Typical service prices start around {formatMoney(8000)}.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
