import { Link, useParams } from "react-router-dom";
import BookingStatusBadge from "../../components/customer/BookingStatusBadge";
import BookingStatusTimeline from "../../components/customer/BookingStatusTimeline";

const BookingDetails = () => {
  const { bookingId } = useParams();

  // Temporary booking data
  const booking = {
    id: bookingId,
    quotationId: "QUO-001",
    service: "Home Maintenance",
    date: "2026-10-02",
    time: "10:00",
    address: "Jaffna",
    status: "confirmed",
    employee: null,
    notes: "Please contact the customer before arriving.",
  };

  return (
    <div className="p-6">
      <div className="mx-auto max-w-4xl">

        {/* Back */}
        <Link
          to="/customer/bookings"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          ← Back to Bookings
        </Link>

        {/* Header */}
        <div className="mt-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Booking Details
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              {booking.id}
            </p>
          </div>

          <BookingStatusBadge
            status={booking.status}
          />
        </div>

        {/* Booking Progress */}
        <div className="mt-6">
        <BookingStatusTimeline
            currentStatus={booking.status}
        />
        </div>

        {/* Service Information */}
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Service Information
          </h2>

          <div className="mt-4 grid gap-5 md:grid-cols-2">

            <div>
              <p className="text-sm text-slate-500">
                Service
              </p>

              <p className="mt-1 font-medium text-slate-800">
                {booking.service}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Quotation
              </p>

              <p className="mt-1 font-medium text-slate-800">
                {booking.quotationId}
              </p>
            </div>

          </div>
        </div>

        {/* Schedule */}
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Schedule
          </h2>

          <div className="mt-4 grid gap-5 md:grid-cols-2">

            <div>
              <p className="text-sm text-slate-500">
                Date
              </p>

              <p className="mt-1 font-medium text-slate-800">
                {booking.date}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Time
              </p>

              <p className="mt-1 font-medium text-slate-800">
                {booking.time}
              </p>
            </div>

          </div>
        </div>

        {/* Address */}
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Service Location
          </h2>

          <p className="mt-3 text-slate-700">
            {booking.address}
          </p>
        </div>

        {/* Employee */}
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Assigned Employee
          </h2>

          {booking.employee ? (
            <p className="mt-3 text-slate-700">
              {booking.employee}
            </p>
          ) : (
            <p className="mt-3 text-sm text-slate-500">
              An employee has not been assigned yet.
            </p>
          )}
        </div>

        {/* Notes */}
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Notes
          </h2>

          <p className="mt-3 text-slate-700">
            {booking.notes}
          </p>
        </div>

      </div>
    </div>
  );
};

export default BookingDetails;