import api from "./api";

export const getAdminDashboard = async () => {
  const response = await api.get("/admin/dashboard");
  return response.data;
};

export const getAllRequests = async () => {
  const response = await api.get("/requests");
  return response.data;
};

export const getAdminRequestById = async (requestId) => {
  const response = await api.get(`/requests/admin/${requestId}`);
  return response.data;
};

export const createQuotation = async (payload) => {
  const response = await api.post("/quotes", payload);
  return response.data;
};

export const getAllQuotations = async () => {
  const response = await api.get("/quotes");
  return response.data;
};

export const getAllBookings = async () => {
  const response = await api.get("/bookings");
  return response.data;
};

export const assignEmployee = async (bookingId, employeeId) => {
  const response = await api.patch(`/bookings/${bookingId}/assign`, {
    employeeId,
  });
  return response.data;
};

export const getEmployees = async () => {
  const response = await api.get("/employees");
  return response.data;
};

export const createEmployee = async (payload) => {
  const response = await api.post("/employees", payload);
  return response.data;
};

export const getAllInvoices = async () => {
  const response = await api.get("/invoices");
  return response.data;
};

export const getAllReviews = async () => {
  const response = await api.get("/reviews");
  return response.data;
};

export const updateReviewStatus = async (reviewId, status) => {
  const response = await api.patch(`/reviews/${reviewId}/status`, { status });
  return response.data;
};

export const addChecklistItem = async (payload) => {
  const response = await api.post("/checklists", payload);
  return response.data;
};
