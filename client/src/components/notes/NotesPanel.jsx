
import { useCallback, useEffect, useState } from "react";
import { getNotes, createNote } from "../../services/noteService";

const MAX_LENGTH = 1000;

function NotesPanel({ bookingId }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  // Form state
  const [type, setType] = useState("Note");
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  // Load notes for this booking.
  const loadNotes = useCallback(async () => {
    try {
      setLoadError(false);

      const data = await getNotes(bookingId);
      setNotes(data.notes || []);
    } catch (error) {
      console.error("Failed to load notes:", error);
      setLoadError(true);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  // Save a new note, then reload the list.
  const handleSave = async () => {
    if (saving) return;

    // Prevent empty notes from being submitted.
    if (!text.trim()) {
      setSaveError("Please write something before saving.");
      return;
    }

    try {
      setSaving(true);
      setSaveError("");

      // Send the new note to the backend.
      await createNote(bookingId, type, text.trim());

      // Clear the form after successful saving.
      setText("");

      // Reload notes to display the newly saved note.
      await loadNotes();
    } catch (error) {
      console.error("Failed to save note:", error);

      setSaveError(
        error.response?.data?.message || "Unable to save. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mt-6 rounded-2xl border border-line bg-surface p-4">
      <h2 className="font-semibold">Notes &amp; Incidents</h2>

      {/* Type selector */}
      <div className="mt-4 flex gap-2">
        {["Note", "Incident"].map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => {
              setType(option);
              setSaveError("");
            }}
            className={`rounded-full border px-4 py-1.5 text-sm transition ${
              type === option
                ? "border-primary bg-primary/15 text-primary"
                : "border-line text-muted hover:bg-elevated"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Text box */}
      <textarea
        value={text}
        onChange={(event) => {
          setText(event.target.value);
          setSaveError("");
        }}
        maxLength={MAX_LENGTH}
        rows={4}
        placeholder={
          type === "Incident"
            ? "Describe the incident (what happened, where, any damage)..."
            : "Write a service note..."
        }
        className="mt-3 w-full resize-none rounded-xl border border-line bg-elevated/40 p-3 text-sm text-ink placeholder:text-muted focus:border-primary focus:outline-none"
      />

      {/* Character count and error message */}
      <div className="mt-1 flex items-center justify-between text-xs text-muted">
        <span className="text-red-400">
          {saveError}
        </span>

        <span>
          {text.length}/{MAX_LENGTH}
        </span>
      </div>

      {/* Save button */}
      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="mt-3 w-full rounded-xl bg-primary py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {saving ? "Saving..." : `Save ${type}`}
      </button>

      {/* Saved notes */}
      <div className="mt-6">
        {loading && (
          <div className="space-y-3">
            <div className="h-16 animate-pulse rounded-xl bg-elevated/60" />
            <div className="h-16 animate-pulse rounded-xl bg-elevated/60" />
          </div>
        )}

        {!loading && loadError && (
          <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
            Unable to load notes. Please refresh and try again.
          </p>
        )}

        {!loading && !loadError && notes.length === 0 && (
          <p className="text-sm text-muted">No notes yet.</p>
        )}

        {!loading && !loadError && notes.length > 0 && (
          <div className="space-y-3">
            {notes.map((note) => (
              <article
                key={note._id}
                className="rounded-xl border border-line bg-elevated/40 p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      note.type === "Incident"
                        ? "bg-red-500/10 text-red-400"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    {note.type}
                  </span>

                  <span className="text-xs text-muted">
                    {new Date(note.createdAt).toLocaleString("en-LK", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                </div>

                <p className="mt-2 whitespace-pre-wrap break-words text-sm text-ink">
                  {note.text}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default NotesPanel;
