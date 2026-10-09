import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  getBookingDetails,
  startService,
  clockIn,
  clockOut,
  getChecklist,
  completeChecklistItem,
  completeService,
} from "../../services/employeeService";

import JobPhotoUpload from "../../components/employee/JobPhotoUpload";
import JobPhotoGallery from "../../components/employee/JobPhotoGallery";
import JobNotes from "../../components/employee/JobNotes";

const EmployeeJobExecution = () => {
  const { id, jobId } = useParams();
  const bookingId = id || jobId;

  const [booking, setBooking] = useState(null);
  const [checklist, setChecklist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] =
    useState(false);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      const bookingData =
        await getBookingDetails(bookingId);

      const checklistData =
        await getChecklist(bookingId);

      setBooking(bookingData.booking);
      setChecklist(
        checklistData.items || []
      );
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to load job."
      );
    } finally {
      setLoading(false);
    }
  };

  const completedChecklist =
    checklist.filter(
        (item) => item.completed
    ).length;

    const requiredChecklist =
    checklist.filter(
        (item) => item.isRequired
    ).length;

    useEffect(() => {
        loadData();
    }, [bookingId]);

  const handleStart = async () => {
    try {
      setActionLoading(true);

      await startService(bookingId);

      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to start service."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleClockIn = async () => {
    try {
      setActionLoading(true);

      await clockIn(bookingId);

      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to clock in."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleClockOut = async () => {
    try {
      setActionLoading(true);

      await clockOut(bookingId);

      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to clock out."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleChecklist = async (itemId) => {
    try {
      await completeChecklistItem(itemId);

      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update checklist."
      );
    }
  };

  const handleComplete = async () => {
    try {
      setActionLoading(true);

      await completeService(bookingId);

      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to complete service."
      );
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        Loading job...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl">

        <h1 className="text-2xl font-bold">
          Job Execution
        </h1>

        {error && (
          <div className="mt-4 rounded-lg bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

        <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {booking?.service?.name ||
                "Service"}
            </h2>

            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
              {booking?.status}
            </span>
          </div>

          {/* SERVICE CONTROLS */}

          <div className="mt-6 flex flex-wrap gap-3">

            {booking?.status === "assigned" && (
              <button
                disabled={actionLoading}
                onClick={handleStart}
                className="rounded-lg bg-black px-5 py-2 text-white"
              >
                Start Service
              </button>
            )}

            {booking?.status === "in_progress" && (
              <>
                <button
                  disabled={actionLoading}
                  onClick={handleClockIn}
                  className="rounded-lg bg-black px-5 py-2 text-white"
                >
                  Clock In
                </button>

                <button
                  disabled={actionLoading}
                  onClick={handleClockOut}
                  className="rounded-lg border border-gray-300 px-5 py-2"
                >
                  Clock Out
                </button>
              </>
            )}

          </div>

          {/* CHECKLIST */}

          <div className="mt-10">
            <h3 className="text-lg font-semibold">
              Service Checklist
            </h3>

            <div className="mt-4 space-y-3">

              {checklist.length === 0 ? (
                <p className="text-gray-500">
                  No checklist items.
                </p>
              ) : (
                checklist.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div>
                      <p className="font-medium">
                        {item.title}
                      </p>

                      {item.description && (
                        <p className="text-sm text-gray-500">
                          {item.description}
                        </p>
                      )}
                    </div>

                    {item.completed ? (
                      <span className="text-sm font-medium text-green-600">
                        Completed
                      </span>
                    ) : (
                      <button
                        onClick={() =>
                          handleChecklist(
                            item._id
                          )
                        }
                        className="rounded-lg bg-gray-900 px-3 py-2 text-sm text-white"
                      >
                        Complete
                      </button>
                    )}
                  </div>
                ))
              )}

            </div>
          </div>
            <JobPhotoUpload
            bookingId={bookingId}
            onUploaded={loadData}
            />

            <JobPhotoGallery
            bookingId={bookingId}
            />

            <JobNotes
            bookingId={bookingId}
            initialNotes={booking?.employeeNotes || ""}
            />

          {/* COMPLETE SERVICE */}

          {booking?.status === "in_progress" && (
            <div className="mt-10 border-t pt-6">

              <h3 className="font-semibold">
                Finish Service
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Complete all required tasks and
                clock out before finishing.
              </p>

              <button
                disabled={actionLoading}
                onClick={handleComplete}
                className="mt-4 rounded-lg bg-green-600 px-5 py-3 font-medium text-white"
              >
                Complete Service
              </button>

              <div className="mt-8 rounded-xl border bg-gray-50 p-5">
                <h3 className="font-semibold">
                    Completion Requirements
                </h3>

                <div className="mt-4 space-y-3">

                    <div className="flex justify-between">
                    <span>
                        Required checklist
                    </span>

                    <span>
                        {completedChecklist}/
                        {requiredChecklist}
                    </span>
                    </div>

                    <div className="flex justify-between">
                    <span>
                        Job photos
                    </span>

                    <span>
                        Upload at least 1
                    </span>
                    </div>

                    <div className="flex justify-between">
                    <span>
                        Clock out
                    </span>

                    <span>
                        Required
                    </span>
                    </div>

                </div>
                </div>

            </div>
            
          )}

        </div>
        
      </div>
    </div>
  );
};

export default EmployeeJobExecution;