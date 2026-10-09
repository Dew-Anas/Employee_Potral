import { getBookingStatusLabel } from "../../utils/bookingStatus";

const BookingStatusBadge = ({ status }) => {
  const styles = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-blue-100 text-blue-700",
    assigned: "bg-purple-100 text-purple-700",
    in_progress: "bg-orange-100 text-orange-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${
        styles[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {getBookingStatusLabel(status)}
    </span>
  );
};

export default BookingStatusBadge;