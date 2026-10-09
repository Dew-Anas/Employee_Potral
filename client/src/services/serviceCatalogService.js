import api from "./api";

export const getServices = async () => {
  const response = await api.get("/services");
  return response.data;
};

export const getServiceById = async (serviceId) => {
  const response = await api.get(`/services/${serviceId}`);
  return response.data;
};

export const createService = async (payload) => {
  const response = await api.post("/services", payload);
  return response.data;
};

export const updateService = async (serviceId, payload) => {
  const response = await api.put(`/services/${serviceId}`, payload);
  return response.data;
};

export const deleteService = async (serviceId) => {
  const response = await api.delete(`/services/${serviceId}`);
  return response.data;
};
