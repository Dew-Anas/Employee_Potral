import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BookingStatusBadge from "../../components/customer/BookingStatusBadge";
import { getMyBookings } from "../../services/bookingService";
import { formatDate } from "../../utils/format";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMyBookings();
        setBookings(data.bookings || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load bookings.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">My Bookings</h1>
      <p className="mt-1 text-sm text-slate-500">
        View and track your service bookings.
      </p>

      {loading && <p className="mt-6 text-sm text-slate-500">Loading...</p>}
      {error && <p className="mt-6 text-sm text-red-600">{error}</p>}

      {!loading && bookings.length === 0 && (
        <div className="mt-6 rounded-xl border bg-white p-10 text-center">
          No bookings yet.
        </div>
      )}

      <div className="mt-6 space-y-4">
        {bookings.map((booking) => (
          <div
            key={booking._id}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex flex-col justify-between gap-4 md:flex-row">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-lg font-semibold">
                    {booking.service?.name}
                  </h2>
                  <BookingStatusBadge status={booking.status} />
                </div>
                <p className="mt-2 text-sm text-slate-500">
                  Date: {formatDate(booking.preferredDate)} at {booking.preferredTime}
                </p>
                <p className="mt-1 text-sm text-slate-500">{booking.address}</p>
              </div>
              <Link
                to={`/customer/bookings/${booking._id}`}
                className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bookings;
