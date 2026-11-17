// client/src/pages/JobDetails/JobDetails.jsx
// WHY: Full job page: customer info, instructions, Accept / Decline, photos, notes, completion gate, Start / Complete.
// ROUTE: /assignments/:id  (id = Booking _id in real mode)
// FLOW: Assigned -> Accept -> Before photo -> Start Work -> In Progress -> After photo + note -> Complete Work.
// DEMO SWITCH: USING_DEMO_DATA (services/jobService.js). Demo = local state only. Real = backend API.
// APIs: jobService (job, respond, start, complete), photoService, completionService, noteService.
// UI: step tracker, status badge, sticky info column on desktop. Logic is unchanged.

import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  LuArrowLeft,
  LuCalendarClock,
  LuMapPin,
  LuPhone,
  LuUserRound,
  LuCircle,
  LuCheck,
  LuExternalLink,
} from "react-icons/lu";

import {
  getJobById,
  startJob,
  completeJob,
  respondToJob,
  USING_DEMO_DATA,
} from "../../services/jobService";
import { getPhotos } from "../../services/photoService";
import { getCompletionGate } from "../../services/completionService";

import PhotoUploader from "../../components/photos/PhotoUploader";
import NotesPanel from "../../components/notes/NotesPanel";

const formatWhen = (value) => {
  if (!value) return "Schedule to be confirmed";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Schedule to be confirmed";

  return date.toLocaleString("en-LK", { dateStyle: "full", timeStyle: "short" });
};

// Badge text + colour (same wording as the Assignments page).
function getBadge(workStatus, response) {
  if (workStatus === "In Progress") {
    return { text: "In Progress", className: "bg-primary/15 text-primary" };
  }

  if (workStatus === "Completed") {
    return { text: "Completed", className: "bg-teal/15 text-teal" };
  }

  if (response === "Accepted") {
    return { text: "Accepted", className: "bg-teal/15 text-teal" };
  }

  if (response === "Declined") {
    return { text: "Declined", className: "bg-amber-500/15 text-amber-400" };
  }

  return { text: "Awaiting response", className: "bg-primary/15 text-primary" };
}

function Card({ title, subtitle, children, className = "" }) {
  return (
    <section className={`rounded-2xl border border-line bg-surface p-5 ${className}`}>
      {title && <h2 className="font-heading text-base font-bold">{title}</h2>}
      {subtitle && <p className="mt-1 text-xs text-muted">{subtitle}</p>}
      <div className={title ? "mt-4" : ""}>{children}</div>
    </section>
  );
}

