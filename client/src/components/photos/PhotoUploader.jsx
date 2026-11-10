
import { useEffect, useState } from "react";
import { LuCamera } from "react-icons/lu";
import { uploadPhoto } from "../../services/photoService";
const MAX_SIZE = 2 * 1024 * 1024; // 1MB

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
      setError("Only JPG or PNG images are allowed");
      e.target.value = "";
      return;
    }

    if (chosen.size > MAX_SIZE) {
      setError("Image must be 1MB or smaller");
      e.target.value = "";
      return;
    }

    setFile(chosen);
    setPreviewUrl(URL.createObjectURL(chosen));
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
      setError(
        err.response?.data?.message || "Failed to upload photo"
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-line bg-surface p-4">
      <h2 className="mb-3 font-heading text-lg text-ink">
        {stage} photo
      </h2>

      {previewUrl ? (
        <img
          src={previewUrl}
          alt={`${stage} preview`}
          className="mb-3 max-h-64 w-full rounded-xl object-cover"
        />
      ) : (
        <label className="mb-3 flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed border-line bg-elevated p-6 text-sm text-muted">
          <LuCamera size={24} />
          Tap to take or choose a photo

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
        <p className="mb-3 rounded-lg border border-line bg-elevated p-3 text-sm text-ink">
          {error}
        </p>
      )}

      {file && (
        <button
          type="button"
          onClick={handleUpload}
          disabled={uploading}
          className="w-full rounded-xl bg-primary py-3 font-semibold text-white disabled:opacity-50"
        >
          {uploading ? "Uploading..." : `Upload ${stage} photo`}
        </button>
      )}
    </div>
  );
}

export default PhotoUploader;
