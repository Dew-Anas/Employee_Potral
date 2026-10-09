import { useEffect, useState } from "react";
import {
  clockIn,
  clockOut,
  getBookingAttendance,
} from "../../services/attendanceService";


const AttendanceCard = ({ bookingId }) => {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [clockedIn, setClockedIn] = useState(false);
  const [clockedOut, setClockedOut] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isClockedIn || !startTime) {
      return;
    }

    const timer = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor(
        (now - startTime) / 1000
      );

      setElapsedSeconds(elapsed);
    }, 1000);

    return () => clearInterval(timer);
  }, [isClockedIn, startTime]);

  useEffect(() => {
    const loadAttendance = async () => {
      try {
        setLoading(true);

        const data =
          await getBookingAttendance(bookingId);

        console.log(
          "Attendance:",
          data
        );

        if (data?.attendance?.clockIn) {
          setClockedIn(true);
        }

        if (data?.attendance?.clockOut) {
          setClockedOut(true);
        }
      } catch (error) {
        console.error(
          "Failed to load attendance:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) {
      loadAttendance();
    }
  }, [bookingId]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);

    const minutes = Math.floor(
      (seconds % 3600) / 60
    );

    const remainingSeconds = seconds % 60;

    return [
      hours,
      minutes,
      remainingSeconds,
    ]
      .map((value) => String(value).padStart(2, "0"))
      .join(":");
  };

  const handleClockIn = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await clockIn(bookingId);

      console.log("Clock-in response:", data);

      setClockedIn(true);
    } catch (error) {
      console.error("Clock-in failed:", error);

      setError(
        error.response?.data?.message ||
          "Unable to clock in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await clockOut(bookingId);

      console.log("Clock-out response:", data);

      setClockedIn(false);
      setClockedOut(true);
    } catch (error) {
      console.error("Clock-out failed:", error);

      setError(
        error.response?.data?.message ||
          "Unable to clock out. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Attendance
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Record your service working time.
          </p>
        </div>

        <div
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            isClockedIn
              ? "bg-green-100 text-green-700"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {isClockedIn ? "Clocked In" : "Not Clocked In"}
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-slate-500">
          Working Time
        </p>

        <p className="mt-2 text-4xl font-bold tracking-wider text-slate-900">
          {formatTime(elapsedSeconds)}
        </p>
      </div>

      <div className="mt-6">
        {!isClockedIn ? (
          <button
            type="button"
            onClick={handleClockIn}
            disabled={loading || clockedIn}
            className="rounded-lg bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {loading
              ? "Clocking In..."
              : clockedIn
              ? "Clocked In"
              : "Clock In"}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleClockOut}
            disabled={loading || !clockedIn || clockedOut}
            className="rounded-lg bg-orange-600 px-5 py-3 text-sm font-semibold text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {loading
              ? "Clocking Out..."
              : clockedOut
              ? "Clocked Out"
              : "Clock Out"}
          </button>
        )}
        {error && (
          <p className="mt-3 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default AttendanceCard;