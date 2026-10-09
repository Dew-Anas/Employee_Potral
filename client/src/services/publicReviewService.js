import api from "./api";

export const getApprovedReviews = async () => {
  const response = await api.get(
    "/reviews/approved"
  );

  return response.data;
};