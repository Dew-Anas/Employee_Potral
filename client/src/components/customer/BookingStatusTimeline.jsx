import { Check, Circle } from "lucide-react";
import {
  bookingStatuses,
} from "../../utils/bookingStatus";

const BookingStatusTimeline = ({ currentStatus }) => {
  const steps = [
    {
      status: bookingStatuses.PENDING,
      label: "Pending",
      description: "Your booking request is waiting for confirmation.",
    },
    {
      status: bookingStatuses.CONFIRMED,
      label: "Confirmed",
      description: "Your booking has been confirmed.",
    },
    {
      status: bookingStatuses.ASSIGNED,
      label: "Employee Assigned",
      description: "A field employee has been assigned.",
    },
    {
      status: bookingStatuses.IN_PROGRESS,
      label: "In Progress",
      description: "The service is currently being carried out.",
    },
    {
      status: bookingStatuses.COMPLETED,
      label: "Completed",
      description: "The service has been completed.",
    },
  ];

  const currentIndex = steps.findIndex(
    (step) => step.status === currentStatus
  );

  const isCancelled = currentStatus === bookingStatuses.CANCELLED;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">
        Booking Progress
      </h2>

      {isCancelled ? (
        <div className="mt-5 rounded-lg bg-red-50 p-4">
          <p className="font-medium text-red-700">
            Booking Cancelled
          </p>

          <p className="mt-1 text-sm text-red-600">
            This booking has been cancelled.
          </p>
        </div>
      ) : (
        <div className="mt-6">
          {steps.map((step, index) => {
            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;
            const isFuture = index > currentIndex;

            return (
              <div
                key={step.status}
                className="relative flex gap-4"
              >
                {/* Vertical Line */}
                {index !== steps.length - 1 && (
                  <div
                    className={`absolute left-3 top-7 h-full w-0.5 ${
                      index < currentIndex
                        ? "bg-blue-600"
                        : "bg-slate-200"
                    }`}
                  />
                )}

                {/* Icon */}
                <div className="relative z-10">
                  {isCompleted ? (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white">
                      <Check size={16} />
                    </div>
                  ) : isCurrent ? (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-blue-600 bg-white">
                      <Circle
                        size={10}
                        className="fill-blue-600 text-blue-600"
                      />
                    </div>
                  ) : (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-slate-300 bg-white">
                      <Circle
                        size={10}
                        className="text-slate-300"
                      />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="pb-8">
                  <p
                    className={`font-medium ${
                      isCurrent
                        ? "text-blue-600"
                        : isFuture
                        ? "text-slate-400"
                        : "text-slate-800"
                    }`}
                  >
                    {step.label}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BookingStatusTimeline;