


import api from "./api";

// GET: Fetch booking checklist
export const getChecklist = async (bookingId) => {
  const res = await api.get(`/checklist/${bookingId}`);
  return res.data;
};

// PUT: Complete a checklist item
export const completeChecklistItem = async (itemId) => {
  const res = await api.put(
    `/checklist/item/${itemId}/complete`
  );

  return res.data;
};
