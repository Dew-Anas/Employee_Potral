export const requestStatuses = {
  SUBMITTED: "submitted",
  UNDER_REVIEW: "under_review",
  QUOTATION_SENT: "quotation_sent",
  ACCEPTED: "accepted",
  BOOKING_CONFIRMED: "booking_confirmed",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

export const getStatusLabel = (status) => {
  const labels = {
    submitted: "Submitted",
    under_review: "Under Review",
    quotation_sent: "Quotation Sent",
    accepted: "Accepted",
    booking_confirmed: "Booking Confirmed",
    in_progress: "In Progress",
    completed: "Completed",
    cancelled: "Cancelled",
  };

  return labels[status] || "Unknown";
};