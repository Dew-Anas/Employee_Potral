
// photoService: API calls for job photos (Before / In Progress / After).
// Used by: photo upload UI in JobDetails.
// Backend: routes/jobPhotoRoutes.js (/api/photos).

import api from "./api";

// POST /api/photos/:bookingId
export const uploadPhoto = async (bookingId, stage, file) => {
  const formData = new FormData();

  formData.append("photo", file);
  formData.append("stage", stage);

  // Browser automatically sets multipart boundary.
  const res = await api.post(`/photos/${bookingId}`, formData);

  return res.data;
};

// GET /api/photos/:bookingId
export const getPhotos = async (bookingId) => {
  const res = await api.get(`/photos/${bookingId}`);

  return res.data;
};

// GET /api/photos/image/:photoId
export const getPhotoBlob = async (photoId) => {
  const res = await api.get(`/photos/image/${photoId}`, {
    responseType: "blob",
  });

  return res.data;
};
