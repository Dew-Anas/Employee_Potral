// Job photo picker + uploader (Before / In Progress / After). UI polish only.
// Upload logic and API call are unchanged. Size limit now matches the server (3MB).

import { useEffect, useState } from "react";
import { LuCamera, LuX } from "react-icons/lu";
import { uploadPhoto } from "../../services/photoService";

const MAX_MB = 3;
const MAX_SIZE = MAX_MB * 1024 * 1024;

function PhotoUploader({ bookingId, stage, onUploaded }) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  // Clean up temporary preview URL
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Select and validate photo
  const handleChoose = (e) => {
    const chosen = e.target.files[0];

    setError("");

    if (!chosen) return;

    if (!["image/jpeg", "image/png"].includes(chosen.type)) {
      setError("Only JPG or PNG images are allowed.");
      e.target.value = "";
      return;
    }

    if (chosen.size > MAX_SIZE) {
      setError(`Image must be ${MAX_MB}MB or smaller.`);
      e.target.value = "";
      return;
    }

    setFile(chosen);
    setPreviewUrl(URL.createObjectURL(chosen));
  };

  // Discard the chosen photo before uploading
  const handleClear = () => {
    if (uploading) return;
    setFile(null);
    setPreviewUrl("");
    setError("");
  };

  // Upload photo to backend
  const handleUpload = async () => {
    if (!file || uploading) return;

    try {
      setUploading(true);
      setError("");

      await uploadPhoto(bookingId, stage, file);

      onUploaded?.();

      setFile(null);
      setPreviewUrl("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload photo. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="rounded-2xl border border-line bg-surface p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="font-heading text-base font-semibold text-ink">{stage} photo</h2>
        <span className="text-xs text-muted">JPG or PNG, up to {MAX_MB}MB</span>
      </div>

      {previewUrl ? (
        <div className="relative mb-3 overflow-hidden rounded-xl border border-line">
          <img
            src={previewUrl}
            alt={`${stage} preview`}
            className="max-h-64 w-full object-cover"
          />
          <button
            type="button"
            onClick={handleClear}
            disabled={uploading}
            aria-label="Remove chosen photo"
            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80 disabled:opacity-50"
          >
            <LuX size={16} />
          </button>
        </div>
      ) : (
        <label className="mb-3 flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed border-line bg-elevated/50 px-4 py-7 text-center text-sm text-muted transition hover:border-primary/60 hover:bg-elevated">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
            <LuCamera size={22} />
          </span>
          <span className="font-medium text-ink">Take or choose a photo</span>
          <span className="text-xs">Tap here to open the camera or gallery</span>

          <input
            type="file"
            accept="image/jpeg,image/png"
            capture="environment"
            onChange={handleChoose}
            className="hidden"
          />
        </label>
      )}

      {error && (
        <p
          role="alert"
          className="mb-3 rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2.5 text-sm text-red-300"
        >
          {error}
        </p>
      )}

      {file && (
        <button
          type="button"
          onClick={handleUpload}
          disabled={uploading}
          className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {uploading ? "Uploading..." : `Upload ${stage} photo`}
        </button>
      )}
    </section>
  );
}

export default PhotoUploader;