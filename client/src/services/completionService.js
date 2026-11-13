
import api from "./api";

export const getCompletionGate = async (bookingId) => {
  // TYPE 1
  const res = await api.get(`/completion/${bookingId}/gate`);

  // TYPE 2
  return res.data;
};