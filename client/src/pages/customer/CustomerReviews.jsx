import { useEffect, useState } from "react";

import {
  getMyReviews,
} from "../../services/reviewService";

const CustomerReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const data = await getMyReviews();

        setReviews(data.reviews || []);
      } catch (error) {
        console.error(
          "Failed to load reviews:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        Loading reviews...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-5xl">

        <h1 className="text-2xl font-bold">
          My Reviews
        </h1>

        <p className="mt-1 text-gray-500">
          View the feedback you have submitted.
        </p>

        {reviews.length === 0 ? (
          <div className="mt-6 rounded-xl bg-white p-10 text-center shadow-sm">
            <h2 className="font-semibold">
              No reviews yet
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Your submitted reviews will appear here.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">

            {reviews.map((review) => (
              <div
                key={review._id}
                className="rounded-xl bg-white p-5 shadow-sm"
              >

                <div className="flex items-center justify-between">
                  <div className="text-xl">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(
                      5 - review.rating
                    )}
                  </div>

                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs">
                    {review.status}
                  </span>
                </div>

                <p className="mt-4 text-gray-700">
                  {review.comment}
                </p>

                {review.booking && (
                  <p className="mt-3 text-sm text-gray-500">
                    Booking:{" "}
                    {review.booking._id}
                  </p>
                )}

              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerReviews;