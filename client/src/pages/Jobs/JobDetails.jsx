// client/src/pages/JobDetails/JobDetails.jsx
// WHY: Full job page: customer info, instructions, photos, notes, completion gate, Start / Complete.
// ROUTE: /assignments/:id  (id = Booking _id in real mode)
// DEMO SWITCH: USING_DEMO_DATA (services/jobService.js). Demo = local state only. Real = backend API.
// APIs: jobService (job, start, complete), photoService, completionService, noteService.

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

import {
  getJobById,
  startJob,
  completeJob,
  USING_DEMO_DATA,
} from "../../services/jobService";
import { getPhotos } from "../../services/photoService";
import { getCompletionGate } from "../../services/completionService";

import PhotoUploader from "../../components/photos/PhotoUploader";
import NotesPanel from "../../components/notes/NotesPanel";

function JobDetails() {
  const { id } = useParams();

  // TEMP-DB: In demo mode the job id is fake, so photos/notes/gate use a test booking id.
  // REAL: The route id IS the real Booking _id, so it is used directly.
  const bookingId = USING_DEMO_DATA ? "6af1aa719cc38c80aa33ee4f" : id;

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  // Current work status shown on the page.
  const [workStatus, setWorkStatus] = useState("Assigned");

  // Start / Complete request state.
  const [acting, setActing] = useState(false);
  const [actionError, setActionError] = useState("");

  // Sync the page status with the loaded job.
  useEffect(() => {
    if (job) {
      setWorkStatus(job.status || "Assigned");
    }
  }, [job]);

  // Photos.
  const [photos, setPhotos] = useState([]);
  const [photosLoading, setPhotosLoading] = useState(true);
  const [photoLoadError, setPhotoLoadError] = useState(false);

  // Completion Gate (from backend).
  const [completionGate, setCompletionGate] = useState(null);
  const [gateLoading, setGateLoading] = useState(true);
  const [gateError, setGateError] = useState(false);

  // Load the job.
  const loadJob = useCallback(async () => {
    try {
      const data = await getJobById(id);
      setJob(data);
    } catch (error) {
      console.error("Failed to load job:", error);
      setJob(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadJob();
  }, [loadJob]);

  // Load uploaded photos.
  const loadPhotos = useCallback(async () => {
    try {
      setPhotoLoadError(false);

      const data = await getPhotos(bookingId);
      setPhotos(data.photos || []);
    } catch (error) {
      console.error("Failed to load photos:", error);

      setPhotoLoadError(true);
      setPhotos([]);
    } finally {
      setPhotosLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    loadPhotos();
  }, [loadPhotos]);

  // Load completion requirements.
  const loadCompletionGate = useCallback(async () => {
    try {
      setGateLoading(true);
      setGateError(false);

      const data = await getCompletionGate(bookingId);
      setCompletionGate(data);
    } catch (error) {
      console.error("Failed to load completion gate:", error);

      setGateError(true);
      setCompletionGate(null);
    } finally {
      setGateLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    loadCompletionGate();
  }, [loadCompletionGate]);

  // Refresh photos and gate after an upload.
  const handlePhotoUploaded = async () => {
    await loadPhotos();
    await loadCompletionGate();
  };

  // Start Work button.
  const handleStart = async () => {
    if (acting) return;

    // TEMP-DB: demo mode only changes local state.
    // REAL: the backend checks clock-in, one active job, Before photo, then changes Booking.status.
    if (USING_DEMO_DATA) {
      setWorkStatus("In Progress");
      return;
    }

    try {
      setActing(true);
      setActionError("");

      await startJob(id);
      await loadJob();
    } catch (error) {
      console.error("Failed to start work:", error);

      setActionError(
        error.response?.data?.message ||
          "Unable to start work. Please try again."
      );
    } finally {
      setActing(false);
    }
  };

  // Complete Work button.
  const handleComplete = async () => {
    if (acting) return;

    // TEMP-DB: demo mode only changes local state.
    // REAL: the backend runs the Completion Gate, then changes Booking.status.
    if (USING_DEMO_DATA) {
      setWorkStatus("Completed");
      return;
    }

    try {
      setActing(true);
      setActionError("");

      await completeJob(id);
      await loadJob();
      await loadCompletionGate();
    } catch (error) {
      console.error("Failed to complete work:", error);

      setActionError(
        error.response?.data?.message ||
          "Unable to complete work. Please try again."
      );

      // The gate may have changed, so refresh the requirement list.
      await loadCompletionGate();
    } finally {
      setActing(false);
    }
  };

  // Which photo stages exist.
  const beforeUploaded = photos.some((photo) => photo.stage === "Before");
  const inProgressUploaded = photos.some(
    (photo) => photo.stage === "In Progress"
  );
  const afterUploaded = photos.some((photo) => photo.stage === "After");

  // Photo-based progress: 0 / 50 / 100.
  const progress = afterUploaded ? 100 : inProgressUploaded ? 50 : 0;

  // TEMP-DB (demo only): local status resets on refresh, so photos decide In Progress.
  // REAL: Booking.status comes from the API, so this effect does nothing.
  useEffect(() => {
    if (
      USING_DEMO_DATA &&
      workStatus === "Assigned" &&
      (inProgressUploaded || afterUploaded)
    ) {
      setWorkStatus("In Progress");
    }
  }, [workStatus, inProgressUploaded, afterUploaded]);

  // Backend is the source of truth for completion requirements.
  const canComplete =
    workStatus === "In Progress" &&
    completionGate?.allowed === true &&
    !gateLoading &&
    !gateError &&
    !photoLoadError &&
    !acting;

  if (loading || photosLoading) {
    return (
      <main className="min-h-screen bg-page p-6 text-muted">
        Loading job...
      </main>
    );
  }

  if (!job) {
    return (
      <main className="min-h-screen bg-page px-4 pt-6 text-ink">
        <Link to="/assignments" className="text-teal">
          Back to assignments
        </Link>

        <p className="mt-6 text-muted">This job was not found.</p>
      </main>
    );
  }

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

            <span className="font-semibold text-primary">{progress}%</span>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-elevated">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </section>

        {/* Work instructions (read-only) */}
        <section className="mt-6 rounded-2xl border border-line bg-surface p-4">
          <h2 className="font-semibold">Work Instructions</h2>

          <p className="mt-1 text-xs text-muted">Sent by admin. Read only.</p>

          {(job.requestedTasks || []).length === 0 &&
            !job.additionalRequirements && (
              <p className="mt-4 text-sm text-muted">
                No instructions were provided for this job.
              </p>
            )}

          <div className="mt-4 space-y-2">
            {(job.requestedTasks || []).map((task, index) => (
              <p
                key={index}
                className="rounded-xl border border-line bg-elevated/40 p-3 text-sm text-ink"
              >
                {task}
              </p>
            ))}
          </div>

          {job.additionalRequirements && (
            <p className="mt-4 whitespace-pre-wrap rounded-xl border border-line bg-elevated/40 p-3 text-sm text-muted">
              {job.additionalRequirements}
            </p>
          )}
        </section>

        {/* Photo loading error */}
        {photoLoadError && (
          <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
            Unable to load job photos. Please refresh and try again.
          </p>
        )}

        {/* Photo status messages */}
        {(beforeUploaded || inProgressUploaded || afterUploaded) && (
          <div className="mt-4 space-y-1 text-sm text-teal">
            {beforeUploaded && <p>Before photo uploaded</p>}
            {inProgressUploaded && (
              <p>In Progress photo uploaded — 50% complete</p>
            )}
            {afterUploaded && <p>After photo uploaded — 100% complete</p>}
          </div>
        )}

        {/* Before photo upload */}
        {workStatus === "Assigned" && !beforeUploaded && !photoLoadError && (
          <div className="mt-6">
            <PhotoUploader
              bookingId={bookingId}
              stage="Before"
              onUploaded={handlePhotoUploaded}
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
              onUploaded={handlePhotoUploaded}
            />

            <p className="mt-2 text-xs text-muted">
              Upload a progress photo after completing approximately half of the
              work.
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
                onUploaded={handlePhotoUploaded}
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
            onClick={handleStart}
            disabled={!beforeUploaded || photoLoadError || acting}
            className="mt-6 w-full rounded-xl bg-primary py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {acting ? "Starting..." : "Start Work"}
          </button>
        )}

        {/* Completion Gate status */}
        {workStatus === "In Progress" && (
          <section className="mt-4 rounded-2xl border border-line bg-surface p-4">
            <h2 className="font-semibold">Completion Requirements</h2>

            {gateError && (
              <p className="mt-3 text-sm text-red-400">
                Unable to verify completion requirements. Please refresh and try
                again.
              </p>
            )}

            {!gateError && gateLoading && (
              <p className="mt-3 text-sm text-muted">
                Checking completion requirements...
              </p>
            )}

            {!gateError && !gateLoading && completionGate && (
              <>
                {completionGate.allowed ? (
                  <p className="mt-3 text-sm text-teal">
                    All completion requirements are satisfied.
                  </p>
                ) : (
                  <div className="mt-3 space-y-2">
                    <p className="text-sm text-muted">
                      Complete the following requirements:
                    </p>

                    {(completionGate.missing || []).map((item, index) => (
                      <p
                        key={index}
                        className="flex items-start gap-2 text-sm text-amber-400"
                      >
                        <LuCircle className="mt-1 shrink-0" />
                        {item}
                      </p>
                    ))}
                  </div>
                )}
              </>
            )}
          </section>
        )}

        {/* Complete Work */}
        {workStatus === "In Progress" && (
          <button
            type="button"
            onClick={handleComplete}
            disabled={!canComplete}
            className="mt-6 w-full rounded-xl bg-teal py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {acting ? "Completing..." : "Complete Work"}
          </button>
        )}

        {/* Start / Complete error from the server */}
        {actionError && (
          <p className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-center text-sm text-red-400">
            {actionError}
          </p>
        )}

        {/* Work completed message */}
        {workStatus === "Completed" && (
          <div className="mt-6 rounded-xl border border-teal/30 bg-teal/10 p-4 text-center text-teal">
            Work Completed Successfully
          </div>
        )}

        {/* Notes and incident logs */}
        <NotesPanel bookingId={bookingId} onSaved={loadCompletionGate} />
      </div>
    </main>
  );
}

export default JobDetails;