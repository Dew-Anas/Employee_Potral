
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  LuArrowLeft,
  LuCalendarClock,
  LuMapPin,
  LuPhone,
  LuUserRound,
  LuCircle,
} from "react-icons/lu";

import { getJobById } from "../../services/jobService";
import { getPhotos } from "../../services/photoService";
import PhotoUploader from "../../components/photos/PhotoUploader";
import NotesPanel from "../../components/notes/NotesPanel";

import {
  getChecklist,
  updateChecklistItem,
} from "../../services/checklistService";

function JobDetails() {
  const { id } = useParams();

  // TEMP-DB: Replace this ID with the real booking ID from the API later.
  // REAL: Use the actual booking ID returned by the Booking API.
  const bookingId = "6af1aa719cc38c80aa33ee4f";

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  // Store the current work status.
  const [workStatus, setWorkStatus] = useState("Assigned");

  // Sync the UI status with the loaded job data.
  useEffect(() => {
    if (job) {
      setWorkStatus(job.status || "Assigned");
    }
  }, [job]);

  // Store uploaded photos.
  const [photos, setPhotos] = useState([]);
  const [photosLoading, setPhotosLoading] = useState(true);
  const [photoLoadError, setPhotoLoadError] = useState(false);

  // Store checklist items received from the backend.
  const [checklist, setChecklist] = useState([]);

  // Track checklist loading state.
  const [checklistLoading, setChecklistLoading] = useState(true);

  // Track checklist API errors.
  const [checklistError, setChecklistError] = useState(false);

  // Store the ID of the checklist item currently updating.
  const [updatingItemId, setUpdatingItemId] = useState(null);

  // Store checklist update errors.
  const [checklistUpdateError, setChecklistUpdateError] = useState("");

  // Load job details.
  useEffect(() => {
    getJobById(id)
      .then(setJob)
      .catch((error) => {
        console.error("Failed to load job:", error);
        setJob(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Load uploaded photos from the database.
  const loadPhotos = useCallback(async () => {
    try {
      // Clear previous photo errors.
      setPhotoLoadError(false);

      // Request photos for this booking.
      const data = await getPhotos(bookingId);

      // Store the returned photos.
      setPhotos(data.photos || []);
    } catch (error) {
      console.error("Failed to load photos:", error);

      // Show an error if photo loading fails.
      setPhotoLoadError(true);
      setPhotos([]);
    } finally {
      // Stop the photo loading state.
      setPhotosLoading(false);
    }
  }, [bookingId]);

  // Load photos when the page opens.
  useEffect(() => {
    loadPhotos();
  }, [loadPhotos]);

  // Load checklist items from the backend.
  const loadChecklist = useCallback(async () => {
    try {
      // Clear previous checklist errors.
      setChecklistError(false);

      // Request checklist items for this booking.
      const data = await getChecklist(bookingId);

      // Store checklist items in React state.
      setChecklist(data.checklist || []);
    } catch (error) {
      console.error("Failed to load checklist:", error);

      // Show an error if checklist loading fails.
      setChecklistError(true);
      setChecklist([]);
    } finally {
      // Stop the checklist loading state.
      setChecklistLoading(false);
    }
  }, [bookingId]);

  // Load checklist when the job details page opens.
  useEffect(() => {
    loadChecklist();
  }, [loadChecklist]);

  // Toggle a checklist item between Pending and Completed.
  const handleChecklistToggle = async (item) => {
    // Prevent another update while an item is being saved.
    if (updatingItemId !== null) return;

    const nextStatus =
      item.status === "Completed" ? "Pending" : "Completed";

    try {
      // Start the update loading state.
      setUpdatingItemId(item._id);
      setChecklistUpdateError("");

      // Save the new status in MongoDB through the API.
      await updateChecklistItem(item._id, nextStatus);

      // Update the UI after the backend confirms success.
      setChecklist((previousItems) =>
        previousItems.map((currentItem) =>
          currentItem._id === item._id
            ? { ...currentItem, status: nextStatus }
            : currentItem
        )
      );
    } catch (error) {
      console.error("Failed to update checklist:", error);

      // Display an error if the API update fails.
      setChecklistUpdateError(
        "Unable to update this task. Please try again."
      );
    } finally {
      // Stop the update loading state.
      setUpdatingItemId(null);
    }
  };

  // Check whether each photo stage has an uploaded photo.
  const beforeUploaded = photos.some(
    (photo) => photo.stage === "Before"
  );

  const inProgressUploaded = photos.some(
    (photo) => photo.stage === "In Progress"
  );

  const afterUploaded = photos.some(
    (photo) => photo.stage === "After"
  );

  // Calculate photo-based work progress.
  const progress = afterUploaded
    ? 100
    : inProgressUploaded
      ? 50
      : 0;

  // Get essential checklist items.
  const essentialItems = checklist.filter(
    (item) => item.essential
  );

  // Count completed essential checklist items.
  const completedEssentialItems = essentialItems.filter(
    (item) => item.status === "Completed"
  );

  // Completion Gate: all essential checklist items must be Completed.
  // An empty essential list must NOT pass the gate.
  const allEssentialDone =
    essentialItems.length > 0 &&
    completedEssentialItems.length === essentialItems.length;

  // Check whether the employee can complete the work.
  const canComplete =
    workStatus === "In Progress" &&
    afterUploaded &&
    allEssentialDone;

  // TEMP-DB: workStatus is only React state, so a refresh resets it to "Assigned".
  // If saved photos already show progress, the work must be In Progress.
  // REAL: Read booking.status from the Booking API and remove this effect.
  useEffect(() => {
    if (
      workStatus === "Assigned" &&
      (inProgressUploaded || afterUploaded)
    ) {
      setWorkStatus("In Progress");
    }
  }, [workStatus, inProgressUploaded, afterUploaded]);

  // Show loading screen while data is being fetched.
  if (loading || photosLoading || checklistLoading) {
    return (
      <main className="min-h-screen bg-page p-6 text-muted">
        Loading job...
      </main>
    );
  }

  // Show an error if the job does not exist.
  if (!job) {
    return (
      <main className="min-h-screen bg-page px-4 pt-6 text-ink">
        <Link to="/assignments" className="text-teal">
          Back to assignments
        </Link>

        <p className="mt-6 text-muted">
          This job was not found.
        </p>
      </main>
    );
  }

  // Create a Google Maps search link using the job address.
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    job.address
  )}`;

  return (
    <main className="min-h-screen bg-page px-4 pb-28 pt-6 text-ink">
      <div className="mx-auto max-w-2xl">

        {/* Back navigation */}
        <Link
          to="/assignments"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink"
        >
          <LuArrowLeft />
          Assignments
        </Link>

        {/* Job heading */}
        <div className="mt-4 flex items-start justify-between gap-3">
          <h1 className="font-heading text-2xl font-semibold">
            {job.serviceName}
          </h1>

          <span className="rounded-full bg-teal/15 px-3 py-1 text-xs font-medium text-teal">
            {workStatus}
          </span>
        </div>

        {/* Customer and booking details */}
        <section className="mt-6 space-y-4 rounded-2xl border border-line bg-surface p-4">
          <p className="flex items-center gap-3">
            <LuUserRound className="text-muted" />
            {job.customerName}
          </p>

          <a
            href={`tel:${job.customerPhone}`}
            className="flex items-center gap-3 text-primary"
          >
            <LuPhone className="text-muted" />
            {job.customerPhone}
          </a>

          <p className="flex items-center gap-3">
            <LuCalendarClock className="text-muted" />
            {new Date(job.scheduledAt).toLocaleString("en-LK", {
              dateStyle: "full",
              timeStyle: "short",
            })}
          </p>

          <div className="flex items-start justify-between gap-3">
            <p className="flex items-start gap-3">
              <LuMapPin className="mt-1 text-muted" />
              {job.address}
            </p>

            <a
              href={mapUrl}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 rounded-lg border border-line px-3 py-1 text-sm text-primary hover:bg-elevated"
            >
              Open map
            </a>
          </div>
        </section>

        {/* Work progress */}
        <section className="mt-6 rounded-2xl border border-line bg-surface p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Work Progress</h2>

            <span className="font-semibold text-primary">
              {progress}%
            </span>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-elevated">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </section>

        {/* Work checklist */}
        <section className="mt-6 rounded-2xl border border-line bg-surface p-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-semibold">Work Checklist</h2>

            <span className="text-xs text-muted">
              {completedEssentialItems.length}/{essentialItems.length} essential
            </span>
          </div>

          {/* Checklist loading error */}
          {checklistError && (
            <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
              Unable to load job checklist. Please refresh and try again.
            </p>
          )}

          {/* Checklist update error */}
          {checklistUpdateError && (
            <p className="mt-3 text-sm text-red-400">
              {checklistUpdateError}
            </p>
          )}

          {/* Empty checklist */}
          {!checklistError && checklist.length === 0 && (
            <p className="mt-4 text-sm text-muted">
              No checklist items available.
            </p>
          )}

          {/* Display interactive checklist items */}
          {!checklistError && checklist.length > 0 && (
            <div className="mt-4 space-y-3">
              {checklist.map((item) => (
                <button
                  type="button"
                  key={item._id}
                  onClick={() => handleChecklistToggle(item)}
                  disabled={updatingItemId !== null}
                  className="flex w-full items-start gap-3 rounded-xl border border-line bg-elevated/40 p-3 text-left transition hover:bg-elevated disabled:cursor-wait disabled:opacity-60"
                >
                  {/* Checklist status icon */}
                  <LuCircle
                    className={`mt-0.5 shrink-0 ${
                      item.status === "Completed"
                        ? "text-teal"
                        : "text-muted"
                    }`}
                  />

                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-sm ${
                        item.status === "Completed"
                          ? "text-muted line-through"
                          : "text-ink"
                      }`}
                    >
                      {item.title}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="text-xs text-muted">
                        {updatingItemId === item._id
                          ? "Saving..."
                          : item.status}
                      </span>

                      {item.essential && (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                          Essential
                        </span>
                      )}

                      {!item.essential && (
                        <span className="rounded-full bg-elevated px-2 py-0.5 text-xs text-muted">
                          Optional
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Photo loading error */}
        {photoLoadError && (
          <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
            Unable to load job photos. Please refresh and try again.
          </p>
        )}

        {/* Photo status messages grouped in one block */}
        {(beforeUploaded || inProgressUploaded || afterUploaded) && (
          <div className="mt-4 space-y-1 text-sm text-teal">
            {beforeUploaded && <p>Before photo uploaded</p>}
            {inProgressUploaded && (
              <p>In Progress photo uploaded — 50% complete</p>
            )}
            {afterUploaded && (
              <p>After photo uploaded — 100% complete</p>
            )}
          </div>
        )}

        {/* Before photo upload */}
        {workStatus === "Assigned" &&
          !beforeUploaded &&
          !photoLoadError && (
            <div className="mt-6">
              <PhotoUploader
                bookingId={bookingId}
                stage="Before"
                onUploaded={loadPhotos}
              />

              <p className="mt-2 text-xs text-muted">
                Upload a Before photo to start work.
              </p>
            </div>
          )}

        {/* In Progress photo upload */}
        {workStatus === "In Progress" && !inProgressUploaded && (
          <div className="mt-6">
            <PhotoUploader
              bookingId={bookingId}
              stage="In Progress"
              onUploaded={loadPhotos}
            />

            <p className="mt-2 text-xs text-muted">
              Upload a progress photo after completing approximately half of the work.
            </p>
          </div>
        )}

        {/* After photo upload */}
        {workStatus === "In Progress" &&
          inProgressUploaded &&
          !afterUploaded && (
            <div className="mt-6">
              <PhotoUploader
                bookingId={bookingId}
                stage="After"
                onUploaded={loadPhotos}
              />

              <p className="mt-2 text-xs text-muted">
                Upload an After photo when the work is fully finished.
              </p>
            </div>
          )}

        {/* Start Work */}
        {workStatus === "Assigned" && (
          <button
            type="button"
            onClick={() => setWorkStatus("In Progress")}
            disabled={!beforeUploaded || photoLoadError}
            className="mt-6 w-full rounded-xl bg-primary py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Start Work
          </button>
        )}

        {/* Complete Work */}
        {workStatus === "In Progress" && (
          <button
            type="button"
            onClick={() => setWorkStatus("Completed")}
            disabled={!canComplete || photoLoadError}
            className="mt-6 w-full rounded-xl bg-teal py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Complete Work
          </button>
        )}

        {/* Explain why completion is disabled */}
        {workStatus === "In Progress" && !allEssentialDone && (
          <p className="mt-2 text-center text-xs text-muted">
            Complete all essential checklist items to finish this work.
          </p>
        )}

        {/* Work completed message */}
        {workStatus === "Completed" && (
          <div className="mt-6 rounded-xl border border-teal/30 bg-teal/10 p-4 text-center text-teal">
            Work Completed Successfully
          </div>
        )}

        {/* Notes and incident logs */}
        <NotesPanel bookingId={bookingId} />
      </div>
    </main>
  );
}

export default JobDetails;
