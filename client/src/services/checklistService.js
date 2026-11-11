
// Import the shared Axios instance.
// It automatically attaches the employee's JWT token.
import api from "./api";

// GET /api/checklists/:bookingId
// Load checklist items for a specific booking.
export const getChecklist = async (bookingId) => {
  const res = await api.get(`/checklists/${bookingId}`);

   // Return the response data to the React component.
  return res.data;
};

// PATCH /api/checklists/:itemId
// Update a checklist item's status.
export const updateChecklistItem = async (itemId, status) => {
  const res = await api.patch(`/checklists/${itemId}`, {
    status,
  });

  // Return the updated checklist item.
  return res.data;
};