function JobDetails() {
  const { id } = useParams();

  // TEMP-DB: In demo mode the job id is fake, so photos/notes/gate use a test booking id.
  // REAL: The route id IS the real Booking _id, so it is used directly.
  const bookingId = USING_DEMO_DATA ? "6af1aa719cc38c80aa33ee4f" : id;

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  // Current work status shown on the page.
  const [workStatus, setWorkStatus] = useState("Assigned");

  // Accept / Decline answer: null | "Accepted" | "Declined".
  const [response, setResponse] = useState(null);
  const [showDeclineBox, setShowDeclineBox] = useState(false);
  const [declineReason, setDeclineReason] = useState("");

  // Shared request state for Accept / Decline / Start / Complete.
  const [acting, setActing] = useState(false);
  const [actionError, setActionError] = useState("");

  // Sync the page with the loaded job.
  useEffect(() => {
    if (job) {
      setWorkStatus(job.status || "Assigned");
      setResponse(job.response || null);
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

  // Accept or Decline button.
  const handleRespond = async (answer) => {
    if (acting) return;

    // TEMP-DB: demo mode only changes local state.
    // REAL: the backend saves the answer in assignmentresponses.
    if (USING_DEMO_DATA) {
      setResponse(answer);
      setShowDeclineBox(false);
      return;
    }

    try {
      setActing(true);
      setActionError("");

      await respondToJob(id, answer, answer === "Declined" ? declineReason : "");

      setResponse(answer);
      setShowDeclineBox(false);
    } catch (error) {
      console.error("Failed to send response:", error);

      setActionError(
        error.response?.data?.message ||
          "Unable to send your response. Please try again."
      );

      // 409 = already answered earlier, so reload the real answer.
      if (error.response?.status === 409) {
        await loadJob();
      }
    } finally {
      setActing(false);
    }
  };

  // Start Work button.
  const handleStart = async () => {
    if (acting) return;

    // TEMP-DB: demo mode only changes local state.
    // REAL: the backend checks accepted, clock-in, one active job, Before photo, then changes Booking.status.
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
      <main className="min-h-screen bg-page px-4 pt-10 text-center text-muted" role="status">
        <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-line border-t-primary" />
        <p className="mt-4 text-sm">Loading job...</p>
      </main>
    );
  }

  if (!job) {
    return (
      <main className="min-h-screen bg-page px-4 pt-6 text-ink">
        <div className="mx-auto max-w-2xl">
          <Link
            to="/assignments"
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink"
          >
            <LuArrowLeft />
            Assignments
          </Link>

          <div className="mt-6 rounded-2xl border border-line bg-surface p-8 text-center">
            <p className="text-sm font-semibold">This job was not found.</p>
            <p className="mt-1 text-xs text-muted">
              It may have been reassigned or removed by the admin.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    job.address || ""
  )}`;

  const badge = getBadge(workStatus, response);

  // Step tracker (the first step that is not done is the current one).
  const accepted = response === "Accepted" || workStatus !== "Assigned";
  const started = workStatus === "In Progress" || workStatus === "Completed";

  const steps = [
    { label: "Accept job", done: accepted },
    { label: "Before photo", done: beforeUploaded },
    { label: "Start work", done: started },
    { label: "Progress photo (50%)", done: inProgressUploaded },
    { label: "After photo", done: afterUploaded },
    { label: "Complete work", done: workStatus === "Completed" },
  ];

  const currentStep = steps.findIndex((step) => !step.done);

  return (
    <main className="min-h-screen bg-page px-4 pb-28 pt-5 text-ink sm:px-6 lg:px-10 lg:pb-10">
      <div className="mx-auto max-w-5xl">
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
          <div className="min-w-0">
            <h1 className="font-heading text-xl font-bold tracking-tight sm:text-2xl">
              {job.serviceName}
            </h1>
            {job.bookingId && (
              <p className="mt-1 font-mono text-xs text-muted">{job.bookingId}</p>
            )}
          </div>

          <span
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${badge.className}`}
          >
            {badge.text}
          </span>
        </div>

        <div className="mt-5 grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
          {/* Info + steps (right column on desktop, first on mobile) */}
          <aside className="min-w-0 space-y-5 lg:col-start-2 lg:row-start-1 lg:sticky lg:top-6">
            <Card title="Job details">
              <div className="space-y-4 text-sm">
                <p className="flex items-center gap-3">
                  <LuUserRound className="shrink-0 text-muted" size={18} />
                  <span className="min-w-0 break-words">{job.customerName}</span>
                </p>

                {job.customerPhone && (
                  <a
                    href={`tel:${job.customerPhone}`}
                    className="flex items-center gap-3 text-primary"
                  >
                    <LuPhone className="shrink-0 text-muted" size={18} />
                    {job.customerPhone}
                  </a>
                )}

                <p className="flex items-start gap-3">
                  <LuCalendarClock className="mt-0.5 shrink-0 text-muted" size={18} />
                  <span className="min-w-0">{formatWhen(job.scheduledAt)}</span>
                </p>

                <div className="flex items-start justify-between gap-3">
                  <p className="flex min-w-0 items-start gap-3">
                    <LuMapPin className="mt-0.5 shrink-0 text-muted" size={18} />
                    <span className="min-w-0 break-words">
                      {job.address || "Address not provided"}
                    </span>
                  </p>

                  {job.address && (
                    <a
                      href={mapUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-primary hover:bg-elevated"
                    >
                      Map
                      <LuExternalLink size={13} />
                    </a>
                  )}
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-base font-bold">Work progress</h2>
                <span className="font-mono text-sm font-semibold text-primary">
                  {progress}%
                </span>
              </div>

              <div
                className="mt-3 h-1.5 overflow-hidden rounded-full bg-elevated"
                role="progressbar"
                aria-label="Work progress"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <ol className="mt-5 space-y-3">
                {steps.map((step, index) => {
                  const isCurrent = index === currentStep;

                  return (
                    <li key={step.label} className="flex items-center gap-3 text-sm">
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs ${
                          step.done
                            ? "border-teal bg-teal text-white"
                            : isCurrent
                              ? "border-primary text-primary"
                              : "border-line text-muted"
                        }`}
                      >
                        {step.done ? <LuCheck size={13} /> : index + 1}
                      </span>

                      <span
                        className={
                          step.done
                            ? "text-ink"
                            : isCurrent
                              ? "font-semibold text-ink"
                              : "text-muted"
                        }
                      >
                        {step.label}
                      </span>

                      {isCurrent && (
                        <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                          Next
                        </span>
                      )}
                    </li>
                  );
                })}
              </ol>
            </Card>
          </aside>

          {/* Work area */}
          <div className="min-w-0 space-y-5 lg:col-start-1 lg:row-start-1">
            {/* Work instructions (read-only) */}
            <Card title="Work instructions" subtitle="Sent by admin. Read only.">
              {(job.requestedTasks || []).length === 0 &&
                !job.additionalRequirements && (
                  <p className="text-sm text-muted">
                    No instructions were provided for this job.
                  </p>
                )}

              <div className="space-y-2">
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
                <p className="mt-3 whitespace-pre-wrap rounded-xl border border-line bg-elevated/40 p-3 text-sm text-muted">
                  {job.additionalRequirements}
                </p>
              )}
            </Card>

            {/* Accept / Decline (only while Assigned and not answered) */}
            {workStatus === "Assigned" && !response && (
              <Card
                title="New job assigned to you"
                subtitle="Accept this job to start work, or decline it."
                className="border-primary/40"
              >
                {!showDeclineBox && (
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => handleRespond("Accepted")}
                      disabled={acting}
                      className="flex-1 rounded-xl bg-teal py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {acting ? "Saving..." : "Accept"}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowDeclineBox(true);
                        setActionError("");
                      }}
                      disabled={acting}
                      className="flex-1 rounded-xl border border-line py-3 font-semibold text-ink transition hover:bg-elevated disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Decline
                    </button>
                  </div>
                )}

                {showDeclineBox && (
                  <div>
                    <p className="text-sm text-muted">
                      Tell admin why (optional). Admin will be informed.
                    </p>

                    <textarea
                      value={declineReason}
                      onChange={(event) => setDeclineReason(event.target.value)}
                      maxLength={500}
                      rows={3}
                      placeholder="Example: Another job is taking longer than planned."
                      className="mt-2 w-full resize-none rounded-xl border border-line bg-elevated/40 p-3 text-sm text-ink placeholder:text-muted focus:border-primary focus:outline-none"
                    />

                    <div className="mt-1 text-right text-xs text-muted">
                      {declineReason.length}/500
                    </div>

                    <div className="mt-3 flex gap-3">
                      <button
                        type="button"
                        onClick={() => handleRespond("Declined")}
                        disabled={acting}
                        className="flex-1 rounded-xl bg-amber-500 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {acting ? "Saving..." : "Confirm Decline"}
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowDeclineBox(false)}
                        disabled={acting}
                        className="flex-1 rounded-xl border border-line py-3 font-semibold text-ink transition hover:bg-elevated disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </Card>
            )}

            {/* Declined message */}
            {workStatus === "Assigned" && response === "Declined" && (
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-center text-sm text-amber-400">
                You declined this job. Admin has been informed.
              </div>
            )}

            {/* Photo loading error */}
            {photoLoadError && (
              <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                Unable to load job photos. Please refresh and try again.
              </p>
            )}

            {/* Before photo upload (only after Accept) */}
            {workStatus === "Assigned" &&
              response === "Accepted" &&
              !beforeUploaded &&
              !photoLoadError && (
                <Card title="Before photo" subtitle="Upload a Before photo to start work.">
                  <PhotoUploader
                    bookingId={bookingId}
                    stage="Before"
                    onUploaded={handlePhotoUploaded}
                  />
                </Card>
              )}

            {/* In Progress photo upload */}
            {workStatus === "In Progress" && !inProgressUploaded && (
              <Card
                title="Progress photo"
                subtitle="Upload a progress photo after completing approximately half of the work."
              >
                <PhotoUploader
                  bookingId={bookingId}
                  stage="In Progress"
                  onUploaded={handlePhotoUploaded}
                />
              </Card>
            )}

            {/* After photo upload */}
            {workStatus === "In Progress" &&
              inProgressUploaded &&
              !afterUploaded && (
                <Card
                  title="After photo"
                  subtitle="Upload an After photo when the work is fully finished."
                >
                  <PhotoUploader
                    bookingId={bookingId}
                    stage="After"
                    onUploaded={handlePhotoUploaded}
                  />
                </Card>
              )}

            {/* Start Work (only after Accept) */}
            {workStatus === "Assigned" && response === "Accepted" && (
              <button
                type="button"
                onClick={handleStart}
                disabled={!beforeUploaded || photoLoadError || acting}
                className="w-full rounded-xl bg-primary py-3.5 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {acting ? "Starting..." : "Start Work"}
              </button>
            )}

            {/* Completion Gate status */}
            {workStatus === "In Progress" && (
              <Card title="Completion requirements">
                {gateError && (
                  <p className="text-sm text-red-400">
                    Unable to verify completion requirements. Please refresh and try
                    again.
                  </p>
                )}

                {!gateError && gateLoading && (
                  <p className="text-sm text-muted">
                    Checking completion requirements...
                  </p>
                )}

                {!gateError && !gateLoading && completionGate && (
                  <>
                    {completionGate.allowed ? (
                      <p className="text-sm text-teal">
                        All completion requirements are satisfied.
                      </p>
                    ) : (
                      <div className="space-y-2">
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
              </Card>
            )}

            {/* Complete Work */}
            {workStatus === "In Progress" && (
              <button
                type="button"
                onClick={handleComplete}
                disabled={!canComplete}
                className="w-full rounded-xl bg-teal py-3.5 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {acting ? "Completing..." : "Complete Work"}
              </button>
            )}

            {/* Error from the server */}
            {actionError && (
              <p
                role="alert"
                className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-center text-sm text-red-400"
              >
                {actionError}
              </p>
            )}

            {/* Work completed message */}
            {workStatus === "Completed" && (
              <div className="rounded-2xl border border-teal/30 bg-teal/10 p-4 text-center font-semibold text-teal">
                Work Completed Successfully
              </div>
            )}

            {/* Notes and incident logs */}
            <NotesPanel bookingId={bookingId} onSaved={loadCompletionGate} />
          </div>
        </div>
      </div>
    </main>
  );
}

export default JobDetails;