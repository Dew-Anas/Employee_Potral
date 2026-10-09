import { useState } from "react";

const ImageUpload = ({ onChange }) => {
  const [preview, setPreview] = useState(null);

  const handleChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      alert("Image must be smaller than 5MB.");
      return;
    }

    setPreview(URL.createObjectURL(file));

    onChange?.(file);
  };

  return (
    <div>
      <label className="block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 p-6 text-center hover:border-blue-500">
        <input
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />

        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="mx-auto h-48 rounded-lg object-cover"
          />
        ) : (
          <>
            <p className="font-medium text-slate-700">
              Upload Image
            </p>

            <p className="mt-1 text-sm text-slate-500">
              PNG, JPG or JPEG — max 5MB
            </p>
          </>
        )}
      </label>
    </div>
  );
};

export default ImageUpload;