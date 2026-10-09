import api from "./api";

export const createBooking = async (bookingData) => {
  const response = await api.post("/bookings", bookingData);
  return response.data;
};

export const getMyBookings = async () => {
  const response = await api.get("/bookings/my");
  return response.data;
};

export const getBookingById = async (bookingId) => {
  const response = await api.get(`/bookings/${bookingId}`);
  return response.data;
};

export const cancelBooking = async (bookingId, reason) => {
  const response = await api.patch(`/bookings/${bookingId}/cancel`, {
    reason,
  });
  return response.data;
};

export const signOffBooking = async (bookingId) => {
  const response = await api.patch(`/bookings/${bookingId}/sign-off`);
  return response.data;
};
