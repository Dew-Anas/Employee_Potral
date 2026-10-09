import { AlertTriangle, X } from "lucide-react";

const QuoteActionModal = ({
  isOpen,
  action,
  onConfirm,
  onCancel,
  loading = false,
}) => {
  if (!isOpen) return null;

  const isAccept = action === "accept";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        {/* Close */}
        <div className="flex items-start justify-between">
          <div
            className={`rounded-full p-3 ${
              isAccept
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600"
            }`}
          >
            {isAccept ? (
              <AlertTriangle size={22} />
            ) : (
              <AlertTriangle size={22} />
            )}
          </div>

          <button
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="mt-5">
          <h2 className="text-xl font-semibold text-slate-900">
            {isAccept
              ? "Accept Quotation?"
              : "Reject Quotation?"}
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {isAccept
              ? "Are you sure you want to accept this quotation? This action will allow the service booking process to continue."
              : "Are you sure you want to reject this quotation? This action cannot be easily undone."}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className={`rounded-lg px-4 py-2.5 text-sm font-medium text-white ${
              isAccept
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {loading
              ? "Processing..."
              : isAccept
                ? "Yes, Accept"
                : "Yes, Reject"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuoteActionModal;