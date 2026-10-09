export const sopTaskStatuses = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
};

export const getSopTaskStatusLabel = (status) => {
  const labels = {
    pending: "Pending",
    in_progress: "In Progress",
    completed: "Completed",
  };

  return labels[status] || "Unknown";
};