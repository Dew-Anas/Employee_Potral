import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getBookingDetails,
} from "../../services/employeeService";

const EmployeeBookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBooking = async () => {
      try {
        const data =
          await getBookingDetails(id);

        setBooking(data.booking);
      } catch (err) {
        console.error(err);

        setError(
          err.response?.data?.message ||
            "Failed to load booking."
        );
      } finally {
        setLoading(false);
      }
    };

    loadBooking();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6">
        Loading booking...
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

  if (!booking) {
    return (
      <div className="p-6">
        Booking not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl">

        <button
          onClick={() =>
            navigate("/employee")
          }
          className="mb-5 text-sm text-gray-600"
        >
          ← Back to Dashboard
        </button>

        <div className="rounded-xl bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                {booking.service?.name ||
                  "Service Booking"}
              </h1>

              <p className="mt-1 text-gray-500">
                Booking ID: {booking._id}
              </p>
            </div>

            <span className="rounded-full bg-gray-100 px-4 py-2 text-sm">
              {booking.status}
            </span>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">

            <div>
              <h3 className="font-semibold">
                Customer
              </h3>

              <p className="mt-1 text-gray-600">
                {booking.customer?.firstName}{" "}
                {booking.customer?.lastName}
              </p>

              <p className="text-sm text-gray-500">
                {booking.customer?.phone}
              </p>
            </div>

            <div>
              <h3 className="font-semibold">
                Location
              </h3>

              <p className="mt-1 text-gray-600">
                {booking.address ||
                  "Address not available"}
              </p>
            </div>

            <div>
              <h3 className="font-semibold">
                Scheduled Date
              </h3>

              <p className="mt-1 text-gray-600">
                {booking.scheduledDate
                  ? new Date(
                      booking.scheduledDate
                    ).toLocaleString()
                  : "Not scheduled"}
              </p>
            </div>

            <div>
              <h3 className="font-semibold">
                Customer Contact
              </h3>

              <p className="mt-1 text-gray-600">
                {booking.customer?.email}
              </p>
            </div>

          </div>

          <button
            onClick={() =>
              navigate(
                `/employee/bookings/${booking._id}/execute`
              )
            }
            className="mt-8 w-full rounded-lg bg-black px-5 py-3 font-medium text-white"
          >
            Open Job Execution
          </button>

        </div>
      </div>
    </div>
  );
};

export default EmployeeBookingDetails;