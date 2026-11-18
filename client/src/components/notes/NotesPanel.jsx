// Service notes and incident reports for a job. UI polish only.
// Load / save logic and the completion-gate refresh (onSaved) are unchanged.

import { useCallback, useEffect, useState } from "react";
import { LuTriangleAlert, LuStickyNote } from "react-icons/lu";
import { getNotes, createNote } from "../../services/noteService";

const MAX_LENGTH = 1000;

function NotesPanel({ bookingId, onSaved }) {
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

      // Refresh the completion gate after saving a note.
      try {
        await onSaved?.();
      } catch (error) {
        console.error("Failed to refresh completion gate:", error);
      }
    } catch (error) {
      console.error("Failed to save note:", error);

      setSaveError(
        error.response?.data?.message || "Unable to save. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mt-6 rounded-2xl border border-line bg-surface p-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-heading text-base font-semibold text-ink">
          Notes &amp; Incidents
        </h2>
        {!loading && !loadError && notes.length > 0 && (
          <span className="rounded-full bg-elevated px-2.5 py-0.5 text-xs font-medium text-muted">
            {notes.length} saved
          </span>
        )}
      </div>

      {/* Type selector */}
      <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-elevated/60 p-1">
        {["Note", "Incident"].map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => {
              setType(option);
              setSaveError("");
            }}
            className={`rounded-lg py-2 text-sm font-medium transition ${
              type === option
                ? option === "Incident"
                  ? "bg-red-500/15 text-red-300 shadow-sm"
                  : "bg-primary/15 text-primary shadow-sm"
                : "text-muted hover:text-ink"
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

      {/* Error message and character count */}
      <div className="mt-1 flex items-start justify-between gap-3 text-xs">
        <span role="alert" className="text-red-400">
          {saveError}
        </span>

        <span className="shrink-0 text-muted">
          {text.length}/{MAX_LENGTH}
        </span>
      </div>

      {/* Save button */}
      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="mt-3 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {saving ? "Saving..." : `Save ${type}`}
      </button>

      {/* Saved notes */}
      <div className="mt-6 border-t border-line pt-5">
        {loading && (
          <div className="space-y-3">
            <div className="h-16 animate-pulse rounded-xl bg-elevated/60" />
            <div className="h-16 animate-pulse rounded-xl bg-elevated/60" />
          </div>
        )}

        {!loading && loadError && (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
            <span>Unable to load notes.</span>
            <button
              type="button"
              onClick={() => {
                setLoading(true);
                loadNotes();
              }}
              className="shrink-0 rounded-lg border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink hover:bg-elevated"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !loadError && notes.length === 0 && (
          <p className="rounded-xl border border-dashed border-line px-4 py-5 text-center text-sm text-muted">
            No notes yet. Add at least one note before completing the job.
          </p>
        )}

        {!loading && !loadError && notes.length > 0 && (
          <div className="space-y-3">
            {notes.map((note) => {
              const incident = note.type === "Incident";

              return (
                <article
                  key={note._id}
                  className={`rounded-xl border p-3 ${
                    incident
                      ? "border-red-500/30 bg-red-500/5"
                      : "border-line bg-elevated/40"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                        incident
                          ? "bg-red-500/10 text-red-400"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      {incident ? <LuTriangleAlert size={12} /> : <LuStickyNote size={12} />}
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
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default NotesPanel;