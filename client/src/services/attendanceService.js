import api from "./api";

export const clockIn = async (bookingId) => {
  const response = await api.post(
    `/employee/attendance/${bookingId}/clock-in`
  );

  return response.data;
};

export const clockOut = async (bookingId) => {
  const response = await api.post(
    `/employee/attendance/${bookingId}/clock-out`
  );

  return response.data;
};

export const getBookingAttendance = async (bookingId) => {
  const response = await api.get(
    `/employee/attendance/${bookingId}`
  );

  return response.data;
};