import { useState } from "react";

import {
  uploadJobPhoto,
} from "../../services/employeeService";

const JobPhotoUpload = ({
  bookingId,
  onUploaded,
}) => {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [type, setType] = useState("during");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();

    setError("");

    if (!file) {
      setError("Please select a photo.");
      return;
    }

    try {
      setUploading(true);

      await uploadJobPhoto(
        bookingId,
        file,
        caption,
        type
      );

      setFile(null);
      setCaption("");
      setType("during");

      // Reset file input
      e.target.reset();

      if (onUploaded) {
        onUploaded();
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to upload photo."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mt-8 rounded-xl border bg-white p-5">
      <h3 className="text-lg font-semibold">
        Job Photos
      </h3>

      <p className="mt-1 text-sm text-gray-500">
        Upload photos as evidence of service execution.
      </p>

      {error && (
        <div className="mt-4 rounded-lg bg-red-100 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleUpload}
        className="mt-5 space-y-4"
      >
        {/* Photo */}

        <div>
          <label className="mb-2 block text-sm font-medium">
            Photo
          </label>

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) =>
              setFile(e.target.files[0])
            }
            className="block w-full rounded-lg border p-2 text-sm"
          />
        </div>

        {/* Type */}

        <div>
          <label className="mb-2 block text-sm font-medium">
            Photo Type
          </label>

          <select
            value={type}
            onChange={(e) =>
              setType(e.target.value)
            }
            className="w-full rounded-lg border p-2"
          >
            <option value="before">
              Before Service
            </option>

            <option value="during">
              During Service
            </option>

            <option value="after">
              After Service
            </option>
          </select>
        </div>

        {/* Caption */}

        <div>
          <label className="mb-2 block text-sm font-medium">
            Caption
          </label>

          <textarea
            value={caption}
            onChange={(e) =>
              setCaption(e.target.value)
            }
            placeholder="Describe this photo..."
            rows={3}
            className="w-full rounded-lg border p-3"
          />
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="rounded-lg bg-black px-5 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {uploading
            ? "Uploading..."
            : "Upload Photo"}
        </button>
      </form>
    </div>
  );
};

export default JobPhotoUpload;