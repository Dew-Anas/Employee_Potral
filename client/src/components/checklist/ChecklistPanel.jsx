import { useEffect, useState } from "react";
import { LuCheck, LuCircle } from "react-icons/lu";

import {
  getChecklist,
  completeChecklistItem,
} from "../../services/checklistService";

function ChecklistPanel({ bookingId }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  // Load checklist when page opens or bookingId changes
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getChecklist(bookingId);
        setItems(data.items);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load checklist"
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [bookingId]);

  // Complete one checklist item
  const handleComplete = async (itemId) => {
    try {
      setBusyId(itemId);
      setError("");

      // 1. Send PUT request to backend
      const data = await completeChecklistItem(itemId);

      // 2. Update only the completed item in the list
      setItems((prev) =>
        prev.map((i) => (i._id === itemId ? data.item : i))
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update item"
      );
    } finally {
      setBusyId(null);
    }
  };

  const total = items.length;

  const completed = items.filter(
    (i) => i.status === "Completed"
  ).length;

  const percent =
    total === 0 ? 0 : Math.round((completed / total) * 100);

  // 1. Loading skeleton
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="h-16 animate-pulse rounded-xl bg-elevated"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-line bg-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-heading text-lg text-ink">
          Checklist
        </h2>

        <span className="font-mono text-sm text-muted">
          {completed}/{total}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-4 h-2 overflow-hidden rounded-full bg-elevated">
        <div
          className="h-full rounded-full bg-teal transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Error */}
      {error && (
        <p className="mb-3 rounded-lg border border-line bg-elevated p-3 text-sm text-ink">
          {error}
        </p>
      )}

      {/* Empty */}
      {total === 0 && !error && (
        <p className="py-6 text-center text-sm text-muted">
          No checklist tasks for this job yet.
        </p>
      )}

      {/* Checklist items */}
      <ul className="space-y-2">
        {items.map((item) => {
          const done = item.status === "Completed";

          return (
            <li
              key={item._id}
              className="flex items-center gap-3 rounded-xl border border-line bg-elevated p-3"
            >
              {done ? (
                <LuCheck
                  className="shrink-0 text-teal"
                  size={20}
                />
              ) : (
                <LuCircle
                  className="shrink-0 text-muted"
                  size={20}
                />
              )}

              <div className="min-w-0 flex-1">
                <p
                  className={`text-sm ${
                    done
                      ? "text-muted line-through"
                      : "text-ink"
                  }`}
                >
                  {item.title}
                </p>

                {item.essential && !done && (
                  <span className="text-xs text-primary">
                    Required
                  </span>
                )}
              </div>

              {!done && (
                <button
                  onClick={() => handleComplete(item._id)}
                  disabled={busyId === item._id}
                  className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-ink disabled:opacity-50"
                >
                  {busyId === item._id
                    ? "Saving..."
                    : "Mark done"}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default ChecklistPanel;