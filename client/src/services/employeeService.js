import api from "./api";


// ==========================================
// GET MY ASSIGNED BOOKINGS
// ==========================================

export const getMyBookings = async () => {
  const response = await api.get(
    "/employee/bookings/my"
  );

  return response.data;
};


// ==========================================
// GET BOOKING DETAILS
// ==========================================

export const getBookingDetails = async (bookingId) => {
  const response = await api.get(
    `/employee/bookings/${bookingId}`
  );

  return response.data;
};


// ==========================================
// START SERVICE
// ==========================================

export const startService = async (bookingId) => {
  const response = await api.patch(
    `/employee/bookings/${bookingId}/start`
  );

  return response.data;
};


// ==========================================
// CLOCK IN
// ==========================================

export const clockIn = async (bookingId) => {
  const response = await api.patch(
    `/employee/bookings/${bookingId}/clock-in`
  );

  return response.data;
};


// ==========================================
// CLOCK OUT
// ==========================================

export const clockOut = async (bookingId) => {
  const response = await api.patch(
    `/employee/bookings/${bookingId}/clock-out`
  );

  return response.data;
};


// ==========================================
// UPDATE NOTES
// ==========================================

export const updateJobNotes = async (
  bookingId,
  notes
) => {
  const response = await api.patch(
    `/employee/bookings/${bookingId}/notes`,
    {
      notes,
    }
  );

  return response.data;
};


// ==========================================
// GET CHECKLIST
// ==========================================

export const getChecklist = async (bookingId) => {
  const response = await api.get(
    `/checklists/booking/${bookingId}`
  );

  return response.data;
};


// ==========================================
// COMPLETE CHECKLIST ITEM
// ==========================================

export const completeChecklistItem = async (
  itemId
) => {
  const response = await api.patch(
    `/checklists/${itemId}/complete`
  );

  return response.data;
};


// ==========================================
// GET JOB PHOTOS
// ==========================================

export const getJobPhotos = async (bookingId) => {
  const response = await api.get(
    `/job-photos/booking/${bookingId}`
  );

  return response.data;
};


// ==========================================
// UPLOAD JOB PHOTO
// ==========================================

export const uploadJobPhoto = async (
  bookingId,
  file,
  caption,
  type
) => {
  const formData = new FormData();

  formData.append("photo", file);
  formData.append("caption", caption || "");
  formData.append("type", type || "during");

  const response = await api.post(
    `/job-photos/booking/${bookingId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};


// ==========================================
// COMPLETE SERVICE
// ==========================================

export const completeService = async (bookingId) => {
  const response = await api.patch(
    `/completion/booking/${bookingId}`
  );

  return response.data;
};