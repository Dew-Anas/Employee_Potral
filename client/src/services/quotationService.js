import api from "./api";

export const getMyQuotations = async () => {
  const response = await api.get("/quotes/my");

  return response.data;
};

export const getQuotationById = async (quotationId) => {
  const response = await api.get(
    `/quotes/${quotationId}`
  );

  return response.data;
};

export const acceptQuotation = async (quotationId) => {
  const response = await api.patch(
    `/quotes/${quotationId}/accept`
  );

  return response.data;
};

export const rejectQuotation = async (quotationId) => {
  const response = await api.patch(
    `/quotes/${quotationId}/reject`
  );

  return response.data;
};