import { useEffect, useState } from "react";

import {
  getJobPhotos,
} from "../../services/employeeService";

const JobPhotoGallery = ({ bookingId }) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPhotos = async () => {
    try {
      const data =
        await getJobPhotos(bookingId);

      setPhotos(data.photos || []);
    } catch (error) {
      console.error(
        "Failed to load photos:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPhotos();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="mt-6 text-sm text-gray-500">
        Loading photos...
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h4 className="font-semibold">
        Uploaded Photos ({photos.length})
      </h4>

      {photos.length === 0 ? (
        <p className="mt-3 text-sm text-gray-500">
          No photos uploaded yet.
        </p>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {photos.map((photo) => (
            <div
              key={photo._id}
              className="overflow-hidden rounded-lg border"
            >
              <img
                src={`http://localhost:5000${photo.imageUrl}`}
                alt={photo.caption || "Job photo"}
                className="h-48 w-full object-cover"
              />

              <div className="p-3">
                <p className="text-xs font-medium uppercase text-gray-500">
                  {photo.type}
                </p>

                {photo.caption && (
                  <p className="mt-1 text-sm">
                    {photo.caption}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobPhotoGallery;