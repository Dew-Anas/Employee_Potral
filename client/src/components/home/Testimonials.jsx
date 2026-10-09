import { useEffect, useState } from "react";
import ReviewCard from "./ReviewCard";
import { getApprovedReviews } from "../../services/publicReviewService";

const Testimonials = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReviews = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getApprovedReviews();

        setReviews(
          data.reviews || data.data || []
        );
      } catch (error) {
        console.error(
          "Failed to load approved reviews:",
          error
        );

        setError(
          "Unable to load customer reviews."
        );
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, []);

  return (
    <section className="bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Customer Reviews
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
            What Our Customers Say
          </h2>

          <p className="mt-4 text-slate-600">
            See what customers have shared about their
            ServicePro experience.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-52 animate-pulse rounded-2xl bg-slate-200"
              />
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="mt-10 rounded-xl border border-red-200 bg-red-50 p-5 text-center text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Empty */}
        {!loading &&
          !error &&
          reviews.length === 0 && (
            <div className="mt-10 rounded-xl border border-slate-200 bg-white p-8 text-center">
              <p className="text-sm text-slate-500">
                Customer reviews will appear here once
                they are approved.
              </p>
            </div>
          )}

        {/* Reviews */}
        {!loading &&
          !error &&
          reviews.length > 0 && (
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {reviews.map((review) => (
                <ReviewCard
                  key={review._id || review.id}
                  review={review}
                />
              ))}
            </div>
          )}
      </div>
    </section>
  );
};

export default Testimonials;