import api from "./api";

export const getMyInvoices = async () => {
  const response = await api.get("/invoices/my");
  return response.data;
};

export const getInvoiceDetails = async (invoiceId) => {
  const response = await api.get(`/invoices/${invoiceId}`);
  return response.data;
};

export const payInvoice = async (invoiceId, method = "online") => {
  const response = await api.patch(`/invoices/${invoiceId}/pay`, { method });
  return response.data;
};
