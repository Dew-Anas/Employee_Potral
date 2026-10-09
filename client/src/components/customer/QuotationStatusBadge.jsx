import { getQuotationStatus } from "../../utils/quotationStatus";

const QuotationStatusBadge = ({
  status,
  validUntil,
}) => {
  const quotationStatus = getQuotationStatus(
    status,
    validUntil
  );

  const styles = {
    pending:
      "bg-yellow-100 text-yellow-700",

    accepted:
      "bg-green-100 text-green-700",

    rejected:
      "bg-red-100 text-red-700",

    expired:
      "bg-slate-200 text-slate-600",
  };

  const labels = {
    pending: "Pending",
    accepted: "Accepted",
    rejected: "Rejected",
    expired: "Expired",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${
        styles[quotationStatus]
      }`}
    >
      {labels[quotationStatus]}
    </span>
  );
};

export default QuotationStatusBadge;