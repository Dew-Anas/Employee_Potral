import { Link } from "react-router-dom";

{booking.status === "completed" && (
  <Link
    to={`/customer/bookings/${booking.id}/review`}
    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
  >
    Leave Review
  </Link>
)}