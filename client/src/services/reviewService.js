import api from "./api";

// Submit review
export const submitReview = async (
  bookingId,
  rating,
  comment
) => {
  const response = await api.post(
    "/reviews",
    {
      bookingId,
      rating,
      comment,
    }
  );

  return response.data;
};

// Get customer's reviews
export const getMyReviews = async () => {
  const response = await api.get(
    "/reviews/my"
  );

  return response.data;
};