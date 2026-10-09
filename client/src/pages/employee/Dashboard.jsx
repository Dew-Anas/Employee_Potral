import { Link } from "react-router-dom";
import {
  CalendarDays,
  CheckCircle,
  Clock,
  ClipboardList,
} from "lucide-react";

const Dashboard = () => {
  const stats = [
    {
      label: "Assigned Jobs",
      value: 4,
      icon: ClipboardList,
    },
    {
      label: "Today's Jobs",
      value: 2,
      icon: CalendarDays,
    },
    {
      label: "In Progress",
      value: 1,
      icon: Clock,
    },
    {
      label: "Completed",
      value: 8,
      icon: CheckCircle,
    },
  ];

  const upcomingJobs = [
    {
      id: "BK-001",
      service: "Home Maintenance",
      date: "2026-10-02",
      time: "10:00",
      address: "Jaffna",
      status: "confirmed",
    },
    {
      id: "BK-002",
      service: "Electrical Services",
      date: "2026-10-03",
      time: "14:00",
      address: "Nallur, Jaffna",
      status: "assigned",
    },
  ];

  return (
    <div>
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome back!
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage your assigned service jobs.
        </p>
      </div>

      {/* Stats */}
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
                  <p className="text-sm text-slate-500">
                    {stat.label}
                  </p>

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

      {/* Upcoming Jobs */}
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

        <div className="mt-4 space-y-4">
          {upcomingJobs.map((job) => (
            <div
              key={job.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900">
                    {job.service}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {job.id}
                  </p>

                  <div className="mt-3 space-y-1 text-sm text-slate-600">
                    <p>
                      📅 {job.date}
                    </p>

                    <p>
                      🕐 {job.time}
                    </p>

                    <p>
                      📍 {job.address}
                    </p>
                  </div>
                </div>

                <Link
                  to={`/employee/jobs/${job.id}`}
                  className="rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700"
                >
                  View Job
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;