import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  CheckCircle,
  ClipboardList,
  Clock,
} from "lucide-react";
import { getMyBookings } from "../../services/employeeService";
import { useAuth } from "../../context/AuthContext";
import { formatDate, fullName } from "../../utils/format";

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const data = await getMyBookings();
        setBookings(data.bookings || []);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load assigned jobs."
        );
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  const today = new Date().toDateString();
  const stats = [
    {
      label: "Assigned Jobs",
      value: bookings.length,
      icon: ClipboardList,
    },
    {
      label: "Today's Jobs",
      value: bookings.filter(
        (booking) =>
          booking.preferredDate &&
          new Date(booking.preferredDate).toDateString() === today
      ).length,
      icon: CalendarDays,
    },
    {
      label: "In Progress",
      value: bookings.filter((booking) => booking.status === "in_progress")
        .length,
      icon: Clock,
    },
    {
      label: "Completed",
      value: bookings.filter((booking) => booking.status === "completed")
        .length,
      icon: CheckCircle,
    },
  ];

  const upcomingJobs = bookings
    .filter((booking) => booking.status !== "completed" && booking.status !== "cancelled")
    .slice(0, 5);

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Employee Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Welcome back{user?.firstName ? `, ${user.firstName}` : ""}. Manage
          your assigned field jobs.
        </p>
      </div>

      {error && (
        <div className="mt-4 rounded-lg bg-red-100 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <p className="mt-6 text-sm text-slate-500">Loading assigned jobs...</p>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">{stat.label}</p>
                      <p className="mt-2 text-2xl font-bold text-slate-900">
                        {stat.value}
                      </p>
                    </div>
                    <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
                      <Icon size={20} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Upcoming Jobs
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Your next assigned service jobs.
                </p>
              </div>
              <Link
                to="/employee/jobs"
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                View All
              </Link>
            </div>

            {upcomingJobs.length === 0 ? (
              <div className="mt-4 rounded-xl border border-slate-200 bg-white p-10 text-center">
                <h2 className="font-semibold text-slate-900">No assigned jobs</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Jobs will appear here after an admin assigns a booking to you.
                </p>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                {upcomingJobs.map((job) => (
                  <div
                    key={job._id}
                    className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {job.service?.name || "Service"}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          {fullName(job.customer)}
                        </p>
                        <div className="mt-3 space-y-1 text-sm text-slate-600">
                          <p>Date: {formatDate(job.preferredDate)}</p>
                          <p>Time: {job.preferredTime || "N/A"}</p>
                          <p>Location: {job.address || "N/A"}</p>
                          <p className="capitalize">
                            Status: {String(job.status || "").replace("_", " ")}
                          </p>
                        </div>
                      </div>
                      <Link
                        to={`/employee/jobs/${job._id}`}
                        className="rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700"
                      >
                        View Job
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default EmployeeDashboard;
