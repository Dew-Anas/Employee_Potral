import { useState } from "react";

import {
  updateJobNotes,
} from "../../services/employeeService";

const JobNotes = ({
  bookingId,
  initialNotes = "",
}) => {
  const [notes, setNotes] =
    useState(initialNotes);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const handleSave = async () => {
    setMessage("");
    setError("");

    if (!notes.trim()) {
      setError("Please enter job notes.");
      return;
    }

    try {
      setSaving(true);

      await updateJobNotes(
        bookingId,
        notes
      );

      setMessage(
        "Job notes saved successfully."
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to save notes."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-8 rounded-xl border bg-white p-5">
      <h3 className="text-lg font-semibold">
        Job Notes
      </h3>

      <textarea
        value={notes}
        onChange={(e) =>
          setNotes(e.target.value)
        }
        rows={5}
        maxLength={3000}
        placeholder="Add service notes..."
        className="mt-4 w-full rounded-lg border p-3"
      />

      <div className="mt-2 text-right text-xs text-gray-400">
        {notes.length}/3000
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}

      {message && (
        <p className="mt-2 text-sm text-green-600">
          {message}
        </p>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-4 rounded-lg bg-black px-5 py-2 text-sm text-white disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Notes"}
      </button>
    </div>
  );
};

export default JobNotes;