export const bookingStatuses = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  ASSIGNED: "assigned",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

export const getBookingStatusLabel = (status) => {
  const labels = {
    pending: "Pending",
    confirmed: "Confirmed",
    assigned: "Employee Assigned",
    in_progress: "In Progress",
    completed: "Completed",
    cancelled: "Cancelled",
  };

  return labels[status] || "Unknown";
};