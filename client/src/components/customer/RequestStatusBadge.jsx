import { getStatusLabel } from "../../utils/requestStatus";

const RequestStatusBadge = ({ status }) => {
  const styles = {
    submitted:
      "bg-slate-100 text-slate-700",

    under_review:
      "bg-yellow-100 text-yellow-700",

    quotation_sent:
      "bg-blue-100 text-blue-700",

    accepted:
      "bg-green-100 text-green-700",

    booking_confirmed:
      "bg-purple-100 text-purple-700",

    in_progress:
      "bg-orange-100 text-orange-700",

    completed:
      "bg-emerald-100 text-emerald-700",

    cancelled:
      "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${
        styles[status] || "bg-slate-100 text-slate-700"
      }`}
    >
      {getStatusLabel(status)}
    </span>
  );
};

export default RequestStatusBadge;