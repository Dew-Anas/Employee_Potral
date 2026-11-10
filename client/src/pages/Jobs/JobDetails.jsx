
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  LuArrowLeft,
  LuCalendarClock,
  LuMapPin,
  LuPhone,
  LuUserRound,
} from "react-icons/lu";

import { getJobById } from "../../services/jobService";
import { getPhotos } from "../../services/photoService";
import PhotoUploader from "../../components/photos/PhotoUploader";

function JobDetails() {
  const { id } = useParams();

  // TEMP-DB: Replace with real booking ID from API later
  const bookingId = "6af1aa719cc38c80aa33ee4f";

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const [workStatus, setWorkStatus] = useState("Assigned");

  const [photos, setPhotos] = useState([]);
  const [photosLoading, setPhotosLoading] = useState(true);
  const [photoLoadError, setPhotoLoadError] = useState(false);

  // Load job details
  useEffect(() => {
    getJobById(id)
      .then(setJob)
      .catch((error) => {
        console.error("Failed to load job:", error);
        setJob(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Load uploaded photos from database
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

  // Check photo stages
  const beforeUploaded = photos.some(
    (photo) => photo.stage === "Before"
  );

  const inProgressUploaded = photos.some(
    (photo) => photo.stage === "In Progress"
  );

  const afterUploaded = photos.some(
    (photo) => photo.stage === "After"
  );

  // Calculate work progress
  const progress = afterUploaded
    ? 100
    : inProgressUploaded
    ? 50
    : 0;

  // Completion requirement
  const canComplete =
    workStatus === "In Progress" &&
    afterUploaded;

  // Loading state
  if (loading || photosLoading) {
    return (
      <main className="min-h-screen bg-page p-6 text-muted">
        Loading job...
      </main>
    );
  }

  // Job not found
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

        {/* Photo loading error */}
        {photoLoadError && (
          <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
            Unable to load job photos. Please refresh and try again.
          </p>
        )}

        {/* Before photo */}
        {workStatus === "Assigned" && !beforeUploaded && !photoLoadError && (
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

        {/* Before photo uploaded message */}
        {beforeUploaded && (
          <p className="mt-4 text-sm text-teal">
            Before photo uploaded
          </p>
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

        {/* In Progress photo */}
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

        {inProgressUploaded && (
          <p className="mt-4 text-sm text-teal">
             In Progress photo uploaded — 50% complete
          </p>
        )}

        {/* After photo */}
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

        {afterUploaded && (
          <p className="mt-4 text-sm text-teal">
            After photo uploaded — 100% complete
          </p>
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

        {workStatus === "Completed" && (
          <div className="mt-6 rounded-xl border border-teal/30 bg-teal/10 p-4 text-center text-teal">
            Work Completed Successfully
          </div>
        )}

      </div>
    </main>
  );
}

export default JobDetails;
