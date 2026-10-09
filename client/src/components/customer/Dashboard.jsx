import {
  FileText,
  FileCheck2,
  CalendarDays,
  ReceiptText,
} from "lucide-react";

import StatCard from "../../components/customer/StatCard";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Welcome */}
      <section>
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome back!
        </h1>

        <p className="mt-1 text-slate-500">
          Here is an overview of your ServicePro account.
        </p>
      </section>

      {/* Statistics */}
      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Active Requests"
          value="2"
          description="Currently active requests"
          icon={<FileText size={22} />}
        />

        <StatCard
          title="Pending Quotes"
          value="1"
          description="Quotes waiting for response"
          icon={<FileCheck2 size={22} />}
        />

        <StatCard
          title="Upcoming Bookings"
          value="1"
          description="Scheduled services"
          icon={<CalendarDays size={22} />}
        />

        <StatCard
          title="Outstanding"
          value="$0"
          description="Pending invoice balance"
          icon={<ReceiptText size={22} />}
        />
      </section>

      {/* Recent Requests */}
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Recent Requests
            </h2>

            <p className="text-sm text-slate-500">
              Your latest service requests
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
            <div>
              <p className="font-medium text-slate-800">
                Home Maintenance
              </p>

              <p className="text-sm text-slate-500">
                Request #REQ-001
              </p>
            </div>

            <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
              Under Review
            </span>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
            <div>
              <p className="font-medium text-slate-800">
                Cleaning Service
              </p>

              <p className="text-sm text-slate-500">
                Request #REQ-002
              </p>
            </div>

            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
              Confirmed
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;