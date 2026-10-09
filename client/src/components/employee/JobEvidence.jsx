import { useState } from "react";
import { ImagePlus, Trash2 } from "lucide-react";

const JobEvidence = ({ onChange }) => {
  const [photos, setPhotos] = useState([]);
  const [notes, setNotes] = useState("");

  const hasPhotos = photos.length > 0;

  const handlePhotoChange = (event) => {
    const files = Array.from(event.target.files || []);

    const imageFiles = files.filter((file) =>
      file.type.startsWith("image/")
    );

    const validFiles = imageFiles.filter(
      (file) => file.size <= 5 * 1024 * 1024
    );

    const newPhotos = validFiles.map((file) => ({
      id: `${file.name}-${file.lastModified}`,
      file,
      preview: URL.createObjectURL(file),
    }));

    setPhotos((previousPhotos) => [
      ...previousPhotos,
      ...newPhotos,
    ]);

    setPhotos((previousPhotos) => {
    const updatedPhotos = [
        ...previousPhotos,
        ...newPhotos,
    ];

    onChange?.({
        photos: updatedPhotos,
        notes,
    });

    return updatedPhotos;
    });

    event.target.value = "";
  };

  const removePhoto = (photoId) => {
    setPhotos((previousPhotos) =>
      previousPhotos.filter((photo) => photo.id !== photoId)
    );
  };

  return (
    <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          Job Photos & Notes
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Add photos and notes to document the service work.
        </p>
      </div>

      {/* Photo Upload */}
      <div className="mt-5">
        <label className="block text-sm font-medium text-slate-700">
          Service Photos
        </label>

        <label className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center transition hover:border-blue-500 hover:bg-blue-50">
          <ImagePlus
            size={28}
            className="text-slate-400"
          />

          <p className="mt-2 text-sm font-medium text-slate-700">
            Upload service photos
          </p>

          <p className="mt-1 text-xs text-slate-500">
            PNG, JPG or JPEG — maximum 5MB per image
          </p>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotoChange}
            className="hidden"
          />
        </label>
      </div>

      {/* Photo Preview */}
      {photos.length > 0 && (
        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="relative overflow-hidden rounded-xl border border-slate-200"
            >
              <img
                src={photo.preview}
                alt="Service evidence"
                className="h-32 w-full object-cover"
              />

              <button
                type="button"
                onClick={() => removePhoto(photo.id)}
                className="absolute right-2 top-2 rounded-full bg-white p-2 text-red-600 shadow hover:bg-red-50"
                aria-label="Remove photo"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Notes */}
      <div className="mt-6">
        <label
          htmlFor="job-notes"
          className="block text-sm font-medium text-slate-700"
        >
          Work Notes
        </label>

        <textarea
          id="job-notes"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          rows={5}
          placeholder="Describe the work completed, issues found, materials used, or any important information..."
          className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        <p className="mt-1 text-xs text-slate-500">
          {notes.length} characters
        </p>
      </div>
    </div>
  );
};

export default JobEvidence;