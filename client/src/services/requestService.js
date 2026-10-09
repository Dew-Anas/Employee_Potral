import api from "./api";

export const createRequest = async (requestData) => {
  const response = await api.post("/requests", requestData);
  return response.data;
};

export const getMyRequests = async () => {
  const response = await api.get("/requests/my");
  return response.data;
};

export const getRequestById = async (requestId) => {
  const response = await api.get(`/requests/${requestId}`);
  return response.data;
};

export const cancelRequest = async (requestId, reason) => {
  const response = await api.patch(`/requests/${requestId}/cancel`, {
    reason,
  });
  return response.data;
};
